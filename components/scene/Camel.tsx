"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COAT = "#c99b5f";
const DARK = "#a87e46";

export default function Camel({
  position = [2, 0, -386],
  span = 7,
}: {
  position?: [number, number, number];
  span?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const legs = useRef<(THREE.Mesh | null)[]>([]);
  const neck = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Mesh>(null);

  const gait = useMemo(() => [0, Math.PI, Math.PI * 1.05, Math.PI * 0.05], []);
  const state = useRef({ dir: 1, x: 0 });

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const s = state.current;

    // saunter back and forth along a dune ridge
    s.x += s.dir * 0.0085;
    if (s.x > span) {
      s.x = span;
      s.dir = -1;
    } else if (s.x < -span) {
      s.x = -span;
      s.dir = 1;
    }

    if (root.current) {
      root.current.position.set(
        position[0] + s.x,
        Math.abs(Math.sin(t * 2.6)) * 0.04,
        position[2],
      );
      root.current.rotation.y = s.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
    }

    legs.current.forEach((leg, i) => {
      if (leg) leg.rotation.x = Math.sin(t * 4.2 + gait[i]) * 0.38;
    });

    if (neck.current) neck.current.rotation.z = 0.1 + Math.sin(t * 0.6) * 0.07;
    if (tail.current) tail.current.rotation.y = Math.sin(t * 3.2) * 0.4;
  });

  return (
    <group ref={root} position={position}>
      {/* body */}
      <mesh position={[0, 1.32, 0]} rotation-x={Math.PI / 2}>
        <capsuleGeometry args={[0.42, 1.15, 4, 7]} />
        <meshStandardMaterial color={COAT} roughness={0.95} flatShading />
      </mesh>

      {/* humps */}
      {[-0.42, 0.42].map((z, i) => (
        <mesh key={i} position={[0, 1.82, z]}>
          <sphereGeometry args={[0.34, 7, 6]} />
          <meshStandardMaterial color={DARK} roughness={0.95} flatShading />
        </mesh>
      ))}

      {/* neck + head */}
      <group ref={neck} position={[0, 1.55, 0.68]}>
        <mesh position={[0, 0.42, 0.16]} rotation-x={-0.5}>
          <capsuleGeometry args={[0.17, 0.85, 3, 6]} />
          <meshStandardMaterial color={COAT} roughness={0.95} flatShading />
        </mesh>
        <group position={[0, 0.92, 0.42]}>
          <mesh scale={[0.75, 0.65, 1.4]}>
            <sphereGeometry args={[0.19, 6, 5]} />
            <meshStandardMaterial color={COAT} roughness={0.95} flatShading />
          </mesh>
          {/* muzzle */}
          <mesh position={[0, -0.03, 0.2]} scale={[0.62, 0.5, 0.9]}>
            <sphereGeometry args={[0.14, 6, 5]} />
            <meshStandardMaterial color={DARK} roughness={0.9} flatShading />
          </mesh>
        </group>
      </group>

      {/* tail */}
      <mesh ref={tail} position={[0, 1.45, -0.85]} rotation-x={0.35}>
        <cylinderGeometry args={[0.025, 0.035, 0.55, 4]} />
        <meshStandardMaterial color={DARK} roughness={0.95} flatShading />
      </mesh>

      {/* legs */}
      {[
        [0.24, 0.52],
        [-0.24, 0.52],
        [0.24, -0.56],
        [-0.24, -0.56],
      ].map(([x, z], i) => (
        <mesh
          key={i}
          ref={(el) => {
            legs.current[i] = el;
          }}
          position={[x, 0.62, z]}
        >
          <cylinderGeometry args={[0.065, 0.055, 1.24, 5]} />
          <meshStandardMaterial color={COAT} roughness={0.95} flatShading />
        </mesh>
      ))}
    </group>
  );
}
