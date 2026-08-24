"use client";

// BEE-27: public menu-photo upload from the venue page.
// Privacy (CLAUDE.md): the photo is re-encoded through a canvas before upload —
// drawing pixels and re-exporting JPEG inherently drops all EXIF metadata
// (including GPS). The original file never leaves the browser.

import { useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { getDeviceId } from "@/lib/storage";

const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.85;
const MAX_BYTES = 10 * 1024 * 1024;

type UploadState =
  | { phase: "idle" }
  | { phase: "processing" }
  | { phase: "uploading" }
  | { phase: "done" }
  | { phase: "error"; message: string };

async function decodeImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(file);
  } catch {
    // Fallback for formats createImageBitmap won't take (e.g. HEIC on Safari,
    // which can still decode it via <img>).
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("undecodable"));
      };
      img.src = url;
    });
  }
}

/** Draw to canvas (≤2000px long edge) and re-encode as JPEG — strips EXIF/GPS. */
async function stripExifAndResize(file: File): Promise<Blob> {
  const img = await decodeImage(file);
  const w = "naturalWidth" in img ? img.naturalWidth : img.width;
  const h = "naturalHeight" in img ? img.naturalHeight : img.height;
  if (!w || !h) throw new Error("undecodable");

  const scale = Math.min(1, MAX_DIMENSION / Math.max(w, h));
  const outW = Math.max(1, Math.round(w * scale));
  const outH = Math.max(1, Math.round(h * scale));

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-unavailable");
  ctx.drawImage(img, 0, 0, outW, outH);
  if ("close" in img) img.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
  );
  if (!blob) throw new Error("encode-failed");
  return blob;
}

export default function PhotoUpload({
  venueId,
  venueSlug,
}: {
  venueId: string;
  venueSlug: string;
}) {
  const [state, setState] = useState<UploadState>({ phase: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFileChosen(file: File) {
    track("photo_upload_started", { venue_slug: venueSlug });
    setState({ phase: "processing" });
    try {
      const jpeg = await stripExifAndResize(file);
      if (jpeg.size > MAX_BYTES) {
        setState({ phase: "error", message: "That image is too large — try a smaller one." });
        return;
      }
      setState({ phase: "uploading" });
      const form = new FormData();
      form.append("file", new File([jpeg], "menu.jpg", { type: "image/jpeg" }));
      form.append("venue_id", venueId);
      form.append("device_id", getDeviceId());
      const res = await fetch("/api/photos", { method: "POST", body: form });
      if (res.status === 429) {
        setState({
          phase: "error",
          message: "Upload limit reached — you can send more photos in an hour.",
        });
        return;
      }
      if (!res.ok) throw new Error(`upload failed: ${res.status}`);
      setState({ phase: "done" });
      track("photo_upload_completed", { venue_slug: venueSlug });
    } catch {
      setState({
        phase: "error",
        message: "Couldn't process that photo — try a different image.",
      });
    }
  }

  if (state.phase === "done") {
    return (
      <div className="mt-3 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
        Thanks — pending review.
      </div>
    );
  }

  const busy = state.phase === "processing" || state.phase === "uploading";

  return (
    <div className="mt-3 flex flex-col items-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = ""; // allow re-picking the same file
          if (f) void onFileChosen(f);
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white active:bg-amber-700 disabled:opacity-60"
      >
        {state.phase === "processing"
          ? "Preparing photo…"
          : state.phase === "uploading"
            ? "Uploading…"
            : "Upload a menu photo"}
      </button>
      {state.phase === "error" && (
        <p className="mt-2 text-xs font-medium text-red-600">{state.message}</p>
      )}
      <p className="mt-2 text-xs text-neutral-400">
        Photos are reviewed before they appear. Location data is removed on your
        device before upload.
      </p>
    </div>
  );
}
