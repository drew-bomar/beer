import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

// TODO(BEE-8): Temporary password gate — replace with Supabase Auth login.

export const metadata = { title: "Admin login · Beer" };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin/venues");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-xl font-semibold">Beer admin</h1>
      <LoginForm />
    </main>
  );
}
