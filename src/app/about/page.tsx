// BEE-31: About page — what Beer is, how prices work, how to contribute.

import Link from "next/link";
import type { Metadata } from "next";
import { sql } from "@/lib/db";

export const metadata: Metadata = {
  title: "About — Beer",
  description: "What Beer is, how prices work, and how to help.",
};

export const dynamic = "force-dynamic";

const CONTACT_EMAIL = "beer.stl.app@gmail.com";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h2>
      <div className="mt-2 flex flex-col gap-2 text-sm leading-relaxed text-neutral-700">
        {children}
      </div>
    </section>
  );
}

export default async function AboutPage() {
  // Covered districts come from the live coverage_areas table, so this page
  // stays correct as coverage expands.
  const areas = await sql<{ name: string }[]>`
    select name from coverage_areas order by name
  `;
  const districtList =
    areas.length === 0
      ? "St. Louis (districts coming soon)"
      : new Intl.ListFormat("en-US").format(areas.map((a) => a.name));

  const mailto = `mailto:${CONTACT_EMAIL}`;
  const ownerMailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Beer — I own this bar")}`;

  return (
    <div className="min-h-dvh flex-1 bg-white">
      <main className="mx-auto max-w-lg px-4 py-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <Link href="/" className="text-sm font-medium text-amber-700">
          ← Back to the map
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-neutral-900">About Beer</h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
          Beer answers one question: <em>where is the cheapest beer near me, right now?</em>{" "}
          It&apos;s a St. Louis project, currently live in {districtList}. Outside those
          districts you can request coverage right from the map.
        </p>

        <Section title="How prices work">
          <p>
            Every beer is ranked by its price <strong>per 12oz</strong>, so a $3 pint and a
            $2.50 bottle compare fairly. Pitchers and buckets are shown for reference but
            never ranked against single servings.
          </p>
          <p>
            A <strong>Verified</strong> price is backed by evidence — an official menu or
            website, a menu photo, or the venue confirming it directly. User reports are
            labeled as unverified, no matter how many people report them.
          </p>
          <p>
            Every price carries a neutral &ldquo;last updated&rdquo; tag so you can judge
            freshness yourself. Active specials substitute their deal price into the
            ranking and are flagged in red with their end time.
          </p>
        </Section>

        <Section title="How to help">
          <p>
            Spot a menu or a price board? Open the venue&apos;s page and{" "}
            <strong>upload a menu photo</strong> — it goes to a human review queue, and
            approved photos help keep prices verified. Location metadata is stripped from
            photos on your device before upload.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions, corrections, or a bar we&apos;re missing?{" "}
            <a href={mailto} className="font-medium text-amber-700 underline">
              {CONTACT_EMAIL}
            </a>
          </p>
          <p>
            Own this bar?{" "}
            <a href={ownerMailto} className="font-medium text-amber-700 underline">
              Email us
            </a>{" "}
            to confirm or correct your prices.
          </p>
        </Section>

        <Section title="Credits">
          <p>
            Map data ©{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              OpenStreetMap
            </a>{" "}
            contributors. Map tiles by{" "}
            <a
              href="https://openfreemap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              OpenFreeMap
            </a>
            .
          </p>
        </Section>

        <p className="mt-8 text-xs leading-relaxed text-neutral-400">
          Beer is an informational guide for patrons of legal drinking age. Prices change
          without notice — the bar&apos;s posted price always wins. Please drink
          responsibly.
        </p>
      </main>
    </div>
  );
}
