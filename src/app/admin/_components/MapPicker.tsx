"use client";

import { useEffect, useRef } from "react";
import { Map as MapLibreMap, Marker, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@/lib/maplibre-setup";

export const LIBERTY_STYLE = "https://tiles.openfreemap.org/styles/liberty";
/** St. Louis fallback center. */
export const STL_CENTER: [number, number] = [-90.2494, 38.632];

export type LngLat = { lng: number; lat: number };

/** Click-to-set point picker on OpenFreeMap Liberty tiles. */
export default function MapPicker({
  point,
  onPick,
}: {
  point: LngLat | null;
  onPick: (p: LngLat) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const onPickRef = useRef(onPick);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new MapLibreMap({
      container: containerRef.current,
      style: LIBERTY_STYLE,
      center: point ? [point.lng, point.lat] : STL_CENTER,
      zoom: point ? 15 : 11,
      attributionControl: { compact: true },
    });
    map.addControl(new NavigationControl({ showCompass: false }));
    map.on("click", (e) => {
      onPickRef.current({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    });
    mapRef.current = map;
    return () => {
      markerRef.current = null;
      mapRef.current = null;
      map.remove();
    };
    // Initial center only — later point changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (point) {
      if (markerRef.current) {
        markerRef.current.setLngLat([point.lng, point.lat]);
      } else {
        markerRef.current = new Marker({ color: "#d97706" })
          .setLngLat([point.lng, point.lat])
          .addTo(map);
      }
    } else if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [point]);

  return (
    <div
      ref={containerRef}
      className="h-72 w-full rounded border border-gray-300"
      data-testid="map-picker"
    />
  );
}
