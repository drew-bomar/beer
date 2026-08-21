import Link from "next/link";
import { sql } from "@/lib/db";

export const metadata = { title: "Venues · Beer admin" };
export const dynamic = "force-dynamic";

type VenueListRow = {
  id: string;
  name: string;
  slug: string;
  address: string;
  status: string;
  district_name: string;
  offering_count: number;
};

const STATUS_BADGE: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  closed: "bg-red-100 text-red-800",
  hidden: "bg-gray-200 text-gray-700",
};

export default async function VenuesPage() {
  const venues = await sql<VenueListRow[]>`
    select
      v.id, v.name, v.slug, v.address, v.status,
      ca.name as district_name,
      (select count(*)::int from offerings o where o.venue_id = v.id) as offering_count
    from venues v
    join coverage_areas ca on ca.id = v.district_id
    order by ca.name, v.name
  `;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Venues ({venues.length})</h1>
        <Link
          href="/admin/venues/new"
          className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
        >
          + New venue
        </Link>
      </div>
      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left text-gray-600">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">District</th>
            <th className="py-2 pr-4">Address</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4 text-right">Offerings</th>
          </tr>
        </thead>
        <tbody>
          {venues.map((v) => (
            <tr key={v.id} className="border-b border-gray-200 hover:bg-amber-50">
              <td className="py-2 pr-4">
                <Link href={`/admin/venues/${v.id}`} className="font-medium text-blue-700 hover:underline">
                  {v.name}
                </Link>
                <span className="ml-2 font-mono text-xs text-gray-400">{v.slug}</span>
              </td>
              <td className="py-2 pr-4">{v.district_name}</td>
              <td className="py-2 pr-4 text-gray-600">{v.address}</td>
              <td className="py-2 pr-4">
                <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${STATUS_BADGE[v.status] ?? ""}`}>
                  {v.status}
                </span>
              </td>
              <td className="py-2 pr-4 text-right">{v.offering_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
