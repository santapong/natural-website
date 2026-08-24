"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";

const LEAF_COUNT = 520;

const leafVertex = `
uniform float uTime;
uniform float uSize;
attribute float aPhase;
attribute float aSpeed;
attribute float aDrift;
varying vec3 vColor;
void main() {
  vec3 p = position;
  p.y = mod(p.y - uTime * aSpeed, 11.0);
  p.x += sin(uTime * (0.4 + aSpeed) + aPhase) * aDrift;
  p.z += cos(uTime * 0.3 * aSpeed + aPhase) * aDrift * 0.6;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.7 + 0.3 * sin(aPhase * 5.0)) * (160.0 / max(1.0, -mv.z));
  gl_Position = projectionMatrix * mv;
  vColor = color;
}
`;

const leafFragment = `
varying vec3 vColor;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.14, d);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a * 0.9);
}
`;

function AmberTrees() {
  const COUNT = 58;

  const trees = useMemo(() => {
    const rng = mulberry32(1234);
    const out: {
      x: number;
      z: number;
      h: number;
      rotY: number;
      bark: THREE.Color;
      crown: THREE.Color;
    }[] = [];
    let guard = 0;
    while (out.length < COUNT && guard++ < 800) {
      const x = rng() * 52 - 26;
      const z = -52 - rng() * 34;
      if (Math.abs(x) < 5.2) continue; // keep the walking corridor open
      out.push({
        x,
        z,
        h: 5.5 + rng() * 7,
        rotY: rng() * Math.PI * 2,
        bark: new THREE.Color().setHSL(0.05 + rng() * 0.03, 0.35, 0.18 + rng() * 0.06),
        crown: new THREE.Color().setHSL(
          [0.02, 0.05, 0.08, 0.11][Math.floor(rng() * 4)],
          0.65 + rng() * 0.25,
          0.42 + rng() * 0.12,
        ),
      });
    }
    return out;
  }, []);

  const trunks = useRef<THREE.InstancedMesh>(null);
  const crowns = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();

    trees.forEach((t, i) => {
      e.set(0, t.rotY, 0);
      q.setFromEuler(e);

      p.set(t.x, t.h * 0.3, t.z);
      s.set(0.8, t.h * 0.6, 0.8);
      m.compose(p, q, s);
      trunks.current?.setMatrixAt(i, m);
      trunks.current?.setColorAt(i, t.bark);

      p.set(t.x, t.h * 0.78, t.z);
      s.set(t.h * 0.26, t.h * 0.24, t.h * 0.26);
      m.compose(p, q, s);
      crowns.current?.setMatrixAt(i, m);
      crowns.current?.setColorAt(i, t.crown);
    });

    if (trunks.current) {
      trunks.current.instanceMatrix.needsUpdate = true;
      if (trunks.current.instanceColor) trunks.current.instanceColor.needsUpdate = true;
    }
    if (crowns.current) {
      crowns.current.instanceMatrix.needsUpdate = true;
      if (crowns.current.instanceColor) crowns.current.instanceColor.needsUpdate = true;
    }
  }, [trees]);

  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, COUNT]}>
        <cylinderGeometry args={[0.09, 0.17, 1, 5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} flatShading />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, COUNT]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />
      </instancedMesh>
    </group>
  );
}

export default function Autumn() {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const leaves = useMemo(() => {
    const rng = mulberry32(5678);
    const positions = new Float32Array(LEAF_COUNT * 3);
    const colors = new Float32Array(LEAF_COUNT * 3);
    const phases = new Float32Array(LEAF_COUNT);
    const speeds = new Float32Array(LEAF_COUNT);
    const drifts = new Float32Array(LEAF_COUNT);
    const palette = [
      new THREE.Color("#e8632c"),
      new THREE.Color("#f39b2c"),
      new THREE.Color("#d94f30"),
      new THREE.Color("#f7c04a"),
    ];
    for (let i = 0; i < LEAF_COUNT; i++) {
      positions[i * 3] = rng() * 46 - 23;
      positions[i * 3 + 1] = rng() * 11;
      positions[i * 3 + 2] = -54 - rng() * 34;
      phases[i] = rng() * Math.PI * 2;
      speeds[i] = 0.45 + rng() * 0.8;
      drifts[i] = 0.4 + rng() * 1.1;
      const c = palette[Math.floor(rng() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors, phases, speeds, drifts };
  }, []);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uSize: { value: 2.4 } }),
    [],
  );

  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group>
      {/* warm leaf-litter tint on the ground */}
      <mesh position={[0, 0.03, -68]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[42, 40]} />
        <meshStandardMaterial color="#5e3d17" roughness={1} />
      </mesh>

      <AmberTrees />

      {/* red-and-gold leaf rain */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[leaves.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[leaves.colors, 3]} />
          <bufferAttribute attach="attributes-aPhase" args={[leaves.phases, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[leaves.speeds, 1]} />
          <bufferAttribute attach="attributes-aDrift" args={[leaves.drifts, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          vertexColors
          vertexShader={leafVertex}
          fragmentShader={leafFragment}
        />
      </points>
    </group>
  );
}
