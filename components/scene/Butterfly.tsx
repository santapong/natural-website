"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";

const COUNT = 7;

export default function Butterfly({
  center = [1.5, 1.6, -10],
}: {
  center?: [number, number, number];
}) {
  const flies = useMemo(() => {
    const rng = mulberry32(31415);
    return Array.from({ length: COUNT }, (_, i) => ({
      ax: 2 + rng() * 3,
      az: 3 + rng() * 4,
      fx: 0.25 + rng() * 0.35,
      fz: 0.2 + rng() * 0.3,
      ph: (i / COUNT) * Math.PI * 2,
      flap: 9 + rng() * 5,
      color: ["#f6e58d", "#ff9f9f", "#c8f7dc", "#d9c7ff"][i % 4],
      s: 0.7 + rng() * 0.5,
    }));
  }, []);

  const refs = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    flies.forEach((b, i) => {
      const g = refs.current[i];
      if (!g) return;
      const x = Math.sin(t * b.fx + b.ph) * b.ax;
      const z = Math.cos(t * b.fz + b.ph * 1.7) * b.az;
      const y = Math.sin(t * 1.3 + b.ph) * 0.45 + Math.sin(t * b.flap * 0.05) * 0.2;
      g.position.set(center[0] + x, center[1] + y, center[2] + z);
      const wing = 0.35 + Math.sin(t * b.flap + b.ph) * 0.95;
      if (g.children[1]) g.children[1].rotation.y = wing;
      if (g.children[2]) g.children[2].rotation.y = -wing;
    });
  });

  return (
    <group>
      {flies.map((b, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          scale={b.s}
        >
          <mesh>
            <capsuleGeometry args={[0.02, 0.16, 2, 4]} />
            <meshStandardMaterial color="#3a3028" roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0.09, 0.03, 0]}>
            <planeGeometry args={[0.22, 0.15]} />
            <meshStandardMaterial
              color={b.color}
              roughness={0.6}
              side={THREE.DoubleSide}
              transparent
              opacity={0.92}
            />
          </mesh>
          <mesh position={[-0.09, 0.03, 0]}>
            <planeGeometry args={[0.22, 0.15]} />
            <meshStandardMaterial
              color={b.color}
              roughness={0.6}
              side={THREE.DoubleSide}
              transparent
              opacity={0.92}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
