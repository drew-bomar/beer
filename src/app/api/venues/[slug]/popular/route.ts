import { effectivePrices } from "@/lib/effective-price";
import {
  fetchSingleServingOfferings,
  fetchSpecials,
  fetchVenueBySlug,
} from "@/lib/venue-data";

export const dynamic = "force-dynamic";

/**
 * GET /api/venues/[slug]/popular  (BEE-21 card expansion)
 *
 * The venue's popular (is_popular) single-serving offerings with EFFECTIVE
 * (deal-adjusted) prices at request time, sorted by per-12oz. 404 for unknown
 * or non-active venues.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const venue = await fetchVenueBySlug(slug);
  if (!venue || venue.status !== "active") {
    return Response.json({ error: "Venue not found" }, { status: 404 });
  }

  const [offerings, specials] = await Promise.all([
    fetchSingleServingOfferings([venue.id]),
    fetchSpecials([venue.id]),
  ]);

  const now = new Date();
  const priced = effectivePrices(offerings, specials, now);

  const beers = offerings
    .filter((o) => o.is_popular)
    .map((o) => {
      const p = priced.get(o.id);
      const onDeal = p?.onDeal ?? false;
      return {
        id: o.id,
        beer_name: o.beer_name,
        brand: o.brand,
        format: o.format,
        size_oz: o.size_oz,
        size_assumed: o.size_assumed,
        price: p?.effectivePrice ?? o.price,
        price_per_12oz: p?.effectivePricePer12oz ?? o.price_per_12oz,
        on_deal: onDeal,
        deal_ends_at: onDeal ? (p?.dealEndsAt ?? null) : null,
        original_price: onDeal ? (p?.originalPrice ?? null) : null,
        original_price_per_12oz: onDeal ? (p?.originalPricePer12oz ?? null) : null,
        verified: o.verified,
        last_verified_at: o.last_verified_at,
      };
    })
    .sort(
      (a, b) =>
        a.price_per_12oz - b.price_per_12oz ||
        a.price - b.price ||
        a.beer_name.localeCompare(b.beer_name),
    );

  return Response.json({
    venue: { id: venue.id, slug: venue.slug, name: venue.name },
    beers,
  });
}
