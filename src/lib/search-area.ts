// Shared search-area parsing/validation for /api/search and /api/happening-now.
// Behavior extracted verbatim from the original /api/search implementation so
// both routes accept identical area inputs.

import { sql } from "@/lib/db";

export const MAX_RADIUS_MILES = 5;
const METERS_PER_MILE = 1609.344;
const MAX_POLYGON_VERTICES = 200;

export type LngLat = [number, number];

export type AreaInput = {
  polygon?: unknown;
  center?: unknown;
  radiusMiles?: unknown;
};

type SqlFragment = ReturnType<typeof sql>;

export type ParsedArea =
  | { ok: true; venuePredicate: SqlFragment; coveragePredicate: SqlFragment }
  | { ok: false; error: string };

export function isLngLat(p: unknown): p is LngLat {
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

/**
 * Build the parameterized geo predicates (`v` = venues alias, `c` =
 * coverage_areas alias) from a search body: { polygon } XOR { center, radiusMiles }.
 */
export function parseArea(body: AreaInput): ParsedArea {
  const hasPolygon = body.polygon !== undefined;
  const hasCenter = body.center !== undefined;
  if (hasPolygon === hasCenter) {
    return {
      ok: false,
      error: "Provide exactly one of `polygon` or `center` (+ radiusMiles)",
    };
  }

  if (hasPolygon) {
    const poly = body.polygon;
    if (
      !Array.isArray(poly) ||
      poly.length < 3 ||
      poly.length > MAX_POLYGON_VERTICES ||
      !poly.every(isLngLat)
    ) {
      return {
        ok: false,
        error: `\`polygon\` must be 3–${MAX_POLYGON_VERTICES} [lng,lat] pairs`,
      };
    }
    // Close the ring if the caller didn't.
    const first = poly[0] as LngLat;
    const last = poly[poly.length - 1] as LngLat;
    const ring =
      first[0] === last[0] && first[1] === last[1] ? poly : [...poly, first];
    const geojson = JSON.stringify({ type: "Polygon", coordinates: [ring] });
    // st_makevalid forgives self-intersections from finger-drawn shapes.
    const area = sql`st_makevalid(st_geomfromgeojson(${geojson}))::geography`;
    return {
      ok: true,
      venuePredicate: sql`st_covers(${area}, v.location)`,
      coveragePredicate: sql`st_intersects(c.area, ${area})`,
    };
  }

  if (!isLngLat(body.center)) {
    return { ok: false, error: "`center` must be a [lng,lat] pair" };
  }
  const radiusMiles = Number(body.radiusMiles ?? 1);
  if (!Number.isFinite(radiusMiles) || radiusMiles <= 0) {
    return { ok: false, error: "`radiusMiles` must be a positive number" };
  }
  const meters = Math.min(radiusMiles, MAX_RADIUS_MILES) * METERS_PER_MILE;
  const [lng, lat] = body.center;
  const point = sql`st_setsrid(st_makepoint(${lng}, ${lat}), 4326)::geography`;
  return {
    ok: true,
    venuePredicate: sql`st_dwithin(v.location, ${point}, ${meters})`,
    coveragePredicate: sql`st_dwithin(c.area, ${point}, ${meters})`,
  };
}

/**
 * The same area input expressed as GET query params:
 *   ?center=<lng>,<lat>&radiusMiles=1     or     ?polygon=[[lng,lat],...]
 * (polygon also accepts "lng,lat;lng,lat;..." for hand-typed URLs).
 * Returns the equivalent body-shaped AreaInput; malformed values are passed
 * through so parseArea() produces the same error messages as /api/search.
 */
export function areaInputFromSearchParams(params: URLSearchParams): AreaInput {
  const input: AreaInput = {};

  const polygon = params.get("polygon");
  if (polygon !== null) {
    if (polygon.trimStart().startsWith("[")) {
      try {
        input.polygon = JSON.parse(polygon);
      } catch {
        input.polygon = polygon; // fails validation with the standard message
      }
    } else {
      input.polygon = polygon
        .split(";")
        .filter((s) => s.length > 0)
        .map((pair) => pair.split(",").map(Number));
    }
  }

  const center = params.get("center");
  if (center !== null) {
    input.center = center.split(",").map(Number);
  }

  const radiusMiles = params.get("radiusMiles");
  if (radiusMiles !== null) input.radiusMiles = radiusMiles;

  return input;
}
