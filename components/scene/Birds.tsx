"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";

export default function Birds({
  center = [0, 9, -104],
  radius = 17,
  count = 9,
  speed = 0.14,
  color = "#f4f7f9",
  scale = 1,
  flapSpeed = 7,
}: {
  center?: [number, number, number];
  radius?: number;
  count?: number;
  speed?: number;
  color?: string;
  scale?: number;
  flapSpeed?: number;
}) {
  const birds = useMemo(() => {
    const rng = mulberry32(Math.round(radius * 100) + count);
    return Array.from({ length: count }, (_, i) => ({
      offset: (i / count) * Math.PI * 2 + rng() * 0.5,
      alt: rng() * 2.4 - 1.2,
      flap: flapSpeed + rng() * 3,
      wobble: 0.6 + rng() * 0.8,
      s: 0.75 + rng() * 0.5,
    }));
  }, [count, radius, flapSpeed]);

  const refs = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    birds.forEach((b, i) => {
      const g = refs.current[i];
      if (!g) return;
      const a = t * speed + b.offset;
      const r = radius + Math.sin(t * b.wobble * 0.5 + b.offset * 3) * 1.8;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r * 0.72;
      const y = center[1] + b.alt + Math.sin(t * b.wobble + b.offset) * 0.7;

      g.position.set(center[0] + x, y, center[2] + z);
      g.rotation.y = -a - Math.PI / 2;
      g.rotation.z = Math.sin(t * b.wobble + b.offset) * 0.12;

      const flapAngle = Math.sin(t * b.flap + b.offset * 5) * 0.65;
      if (g.children[1]) g.children[1].rotation.z = flapAngle;
      if (g.children[2]) g.children[2].rotation.z = -flapAngle;
    });
  });

  return (
    <group>
      {birds.map((b, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          scale={b.s * scale}
        >
          <mesh rotation-x={Math.PI / 2}>
            <coneGeometry args={[0.09, 0.62, 5]} />
            <meshStandardMaterial color={color} roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 0.02, 0.06]}>
            <planeGeometry args={[0.66, 0.22]} />
            <meshStandardMaterial
              color={color}
              roughness={0.85}
              side={THREE.DoubleSide}
              flatShading
            />
          </mesh>
          <mesh position={[0, 0.02, -0.06]}>
            <planeGeometry args={[0.66, 0.22]} />
            <meshStandardMaterial
              color={color}
              roughness={0.85}
              side={THREE.DoubleSide}
              flatShading
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
