// Shared DB fetchers for the deal-aware endpoints (/api/search,
// /api/happening-now, /api/venues/[slug]/popular) and the venue page.

import { sql } from "@/lib/db";
import type { PriceableSpecial } from "@/lib/effective-price";
import type { VenueHours } from "@/lib/deals";

export type OfferingRow = {
  id: string;
  venue_id: string;
  beer_name: string;
  brand: string | null;
  format: string;
  size_oz: number;
  size_assumed: boolean;
  price: number;
  price_per_12oz: number;
  source: string;
  verified: boolean;
  last_verified_at: Date;
  is_popular: boolean;
};

export type SpecialRow = PriceableSpecial & {
  id: string;
  venue_id: string;
  free_text: string | null;
};

export type VenueDetailRow = {
  id: string;
  slug: string;
  name: string;
  address: string;
  hours: VenueHours;
  website_url: string | null;
  google_url: string | null;
  status: string;
};

export const SINGLE_SERVING: readonly string[] = ["draft", "bottle", "can"];

/** All specials for a set of venues, shaped for the pure deal engine. */
export async function fetchSpecials(venueIds: string[]): Promise<SpecialRow[]> {
  if (venueIds.length === 0) return [];
  const rows = await sql<SpecialRow[]>`
    select
      s.id, s.venue_id,
      s.days_of_week,
      s.start_time::text as start_time,
      s.end_time::text as end_time,
      s.target_type::text as target_type,
      s.offering_id,
      s.category::text as category,
      s.deal_price::float8 as deal_price,
      s.discount_amount::float8 as discount_amount,
      s.free_text
    from specials s
    where s.venue_id in ${sql(venueIds)}
  `;
  // smallint[] can come back as strings depending on the driver's parser.
  return rows.map((r) => ({ ...r, days_of_week: r.days_of_week.map(Number) }));
}

/**
 * Offerings for a set of venues, optionally restricted to a set of formats.
 * Omitting `formats` returns every format (pitchers/buckets included).
 */
export async function fetchOfferings(
  venueIds: string[],
  formats?: readonly string[],
): Promise<OfferingRow[]> {
  if (venueIds.length === 0) return [];
  if (formats !== undefined && formats.length === 0) return [];
  return sql<OfferingRow[]>`
    select
      o.id, o.venue_id, o.beer_name, o.brand,
      o.format::text as format,
      o.size_oz::float8 as size_oz,
      o.size_assumed,
      o.price::float8 as price,
      o.price_per_12oz::float8 as price_per_12oz,
      o.source::text as source,
      o.verified,
      o.last_verified_at,
      o.is_popular
    from offerings o
    where o.venue_id in ${sql(venueIds)}
      ${formats !== undefined ? sql`and o.format in ${sql([...formats])}` : sql``}
  `;
}

/** All single-serving offerings for a set of venues (ranking never sees pitchers/buckets). */
export function fetchSingleServingOfferings(venueIds: string[]): Promise<OfferingRow[]> {
  return fetchOfferings(venueIds, SINGLE_SERVING);
}

/** One venue by slug, any status (callers decide how to render non-active). */
export async function fetchVenueBySlug(slug: string): Promise<VenueDetailRow | null> {
  const rows = await sql<VenueDetailRow[]>`
    select
      v.id, v.slug, v.name, v.address, v.hours,
      v.website_url, v.google_url,
      v.status::text as status
    from venues v
    where v.slug = ${slug}
  `;
  return rows[0] ?? null;
}
