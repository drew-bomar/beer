"use client";

import { useActionState, useState } from "react";
import { createArea, updateArea } from "../_actions/areas";
import type { FormState } from "../_actions/venues";
import { slugify } from "../_lib/constants";
import PolygonEditor, { type Ring } from "./PolygonEditor";

export type AreaFormData = {
  id: string;
  name: string;
  slug: string;
  polygons: Ring[];
};

const inputCls = "w-full rounded border border-gray-300 px-2 py-1.5 text-sm";
const labelCls = "block text-sm font-medium mb-1";

export default function AreaForm({ area }: { area: AreaFormData | null }) {
  const action = area ? updateArea : createArea;
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  const [name, setName] = useState(area?.name ?? "");
  const [slug, setSlug] = useState(area?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!area);
  const [polygons, setPolygons] = useState<Ring[]>(area?.polygons ?? []);

  return (
    <form action={formAction} className="space-y-4">
      {area && <input type="hidden" name="id" value={area.id} />}
      <input type="hidden" name="polygons" value={JSON.stringify(polygons)} />

      <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="a-name">Name *</label>
          <input
            id="a-name"
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
          <label className={labelCls} htmlFor="a-slug">Slug *</label>
          <input
            id="a-slug"
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
      </div>

      <div>
        <span className={labelCls}>
          Coverage polygon(s) * — click to add vertices, then “Finish polygon”
        </span>
        <PolygonEditor polygons={polygons} onChange={setPolygons} />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.ok && <p className="text-sm text-green-700">Saved.</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {pending ? "Saving…" : area ? "Save area" : "Create area"}
      </button>
    </form>
  );
}
