import { describe, expect, it } from "vitest";
import {
  dealMechanicLabel,
  hoursSlotsLabel,
  scheduleDaysLabel,
  scheduleTimesLabel,
  untilLabel,
} from "@/lib/format";

describe("scheduleDaysLabel", () => {
  it("compresses 3+ consecutive days into a range", () => {
    expect(scheduleDaysLabel([1, 2, 3, 4, 5])).toBe("Mon–Fri");
  });
  it("joins two days with an ampersand", () => {
    expect(scheduleDaysLabel([2, 4])).toBe("Tue & Thu");
    expect(scheduleDaysLabel([5, 6])).toBe("Fri & Sat");
  });
  it("labels every day as Daily", () => {
    expect(scheduleDaysLabel([0, 1, 2, 3, 4, 5, 6])).toBe("Daily");
  });
  it("mixes ranges and singles", () => {
    expect(scheduleDaysLabel([0, 2, 3, 4])).toBe("Sun & Tue–Thu");
  });
  it("dedupes and sorts", () => {
    expect(scheduleDaysLabel([4, 2, 2])).toBe("Tue & Thu");
  });
});

describe("scheduleTimesLabel", () => {
  it("shares the meridiem when both ends match", () => {
    expect(scheduleTimesLabel("17:00", "20:00")).toBe("5–8 PM");
  });
  it("writes both meridiems across noon or midnight", () => {
    expect(scheduleTimesLabel("22:00", "01:00")).toBe("10 PM–1 AM");
    expect(scheduleTimesLabel("11:00", "14:00")).toBe("11 AM–2 PM");
  });
  it("keeps minutes when not on the hour", () => {
    expect(scheduleTimesLabel("11:30", "13:00")).toBe("11:30 AM–1 PM");
  });
  it("does not share a meridiem for midnight-crossing same-meridiem windows", () => {
    // 10 PM–1 AM crosses midnight; 1:00 is AM, 22:00 is PM — both written.
    expect(scheduleTimesLabel("13:00", "12:00")).toBe("1 PM–12 PM");
  });
});

describe("hoursSlotsLabel", () => {
  it("renders a normal day", () => {
    expect(hoursSlotsLabel([["16:00", "01:00"]])).toBe("4:00 PM – 1:00 AM");
  });
  it("renders a midnight-crossing Friday naturally", () => {
    expect(hoursSlotsLabel([["15:00", "03:00"]])).toBe("3:00 PM – 3:00 AM");
  });
  it("renders Closed for missing days", () => {
    expect(hoursSlotsLabel(null)).toBe("Closed");
    expect(hoursSlotsLabel([])).toBe("Closed");
  });
  it("joins multiple slots", () => {
    expect(
      hoursSlotsLabel([
        ["11:00", "14:00"],
        ["17:00", "23:00"],
      ]),
    ).toBe("11:00 AM – 2:00 PM, 5:00 PM – 11:00 PM");
  });
});

describe("untilLabel", () => {
  it("formats the end in America/Chicago", () => {
    // 2026-08-21T19:00:00-05:00 (CDT) = 7:00 PM Chicago.
    expect(untilLabel("2026-08-22T00:00:00.000Z")).toBe("until 7:00 PM");
  });
  it("formats a next-day end as a plain time", () => {
    // 1:00 AM CDT next day.
    expect(untilLabel("2026-08-22T06:00:00.000Z")).toBe("until 1:00 AM");
  });
});

describe("dealMechanicLabel", () => {
  it("prefers deal_price", () => {
    expect(dealMechanicLabel({ deal_price: 2, discount_amount: null })).toBe("$2.00");
  });
  it("renders discounts as $X off", () => {
    expect(dealMechanicLabel({ deal_price: null, discount_amount: 1 })).toBe("$1.00 off");
  });
  it("is null for free-text-only specials", () => {
    expect(dealMechanicLabel({ deal_price: null, discount_amount: null })).toBeNull();
  });
});
