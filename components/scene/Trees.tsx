"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";
import { pathSamples } from "@/lib/chapters";

const COUNT = 140;

interface TreeInstance {
  x: number;
  z: number;
  rotY: number;
  trunkH: number;
  trunkR: number;
  canopyH: number;
  canopyR: number;
  trunkColor: THREE.Color;
  leafColor: THREE.Color;
}

export default function Trees() {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const canopyRef = useRef<THREE.InstancedMesh>(null);

  const trees = useMemo<TreeInstance[]>(() => {
    const rng = mulberry32(1337);
    const out: TreeInstance[] = [];
    let guard = 0;
    while (out.length < COUNT && guard < COUNT * 30) {
      guard++;
      const x = rng() * 76 - 38;
      const z = 26 - rng() * 200;
      let clear = true;
      for (const p of pathSamples) {
        const dx = p.x - x;
        const dz = p.z - z;
        if (dx * dx + dz * dz < 30.25) {
          clear = false;
          break;
        }
      }
      if (!clear) continue;
      const s = 0.8 + rng() * 1.9;
      out.push({
        x,
        z,
        rotY: rng() * Math.PI * 2,
        trunkH: 2.6 * s,
        trunkR: 0.28 * s,
        canopyH: 4.4 * s * (0.85 + rng() * 0.3),
        canopyR: 1.9 * s,
        trunkColor: new THREE.Color().setHSL(
          0.07 + rng() * 0.03,
          0.28 + rng() * 0.12,
          0.22 + rng() * 0.08,
        ),
        leafColor: new THREE.Color().setHSL(
          0.3 + rng() * 0.06,
          0.4 + rng() * 0.2,
          0.28 + rng() * 0.14,
        ),
      });
    }
    return out;
  }, []);

  const trunkGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.7, 1, 1, 6);
    g.translate(0, 0.5, 0);
    return g;
  }, []);

  const canopyGeo = useMemo(() => {
    const g = new THREE.ConeGeometry(1, 1, 6);
    g.translate(0, 0.5, 0);
    return g;
  }, []);

  const barkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ flatShading: true, roughness: 1 }),
    [],
  );

  const leafMat = useMemo(
    () => new THREE.MeshStandardMaterial({ flatShading: true, roughness: 1 }),
    [],
  );

  useLayoutEffect(() => {
    const trunk = trunkRef.current;
    const canopy = canopyRef.current;
    if (!trunk || !canopy) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const axis = new THREE.Vector3(0, 1, 0);
    const pos = new THREE.Vector3();
    const scl = new THREE.Vector3();
    trees.forEach((t, i) => {
      q.setFromAxisAngle(axis, t.rotY);
      m.compose(pos.set(t.x, 0, t.z), q, scl.set(t.trunkR, t.trunkH, t.trunkR));
      trunk.setMatrixAt(i, m);
      trunk.setColorAt(i, t.trunkColor);
      m.compose(
        pos.set(t.x, t.trunkH * 0.72, t.z),
        q,
        scl.set(t.canopyR, t.canopyH, t.canopyR),
      );
      canopy.setMatrixAt(i, m);
      canopy.setColorAt(i, t.leafColor);
    });
    trunk.instanceMatrix.needsUpdate = true;
    canopy.instanceMatrix.needsUpdate = true;
    if (trunk.instanceColor) trunk.instanceColor.needsUpdate = true;
    if (canopy.instanceColor) canopy.instanceColor.needsUpdate = true;
  }, [trees]);

  return (
    <>
      <instancedMesh
        ref={trunkRef}
        args={[trunkGeo, barkMat, trees.length]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={canopyRef}
        args={[canopyGeo, leafMat, trees.length]}
        frustumCulled={false}
      />
    </>
  );
}
