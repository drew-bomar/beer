"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import BeerMap from "./BeerMap";
import ResultsSheet from "./ResultsSheet";
import type { LngLat, SearchArea, SearchResponse, VenueResult } from "@/lib/types";
import {
  DEFAULT_RADIUS_MILES,
  MAX_RADIUS_MILES,
  MIN_RADIUS_MILES,
} from "@/lib/types";
import { boundsOf, circleRing, verticesCentroid } from "@/lib/geo";
import {
  clearStoredArea,
  getDeviceId,
  loadStoredArea,
  saveStoredArea,
} from "@/lib/storage";

type Mode = "radius" | "draw";
type RequestState = "idle" | "sending" | "sent" | "error";

const FIT_PADDING = { top: 130, left: 36, right: 36, bottom: 220 };

export default function MapApp() {
  const [mode, setMode] = useState<Mode>("radius");
  const [radiusMiles, setRadiusMiles] = useState(DEFAULT_RADIUS_MILES);
  const [center, setCenter] = useState<LngLat | null>(null); // active radius center
  const [userPos, setUserPos] = useState<LngLat | null>(null); // stays in-browser
  const [vertices, setVertices] = useState<LngLat[]>([]);
  const [ringClosed, setRingClosed] = useState(false);
  const [activeArea, setActiveArea] = useState<SearchArea | null>(null);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [searching, setSearching] = useState(false);
  const [restored, setRestored] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(true);
  const [requestState, setRequestState] = useState<RequestState>("idle");

  const mapRef = useRef<MapLibreMap | null>(null);
  const pendingCameraRef = useRef<((map: MapLibreMap) => void) | null>(null);
  const didInitRef = useRef(false);
  const searchSeqRef = useRef(0);
  const radiusDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function withMap(fn: (map: MapLibreMap) => void) {
    if (mapRef.current) fn(mapRef.current);
    else pendingCameraRef.current = fn;
  }

  function fitToArea(area: SearchArea) {
    const points =
      area.mode === "radius" ? circleRing(area.center, area.radiusMiles) : area.vertices;
    const bounds = boundsOf(points);
    withMap((map) => map.fitBounds(bounds, { padding: FIT_PADDING, maxZoom: 15.5 }));
  }

  async function runSearch(area: SearchArea, opts: { fit?: boolean } = {}) {
    const seq = ++searchSeqRef.current;
    setSearching(true);
    setSelectedVenueId(null);
    setRequestState("idle");
    setActiveArea(area);
    saveStoredArea(area);
    if (opts.fit) fitToArea(area);
    try {
      const body =
        area.mode === "radius"
          ? { center: area.center, radiusMiles: area.radiusMiles }
          : { polygon: area.vertices };
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`search failed: ${res.status}`);
      const data: SearchResponse = await res.json();
      if (seq !== searchSeqRef.current) return; // superseded by a newer search
      setResults(data);
      setSheetExpanded(true);
    } catch {
      if (seq === searchSeqRef.current) setResults(null);
    } finally {
      if (seq === searchSeqRef.current) setSearching(false);
    }
  }

  function startRadiusSearch(c: LngLat, r: number, opts: { fit?: boolean } = {}) {
    setMode("radius");
    setVertices([]);
    setRingClosed(false);
    setCenter(c);
    setRadiusMiles(r);
    void runSearch({ mode: "radius", center: c, radiusMiles: r }, opts);
  }

  // --- Initial load: restore last area, then ask for location (default mode) ---
  function restoreStoredArea(stored: SearchArea) {
    setRestored(true);
    setActiveArea(stored);
    if (stored.mode === "radius") {
      setMode("radius");
      setCenter(stored.center);
      setRadiusMiles(stored.radiusMiles);
    } else {
      setMode("draw");
      setVertices(stored.vertices);
      setRingClosed(true);
    }
    void runSearch(stored, { fit: true });
  }

  function initFromBrowser() {
    const stored = loadStoredArea();
    if (stored) restoreStoredArea(stored);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const p: LngLat = [pos.coords.longitude, pos.coords.latitude];
          setUserPos(p); // in-memory only — never persisted server-side
          if (!stored) startRadiusSearch(p, DEFAULT_RADIUS_MILES, { fit: true });
        },
        () => {
          // Denied/unavailable: keep the St. Louis fallback view; app stays usable.
        },
        { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
      );
    }
  }

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    initFromBrowser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Mode switching ---
  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    if (next === "radius") {
      setVertices([]);
      setRingClosed(false);
      if (center) void runSearch({ mode: "radius", center, radiusMiles });
      else {
        setResults(null);
        setActiveArea(null);
      }
    }
  }

  // --- Draw tool callbacks ---
  function addVertex(p: LngLat) {
    setRestored(false);
    setVertices((vs) => [...vs, p]);
  }

  function closeRing() {
    if (vertices.length < 3 || ringClosed) return;
    setRingClosed(true);
    void runSearch({ mode: "polygon", vertices });
  }

  function moveVertex(index: number, p: LngLat, done: boolean) {
    const next = vertices.map((v, i) => (i === index ? p : v));
    setVertices(next);
    if (done && ringClosed) void runSearch({ mode: "polygon", vertices: next });
  }

  function undoVertex() {
    if (ringClosed) return;
    setVertices((vs) => vs.slice(0, -1));
  }

  function clearDraw() {
    setVertices([]);
    setRingClosed(false);
    if (activeArea?.mode === "polygon") {
      setResults(null);
      setActiveArea(null);
      clearStoredArea();
      setRestored(false);
    }
  }

  // --- One-tap clear of the active/restored area ---
  function clearSearch() {
    clearStoredArea();
    setRestored(false);
    setResults(null);
    setActiveArea(null);
    setVertices([]);
    setRingClosed(false);
    setCenter(null);
    setSelectedVenueId(null);
    setMode("radius");
    if (userPos) startRadiusSearch(userPos, DEFAULT_RADIUS_MILES, { fit: true });
  }

  // --- Radius controls ---
  function onRadiusChange(value: number) {
    setRadiusMiles(value);
    setRestored(false);
    if (center) {
      const c = center;
      if (radiusDebounceRef.current) clearTimeout(radiusDebounceRef.current);
      radiusDebounceRef.current = setTimeout(() => {
        void runSearch({ mode: "radius", center: c, radiusMiles: value });
      }, 400);
    }
  }

  function searchHere() {
    withMap((map) => {
      const c = map.getCenter();
      setRestored(false);
      startRadiusSearch([c.lng, c.lat], radiusMiles);
    });
  }

  // --- Venue selection ---
  function selectVenueFromList(v: VenueResult) {
    setSelectedVenueId(v.id);
    setSheetExpanded(false); // reveal the pin under the sheet
    withMap((map) =>
      map.flyTo({
        center: [v.lng, v.lat],
        zoom: Math.max(map.getZoom(), 15),
        offset: [0, -40],
      }),
    );
  }

  function selectVenueFromMap(id: string) {
    setSelectedVenueId(id);
    setSheetExpanded(true);
  }

  // --- Area request (outside coverage) ---
  async function requestArea() {
    if (!activeArea) return;
    const centroid: LngLat =
      activeArea.mode === "radius"
        ? activeArea.center
        : verticesCentroid(activeArea.vertices);
    setRequestState("sending");
    try {
      const res = await fetch("/api/area-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ location: centroid, device_id: getDeviceId() }),
      });
      setRequestState(res.ok ? "sent" : "error");
    } catch {
      setRequestState("error");
    }
  }

  const radiusCircle =
    mode === "radius" && center ? { center, radiusMiles } : null;

  const areaChipLabel = restored
    ? "Restored last search"
    : activeArea?.mode === "radius"
      ? `${activeArea.radiusMiles} mi radius`
      : activeArea?.mode === "polygon"
        ? "Custom area"
        : null;

  return (
    <div className="fixed inset-0 overflow-hidden bg-neutral-100">
      <BeerMap
        drawMode={mode === "draw"}
        vertices={vertices}
        ringClosed={ringClosed}
        radiusCircle={radiusCircle}
        venues={results?.venues ?? []}
        selectedVenueId={selectedVenueId}
        onReady={(map) => {
          mapRef.current = map;
          if (pendingCameraRef.current) {
            pendingCameraRef.current(map);
            pendingCameraRef.current = null;
          }
        }}
        onAddVertex={addVertex}
        onCloseRing={closeRing}
        onMoveVertex={moveVertex}
        onSelectVenue={selectVenueFromMap}
      />

      {/* Top controls */}
      <div className="pointer-events-none absolute inset-x-3 top-[calc(0.75rem+env(safe-area-inset-top))] flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="pointer-events-auto flex rounded-full bg-white p-1 shadow-md">
            <button
              onClick={() => switchMode("radius")}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                mode === "radius" ? "bg-amber-600 text-white" : "text-neutral-600"
              }`}
            >
              Nearby
            </button>
            <button
              onClick={() => switchMode("draw")}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                mode === "draw" ? "bg-amber-600 text-white" : "text-neutral-600"
              }`}
            >
              Draw area
            </button>
          </div>
          {areaChipLabel && (
            <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-md">
              <span>{areaChipLabel}</span>
              <button
                onClick={clearSearch}
                aria-label="Clear search area"
                className="ml-0.5 grid h-5 w-5 place-items-center rounded-full bg-neutral-100 text-neutral-500 active:bg-neutral-200"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {mode === "radius" && (
          <div className="pointer-events-auto max-w-sm rounded-2xl bg-white p-3 shadow-md">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-neutral-800">
                Radius: {radiusMiles.toFixed(2).replace(/\.?0+$/, "")} mi
              </span>
              <button
                onClick={searchHere}
                className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold text-white active:bg-neutral-700"
              >
                Search this area
              </button>
            </div>
            <input
              type="range"
              min={MIN_RADIUS_MILES}
              max={MAX_RADIUS_MILES}
              step={0.25}
              value={radiusMiles}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className="mt-2 w-full accent-amber-600"
              aria-label="Search radius in miles"
            />
          </div>
        )}

        {mode === "draw" && (
          <div className="pointer-events-auto max-w-sm rounded-2xl bg-white p-3 shadow-md">
            <p className="text-xs text-neutral-600">
              {ringClosed
                ? "Drag the points to adjust your area."
                : vertices.length === 0
                  ? "Tap the map to drop the corners of your area."
                  : vertices.length < 3
                    ? `${vertices.length} point${vertices.length === 1 ? "" : "s"} — drop at least 3.`
                    : "Tap the first point (or Done) to close the area."}
            </p>
            <div className="mt-2 flex gap-2">
              {!ringClosed && (
                <button
                  onClick={undoVertex}
                  disabled={vertices.length === 0}
                  className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700 active:bg-neutral-200 disabled:opacity-40"
                >
                  Undo
                </button>
              )}
              {!ringClosed && (
                <button
                  onClick={closeRing}
                  disabled={vertices.length < 3}
                  className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white active:bg-amber-700 disabled:opacity-40"
                >
                  Done
                </button>
              )}
              <button
                onClick={clearDraw}
                disabled={vertices.length === 0}
                className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700 active:bg-neutral-200 disabled:opacity-40"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <ResultsSheet
        results={results}
        searching={searching}
        hasArea={activeArea !== null}
        userPos={userPos}
        selectedVenueId={selectedVenueId}
        expanded={sheetExpanded}
        requestState={requestState}
        onToggle={() => setSheetExpanded((e) => !e)}
        onSelectVenue={selectVenueFromList}
        onRequestArea={requestArea}
      />
    </div>
  );
}
