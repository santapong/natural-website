"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useJourney } from "@/hooks/useJourney";
import { CHAPTERS } from "@/lib/chapters";
import Hero from "@/components/Hero";
import ChapterText from "@/components/overlay/ChapterText";
import NavDots from "@/components/NavDots";
import TreeAnatomy from "@/components/anatomy/TreeAnatomy";
import SeedSanctuary from "@/components/sanctuary/SeedSanctuary";

const JourneyCanvas = dynamic(() => import("@/components/JourneyCanvas"), {
  ssr: false,
});

export default function Experience() {
  const { journeyRef, progressRef, chapter } = useJourney();
  const [freeWalk, setFreeWalk] = useState(false);
  const [mapMode, setMapMode] = useState(false);

  // freeze page scroll while exploring
  useEffect(() => {
    document.body.style.overflow = freeWalk || mapMode ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [freeWalk, mapMode]);

  /** Teleport the scroll journey to the start of a biome */
  const travelTo = (chapterIndex: number) => {
    const el = journeyRef.current;
    if (!el) return;
    const p = Math.min(0.995, chapterIndex / CHAPTERS.length + 0.02);
    const top = el.offsetTop + p * (el.offsetHeight - window.innerHeight);
    setMapMode(false);
    window.scrollTo({ top, behavior: "auto" });
  };

  return (
    <>
      <Hero />

      <section id="journey" ref={journeyRef} className="journey">
        <div className="stage">
          <JourneyCanvas
            progressRef={progressRef}
            freeWalk={freeWalk}
            mapMode={mapMode}
            onWalkExit={() => setFreeWalk(false)}
            onBiomeSelect={travelTo}
          />
        </div>
        {CHAPTERS.map((c, i) => (
          <ChapterText key={c.id} chapter={c} index={i} />
        ))}
      </section>

      <TreeAnatomy />

      <SeedSanctuary />

      <footer className="site-footer">
        <span className="footer-mark">NATURAL WILD</span>
        <span className="footer-credit">
          Three.js · Anime.js — a scroll-driven forest story
        </span>
      </footer>

      <NavDots active={chapter} />

      {!freeWalk && !mapMode && (
        <>
          <button
            type="button"
            className="walk-btn"
            onClick={() => setFreeWalk(true)}
            title="Explore the world on foot (desktop)"
          >
            🚶 Free walk
          </button>
          <button
            type="button"
            className="walk-btn map-btn"
            onClick={() => setMapMode(true)}
            title="See the whole world from above"
          >
            🗺️ World map
          </button>
        </>
      )}

      {freeWalk && (
        <div className="walk-hud">
          <strong>WASD</strong> move · <strong>Shift</strong> run ·{" "}
          <strong>mouse</strong> look · <strong>ESC</strong> exit
        </div>
      )}

      {mapMode && (
        <>
          <div className="walk-hud">
            Click a beacon to travel there
          </div>
          <button
            type="button"
            className="walk-btn"
            onClick={() => setMapMode(false)}
          >
            ✕ Close map
          </button>
        </>
      )}
    </>
  );
}
