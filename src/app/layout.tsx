import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AnalyticsBoot from "@/components/AnalyticsBoot";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beer — cheapest beer near you",
  description:
    "Where is the cheapest beer near me, right now? Live in The Delmar Loop and Downtown St. Louis.",
  // BEE-29: PWA installability (manifest itself is src/app/manifest.ts).
  appleWebApp: { capable: true, title: "Beer", statusBarStyle: "default" },
  icons: { apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d97706", // amber-600 — matches manifest theme_color
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AnalyticsBoot />
        {children}
      </body>
    </html>
  );
}
