"use client";

// BEE-30: client-side analytics hooks for the (server-rendered) venue page.

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function VenuePageViewed({ slug }: { slug: string }) {
  useEffect(() => {
    track("venue_page_viewed", { venue_slug: slug });
  }, [slug]);
  return null;
}

export function GoogleLink({
  href,
  slug,
  className,
  children,
}: {
  href: string;
  slug: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track("google_link_tapped", { venue_slug: slug })}
    >
      {children}
    </a>
  );
}
