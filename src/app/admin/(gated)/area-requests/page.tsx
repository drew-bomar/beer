import { sql } from "@/lib/db";

export const metadata = { title: "Area requests · Beer admin" };
export const dynamic = "force-dynamic";

type AreaRequestRow = {
  id: string;
  lng: number;
  lat: number;
  device_id: string | null;
  created_at: Date;
};

export default async function AreaRequestsPage() {
  // Expansion-demand signal: where users tapped "request this area" outside coverage.
  const rows = await sql<AreaRequestRow[]>`
    select
      id,
      st_x(location::geometry) as lng,
      st_y(location::geometry) as lat,
      device_id,
      created_at
    from area_requests
    order by created_at desc
    limit 500
  `;

  return (
    <div>
      <h1 className="text-lg font-semibold">Area requests</h1>
      <p className="mt-1 text-sm text-gray-600">
        Taps on “request this area” outside coverage — demand data for expansion.
      </p>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No requests yet.</p>
      ) : (
        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-left text-gray-600">
              <th className="py-2 pr-4">When</th>
              <th className="py-2 pr-4">Location (lat, lng)</th>
              <th className="py-2 pr-4">Device</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-gray-200">
                <td className="py-2 pr-4">{r.created_at.toLocaleString()}</td>
                <td className="py-2 pr-4 font-mono">
                  {r.lat.toFixed(5)}, {r.lng.toFixed(5)}
                </td>
                <td className="py-2 pr-4 text-gray-500">{r.device_id ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
