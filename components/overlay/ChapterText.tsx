"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createScope, stagger } from "animejs";
import type { Chapter } from "@/lib/chapters";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];
const CHAPTER_END = 6;

export default function ChapterText({
  chapter,
  index,
}: {
  chapter: Chapter;
  index: number;
}) {
  const root = useRef<HTMLElement>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPlayed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !played) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.classList.add("is-shown");
      return;
    }
    const scope = createScope({ root: el }).add(() => {
      animate(".ct-kicker", {
        opacity: [0, 1],
        y: [14, 0],
        duration: 700,
        ease: "outQuad",
      });
      animate(".ct-rule", {
        scaleX: [0, 1],
        duration: 900,
        ease: "outExpo",
        delay: 250,
      });
      animate(".ct-title .inner", {
        y: ["115%", "0%"],
        duration: 950,
        ease: "outExpo",
        delay: stagger(90, { start: 150 }),
      });
      animate(".ct-body", {
        opacity: [0, 1],
        y: [22, 0],
        duration: 800,
        ease: "outCubic",
        delay: 500,
      });
      animate(".numeral", {
        opacity: [0, 0.08],
        scale: [0.92, 1],
        duration: 1100,
        ease: "outCubic",
        delay: 100,
      });
    });
    return () => scope.revert();
  }, [played]);

  const restart = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section
      ref={root}
      id={`ch-${chapter.id}`}
      data-align={index % 2 === 1 ? "right" : "left"}
      className="chapter"
    >
      <span className="numeral">{ROMAN[index]}</span>
      <div className="card">
        <p className="kicker ct-kicker">{chapter.kicker}</p>
        <h2 className="ct-title">
          {chapter.title.split(" ").map((word, i) => (
            <span className="clip" key={i}>
              <span className="inner">{word}</span>{" "}
            </span>
          ))}
        </h2>
        <div className="rule ct-rule" />
        <p className="body ct-body">{chapter.body}</p>
        {index === CHAPTER_END && (
          <div className="finale-actions">
            <button type="button" className="cta cta--ghost" onClick={restart}>
              ↑ Walk it again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
