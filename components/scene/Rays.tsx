"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { makeBeamTexture } from "@/lib/textures";

const BEAMS = [
  { pos: [-9, 15, -40], w: 2.4, tilt: 0.26, opacity: 0.07 },
  { pos: [-2, 16, -46], w: 3.0, tilt: 0.22, opacity: 0.09 },
  { pos: [5, 15, -42], w: 2.2, tilt: 0.3, opacity: 0.06 },
  { pos: [10, 14, -52], w: 2.6, tilt: 0.24, opacity: 0.07 },
  { pos: [-6, 17, -56], w: 3.4, tilt: 0.28, opacity: 0.08 },
  { pos: [1, 15, -62], w: 2.4, tilt: 0.25, opacity: 0.07 },
] as const;

export default function Rays() {
  const tex = useMemo(() => makeBeamTexture(), []);

  return (
    <group>
      {BEAMS.map((b, i) => (
        <mesh key={i} position={b.pos as unknown as [number, number, number]} rotation-z={b.tilt}>
          <planeGeometry args={[b.w, 30]} />
          <meshBasicMaterial
            map={tex}
            color="#d6ffce"
            transparent
            opacity={b.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
