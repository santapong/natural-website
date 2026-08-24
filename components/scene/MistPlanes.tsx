"use client";

import { useMemo, useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeRadialTexture } from "@/lib/textures";

const SPOTS = [
  { pos: [4, 1.4, 16], w: 26, h: 9, opacity: 0.09, tint: "#9fd8b0", speed: 0.05 },
  { pos: [-6, 1.8, -2], w: 30, h: 10, opacity: 0.08, tint: "#9fd8b0", speed: 0.04 },
  { pos: [2, 8, -30], w: 34, h: 12, opacity: 0.07, tint: "#cfe8d2", speed: 0.055 },
  { pos: [-4, 12, -46], w: 40, h: 13, opacity: 0.06, tint: "#cfe8d2", speed: 0.045 },
  { pos: [5, 2.2, -78], w: 30, h: 10, opacity: 0.12, tint: "#7fd4cf", speed: 0.06 },
  { pos: [-5, 1.8, -92], w: 34, h: 11, opacity: 0.12, tint: "#7fd4cf", speed: 0.05 },
  { pos: [3, 3, -112], w: 40, h: 14, opacity: 0.1, tint: "#ffc98a", speed: 0.045 },
] as const;

export default function MistPlanes() {
  const tex = useMemo(() => makeRadialTexture(), []);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const spot = SPOTS[i];
      if (!spot) return;
      child.position.x = spot.pos[0] + Math.sin(t * spot.speed + i * 1.7) * 2.2;
    });
  });

  return (
    <group ref={group}>
      {SPOTS.map((s, i) => (
        <Billboard key={i} position={s.pos as unknown as [number, number, number]}>
          <mesh>
            <planeGeometry args={[s.w, s.h]} />
            <meshBasicMaterial
              map={tex}
              color={s.tint}
              transparent
              opacity={s.opacity}
              depthWrite={false}
            />
          </mesh>
        </Billboard>
      ))}
    </group>
  );
}
