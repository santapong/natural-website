"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FUR = "#c9b29a";

export default function Rabbit({
  position = [-4.5, 0, -70],
}: {
  position?: [number, number, number];
}) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const g = root.current;
    if (!g) return;

    // hop cycle: move for a burst, pause and sniff
    const u = (t % 2.6) / 2.6;
    if (u < 0.3) {
      const s = u / 0.3;
      g.position.z = position[2] + Math.sin(s * Math.PI) * 0.12;
      g.position.x = position[0] + s * 1.1;
      g.position.y = Math.sin(s * Math.PI) * 0.5;
      g.rotation.x = -Math.sin(s * Math.PI) * 0.25;
      if (head.current) head.current.rotation.x = -0.15;
    } else {
      g.position.y = 0;
      g.rotation.x = 0;
      // sniffing
      if (head.current) {
        head.current.rotation.x = Math.sin(t * 6) * 0.08 + Math.sin(t * 17) * 0.03;
      }
      // drift back to start while paused
      g.position.x = position[0] + 1.1 * THREE.MathUtils.clamp(1 - (u - 0.3) / 2.2, 0, 1);
    }
  });

  return (
    <group ref={root} position={position} rotation-y={0.9}>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.26, 7, 6]} />
        <meshStandardMaterial color={FUR} roughness={0.95} flatShading />
      </mesh>
      <group ref={head} position={[0, 0.48, 0.24]}>
        <mesh>
          <sphereGeometry args={[0.17, 7, 6]} />
          <meshStandardMaterial color={FUR} roughness={0.95} flatShading />
        </mesh>
        <mesh position={[0, 0.02, 0.14]} scale={[0.7, 0.6, 0.8]}>
          <sphereGeometry args={[0.12, 6, 5]} />
          <meshStandardMaterial color="#e6d7c4" roughness={0.95} flatShading />
        </mesh>
        {/* ears */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.07, 0.28, -0.04]} rotation-x={-0.25} rotation-z={s * 0.12}>
            <coneGeometry args={[0.05, 0.34, 5]} />
            <meshStandardMaterial color={FUR} roughness={0.95} flatShading />
          </mesh>
        ))}
      </group>
      {/* tail */}
      <mesh position={[0, 0.32, -0.26]}>
        <sphereGeometry args={[0.09, 6, 5]} />
        <meshStandardMaterial color="#f2ece2" roughness={1} flatShading />
      </mesh>
    </group>
  );
}
