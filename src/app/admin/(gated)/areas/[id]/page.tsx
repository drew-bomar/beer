import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import AreaForm, { type AreaFormData } from "../../../_components/AreaForm";
import type { Ring } from "../../../_components/PolygonEditor";

export const metadata = { title: "Coverage area · Beer admin" };
export const dynamic = "force-dynamic";

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await sql<{ id: string; name: string; slug: string; geojson: string }[]>`
    select id, name, slug, st_asgeojson(area) as geojson
    from coverage_areas
    where id = ${id}
  `;
  const area = rows[0];
  if (!area) notFound();

  // MultiPolygon coordinates: polygon → rings → [lng, lat]. The editor works
  // with outer rings only (holes unsupported), unclosed.
  const geom = JSON.parse(area.geojson) as {
    type: string;
    coordinates: number[][][][];
  };
  const polygons: Ring[] =
    geom.type === "MultiPolygon"
      ? geom.coordinates.map((poly) => {
          const outer = poly[0].map(([lng, lat]) => [lng, lat] as [number, number]);
          // Drop the closing point (same as the first) for editing.
          if (
            outer.length > 1 &&
            outer[0][0] === outer[outer.length - 1][0] &&
            outer[0][1] === outer[outer.length - 1][1]
          ) {
            outer.pop();
          }
          return outer;
        })
      : [];

  const areaData: AreaFormData = {
    id: area.id,
    name: area.name,
    slug: area.slug,
    polygons,
  };

  return (
    <div>
      <Link href="/admin/areas" className="text-sm text-blue-600 hover:underline">
        ← All areas
      </Link>
      <h1 className="mt-1 text-lg font-semibold">{area.name}</h1>
      <div className="mt-4">
        <AreaForm area={areaData} />
      </div>
    </div>
  );
}
