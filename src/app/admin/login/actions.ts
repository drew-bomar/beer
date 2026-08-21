"use server";

// TODO(BEE-8): Temporary password login. Swap for Supabase Auth
// (supabase.auth.signInWithPassword, single admin user) once the Supabase
// project exists. See src/lib/admin-auth.ts.

import { redirect } from "next/navigation";
import { checkPassword, createAdminSession } from "@/lib/admin-auth";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Wrong password." };
  }
  await createAdminSession();
  redirect("/admin/venues");
}
