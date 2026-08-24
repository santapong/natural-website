"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BODY = "#8a5a33";
const DARK = "#6e4426";
const ANTLER = "#d9c7a0";

function Leg({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x, 0.38, z]}>
      <cylinderGeometry args={[0.055, 0.045, 0.78, 5]} />
      <meshStandardMaterial color={DARK} roughness={0.9} flatShading />
    </mesh>
  );
}

export default function Deer({
  position = [4.5, 0, -64],
  rotationY = -2.2,
}: {
  position?: [number, number, number];
  rotationY?: number;
}) {
  const neck = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Mesh>(null);
  const earL = useRef<THREE.Mesh>(null);
  const earR = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // grazing cycle: head dips toward the grass every few seconds
    const graze = THREE.MathUtils.smoothstep(Math.sin(t * 0.45), 0.55, 0.95);
    if (neck.current) {
      neck.current.rotation.x =
        0.15 + Math.sin(t * 0.8) * 0.05 + graze * (1.05 + Math.sin(t * 3.1) * 0.06);
    }

    // tail flicks in short bursts
    if (tail.current) {
      tail.current.rotation.y = Math.max(0, Math.sin(t * 7)) * (Math.sin(t * 0.9) > 0.6 ? 0.8 : 0);
    }

    // occasional ear twitch
    const twitch = Math.max(0, Math.sin(t * 11)) * (Math.sin(t * 1.3) > 0.85 ? 0.5 : 0);
    if (earL.current) earL.current.rotation.z = -0.5 - twitch;
    if (earR.current) earR.current.rotation.z = 0.5 + twitch;
  });

  return (
    <group position={position} rotation-y={rotationY}>
      {/* body */}
      <mesh position={[0, 0.98, 0]}>
        <boxGeometry args={[0.62, 0.6, 1.35]} />
        <meshStandardMaterial color={BODY} roughness={0.9} flatShading />
      </mesh>

      {/* chest */}
      <mesh position={[0, 1.02, 0.58]}>
        <boxGeometry args={[0.56, 0.52, 0.34]} />
        <meshStandardMaterial color={BODY} roughness={0.9} flatShading />
      </mesh>

      {/* rump */}
      <mesh position={[0, 1.04, -0.62]}>
        <boxGeometry args={[0.58, 0.54, 0.3]} />
        <meshStandardMaterial color={BODY} roughness={0.9} flatShading />
      </mesh>

      {/* tail */}
      <mesh ref={tail} position={[0, 1.22, -0.82]}>
        <boxGeometry args={[0.12, 0.26, 0.12]} />
        <meshStandardMaterial color="#a9764a" roughness={0.9} flatShading />
      </mesh>

      {/* legs */}
      <Leg x={0.2} z={0.48} />
      <Leg x={-0.2} z={0.48} />
      <Leg x={0.2} z={-0.5} />
      <Leg x={-0.2} z={-0.5} />

      {/* neck + head group (pivots at the shoulders) */}
      <group ref={neck} position={[0, 1.24, 0.66]}>
        <mesh position={[0, 0.32, 0.14]} rotation-x={0.35}>
          <boxGeometry args={[0.26, 0.72, 0.28]} />
          <meshStandardMaterial color={BODY} roughness={0.9} flatShading />
        </mesh>

        {/* head */}
        <group position={[0, 0.68, 0.34]}>
          <mesh>
            <boxGeometry args={[0.28, 0.28, 0.42]} />
            <meshStandardMaterial color={BODY} roughness={0.9} flatShading />
          </mesh>
          {/* snout */}
          <mesh position={[0, -0.05, 0.3]}>
            <boxGeometry args={[0.18, 0.16, 0.22]} />
            <meshStandardMaterial color={DARK} roughness={0.9} flatShading />
          </mesh>

          {/* ears */}
          <mesh ref={earL} position={[0.17, 0.18, -0.05]} rotation-z={-0.5}>
            <coneGeometry args={[0.07, 0.26, 4]} />
            <meshStandardMaterial color={BODY} roughness={0.9} flatShading />
          </mesh>
          <mesh ref={earR} position={[-0.17, 0.18, -0.05]} rotation-z={0.5}>
            <coneGeometry args={[0.07, 0.26, 4]} />
            <meshStandardMaterial color={BODY} roughness={0.9} flatShading />
          </mesh>

          {/* antlers */}
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.13, 0.2, -0.02]} rotation-z={side * -0.35}>
              <mesh position={[0, 0.22, 0]} rotation-x={-0.15}>
                <cylinderGeometry args={[0.025, 0.04, 0.5, 4]} />
                <meshStandardMaterial color={ANTLER} roughness={0.7} flatShading />
              </mesh>
              <mesh position={[side * 0.09, 0.3, 0.02]} rotation-z={side * 0.8}>
                <cylinderGeometry args={[0.018, 0.026, 0.26, 4]} />
                <meshStandardMaterial color={ANTLER} roughness={0.7} flatShading />
              </mesh>
              <mesh position={[side * 0.07, 0.42, 0]} rotation-z={side * 0.6}>
                <cylinderGeometry args={[0.016, 0.024, 0.2, 4]} />
                <meshStandardMaterial color={ANTLER} roughness={0.7} flatShading />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
