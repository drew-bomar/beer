"use client";

import { DAY_KEYS, type DayKey, type WeeklyHours } from "../_lib/constants";

const DAY_LABELS: Record<DayKey, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

/**
 * Weekly hours editor for the venues.hours jsonb shape:
 * {"mon":[["16:00","01:00"]],...} — closed days omitted. A close time earlier
 * than the open time means the range runs past midnight.
 */
export default function HoursEditor({
  value,
  onChange,
}: {
  value: WeeklyHours;
  onChange: (v: WeeklyHours) => void;
}) {
  const setDay = (day: DayKey, ranges: [string, string][]) => {
    const next = { ...value };
    if (ranges.length === 0) delete next[day];
    else next[day] = ranges;
    onChange(next);
  };

  return (
    <div className="space-y-1">
      {DAY_KEYS.map((day) => {
        const ranges = value[day] ?? [];
        return (
          <div key={day} className="flex flex-wrap items-center gap-2 text-sm">
            <span className="w-10 font-medium">{DAY_LABELS[day]}</span>
            {ranges.length === 0 && <span className="text-gray-400">Closed</span>}
            {ranges.map(([open, close], i) => (
              <span key={i} className="flex items-center gap-1">
                <input
                  type="time"
                  value={open}
                  onChange={(e) =>
                    setDay(day, ranges.map((r, j) => (j === i ? [e.target.value, r[1]] : r)))
                  }
                  className="rounded border border-gray-300 px-1 py-0.5"
                />
                –
                <input
                  type="time"
                  value={close}
                  onChange={(e) =>
                    setDay(day, ranges.map((r, j) => (j === i ? [r[0], e.target.value] : r)))
                  }
                  className="rounded border border-gray-300 px-1 py-0.5"
                />
                {close !== "" && open !== "" && close < open && (
                  <span className="text-xs text-amber-600" title="Closes after midnight">
                    +1d
                  </span>
                )}
                <button
                  type="button"
                  aria-label={`Remove ${DAY_LABELS[day]} range`}
                  onClick={() => setDay(day, ranges.filter((_, j) => j !== i))}
                  className="px-1 text-gray-400 hover:text-red-600"
                >
                  ✕
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setDay(day, [...ranges, ["16:00", "23:00"]])}
              className="text-xs text-blue-600 hover:underline"
            >
              + range
            </button>
          </div>
        );
      })}
    </div>
  );
}
