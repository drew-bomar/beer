// Shared enum values + types for the admin console. Mirrors db/migrations/0001_init.sql.

export const OFFERING_FORMATS = ["draft", "bottle", "can", "pitcher", "bucket"] as const;
export type OfferingFormat = (typeof OFFERING_FORMATS)[number];

export const PRICE_SOURCES = [
  "official_site",
  "menu_photo",
  "venue_confirmed",
  "admin_visit",
  "user_report",
] as const;
export type PriceSource = (typeof PRICE_SOURCES)[number];

export const VENUE_STATUSES = ["active", "closed", "hidden"] as const;
export type VenueStatus = (typeof VENUE_STATUSES)[number];

export const SPECIAL_CATEGORIES = ["all_draft", "all_bottles_cans", "all_beer"] as const;
export type SpecialCategory = (typeof SPECIAL_CATEGORIES)[number];

export const SPECIAL_CATEGORY_LABELS: Record<SpecialCategory, string> = {
  all_draft: "All draft",
  all_bottles_cans: "All bottles & cans",
  all_beer: "All beer",
};

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayKey = (typeof DAY_KEYS)[number];

/** days_of_week in specials: 0 = Sunday … 6 = Saturday. */
export const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Weekly hours jsonb shape: {"mon":[["16:00","01:00"]],...}; closed days omitted. */
export type WeeklyHours = Partial<Record<DayKey, [string, string][]>>;

/** Assumed serving sizes (spec: unknown size → 12oz bottle/can, 16oz draft). */
export function assumedSizeOz(format: OfferingFormat): number | null {
  if (format === "bottle" || format === "can") return 12;
  if (format === "draft") return 16;
  return null; // pitcher/bucket: size must be entered
}

export function pricePer12oz(price: number, sizeOz: number): number {
  return Math.round((price / sizeOz) * 12 * 100) / 100;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
