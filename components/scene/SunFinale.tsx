"use client";

import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

export default function SunFinale() {
  return (
    <>
      <group position={[0, 0, -414]}>
        <mesh position={[0, 12, 0]}>
          <circleGeometry args={[26, 48]} />
          <meshBasicMaterial color="#ffbe72" fog={false} />
        </mesh>
        <mesh position={[0, 12, 0]}>
          <circleGeometry args={[46, 48]} />
          <meshBasicMaterial
            color="#ff9440"
            transparent
            opacity={0.24}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
          />
        </mesh>
      </group>
      <Sparkles
        position={[0, 7, -392]}
        scale={[34, 15, 30]}
        count={110}
        color="#ffd9a0"
        size={5}
        speed={0.3}
        opacity={0.7}
      />
      <pointLight position={[0, 9, -394]} intensity={110} distance={130} decay={2} color="#ffa050" />
    </>
  );
}
