"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";
import { makeRadialTexture } from "@/lib/textures";

type Peak = {
  x: number;
  z: number;
  h: number;
  r: number;
  rotY: number;
  rock: THREE.Color;
};

function buildPeaks(): Peak[] {
  const rng = mulberry32(2468);
  const peaks: Peak[] = [];

  // near spires framing the flight path (kept well clear of the corridor)
  let guard = 0;
  while (peaks.length < 16 && guard++ < 400) {
    const side = rng() > 0.5 ? 1 : -1;
    const x = side * (13 + rng() * 20);
    const z = -232 - rng() * 36;
    peaks.push({
      x,
      z,
      h: 22 + rng() * 22,
      r: 3 + rng() * 3.4,
      rotY: rng() * Math.PI * 2,
      rock: new THREE.Color().setHSL(0.58, 0.06 + rng() * 0.05, 0.3 + rng() * 0.12),
    });
  }

  // far ridge closing the horizon (off-corridor)
  for (let i = 0; i < 10; i++) {
    const side = rng() > 0.5 ? 1 : -1;
    peaks.push({
      x: side * (15 + rng() * 40),
      z: -276 - rng() * 26,
      h: 30 + rng() * 26,
      r: 5 + rng() * 7,
      rotY: rng() * Math.PI * 2,
      rock: new THREE.Color().setHSL(0.57, 0.08, 0.22 + rng() * 0.1),
    });
  }

  return peaks;
}

export default function Alpine() {
  const peaks = useMemo(() => buildPeaks(), []);
  const tex = useMemo(() => makeRadialTexture(), []);

  const bodies = useRef<THREE.InstancedMesh>(null);
  const caps = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();

    peaks.forEach((pk, i) => {
      e.set(0, pk.rotY, 0);
      q.setFromEuler(e);

      p.set(pk.x, pk.h / 2, pk.z);
      s.set(pk.r, pk.h, pk.r);
      m.compose(p, q, s);
      bodies.current?.setMatrixAt(i, m);
      bodies.current?.setColorAt(i, pk.rock);

      // snow cap sits over the cone tip
      p.set(pk.x, pk.h * 0.82, pk.z);
      s.set(pk.r * 0.42, pk.h * 0.3, pk.r * 0.42);
      m.compose(p, q, s);
      caps.current?.setMatrixAt(i, m);
    });

    if (bodies.current) {
      bodies.current.instanceMatrix.needsUpdate = true;
      if (bodies.current.instanceColor) bodies.current.instanceColor.needsUpdate = true;
    }
    if (caps.current) caps.current.instanceMatrix.needsUpdate = true;
  }, [peaks]);

  return (
    <group>
      {/* stone floor of the high valley */}
      <mesh position={[0, 0.02, -250]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[52, 40]} />
        <meshStandardMaterial color="#8d97a2" roughness={1} />
      </mesh>

      <instancedMesh ref={bodies} args={[undefined, undefined, peaks.length]}>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={1} flatShading />
      </instancedMesh>

      <instancedMesh ref={caps} args={[undefined, undefined, peaks.length]}>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color="#f2f7fb" roughness={0.85} flatShading />
      </instancedMesh>

      {/* cloud deck drifting below the summits */}
      {(
        [
          { pos: [-6, 4.5, -240], w: 34, h: 10 },
          { pos: [8, 6, -256], w: 40, h: 11 },
          { pos: [-2, 5, -268], w: 46, h: 13 },
        ] as const
      ).map((c, i) => (
        <Billboard key={i} position={c.pos}>
          <mesh>
            <planeGeometry args={[c.w, c.h]} />
            <meshBasicMaterial
              map={tex}
              color="#e8f1f9"
              transparent
              opacity={0.14}
              depthWrite={false}
            />
          </mesh>
        </Billboard>
      ))}
    </group>
  );
}
