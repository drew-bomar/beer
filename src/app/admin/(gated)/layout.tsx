import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { logoutAction } from "../_actions/auth";

export const metadata = { title: "Beer admin" };

// Every page in this (gated) route group is behind the admin session check.
// TODO(BEE-8): requireAdmin() is the temporary password gate — swap for
// Supabase Auth session verification.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  const nav = [
    { href: "/admin/venues", label: "Venues" },
    { href: "/admin/areas", label: "Coverage areas" },
    { href: "/admin/photos", label: "Photo queue" },
    { href: "/admin/area-requests", label: "Area requests" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
          <span className="font-semibold">🍺 Beer admin</span>
          <nav className="flex flex-1 gap-4 text-sm">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="hover:underline">
                {n.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-900 hover:underline"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
