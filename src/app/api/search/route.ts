import { sql } from "@/lib/db";
import { parseArea, type AreaInput } from "@/lib/search-area";
import { effectivePrices, type EffectivePrice } from "@/lib/effective-price";
import {
  fetchSingleServingOfferings,
  fetchSpecials,
  type OfferingRow,
} from "@/lib/venue-data";

export const dynamic = "force-dynamic";

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

type VenueRow = {
  id: string;
  slug: string;
  name: string;
  address: string;
  lng: number;
  lat: number;
};

/**
 * POST /api/search
 * Body: { polygon: [[lng,lat], ...] }  OR  { center: [lng,lat], radiusMiles: number }
 *
 * The search area is used transiently for this query only — nothing about it
 * (including GPS-derived centers) is ever written to the database.
 *
 * Ranking (BEE-24): a venue ranks by the cheapest EFFECTIVE per-12oz across its
 * single-serving offerings — active structured specials substitute their price.
 */
export async function POST(req: Request) {
  let body: AreaInput;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const area = parseArea(body);
  if (!area.ok) return badRequest(area.error);

  try {
    const [venues, [{ covered }]] = await Promise.all([
      sql<VenueRow[]>`
        select
          v.id, v.slug, v.name, v.address,
          st_x(v.location::geometry)::float8 as lng,
          st_y(v.location::geometry)::float8 as lat
        from venues v
        where v.status = 'active' and ${area.venuePredicate}
      `,
      sql<{ covered: boolean }[]>`
        select exists(
          select 1 from coverage_areas c where ${area.coveragePredicate}
        ) as covered
      `,
    ]);

    const venueIds = venues.map((v) => v.id);
    const [offerings, specials] = await Promise.all([
      fetchSingleServingOfferings(venueIds),
      fetchSpecials(venueIds),
    ]);

    const now = new Date();
    const results = [];
    for (const v of venues) {
      const venueOfferings = offerings.filter((o) => o.venue_id === v.id);
      if (venueOfferings.length === 0) continue;
      const priced = effectivePrices(
        venueOfferings,
        specials.filter((s) => s.venue_id === v.id),
        now,
      );

      // Cheapest by effective per-12oz (then effective price) — the ranking key.
      let cheapest: { o: OfferingRow; p: EffectivePrice } | null = null;
      for (const o of venueOfferings) {
        const p = priced.get(o.id);
        if (!p) continue;
        if (
          cheapest === null ||
          p.effectivePricePer12oz < cheapest.p.effectivePricePer12oz ||
          (p.effectivePricePer12oz === cheapest.p.effectivePricePer12oz &&
            p.effectivePrice < cheapest.p.effectivePrice)
        ) {
          cheapest = { o, p };
        }
      }
      if (!cheapest) continue;

      results.push({
        id: v.id,
        slug: v.slug,
        name: v.name,
        address: v.address,
        lng: v.lng,
        lat: v.lat,
        cheapest: {
          beer_name: cheapest.o.beer_name,
          format: cheapest.o.format,
          size_oz: cheapest.o.size_oz,
          size_assumed: cheapest.o.size_assumed,
          // Effective (deal-adjusted) values — same fields the cards already show.
          price: cheapest.p.effectivePrice,
          price_per_12oz: cheapest.p.effectivePricePer12oz,
          source: cheapest.o.source,
          verified: cheapest.o.verified,
          last_verified_at: cheapest.o.last_verified_at,
          // BEE-24 additions (null/false when no active deal).
          on_deal: cheapest.p.onDeal,
          deal_ends_at: cheapest.p.dealEndsAt,
          original_price: cheapest.p.onDeal ? cheapest.p.originalPrice : null,
          original_price_per_12oz: cheapest.p.onDeal
            ? cheapest.p.originalPricePer12oz
            : null,
        },
      });
    }

    results.sort(
      (a, b) =>
        a.cheapest.price_per_12oz - b.cheapest.price_per_12oz ||
        a.cheapest.price - b.cheapest.price ||
        a.name.localeCompare(b.name),
    );

    return Response.json({ coverage: covered, venues: results });
  } catch {
    // Degenerate geometry (e.g. all vertices collinear) can make PostGIS throw.
    return badRequest("Could not interpret the search area");
  }
}
