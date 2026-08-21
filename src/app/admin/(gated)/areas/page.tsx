import Link from "next/link";
import { sql } from "@/lib/db";

export const metadata = { title: "Coverage areas · Beer admin" };
export const dynamic = "force-dynamic";

type AreaRow = {
  id: string;
  name: string;
  slug: string;
  venue_count: number;
  sq_km: number;
  created_at: Date;
};

export default async function AreasPage() {
  const areas = await sql<AreaRow[]>`
    select
      ca.id, ca.name, ca.slug, ca.created_at,
      (select count(*)::int from venues v where v.district_id = ca.id) as venue_count,
      round((st_area(ca.area) / 1000000)::numeric, 2)::float as sq_km
    from coverage_areas ca
    order by ca.name
  `;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Coverage areas ({areas.length})</h1>
        <Link
          href="/admin/areas/new"
          className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
        >
          + New area
        </Link>
      </div>
      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300 text-left text-gray-600">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Slug</th>
            <th className="py-2 pr-4 text-right">Venues</th>
            <th className="py-2 pr-4 text-right">Area (km²)</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((a) => (
            <tr key={a.id} className="border-b border-gray-200 hover:bg-amber-50">
              <td className="py-2 pr-4">
                <Link href={`/admin/areas/${a.id}`} className="font-medium text-blue-700 hover:underline">
                  {a.name}
                </Link>
              </td>
              <td className="py-2 pr-4 font-mono text-xs text-gray-500">{a.slug}</td>
              <td className="py-2 pr-4 text-right">{a.venue_count}</td>
              <td className="py-2 pr-4 text-right">{a.sq_km}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
