// BEE-24: pure schedule-window engine for specials and venue hours.
//
// All windows are interpreted in America/Chicago local time (the product is
// St. Louis-only). A window belongs to its START day: a Friday 22:00–01:00
// special is still "Friday's special" at Saturday 00:30. `end < start` means
// the window crosses midnight (spec §9 / CLAUDE.md). Starts are inclusive,
// ends are exclusive — a deal ends exactly at its end_time.
//
// Pure functions only: no DB access, "now" is always injected.

export const DEAL_TIME_ZONE = "America/Chicago";

/** The schedule shape shared by `specials` rows (0=Sun … 6=Sat, start-day semantics). */
export type ScheduleWindow = {
  days_of_week: number[];
  start_time: string; // "HH:MM" or "HH:MM:SS"
  end_time: string; // "HH:MM" or "HH:MM:SS"; < start_time ⇒ crosses midnight
};

/** venues.hours jsonb: {"mon":[["16:00","01:00"]], ...}. Missing/null day ⇒ closed. */
export type VenueHours = Partial<Record<string, [string, string][] | null>> | null;

type LocalParts = {
  year: number;
  month: number; // 1–12
  day: number; // 1–31
  weekday: number; // 0=Sun … 6=Sat
  minutes: number; // minutes since local midnight, seconds truncated
};

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const HOURS_KEY_FOR_WEEKDAY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: DEAL_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  weekday: "short",
});

/** Chicago-local calendar parts for an absolute instant. */
function localParts(instant: Date): LocalParts {
  const out: Record<string, string> = {};
  for (const p of partsFormatter.formatToParts(instant)) out[p.type] = p.value;
  return {
    year: Number(out.year),
    month: Number(out.month),
    day: Number(out.day),
    weekday: WEEKDAY_INDEX[out.weekday],
    minutes: Number(out.hour) * 60 + Number(out.minute),
  };
}

/** "HH:MM" / "HH:MM:SS" → minutes since midnight. Returns null for garbage. */
export function parseTimeToMinutes(time: string): number | null {
  const m = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(time);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 24 || min > 59) return null;
  return h * 60 + min;
}

/** Calendar-date arithmetic (pure Gregorian math, no timezone involvement). */
function shiftDate(
  d: { year: number; month: number; day: number },
  days: number,
): { year: number; month: number; day: number } {
  const t = new Date(Date.UTC(d.year, d.month - 1, d.day + days));
  return { year: t.getUTCFullYear(), month: t.getUTCMonth() + 1, day: t.getUTCDate() };
}

/**
 * Absolute instant for a Chicago wall-clock time on a Chicago calendar date.
 * Iterative fixpoint using Intl only — converges in ≤2 rounds and handles both
 * DST offsets. During the nonexistent spring-forward hour it lands on the
 * instant the clock skips to; for the repeated fall-back hour it picks one of
 * the two occurrences (which one is unspecified — fine for deal-end display).
 */
export function chicagoWallTimeToInstant(
  date: { year: number; month: number; day: number },
  minutes: number,
): Date {
  let ts = Date.UTC(date.year, date.month - 1, date.day, 0, minutes);
  for (let i = 0; i < 3; i++) {
    const p = localParts(new Date(ts));
    const guessWall = Date.UTC(p.year, p.month - 1, p.day, 0, p.minutes);
    const wantWall = Date.UTC(date.year, date.month - 1, date.day, 0, minutes);
    const diff = wantWall - guessWall;
    if (diff === 0) break;
    ts += diff;
  }
  return new Date(ts);
}

/**
 * If the window is active at `now`, returns the absolute instant the active
 * occurrence ends (for "until 1:00 AM" display). Otherwise null.
 *
 * start inclusive, end exclusive; start == end is a zero-length window and
 * never active.
 */
export function activeWindowEnd(window: ScheduleWindow, now: Date): Date | null {
  const start = parseTimeToMinutes(window.start_time);
  const end = parseTimeToMinutes(window.end_time);
  if (start === null || end === null) return null;

  const p = localParts(now);
  const crossesMidnight = end < start;

  // Started today?
  if (window.days_of_week.includes(p.weekday) && p.minutes >= start) {
    if (crossesMidnight) {
      // Runs into tomorrow's early morning.
      return chicagoWallTimeToInstant(shiftDate(p, 1), end);
    }
    if (p.minutes < end) return chicagoWallTimeToInstant(p, end);
  }

  // Started yesterday and crossed midnight into right now?
  if (crossesMidnight) {
    const yesterdayWeekday = (p.weekday + 6) % 7;
    if (window.days_of_week.includes(yesterdayWeekday) && p.minutes < end) {
      return chicagoWallTimeToInstant(p, end);
    }
  }

  return null;
}

/** True when the window is active at `now` (America/Chicago, start-day semantics). */
export function isWindowActive(window: ScheduleWindow, now: Date): boolean {
  return activeWindowEnd(window, now) !== null;
}

/**
 * Venue open-state from the `hours` jsonb. Same start-day / cross-midnight
 * semantics as specials (fri 15:00–03:00 is open Saturday 02:00). A `null`
 * hours value means "unknown" and is treated as OPEN — never hide a venue for
 * missing data. A missing or null day key means closed that day.
 */
export function isVenueOpen(hours: VenueHours, now: Date): boolean {
  if (hours == null) return true;

  const check = (weekday: number): boolean => {
    const slots = hours[HOURS_KEY_FOR_WEEKDAY[weekday]];
    if (!Array.isArray(slots)) return false;
    return slots.some(
      (slot) =>
        Array.isArray(slot) &&
        slot.length === 2 &&
        isWindowActive(
          { days_of_week: [weekday], start_time: slot[0], end_time: slot[1] },
          now,
        ),
    );
  };

  const today = localParts(now).weekday;
  return check(today) || check((today + 6) % 7);
}
