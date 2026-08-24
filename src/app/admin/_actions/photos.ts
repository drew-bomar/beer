"use server";

// BEE-28: photo moderation. Approve makes a photo publicly visible on its venue
// page; reject removes the storage object and keeps only the tombstone row.

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { PHOTO_BUCKET, supabaseAdmin } from "@/lib/supabase-admin";

export async function approvePhoto(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await sql`
    update photos
    set status = 'approved', reviewed_at = now()
    where id = ${id} and status = 'pending'
  `;
  revalidatePath("/admin/photos");
}

export async function rejectPhoto(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const rows = await sql<{ storage_path: string }[]>`
    select storage_path from photos where id = ${id} and status = 'pending'
  `;
  if (rows.length === 0) return;

  // Remove the object first: if deletion fails we leave the row pending rather
  // than orphaning a private object behind a 'rejected' tombstone.
  const { error } = await supabaseAdmin()
    .storage.from(PHOTO_BUCKET)
    .remove([rows[0].storage_path]);
  if (error) throw new Error(`Could not delete storage object: ${error.message}`);

  await sql`
    update photos
    set status = 'rejected', reviewed_at = now()
    where id = ${id} and status = 'pending'
  `;
  revalidatePath("/admin/photos");
}
