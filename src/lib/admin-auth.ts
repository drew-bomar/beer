import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// TODO(BEE-8): This entire module is a TEMPORARY password gate. Replace with
// Supabase Auth (single admin user) once the Supabase project exists:
//   - login page swaps to supabase.auth.signInWithPassword
//   - requireAdmin() swaps to verifying the Supabase session
//   - delete ADMIN_PASSWORD from .env.local
// Until then: one shared password from process.env.ADMIN_PASSWORD, and the
// session cookie is an HMAC derived from that password (so rotating the
// password invalidates all sessions).

const COOKIE_NAME = "beer_admin_session";
const SESSION_MAX_AGE_S = 60 * 60 * 24 * 14; // 14 days

function adminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD is not set");
  return pw;
}

/** Deterministic session token: HMAC(password, fixed message). */
function sessionToken(): string {
  return createHmac("sha256", adminPassword())
    .update("beer-admin-session-v1")
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function checkPassword(candidate: string): boolean {
  return safeEqual(candidate, adminPassword());
}

export async function createAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  return !!token && safeEqual(token, sessionToken());
}

/**
 * Gate for every /admin page and every admin server action / API route.
 * Call it at the top of each server action and in the gated layout.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
