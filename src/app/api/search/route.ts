import { sql } from "@/lib/db";
import { parseArea, type AreaInput } from "@/lib/search-area";
import { effectivePrices, type EffectivePrice } from "@/lib/effective-price";
import {
  fetchOfferings,
  fetchSpecials,
  SINGLE_SERVING,
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

const FILTER_FORMATS: readonly string[] = ["draft", "bottle", "can", "pitcher"];
const MAX_BRAND_QUERY = 80;

type Filters = {
  brand: string | null; // lowercased, trimmed
  formats: string[] | null; // null = default (single-serving)
  activeDealsOnly: boolean;
};

type FilterInput = AreaInput & {
  brand?: unknown;
  formats?: unknown;
  activeDealsOnly?: unknown;
};

function parseFilters(body: FilterInput): { ok: true; filters: Filters } | { ok: false; error: string } {
  let brand: string | null = null;
  if (body.brand !== undefined) {
    if (typeof body.brand !== "string") return { ok: false, error: "`brand` must be a string" };
    const trimmed = body.brand.trim().slice(0, MAX_BRAND_QUERY).toLowerCase();
    brand = trimmed === "" ? null : trimmed;
  }

  let formats: string[] | null = null;
  if (body.formats !== undefined) {
    if (
      !Array.isArray(body.formats) ||
      !body.formats.every((f): f is string => typeof f === "string" && FILTER_FORMATS.includes(f))
    ) {
      return { ok: false, error: "`formats` must be an array of draft|bottle|can|pitcher" };
    }
    const uniq = [...new Set(body.formats)];
    formats = uniq.length === 0 ? null : uniq;
  }

  if (body.activeDealsOnly !== undefined && typeof body.activeDealsOnly !== "boolean") {
    return { ok: false, error: "`activeDealsOnly` must be a boolean" };
  }

  return {
    ok: true,
    filters: { brand, formats, activeDealsOnly: body.activeDealsOnly === true },
  };
}

/**
 * POST /api/search
 * Body: { polygon: [[lng,lat], ...] }  OR  { center: [lng,lat], radiusMiles: number }
 * plus optional filters (BEE-22): { brand?, formats?, activeDealsOnly? }.
 *
 * The search area is used transiently for this query only — nothing about it
 * (including GPS-derived centers) is ever written to the database.
 *
 * Ranking (BEE-24): a venue ranks by the cheapest EFFECTIVE per-12oz across its
 * single-serving offerings — active structured specials substitute their price.
 *
 * Filters narrow the candidate offerings BEFORE the cheapest is chosen, so
 * ranking stays correct:
 * - brand: case-insensitive substring of offerings.brand or beer_name.
 * - formats: only those formats compete. Pitchers never rank by default
 *   (CLAUDE.md) — they join only when "pitcher" is explicitly chosen, ranked
 *   by per-12oz among the selected formats and labeled as pitchers client-side.
 * - activeDealsOnly: only offerings currently on a structured deal compete;
 *   venues without one disappear. The returned cheapest is therefore a deal.
 */
export async function POST(req: Request) {
  let body: FilterInput;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const area = parseArea(body);
  if (!area.ok) return badRequest(area.error);
  const parsedFilters = parseFilters(body);
  if (!parsedFilters.ok) return badRequest(parsedFilters.error);
  const { brand, formats, activeDealsOnly } = parsedFilters.filters;

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
      fetchOfferings(venueIds, formats ?? SINGLE_SERVING),
      fetchSpecials(venueIds),
    ]);

    const brandMatch = (o: OfferingRow) =>
      brand === null ||
      o.beer_name.toLowerCase().includes(brand) ||
      (o.brand !== null && o.brand.toLowerCase().includes(brand));

    const now = new Date();
    const results = [];
    // With no filters active, venues without any priced offering still appear
    // (cheapest: null, ranked last) — a seeded roster must never be invisible,
    // and their cards double as a "know the prices? add them" prompt (spec §14).
    const filtersActive = brand !== null || formats !== null || activeDealsOnly;
    const unpriced = [];
    for (const v of venues) {
      const venueOfferings = offerings.filter(
        (o) => o.venue_id === v.id && brandMatch(o),
      );
      if (venueOfferings.length === 0) {
        if (!filtersActive) unpriced.push({ ...v, cheapest: null });
        continue;
      }
      const priced = effectivePrices(
        venueOfferings,
        specials.filter((s) => s.venue_id === v.id),
        now,
      );

      // Cheapest by effective per-12oz (then effective price) — the ranking key.
      // Pitchers (only present when explicitly filtered in) never get deal
      // pricing; their effective values are their sticker values.
      let cheapest: { o: OfferingRow; p: EffectivePrice } | null = null;
      for (const o of venueOfferings) {
        const p: EffectivePrice = priced.get(o.id) ?? {
          effectivePrice: o.price,
          effectivePricePer12oz: o.price_per_12oz,
          onDeal: false,
          dealEndsAt: null,
          originalPrice: o.price,
          originalPricePer12oz: o.price_per_12oz,
        };
        if (activeDealsOnly && !p.onDeal) continue;
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
    unpriced.sort((a, b) => a.name.localeCompare(b.name));

    return Response.json({ coverage: covered, venues: [...results, ...unpriced] });
  } catch {
    // Degenerate geometry (e.g. all vertices collinear) can make PostGIS throw.
    return badRequest("Could not interpret the search area");
  }
}
