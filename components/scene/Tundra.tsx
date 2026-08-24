"use client";

import { ReactNode, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";

const FLAKE_COUNT = 620;

const flakeVertex = `
uniform float uTime;
uniform float uSize;
attribute float aPhase;
attribute float aSpeed;
attribute float aDrift;
varying float vTw;
void main() {
  vec3 p = position;
  float fall = mod(p.y - uTime * aSpeed, 12.0);
  p.y = fall;
  p.x += sin(uTime * 0.5 * aSpeed + aPhase) * aDrift;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.7 + 0.3 * sin(aPhase * 7.0)) * (160.0 / max(1.0, -mv.z));
  gl_Position = projectionMatrix * mv;
  vTw = 0.75 + 0.25 * sin(uTime * 2.0 + aPhase);
}
`;

const flakeFragment = `
uniform vec3 uColor;
varying float vTw;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.12, d) * vTw;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
}
`;

type Item = {
  pos: [number, number, number];
  scale: [number, number, number];
  rotY: number;
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
      e.set(0, it.rotY, 0);
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

export default function Tundra() {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const flakes = useMemo(() => {
    const rng = mulberry32(808);
    const positions = new Float32Array(FLAKE_COUNT * 3);
    const phases = new Float32Array(FLAKE_COUNT);
    const speeds = new Float32Array(FLAKE_COUNT);
    const drifts = new Float32Array(FLAKE_COUNT);
    for (let i = 0; i < FLAKE_COUNT; i++) {
      positions[i * 3] = rng() * 40 - 20;
      positions[i * 3 + 1] = rng() * 12;
      positions[i * 3 + 2] = -196 - rng() * 58;
      phases[i] = rng() * Math.PI * 2;
      speeds[i] = 0.35 + rng() * 0.75;
      drifts[i] = 0.3 + rng() * 0.9;
    }
    return { positions, phases, speeds, drifts };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 2.6 },
      uColor: { value: new THREE.Color("#f4fbff") },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group>
      {/* snow field */}
      <mesh position={[0, 0.02, -222]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[60, 48]} />
        <meshStandardMaterial color="#dfe8f2" roughness={1} />
      </mesh>

      {/* lichen shrubs */}
      <Scatter
        count={44}
        seed={31}
        make={(rng) => ({
          pos: [rng() * 38 - 19, 0.18, -200 - rng() * 46],
          scale: [0.35 + rng() * 0.55, 0.16 + rng() * 0.2, 0.35 + rng() * 0.55],
          rotY: rng() * Math.PI * 2,
          color: new THREE.Color().setHSL(0.22 + rng() * 0.06, 0.08 + rng() * 0.07, 0.28 + rng() * 0.1),
        })}
        geo={<icosahedronGeometry args={[1, 0]} />}
        mat={<meshStandardMaterial color="#ffffff" roughness={1} flatShading />}
      />

      {/* frost-grey rocks */}
      <Scatter
        count={26}
        seed={77}
        make={(rng) => ({
          pos: [rng() * 42 - 21, 0.12, -198 - rng() * 50],
          scale: [0.3 + rng() * 0.7, 0.2 + rng() * 0.35, 0.3 + rng() * 0.7],
          rotY: rng() * Math.PI * 2,
          color: new THREE.Color().setHSL(0.58, 0.05 + rng() * 0.04, 0.52 + rng() * 0.14),
        })}
        geo={<dodecahedronGeometry args={[1, 0]} />}
        mat={<meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />}
      />

      {/* bare wind-shaped trees */}
      <Scatter
        count={14}
        seed={99}
        make={(rng) => ({
          pos: [rng() * 34 - 17, 0.9 + rng() * 0.7, -202 - rng() * 42],
          scale: [0.09 + rng() * 0.05, 2 + rng() * 2, 0.09 + rng() * 0.05],
          rotY: rng() * Math.PI * 2,
          color: new THREE.Color().setHSL(0.07, 0.1 + rng() * 0.05, 0.2 + rng() * 0.06),
        })}
        geo={<coneGeometry args={[1, 1, 5]} />}
        mat={<meshStandardMaterial color="#ffffff" roughness={1} flatShading />}
      />

      {/* snowfall */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[flakes.positions, 3]} />
          <bufferAttribute attach="attributes-aPhase" args={[flakes.phases, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[flakes.speeds, 1]} />
          <bufferAttribute attach="attributes-aDrift" args={[flakes.drifts, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={flakeVertex}
          fragmentShader={flakeFragment}
        />
      </points>
    </group>
  );
}
