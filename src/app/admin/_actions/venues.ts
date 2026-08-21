"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { withReadableDbErrors } from "../_lib/pg-errors";
import { DAY_KEYS, VENUE_STATUSES, type WeeklyHours } from "../_lib/constants";

export type FormState = { error?: string; ok?: boolean };

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

type ParsedVenue = {
  name: string;
  slug: string;
  address: string;
  districtId: string;
  websiteUrl: string | null;
  googleUrl: string | null;
  status: (typeof VENUE_STATUSES)[number];
  lng: number;
  lat: number;
  hours: WeeklyHours | null;
};

function parseVenueForm(formData: FormData): ParsedVenue | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const districtId = String(formData.get("district_id") ?? "");
  const status = String(formData.get("status") ?? "active");
  const websiteUrl = String(formData.get("website_url") ?? "").trim() || null;
  const googleUrl = String(formData.get("google_url") ?? "").trim() || null;
  const lng = Number(formData.get("lng"));
  const lat = Number(formData.get("lat"));
  const hoursJson = String(formData.get("hours") ?? "");

  if (!name) return { error: "Name is required." };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
    return { error: "Slug must be lowercase letters/numbers with hyphens." };
  if (!address) return { error: "Address is required." };
  if (!districtId) return { error: "Pick a district." };
  if (!(VENUE_STATUSES as readonly string[]).includes(status))
    return { error: "Invalid status." };
  if (!Number.isFinite(lng) || !Number.isFinite(lat) || (lng === 0 && lat === 0))
    return { error: "Set the venue location on the map." };
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90)
    return { error: "Location is out of range." };

  // Weekly hours: {"mon":[["16:00","01:00"]],...}, closed days omitted.
  let hours: WeeklyHours | null = null;
  if (hoursJson) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(hoursJson);
    } catch {
      return { error: "Hours are malformed." };
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
      return { error: "Hours are malformed." };
    const out: WeeklyHours = {};
    for (const [day, ranges] of Object.entries(parsed)) {
      if (!(DAY_KEYS as readonly string[]).includes(day))
        return { error: `Unknown day "${day}" in hours.` };
      if (!Array.isArray(ranges)) return { error: "Hours are malformed." };
      if (ranges.length === 0) continue; // closed day: omit entirely
      const clean: [string, string][] = [];
      for (const r of ranges) {
        if (!Array.isArray(r) || r.length !== 2) return { error: "Hours are malformed." };
        const [open, close] = r;
        if (typeof open !== "string" || typeof close !== "string" ||
            !TIME_RE.test(open) || !TIME_RE.test(close))
          return { error: `Hours for ${day} must be HH:MM–HH:MM.` };
        clean.push([open, close]);
      }
      out[day as (typeof DAY_KEYS)[number]] = clean;
    }
    if (Object.keys(out).length > 0) hours = out;
  }

  return {
    name, slug, address, districtId, websiteUrl, googleUrl,
    status: status as ParsedVenue["status"], lng, lat, hours,
  };
}

export async function createVenue(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = parseVenueForm(formData);
  if ("error" in parsed) return parsed;

  const result = await withReadableDbErrors(async () => {
    const [row] = await sql<{ id: string }[]>`
      insert into venues (slug, name, address, location, district_id, hours, website_url, google_url, status)
      values (
        ${parsed.slug}, ${parsed.name}, ${parsed.address},
        st_geogfromtext(${`POINT(${parsed.lng} ${parsed.lat})`}),
        ${parsed.districtId},
        ${parsed.hours === null ? null : sql.json(parsed.hours)},
        ${parsed.websiteUrl}, ${parsed.googleUrl}, ${parsed.status}
      )
      returning id
    `;
    return row.id;
  });
  if (typeof result === "object") return result;

  revalidatePath("/admin/venues");
  redirect(`/admin/venues/${result}`);
}

export async function updateVenue(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing venue id." };
  const parsed = parseVenueForm(formData);
  if ("error" in parsed) return parsed;

  const result = await withReadableDbErrors(async () => {
    const rows = await sql`
      update venues set
        slug = ${parsed.slug},
        name = ${parsed.name},
        address = ${parsed.address},
        location = st_geogfromtext(${`POINT(${parsed.lng} ${parsed.lat})`}),
        district_id = ${parsed.districtId},
        hours = ${parsed.hours === null ? null : sql.json(parsed.hours)},
        website_url = ${parsed.websiteUrl},
        google_url = ${parsed.googleUrl},
        status = ${parsed.status},
        updated_at = now()
      where id = ${id}
      returning id
    `;
    if (rows.length === 0) throw new Error("Venue not found");
    return null;
  });
  if (result !== null && "error" in result) return result;

  revalidatePath("/admin/venues");
  revalidatePath(`/admin/venues/${id}`);
  return { ok: true };
}
