"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";
import { pathSamples } from "@/lib/chapters";

const COUNT = 26;

interface Shroom {
  x: number;
  z: number;
  rotY: number;
  stemH: number;
  size: number;
  capColor: THREE.Color;
}

export default function Mushrooms() {
  const stemRef = useRef<THREE.InstancedMesh>(null);
  const capRef = useRef<THREE.InstancedMesh>(null);

  const shrooms = useMemo<Shroom[]>(() => {
    const rng = mulberry32(909);
    const out: Shroom[] = [];
    let guard = 0;
    while (out.length < COUNT && guard < COUNT * 40) {
      guard++;
      const x = rng() * 28 - 14;
      const z = 8 - rng() * 44;
      let clear = true;
      for (const p of pathSamples) {
        const dx = p.x - x;
        const dz = p.z - z;
        if (dx * dx + dz * dz < 6.75) {
          clear = false;
          break;
        }
      }
      if (!clear) continue;
      out.push({
        x,
        z,
        rotY: rng() * Math.PI * 2,
        stemH: 0.45 + rng() * 0.5,
        size: 0.3 + rng() * 0.42,
        capColor: new THREE.Color().setHSL(
          0.02 + rng() * 0.05,
          0.55,
          0.38 + rng() * 0.12,
        ),
      });
    }
    return out;
  }, []);

  const stemGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.09, 0.13, 1, 5);
    g.translate(0, 0.5, 0);
    return g;
  }, []);

  const capGeo = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 7, 5, 0, Math.PI * 2, 0, Math.PI / 2);
    g.scale(1, 0.72, 1);
    return g;
  }, []);

  const stemMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e7dcc3",
        flatShading: true,
        roughness: 1,
      }),
    [],
  );

  const capMat = useMemo(
    () => new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.9 }),
    [],
  );

  useLayoutEffect(() => {
    const stems = stemRef.current;
    const caps = capRef.current;
    if (!stems || !caps) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const axis = new THREE.Vector3(0, 1, 0);
    shrooms.forEach((s, i) => {
      q.setFromAxisAngle(axis, s.rotY);
      m.compose(
        new THREE.Vector3(s.x, 0, s.z),
        q,
        new THREE.Vector3(s.size, s.stemH, s.size),
      );
      stems.setMatrixAt(i, m);
      m.compose(
        new THREE.Vector3(s.x, s.stemH * 0.96, s.z),
        q,
        new THREE.Vector3(s.size * 1.15, s.size * 1.15, s.size * 1.15),
      );
      caps.setMatrixAt(i, m);
      caps.setColorAt(i, s.capColor);
    });
    stems.instanceMatrix.needsUpdate = true;
    caps.instanceMatrix.needsUpdate = true;
    if (caps.instanceColor) caps.instanceColor.needsUpdate = true;
  }, [shrooms]);

  return (
    <>
      <instancedMesh
        ref={stemRef}
        args={[stemGeo, stemMat, shrooms.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={capRef}
        args={[capGeo, capMat, shrooms.length]}
        frustumCulled={false}
      />
    </>
  );
}
