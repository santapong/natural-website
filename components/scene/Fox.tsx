"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COAT = "#eef3f7";

export default function Fox({
  position = [2, 0, -300],
  radius = 6,
}: {
  position?: [number, number, number];
  radius?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const legs = useRef<(THREE.Mesh | null)[]>([]);
  const tail = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);

  const gait = useMemo(() => [0, Math.PI, Math.PI * 1.15, Math.PI * 0.15], []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const a = t * 0.22;
    const x = position[0] + Math.cos(a) * radius;
    const z = position[2] + Math.sin(a) * radius * 0.7;

    if (root.current) {
      root.current.position.set(x, Math.abs(Math.sin(t * 4.4)) * 0.05, z);
      root.current.rotation.y = -a + Math.PI / 2;
    }

    // trot
    legs.current.forEach((leg, i) => {
      if (leg) leg.rotation.x = Math.sin(t * 8.8 + gait[i]) * 0.55;
    });

    if (tail.current) tail.current.rotation.x = -0.5 + Math.sin(t * 2.2) * 0.18;
    if (head.current) head.current.rotation.y = Math.sin(t * 0.9) * 0.35;
  });

  return (
    <group ref={root} position={position}>
      {/* body */}
      <mesh position={[0, 0.42, 0]} rotation-x={Math.PI / 2}>
        <capsuleGeometry args={[0.16, 0.5, 3, 6]} />
        <meshStandardMaterial color={COAT} roughness={0.95} flatShading />
      </mesh>

      {/* head group */}
      <group ref={head} position={[0, 0.56, 0.38]}>
        <mesh>
          <sphereGeometry args={[0.14, 6, 5]} />
          <meshStandardMaterial color={COAT} roughness={0.95} flatShading />
        </mesh>
        {/* snout */}
        <mesh position={[0, -0.03, 0.16]} rotation-x={Math.PI / 2}>
          <coneGeometry args={[0.06, 0.18, 5]} />
          <meshStandardMaterial color="#dfe6ec" roughness={0.95} flatShading />
        </mesh>
        {/* dark ears */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.08, 0.16, -0.02]}>
            <coneGeometry args={[0.045, 0.14, 4]} />
            <meshStandardMaterial color="#3a3632" roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>

      {/* fluffy tail */}
      <mesh ref={tail} position={[0, 0.48, -0.44]} rotation-x={-0.5}>
        <coneGeometry args={[0.09, 0.55, 6]} />
        <meshStandardMaterial color="#f7fafc" roughness={1} flatShading />
      </mesh>

      {/* legs */}
      {[
        [0.09, 0.24],
        [-0.09, 0.24],
        [0.09, -0.26],
        [-0.09, -0.26],
      ].map(([x, z], i) => (
        <mesh
          key={i}
          ref={(el) => {
            legs.current[i] = el;
          }}
          position={[x, 0.19, z]}
        >
          <cylinderGeometry args={[0.032, 0.028, 0.34, 5]} />
          <meshStandardMaterial color={COAT} roughness={0.95} flatShading />
        </mesh>
      ))}
    </group>
  );
}
