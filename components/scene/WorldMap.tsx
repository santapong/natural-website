"use client";

import { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CHAPTER_ZONES } from "@/lib/chapters";

export default function WorldMap({
  onSelect,
}: {
  onSelect: (chapterIndex: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const pillars = useRef<(THREE.Mesh | null)[]>([]);

  // beacons gently pulse
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    pillars.current.forEach((p, i) => {
      if (!p) return;
      const mat = p.material as THREE.MeshBasicMaterial;
      mat.opacity =
        0.16 + Math.sin(t * 1.6 + i * 0.9) * 0.06 + (hovered === i ? 0.18 : 0);
    });
  });

  return (
    <group>
      {CHAPTER_ZONES.map((zone, i) => (
        <group key={zone.id} position={[0, 0, zone.z]}>
          {/* light pillar marking the biome */}
          <mesh
            ref={(el) => {
              pillars.current[i] = el;
            }}
            position={[0, 36, 0]}
          >
            <cylinderGeometry args={[1.6, 2.4, 72, 10, 1, true]} />
            <meshBasicMaterial
              color={zone.color}
              transparent
              opacity={0.16}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
              fog={false}
            />
          </mesh>

          {/* ground ring */}
          <mesh position={[0, 0.3, 0]} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[7.2, 8.6, 40]} />
            <meshBasicMaterial
              color={zone.color}
              transparent
              opacity={hovered === i ? 0.85 : 0.45}
              depthWrite={false}
              fog={false}
            />
          </mesh>

          {/* clickable label */}
          <Html center position={[0, 80, 0]} zIndexRange={[20, 10]}>
            <button
              type="button"
              className={`map-label${hovered === i ? " is-hot" : ""}`}
              style={{ ["--zone" as string]: zone.color }}
              onClick={() => onSelect(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {zone.name}
            </button>
          </Html>
        </group>
      ))}
    </group>
  );
}
