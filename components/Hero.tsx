"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { animate, createScope, stagger } from "animejs";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="spline-loading" />,
});

export const DEMO_SCENE_URL =
  "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.classList.add("is-shown");
      return;
    }
    const scope = createScope({ root: el }).add(() => {
      animate(".hero-kicker", {
        opacity: [0, 1],
        letterSpacing: ["0.7em", "0.35em"],
        duration: 1000,
        ease: "outQuad",
      });
      animate(".hero-title .inner", {
        y: ["112%", "0%"],
        duration: 1100,
        ease: "outExpo",
        delay: stagger(130, { start: 120 }),
      });
      animate(".hero-sub", {
        opacity: [0, 1],
        y: [24, 0],
        duration: 900,
        ease: "outCubic",
        delay: 650,
      });
      animate(".hero-cta", {
        opacity: [0, 1],
        y: [18, 0],
        duration: 800,
        ease: "outCubic",
        delay: 850,
      });
    });
    return () => scope.revert();
  }, []);

  const begin = () =>
    document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" });

  return (
    <header ref={root} className="hero">
      <div className="spline-fill">
        <Spline scene={DEMO_SCENE_URL} />
      </div>
      <div className="hero-scrim" />
      <div className="hero-content">
        <p className="kicker hero-kicker">An interactive 3D scroll journey</p>
        <h1 className="hero-title">
          <span className="clip">
            <span className="inner">NATURAL</span>
          </span>
          <br />
          <span className="clip">
            <span className="inner">WILD</span>
          </span>
        </h1>
        <p className="body hero-sub">
          Drift from the firefly-lit forest floor, up through the golden canopy,
          across a hidden river — into the sunset where the wild rests.
        </p>
        <button type="button" className="cta hero-cta" onClick={begin}>
          Begin the journey ↓
        </button>
      </div>
      <div className="scroll-hint">
        Scroll<span className="hint-arrow">↓</span>
      </div>
      <span className="hero-tag">Spline demo scene — swap the URL in components/Hero.tsx</span>
    </header>
  );
}
