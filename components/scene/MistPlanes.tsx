"use client";

import { useMemo, useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeRadialTexture } from "@/lib/textures";

const SPOTS = [
  { pos: [4, 1.4, 16], w: 26, h: 9, opacity: 0.09, tint: "#9fd8b0", speed: 0.05 },
  { pos: [-6, 1.8, -2], w: 30, h: 10, opacity: 0.08, tint: "#9fd8b0", speed: 0.04 },
  { pos: [2, 8, -28], w: 34, h: 12, opacity: 0.07, tint: "#cfe8d2", speed: 0.055 },
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
