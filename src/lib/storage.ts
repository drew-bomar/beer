import type { LngLat, SearchArea } from "./types";
import { MAX_RADIUS_MILES } from "./types";

// Privacy (CLAUDE.md): search area lives in localStorage only; it is never
// persisted server-side and only sent transiently to /api/search.
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

export function loadStoredArea(): SearchArea | null {
  try {
    const raw = localStorage.getItem(AREA_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SearchArea;
    if (parsed?.mode === "radius") {
      if (!isLngLat(parsed.center)) return null;
      const r = Number(parsed.radiusMiles);
      if (!Number.isFinite(r) || r <= 0) return null;
      return { mode: "radius", center: parsed.center, radiusMiles: Math.min(r, MAX_RADIUS_MILES) };
    }
    if (parsed?.mode === "polygon") {
      if (!Array.isArray(parsed.vertices) || parsed.vertices.length < 3) return null;
      if (!parsed.vertices.every(isLngLat)) return null;
      return { mode: "polygon", vertices: parsed.vertices };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveStoredArea(area: SearchArea): void {
  try {
    localStorage.setItem(AREA_KEY, JSON.stringify(area));
  } catch {
    // Storage full/unavailable — persistence is best-effort.
  }
}

export function clearStoredArea(): void {
  try {
    localStorage.removeItem(AREA_KEY);
  } catch {
    // ignore
  }
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
