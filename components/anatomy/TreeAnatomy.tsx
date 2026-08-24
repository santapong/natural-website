"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* "The anime.js way" — single-screen exploded view of a tree.         */
/* Drag the slider (or press play): parts peel apart with stagger,     */
/* then the camera orbits the floating diagram. Click a label for      */
/* the full story of that part.                                        */
/* ------------------------------------------------------------------ */

interface Part {
  id: string;
  name: string;
  fact: string;
  desc: string;
  stats: [string, string][];
  aY: number;
  eY: number;
  tilt: number;
}

const PARTS: Part[] = [
  {
    id: "soil",
    name: "Soil Web",
    fact: "Fungi trade nutrients with roots",
    desc: "A hidden marketplace where fungal threads swap sugar for minerals. A forest is wired together underground long before it is woven together above it.",
    stats: [["Network", "hundreds of km per m³"], ["Older than", "the tree itself"]],
    aY: -0.14,
    eY: -0.14,
    tilt: 0,
  },
  {
    id: "roots",
    name: "Roots",
    fact: "Anchor · drink · communicate",
    desc: "Half the tree lives in darkness. Roots hold the soil, drink deep, and send chemical warnings to neighbouring trees through the fungal internet.",
    stats: [["Depth", "2–6 m typical"], ["Lifespan", "as long as the tree"]],
    aY: 0,
    eY: 2.1,
    tilt: 0,
  },
  {
    id: "trunk",
    name: "Trunk",
    fact: "A pump lifting water skyward",
    desc: "Millions of hollow straws (xylem) pull water upward by evaporation alone — no moving parts, no engine, silent for centuries.",
    stats: [["Rise", "up to 120 m"], ["Thirst", "~500 L / day"]],
    aY: 1.5,
    eY: 4.3,
    tilt: 0,
  },
  {
    id: "boughs-lower",
    name: "Lower Boughs",
    fact: "First shade of the young tree",
    desc: "The first branches a tree ever grows. They shade the soil, keep roots cool, and give the forest floor its dim green rooms.",
    stats: [["Order", "grow first, shed first"], ["Job", "climate control"]],
    aY: 2.2,
    eY: 6.5,
    tilt: 0.05,
  },
  {
    id: "boughs-upper",
    name: "Upper Boughs",
    fact: "Reaching for gaps of light",
    desc: "Upper branches reshape themselves season by season, leaning into every hole in the canopy where the sun gets through.",
    stats: [["Growth", "mm per day in spring"], ["Sense", "red & far-red light"]],
    aY: 3.0,
    eY: 8.7,
    tilt: -0.05,
  },
  {
    id: "veil",
    name: "Leaf Veil",
    fact: "Solar panels of air & light",
    desc: "Hundreds of thousands of leaves breathing in CO₂ and exhaling the oxygen you are using right now. Every one is a disposable solar panel.",
    stats: [["Intake", "~22 kg CO₂ / year"], ["Leaves", "100,000+ on a big tree"]],
    aY: 3.55,
    eY: 11.2,
    tilt: 0,
  },
  {
    id: "crown",
    name: "Crown",
    fact: "Home for birds and fireflies",
    desc: "The crown is a city: nesting birds, sleeping insects, rain catchers. Under a full canopy it can be 8 °C cooler than the street outside.",
    stats: [["Cooling", "up to −8 °C below"], ["Residents", "1,000+ species"]],
    aY: 4.45,
    eY: 13.6,
    tilt: 0,
  },
];

function smooth01(x: number) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

type Mode = { playing: boolean; selected: string | null };

function PartGroup({
  part,
  index,
  progressRef,
  onSelect,
}: {
  part: Part;
  index: number;
  progressRef: { current: number };
  onSelect: (id: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const label = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const g = group.current;
    if (!g) return;

    const p = progressRef.current;
    const raw = THREE.MathUtils.clamp(p / 0.62, 0, 1);
    const local = smooth01(raw * 1.45 - index * 0.075);
    const y = THREE.MathUtils.lerp(part.aY, part.eY, local);

    g.position.y += (y - g.position.y) * 0.3;
    g.rotation.z += (part.tilt * local - g.rotation.z) * 0.3;
    g.position.x +=
      (Math.sin(index * 2.3) * 0.9 * local - g.position.x) * 0.3;

    if (label.current) {
      const o = THREE.MathUtils.clamp((local - 0.55) / 0.35, 0, 1);
      label.current.style.opacity = String(o);
      label.current.style.transform = `translateY(${(1 - o) * 8}px)`;
    }
  });

  return (
    <group ref={group} position={[0, part.aY, 0]}>
      <PartMeshes id={part.id} />
      <Html center position={[2.6, 0.25, 0]} zIndexRange={[15, 10]}>
        <div className="part-label" ref={label} style={{ opacity: 0 }}>
          <button type="button" onClick={() => onSelect(part.id)}>
            <strong>{part.name}</strong>
            <span>{part.fact}</span>
          </button>
        </div>
      </Html>
    </group>
  );
}

function PartMeshes({ id }: { id: string }) {
  switch (id) {
    case "soil":
      return (
        <group>
          <mesh>
            <cylinderGeometry args={[4, 4.4, 0.26, 24]} />
            <meshStandardMaterial color="#3a2c18" roughness={1} flatShading />
          </mesh>
          {[...Array(8)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 1.6,
                0.22,
                Math.sin((i / 8) * Math.PI * 2) * 1.6,
              ]}
            >
              <sphereGeometry args={[0.09 + (i % 3) * 0.03, 6, 5]} />
              <meshStandardMaterial color="#d8ffa0" roughness={0.6} flatShading />
            </mesh>
          ))}
        </group>
      );
    case "roots":
      return (
        <group>
          {[...Array(6)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 6) * Math.PI * 2) * 0.85,
                -0.28,
                Math.sin((i / 6) * Math.PI * 2) * 0.85,
              ]}
              rotation={[
                Math.cos(i) * 0.5,
                (i / 6) * Math.PI * 2,
                Math.sin(i * 1.7) * 0.55,
              ]}
            >
              <coneGeometry args={[0.16, 1.15, 5]} />
              <meshStandardMaterial color="#5a4025" roughness={1} flatShading />
            </mesh>
          ))}
        </group>
      );
    case "trunk":
      return (
        <mesh>
          <cylinderGeometry args={[0.26, 0.44, 3, 7]} />
          <meshStandardMaterial color="#6e4f30" roughness={0.95} flatShading />
        </mesh>
      );
    case "boughs-lower":
      return (
        <group>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.75, 0.12, 0]} rotation-z={s * -1.05}>
              <cylinderGeometry args={[0.08, 0.15, 1.7, 5]} />
              <meshStandardMaterial color="#6e4f30" roughness={0.95} flatShading />
            </mesh>
          ))}
        </group>
      );
    case "boughs-upper":
      return (
        <group>
          {[...Array(3)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 3) * Math.PI * 2) * 0.5,
                0.18,
                Math.sin((i / 3) * Math.PI * 2) * 0.5,
              ]}
              rotation={[Math.sin(i * 2) * 0.8, i, Math.cos(i * 1.3) * 0.8]}
            >
              <cylinderGeometry args={[0.06, 0.12, 1.35, 5]} />
              <meshStandardMaterial color="#7a5a37" roughness={0.95} flatShading />
            </mesh>
          ))}
        </group>
      );
    case "veil":
      return (
        <group>
          {[...Array(4)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 4) * Math.PI * 2) * 0.95,
                (i % 2) * 0.35 - 0.1,
                Math.sin((i / 4) * Math.PI * 2) * 0.95,
              ]}
            >
              <icosahedronGeometry args={[0.78 - (i % 2) * 0.14, 0]} />
              <meshStandardMaterial color="#3f7a3c" roughness={0.85} flatShading />
            </mesh>
          ))}
        </group>
      );
    case "crown":
      return (
        <group>
          <mesh>
            <icosahedronGeometry args={[0.92, 0]} />
            <meshStandardMaterial color="#4f8f42" roughness={0.85} flatShading />
          </mesh>
          <mesh position={[0.32, 0.82, 0.1]}>
            <sphereGeometry args={[0.14, 6, 5]} />
            <meshStandardMaterial color="#e8632c" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0.46, 0.94, 0.1]} rotation-z={-0.7}>
            <coneGeometry args={[0.05, 0.16, 4]} />
            <meshStandardMaterial color="#e8632c" roughness={0.8} flatShading />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

function Scene({
  progressRef,
  onSelect,
}: {
  progressRef: { current: number };
  onSelect: (id: string) => void;
}) {
  useFrame(({ camera }) => {
    const p = progressRef.current;
    const orbit = THREE.MathUtils.smoothstep(p, 0.62, 1);
    const angle = 0.85 + orbit * 1.3;
    const radius = 12.5 + orbit * 3.6;
    camera.position.set(
      Math.cos(angle) * radius,
      3.2 + orbit * 3,
      Math.sin(angle) * radius,
    );
    camera.lookAt(0, 5.4 + orbit * 1.6, 0);
  });

  return (
    <>
      <color attach="background" args={["#08130d"]} />
      <ambientLight intensity={0.65} color="#cfe8d2" />
      <directionalLight position={[6, 9, 5]} intensity={1.5} color="#ffe0b0" />
      <directionalLight position={[-7, 4, -6]} intensity={0.7} color="#7fd4a8" />

      {PARTS.map((part, i) => (
        <PartGroup
          key={part.id}
          part={part}
          index={i}
          progressRef={progressRef}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

function AnatomyCanvasImpl({
  progressRef,
  onSelect,
}: {
  progressRef: { current: number };
  onSelect: (id: string) => void;
}) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ fov: 42, near: 0.1, far: 120, position: [10, 3.5, 9] }}>
      <Scene progressRef={progressRef} onSelect={onSelect} />
    </Canvas>
  );
}

const AnatomyCanvas = dynamic(() => Promise.resolve(AnatomyCanvasImpl), {
  ssr: false,
  loading: () => <div className="anatomy-loading" />,
});

export default function TreeAnatomy() {
  const progressRef = useRef(0);
  const [progressUi, setProgressUi] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  // autoplay ping-pong driver (keeps React state in sync with the ref)
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let dir = progressRef.current > 0.98 ? -1 : 1;
    const tick = () => {
      progressRef.current = THREE.MathUtils.clamp(
        progressRef.current + dir * 0.0035,
        0,
        1,
      );
      if (progressRef.current >= 1) dir = -1;
      if (progressRef.current <= 0) dir = 1;
      setProgressUi(progressRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const selectedPart = PARTS.find((p) => p.id === selected) ?? null;

  return (
    <section id="anatomy" className="anatomy">
      <div className="anatomy-stage">
        <div className="anatomy-canvas">
          <AnatomyCanvas
            progressRef={progressRef}
            onSelect={(id) => setSelected(id)}
          />
        </div>

        <header className="anatomy-head">
          <p className="kicker">Bonus · The anime.js way</p>
          <h2>Anatomy of a Tree</h2>
          <p className="body">
            Drag the slider — the tree disassembles like an engineering
            diagram. Click any part to learn what it really does.
          </p>
        </header>

        <div className="anatomy-controls">
          <button
            type="button"
            className="cta cta--ghost anatomy-play"
            onClick={() => setPlaying((v) => !v)}
          >
            {playing ? "❚❚ Pause" : "▶ Play"}
          </button>
          <input
            type="range"
            min={0}
            max={1000}
            value={Math.round(progressUi * 1000)}
            onChange={(e) => {
              setPlaying(false);
              progressRef.current = Number(e.target.value) / 1000;
              setProgressUi(progressRef.current);
            }}
            aria-label="Explode the tree"
          />
          <span className="anatomy-pct">{Math.round(progressUi * 100)}%</span>
        </div>

        {selectedPart && (
          <aside className="part-detail">
            <button
              type="button"
              className="part-detail-close"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              ✕
            </button>
            <h3>{selectedPart.name}</h3>
            <p>{selectedPart.desc}</p>
            <dl>
              {selectedPart.stats.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
      </div>
    </section>
  );
}
