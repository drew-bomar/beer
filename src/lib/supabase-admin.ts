// BEE-27/28: server-only Supabase Storage client for the private "menu-photos"
// bucket. Uses the service-role key — never import this from client code.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const PHOTO_BUCKET = "menu-photos";

/** Lifetime of signed URLs for approved/queued photos (seconds). */
export const SIGNED_URL_TTL_S = 60 * 10;

const globalForSupabase = globalThis as unknown as {
  supabaseAdmin?: SupabaseClient;
  photoBucketReady?: boolean;
};

export function supabaseAdmin(): SupabaseClient {
  if (globalForSupabase.supabaseAdmin) return globalForSupabase.supabaseAdmin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase storage is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  globalForSupabase.supabaseAdmin = client;
  return client;
}

/** Create the private menu-photos bucket on first use (idempotent). */
export async function ensurePhotoBucket(): Promise<void> {
  if (globalForSupabase.photoBucketReady) return;
  const supabase = supabaseAdmin();
  const { error } = await supabase.storage.createBucket(PHOTO_BUCKET, {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  });
  // "already exists" is success; anything else is a real failure.
  if (error && !/already exists/i.test(error.message)) {
    throw new Error(`Could not create storage bucket: ${error.message}`);
  }
  globalForSupabase.photoBucketReady = true;
}

/** Short-lived signed URL for a private photo, or null if signing fails. */
export async function signedPhotoUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin()
    .storage.from(PHOTO_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_S);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
