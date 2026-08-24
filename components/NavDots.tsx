"use client";

import { CHAPTERS } from "@/lib/chapters";

const ITEMS = [
  { id: "top", label: "Intro" },
  ...CHAPTERS.map((c) => ({ id: c.id, label: c.title })),
];

export default function NavDots({ active }: { active: number }) {
  const go = (index: number) => {
    if (index === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document
      .getElementById(`ch-${CHAPTERS[index - 1].id}`)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="nav-dots" aria-label="Journey chapters">
      {ITEMS.map((item, i) => (
        <button
          key={item.id}
          type="button"
          className={`dot${i === active + 1 ? " dot--active" : ""}`}
          aria-label={item.label}
          onClick={() => go(i)}
        />
      ))}
    </nav>
  );
}
