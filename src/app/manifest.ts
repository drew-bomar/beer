import type { MetadataRoute } from "next";

// BEE-29: PWA web app manifest. Next serves this at /manifest.webmanifest and
// injects the <link rel="manifest"> tag automatically.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Beer",
    short_name: "Beer",
    description:
      "Where is the cheapest beer near me, right now? Live in The Delmar Loop and Downtown St. Louis.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fffbeb", // amber-50
    theme_color: "#d97706", // amber-600 — the app accent
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Full-bleed amber background with the glyph inside the safe zone, so the
      // same art doubles as the maskable icon.
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
