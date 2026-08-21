"use server";

import { redirect } from "next/navigation";
import { destroyAdminSession } from "@/lib/admin-auth";

// TODO(BEE-8): swap for supabase.auth.signOut() once Supabase Auth lands.
export async function logoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}
