import type { LngLat, SearchArea, SearchFilters } from "./types";
import { EMPTY_FILTERS, FILTER_FORMATS, MAX_RADIUS_MILES } from "./types";

// Privacy (CLAUDE.md): search area lives in localStorage only; it is never
// persisted server-side and only sent transiently to /api/search.
// BEE-22: filters share the same blob — { area?, filters? }. Legacy blobs that
// are a bare SearchArea (mode at top level) are still readable.
const AREA_KEY = "beer.searchArea";
const DEVICE_KEY = "beer.deviceId";

function isLngLat(p: unknown): p is LngLat {
  return (
    Array.isArray(p) &&
    p.length === 2 &&
    typeof p[0] === "number" &&
    typeof p[1] === "number" &&
    Number.isFinite(p[0]) &&
    Number.isFinite(p[1]) &&
    Math.abs(p[0]) <= 180 &&
    Math.abs(p[1]) <= 90
  );
}

function validateArea(parsed: unknown): SearchArea | null {
  const a = parsed as SearchArea | null;
  if (a?.mode === "radius") {
    if (!isLngLat(a.center)) return null;
    const r = Number(a.radiusMiles);
    if (!Number.isFinite(r) || r <= 0) return null;
    return { mode: "radius", center: a.center, radiusMiles: Math.min(r, MAX_RADIUS_MILES) };
  }
  if (a?.mode === "polygon") {
    if (!Array.isArray(a.vertices) || a.vertices.length < 3) return null;
    if (!a.vertices.every(isLngLat)) return null;
    return { mode: "polygon", vertices: a.vertices };
  }
  return null;
}

function validateFilters(parsed: unknown): SearchFilters {
  const f = parsed as Partial<SearchFilters> | null | undefined;
  if (!f || typeof f !== "object") return EMPTY_FILTERS;
  const formats = Array.isArray(f.formats)
    ? f.formats.filter((x): x is SearchFilters["formats"][number] =>
        (FILTER_FORMATS as readonly string[]).includes(x as string),
      )
    : [];
  return {
    brand: typeof f.brand === "string" ? f.brand.slice(0, 80) : "",
    formats: [...new Set(formats)],
    activeDealsOnly: f.activeDealsOnly === true,
  };
}

type StoredBlob = { area?: unknown; filters?: unknown; mode?: unknown };

function readBlob(): StoredBlob | null {
  try {
    const raw = localStorage.getItem(AREA_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredBlob;
    if (!parsed || typeof parsed !== "object") return null;
    // Legacy shape: the blob IS the area.
    if (parsed.mode !== undefined) return { area: parsed };
    return parsed;
  } catch {
    return null;
  }
}

function writeBlob(area: SearchArea | null, filters: SearchFilters): void {
  try {
    localStorage.setItem(AREA_KEY, JSON.stringify({ area, filters }));
  } catch {
    // Storage full/unavailable — persistence is best-effort.
  }
}

export function loadStoredArea(): SearchArea | null {
  return validateArea(readBlob()?.area);
}

export function loadStoredFilters(): SearchFilters {
  return validateFilters(readBlob()?.filters);
}

export function saveStoredArea(area: SearchArea): void {
  writeBlob(area, loadStoredFilters());
}

export function saveStoredFilters(filters: SearchFilters): void {
  writeBlob(loadStoredArea(), filters);
}

export function clearStoredArea(): void {
  // Filters survive an area clear — clearing the map shouldn't reset the user's chips.
  writeBlob(null, loadStoredFilters());
}

/** Anonymous device id (random UUID) used only for area requests / rate limiting. */
export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
