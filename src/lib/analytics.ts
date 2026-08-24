// BEE-30: thin PostHog wrapper (spec §20). Anonymous product events only.
//
// - Initializes ONLY when NEXT_PUBLIC_POSTHOG_KEY is non-empty; otherwise every
//   call is a silent no-op, so call sites never branch on configuration.
// - No autocapture, no pageview capture, no session recording.
// - Respects Do Not Track / Global Privacy Control (never initializes).
// - Client-only: on the server every function is a no-op.

import posthog from "posthog-js";

export type AnalyticsEvent =
  | "session_start"
  | "map_load"
  | "area_radius_change"
  | "area_polygon_drawn"
  | "area_restored_from_cache"
  | "coverage_miss"
  | "area_request_tapped"
  | "list_viewed"
  | "card_expanded"
  | "venue_page_viewed"
  | "google_link_tapped"
  | "happening_now_viewed"
  | "filter_applied"
  | "zero_results"
  | "photo_upload_started"
  | "photo_upload_completed";

let initialized = false;
let enabled = false;

function doNotTrack(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  const win = (typeof window !== "undefined" ? window : {}) as { doNotTrack?: string };
  return (
    nav.doNotTrack === "1" ||
    nav.doNotTrack === "yes" ||
    win.doNotTrack === "1" ||
    nav.globalPrivacyControl === true
  );
}

function ensureInit(): boolean {
  if (initialized) return enabled;
  initialized = true;
  if (typeof window === "undefined") return false;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || doNotTrack()) return false; // no-op stub mode

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: true,
    respect_dnt: true,
    persistence: "localStorage",
  });
  enabled = true;
  return true;
}

/** Fire an anonymous product event. Safe to call anywhere, any time. */
export function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  try {
    if (!ensureInit()) return;
    posthog.capture(event, properties);
  } catch {
    // Analytics must never break the app.
  }
}

/** Fired once per browser session from the root layout. */
export function trackSessionStart(): void {
  try {
    if (typeof window === "undefined") return;
    const KEY = "beer.sessionStarted";
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, "1");
    track("session_start");
  } catch {
    // sessionStorage unavailable — skip rather than double-fire.
  }
}
