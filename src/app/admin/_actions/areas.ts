"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { withReadableDbErrors } from "../_lib/pg-errors";
import type { FormState } from "./venues";

// Polygons arrive from the client editor as JSON: number[][][] — a list of
// polygons, each a single outer ring of [lng, lat] pairs (holes unsupported
// in this editor). Validated here and converted to MULTIPOLYGON WKT, which is
// passed as a single query parameter.
function polygonsToMultipolygonWkt(json: string): string | { error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { error: "Polygon data is malformed." };
  }
  if (!Array.isArray(parsed) || parsed.length === 0)
    return { error: "Draw at least one polygon (3+ points) on the map." };

  const polys: string[] = [];
  for (const ring of parsed) {
    if (!Array.isArray(ring) || ring.length < 3)
      return { error: "Each polygon needs at least 3 points." };
    const pts: string[] = [];
    for (const pt of ring) {
      if (!Array.isArray(pt) || pt.length !== 2) return { error: "Polygon data is malformed." };
      const [lng, lat] = pt;
      if (typeof lng !== "number" || typeof lat !== "number" ||
          !Number.isFinite(lng) || !Number.isFinite(lat) ||
          lng < -180 || lng > 180 || lat < -90 || lat > 90)
        return { error: "Polygon contains an out-of-range coordinate." };
      pts.push(`${lng} ${lat}`);
    }
    pts.push(pts[0]); // close the ring
    polys.push(`((${pts.join(", ")}))`);
  }
  return `MULTIPOLYGON(${polys.join(", ")})`;
}

function parseAreaForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const polygonsJson = String(formData.get("polygons") ?? "");
  if (!name) return { error: "Name is required." as const };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
    return { error: "Slug must be lowercase letters/numbers with hyphens." as const };
  const wkt = polygonsToMultipolygonWkt(polygonsJson);
  if (typeof wkt !== "string") return wkt;
  return { name, slug, wkt };
}

export async function createArea(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = parseAreaForm(formData);
  if ("error" in parsed) return parsed;

  const result = await withReadableDbErrors(async () => {
    const [row] = await sql<{ id: string }[]>`
      insert into coverage_areas (slug, name, area)
      values (${parsed.slug}, ${parsed.name}, st_geogfromtext(${parsed.wkt}))
      returning id
    `;
    return row.id;
  });
  if (typeof result === "object") return result;

  revalidatePath("/admin/areas");
  redirect("/admin/areas");
}

export async function updateArea(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing area id." };
  const parsed = parseAreaForm(formData);
  if ("error" in parsed) return parsed;

  const result = await withReadableDbErrors(async () => {
    const rows = await sql`
      update coverage_areas set
        slug = ${parsed.slug},
        name = ${parsed.name},
        area = st_geogfromtext(${parsed.wkt})
      where id = ${id}
      returning id
    `;
    if (rows.length === 0) throw new Error("Area not found");
    return null;
  });
  if (result !== null && "error" in result) return result;

  revalidatePath("/admin/areas");
  revalidatePath(`/admin/areas/${id}`);
  return { ok: true };
}
