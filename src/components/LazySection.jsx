"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mounts its children only when the visitor scrolls near them.
 * Homepage sections fetch their data on mount, so this keeps below-the-fold
 * sections from competing with the hero for bandwidth on first load.
 *
 * - minHeight: placeholder height (keeps the footer from popping into view)
 * - id:        kept on the placeholder so in-page links (#id) still work
 *              before the section has mounted
 * - rootMargin: how early to start loading before it scrolls into view
 */
export default function LazySection({ children, minHeight = 400, id, rootMargin = "600px 0px" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  if (visible) return children;

  return <div ref={ref} id={id} style={{ minHeight }} aria-hidden="true" />;
}
