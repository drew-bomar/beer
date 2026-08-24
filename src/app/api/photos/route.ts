import { randomUUID } from "node:crypto";
import { sql } from "@/lib/db";
import { ensurePhotoBucket, PHOTO_BUCKET, supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_UPLOADS_PER_HOUR = 5; // per anonymous device (spec §16)

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * POST /api/photos — public menu-photo upload (BEE-27, spec §11).
 * multipart/form-data: file (image), venue_id (uuid), device_id (anon uuid).
 *
 * EXIF/GPS is already stripped client-side (canvas re-encode) before this is
 * called; the server never sees the original file. Uploads land in the PRIVATE
 * "menu-photos" bucket and a `photos` row with status 'pending' — nothing is
 * public until an admin approves it.
 */
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const file = form.get("file");
  const venueId = form.get("venue_id");
  const deviceIdRaw = form.get("device_id");

  if (!(file instanceof File)) {
    return Response.json({ error: "`file` is required" }, { status: 400 });
  }
  if (typeof venueId !== "string" || !/^[0-9a-f-]{36}$/i.test(venueId)) {
    return Response.json({ error: "`venue_id` must be a venue UUID" }, { status: 400 });
  }
  const deviceId =
    typeof deviceIdRaw === "string" && deviceIdRaw.length > 0 && deviceIdRaw.length <= 100
      ? deviceIdRaw
      : null;
  if (!deviceId) {
    return Response.json({ error: "`device_id` is required" }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return Response.json(
      { error: "Only JPEG, PNG, or WebP images are accepted" },
      { status: 415 },
    );
  }
  if (file.size === 0) {
    return Response.json({ error: "Empty file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Image must be under 10MB" }, { status: 413 });
  }

  const venue = await sql<{ id: string }[]>`
    select id from venues where id = ${venueId} and status = 'active'
  `;
  if (venue.length === 0) {
    return Response.json({ error: "Unknown venue" }, { status: 404 });
  }

  // Rate limit: recent photos rows by device, regardless of review status.
  const [{ count }] = await sql<{ count: number }[]>`
    select count(*)::int as count
    from photos
    where device_id = ${deviceId}
      and submitted_at > now() - interval '1 hour'
  `;
  if (count >= MAX_UPLOADS_PER_HOUR) {
    return Response.json(
      { error: "Upload limit reached — try again in an hour" },
      { status: 429 },
    );
  }

  await ensurePhotoBucket();
  const storagePath = `venues/${venueId}/${randomUUID()}.${ext}`;
  const bytes = await file.arrayBuffer();
  const { error: uploadError } = await supabaseAdmin()
    .storage.from(PHOTO_BUCKET)
    .upload(storagePath, bytes, { contentType: file.type, upsert: false });
  if (uploadError) {
    return Response.json({ error: "Upload failed — try again" }, { status: 502 });
  }

  await sql`
    insert into photos (venue_id, storage_path, status, device_id)
    values (${venueId}, ${storagePath}, 'pending', ${deviceId})
  `;

  return Response.json({ ok: true, status: "pending" }, { status: 201 });
}
