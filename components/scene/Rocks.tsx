"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";
import { pathSamples } from "@/lib/chapters";

const COUNT = 46;

interface RockInstance {
  pos: THREE.Vector3;
  scale: THREE.Vector3;
  rotY: number;
  color: THREE.Color;
}

export default function Rocks() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const rocks = useMemo<RockInstance[]>(() => {
    const rng = mulberry32(4242);
    const out: RockInstance[] = [];
    let guard = 0;
    while (out.length < COUNT && guard < COUNT * 30) {
      guard++;
      const x = rng() * 60 - 30;
      const z = 20 - rng() * 170;
      if (z < -46) continue; // forest rocks only — other biomes dress themselves
      let clear = true;
      for (const p of pathSamples) {
        const dx = p.x - x;
        const dz = p.z - z;
        if (dx * dx + dz * dz < 16) {
          clear = false;
          break;
        }
      }
      if (!clear) continue;
      const s = 0.35 + rng() * 1.05;
      out.push({
        pos: new THREE.Vector3(x, s * 0.18, z),
        scale: new THREE.Vector3(s, s * (0.5 + rng() * 0.4), s),
        rotY: rng() * Math.PI * 2,
        color: new THREE.Color().setHSL(0.3, 0.05 + rng() * 0.06, 0.24 + rng() * 0.1),
      });
    }
    return out;
  }, []);

  const geo = useMemo(() => new THREE.DodecahedronGeometry(1, 0), []);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ flatShading: true, roughness: 1 }),
    [],
  );

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const axis = new THREE.Vector3(0, 1, 0);
    rocks.forEach((r, i) => {
      q.setFromAxisAngle(axis, r.rotY);
      m.compose(r.pos, q, r.scale);
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, r.color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [rocks]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geo, mat, rocks.length]}
      frustumCulled={false}
    />
  );
}
