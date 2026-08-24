"use client";

import { ReactNode, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";

type Item = {
  pos: [number, number, number];
  scale: [number, number, number];
  rotY: number;
  tiltZ?: number;
  color: THREE.Color;
};

function Scatter({
  count,
  seed,
  make,
  geo,
  mat,
}: {
  count: number;
  seed: number;
  make: (rng: () => number) => Item;
  geo: ReactNode;
  mat: ReactNode;
}) {
  const items = useMemo(() => {
    const rng = mulberry32(seed);
    return Array.from({ length: count }, () => make(rng));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, seed]);

  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const im = ref.current;
    if (!im) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    items.forEach((it, i) => {
      e.set(0, it.rotY, it.tiltZ ?? 0);
      q.setFromEuler(e);
      m.compose(
        new THREE.Vector3(...it.pos),
        q,
        new THREE.Vector3(...it.scale),
      );
      im.setMatrixAt(i, m);
      im.setColorAt(i, it.color);
    });
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
  }, [items]);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      {geo}
      {mat}
    </instancedMesh>
  );
}

export default function Desert() {
  return (
    <group>
      {/* sand sea */}
      <mesh position={[0, 0.015, -292]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[85, 48]} />
        <meshStandardMaterial color="#cf9d5a" roughness={1} />
      </mesh>

      {/* dune mounds */}
      <Scatter
        count={30}
        seed={11}
        make={(rng) => ({
          pos: [rng() * 60 - 30, 0.1, -252 - rng() * 70],
          scale: [5 + rng() * 9, 0.7 + rng() * 1.5, 5 + rng() * 9],
          rotY: rng() * Math.PI * 2,
          color: new THREE.Color().setHSL(0.08 + rng() * 0.02, 0.42 + rng() * 0.12, 0.52 + rng() * 0.12),
        })}
        geo={<sphereGeometry args={[1, 10, 6]} />}
        mat={<meshStandardMaterial color="#ffffff" roughness={1} flatShading />}
      />

      {/* saguaro cacti — trunk + arm share placement */}
      <Cacti />

      {/* sun-baked rocks */}
      <Scatter
        count={22}
        seed={41}
        make={(rng) => ({
          pos: [rng() * 50 - 25, 0.15, -254 - rng() * 66],
          scale: [0.35 + rng() * 0.8, 0.25 + rng() * 0.45, 0.35 + rng() * 0.8],
          rotY: rng() * Math.PI * 2,
          color: new THREE.Color().setHSL(0.06, 0.18 + rng() * 0.08, 0.3 + rng() * 0.1),
        })}
        geo={<dodecahedronGeometry args={[1, 0]} />}
        mat={<meshStandardMaterial color="#ffffff" roughness={1} flatShading />}
      />
    </group>
  );
}

function Cacti() {
  const COUNT = 16;

  const cacti = useMemo(() => {
    const rng = mulberry32(55);
    return Array.from({ length: COUNT }, () => ({
      x: rng() * 44 - 22,
      z: -256 - rng() * 62,
      h: 1.8 + rng() * 1.8,
      armSide: rng() > 0.5 ? 1 : -1,
      armY: 0.35 + rng() * 0.3,
      rotY: rng() * Math.PI * 2,
      color: new THREE.Color().setHSL(0.32 + rng() * 0.03, 0.28 + rng() * 0.1, 0.26 + rng() * 0.07),
    }));
  }, []);

  const trunks = useRef<THREE.InstancedMesh>(null);
  const arms = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();

    cacti.forEach((c, i) => {
      e.set(0, c.rotY, 0);
      q.setFromEuler(e);

      p.set(c.x, c.h / 2, c.z);
      s.set(1, c.h, 1);
      m.compose(p, q, s);
      trunks.current?.setMatrixAt(i, m);
      trunks.current?.setColorAt(i, c.color);

      p.set(c.x + c.armSide * 0.34, c.h * (0.5 + c.armY), c.z);
      s.set(0.8, 0.9, 0.8);
      m.compose(p, q, s);
      arms.current?.setMatrixAt(i, m);
      arms.current?.setColorAt(i, c.color);
    });

    if (trunks.current) {
      trunks.current.instanceMatrix.needsUpdate = true;
      if (trunks.current.instanceColor) trunks.current.instanceColor.needsUpdate = true;
    }
    if (arms.current) {
      arms.current.instanceMatrix.needsUpdate = true;
      if (arms.current.instanceColor) arms.current.instanceColor.needsUpdate = true;
    }
  }, [cacti]);

  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, COUNT]}>
        <capsuleGeometry args={[0.16, 1, 3, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} flatShading />
      </instancedMesh>
      <instancedMesh ref={arms} args={[undefined, undefined, COUNT]}>
        <capsuleGeometry args={[0.12, 1, 3, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} flatShading />
      </instancedMesh>
    </group>
  );
}
