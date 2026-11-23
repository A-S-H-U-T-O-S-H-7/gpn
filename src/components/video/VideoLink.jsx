"use client";

import Link from "next/link";
import { useVideoModal } from "./VideoModalProvider";

const VIDEO_HREF = /^\/video\/([^/?#]+)/;

/**
 * Drop-in replacement for next/link.
 * If `href` points to /video/[slug], a normal click opens the video in the
 * player modal instead of navigating. Ctrl/Cmd/Shift/middle-click still open
 * the full page (new tab etc.), and non-video hrefs behave like a plain Link.
 *
 * Optional props:
 *  - video:    card data for the item (title/thumbnail shown instantly)
 *  - playlist: array of videos ({ slug, ... }) to enable Next / Previous
 */
export default function VideoLink({ href, video, playlist, onClick, children, ...props }) {
  const modal = useVideoModal();

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || !modal) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const match = typeof href === "string" ? href.match(VIDEO_HREF) : null;
    if (!match) return;

    const slug = decodeURIComponent(match[1]);
    const opened = modal.openVideo({ ...(video || {}), slug }, playlist);
    if (opened) e.preventDefault();
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
