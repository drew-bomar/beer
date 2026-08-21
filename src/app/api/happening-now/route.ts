import { sql } from "@/lib/db";
import {
  areaInputFromSearchParams,
  parseArea,
  type AreaInput,
} from "@/lib/search-area";
import { activeWindowEnd, isVenueOpen, type VenueHours } from "@/lib/deals";
import { dealPriceFor, isPriceAffecting, specialTargetsOffering } from "@/lib/effective-price";
import {
  fetchSingleServingOfferings,
  fetchSpecials,
  type OfferingRow,
  type SpecialRow,
} from "@/lib/venue-data";

import { CATEGORY_LABELS } from "@/lib/format";

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
  hours: VenueHours;
};

type ActiveDeal = {
  /** Display label: the beer's name, or the category label for category deals. */
  label: string;
  beer_name: string | null;
  category: string | null;
  effective_price: number;
  effective_price_per_12oz: number;
  original_price: number;
  ends_at: string; // ISO
  free_text: string | null;
};

function per12oz(price: number, sizeOz: number): number {
  return Math.round((price / sizeOz) * 12 * 100) / 100;
}

/**
 * A special's card for the Happening Now list: priced off the cheapest
 * (per-12oz) single-serving offering it applies to. Null when the special is
 * inactive, free-text-only, or matches no priceable offering.
 */
function dealCard(
  special: SpecialRow,
  offerings: OfferingRow[],
  now: Date,
): ActiveDeal | null {
  if (!isPriceAffecting(special)) return null;
  const endsAt = activeWindowEnd(special, now);
  if (endsAt === null) return null;

  let best: { o: OfferingRow; price: number; per12: number } | null = null;
  for (const o of offerings) {
    if (!specialTargetsOffering(special, o)) continue;
    const price = dealPriceFor(special, o.price);
    if (price === null) continue;
    const per12 = per12oz(price, o.size_oz);
    if (best === null || per12 < best.per12 || (per12 === best.per12 && price < best.price)) {
      best = { o, price, per12 };
    }
  }
  if (best === null) return null;

  const isOffering = special.target_type === "offering";
  return {
    label: isOffering
      ? best.o.beer_name
      : (CATEGORY_LABELS[special.category ?? ""] ?? "Special"),
    beer_name: isOffering ? best.o.beer_name : null,
    category: isOffering ? null : special.category,
    effective_price: best.price,
    effective_price_per_12oz: best.per12,
    original_price: best.o.price,
    ends_at: endsAt.toISOString(),
    free_text: special.free_text,
  };
}

async function respond(input: AreaInput) {
  const area = parseArea(input);
  if (!area.ok) return badRequest(area.error);

  try {
    const [venues, [{ covered }]] = await Promise.all([
      sql<VenueRow[]>`
        select
          v.id, v.slug, v.name, v.address,
          st_x(v.location::geometry)::float8 as lng,
          st_y(v.location::geometry)::float8 as lat,
          v.hours
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
      // Hours use the same start-day / midnight-crossing semantics as specials;
      // null hours = unknown = treated as open (never hide for missing data).
      if (!isVenueOpen(v.hours, now)) continue;

      const venueOfferings = offerings.filter((o) => o.venue_id === v.id);
      const deals = specials
        .filter((s) => s.venue_id === v.id)
        .map((s) => dealCard(s, venueOfferings, now))
        .filter((d): d is ActiveDeal => d !== null)
        .sort(
          (a, b) =>
            a.effective_price_per_12oz - b.effective_price_per_12oz ||
            a.effective_price - b.effective_price,
        );
      if (deals.length === 0) continue;

      results.push({
        id: v.id,
        slug: v.slug,
        name: v.name,
        address: v.address,
        lng: v.lng,
        lat: v.lat,
        cheapest_active_deal_per_12oz: deals[0].effective_price_per_12oz,
        deals,
      });
    }

    results.sort(
      (a, b) =>
        a.cheapest_active_deal_per_12oz - b.cheapest_active_deal_per_12oz ||
        a.name.localeCompare(b.name),
    );

    return Response.json({ coverage: covered, venues: results });
  } catch {
    return badRequest("Could not interpret the search area");
  }
}

/**
 * GET /api/happening-now?center=<lng>,<lat>&radiusMiles=1
 * GET /api/happening-now?polygon=[[lng,lat],...]
 *
 * Venues (open right now, or hours unknown) with at least one currently active
 * price-affecting special, sorted by their cheapest active deal per-12oz.
 * Free-text-only specials never qualify a venue (invisible to ranking, spec §9).
 */
export async function GET(req: Request) {
  return respond(areaInputFromSearchParams(new URL(req.url).searchParams));
}

/** POST accepts the same JSON body as /api/search: { polygon } or { center, radiusMiles }. */
export async function POST(req: Request) {
  let body: AreaInput;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  return respond(body);
}
