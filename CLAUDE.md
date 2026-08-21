# Beer

Mobile-web PWA answering "where is the cheapest beer near me, right now?" for St. Louis.

- **Spec (source of truth):** https://claude.ai/code/artifact/390d9c72-19dc-428d-8fde-c99cf3ce0492
- **Tickets:** Linear project "Beer v1" (BEE-5…BEE-35), team Beer inc.

## Product decisions that constrain code (do not re-litigate)

- Coverage-zones model: venues exist only inside seeded districts (Delmar Loop, Downtown).
  Outside coverage → "not covered yet" + area request. Never bare "0 results" outside coverage.
- Ranking = cheapest **single-serving** beer (draft/bottle/can) by **price per 12oz**.
  Pitchers/buckets never rank by default; they display labeled. Unknown sizes: assume
  12oz bottle/can, 16oz draft, mark `size_assumed`.
- Active structured specials substitute their price into ranking, flagged red with end time.
- "Happening Now" is computed from schedule windows at any hour; `end < start` crosses midnight.
- Price age: neutral "last updated" tag only. No staleness colors, no decay, no expiry, no hiding.
- "Verified" is evidence-only (official site / menu photo / venue confirmation).
  User reports can never become Verified by volume.
- v1 has **no user accounts**. Admin login (Supabase Auth, single user) is the only auth.
- Only public contribution: photo upload → admin queue. Nothing user-submitted is public unapproved.
- Privacy: user GPS stays in-browser (never stored server-side); search area persists in
  localStorage only; photo EXIF stripped client-side before upload.
- Free map stack: MapLibre GL + OpenFreeMap tiles (OSM attribution required). No Google APIs.

## Stack

Next.js (App Router, TS, Tailwind, `src/`) · MapLibre GL · Supabase (Postgres/PostGIS,
Storage, admin auth) · Vercel · PostHog.

## Local dev

- `docker compose up -d` → PostGIS on `localhost:54322` (user/pass/db: `beer`).
  SQL in `db/migrations/` runs on first boot; after schema changes:
  `docker compose down -v && docker compose up -d`.
- Same migration files are applied to Supabase — keep them portable (no Supabase-only SQL
  in core schema).
