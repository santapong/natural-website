"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";

type Acacia = {
  x: number;
  z: number;
  trunkH: number;
  tilt: number;
  rotY: number;
  crownR: number;
  leaf: THREE.Color;
};

function buildAcacias(): Acacia[] {
  const rng = mulberry32(1357);
  const out: Acacia[] = [];
  let guard = 0;
  while (out.length < 11 && guard++ < 300) {
    const x = rng() * 44 - 22;
    const z = -324 - rng() * 38;
    if (Math.abs(x) < 6.5) continue; // keep the path clear
    out.push({
      x,
      z,
      trunkH: 3.4 + rng() * 2.4,
      tilt: (rng() - 0.5) * 0.16,
      rotY: rng() * Math.PI * 2,
      crownR: 2.8 + rng() * 1.8,
      leaf: new THREE.Color().setHSL(0.19 + rng() * 0.05, 0.32 + rng() * 0.12, 0.28 + rng() * 0.08),
    });
  }
  return out;
}

export default function Savanna() {
  const acacias = useMemo(() => buildAcacias(), []);

  const trunks = useRef<THREE.InstancedMesh>(null);
  const crowns = useRef<THREE.InstancedMesh>(null);
  const mounds = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();

    acacias.forEach((a, i) => {
      e.set(0, a.rotY, a.tilt);
      q.setFromEuler(e);

      p.set(a.x, a.trunkH / 2, a.z);
      s.set(0.55, a.trunkH, 0.55);
      m.compose(p, q, s);
      trunks.current?.setMatrixAt(i, m);
      trunks.current?.setColorAt(i, new THREE.Color().setHSL(0.07, 0.3, 0.16));

      p.set(a.x, a.trunkH + 0.35, a.z);
      s.set(a.crownR, 0.85, a.crownR);
      m.compose(p, q, s);
      crowns.current?.setMatrixAt(i, m);
      crowns.current?.setColorAt(i, a.leaf);
    });

    if (trunks.current) {
      trunks.current.instanceMatrix.needsUpdate = true;
      if (trunks.current.instanceColor) trunks.current.instanceColor.needsUpdate = true;
    }
    if (crowns.current) {
      crowns.current.instanceMatrix.needsUpdate = true;
      if (crowns.current.instanceColor) crowns.current.instanceColor.needsUpdate = true;
    }

    // termite mounds
    const rng = mulberry32(246);
    for (let i = 0; i < 8; i++) {
      e.set(0, rng() * Math.PI * 2, 0);
      q.setFromEuler(e);
      const h = 0.8 + rng() * 1.5;
      p.set(rng() * 40 - 20, h / 2, -326 - rng() * 34);
      s.set(0.7 + rng() * 0.5, h, 0.7 + rng() * 0.5);
      m.compose(p, q, s);
      mounds.current?.setMatrixAt(i, m);
      mounds.current?.setColorAt(i, new THREE.Color().setHSL(0.08, 0.32, 0.42 + rng() * 0.1));
    }
    if (mounds.current) {
      mounds.current.instanceMatrix.needsUpdate = true;
      if (mounds.current.instanceColor) mounds.current.instanceColor.needsUpdate = true;
    }
  }, [acacias]);

  return (
    <group>
      {/* golden grass sea */}
      <mesh position={[0, 0.02, -342]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[50, 44]} />
        <meshStandardMaterial color="#c9a24d" roughness={1} />
      </mesh>

      {/* acacia trunks */}
      <instancedMesh ref={trunks} args={[undefined, undefined, acacias.length]}>
        <cylinderGeometry args={[0.16, 0.26, 1, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} flatShading />
      </instancedMesh>

      {/* flat umbrella crowns */}
      <instancedMesh ref={crowns} args={[undefined, undefined, acacias.length]}>
        <coneGeometry args={[1, 1, 9]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />
      </instancedMesh>

      {/* termite mounds */}
      <instancedMesh ref={mounds} args={[undefined, undefined, 8]}>
        <coneGeometry args={[1, 1, 7]} />
        <meshStandardMaterial color="#ffffff" roughness={1} flatShading />
      </instancedMesh>
    </group>
  );
}
