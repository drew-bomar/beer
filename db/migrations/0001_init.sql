-- Beer v1 initial schema (spec §8–10)
-- Runs identically against local Docker PostGIS and Supabase.

create extension if not exists postgis;

-- Enums
create type offering_format as enum ('draft', 'bottle', 'can', 'pitcher', 'bucket');
create type price_source as enum ('official_site', 'menu_photo', 'venue_confirmed', 'admin_visit', 'user_report');
create type venue_status as enum ('active', 'closed', 'hidden');
create type photo_status as enum ('pending', 'approved', 'rejected');
create type special_target as enum ('offering', 'category');
create type special_category as enum ('all_draft', 'all_bottles_cans', 'all_beer');

-- Coverage zones: venues exist only inside these (spec §14).
create table coverage_areas (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  area        geography(multipolygon, 4326) not null,
  created_at  timestamptz not null default now()
);

create index coverage_areas_area_gix on coverage_areas using gist (area);

create table venues (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  address     text not null,
  location    geography(point, 4326) not null,
  district_id uuid not null references coverage_areas (id),
  -- Weekly open hours, e.g. {"mon": [["16:00","02:00"]], ...}; null slot = closed that day.
  hours       jsonb,
  website_url text,
  google_url  text,
  -- Closures are marked, never deleted (spec §10).
  status      venue_status not null default 'active',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index venues_location_gix on venues using gist (location);
create index venues_district_idx on venues (district_id);

create table offerings (
  id               uuid primary key default gen_random_uuid(),
  venue_id         uuid not null references venues (id),
  beer_name        text not null,
  brand            text,
  format           offering_format not null,
  size_oz          numeric(6, 2) not null check (size_oz > 0),
  -- True when size was defaulted (12oz bottle/can, 16oz draft) rather than known.
  size_assumed     boolean not null default false,
  price            numeric(8, 2) not null check (price >= 0),
  -- The ranking key (spec §7): sticker price normalized to one standard beer.
  price_per_12oz   numeric(8, 2) generated always as (round(price / size_oz * 12, 2)) stored,
  source           price_source not null,
  -- "Verified" is an evidence-only status (spec §12): user reports can never mint it.
  verified         boolean generated always as (source <> 'user_report') stored,
  last_verified_at timestamptz not null default now(),
  is_popular       boolean not null default false,
  created_at       timestamptz not null default now()
);

create index offerings_venue_idx on offerings (venue_id);
create index offerings_brand_idx on offerings (brand);

-- Superseded offering rows are archived here on update, never overwritten in place (spec §8).
create table offering_history (
  id               uuid primary key default gen_random_uuid(),
  offering_id      uuid not null references offerings (id),
  beer_name        text not null,
  brand            text,
  format           offering_format not null,
  size_oz          numeric(6, 2) not null,
  size_assumed     boolean not null,
  price            numeric(8, 2) not null,
  source           price_source not null,
  last_verified_at timestamptz not null,
  archived_at      timestamptz not null default now()
);

create index offering_history_offering_idx on offering_history (offering_id);

create table specials (
  id              uuid primary key default gen_random_uuid(),
  venue_id        uuid not null references venues (id),
  -- 0 = Sunday … 6 = Saturday. A window belongs to its start day.
  days_of_week    smallint[] not null check (days_of_week <@ array[0, 1, 2, 3, 4, 5, 6]::smallint[]),
  start_time      time not null,
  -- end_time < start_time means the window crosses midnight (spec §9).
  end_time        time not null,
  target_type     special_target not null,
  offering_id     uuid references offerings (id),
  category        special_category,
  deal_price      numeric(8, 2) check (deal_price >= 0),
  discount_amount numeric(8, 2) check (discount_amount > 0),
  -- Unstructured deals: displayed on the venue page, invisible to ranking (spec §9).
  free_text       text,
  created_at      timestamptz not null default now(),
  constraint specials_target_matches check (
    (target_type = 'offering' and offering_id is not null and category is null)
    or (target_type = 'category' and category is not null and offering_id is null)
  ),
  constraint specials_one_price_mechanic check (
    not (deal_price is not null and discount_amount is not null)
  )
);

create index specials_venue_idx on specials (venue_id);

-- Menu/poster uploads: the only public contribution path in v1 (spec §11).
-- Nothing is public until status = 'approved'.
create table photos (
  id           uuid primary key default gen_random_uuid(),
  venue_id     uuid not null references venues (id),
  storage_path text not null,
  status       photo_status not null default 'pending',
  -- Anonymous device identifier for rate limiting and admin grouping (spec §16).
  device_id    text,
  submitted_at timestamptz not null default now(),
  reviewed_at  timestamptz
);

create index photos_status_idx on photos (status);
create index photos_venue_idx on photos (venue_id);

-- "Request this area" taps outside coverage: expansion-demand data (spec §14).
create table area_requests (
  id         uuid primary key default gen_random_uuid(),
  location   geography(point, 4326) not null,
  device_id  text,
  created_at timestamptz not null default now()
);
