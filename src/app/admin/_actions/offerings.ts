"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { withReadableDbErrors } from "../_lib/pg-errors";
import {
  OFFERING_FORMATS,
  PRICE_SOURCES,
  assumedSizeOz,
  type OfferingFormat,
  type PriceSource,
} from "../_lib/constants";
import type { FormState } from "./venues";

type ParsedOffering = {
  venueId: string;
  beerName: string;
  brand: string | null;
  format: OfferingFormat;
  sizeOz: number;
  sizeAssumed: boolean;
  price: number;
  source: PriceSource;
  isPopular: boolean;
};

function parseOfferingForm(formData: FormData): ParsedOffering | { error: string } {
  const venueId = String(formData.get("venue_id") ?? "");
  const beerName = String(formData.get("beer_name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim() || null;
  const format = String(formData.get("format") ?? "");
  const sizeRaw = String(formData.get("size_oz") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const source = String(formData.get("source") ?? "");
  const isPopular = formData.get("is_popular") === "on";

  if (!venueId) return { error: "Missing venue." };
  if (!beerName) return { error: "Beer name is required." };
  if (!(OFFERING_FORMATS as readonly string[]).includes(format))
    return { error: "Pick a format." };
  if (!(PRICE_SOURCES as readonly string[]).includes(source))
    return { error: "Pick a price source." };

  const price = Number(priceRaw);
  if (priceRaw === "" || !Number.isFinite(price) || price < 0)
    return { error: "Price must be a non-negative number." };

  // Assumed-size rule (spec §7): blank size → 12oz bottle/can, 16oz draft,
  // flagged size_assumed. Pitchers/buckets must have an explicit size.
  let sizeOz: number;
  let sizeAssumed = false;
  if (sizeRaw === "") {
    const assumed = assumedSizeOz(format as OfferingFormat);
    if (assumed === null)
      return { error: "Pitchers and buckets need an explicit size in oz." };
    sizeOz = assumed;
    sizeAssumed = true;
  } else {
    sizeOz = Number(sizeRaw);
    if (!Number.isFinite(sizeOz) || sizeOz <= 0)
      return { error: "Size must be a positive number of oz." };
  }

  return {
    venueId, beerName, brand,
    format: format as OfferingFormat,
    sizeOz, sizeAssumed, price,
    source: source as PriceSource,
    isPopular,
  };
}

export async function createOffering(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = parseOfferingForm(formData);
  if ("error" in parsed) return parsed;

  const result = await withReadableDbErrors(async () => {
    await sql`
      insert into offerings (venue_id, beer_name, brand, format, size_oz, size_assumed, price, source, is_popular)
      values (${parsed.venueId}, ${parsed.beerName}, ${parsed.brand}, ${parsed.format},
              ${parsed.sizeOz}, ${parsed.sizeAssumed}, ${parsed.price}, ${parsed.source}, ${parsed.isPopular})
    `;
    return null;
  });
  if (result !== null && "error" in result) return result;

  revalidatePath(`/admin/venues/${parsed.venueId}`);
  return { ok: true };
}

export async function updateOffering(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing offering id." };
  const parsed = parseOfferingForm(formData);
  if ("error" in parsed) return parsed;

  const result = await withReadableDbErrors(async () => {
    // Spec §8: superseded offering rows are archived, never overwritten in place.
    // Archive the current row into offering_history, then update.
    await sql.begin(async (tx) => {
      const archived = await tx`
        insert into offering_history
          (offering_id, beer_name, brand, format, size_oz, size_assumed, price, source, last_verified_at)
        select id, beer_name, brand, format, size_oz, size_assumed, price, source, last_verified_at
        from offerings
        where id = ${id}
        returning id
      `;
      if (archived.length === 0) throw new Error("Offering not found");
      await tx`
        update offerings set
          beer_name = ${parsed.beerName},
          brand = ${parsed.brand},
          format = ${parsed.format},
          size_oz = ${parsed.sizeOz},
          size_assumed = ${parsed.sizeAssumed},
          price = ${parsed.price},
          source = ${parsed.source},
          is_popular = ${parsed.isPopular},
          last_verified_at = now()
        where id = ${id}
      `;
    });
    return null;
  });
  if (result !== null && "error" in result) return result;

  revalidatePath(`/admin/venues/${parsed.venueId}`);
  return { ok: true };
}

export async function deleteOffering(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const venueId = String(formData.get("venue_id") ?? "");
  if (!id) return;

  // Hard delete is acceptable at this scale; clear dependents first
  // (specials targeting it, and its price history).
  await sql.begin(async (tx) => {
    await tx`delete from specials where offering_id = ${id}`;
    await tx`delete from offering_history where offering_id = ${id}`;
    await tx`delete from offerings where id = ${id}`;
  });

  revalidatePath(`/admin/venues/${venueId}`);
}
