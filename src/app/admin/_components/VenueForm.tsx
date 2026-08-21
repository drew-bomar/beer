"use client";

import { useActionState, useState } from "react";
import { createVenue, updateVenue, type FormState } from "../_actions/venues";
import { VENUE_STATUSES, slugify, type WeeklyHours } from "../_lib/constants";
import MapPicker, { type LngLat } from "./MapPicker";
import HoursEditor from "./HoursEditor";

export type District = { id: string; name: string };

export type VenueFormData = {
  id: string;
  name: string;
  slug: string;
  address: string;
  district_id: string;
  website_url: string | null;
  google_url: string | null;
  status: string;
  hours: WeeklyHours | null;
  lng: number;
  lat: number;
};

const inputCls = "w-full rounded border border-gray-300 px-2 py-1.5 text-sm";
const labelCls = "block text-sm font-medium mb-1";

export default function VenueForm({
  districts,
  venue,
}: {
  districts: District[];
  venue: VenueFormData | null;
}) {
  const action = venue ? updateVenue : createVenue;
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  const [name, setName] = useState(venue?.name ?? "");
  const [slug, setSlug] = useState(venue?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!venue);
  const [point, setPoint] = useState<LngLat | null>(
    venue ? { lng: venue.lng, lat: venue.lat } : null,
  );
  const [hours, setHours] = useState<WeeklyHours>(venue?.hours ?? {});

  return (
    <form action={formAction} className="space-y-4">
      {venue && <input type="hidden" name="id" value={venue.id} />}
      <input
        type="hidden"
        name="hours"
        value={JSON.stringify(hours)}
      />
      <input type="hidden" name="lng" value={point?.lng ?? ""} />
      <input type="hidden" name="lat" value={point?.lat ?? ""} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="v-name">Name *</label>
          <input
            id="v-name"
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="v-slug">Slug *</label>
          <input
            id="v-slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={`${inputCls} font-mono`}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="v-address">Address *</label>
          <input
            id="v-address"
            name="address"
            required
            defaultValue={venue?.address ?? ""}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="v-district">District *</label>
          <select
            id="v-district"
            name="district_id"
            required
            defaultValue={venue?.district_id ?? ""}
            className={inputCls}
          >
            <option value="" disabled>Pick a district…</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="v-status">Status</label>
          <select
            id="v-status"
            name="status"
            defaultValue={venue?.status ?? "active"}
            className={inputCls}
          >
            {VENUE_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="v-website">Website URL</label>
          <input
            id="v-website"
            name="website_url"
            type="url"
            defaultValue={venue?.website_url ?? ""}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="v-google">Google Maps URL</label>
          <input
            id="v-google"
            name="google_url"
            type="url"
            defaultValue={venue?.google_url ?? ""}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <span className={labelCls}>Location * (click the map to set)</span>
        <MapPicker point={point} onPick={setPoint} />
        <p className="mt-1 text-xs text-gray-500">
          {point
            ? `${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}`
            : "No location set yet."}
        </p>
      </div>

      <div>
        <span className={labelCls}>Weekly hours</span>
        <HoursEditor value={hours} onChange={setHours} />
        <p className="mt-1 text-xs text-gray-500">
          Days with no ranges are stored as closed. “+1d” = closes after midnight.
        </p>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.ok && <p className="text-sm text-green-700">Saved.</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : venue ? "Save venue" : "Create venue"}
      </button>
    </form>
  );
}
