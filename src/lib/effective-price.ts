// BEE-24: apply active specials to a venue's offerings → effective prices.
//
// Pure functions: no DB access, "now" injected. Only single-serving formats
// (draft/bottle/can) get effective prices — pitchers/buckets never rank
// (CLAUDE.md) so specials are not applied to them here.

import { activeWindowEnd, type ScheduleWindow } from "@/lib/deals";

export type SingleServingFormat = "draft" | "bottle" | "can";

export type PriceableOffering = {
  id: string;
  format: string; // offering_format; non-single-serving rows are ignored
  size_oz: number;
  price: number;
};

export type PriceableSpecial = ScheduleWindow & {
  target_type: "offering" | "category";
  offering_id: string | null;
  category: "all_draft" | "all_bottles_cans" | "all_beer" | null;
  deal_price: number | null;
  discount_amount: number | null;
};

export type EffectivePrice = {
  effectivePrice: number;
  effectivePricePer12oz: number;
  onDeal: boolean;
  /** ISO timestamp of when the winning deal's window ends; null when not on deal. */
  dealEndsAt: string | null;
  originalPrice: number;
  originalPricePer12oz: number;
};

export const SINGLE_SERVING_FORMATS: ReadonlySet<string> = new Set([
  "draft",
  "bottle",
  "can",
]);

function per12oz(price: number, sizeOz: number): number {
  return Math.round((price / sizeOz) * 12 * 100) / 100;
}

/** Does an active special target this offering? */
export function specialTargetsOffering(
  special: Pick<PriceableSpecial, "target_type" | "offering_id" | "category">,
  offering: Pick<PriceableOffering, "id" | "format">,
): boolean {
  if (special.target_type === "offering") return special.offering_id === offering.id;
  switch (special.category) {
    case "all_draft":
      return offering.format === "draft";
    case "all_bottles_cans":
      return offering.format === "bottle" || offering.format === "can";
    case "all_beer":
      return true;
    default:
      return false;
  }
}

/** True when the special actually changes a price (free-text-only ones never do). */
export function isPriceAffecting(
  special: Pick<PriceableSpecial, "deal_price" | "discount_amount">,
): boolean {
  return special.deal_price !== null || special.discount_amount !== null;
}

/** The price a special produces for a given sticker price (floor at $0). */
export function dealPriceFor(
  special: Pick<PriceableSpecial, "deal_price" | "discount_amount">,
  stickerPrice: number,
): number | null {
  if (special.deal_price !== null) return special.deal_price;
  if (special.discount_amount !== null)
    return Math.max(0, Math.round((stickerPrice - special.discount_amount) * 100) / 100);
  return null; // free-text-only: never changes prices
}

/**
 * Effective price of every single-serving offering at `now`, given the venue's
 * specials. Offerings in non-ranking formats (pitcher/bucket) are omitted.
 * When multiple active specials apply to one offering, the cheapest result
 * wins (ties: the window ending latest, so the display end time is honest).
 */
export function effectivePrices(
  offerings: PriceableOffering[],
  specials: PriceableSpecial[],
  now: Date,
): Map<string, EffectivePrice> {
  // Evaluate each special's window once, not once per offering.
  const active = specials
    .filter(isPriceAffecting)
    .map((s) => ({ special: s, endsAt: activeWindowEnd(s, now) }))
    .filter((s): s is { special: PriceableSpecial; endsAt: Date } => s.endsAt !== null);

  const out = new Map<string, EffectivePrice>();

  for (const o of offerings) {
    if (!SINGLE_SERVING_FORMATS.has(o.format)) continue;

    let best: { price: number; endsAt: Date } | null = null;
    for (const { special, endsAt } of active) {
      if (!specialTargetsOffering(special, o)) continue;
      const price = dealPriceFor(special, o.price);
      if (price === null) continue;
      if (
        best === null ||
        price < best.price ||
        (price === best.price && endsAt.getTime() > best.endsAt.getTime())
      ) {
        best = { price, endsAt };
      }
    }

    const effective = best?.price ?? o.price;
    out.set(o.id, {
      effectivePrice: effective,
      effectivePricePer12oz: per12oz(effective, o.size_oz),
      onDeal: best !== null,
      dealEndsAt: best ? best.endsAt.toISOString() : null,
      originalPrice: o.price,
      originalPricePer12oz: per12oz(o.price, o.size_oz),
    });
  }

  return out;
}
