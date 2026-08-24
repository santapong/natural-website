"use client";

import { useEffect, useRef } from "react";

/** Tracks scroll progress 0→1 through a tall section (same pattern as useJourney) */
export function useSectionProgress() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      progressRef.current =
        scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { sectionRef, progressRef };
}
