// BEE-28: admin moderation queue for public menu-photo uploads.

import Link from "next/link";
import { sql } from "@/lib/db";
import { signedPhotoUrl } from "@/lib/supabase-admin";
import { approvePhoto, rejectPhoto } from "../../_actions/photos";

export const metadata = { title: "Photo queue · Beer admin" };
export const dynamic = "force-dynamic";

type PhotoRow = {
  id: string;
  venue_id: string;
  storage_path: string;
  status: "pending" | "approved" | "rejected";
  device_id: string | null;
  submitted_at: Date;
  reviewed_at: Date | null;
  venue_name: string;
  venue_slug: string;
};

const dt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Chicago",
});

function DeviceTag({ deviceId }: { deviceId: string | null }) {
  return (
    <span className="font-mono text-xs text-gray-500" title={deviceId ?? undefined}>
      device {deviceId ? deviceId.slice(0, 8) : "unknown"}
    </span>
  );
}

async function withSignedUrls(rows: PhotoRow[]) {
  return Promise.all(
    rows.map(async (p) => ({
      ...p,
      // Rejected photos have no storage object anymore — skip signing.
      url: p.status === "rejected" ? null : await signedPhotoUrl(p.storage_path),
    })),
  );
}

export default async function PhotoQueuePage() {
  const [pendingRows, reviewedRows] = await Promise.all([
    sql<PhotoRow[]>`
      select p.id, p.venue_id, p.storage_path, p.status::text as status,
             p.device_id, p.submitted_at, p.reviewed_at,
             v.name as venue_name, v.slug as venue_slug
      from photos p
      join venues v on v.id = p.venue_id
      where p.status = 'pending'
      order by v.name, p.submitted_at
    `,
    sql<PhotoRow[]>`
      select p.id, p.venue_id, p.storage_path, p.status::text as status,
             p.device_id, p.submitted_at, p.reviewed_at,
             v.name as venue_name, v.slug as venue_slug
      from photos p
      join venues v on v.id = p.venue_id
      where p.status <> 'pending'
      order by p.reviewed_at desc nulls last
      limit 20
    `,
  ]);

  const [pending, reviewed] = await Promise.all([
    withSignedUrls(pendingRows),
    withSignedUrls(reviewedRows),
  ]);

  // Group pending by venue, preserving the venue-name sort order.
  const byVenue = new Map<string, typeof pending>();
  for (const p of pending) {
    const list = byVenue.get(p.venue_id) ?? [];
    list.push(p);
    byVenue.set(p.venue_id, list);
  }

  return (
    <div>
      <h1 className="text-lg font-semibold">Photo queue</h1>
      <p className="mt-1 text-sm text-gray-600">
        {pending.length === 0
          ? "No photos waiting for review."
          : `${pending.length} photo${pending.length === 1 ? "" : "s"} waiting for review. Approved photos appear on the public venue page.`}
      </p>

      {[...byVenue.values()].map((photos) => (
        <section key={photos[0].venue_id} className="mt-6">
          <h2 className="text-sm font-semibold">
            <Link
              href={`/venue/${photos[0].venue_slug}`}
              className="hover:underline"
              target="_blank"
            >
              {photos[0].venue_name} ↗
            </Link>
          </h2>
          <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p) => (
              <div key={p.id} className="rounded-lg border border-gray-200 bg-white p-3">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url}
                      alt={`Pending upload for ${p.venue_name}`}
                      className="h-48 w-full rounded object-cover"
                    />
                  </a>
                ) : (
                  <div className="grid h-48 place-items-center rounded bg-gray-100 text-xs text-gray-500">
                    Preview unavailable
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>{dt.format(p.submitted_at)}</span>
                  <DeviceTag deviceId={p.device_id} />
                </div>
                <div className="mt-3 flex gap-2">
                  <form action={approvePhoto} className="flex-1">
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="w-full rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={rejectPhoto} className="flex-1">
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="w-full rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {reviewed.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-gray-700">Recently reviewed</h2>
          <ul className="mt-2 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
            {reviewed.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-3 py-2">
                {p.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.url}
                    alt=""
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <div className="grid h-12 w-12 place-items-center rounded bg-gray-100 text-[10px] text-gray-400">
                    removed
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.venue_name}</div>
                  <div className="text-xs text-gray-500">
                    submitted {dt.format(p.submitted_at)}
                    {p.reviewed_at && <> · reviewed {dt.format(p.reviewed_at)}</>}
                    {" · "}
                    <DeviceTag deviceId={p.device_id} />
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    p.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
