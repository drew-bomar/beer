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
  /** "pitcher" can only appear when the pitcher format filter is chosen. */
  format: "draft" | "bottle" | "can" | "pitcher";
  size_oz: number;
  size_assumed: boolean;
  /** EFFECTIVE (deal-adjusted) values — what the user pays right now. */
  price: number;
  price_per_12oz: number;
  source: string;
  verified: boolean;
  last_verified_at: string; // ISO timestamp
  // BEE-24: deal flags (false/null when no active structured special applies).
  on_deal: boolean;
  deal_ends_at: string | null; // ISO timestamp
  original_price: number | null;
  original_price_per_12oz: number | null;
};

export type VenueResult = {
  id: string;
  slug: string;
  name: string;
  address: string;
  lng: number;
  lat: number;
  /** Null for a venue with no priced offerings yet (shown as a prompt to add prices). */
  cheapest: CheapestOffering | null;
};

export type SearchResponse = {
  /** True when the requested area intersects at least one coverage_area. */
  coverage: boolean;
  venues: VenueResult[];
};

// --- BEE-22: filters ---

export const FILTER_FORMATS = ["draft", "bottle", "can", "pitcher"] as const;
export type FilterFormat = (typeof FILTER_FORMATS)[number];

/** Persisted alongside the search area in the same localStorage blob. */
export type SearchFilters = {
  brand: string; // "" = no brand filter
  formats: FilterFormat[]; // [] = default (all single-serving formats)
  activeDealsOnly: boolean;
};

export const EMPTY_FILTERS: SearchFilters = {
  brand: "",
  formats: [],
  activeDealsOnly: false,
};

export function filtersAreEmpty(f: SearchFilters): boolean {
  return f.brand.trim() === "" && f.formats.length === 0 && !f.activeDealsOnly;
}

// --- BEE-21: card expansion (popular beers endpoint) ---

export type PopularBeer = {
  id: string;
  beer_name: string;
  brand: string | null;
  format: "draft" | "bottle" | "can";
  size_oz: number;
  size_assumed: boolean;
  /** EFFECTIVE (deal-adjusted) values. */
  price: number;
  price_per_12oz: number;
  on_deal: boolean;
  deal_ends_at: string | null;
  original_price: number | null;
  original_price_per_12oz: number | null;
  verified: boolean;
  last_verified_at: string;
};

export type PopularResponse = {
  venue: { id: string; slug: string; name: string };
  beers: PopularBeer[];
};

// --- BEE-25: Happening Now ---

export type ActiveDeal = {
  label: string;
  beer_name: string | null;
  category: string | null;
  effective_price: number;
  effective_price_per_12oz: number;
  original_price: number;
  ends_at: string; // ISO
  free_text: string | null;
};

export type HappeningVenue = {
  id: string;
  slug: string;
  name: string;
  address: string;
  lng: number;
  lat: number;
  cheapest_active_deal_per_12oz: number;
  deals: ActiveDeal[];
};

export type HappeningNowResponse = {
  coverage: boolean;
  venues: HappeningVenue[];
};
