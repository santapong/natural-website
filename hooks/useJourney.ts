"use client";

import { useEffect, useRef, useState } from "react";
import { CHAPTERS } from "@/lib/chapters";

export function useJourney() {
  const journeyRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);
  const [chapter, setChapter] = useState(-1);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const el = journeyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const p =
        scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      progressRef.current = p;
      const ch =
        p <= 0 && rect.top >= 0
          ? -1
          : Math.min(CHAPTERS.length - 1, Math.floor(p * CHAPTERS.length));
      setChapter((prev) => (prev === ch ? prev : ch));
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

  return { journeyRef, progressRef, chapter };
}
