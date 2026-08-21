import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

const MAX_RADIUS_MILES = 5;
const METERS_PER_MILE = 1609.344;
const MAX_POLYGON_VERTICES = 200;

type LngLat = [number, number];

function isLngLat(p: unknown): p is LngLat {
  return (
    Array.isArray(p) &&
    p.length === 2 &&
    typeof p[0] === "number" &&
    typeof p[1] === "number" &&
    Number.isFinite(p[0]) &&
    Number.isFinite(p[1]) &&
    Math.abs(p[0]) <= 180 &&
    Math.abs(p[1]) <= 90
  );
}

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

type VenueRow = {
  id: string;
  slug: string;
  name: string;
  address: string;
  lng: number;
  lat: number;
  beer_name: string;
  format: string;
  size_oz: number;
  size_assumed: boolean;
  price: number;
  price_per_12oz: number;
  source: string;
  verified: boolean;
  last_verified_at: Date;
};

/**
 * POST /api/search
 * Body: { polygon: [[lng,lat], ...] }  OR  { center: [lng,lat], radiusMiles: number }
 *
 * The search area is used transiently for this query only — nothing about it
 * (including GPS-derived centers) is ever written to the database.
 */
export async function POST(req: Request) {
  let body: { polygon?: unknown; center?: unknown; radiusMiles?: unknown };
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const hasPolygon = body.polygon !== undefined;
  const hasCenter = body.center !== undefined;
  if (hasPolygon === hasCenter) {
    return badRequest("Provide exactly one of `polygon` or `center` (+ radiusMiles)");
  }

  // Build the geo predicates as parameterized SQL fragments.
  let venuePredicate;
  let coveragePredicate;

  if (hasPolygon) {
    const poly = body.polygon;
    if (
      !Array.isArray(poly) ||
      poly.length < 3 ||
      poly.length > MAX_POLYGON_VERTICES ||
      !poly.every(isLngLat)
    ) {
      return badRequest(
        `\`polygon\` must be 3–${MAX_POLYGON_VERTICES} [lng,lat] pairs`,
      );
    }
    // Close the ring if the caller didn't.
    const first = poly[0] as LngLat;
    const last = poly[poly.length - 1] as LngLat;
    const ring =
      first[0] === last[0] && first[1] === last[1] ? poly : [...poly, first];
    const geojson = JSON.stringify({ type: "Polygon", coordinates: [ring] });
    // st_makevalid forgives self-intersections from finger-drawn shapes.
    const area = sql`st_makevalid(st_geomfromgeojson(${geojson}))::geography`;
    venuePredicate = sql`st_covers(${area}, v.location)`;
    coveragePredicate = sql`st_intersects(c.area, ${area})`;
  } else {
    if (!isLngLat(body.center)) {
      return badRequest("`center` must be a [lng,lat] pair");
    }
    const radiusMiles = Number(body.radiusMiles ?? 1);
    if (!Number.isFinite(radiusMiles) || radiusMiles <= 0) {
      return badRequest("`radiusMiles` must be a positive number");
    }
    const meters = Math.min(radiusMiles, MAX_RADIUS_MILES) * METERS_PER_MILE;
    const [lng, lat] = body.center;
    const point = sql`st_setsrid(st_makepoint(${lng}, ${lat}), 4326)::geography`;
    venuePredicate = sql`st_dwithin(v.location, ${point}, ${meters})`;
    coveragePredicate = sql`st_dwithin(c.area, ${point}, ${meters})`;
  }

  try {
    const [rows, [{ covered }]] = await Promise.all([
      sql<VenueRow[]>`
        select
          v.id, v.slug, v.name, v.address,
          st_x(v.location::geometry)::float8 as lng,
          st_y(v.location::geometry)::float8 as lat,
          o.beer_name,
          o.format::text as format,
          o.size_oz::float8 as size_oz,
          o.size_assumed,
          o.price::float8 as price,
          o.price_per_12oz::float8 as price_per_12oz,
          o.source::text as source,
          o.verified,
          o.last_verified_at
        from venues v
        join lateral (
          select o.beer_name, o.format, o.size_oz, o.size_assumed, o.price,
                 o.price_per_12oz, o.source, o.verified, o.last_verified_at
          from offerings o
          where o.venue_id = v.id
            -- Ranking counts single servings only (CLAUDE.md): never pitchers/buckets.
            and o.format in ('draft', 'bottle', 'can')
          order by o.price_per_12oz asc, o.price asc
          limit 1
        ) o on true
        where v.status = 'active' and ${venuePredicate}
        order by o.price_per_12oz asc, o.price asc, v.name asc
      `,
      sql<{ covered: boolean }[]>`
        select exists(
          select 1 from coverage_areas c where ${coveragePredicate}
        ) as covered
      `,
    ]);

    return Response.json({
      coverage: covered,
      venues: rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        address: r.address,
        lng: r.lng,
        lat: r.lat,
        cheapest: {
          beer_name: r.beer_name,
          format: r.format,
          size_oz: r.size_oz,
          size_assumed: r.size_assumed,
          price: r.price,
          price_per_12oz: r.price_per_12oz,
          source: r.source,
          verified: r.verified,
          last_verified_at: r.last_verified_at,
        },
      })),
    });
  } catch {
    // Degenerate geometry (e.g. all vertices collinear) can make PostGIS throw.
    return badRequest("Could not interpret the search area");
  }
}
