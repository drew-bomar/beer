import { describe, expect, it } from "vitest";
import {
  activeWindowEnd,
  chicagoWallTimeToInstant,
  isVenueOpen,
  isWindowActive,
  parseTimeToMinutes,
  type ScheduleWindow,
} from "./deals";

// All fixtures are stated with explicit UTC offsets so the tests are
// independent of the machine's local timezone.
// America/Chicago: CDT = UTC-5 (summer), CST = UTC-6 (winter).
// 2026 transitions: spring forward Sun Mar 8 (2:00→3:00), fall back Sun Nov 1.

const at = (iso: string) => new Date(iso);

// The seeded Test Tap special: Tue/Thu 17:00–20:00 (times as postgres returns them).
const happyHour: ScheduleWindow = {
  days_of_week: [2, 4],
  start_time: "17:00:00",
  end_time: "20:00:00",
};

// The seeded Dev's Dive late-night window: Fri/Sat 22:00–01:00 (crosses midnight).
const lateNight: ScheduleWindow = {
  days_of_week: [5, 6],
  start_time: "22:00:00",
  end_time: "01:00:00",
};

describe("parseTimeToMinutes", () => {
  it("accepts HH:MM and HH:MM:SS", () => {
    expect(parseTimeToMinutes("17:00")).toBe(1020);
    expect(parseTimeToMinutes("17:30:00")).toBe(1050);
    expect(parseTimeToMinutes("0:05")).toBe(5);
  });
  it("rejects garbage", () => {
    expect(parseTimeToMinutes("5pm")).toBeNull();
    expect(parseTimeToMinutes("25:00")).toBeNull();
    expect(parseTimeToMinutes("")).toBeNull();
  });
});

describe("normal (same-day) windows", () => {
  // Tue 2026-08-18 is in CDT (UTC-5).
  it("is active inside the window", () => {
    expect(isWindowActive(happyHour, at("2026-08-18T18:00:00-05:00"))).toBe(true);
  });

  it("is inactive before and after the window on the right day", () => {
    expect(isWindowActive(happyHour, at("2026-08-18T16:59:00-05:00"))).toBe(false);
    expect(isWindowActive(happyHour, at("2026-08-18T21:00:00-05:00"))).toBe(false);
  });

  it("start is inclusive", () => {
    expect(isWindowActive(happyHour, at("2026-08-18T17:00:00-05:00"))).toBe(true);
  });

  it("end is exclusive — the deal ends exactly at end_time", () => {
    expect(isWindowActive(happyHour, at("2026-08-18T19:59:59-05:00"))).toBe(true);
    expect(isWindowActive(happyHour, at("2026-08-18T20:00:00-05:00"))).toBe(false);
  });

  it("is inactive on other days at deal hours (Wed, Sat)", () => {
    expect(isWindowActive(happyHour, at("2026-08-19T18:00:00-05:00"))).toBe(false); // Wed
    expect(isWindowActive(happyHour, at("2026-08-22T18:00:00-05:00"))).toBe(false); // Sat
  });

  it("reports the absolute end of the active window", () => {
    const end = activeWindowEnd(happyHour, at("2026-08-18T18:00:00-05:00"));
    // Tue 20:00 CDT = 01:00Z Wednesday.
    expect(end?.toISOString()).toBe("2026-08-19T01:00:00.000Z");
  });

  it("a zero-length window (start == end) is never active", () => {
    const w: ScheduleWindow = { days_of_week: [2], start_time: "17:00", end_time: "17:00" };
    expect(isWindowActive(w, at("2026-08-18T17:00:00-05:00"))).toBe(false);
  });
});

describe("midnight-crossing windows (end < start)", () => {
  it("is active in the start-day evening portion", () => {
    // Fri 2026-08-21 23:00 CDT.
    expect(isWindowActive(lateNight, at("2026-08-21T23:00:00-05:00"))).toBe(true);
  });

  it("start is inclusive at 22:00", () => {
    expect(isWindowActive(lateNight, at("2026-08-21T22:00:00-05:00"))).toBe(true);
  });

  it("is active after midnight on the NEXT calendar day (start-day semantics)", () => {
    // Sat 2026-08-22 00:30 CDT — Friday's window still owns this.
    expect(isWindowActive(lateNight, at("2026-08-22T00:30:00-05:00"))).toBe(true);
    // Sun 2026-08-23 00:30 CDT — Saturday's window.
    expect(isWindowActive(lateNight, at("2026-08-23T00:30:00-05:00"))).toBe(true);
  });

  it("ends exactly at end_time after midnight", () => {
    expect(isWindowActive(lateNight, at("2026-08-22T00:59:59-05:00"))).toBe(true);
    expect(isWindowActive(lateNight, at("2026-08-22T01:00:00-05:00"))).toBe(false);
  });

  it("attributes the early morning to the START day, not the calendar day", () => {
    const fridayOnly: ScheduleWindow = { ...lateNight, days_of_week: [5] };
    // Sat 00:30: active because Friday started it…
    expect(isWindowActive(fridayOnly, at("2026-08-22T00:30:00-05:00"))).toBe(true);
    // …but Sat 23:00 is not: Saturday is not a start day.
    expect(isWindowActive(fridayOnly, at("2026-08-22T23:00:00-05:00"))).toBe(false);

    const saturdayOnly: ScheduleWindow = { ...lateNight, days_of_week: [6] };
    // Sat 00:30 is Friday's territory; a Saturday-only window is not active yet.
    expect(isWindowActive(saturdayOnly, at("2026-08-22T00:30:00-05:00"))).toBe(false);
  });

  it("is inactive between the morning end and the evening start", () => {
    expect(isWindowActive(lateNight, at("2026-08-22T12:00:00-05:00"))).toBe(false);
  });

  it("computes the absolute end across midnight, from both sides", () => {
    // Fri 23:00 → ends Sat 01:00 CDT = 06:00Z.
    expect(
      activeWindowEnd(lateNight, at("2026-08-21T23:00:00-05:00"))?.toISOString(),
    ).toBe("2026-08-22T06:00:00.000Z");
    // Sat 00:30 (same occurrence) → same absolute end.
    expect(
      activeWindowEnd(lateNight, at("2026-08-22T00:30:00-05:00"))?.toISOString(),
    ).toBe("2026-08-22T06:00:00.000Z");
  });
});

describe("DST (America/Chicago)", () => {
  it("uses CST offsets in winter", () => {
    // Tue 2026-01-13, CST (UTC-6): 18:00 CST active, ends 20:00 CST = 02:00Z.
    const end = activeWindowEnd(happyHour, at("2026-01-13T18:00:00-06:00"));
    expect(end?.toISOString()).toBe("2026-01-14T02:00:00.000Z");
  });

  it("handles a window spanning the spring-forward night (Mar 8 2026)", () => {
    const w: ScheduleWindow = { days_of_week: [6], start_time: "22:00", end_time: "03:00" };
    // Sat Mar 7 23:00 CST — active.
    expect(isWindowActive(w, at("2026-03-07T23:00:00-06:00"))).toBe(true);
    // Sun Mar 8 01:30 CST (before the jump) — still Saturday's window.
    expect(isWindowActive(w, at("2026-03-08T01:30:00-06:00"))).toBe(true);
    // Ends at 03:00 CDT (the wall clock jumps 2:00→3:00) = 08:00Z.
    expect(
      activeWindowEnd(w, at("2026-03-08T01:30:00-06:00"))?.toISOString(),
    ).toBe("2026-03-08T08:00:00.000Z");
    // 03:30 CDT — over.
    expect(isWindowActive(w, at("2026-03-08T03:30:00-05:00"))).toBe(false);
  });

  it("handles the fall-back night (Nov 1 2026): ends at the first 1:00 AM", () => {
    // Sat Oct 31 22:00–01:00; clocks repeat 1:00–2:00 on Sun Nov 1.
    expect(isWindowActive(lateNight, at("2026-10-31T23:00:00-05:00"))).toBe(true);
    // Sun 00:30 CDT — active; ends 01:00 CDT (first occurrence) = 06:00Z.
    expect(
      activeWindowEnd(lateNight, at("2026-11-01T00:30:00-05:00"))?.toISOString(),
    ).toBe("2026-11-01T06:00:00.000Z");
    // 01:30 CDT (06:30Z) and 01:30 CST (07:30Z) — both after the end.
    expect(isWindowActive(lateNight, at("2026-11-01T06:30:00Z"))).toBe(false);
    expect(isWindowActive(lateNight, at("2026-11-01T07:30:00Z"))).toBe(false);
  });

  it("chicagoWallTimeToInstant maps both offsets correctly", () => {
    expect(
      chicagoWallTimeToInstant({ year: 2026, month: 7, day: 4 }, 12 * 60).toISOString(),
    ).toBe("2026-07-04T17:00:00.000Z"); // noon CDT
    expect(
      chicagoWallTimeToInstant({ year: 2026, month: 12, day: 25 }, 12 * 60).toISOString(),
    ).toBe("2026-12-25T18:00:00.000Z"); // noon CST
  });
});

describe("isVenueOpen (hours jsonb)", () => {
  // Seed-style hours: fri 15:00–03:00 crosses midnight.
  const hours = {
    mon: [["16:00", "01:00"]] as [string, string][],
    fri: [["15:00", "03:00"]] as [string, string][],
    sun: [["12:00", "00:00"]] as [string, string][],
  };

  it("null hours = unknown = open (never hide for missing data)", () => {
    expect(isVenueOpen(null, at("2026-08-18T04:00:00-05:00"))).toBe(true);
    expect(isVenueOpen(undefined as unknown as null, at("2026-08-18T04:00:00-05:00"))).toBe(true);
  });

  it("open during a normal slot, closed outside it", () => {
    expect(isVenueOpen(hours, at("2026-08-21T16:00:00-05:00"))).toBe(true); // Fri 16:00
    expect(isVenueOpen(hours, at("2026-08-21T14:00:00-05:00"))).toBe(false); // Fri 14:00
  });

  it("friday hours keep the venue open Saturday 02:00 (start-day semantics)", () => {
    expect(isVenueOpen(hours, at("2026-08-22T02:00:00-05:00"))).toBe(true);
    expect(isVenueOpen(hours, at("2026-08-22T03:00:00-05:00"))).toBe(false); // closes at 03:00
  });

  it("a day missing from the object is closed", () => {
    expect(isVenueOpen(hours, at("2026-08-18T18:00:00-05:00"))).toBe(false); // Tue
  });

  it("a null day slot is closed", () => {
    expect(isVenueOpen({ tue: null }, at("2026-08-18T18:00:00-05:00"))).toBe(false);
  });

  it("sun 12:00–00:00 closes exactly at midnight", () => {
    expect(isVenueOpen(hours, at("2026-08-23T23:59:00-05:00"))).toBe(true); // Sun 23:59
    expect(isVenueOpen(hours, at("2026-08-24T00:00:00-05:00"))).toBe(false); // Mon 00:00
  });

  it("supports multiple slots per day", () => {
    const split = { tue: [["11:00", "14:00"], ["17:00", "23:00"]] as [string, string][] };
    expect(isVenueOpen(split, at("2026-08-18T12:00:00-05:00"))).toBe(true);
    expect(isVenueOpen(split, at("2026-08-18T15:00:00-05:00"))).toBe(false);
    expect(isVenueOpen(split, at("2026-08-18T18:00:00-05:00"))).toBe(true);
  });
});
