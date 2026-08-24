"use client";

import { useEffect } from "react";
import { trackSessionStart } from "@/lib/analytics";

/** Mounted once in the root layout: fires session_start once per browser session. */
export default function AnalyticsBoot() {
  useEffect(() => {
    trackSessionStart();
  }, []);
  return null;
}
