// BEE-23: public venue detail page. Server-rendered; open-now status and
// deal-adjusted prices are computed at request time (America/Chicago).

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isVenueOpen, isWindowActive } from "@/lib/deals";
import { effectivePrices } from "@/lib/effective-price";
import {
  CATEGORY_LABELS,
  dealMechanicLabel,
  hoursSlotsLabel,
  scheduleDaysLabel,
  scheduleTimesLabel,
  servingLabel,
  untilLabel,
  updatedLabel,
} from "@/lib/format";
import {
  fetchOfferings,
  fetchSpecials,
  fetchVenueBySlug,
  SINGLE_SERVING,
  type OfferingRow,
  type SpecialRow,
} from "@/lib/venue-data";

export const dynamic = "force-dynamic";

const CONTACT_EMAIL = "beer.stl.app@gmail.com";

const WEEK: { key: string; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const venue = await fetchVenueBySlug(slug);
  return { title: venue ? `${venue.name} — Beer` : "Beer" };
}

type PricedOffering = {
  o: OfferingRow;
  price: number; // effective
  per12: number; // effective
  onDeal: boolean;
  dealEndsAt: string | null;
  originalPrice: number | null;
  originalPricePer12oz: number | null;
};

function BeerRow({ item }: { item: PricedOffering }) {
  const { o } = item;
  return (
    <li
      className={`rounded-xl border p-3 ${
        item.onDeal ? "border-red-300 bg-red-50" : "border-neutral-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-medium text-neutral-900">{o.beer_name}</div>
          <div className="mt-0.5 text-sm text-neutral-600">
            ${item.price.toFixed(2)} {servingLabel(o)}
            {item.onDeal && item.originalPrice !== null && (
              <span className="ml-1.5 text-xs text-neutral-400 line-through">
                ${item.originalPrice.toFixed(2)}
              </span>
            )}
            {o.size_assumed && <span className="text-neutral-400"> (size assumed)</span>}
          </div>
          {item.onDeal && item.dealEndsAt && (
            <div className="mt-0.5 text-xs font-semibold text-red-700">
              Deal {untilLabel(item.dealEndsAt)}
            </div>
          )}
          <div className="mt-1 text-xs text-neutral-400">
            {updatedLabel(o.last_verified_at.toISOString())}
            {!o.verified && <span> · reported, unverified</span>}
          </div>
        </div>
        <div
          className={`shrink-0 rounded-lg px-2 py-1 text-right ${
            item.onDeal ? "border border-red-400 bg-white" : ""
          }`}
        >
          <div
            className={`text-lg font-bold ${item.onDeal ? "text-red-700" : "text-amber-700"}`}
          >
            ${item.per12.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-500">/ 12oz</div>
        </div>
      </div>
    </li>
  );
}

function SpecialRowView({
  special,
  offerings,
  activeNow,
}: {
  special: SpecialRow;
  offerings: OfferingRow[];
  activeNow: boolean;
}) {
  const schedule = `${scheduleDaysLabel(special.days_of_week)} ${scheduleTimesLabel(
    special.start_time,
    special.end_time,
  )}`;
  const target =
    special.target_type === "offering"
      ? (offerings.find((o) => o.id === special.offering_id)?.beer_name ?? "Special")
      : (CATEGORY_LABELS[special.category ?? ""] ?? "Special");
  const mechanic = dealMechanicLabel(special);

  return (
    <li className="rounded-xl border border-neutral-200 bg-white p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-neutral-900">{schedule}</span>
        {activeNow && (
          <span className="shrink-0 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-semibold text-white">
            Active now
          </span>
        )}
      </div>
      {mechanic !== null && (
        <div className="mt-0.5 text-sm text-neutral-700">
          {target} <span className="font-semibold text-red-700">{mechanic}</span>
        </div>
      )}
      {special.free_text && (
        <div className="mt-0.5 text-sm text-neutral-600">{special.free_text}</div>
      )}
    </li>
  );
}

export default async function VenuePage({ params }: Props) {
  const { slug } = await params;
  const venue = await fetchVenueBySlug(slug);
  if (!venue) notFound();

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Beer — ${venue.name} (${venue.slug})`,
  )}`;

  if (venue.status !== "active") {
    return (
      <div className="min-h-dvh flex-1 bg-white">
      <main className="mx-auto max-w-lg px-4 py-6">
        <Link href="/" className="text-sm font-medium text-amber-700">
          ← Back to the map
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-neutral-900">{venue.name}</h1>
        <p className="mt-1 text-sm text-neutral-600">{venue.address}</p>
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
          This venue is closed. Prices are no longer shown.
        </div>
        <p className="mt-6 text-sm text-neutral-500">
          Own this bar?{" "}
          <a href={mailto} className="font-medium text-amber-700 underline">
            Email us
          </a>
        </p>
      </main>
      </div>
    );
  }

  const [offerings, specials] = await Promise.all([
    fetchOfferings([venue.id]),
    fetchSpecials([venue.id]),
  ]);

  const now = new Date();
  const open = isVenueOpen(venue.hours, now);
  const priced = effectivePrices(offerings, specials, now);

  const toPriced = (o: OfferingRow): PricedOffering => {
    const p = priced.get(o.id);
    const onDeal = p?.onDeal ?? false;
    return {
      o,
      price: p?.effectivePrice ?? o.price,
      per12: p?.effectivePricePer12oz ?? o.price_per_12oz,
      onDeal,
      dealEndsAt: onDeal ? (p?.dealEndsAt ?? null) : null,
      originalPrice: onDeal ? (p?.originalPrice ?? null) : null,
      originalPricePer12oz: onDeal ? (p?.originalPricePer12oz ?? null) : null,
    };
  };
  const byPer12 = (a: PricedOffering, b: PricedOffering) =>
    a.per12 - b.per12 || a.price - b.price || a.o.beer_name.localeCompare(b.o.beer_name);

  const singles = offerings
    .filter((o) => SINGLE_SERVING.includes(o.format))
    .map(toPriced)
    .sort(byPer12);
  const bulk = offerings
    .filter((o) => !SINGLE_SERVING.includes(o.format))
    .map(toPriced)
    .sort(byPer12);

  return (
    <div className="min-h-dvh flex-1 bg-white">
    <main className="mx-auto max-w-lg px-4 py-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <Link href="/" className="text-sm font-medium text-amber-700">
        ← Back to the map
      </Link>

      <header className="mt-3">
        <h1 className="text-2xl font-bold text-neutral-900">{venue.name}</h1>
        <p className="mt-1 text-sm text-neutral-600">{venue.address}</p>
        <div className="mt-2 flex items-center gap-2">
          {venue.hours == null ? (
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600">
              Hours unknown
            </span>
          ) : open ? (
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
              Open now
            </span>
          ) : (
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600">
              Closed now
            </span>
          )}
          {venue.google_url && (
            <a
              href={venue.google_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700 underline"
            >
              Open in Google
            </a>
          )}
        </div>
      </header>

      {venue.hours != null && (
        <section className="mt-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Hours
          </h2>
          <dl className="mt-2 rounded-xl border border-neutral-200 bg-white p-3 text-sm">
            {WEEK.map(({ key, label }) => (
              <div key={key} className="flex justify-between py-0.5">
                <dt className="text-neutral-600">{label}</dt>
                <dd className="text-neutral-900">{hoursSlotsLabel(venue.hours?.[key])}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="mt-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Beers
        </h2>
        {singles.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">No prices recorded yet.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {singles.map((item) => (
              <BeerRow key={item.o.id} item={item} />
            ))}
          </ul>
        )}
      </section>

      {bulk.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Pitchers &amp; buckets
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Shown for reference — never ranked against single servings.
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {bulk.map((item) => (
              <BeerRow key={item.o.id} item={item} />
            ))}
          </ul>
        </section>
      )}

      {specials.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Specials
          </h2>
          <ul className="mt-2 flex flex-col gap-2">
            {specials.map((s) => (
              <SpecialRowView
                key={s.id}
                special={s}
                offerings={offerings}
                activeNow={isWindowActive(s, now)}
              />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Menu
        </h2>
        <div className="mt-2 grid place-items-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
          <p className="text-sm text-neutral-500">No menu photo yet — coming soon</p>
          <button
            disabled
            className="mt-3 cursor-not-allowed rounded-full bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-500"
          >
            Upload a menu photo (coming soon)
          </button>
        </div>
      </section>

      <p className="mt-8 text-center text-sm text-neutral-500">
        Own this bar?{" "}
        <a href={mailto} className="font-medium text-amber-700 underline">
          Email us
        </a>
      </p>
    </main>
    </div>
  );
}
