"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PERIOD = 4.6;
const AIR = 0.52; // fraction of the cycle spent airborne

export default function Fish({
  position = [0, 0, -112],
}: {
  position?: [number, number, number];
}) {
  const fish = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const g = fish.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const u = (t % PERIOD) / PERIOD;

    const swimX = -9 + u / AIR * 18;

    if (u < AIR) {
      // ballistic arc across the lake
      const s = u / AIR;
      const y = Math.sin(s * Math.PI) * 2.7;
      const vy = Math.cos(s * Math.PI) * 2.7 * Math.PI;
      const vx = 18 / AIR / PERIOD * AIR; // horizontal speed
      g.visible = true;
      g.position.set(swimX, y, position[2]);
      g.rotation.set(0, Math.PI / 2, THREE.MathUtils.clamp(-Math.atan2(vy, 39.1), -0.9, 0.9));
      g.children.forEach((c, i) => {
        if (i > 0) c.rotation.z = Math.sin(t * 22) * 0.5;
      });
    } else {
      g.visible = false;
    }

    // splash rings at exit and entry
    const splashAt = (ring: THREE.Mesh | null, start: number) => {
      if (!ring) return;
      const su = u - start;
      if (su < 0 || su > 0.3) {
        ring.visible = false;
        return;
      }
      ring.visible = true;
      const k = su / 0.3;
      ring.scale.setScalar(0.4 + k * 3.2);
      const mat = ring.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.55 * (1 - k);
    };
    splashAt(ringA.current, 0);
    splashAt(ringB.current, AIR);
  });

  return (
    <group position={position}>
      {/* leaping fish */}
      <group ref={fish} visible={false}>
        <mesh rotation-x={Math.PI / 2} scale={[1, 1, 0.55]}>
          <coneGeometry args={[0.24, 0.95, 6]} />
          <meshStandardMaterial color="#8fb9cf" roughness={0.35} metalness={0.45} flatShading />
        </mesh>
        <mesh position={[0, 0, -0.62]}>
          <planeGeometry args={[0.34, 0.3]} />
          <meshStandardMaterial
            color="#a9cede"
            roughness={0.5}
            side={THREE.DoubleSide}
            flatShading
          />
        </mesh>
      </group>

      {/* splash rings on the water surface */}
      <mesh ref={ringA} position={[-9, 0.12, 0]} rotation-x={-Math.PI / 2} visible={false}>
        <ringGeometry args={[0.42, 0.58, 28]} />
        <meshBasicMaterial color="#dff5fa" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh ref={ringB} position={[9, 0.12, 0]} rotation-x={-Math.PI / 2} visible={false}>
        <ringGeometry args={[0.42, 0.58, 28]} />
        <meshBasicMaterial color="#dff5fa" transparent opacity={0.5} depthWrite={false} />
      </mesh>
    </group>
  );
}
