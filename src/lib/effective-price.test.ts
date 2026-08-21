import { describe, expect, it } from "vitest";
import {
  effectivePrices,
  type PriceableOffering,
  type PriceableSpecial,
} from "./effective-price";

// Tue 2026-08-18 18:00 CDT — inside the seeded Tue/Thu 17:00–20:00 window.
const DURING = new Date("2026-08-18T18:00:00-05:00");
// Tue 2026-08-18 21:00 CDT — same day, after the window.
const AFTER = new Date("2026-08-18T21:00:00-05:00");

// Mirrors the seeded Test Tap menu.
const buschDraft: PriceableOffering = { id: "busch", format: "draft", size_oz: 16, price: 3.0 };
const stagCan: PriceableOffering = { id: "stag", format: "can", size_oz: 12, price: 3.5 };
const brownDraft: PriceableOffering = { id: "brown", format: "draft", size_oz: 16, price: 6.0 };
const pitcher: PriceableOffering = { id: "pitcher", format: "pitcher", size_oz: 60, price: 9.0 };
const offerings = [buschDraft, stagCan, brownDraft, pitcher];

const base = { days_of_week: [2, 4], start_time: "17:00:00", end_time: "20:00:00" };

// The seeded $2.00 Busch Light special.
const buschSpecial: PriceableSpecial = {
  ...base,
  target_type: "offering",
  offering_id: "busch",
  category: null,
  deal_price: 2.0,
  discount_amount: null,
};

const special = (over: Partial<PriceableSpecial>): PriceableSpecial => ({
  ...buschSpecial,
  ...over,
});

describe("offering-targeted deal_price special (seeded $2 Busch Light)", () => {
  it("substitutes the deal price during the window", () => {
    const p = effectivePrices(offerings, [buschSpecial], DURING).get("busch")!;
    expect(p).toEqual({
      effectivePrice: 2.0,
      effectivePricePer12oz: 1.5, // 2.00 / 16oz * 12
      onDeal: true,
      dealEndsAt: "2026-08-19T01:00:00.000Z", // Tue 20:00 CDT
      originalPrice: 3.0,
      originalPricePer12oz: 2.25,
    });
  });

  it("leaves untargeted offerings alone", () => {
    const p = effectivePrices(offerings, [buschSpecial], DURING).get("stag")!;
    expect(p.onDeal).toBe(false);
    expect(p.effectivePrice).toBe(3.5);
    expect(p.dealEndsAt).toBeNull();
  });

  it("does nothing outside the window", () => {
    const p = effectivePrices(offerings, [buschSpecial], AFTER).get("busch")!;
    expect(p.onDeal).toBe(false);
    expect(p.effectivePrice).toBe(3.0);
    expect(p.effectivePricePer12oz).toBe(2.25);
  });
});

describe("category specials", () => {
  const dollarOffDrafts = special({
    target_type: "category",
    offering_id: null,
    category: "all_draft",
    deal_price: null,
    discount_amount: 1.0,
  });

  it("all_draft discounts drafts only", () => {
    const priced = effectivePrices(offerings, [dollarOffDrafts], DURING);
    expect(priced.get("busch")!.effectivePrice).toBe(2.0);
    expect(priced.get("busch")!.effectivePricePer12oz).toBe(1.5);
    expect(priced.get("brown")!.effectivePrice).toBe(5.0);
    expect(priced.get("stag")!.onDeal).toBe(false); // can, untouched
  });

  it("all_bottles_cans matches bottles and cans, not drafts", () => {
    const s = special({
      target_type: "category",
      offering_id: null,
      category: "all_bottles_cans",
      deal_price: null,
      discount_amount: 0.5,
    });
    const priced = effectivePrices(offerings, [s], DURING);
    expect(priced.get("stag")!.effectivePrice).toBe(3.0);
    expect(priced.get("busch")!.onDeal).toBe(false);
  });

  it("all_beer matches everything single-serving", () => {
    const s = special({
      target_type: "category",
      offering_id: null,
      category: "all_beer",
      deal_price: null,
      discount_amount: 0.5,
    });
    const priced = effectivePrices(offerings, [s], DURING);
    expect(priced.get("busch")!.effectivePrice).toBe(2.5);
    expect(priced.get("stag")!.effectivePrice).toBe(3.0);
    expect(priced.get("brown")!.effectivePrice).toBe(5.5);
  });

  it("discounts floor at $0", () => {
    const s = special({
      target_type: "category",
      offering_id: null,
      category: "all_beer",
      deal_price: null,
      discount_amount: 5.0,
    });
    const p = effectivePrices(offerings, [s], DURING).get("busch")!;
    expect(p.effectivePrice).toBe(0);
    expect(p.effectivePricePer12oz).toBe(0);
    expect(p.onDeal).toBe(true);
  });
});

describe("free-text-only specials", () => {
  it("never change prices even while active", () => {
    const s = special({
      target_type: "category",
      offering_id: null,
      category: "all_beer",
      deal_price: null,
      discount_amount: null,
    });
    const priced = effectivePrices(offerings, [s], DURING);
    expect(priced.get("busch")!.onDeal).toBe(false);
    expect(priced.get("busch")!.effectivePrice).toBe(3.0);
  });
});

describe("multiple applicable specials", () => {
  it("takes the cheapest result", () => {
    const dollarOff = special({
      target_type: "category",
      offering_id: null,
      category: "all_draft",
      deal_price: null,
      discount_amount: 1.0,
    });
    // $2 fixed beats $3-1 = $2? Equal — use a stronger one: $1.75 fixed.
    const fixed = special({ deal_price: 1.75 });
    const p = effectivePrices(offerings, [dollarOff, fixed], DURING).get("busch")!;
    expect(p.effectivePrice).toBe(1.75);
    expect(p.onDeal).toBe(true);
  });

  it("on a price tie, keeps the window that ends latest", () => {
    const shortWindow = special({ deal_price: 2.0, end_time: "19:00:00" });
    const longWindow = special({ deal_price: 2.0, end_time: "20:00:00" });
    const p = effectivePrices(offerings, [shortWindow, longWindow], DURING).get("busch")!;
    expect(p.dealEndsAt).toBe("2026-08-19T01:00:00.000Z"); // 20:00 CDT
  });
});

describe("non-ranking formats", () => {
  it("pitchers/buckets are excluded from effective pricing entirely", () => {
    const priced = effectivePrices(offerings, [buschSpecial], DURING);
    expect(priced.has("pitcher")).toBe(false);
  });
});
