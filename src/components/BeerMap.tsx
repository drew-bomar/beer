"use client";

import { useEffect, useRef, useState } from "react";
import { AttributionControl, Map as MapLibreMap } from "maplibre-gl";
import type {
  GeoJSONSource,
  MapLayerMouseEvent,
  MapLayerTouchEvent,
  MapMouseEvent,
  MapTouchEvent,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { LngLat } from "@/lib/types";
import { STL_FALLBACK } from "@/lib/types";
import { circleRing } from "@/lib/geo";

const EMPTY_FC: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };
const CLOSE_RING_PX = 28; // tap-within distance of the first vertex that auto-closes

/** A venue pin: label is the $/12oz shown under the dot. */
export type MapPin = { id: string; lng: number; lat: number; label: string };

type BeerMapProps = {
  drawMode: boolean;
  vertices: LngLat[];
  ringClosed: boolean;
  radiusCircle: { center: LngLat; radiusMiles: number } | null;
  pins: MapPin[];
  selectedVenueId: string | null;
  onReady: (map: MapLibreMap) => void;
  onAddVertex: (p: LngLat) => void;
  onCloseRing: () => void;
  onMoveVertex: (index: number, p: LngLat, done: boolean) => void;
  onSelectVenue: (id: string) => void;
};

export default function BeerMap(props: BeerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);
  // Event handlers read the latest props through this ref so they never go stale.
  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  });

  useEffect(() => {
    const map = new MapLibreMap({
      container: containerRef.current!,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: STL_FALLBACK.center,
      zoom: STL_FALLBACK.zoom,
      attributionControl: false,
    });
    // MapLibre's own AttributionControl (OSM credit comes from the style),
    // top-right so the bottom results sheet never hides it.
    map.addControl(new AttributionControl({ compact: true }), "top-right");
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __beerMap?: MapLibreMap }).__beerMap = map;
      map.on("error", (e) => console.error("[beer-map]", e.error?.message ?? e));
    }

    map.on("load", () => {
      // Coverage districts: subtle shaded fill so users see where Beer is live.
      map.addSource("coverage", { type: "geojson", data: EMPTY_FC });
      map.addLayer({
        id: "coverage-fill",
        type: "fill",
        source: "coverage",
        paint: { "fill-color": "#f59e0b", "fill-opacity": 0.08 },
      });
      map.addLayer({
        id: "coverage-line",
        type: "line",
        source: "coverage",
        paint: {
          "line-color": "#d97706",
          "line-opacity": 0.55,
          "line-width": 1.5,
          "line-dasharray": [2, 2],
        },
      });
      fetch("/api/coverage")
        .then((r) => (r.ok ? r.json() : null))
        .then((fc) => {
          const src = map.getSource("coverage") as GeoJSONSource | undefined;
          if (fc && src) src.setData(fc);
        })
        .catch(() => {});

      // Radius search ring.
      map.addSource("radius", { type: "geojson", data: EMPTY_FC });
      map.addLayer({
        id: "radius-fill",
        type: "fill",
        source: "radius",
        paint: { "fill-color": "#2563eb", "fill-opacity": 0.06 },
      });
      map.addLayer({
        id: "radius-line",
        type: "line",
        source: "radius",
        paint: { "line-color": "#2563eb", "line-opacity": 0.45, "line-width": 1.5 },
      });

      // Draw tool: fill (closed), running polyline, draggable vertices.
      map.addSource("draw-fill", { type: "geojson", data: EMPTY_FC });
      map.addSource("draw-line", { type: "geojson", data: EMPTY_FC });
      map.addSource("draw-verts", { type: "geojson", data: EMPTY_FC });
      map.addLayer({
        id: "draw-fill",
        type: "fill",
        source: "draw-fill",
        paint: { "fill-color": "#7c3aed", "fill-opacity": 0.1 },
      });
      map.addLayer({
        id: "draw-line",
        type: "line",
        source: "draw-line",
        paint: { "line-color": "#7c3aed", "line-width": 2.5 },
      });
      map.addLayer({
        id: "draw-verts",
        type: "circle",
        source: "draw-verts",
        paint: {
          "circle-radius": ["case", ["get", "first"], 9, 7],
          "circle-color": ["case", ["get", "first"], "#f59e0b", "#ffffff"],
          "circle-stroke-color": "#7c3aed",
          "circle-stroke-width": 2.5,
        },
      });

      // Venue pins, cheapest-per-12oz label underneath.
      map.addSource("venues", { type: "geojson", data: EMPTY_FC });
      map.addLayer({
        id: "venues-circles",
        type: "circle",
        source: "venues",
        paint: {
          "circle-radius": ["case", ["get", "selected"], 11, 8],
          "circle-color": ["case", ["get", "selected"], "#b45309", "#f59e0b"],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2.5,
        },
      });
      map.addLayer({
        id: "venues-labels",
        type: "symbol",
        source: "venues",
        layout: {
          "text-field": ["get", "label"],
          "text-font": ["Noto Sans Bold"],
          "text-size": 11,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#78350f",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1.5,
        },
      });

      setReady(true);
      propsRef.current.onReady(map);
    });

    // --- Tap handling: drop vertices in draw mode, select venues otherwise ---
    map.on("click", (e: MapMouseEvent) => {
      const p = propsRef.current;
      if (p.drawMode) {
        if (p.ringClosed) return; // adjust via dragging; taps do nothing
        // A tap on an existing vertex never adds a new one; on the first
        // vertex (with 3+ points) it closes the ring.
        const nearVerts = map.queryRenderedFeatures(
          [
            [e.point.x - 12, e.point.y - 12],
            [e.point.x + 12, e.point.y + 12],
          ],
          { layers: ["draw-verts"] },
        );
        if (nearVerts.length > 0) {
          if (nearVerts.some((f) => f.properties?.first) && p.vertices.length >= 3) {
            p.onCloseRing();
          }
          return;
        }
        if (p.vertices.length >= 3) {
          const first = map.project(p.vertices[0]);
          const dx = first.x - e.point.x;
          const dy = first.y - e.point.y;
          if (Math.hypot(dx, dy) < CLOSE_RING_PX) {
            p.onCloseRing();
            return;
          }
        }
        p.onAddVertex([e.lngLat.lng, e.lngLat.lat]);
        return;
      }
      const hits = map.queryRenderedFeatures(
        [
          [e.point.x - 8, e.point.y - 8],
          [e.point.x + 8, e.point.y + 8],
        ],
        { layers: ["venues-circles"] },
      );
      if (hits[0]?.properties?.id) p.onSelectVenue(hits[0].properties.id as string);
    });

    // --- Vertex dragging (mouse + touch) ---
    const beginDrag = (e: MapLayerMouseEvent | MapLayerTouchEvent) => {
      const p = propsRef.current;
      if (!p.drawMode) return;
      const idx = e.features?.[0]?.properties?.idx;
      if (typeof idx !== "number") return;
      e.preventDefault(); // keep the map from panning under the finger

      const move = (ev: MapMouseEvent | MapTouchEvent) => {
        propsRef.current.onMoveVertex(idx, [ev.lngLat.lng, ev.lngLat.lat], false);
      };
      const finish = (ev: MapMouseEvent | MapTouchEvent) => {
        map.off("mousemove", move);
        map.off("touchmove", move);
        propsRef.current.onMoveVertex(idx, [ev.lngLat.lng, ev.lngLat.lat], true);
      };
      map.on("mousemove", move);
      map.once("mouseup", finish);
      map.on("touchmove", move);
      map.once("touchend", finish);
    };
    map.on("mousedown", "draw-verts", beginDrag);
    map.on("touchstart", "draw-verts", beginDrag);

    map.on("mouseenter", "venues-circles", () => {
      if (!propsRef.current.drawMode) map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "venues-circles", () => {
      if (!propsRef.current.drawMode) map.getCanvas().style.cursor = "";
    });

    mapRef.current = map;
    return () => {
      mapRef.current = null;
      setReady(false);
      map.remove();
    };
  }, []);

  // Crosshair cursor while drawing.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    map.getCanvas().style.cursor = props.drawMode ? "crosshair" : "";
  }, [props.drawMode, ready]);

  // Sync draw geometry.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const vertices = props.vertices;
    const ringClosed = props.ringClosed;

    const verts: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: vertices.map((v, i) => ({
        type: "Feature",
        properties: { idx: i, first: i === 0 && !ringClosed },
        geometry: { type: "Point", coordinates: v },
      })),
    };

    let line: GeoJSON.FeatureCollection = EMPTY_FC;
    let fill: GeoJSON.FeatureCollection = EMPTY_FC;
    if (vertices.length >= 2) {
      const coords = ringClosed ? [...vertices, vertices[0]] : vertices;
      line = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: coords },
          },
        ],
      };
    }
    if (ringClosed && vertices.length >= 3) {
      fill = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: { type: "Polygon", coordinates: [[...vertices, vertices[0]]] },
          },
        ],
      };
    }
    (map.getSource("draw-verts") as GeoJSONSource | undefined)?.setData(verts);
    (map.getSource("draw-line") as GeoJSONSource | undefined)?.setData(line);
    (map.getSource("draw-fill") as GeoJSONSource | undefined)?.setData(fill);
  }, [props.vertices, props.ringClosed, ready]);

  // Sync radius circle.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const src = map.getSource("radius") as GeoJSONSource | undefined;
    if (!src) return;
    if (!props.radiusCircle) {
      src.setData(EMPTY_FC);
      return;
    }
    const ring = circleRing(props.radiusCircle.center, props.radiusCircle.radiusMiles);
    src.setData({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: { type: "Polygon", coordinates: [ring] },
        },
      ],
    });
  }, [props.radiusCircle, ready]);

  // Sync venue pins.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    const src = map.getSource("venues") as GeoJSONSource | undefined;
    if (!src) return;
    src.setData({
      type: "FeatureCollection",
      features: props.pins.map((p) => ({
        type: "Feature",
        properties: {
          id: p.id,
          selected: p.id === props.selectedVenueId,
          label: p.label,
        },
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      })),
    });
  }, [props.pins, props.selectedVenueId, ready]);

  // h-full/w-full (not just inset-0): maplibre-gl.css sets `.maplibregl-map { position: relative }`
  // at equal specificity to Tailwind's `absolute`, and if it wins the cascade, inset-0 sizing goes
  // inert and the map initializes into a 0-height container (blank map, no tile requests).
  return <div ref={containerRef} className="absolute inset-0 h-full w-full" />;
}
