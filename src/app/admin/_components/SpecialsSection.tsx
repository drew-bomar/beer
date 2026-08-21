"use client";

import { Fragment, useActionState, useEffect, useState } from "react";
import { createSpecial, updateSpecial, deleteSpecial } from "../_actions/specials";
import type { FormState } from "../_actions/venues";
import {
  DOW_LABELS,
  SPECIAL_CATEGORIES,
  SPECIAL_CATEGORY_LABELS,
  type SpecialCategory,
} from "../_lib/constants";

export type SpecialRow = {
  id: string;
  days_of_week: number[];
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
  target_type: "offering" | "category";
  offering_id: string | null;
  category: SpecialCategory | null;
  deal_price: number | null;
  discount_amount: number | null;
  free_text: string | null;
};

export type OfferingOption = { id: string; label: string };

const inputCls = "w-full rounded border border-gray-300 px-2 py-1.5 text-sm";
const labelCls = "block text-xs font-medium mb-1 text-gray-600";

function SpecialForm({
  venueId,
  offeringOptions,
  special,
  onDone,
}: {
  venueId: string;
  offeringOptions: OfferingOption[];
  special: SpecialRow | null;
  onDone: () => void;
}) {
  const action = special ? updateSpecial : createSpecial;
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  const [targetType, setTargetType] = useState<"offering" | "category">(
    special?.target_type ?? "category",
  );
  const [startTime, setStartTime] = useState(special?.start_time ?? "16:00");
  const [endTime, setEndTime] = useState(special?.end_time ?? "19:00");
  const [dealPrice, setDealPrice] = useState(
    special?.deal_price != null ? String(special.deal_price) : "",
  );
  const [discount, setDiscount] = useState(
    special?.discount_amount != null ? String(special.discount_amount) : "",
  );

  useEffect(() => {
    if (state.ok) onDone();
  }, [state, onDone]);

  const crossesMidnight = startTime !== "" && endTime !== "" && endTime < startTime;
  const bothPrices = dealPrice.trim() !== "" && discount.trim() !== "";

  return (
    <form action={formAction} className="rounded border border-blue-300 bg-blue-50 p-3">
      <input type="hidden" name="venue_id" value={venueId} />
      {special && <input type="hidden" name="id" value={special.id} />}

      <div className="flex flex-wrap items-center gap-3">
        <span className={labelCls + " mb-0"}>Days *</span>
        {DOW_LABELS.map((label, i) => (
          <label key={i} className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              name="dow"
              value={i}
              defaultChecked={special?.days_of_week.includes(i) ?? false}
            />
            {label}
          </label>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className={labelCls}>Start *</label>
          <input
            type="time"
            name="start_time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>End *</label>
          <input
            type="time"
            name="end_time"
            required
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Target *</label>
          <select
            name="target_type"
            value={targetType}
            onChange={(e) => setTargetType(e.target.value as "offering" | "category")}
            className={inputCls}
          >
            <option value="category">category</option>
            <option value="offering">offering</option>
          </select>
        </div>
        <div>
          {targetType === "offering" ? (
            <>
              <label className={labelCls}>Offering *</label>
              <select
                name="offering_id"
                required
                defaultValue={special?.offering_id ?? ""}
                className={inputCls}
              >
                <option value="" disabled>Pick an offering…</option>
                {offeringOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </>
          ) : (
            <>
              <label className={labelCls}>Category *</label>
              <select
                name="category"
                required
                defaultValue={special?.category ?? "all_draft"}
                className={inputCls}
              >
                {SPECIAL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{SPECIAL_CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {crossesMidnight && (
        <p className="mt-2 text-sm font-medium text-amber-700">
          ⤵ End is before start — this special crosses midnight (e.g. 22:00–01:00).
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className={labelCls}>Deal price ($)</label>
          <input
            type="number"
            name="deal_price"
            step="0.01"
            min="0"
            value={dealPrice}
            onChange={(e) => setDealPrice(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Discount amount ($ off)</label>
          <input
            type="number"
            name="discount_amount"
            step="0.01"
            min="0.01"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Free text (unstructured deal — not ranked)</label>
          <input
            name="free_text"
            defaultValue={special?.free_text ?? ""}
            placeholder="e.g. $12 buckets during home games"
            className={inputCls}
          />
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Enter exactly one of deal price / discount amount. Free-text-only deals may leave
        both blank.
      </p>
      {bothPrices && (
        <p className="mt-1 text-sm text-red-600">
          Pick one: deal price or discount amount — not both.
        </p>
      )}

      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={pending || bothPrices}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Saving…" : special ? "Save special" : "Add special"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function describeDays(days: number[]): string {
  return days.map((d) => DOW_LABELS[d] ?? d).join(", ");
}

export default function SpecialsSection({
  venueId,
  specials,
  offeringOptions,
}: {
  venueId: string;
  specials: SpecialRow[];
  offeringOptions: OfferingOption[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const offeringLabel = (id: string | null) =>
    offeringOptions.find((o) => o.id === id)?.label ?? "unknown offering";

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Specials ({specials.length})</h2>
        {!creating && (
          <button
            type="button"
            onClick={() => {
              setCreating(true);
              setEditingId(null);
            }}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add special
          </button>
        )}
      </div>

      {creating && (
        <div className="mt-3">
          <SpecialForm
            venueId={venueId}
            offeringOptions={offeringOptions}
            special={null}
            onDone={() => setCreating(false)}
          />
        </div>
      )}

      <div className="mt-3 space-y-2">
        {specials.length === 0 && <p className="text-sm text-gray-500">No specials yet.</p>}
        {specials.map((s) => (
          <Fragment key={s.id}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded border border-gray-200 bg-white px-3 py-2 text-sm">
              <span className="font-medium">{describeDays(s.days_of_week)}</span>
              <span>
                {s.start_time}–{s.end_time}
                {s.end_time < s.start_time && (
                  <span className="ml-1 text-xs text-amber-600">(crosses midnight)</span>
                )}
              </span>
              <span className="text-gray-600">
                {s.target_type === "offering"
                  ? offeringLabel(s.offering_id)
                  : SPECIAL_CATEGORY_LABELS[s.category as SpecialCategory] ?? s.category}
              </span>
              <span className="font-medium text-green-700">
                {s.deal_price != null && `$${s.deal_price.toFixed(2)}`}
                {s.discount_amount != null && `$${s.discount_amount.toFixed(2)} off`}
                {s.deal_price == null && s.discount_amount == null && "free text only"}
              </span>
              {s.free_text && <span className="italic text-gray-500">“{s.free_text}”</span>}
              <span className="ml-auto whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(editingId === s.id ? null : s.id);
                    setCreating(false);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  {editingId === s.id ? "Close" : "Edit"}
                </button>
                <form
                  action={deleteSpecial}
                  className="ml-3 inline"
                  onSubmit={(e) => {
                    if (!confirm("Delete this special?")) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="venue_id" value={venueId} />
                  <button type="submit" className="text-red-600 hover:underline">
                    Delete
                  </button>
                </form>
              </span>
            </div>
            {editingId === s.id && (
              <SpecialForm
                venueId={venueId}
                offeringOptions={offeringOptions}
                special={s}
                onDone={() => setEditingId(null)}
              />
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
