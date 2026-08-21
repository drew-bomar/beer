// Shared types for the public map experience (BEE-13…BEE-18).

export type LngLat = [number, number]; // [lng, lat]

/** The active search area. Persisted in localStorage only; sent transiently to /api/search. */
export type SearchArea =
  | { mode: "radius"; center: LngLat; radiusMiles: number }
  | { mode: "polygon"; vertices: LngLat[] };

export const DEFAULT_RADIUS_MILES = 1;
export const MAX_RADIUS_MILES = 5;
export const MIN_RADIUS_MILES = 0.25;

/** St. Louis fallback view showing both seeded districts (Loop + Downtown). */
export const STL_FALLBACK = { center: [-90.24, 38.63] as LngLat, zoom: 11.6 };

export type CheapestOffering = {
  beer_name: string;
  format: "draft" | "bottle" | "can";
  size_oz: number;
  size_assumed: boolean;
  price: number;
  price_per_12oz: number;
  source: string;
  verified: boolean;
  last_verified_at: string; // ISO timestamp
};

export type VenueResult = {
  id: string;
  slug: string;
  name: string;
  address: string;
  lng: number;
  lat: number;
  cheapest: CheapestOffering;
};

export type SearchResponse = {
  /** True when the requested area intersects at least one coverage_area. */
  coverage: boolean;
  venues: VenueResult[];
};
