import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import VenueForm, { type District, type VenueFormData } from "../../../_components/VenueForm";
import OfferingsSection, { type OfferingRow } from "../../../_components/OfferingsSection";
import SpecialsSection, {
  type OfferingOption,
  type SpecialRow,
} from "../../../_components/SpecialsSection";
import type { OfferingFormat, SpecialCategory, WeeklyHours } from "../../../_lib/constants";

export const metadata = { title: "Venue · Beer admin" };
export const dynamic = "force-dynamic";

const hhmm = (t: string) => t.slice(0, 5);

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [venues, districts] = await Promise.all([
    sql<
      {
        id: string;
        name: string;
        slug: string;
        address: string;
        district_id: string;
        website_url: string | null;
        google_url: string | null;
        status: string;
        hours: WeeklyHours | null;
        lng: number;
        lat: number;
      }[]
    >`
      select
        id, name, slug, address, district_id, website_url, google_url, status, hours,
        st_x(location::geometry) as lng,
        st_y(location::geometry) as lat
      from venues
      where id = ${id}
    `,
    sql<District[]>`select id, name from coverage_areas order by name`,
  ]);

  const venue = venues[0];
  if (!venue) notFound();

  const [offeringRows, specialRows, historyCounts] = await Promise.all([
    sql<
      {
        id: string;
        beer_name: string;
        brand: string | null;
        format: OfferingFormat;
        size_oz: string;
        size_assumed: boolean;
        price: string;
        price_per_12oz: string;
        source: string;
        verified: boolean;
        is_popular: boolean;
        last_verified_at: Date;
      }[]
    >`
      select id, beer_name, brand, format, size_oz, size_assumed, price, price_per_12oz,
             source, verified, is_popular, last_verified_at
      from offerings
      where venue_id = ${id}
      order by price_per_12oz asc, beer_name
    `,
    sql<
      {
        id: string;
        days_of_week: number[];
        start_time: string;
        end_time: string;
        target_type: "offering" | "category";
        offering_id: string | null;
        category: SpecialCategory | null;
        deal_price: string | null;
        discount_amount: string | null;
        free_text: string | null;
      }[]
    >`
      select id, days_of_week, start_time, end_time, target_type, offering_id, category,
             deal_price, discount_amount, free_text
      from specials
      where venue_id = ${id}
      order by created_at
    `,
    sql<{ offering_id: string; n: number }[]>`
      select oh.offering_id, count(*)::int as n
      from offering_history oh
      join offerings o on o.id = oh.offering_id
      where o.venue_id = ${id}
      group by oh.offering_id
    `,
  ]);

  const venueData: VenueFormData = {
    id: venue.id,
    name: venue.name,
    slug: venue.slug,
    address: venue.address,
    district_id: venue.district_id,
    website_url: venue.website_url,
    google_url: venue.google_url,
    status: venue.status,
    hours: venue.hours,
    lng: venue.lng,
    lat: venue.lat,
  };

  const offerings: OfferingRow[] = offeringRows.map((o) => ({
    id: o.id,
    beer_name: o.beer_name,
    brand: o.brand,
    format: o.format,
    size_oz: Number(o.size_oz),
    size_assumed: o.size_assumed,
    price: Number(o.price),
    price_per_12oz: Number(o.price_per_12oz),
    source: o.source,
    verified: o.verified,
    is_popular: o.is_popular,
    last_verified_at: o.last_verified_at.toISOString(),
  }));

  const specials: SpecialRow[] = specialRows.map((s) => ({
    id: s.id,
    days_of_week: s.days_of_week.map(Number),
    start_time: hhmm(s.start_time),
    end_time: hhmm(s.end_time),
    target_type: s.target_type,
    offering_id: s.offering_id,
    category: s.category,
    deal_price: s.deal_price === null ? null : Number(s.deal_price),
    discount_amount: s.discount_amount === null ? null : Number(s.discount_amount),
    free_text: s.free_text,
  }));

  const offeringOptions: OfferingOption[] = offerings.map((o) => ({
    id: o.id,
    label: `${o.beer_name} (${o.format}, $${o.price.toFixed(2)})`,
  }));

  const totalHistory = historyCounts.reduce((sum, h) => sum + h.n, 0);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/venues" className="text-sm text-blue-600 hover:underline">
          ← All venues
        </Link>
        <h1 className="mt-1 text-lg font-semibold">{venue.name}</h1>
      </div>

      <section className="max-w-2xl">
        <h2 className="mb-3 text-base font-semibold">Venue details</h2>
        <VenueForm districts={districts} venue={venueData} />
      </section>

      <hr className="border-gray-200" />

      <OfferingsSection venueId={venue.id} offerings={offerings} />
      {totalHistory > 0 && (
        <p className="text-xs text-gray-500">
          {totalHistory} archived price change{totalHistory === 1 ? "" : "s"} in
          offering_history for this venue.
        </p>
      )}

      <hr className="border-gray-200" />

      <SpecialsSection
        venueId={venue.id}
        specials={specials}
        offeringOptions={offeringOptions}
      />
    </div>
  );
}
