"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { makeRadialTexture } from "@/lib/textures";

const CYCLE = 12;

export default function Whale({
  position = [0, 0, -199],
}: {
  position?: [number, number, number];
}) {
  const whale = useRef<THREE.Group>(null);
  const spout = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const tex = makeRadialTexture();

  useFrame(({ clock }) => {
    const g = whale.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const u = (t % CYCLE) / CYCLE;

    // breach phases: hidden -> rise -> surface glide -> dive
    let y = -4;
    let tilt = 0;
    if (u < 0.18) {
      const s = THREE.MathUtils.smoothstep(u / 0.18, 0, 1);
      y = -4 + s * 5.2;
      tilt = -0.32 * s;
    } else if (u < 0.42) {
      const s = (u - 0.18) / 0.24;
      y = 1.2 - Math.sin(s * Math.PI) * 0.5;
      tilt = -0.32 + s * 0.5;
    } else if (u < 0.6) {
      const s = (u - 0.42) / 0.18;
      y = 0.7 - s * 5;
      tilt = 0.18 + s * 0.3;
    }
    g.position.y = y;
    g.rotation.z = tilt;
    g.visible = y > -3.6;

    // blowhole spout at the surface
    if (spout.current) {
      const showing = u > 0.22 && u < 0.36;
      spout.current.visible = showing;
      if (showing) {
        const k = (u - 0.22) / 0.14;
        spout.current.scale.setScalar(1.4 + k * 2.6);
        (spout.current.material as THREE.MeshBasicMaterial).opacity =
          0.5 * Math.sin(k * Math.PI);
      }
    }

    // expanding water ring while surfacing
    if (ring.current) {
      const showing = u > 0.16 && u < 0.55;
      ring.current.visible = showing;
      if (showing) {
        const k = (u - 0.16) / 0.39;
        ring.current.scale.setScalar(1.2 + k * 7);
        (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.45 * (1 - k);
      }
    }
  });

  return (
    <group position={position}>
      <group ref={whale} visible={false}>
        {/* body */}
        <mesh rotation-x={Math.PI / 2} scale={[1, 0.62, 1]}>
          <capsuleGeometry args={[1.15, 4.6, 4, 8]} />
          <meshStandardMaterial color="#24404c" roughness={0.65} flatShading />
        </mesh>
        {/* head ridge */}
        <mesh position={[0, 0.42, 2]} scale={[0.5, 0.34, 1]}>
          <sphereGeometry args={[1, 7, 5]} />
          <meshStandardMaterial color="#2b4a57" roughness={0.65} flatShading />
        </mesh>
        {/* dorsal fin */}
        <mesh position={[0, 0.85, -0.9]} rotation-z={-0.35}>
          <coneGeometry args={[0.28, 0.85, 5]} />
          <meshStandardMaterial color="#1d3640" roughness={0.7} flatShading />
        </mesh>
        {/* tail flukes */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.75, 0.15, -3.25]} rotation-y={s * -0.5}>
            <planeGeometry args={[1.5, 0.85]} />
            <meshStandardMaterial
              color="#1d3640"
              roughness={0.7}
              side={THREE.DoubleSide}
              flatShading
            />
          </mesh>
        ))}
        {/* pectoral fins */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 1.05, -0.35, 1.5]} rotation-z={s * -0.9}>
            <planeGeometry args={[1.15, 0.55]} />
            <meshStandardMaterial
              color="#20404a"
              roughness={0.7}
              side={THREE.DoubleSide}
              flatShading
            />
          </mesh>
        ))}
      </group>

      {/* spout mist */}
      <Billboard position={[0, 2.6, 1.6]}>
        <mesh ref={spout} visible={false}>
          <planeGeometry args={[2.4, 4]} />
          <meshBasicMaterial
            map={tex}
            color="#dff5fa"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </Billboard>

      {/* surface ring */}
      <mesh ref={ring} position={[0, 0.14, 0]} rotation-x={-Math.PI / 2} visible={false}>
        <ringGeometry args={[2.6, 3.1, 40]} />
        <meshBasicMaterial color="#bfeaf2" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
