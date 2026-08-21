"use client";

import { Fragment, useActionState, useEffect, useState } from "react";
import { createOffering, updateOffering, deleteOffering } from "../_actions/offerings";
import type { FormState } from "../_actions/venues";
import {
  OFFERING_FORMATS,
  PRICE_SOURCES,
  assumedSizeOz,
  pricePer12oz,
  type OfferingFormat,
} from "../_lib/constants";

export type OfferingRow = {
  id: string;
  beer_name: string;
  brand: string | null;
  format: OfferingFormat;
  size_oz: number;
  size_assumed: boolean;
  price: number;
  price_per_12oz: number;
  source: string;
  verified: boolean;
  is_popular: boolean;
  last_verified_at: string;
};

const inputCls = "w-full rounded border border-gray-300 px-2 py-1.5 text-sm";
const labelCls = "block text-xs font-medium mb-1 text-gray-600";

function OfferingForm({
  venueId,
  offering,
  onDone,
}: {
  venueId: string;
  offering: OfferingRow | null;
  onDone: () => void;
}) {
  const action = offering ? updateOffering : createOffering;
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  const [format, setFormat] = useState<OfferingFormat>(offering?.format ?? "draft");
  const [sizeRaw, setSizeRaw] = useState(
    offering && !offering.size_assumed ? String(offering.size_oz) : "",
  );
  const [priceRaw, setPriceRaw] = useState(offering ? String(offering.price) : "");

  useEffect(() => {
    if (state.ok) onDone();
  }, [state, onDone]);

  // Live price-per-12oz preview, mirroring the DB's generated column and the
  // assumed-size rule (blank size → 12oz bottle/can, 16oz draft).
  const assumed = assumedSizeOz(format);
  const effectiveSize = sizeRaw.trim() === "" ? assumed : Number(sizeRaw);
  const price = Number(priceRaw);
  const per12 =
    priceRaw.trim() !== "" &&
    Number.isFinite(price) &&
    effectiveSize !== null &&
    Number.isFinite(effectiveSize) &&
    effectiveSize > 0
      ? pricePer12oz(price, effectiveSize)
      : null;

  return (
    <form action={formAction} className="rounded border border-amber-300 bg-amber-50 p-3">
      <input type="hidden" name="venue_id" value={venueId} />
      {offering && <input type="hidden" name="id" value={offering.id} />}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="col-span-2">
          <label className={labelCls}>Beer name *</label>
          <input
            name="beer_name"
            required
            defaultValue={offering?.beer_name ?? ""}
            className={inputCls}
          />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Brand</label>
          <input name="brand" defaultValue={offering?.brand ?? ""} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Format *</label>
          <select
            name="format"
            value={format}
            onChange={(e) => setFormat(e.target.value as OfferingFormat)}
            className={inputCls}
          >
            {OFFERING_FORMATS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>
            Size (oz){assumed !== null ? ` — blank = ${assumed} assumed` : " *"}
          </label>
          <input
            name="size_oz"
            type="number"
            step="0.01"
            min="0.01"
            value={sizeRaw}
            onChange={(e) => setSizeRaw(e.target.value)}
            placeholder={assumed !== null ? `${assumed} (assumed)` : "required"}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Price ($) *</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            value={priceRaw}
            onChange={(e) => setPriceRaw(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Source *</label>
          <select
            name="source"
            defaultValue={offering?.source ?? "admin_visit"}
            className={inputCls}
          >
            {PRICE_SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            name="is_popular"
            defaultChecked={offering?.is_popular ?? false}
          />
          Popular
        </label>
        <span className="font-medium">
          $/12oz:{" "}
          {per12 !== null ? (
            <span className="text-amber-700">${per12.toFixed(2)}</span>
          ) : (
            <span className="text-gray-400">—</span>
          )}
          {per12 !== null && sizeRaw.trim() === "" && assumed !== null && (
            <span className="ml-1 text-xs text-gray-500">(size assumed: {assumed} oz)</span>
          )}
        </span>
      </div>
      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {pending ? "Saving…" : offering ? "Save offering" : "Add offering"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm"
        >
          Cancel
        </button>
      </div>
      {offering && (
        <p className="mt-2 text-xs text-gray-500">
          Saving archives the current row into offering_history before updating.
        </p>
      )}
    </form>
  );
}

export default function OfferingsSection({
  venueId,
  offerings,
}: {
  venueId: string;
  offerings: OfferingRow[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Offerings ({offerings.length})</h2>
        {!creating && (
          <button
            type="button"
            onClick={() => {
              setCreating(true);
              setEditingId(null);
            }}
            className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
          >
            + Add offering
          </button>
        )}
      </div>

      {creating && (
        <div className="mt-3">
          <OfferingForm venueId={venueId} offering={null} onDone={() => setCreating(false)} />
        </div>
      )}

      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-left text-gray-600">
              <th className="py-2 pr-3">Beer</th>
              <th className="py-2 pr-3">Format</th>
              <th className="py-2 pr-3">Size</th>
              <th className="py-2 pr-3">Price</th>
              <th className="py-2 pr-3">$/12oz</th>
              <th className="py-2 pr-3">Source</th>
              <th className="py-2 pr-3">Flags</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {offerings.length === 0 && (
              <tr>
                <td colSpan={8} className="py-3 text-gray-500">No offerings yet.</td>
              </tr>
            )}
            {offerings.map((o) => (
              <Fragment key={o.id}>
                <tr className="border-b border-gray-200 align-top">
                  <td className="py-2 pr-3">
                    <span className="font-medium">{o.beer_name}</span>
                    {o.brand && <span className="text-gray-500"> · {o.brand}</span>}
                  </td>
                  <td className="py-2 pr-3">{o.format}</td>
                  <td className="py-2 pr-3">
                    {o.size_oz} oz{o.size_assumed && <span className="text-amber-600" title="Size assumed">*</span>}
                  </td>
                  <td className="py-2 pr-3">${o.price.toFixed(2)}</td>
                  <td className="py-2 pr-3 font-medium">${o.price_per_12oz.toFixed(2)}</td>
                  <td className="py-2 pr-3 text-gray-600">{o.source}</td>
                  <td className="py-2 pr-3 text-xs text-gray-600">
                    {o.verified ? "verified" : "unverified"}
                    {o.is_popular && " · popular"}
                  </td>
                  <td className="py-2 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(editingId === o.id ? null : o.id);
                        setCreating(false);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      {editingId === o.id ? "Close" : "Edit"}
                    </button>
                    <form
                      action={deleteOffering}
                      className="ml-3 inline"
                      onSubmit={(e) => {
                        if (!confirm(`Delete "${o.beer_name}"? This also removes its history and any specials targeting it.`))
                          e.preventDefault();
                      }}
                    >
                      <input type="hidden" name="id" value={o.id} />
                      <input type="hidden" name="venue_id" value={venueId} />
                      <button type="submit" className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
                {editingId === o.id && (
                  <tr>
                    <td colSpan={8} className="py-2">
                      <OfferingForm
                        venueId={venueId}
                        offering={o}
                        onDone={() => setEditingId(null)}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
