"use client";

import dynamic from "next/dynamic";
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

  return (
    <>
      <Hero />

      <section id="journey" ref={journeyRef} className="journey">
        <div className="stage">
          <JourneyCanvas progressRef={progressRef} />
        </div>
        {CHAPTERS.map((c, i) => (
          <ChapterText key={c.id} chapter={c} index={i} />
        ))}
      </section>

      <footer className="site-footer">
        <span className="footer-mark">NATURAL WILD</span>
        <span className="footer-credit">
          Three.js · Spline · Anime.js — a scroll-driven forest story
        </span>
      </footer>

      <NavDots active={chapter} />
    </>
  );
}
