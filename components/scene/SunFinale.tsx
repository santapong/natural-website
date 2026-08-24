"use client";

import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

export default function SunFinale() {
  return (
    <>
      <group position={[0, 0, -170]}>
        <mesh position={[0, 10, 0]}>
          <circleGeometry args={[17, 48]} />
          <meshBasicMaterial color="#ffc27a" fog={false} />
        </mesh>
        <mesh position={[0, 10, 0]}>
          <circleGeometry args={[30, 48]} />
          <meshBasicMaterial
            color="#ff9e4d"
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      </group>
      <Sparkles
        position={[0, 6, -148]}
        scale={[26, 14, 24]}
        count={70}
        color="#ffd9a0"
        size={5}
        speed={0.3}
        opacity={0.7}
      />
      <pointLight position={[0, 7, -150]} intensity={60} distance={70} decay={2} color="#ffb45e" />
    </>
  );
}
