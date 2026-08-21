// Shared DB fetchers for the deal-aware endpoints (/api/search, /api/happening-now).

import { sql } from "@/lib/db";
import type { PriceableSpecial } from "@/lib/effective-price";

export type OfferingRow = {
  id: string;
  venue_id: string;
  beer_name: string;
  format: string;
  size_oz: number;
  size_assumed: boolean;
  price: number;
  price_per_12oz: number;
  source: string;
  verified: boolean;
  last_verified_at: Date;
};

export type SpecialRow = PriceableSpecial & {
  id: string;
  venue_id: string;
  free_text: string | null;
};

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

/** All single-serving offerings for a set of venues (ranking never sees pitchers/buckets). */
export async function fetchSingleServingOfferings(
  venueIds: string[],
): Promise<OfferingRow[]> {
  if (venueIds.length === 0) return [];
  return sql<OfferingRow[]>`
    select
      o.id, o.venue_id, o.beer_name,
      o.format::text as format,
      o.size_oz::float8 as size_oz,
      o.size_assumed,
      o.price::float8 as price,
      o.price_per_12oz::float8 as price_per_12oz,
      o.source::text as source,
      o.verified,
      o.last_verified_at
    from offerings o
    where o.venue_id in ${sql(venueIds)}
      and o.format in ('draft', 'bottle', 'can')
  `;
}
