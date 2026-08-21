"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import BeerMap, { type MapPin } from "./BeerMap";
import ResultsSheet, { type ResultsView } from "./ResultsSheet";
import type {
  HappeningNowResponse,
  LngLat,
  SearchArea,
  SearchFilters,
  SearchResponse,
} from "@/lib/types";
import {
  DEFAULT_RADIUS_MILES,
  EMPTY_FILTERS,
  MAX_RADIUS_MILES,
  MIN_RADIUS_MILES,
} from "@/lib/types";
import { boundsOf, circleRing, verticesCentroid } from "@/lib/geo";
import {
  clearStoredArea,
  getDeviceId,
  loadStoredArea,
  loadStoredFilters,
  saveStoredArea,
  saveStoredFilters,
} from "@/lib/storage";
import { DEAL_TIME_ZONE } from "@/lib/deals";

type Mode = "radius" | "draw";
type RequestState = "idle" | "sending" | "sent" | "error";

const FIT_PADDING = { top: 130, left: 36, right: 36, bottom: 220 };

/** BEE-26: purely presentational — is it 5:00–5:59 PM in St. Louis? */
function isFiveOClockInChicago(): boolean {
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: DEAL_TIME_ZONE,
    hour: "numeric",
    hourCycle: "h23",
  }).format(new Date());
  return Number(hour) === 17;
}

// Client clock as an external store: re-checked every 30s; false during SSR
// so hydration is stable.
function subscribeToClock(onChange: () => void) {
  const t = setInterval(onChange, 30_000);
  return () => clearInterval(t);
}
const fiveOClockServerSnapshot = () => false;

export default function MapApp() {
  const [mode, setMode] = useState<Mode>("radius");
  const [radiusMiles, setRadiusMiles] = useState(DEFAULT_RADIUS_MILES);
  const [center, setCenter] = useState<LngLat | null>(null); // active radius center
  const [userPos, setUserPos] = useState<LngLat | null>(null); // stays in-browser
  const [vertices, setVertices] = useState<LngLat[]>([]);
  const [ringClosed, setRingClosed] = useState(false);
  const [activeArea, setActiveArea] = useState<SearchArea | null>(null);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [nowResults, setNowResults] = useState<HappeningNowResponse | null>(null);
  const [view, setView] = useState<ResultsView>("all");
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);
  const [searching, setSearching] = useState(false);
  const [restored, setRestored] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(true);
  const [requestState, setRequestState] = useState<RequestState>("idle");
  // BEE-26: client-side clock check, re-evaluated every 30s.
  const fiveOClock = useSyncExternalStore(
    subscribeToClock,
    isFiveOClockInChicago,
    fiveOClockServerSnapshot,
  );

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

  async function runSearch(
    area: SearchArea,
    opts: { fit?: boolean; filters?: SearchFilters } = {},
  ) {
    const f = opts.filters ?? filters;
    const seq = ++searchSeqRef.current;
    setSearching(true);
    setSelectedVenueId(null);
    setRequestState("idle");
    setActiveArea(area);
    saveStoredArea(area);
    if (opts.fit) fitToArea(area);
    try {
      const areaBody =
        area.mode === "radius"
          ? { center: area.center, radiusMiles: area.radiusMiles }
          : { polygon: area.vertices };
      // BEE-22: filters ride along with the area; ranking stays server-side.
      const searchBody = {
        ...areaBody,
        ...(f.brand.trim() !== "" ? { brand: f.brand.trim() } : {}),
        ...(f.formats.length > 0 ? { formats: f.formats } : {}),
        ...(f.activeDealsOnly ? { activeDealsOnly: true } : {}),
      };
      // Both views fetch together so toggling All ⇄ Happening Now is instant.
      const [res, nowRes] = await Promise.all([
        fetch("/api/search", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(searchBody),
        }),
        fetch("/api/happening-now", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(areaBody),
        }),
      ]);
      if (!res.ok || !nowRes.ok) throw new Error("search failed");
      const data: SearchResponse = await res.json();
      const nowData: HappeningNowResponse = await nowRes.json();
      if (seq !== searchSeqRef.current) return; // superseded by a newer search
      setResults(data);
      setNowResults(nowData);
      setSheetExpanded(true);
    } catch {
      if (seq === searchSeqRef.current) {
        setResults(null);
        setNowResults(null);
      }
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

  // --- Initial load: restore last area + filters, then ask for location ---
  function restoreStoredArea(stored: SearchArea, storedFilters: SearchFilters) {
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
    void runSearch(stored, { fit: true, filters: storedFilters });
  }

  function initFromBrowser() {
    const stored = loadStoredArea();
    const storedFilters = loadStoredFilters();
    setFilters(storedFilters);
    if (stored) restoreStoredArea(stored, storedFilters);

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

  // --- Filters (BEE-22) ---
  function onFiltersChange(next: SearchFilters) {
    setFilters(next);
    saveStoredFilters(next);
    if (activeArea) void runSearch(activeArea, { filters: next });
  }

  // --- View toggle (BEE-25) ---
  function onViewChange(next: ResultsView) {
    setView(next);
    setSelectedVenueId(null);
    setSheetExpanded(true);
  }

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
        setNowResults(null);
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
      setNowResults(null);
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
    setNowResults(null);
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
  // List tap: select + expand the card in place (BEE-21); keep the sheet open.
  function selectVenueFromList(v: { id: string; lng: number; lat: number }) {
    setSelectedVenueId(v.id);
    withMap((map) =>
      map.flyTo({
        center: [v.lng, v.lat],
        zoom: Math.max(map.getZoom(), 15),
        offset: [0, -40],
      }),
    );
  }

  // Pin tap: expand the sheet and the venue's card (it scrolls into view).
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

  const pins: MapPin[] =
    view === "now"
      ? (nowResults?.venues ?? []).map((v) => ({
          id: v.id,
          lng: v.lng,
          lat: v.lat,
          label: `$${v.cheapest_active_deal_per_12oz.toFixed(2)}`,
        }))
      : (results?.venues ?? []).map((v) => ({
          id: v.id,
          lng: v.lng,
          lat: v.lat,
          label: `$${v.cheapest.price_per_12oz.toFixed(2)}`,
        }));

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
        userLocation={userPos}
        pins={pins}
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
          <div
            className={`pointer-events-auto flex rounded-full bg-white p-1 shadow-md ${
              fiveOClock ? "ring-2 ring-amber-400" : ""
            }`}
          >
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

        {/* BEE-26: gold flourish, 5:00–5:59 PM America/Chicago. Presentation only. */}
        {fiveOClock && (
          <div className="five-oclock pointer-events-none self-start rounded-full px-3.5 py-1.5 text-xs font-bold text-amber-950 shadow-md">
            It&apos;s 5 o&apos;clock
          </div>
        )}

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
        view={view}
        results={results}
        nowResults={nowResults}
        searching={searching}
        hasArea={activeArea !== null}
        userPos={userPos}
        selectedVenueId={selectedVenueId}
        expanded={sheetExpanded}
        requestState={requestState}
        filters={filters}
        onViewChange={onViewChange}
        onFiltersChange={onFiltersChange}
        onToggle={() => setSheetExpanded((e) => !e)}
        onSelectVenue={selectVenueFromList}
        onRequestArea={requestArea}
      />
    </div>
  );
}
