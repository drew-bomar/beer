import type { LngLat } from "./types";

const EARTH_RADIUS_MILES = 3958.8;

/** Great-circle distance in miles between two [lng, lat] points. */
export function haversineMiles(a: LngLat, b: LngLat): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h));
}

/**
 * Ring of [lng, lat] coords approximating a circle of the given radius.
 * Good enough for display at city scale (equirectangular approximation).
 */
export function circleRing(center: LngLat, radiusMiles: number, steps = 64): LngLat[] {
  const [lng, lat] = center;
  const dLat = radiusMiles / 69.0;
  const dLng = radiusMiles / (69.0 * Math.cos((lat * Math.PI) / 180));
  const ring: LngLat[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * 2 * Math.PI;
    ring.push([lng + dLng * Math.cos(theta), lat + dLat * Math.sin(theta)]);
  }
  return ring;
}

/** Simple vertex-average centroid — fine for the small areas users draw. */
export function verticesCentroid(vertices: LngLat[]): LngLat {
  const n = vertices.length;
  const sum = vertices.reduce((acc, v) => [acc[0] + v[0], acc[1] + v[1]], [0, 0]);
  return [sum[0] / n, sum[1] / n];
}

/** [[minLng, minLat], [maxLng, maxLat]] bounds of a set of points. */
export function boundsOf(points: LngLat[]): [LngLat, LngLat] {
  let minLng = Infinity,
    minLat = Infinity,
    maxLng = -Infinity,
    maxLat = -Infinity;
  for (const [lng, lat] of points) {
    minLng = Math.min(minLng, lng);
    minLat = Math.min(minLat, lat);
    maxLng = Math.max(maxLng, lng);
    maxLat = Math.max(maxLat, lat);
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}
