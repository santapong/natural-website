"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";

type Wall = {
  x: number;
  z: number;
  w: number;
  h: number;
  d: number;
  tilt: number;
  color: THREE.Color;
};

function buildWalls(): Wall[] {
  const rng = mulberry32(606);
  const walls: Wall[] = [];

  for (let i = 0; i < 9; i++) {
    const z = -138 - i * 7.2;
    const side = i % 2 === 0 ? -1 : 1;
    // alternate stagger left/right so the passage narrows and widens
    walls.push({
      x: side * (10.5 + rng() * 3),
      z,
      w: 9 + rng() * 5,
      h: 22 + rng() * 20,
      d: 7 + rng() * 3,
      tilt: -side * (0.02 + rng() * 0.04),
      color: new THREE.Color().setHSL(0.56, 0.1 + rng() * 0.06, 0.15 + rng() * 0.07),
    });
  }

  // a few far background slabs to close the horizon
  for (let i = 0; i < 4; i++) {
    const z = -150 - i * 12;
    const side = rng() > 0.5 ? -1 : 1;
    walls.push({
      x: side * (17 + rng() * 4),
      z,
      w: 10 + rng() * 6,
      h: 30 + rng() * 16,
      d: 8,
      tilt: 0,
      color: new THREE.Color().setHSL(0.55, 0.08, 0.12 + rng() * 0.05),
    });
  }

  return walls;
}

export default function Fjord() {
  const walls = useMemo(() => buildWalls(), []);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const im = meshRef.current;
    if (!im) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();

    walls.forEach((wall, i) => {
      e.set(0, 0, wall.tilt);
      q.setFromEuler(e);
      p.set(wall.x, wall.h / 2 - 2, wall.z);
      s.set(wall.w, wall.h, wall.d);
      m.compose(p, q, s);
      im.setMatrixAt(i, m);
      im.setColorAt(i, wall.color);
    });

    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
  }, [walls]);

  return (
    <group position={[0, 0, -34]}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, walls.length]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} flatShading />
      </instancedMesh>

      {/* dark patient water between the walls */}
      <mesh position={[0, 0.05, -165]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[23, 62]} />
        <meshStandardMaterial
          color="#123039"
          roughness={0.25}
          metalness={0.65}
        />
      </mesh>
    </group>
  );
}
