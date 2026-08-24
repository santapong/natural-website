"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useJourney } from "@/hooks/useJourney";
import { CHAPTERS } from "@/lib/chapters";
import Hero from "@/components/Hero";
import ChapterText from "@/components/overlay/ChapterText";
import NavDots from "@/components/NavDots";

const JourneyCanvas = dynamic(() => import("@/components/JourneyCanvas"), {
  ssr: false,
});

export default function Experience() {
  const { journeyRef, progressRef, chapter } = useJourney();
  const [freeWalk, setFreeWalk] = useState(false);

  // freeze page scroll while exploring on foot
  useEffect(() => {
    document.body.style.overflow = freeWalk ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [freeWalk]);

  return (
    <>
      <Hero />

      <section id="journey" ref={journeyRef} className="journey">
        <div className="stage">
          <JourneyCanvas
            progressRef={progressRef}
            freeWalk={freeWalk}
            onWalkExit={() => setFreeWalk(false)}
          />
        </div>
        {CHAPTERS.map((c, i) => (
          <ChapterText key={c.id} chapter={c} index={i} />
        ))}
      </section>

      <footer className="site-footer">
        <span className="footer-mark">NATURAL WILD</span>
        <span className="footer-credit">
          Three.js · Anime.js — a scroll-driven forest story
        </span>
      </footer>

      <NavDots active={chapter} />

      {!freeWalk && (
        <button
          type="button"
          className="walk-btn"
          onClick={() => setFreeWalk(true)}
          title="Explore the world on foot (desktop)"
        >
          🚶 Free walk
        </button>
      )}

      {freeWalk && (
        <div className="walk-hud">
          <strong>WASD</strong> move · <strong>Shift</strong> run ·{" "}
          <strong>mouse</strong> look · <strong>ESC</strong> exit
        </div>
      )}
    </>
  );
}
