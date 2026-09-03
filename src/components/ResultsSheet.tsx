"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  ActiveDeal,
  CheapestOffering,
  HappeningNowResponse,
  HappeningVenue,
  LngLat,
  PopularBeer,
  PopularResponse,
  SearchFilters,
  SearchResponse,
  VenueResult,
} from "@/lib/types";
import { FILTER_FORMATS } from "@/lib/types";
import { haversineMiles } from "@/lib/geo";
import { servingLabel, untilLabel, updatedLabel } from "@/lib/format";

type RequestState = "idle" | "sending" | "sent" | "error";
export type ResultsView = "all" | "now";

type ResultsSheetProps = {
  view: ResultsView;
  results: SearchResponse | null;
  nowResults: HappeningNowResponse | null;
  searching: boolean;
  hasArea: boolean;
  userPos: LngLat | null;
  selectedVenueId: string | null;
  expanded: boolean;
  requestState: RequestState;
  filters: SearchFilters;
  onViewChange: (v: ResultsView) => void;
  onFiltersChange: (f: SearchFilters) => void;
  onToggle: () => void;
  onSelectVenue: (v: { id: string; lng: number; lat: number }) => void;
  onRequestArea: () => void;
};

// BEE-21: popular-beers responses cached per session (module scope survives re-renders).
const popularCache = new Map<string, Promise<PopularResponse>>();

function fetchPopular(slug: string): Promise<PopularResponse> {
  const cached = popularCache.get(slug);
  if (cached) return cached;
  const p = fetch(`/api/venues/${slug}/popular`).then((r) => {
    if (!r.ok) throw new Error(`popular failed: ${r.status}`);
    return r.json() as Promise<PopularResponse>;
  });
  // Failed fetches are evicted so a later expand can retry.
  p.catch(() => popularCache.delete(slug));
  popularCache.set(slug, p);
  return p;
}

function Distance({ userPos, lng, lat }: { userPos: LngLat | null; lng: number; lat: number }) {
  if (userPos === null) return null;
  const miles = haversineMiles(userPos, [lng, lat]);
  return <span className="shrink-0 text-xs text-neutral-500">{miles.toFixed(1)} mi</span>;
}

/** BEE-20: the per-12oz price block; red-boxed with struck original when on deal. */
function PriceBlock({ o }: { o: CheapestOffering }) {
  if (o.format === "pitcher") {
    // BEE-22: pitchers rank among themselves — real price prominent, clearly labeled.
    return (
      <div className="shrink-0 text-right">
        <div className="text-xl font-bold text-amber-700">${o.price.toFixed(2)}</div>
        <div className="text-[11px] font-semibold uppercase text-neutral-500">pitcher</div>
        <div className="text-[11px] text-neutral-500">${o.price_per_12oz.toFixed(2)} / 12oz</div>
      </div>
    );
  }
  if (!o.on_deal) {
    return (
      <div className="shrink-0 text-right">
        <div className="text-xl font-bold text-amber-700">${o.price_per_12oz.toFixed(2)}</div>
        <div className="text-[11px] text-neutral-500">/ 12oz</div>
      </div>
    );
  }
  return (
    <div className="shrink-0 text-right">
      <div className="rounded-lg border-2 border-red-500 bg-red-50 px-2 py-1">
        {o.original_price_per_12oz !== null && (
          <div className="text-[11px] text-neutral-400 line-through">
            ${o.original_price_per_12oz.toFixed(2)}
          </div>
        )}
        <div className="text-xl font-bold leading-tight text-red-600">
          ${o.price_per_12oz.toFixed(2)}
        </div>
        <div className="text-[11px] text-neutral-500">/ 12oz</div>
      </div>
      {o.deal_ends_at && (
        <div className="mt-1 text-[11px] font-semibold text-red-600">
          {untilLabel(o.deal_ends_at)}
        </div>
      )}
    </div>
  );
}

function PopularRow({ b }: { b: PopularBeer }) {
  return (
    <li className="flex items-start justify-between gap-3 py-1.5">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-neutral-800">{b.beer_name}</div>
        <div className="text-xs text-neutral-500">
          ${b.price.toFixed(2)} {servingLabel(b)}
          {b.on_deal && b.original_price !== null && (
            <span className="ml-1 text-neutral-400 line-through">
              ${b.original_price.toFixed(2)}
            </span>
          )}
          {b.size_assumed && <span className="text-neutral-400"> (size assumed)</span>}
          {!b.verified && <span className="text-neutral-400"> · unverified</span>}
        </div>
        {b.on_deal && b.deal_ends_at && (
          <div className="text-[11px] font-semibold text-red-600">
            Deal {untilLabel(b.deal_ends_at)}
          </div>
        )}
      </div>
      <div className="shrink-0 text-right">
        <div className={`text-sm font-bold ${b.on_deal ? "text-red-600" : "text-amber-700"}`}>
          ${b.price_per_12oz.toFixed(2)}
        </div>
        <div className="text-[10px] text-neutral-500">/ 12oz</div>
      </div>
    </li>
  );
}

/** Lazily-loaded popular beers shown inside an expanded card (BEE-21). */
function PopularList({ slug }: { slug: string }) {
  const [state, setState] = useState<{
    slug: string;
    beers: PopularBeer[] | null;
    failed: boolean;
  }>({ slug, beers: null, failed: false });
  // Reset for a new venue during render (no effect → no cascading renders).
  if (state.slug !== slug) setState({ slug, beers: null, failed: false });

  useEffect(() => {
    let alive = true;
    fetchPopular(slug)
      .then((data) => {
        if (alive) setState((s) => (s.slug === slug ? { ...s, beers: data.beers } : s));
      })
      .catch(() => {
        if (alive) setState((s) => (s.slug === slug ? { ...s, failed: true } : s));
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  const { beers, failed } = state;

  if (failed)
    return <p className="py-2 text-xs text-neutral-500">Couldn&apos;t load beers — tap Details for the full list.</p>;
  if (beers === null) return <p className="py-2 text-xs text-neutral-400">Loading beers…</p>;
  if (beers.length === 0)
    return <p className="py-2 text-xs text-neutral-500">No popular beers listed yet.</p>;
  return (
    <ul className="divide-y divide-neutral-100">
      {beers.map((b) => (
        <PopularRow key={b.id} b={b} />
      ))}
    </ul>
  );
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
  onSelect: (v: { id: string; lng: number; lat: number }) => void;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  const o = venue.cheapest;

  // Roster-only venue (no priced offerings yet): the card is a prompt to add
  // prices, and tapping goes straight to the venue page where the upload lives.
  if (o === null) {
    return (
      <div ref={ref} className="w-full rounded-xl border border-dashed border-neutral-300 bg-white active:bg-neutral-50">
        <button
          onClick={() => router.push(`/venue/${venue.slug}`)}
          className="w-full p-3 text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="truncate font-semibold text-neutral-900">{venue.name}</span>
                <Distance userPos={userPos} lng={venue.lng} lat={venue.lat} />
              </div>
              <div className="mt-0.5 text-sm text-neutral-500">
                No prices yet — know them? Upload a menu photo
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-400">
              add prices
            </span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`w-full rounded-xl border transition-colors ${
        selected
          ? "border-amber-500 bg-amber-50"
          : "border-neutral-200 bg-white active:bg-neutral-50"
      }`}
    >
      {/* First tap expands in place; a second tap opens the venue page (BEE-21). */}
      <button
        onClick={() => {
          if (selected) router.push(`/venue/${venue.slug}`);
          else onSelect(venue);
        }}
        className="w-full p-3 text-left"
        aria-expanded={selected}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="truncate font-semibold text-neutral-900">{venue.name}</span>
              <Distance userPos={userPos} lng={venue.lng} lat={venue.lat} />
            </div>
            <div className="mt-0.5 truncate text-sm text-neutral-700">
              {o.beer_name} · ${o.price.toFixed(2)} {servingLabel(o)}
              {o.on_deal && o.original_price !== null && (
                <span className="ml-1 text-xs text-neutral-400 line-through">
                  ${o.original_price.toFixed(2)}
                </span>
              )}
              {o.size_assumed && <span className="text-neutral-400"> (size assumed)</span>}
            </div>
            <div className="mt-1 text-xs text-neutral-400">
              {updatedLabel(o.last_verified_at)}
              {!o.verified && <span> · reported, unverified</span>}
            </div>
          </div>
          <PriceBlock o={o} />
        </div>
      </button>

      {selected && (
        <div className="border-t border-amber-200 px-3 pb-2 pt-1">
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
              Popular here
            </span>
            <Link
              href={`/venue/${venue.slug}`}
              className="text-xs font-semibold text-amber-700"
            >
              Details →
            </Link>
          </div>
          <PopularList slug={venue.slug} />
        </div>
      )}
    </div>
  );
}

function DealRow({ d }: { d: ActiveDeal }) {
  return (
    <li className="flex items-start justify-between gap-3 py-1.5">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-neutral-800">{d.label}</div>
        <div className="text-xs text-neutral-500">
          ${d.effective_price.toFixed(2)}
          <span className="ml-1 text-neutral-400 line-through">
            ${d.original_price.toFixed(2)}
          </span>
          <span className="ml-1.5 font-semibold text-red-600">{untilLabel(d.ends_at)}</span>
        </div>
        {d.free_text && <div className="text-xs text-neutral-500">{d.free_text}</div>}
      </div>
      <div className="shrink-0 text-right">
        <div className="text-sm font-bold text-red-600">
          ${d.effective_price_per_12oz.toFixed(2)}
        </div>
        <div className="text-[10px] text-neutral-500">/ 12oz</div>
      </div>
    </li>
  );
}

/** BEE-25: a venue's currently active deals. */
function NowVenueCard({
  venue,
  userPos,
  selected,
  onSelect,
}: {
  venue: HappeningVenue;
  userPos: LngLat | null;
  selected: boolean;
  onSelect: (v: { id: string; lng: number; lat: number }) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <div
      ref={ref}
      className={`w-full rounded-xl border ${
        selected ? "border-red-500 bg-red-50" : "border-red-200 bg-white"
      }`}
    >
      <button onClick={() => onSelect(venue)} className="w-full px-3 pt-3 text-left">
        <div className="flex items-baseline gap-2">
          <span className="truncate font-semibold text-neutral-900">{venue.name}</span>
          <Distance userPos={userPos} lng={venue.lng} lat={venue.lat} />
        </div>
        <ul className="mt-1 divide-y divide-neutral-100">
          {venue.deals.map((d, i) => (
            <DealRow key={i} d={d} />
          ))}
        </ul>
      </button>
      <div className="px-3 pb-2 text-right">
        <Link
          href={`/venue/${venue.slug}`}
          className="text-xs font-semibold text-amber-700"
        >
          Details →
        </Link>
      </div>
    </div>
  );
}

/** BEE-22: brand search, format chips, active-deals toggle. */
function FilterRow({
  filters,
  onChange,
}: {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
}) {
  const [brandDraft, setBrandDraft] = useState(filters.brand);
  // Keep the input in sync when filters change from outside (e.g. hydration
  // from storage) — adjusted during render, not in an effect.
  const [lastPropBrand, setLastPropBrand] = useState(filters.brand);
  if (filters.brand !== lastPropBrand) {
    setLastPropBrand(filters.brand);
    setBrandDraft(filters.brand);
  }
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  function onBrandInput(value: string) {
    setBrandDraft(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange({ ...filters, brand: value }), 350);
  }

  function toggleFormat(f: SearchFilters["formats"][number]) {
    const formats = filters.formats.includes(f)
      ? filters.formats.filter((x) => x !== f)
      : [...filters.formats, f];
    onChange({ ...filters, formats });
  }

  const chip = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
      active ? "bg-amber-600 text-white" : "bg-neutral-100 text-neutral-600 active:bg-neutral-200"
    }`;

  return (
    <div className="px-1 pb-2">
      <input
        type="search"
        inputMode="search"
        value={brandDraft}
        onChange={(e) => onBrandInput(e.target.value)}
        placeholder="Search a brand or beer (e.g. Busch)"
        aria-label="Filter by brand or beer name"
        className="w-full rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {FILTER_FORMATS.map((f) => (
          <button key={f} onClick={() => toggleFormat(f)} className={chip(filters.formats.includes(f))}>
            {f}
          </button>
        ))}
        <button
          onClick={() => onChange({ ...filters, activeDealsOnly: !filters.activeDealsOnly })}
          className={`${chip(filters.activeDealsOnly)} ${
            filters.activeDealsOnly ? "!bg-red-600" : ""
          }`}
        >
          Active deals
        </button>
      </div>
    </div>
  );
}

export default function ResultsSheet({
  view,
  results,
  nowResults,
  searching,
  hasArea,
  userPos,
  selectedVenueId,
  expanded,
  requestState,
  filters,
  onViewChange,
  onFiltersChange,
  onToggle,
  onSelectVenue,
  onRequestArea,
}: ResultsSheetProps) {
  const active = view === "now" ? nowResults : results;

  let headline: string;
  if (searching) headline = "Searching…";
  else if (!active)
    headline = hasArea ? "No results yet" : "Find the cheapest beer near you";
  else if (!active.coverage) headline = "Outside coverage";
  else if (view === "now") {
    const n = nowResults!.venues.length;
    headline =
      n === 0
        ? "No active deals right now"
        : `${n} spot${n === 1 ? "" : "s"} with deals · from $${nowResults!.venues[0].cheapest_active_deal_per_12oz.toFixed(2)} / 12oz`;
  } else if (results!.venues.length === 0) headline = "No cheap beer here";
  else {
    const n = results!.venues.length;
    const first = results!.venues[0].cheapest; // priced venues sort before roster-only ones
    headline =
      first === null
        ? `${n} spot${n === 1 ? "" : "s"} · no prices yet`
        : `${n} spot${n === 1 ? "" : "s"} · cheapest $${first.price_per_12oz.toFixed(2)} / 12oz`;
  }

  const outsideCoverage = active !== null && !active.coverage;

  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-0 rounded-t-2xl bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
      <button
        onClick={onToggle}
        className="flex w-full flex-col items-center px-4 pb-1 pt-2"
        aria-expanded={expanded}
      >
        <div className="mb-2 h-1 w-10 rounded-full bg-neutral-300" />
        <div className="text-sm font-semibold text-neutral-900">{headline}</div>
      </button>

      {/* BEE-25: prominent view toggle — always visible, thumb-reach. */}
      <div className="flex justify-center pb-2">
        <div className="flex rounded-full bg-neutral-100 p-0.5" role="tablist">
          <button
            role="tab"
            aria-selected={view === "all"}
            onClick={() => onViewChange("all")}
            className={`rounded-full px-4 py-1 text-xs font-semibold ${
              view === "all" ? "bg-white text-neutral-900 shadow" : "text-neutral-500"
            }`}
          >
            All prices
          </button>
          <button
            role="tab"
            aria-selected={view === "now"}
            onClick={() => onViewChange("now")}
            className={`rounded-full px-4 py-1 text-xs font-semibold ${
              view === "now" ? "bg-red-600 text-white shadow" : "text-neutral-500"
            }`}
          >
            Happening Now
          </button>
        </div>
      </div>

      {expanded && (
        <div
          className="overflow-y-auto px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
          style={{ maxHeight: "42dvh" }}
        >
          {!active && !searching && (
            <p className="px-1 pb-3 text-sm text-neutral-500">
              Allow location for spots near you, move the map and tap{" "}
              <span className="font-medium">Search this area</span>, or draw your own
              area.
            </p>
          )}

          {outsideCoverage && (
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

          {view === "all" && !outsideCoverage && results !== null && (
            <FilterRow filters={filters} onChange={onFiltersChange} />
          )}

          {view === "all" && results && results.coverage && results.venues.length === 0 && (
            <p className="px-1 pb-3 text-sm text-neutral-600">
              No cheap beer matches here — expand your range or clear a filter.
            </p>
          )}

          {view === "all" && results && results.coverage && results.venues.length > 0 && (
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

          {view === "now" && nowResults && nowResults.coverage && (
            nowResults.venues.length === 0 ? (
              <div className="px-1 pb-3">
                <p className="text-sm text-neutral-600">
                  No active deals right now — here&apos;s the cheapest beer anyway.
                </p>
                <button
                  onClick={() => onViewChange("all")}
                  className="mt-3 w-full rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white active:bg-amber-700"
                >
                  Show cheapest beer
                </button>
              </div>
            ) : (
              <ul className="flex flex-col gap-2 pb-1">
                {nowResults.venues.map((v) => (
                  <li key={v.id}>
                    <NowVenueCard
                      venue={v}
                      userPos={userPos}
                      selected={v.id === selectedVenueId}
                      onSelect={onSelectVenue}
                    />
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      )}
    </div>
  );
}
