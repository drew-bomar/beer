import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/area-requests
 * Body: { location: [lng, lat], device_id?: string }
 *
 * Records a "Request this area" tap outside coverage. `location` is the
 * centroid of the searched area (never the user's raw GPS position) and
 * `device_id` is an anonymous random UUID from localStorage.
 */
export async function POST(req: Request) {
  let body: { location?: unknown; device_id?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const loc = body.location;
  if (
    !Array.isArray(loc) ||
    loc.length !== 2 ||
    typeof loc[0] !== "number" ||
    typeof loc[1] !== "number" ||
    !Number.isFinite(loc[0]) ||
    !Number.isFinite(loc[1]) ||
    Math.abs(loc[0]) > 180 ||
    Math.abs(loc[1]) > 90
  ) {
    return Response.json(
      { error: "`location` must be a [lng,lat] pair" },
      { status: 400 },
    );
  }

  const deviceId =
    typeof body.device_id === "string" && body.device_id.length <= 100
      ? body.device_id
      : null;

  await sql`
    insert into area_requests (location, device_id)
    values (st_setsrid(st_makepoint(${loc[0]}, ${loc[1]}), 4326)::geography, ${deviceId})
  `;

  return Response.json({ ok: true }, { status: 201 });
}
