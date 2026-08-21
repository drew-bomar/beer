"use client";

import { useEffect, useRef, useState } from "react";
import { Map as MapLibreMap, NavigationControl, LngLatBounds, type GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@/lib/maplibre-setup";
import { LIBERTY_STYLE, STL_CENTER } from "./MapPicker";

/** A polygon = one outer ring of [lng, lat] pairs (unclosed; closing is implicit). */
export type Ring = [number, number][];

function featureCollection(polygons: Ring[], draft: Ring): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];
  for (const ring of polygons) {
    features.push({
      type: "Feature",
      properties: { kind: "polygon" },
      geometry: { type: "Polygon", coordinates: [[...ring, ring[0]]] },
    });
  }
  if (draft.length >= 2) {
    features.push({
      type: "Feature",
      properties: { kind: "draft-line" },
      geometry: { type: "LineString", coordinates: draft },
    });
  }
  for (const pt of draft) {
    features.push({
      type: "Feature",
      properties: { kind: "draft-point" },
      geometry: { type: "Point", coordinates: pt },
    });
  }
  return { type: "FeatureCollection", features };
}

/**
 * Multipolygon editor on OpenFreeMap Liberty tiles.
 * Click to add vertices; "Finish polygon" closes the ring and adds it to the
 * saved set. Multiple polygons form the multipolygon.
 */
export default function PolygonEditor({
  polygons,
  onChange,
}: {
  polygons: Ring[];
  onChange: (polygons: Ring[]) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [draft, setDraft] = useState<Ring>([]);
  const [mapReady, setMapReady] = useState(false);

  const dataRef = useRef(featureCollection(polygons, draft));

  useEffect(() => {
    dataRef.current = featureCollection(polygons, draft);
  }, [polygons, draft]);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new MapLibreMap({
      container: containerRef.current,
      style: LIBERTY_STYLE,
      center: STL_CENTER,
      zoom: 11,
      attributionControl: { compact: true },
    });
    map.addControl(new NavigationControl({ showCompass: false }));

    map.on("load", () => {
      map.addSource("editor", { type: "geojson", data: dataRef.current });
      map.addLayer({
        id: "editor-fill",
        type: "fill",
        source: "editor",
        filter: ["==", ["get", "kind"], "polygon"],
        paint: { "fill-color": "#d97706", "fill-opacity": 0.2 },
      });
      map.addLayer({
        id: "editor-outline",
        type: "line",
        source: "editor",
        filter: ["==", ["get", "kind"], "polygon"],
        paint: { "line-color": "#b45309", "line-width": 2 },
      });
      map.addLayer({
        id: "editor-draft-line",
        type: "line",
        source: "editor",
        filter: ["==", ["get", "kind"], "draft-line"],
        paint: { "line-color": "#2563eb", "line-width": 2, "line-dasharray": [2, 1] },
      });
      map.addLayer({
        id: "editor-draft-points",
        type: "circle",
        source: "editor",
        filter: ["==", ["get", "kind"], "draft-point"],
        paint: {
          "circle-radius": 5,
          "circle-color": "#2563eb",
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 1.5,
        },
      });

      // Fit the view to existing polygons when editing.
      const pts = dataRef.current.features
        .filter((f) => f.geometry.type === "Polygon")
        .flatMap((f) => (f.geometry as GeoJSON.Polygon).coordinates[0]);
      if (pts.length > 0) {
        const bounds = pts.reduce(
          (b, [lng, lat]) => b.extend([lng, lat]),
          new LngLatBounds(
            pts[0] as [number, number],
            pts[0] as [number, number],
          ),
        );
        map.fitBounds(bounds, { padding: 48, maxZoom: 15, duration: 0 });
      }
      setMapReady(true);
    });

    map.on("click", (e) => {
      setDraft((d) => [...d, [e.lngLat.lng, e.lngLat.lat]]);
    });

    mapRef.current = map;
    return () => {
      mapRef.current = null;
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    const src = mapRef.current?.getSource("editor") as GeoJSONSource | undefined;
    src?.setData(featureCollection(polygons, draft));
  }, [polygons, draft, mapReady]);

  const finishPolygon = () => {
    if (draft.length < 3) return;
    onChange([...polygons, draft]);
    setDraft([]);
  };

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="h-96 w-full rounded border border-gray-300" />
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={finishPolygon}
          disabled={draft.length < 3}
          className="rounded bg-blue-600 px-2 py-1 text-white disabled:opacity-40"
        >
          Finish polygon ({draft.length} pts)
        </button>
        <button
          type="button"
          onClick={() => setDraft((d) => d.slice(0, -1))}
          disabled={draft.length === 0}
          className="rounded border border-gray-300 px-2 py-1 disabled:opacity-40"
        >
          Undo point
        </button>
        <button
          type="button"
          onClick={() => onChange(polygons.slice(0, -1))}
          disabled={polygons.length === 0}
          className="rounded border border-gray-300 px-2 py-1 disabled:opacity-40"
        >
          Remove last polygon
        </button>
        <button
          type="button"
          onClick={() => {
            onChange([]);
            setDraft([]);
          }}
          disabled={polygons.length === 0 && draft.length === 0}
          className="rounded border border-gray-300 px-2 py-1 disabled:opacity-40"
        >
          Clear
        </button>
        <span className="text-gray-500">
          {polygons.length} saved polygon{polygons.length === 1 ? "" : "s"} · click map to
          add points
        </span>
      </div>
    </div>
  );
}
