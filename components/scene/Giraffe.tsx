"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COAT = "#d99a3e";
const DARK = "#b97a2e";

export default function Giraffe({
  position = [-5, 0, -336],
  radius = 12,
}: {
  position?: [number, number, number];
  radius?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const legs = useRef<(THREE.Mesh | null)[]>([]);
  const neck = useRef<THREE.Group>(null);

  const gait = useMemo(() => [0, Math.PI, Math.PI * 1.1, Math.PI * 0.1], []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const a = t * 0.09;
    if (root.current) {
      root.current.position.set(
        position[0] + Math.cos(a) * radius,
        Math.abs(Math.sin(t * 2.4)) * 0.04,
        position[2] + Math.sin(a) * radius * 0.65,
      );
      root.current.rotation.y = -a + Math.PI / 2;
    }

    legs.current.forEach((leg, i) => {
      if (leg) leg.rotation.x = Math.sin(t * 3.6 + gait[i]) * 0.32;
    });

    // lazy neck sway + occasional head dip
    if (neck.current) {
      const dip = THREE.MathUtils.smoothstep(Math.sin(t * 0.25), 0.7, 0.95);
      neck.current.rotation.z = 0.12 + Math.sin(t * 0.5) * 0.05 + dip * 0.55;
    }
  });

  return (
    <group ref={root} position={position}>
      {/* body */}
      <mesh position={[0, 1.95, 0]}>
        <boxGeometry args={[0.72, 0.85, 1.6]} />
        <meshStandardMaterial color={COAT} roughness={0.9} flatShading />
      </mesh>

      {/* neck + head group (pivots at the shoulders) */}
      <group ref={neck} position={[0, 2.3, 0.62]}>
        <mesh position={[0, 0.85, 0.18]} rotation-z={-0.28}>
          <boxGeometry args={[0.34, 1.9, 0.38]} />
          <meshStandardMaterial color={COAT} roughness={0.9} flatShading />
        </mesh>
        {/* head */}
        <group position={[0.5, 1.85, 0.24]}>
          <mesh scale={[0.75, 0.6, 1.35]}>
            <sphereGeometry args={[0.22, 6, 5]} />
            <meshStandardMaterial color={COAT} roughness={0.9} flatShading />
          </mesh>
          {/* ossicones */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.08, 0.2, -0.02]}>
              <cylinderGeometry args={[0.018, 0.026, 0.14, 4]} />
              <meshStandardMaterial color={DARK} roughness={0.85} flatShading />
            </mesh>
          ))}
          {/* muzzle */}
          <mesh position={[0, -0.04, 0.22]} scale={[0.6, 0.45, 0.8]}>
            <sphereGeometry args={[0.16, 6, 5]} />
            <meshStandardMaterial color={DARK} roughness={0.9} flatShading />
          </mesh>
        </group>
      </group>

      {/* mane ridge */}
      <mesh position={[0, 2.42, 0.66]} rotation-z={-0.28}>
        <boxGeometry args={[0.07, 1.7, 0.12]} />
        <meshStandardMaterial color={DARK} roughness={0.95} flatShading />
      </mesh>

      {/* tail */}
      <mesh position={[0, 1.8, -0.86]} rotation-x={0.5}>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 4]} />
        <meshStandardMaterial color={COAT} roughness={0.9} flatShading />
      </mesh>

      {/* long legs */}
      {[
        [0.26, 0.55],
        [-0.26, 0.55],
        [0.26, -0.6],
        [-0.26, -0.6],
      ].map(([x, z], i) => (
        <mesh
          key={i}
          ref={(el) => {
            legs.current[i] = el;
          }}
          position={[x, 0.78, z]}
        >
          <cylinderGeometry args={[0.075, 0.06, 1.56, 5]} />
          <meshStandardMaterial color={COAT} roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}
