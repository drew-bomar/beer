import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/coverage — coverage areas as a GeoJSON FeatureCollection. */
export async function GET() {
  const rows = await sql<{ slug: string; name: string; geometry: object }[]>`
    select slug, name, st_asgeojson(area)::json as geometry
    from coverage_areas
    order by name
  `;

  return Response.json(
    {
      type: "FeatureCollection",
      features: rows.map((r) => ({
        type: "Feature",
        properties: { slug: r.slug, name: r.name },
        geometry: r.geometry,
      })),
    },
    { headers: { "cache-control": "public, max-age=300" } },
  );
}
