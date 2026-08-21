"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { withReadableDbErrors } from "../_lib/pg-errors";
import { SPECIAL_CATEGORIES, type SpecialCategory } from "../_lib/constants";
import type { FormState } from "./venues";

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

type ParsedSpecial = {
  venueId: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  targetType: "offering" | "category";
  offeringId: string | null;
  category: SpecialCategory | null;
  dealPrice: number | null;
  discountAmount: number | null;
  freeText: string | null;
};

function parseSpecialForm(formData: FormData): ParsedSpecial | { error: string } {
  const venueId = String(formData.get("venue_id") ?? "");
  const daysOfWeek = formData
    .getAll("dow")
    .map((d) => Number(d))
    .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6)
    .sort();
  const startTime = String(formData.get("start_time") ?? "");
  const endTime = String(formData.get("end_time") ?? "");
  const targetType = String(formData.get("target_type") ?? "");
  const offeringId = String(formData.get("offering_id") ?? "") || null;
  const category = String(formData.get("category") ?? "") || null;
  const dealRaw = String(formData.get("deal_price") ?? "").trim();
  const discountRaw = String(formData.get("discount_amount") ?? "").trim();
  const freeText = String(formData.get("free_text") ?? "").trim() || null;

  if (!venueId) return { error: "Missing venue." };
  if (daysOfWeek.length === 0) return { error: "Pick at least one day of the week." };
  if (!TIME_RE.test(startTime) || !TIME_RE.test(endTime))
    return { error: "Start and end times must be HH:MM." };
  if (targetType !== "offering" && targetType !== "category")
    return { error: "Pick a target type." };
  if (targetType === "offering" && !offeringId)
    return { error: "Pick which offering this special applies to." };
  if (targetType === "category" &&
      !(SPECIAL_CATEGORIES as readonly string[]).includes(category ?? ""))
    return { error: "Pick a category." };

  const dealPrice = dealRaw === "" ? null : Number(dealRaw);
  const discountAmount = discountRaw === "" ? null : Number(discountRaw);
  if (dealPrice !== null && (!Number.isFinite(dealPrice) || dealPrice < 0))
    return { error: "Deal price must be a non-negative number." };
  if (discountAmount !== null && (!Number.isFinite(discountAmount) || discountAmount <= 0))
    return { error: "Discount amount must be greater than 0." };
  if (dealPrice !== null && discountAmount !== null)
    return { error: "Enter a deal price OR a discount amount, not both." };
  if (dealPrice === null && discountAmount === null && freeText === null)
    return {
      error:
        "Enter exactly one of deal price / discount amount — or free text for an unstructured deal.",
    };

  return {
    venueId, daysOfWeek, startTime, endTime,
    targetType,
    offeringId: targetType === "offering" ? offeringId : null,
    category: targetType === "category" ? (category as SpecialCategory) : null,
    dealPrice, discountAmount, freeText,
  };
}

export async function createSpecial(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = parseSpecialForm(formData);
  if ("error" in parsed) return parsed;

  const result = await withReadableDbErrors(async () => {
    await sql`
      insert into specials
        (venue_id, days_of_week, start_time, end_time, target_type, offering_id, category, deal_price, discount_amount, free_text)
      values
        (${parsed.venueId}, ${sql.array(parsed.daysOfWeek)}::smallint[], ${parsed.startTime}, ${parsed.endTime},
         ${parsed.targetType}, ${parsed.offeringId}, ${parsed.category},
         ${parsed.dealPrice}, ${parsed.discountAmount}, ${parsed.freeText})
    `;
    return null;
  });
  if (result !== null && "error" in result) return result;

  revalidatePath(`/admin/venues/${parsed.venueId}`);
  return { ok: true };
}

export async function updateSpecial(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing special id." };
  const parsed = parseSpecialForm(formData);
  if ("error" in parsed) return parsed;

  const result = await withReadableDbErrors(async () => {
    await sql`
      update specials set
        days_of_week = ${sql.array(parsed.daysOfWeek)}::smallint[],
        start_time = ${parsed.startTime},
        end_time = ${parsed.endTime},
        target_type = ${parsed.targetType},
        offering_id = ${parsed.offeringId},
        category = ${parsed.category},
        deal_price = ${parsed.dealPrice},
        discount_amount = ${parsed.discountAmount},
        free_text = ${parsed.freeText}
      where id = ${id}
    `;
    return null;
  });
  if (result !== null && "error" in result) return result;

  revalidatePath(`/admin/venues/${parsed.venueId}`);
  return { ok: true };
}

export async function deleteSpecial(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const venueId = String(formData.get("venue_id") ?? "");
  if (!id) return;
  await sql`delete from specials where id = ${id}`;
  revalidatePath(`/admin/venues/${venueId}`);
}
