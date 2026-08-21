// Pure display formatting shared by the result cards and the venue page.
// All clock display is America/Chicago (the product is St. Louis-only).

import { DEAL_TIME_ZONE, parseTimeToMinutes } from "@/lib/deals";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: DEAL_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});

/** ISO instant → "7:00 PM" Chicago wall time. */
export function chicagoTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

/**
 * Deal end display (BEE-20): always just the Chicago wall-clock time —
 * "until 7:00 PM", and for a window that crosses into the next calendar
 * day simply "until 1:00 AM" (no "tomorrow" wording).
 */
export function untilLabel(endsAtIso: string): string {
  return `until ${chicagoTime(endsAtIso)}`;
}

export function updatedLabel(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions =
    d.getFullYear() === now.getFullYear()
      ? { month: "short", day: "numeric" }
      : { month: "short", day: "numeric", year: "numeric" };
  return `updated ${d.toLocaleDateString("en-US", opts)}`;
}

/** "$3.00 pint" style serving descriptor. */
export function servingLabel(o: { format: string; size_oz: number }): string {
  if (o.format === "draft" && o.size_oz === 16) return "pint";
  const size = Number.isInteger(o.size_oz) ? String(o.size_oz) : o.size_oz.toFixed(1);
  return `${size}oz ${o.format}`;
}

/** Display names for category-wide specials. */
export const CATEGORY_LABELS: Record<string, string> = {
  all_draft: "All draft beer",
  all_bottles_cans: "All bottles & cans",
  all_beer: "All beer",
};

/** The price mechanic of a structured special: "$2.00" or "$1.00 off". */
export function dealMechanicLabel(special: {
  deal_price: number | null;
  discount_amount: number | null;
}): string | null {
  if (special.deal_price !== null) return `$${special.deal_price.toFixed(2)}`;
  if (special.discount_amount !== null)
    return `$${special.discount_amount.toFixed(2)} off`;
  return null;
}

const DAY_ABBREV = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Humanize a days_of_week array (0=Sun…6=Sat):
 * [1,2,3,4,5] → "Mon–Fri" · [2,4] → "Tue & Thu" · [0..6] → "Daily".
 * Runs of 3+ consecutive days compress to a range.
 */
export function scheduleDaysLabel(days: number[]): string {
  const uniq = [...new Set(days)].filter((d) => d >= 0 && d <= 6).sort((a, b) => a - b);
  if (uniq.length === 0) return "";
  if (uniq.length === 7) return "Daily";

  const parts: string[] = [];
  let i = 0;
  while (i < uniq.length) {
    let j = i;
    while (j + 1 < uniq.length && uniq[j + 1] === uniq[j] + 1) j++;
    if (j - i >= 2) parts.push(`${DAY_ABBREV[uniq[i]]}–${DAY_ABBREV[uniq[j]]}`);
    else for (let k = i; k <= j; k++) parts.push(DAY_ABBREV[uniq[k]]);
    i = j + 1;
  }
  if (parts.length === 2) return `${parts[0]} & ${parts[1]}`;
  return parts.join(", ");
}

type ClockParts = { hour12: number; minutes: number; meridiem: "AM" | "PM" };

function clockParts(totalMinutes: number): ClockParts {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const meridiem = h24 < 12 ? "AM" : "PM";
  const hour12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return { hour12, minutes: m % 60, meridiem };
}

function compactClock(p: ClockParts, withMeridiem: boolean): string {
  const base = p.minutes === 0 ? `${p.hour12}` : `${p.hour12}:${String(p.minutes).padStart(2, "0")}`;
  return withMeridiem ? `${base} ${p.meridiem}` : base;
}

/**
 * Humanize a special's window: "17:00"–"20:00" → "5–8 PM",
 * "22:00"–"01:00" → "10 PM–1 AM", "11:30"–"13:00" → "11:30 AM–1 PM".
 * A shared meridiem is written once, on the end time.
 */
export function scheduleTimesLabel(startTime: string, endTime: string): string {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (start === null || end === null) return "";
  const s = clockParts(start);
  const e = clockParts(end);
  const shared = s.meridiem === e.meridiem && end > start;
  return `${compactClock(s, !shared)}–${compactClock(e, true)}`;
}

/** Full clock for hours rows: "15:00" → "3:00 PM". */
export function hoursClock(time: string): string {
  const m = parseTimeToMinutes(time);
  if (m === null) return time;
  const p = clockParts(m);
  return `${p.hour12}:${String(p.minutes).padStart(2, "0")} ${p.meridiem}`;
}

/**
 * One day's open slots: [["15:00","03:00"]] → "3:00 PM – 3:00 AM".
 * A midnight-crossing slot reads naturally without extra annotation.
 */
export function hoursSlotsLabel(slots: [string, string][] | null | undefined): string {
  if (!Array.isArray(slots) || slots.length === 0) return "Closed";
  return slots
    .filter((s) => Array.isArray(s) && s.length === 2)
    .map(([open, close]) => `${hoursClock(open)} – ${hoursClock(close)}`)
    .join(", ");
}
