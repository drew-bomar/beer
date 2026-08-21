// Turn Postgres constraint violations into readable form errors.

type PgError = { code?: string; constraint_name?: string; message?: string };

const CONSTRAINT_MESSAGES: Record<string, string> = {
  specials_one_price_mechanic:
    "A special can have a deal price OR a discount amount, not both.",
  specials_target_matches:
    "Offering specials must pick an offering; category specials must pick a category (never both).",
  specials_days_of_week_check: "Days of week must be between 0 (Sun) and 6 (Sat).",
  offerings_size_oz_check: "Size must be greater than 0 oz.",
  offerings_price_check: "Price cannot be negative.",
  specials_deal_price_check: "Deal price cannot be negative.",
  specials_discount_amount_check: "Discount amount must be greater than 0.",
  venues_slug_key: "That slug is already in use by another venue.",
  coverage_areas_slug_key: "That slug is already in use by another coverage area.",
  offerings_venue_id_fkey: "Unknown venue.",
  specials_offering_id_fkey: "Unknown offering.",
  venues_district_id_fkey: "Unknown district.",
};

/** Returns a human-readable message for a DB error, or null if unrecognized. */
export function readablePgError(err: unknown): string | null {
  const e = err as PgError;
  if (!e || typeof e !== "object" || !e.code) return null;
  if (e.constraint_name && CONSTRAINT_MESSAGES[e.constraint_name]) {
    return CONSTRAINT_MESSAGES[e.constraint_name];
  }
  switch (e.code) {
    case "23505":
      return "A row with that unique value already exists.";
    case "23514":
      return `A database check constraint rejected this data${e.constraint_name ? ` (${e.constraint_name})` : ""}.`;
    case "23503":
      return "This row is referenced by other data and the reference is invalid or blocking.";
    case "22P02":
      return "One of the values has an invalid format.";
    default:
      return null;
  }
}

/** Wrap an action body: known DB errors become {error}, unknown errors rethrow. */
export async function withReadableDbErrors<T>(
  fn: () => Promise<T>,
): Promise<T | { error: string }> {
  try {
    return await fn();
  } catch (err) {
    const msg = readablePgError(err);
    if (msg) return { error: msg };
    throw err;
  }
}
