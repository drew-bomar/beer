"use client";

import { useEffect, useRef } from "react";
import type { CheapestOffering, LngLat, SearchResponse, VenueResult } from "@/lib/types";
import { haversineMiles } from "@/lib/geo";

type RequestState = "idle" | "sending" | "sent" | "error";

type ResultsSheetProps = {
  results: SearchResponse | null;
  searching: boolean;
  hasArea: boolean;
  userPos: LngLat | null;
  selectedVenueId: string | null;
  expanded: boolean;
  requestState: RequestState;
  onToggle: () => void;
  onSelectVenue: (v: VenueResult) => void;
  onRequestArea: () => void;
};

function servingLabel(o: CheapestOffering): string {
  if (o.format === "draft" && o.size_oz === 16) return "pint";
  const size = Number.isInteger(o.size_oz) ? String(o.size_oz) : o.size_oz.toFixed(1);
  return `${size}oz ${o.format}`;
}

function updatedLabel(iso: string): string {
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions =
    d.getFullYear() === new Date().getFullYear()
      ? { month: "short", day: "numeric" }
      : { month: "short", day: "numeric", year: "numeric" };
  return `updated ${d.toLocaleDateString("en-US", opts)}`;
}

function VenueCard({
  venue,
  userPos,
  selected,
  onSelect,
}: {
  venue: VenueResult;
  userPos: LngLat | null;
  selected: boolean;
  onSelect: (v: VenueResult) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  const o = venue.cheapest;
  const distance =
    userPos !== null ? haversineMiles(userPos, [venue.lng, venue.lat]) : null;

  return (
    <button
      ref={ref}
      onClick={() => onSelect(venue)}
      className={`w-full rounded-xl border p-3 text-left transition-colors ${
        selected
          ? "border-amber-500 bg-amber-50"
          : "border-neutral-200 bg-white active:bg-neutral-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="truncate font-semibold text-neutral-900">{venue.name}</span>
            {distance !== null && (
              <span className="shrink-0 text-xs text-neutral-500">
                {distance.toFixed(1)} mi
              </span>
            )}
          </div>
          <div className="mt-0.5 truncate text-sm text-neutral-700">
            {o.beer_name} · ${o.price.toFixed(2)} {servingLabel(o)}
            {o.size_assumed && (
              <span className="text-neutral-400"> (size assumed)</span>
            )}
          </div>
          <div className="mt-1 text-xs text-neutral-400">{updatedLabel(o.last_verified_at)}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xl font-bold text-amber-700">
            ${o.price_per_12oz.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-500">/ 12oz</div>
        </div>
      </div>
    </button>
  );
}

export default function ResultsSheet({
  results,
  searching,
  hasArea,
  userPos,
  selectedVenueId,
  expanded,
  requestState,
  onToggle,
  onSelectVenue,
  onRequestArea,
}: ResultsSheetProps) {
  let headline: string;
  if (searching) headline = "Searching…";
  else if (!results)
    headline = hasArea ? "No results yet" : "Find the cheapest beer near you";
  else if (!results.coverage) headline = "Outside coverage";
  else if (results.venues.length === 0) headline = "No cheap beer here";
  else
    headline = `${results.venues.length} spot${results.venues.length === 1 ? "" : "s"} · cheapest $${results.venues[0].cheapest.price_per_12oz.toFixed(2)} / 12oz`;

  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-0 rounded-t-2xl bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
      <button
        onClick={onToggle}
        className="flex w-full flex-col items-center px-4 pb-2 pt-2"
        aria-expanded={expanded}
      >
        <div className="mb-2 h-1 w-10 rounded-full bg-neutral-300" />
        <div className="text-sm font-semibold text-neutral-900">{headline}</div>
      </button>

      {expanded && (
        <div
          className="overflow-y-auto px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
          style={{ maxHeight: "42dvh" }}
        >
          {!results && !searching && (
            <p className="px-1 pb-3 text-sm text-neutral-500">
              Allow location for spots near you, move the map and tap{" "}
              <span className="font-medium">Search this area</span>, or draw your own
              area.
            </p>
          )}

          {results && !results.coverage && (
            <div className="px-1 pb-3">
              <p className="text-sm text-neutral-600">
                Beer doesn&apos;t cover this area yet — we&apos;re live in The Loop and
                Downtown.
              </p>
              <button
                onClick={onRequestArea}
                disabled={requestState === "sending" || requestState === "sent"}
                className="mt-3 w-full rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white active:bg-amber-700 disabled:opacity-60"
              >
                {requestState === "sent"
                  ? "Thanks — request received"
                  : requestState === "sending"
                    ? "Sending…"
                    : requestState === "error"
                      ? "Something went wrong — tap to retry"
                      : "Request this area"}
              </button>
            </div>
          )}

          {results && results.coverage && results.venues.length === 0 && (
            <p className="px-1 pb-3 text-sm text-neutral-600">
              No cheap beer near you — expand your range.
            </p>
          )}

          {results && results.venues.length > 0 && (
            <ul className="flex flex-col gap-2 pb-1">
              {results.venues.map((v) => (
                <li key={v.id}>
                  <VenueCard
                    venue={v}
                    userPos={userPos}
                    selected={v.id === selectedVenueId}
                    onSelect={onSelectVenue}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
