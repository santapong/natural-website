"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";
import { makeBeamTexture, makeRadialTexture } from "@/lib/textures";

/* ------------------------------------------------------------------ */
/* Procedural golden-hour forest clearing                              */
/* (replaces the Spline demo — see spline-prompt.txt for the brief)    */
/* ------------------------------------------------------------------ */

type TreeItem = {
  x: number;
  z: number;
  h: number;
  rotY: number;
  kind: "pine" | "oak";
  barkColor: THREE.Color;
  leafColor: THREE.Color;
};

function buildTrees(): TreeItem[] {
  const rng = mulberry32(20260824);
  const items: TreeItem[] = [];

  // ring of trees around an open clearing centred near (0, 0)
  let tries = 0;
  while (items.length < 96 && tries++ < 4000) {
    const ang = rng() * Math.PI * 2;
    const rad = 6.5 + Math.pow(rng(), 0.7) * 24;
    const x = Math.cos(ang) * rad * 1.35;
    const z = Math.sin(ang) * rad - 8;
    if (z > 13 || z < -46) continue;
    if (Math.abs(x) < 4.6 && z > -14) continue; // keep the view corridor open
    items.push(makeTree(rng, x, z));
  }

  // a few large framing trunks right at the screen edges for depth
  items.push(
    makeTree(rng, -8.6, 6.5, 14),
    makeTree(rng, 9.4, 8.2, 12, "oak"),
    makeTree(rng, -10.5, 1.5, 15, "oak"),
  );
  return items;
}

function makeTree(
  rng: () => number,
  x: number,
  z: number,
  hOverride?: number,
  kindOverride?: TreeItem["kind"],
): TreeItem {
  const h = hOverride ?? 5 + rng() * 9;
  return {
    x,
    z,
    h,
    rotY: rng() * Math.PI * 2,
    kind: kindOverride ?? (rng() > 0.42 ? "pine" : "oak"),
    barkColor: new THREE.Color().setHSL(0.07 + rng() * 0.03, 0.3 + rng() * 0.1, 0.2 + rng() * 0.07),
    leafColor: new THREE.Color().setHSL(0.28 + rng() * 0.06, 0.42 + rng() * 0.16, 0.26 + rng() * 0.1),
  };
}

function Trees() {
  const trees = useMemo(() => buildTrees(), []);
  const pineCount = useMemo(() => trees.filter((t) => t.kind === "pine").length, [trees]);
  const oakCount = trees.length - pineCount;

  const trunks = useRef<THREE.InstancedMesh>(null);
  const pines = useRef<THREE.InstancedMesh>(null);
  const oaks = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    let pi = 0;
    let oi = 0;

    trees.forEach((t) => {
      e.set(0, t.rotY, 0);
      q.setFromEuler(e);

      p.set(t.x, t.h * 0.32, t.z);
      s.set(1, t.h * 0.64, 1);
      m.compose(p, q, s);
      trunks.current?.setMatrixAt(pi + oi, m);
      trunks.current?.setColorAt(pi + oi, t.barkColor);

      if (t.kind === "pine") {
        p.set(t.x, t.h * 0.72, t.z);
        s.set(t.h * 0.17, t.h * 0.62, t.h * 0.17);
        m.compose(p, q, s);
        pines.current?.setMatrixAt(pi, m);
        pines.current?.setColorAt(pi, t.leafColor);
        pi++;
      } else {
        p.set(t.x, t.h * 0.82, t.z);
        s.set(t.h * 0.24, t.h * 0.19, t.h * 0.24);
        m.compose(p, q, s);
        oaks.current?.setMatrixAt(oi, m);
        oaks.current?.setColorAt(oi, t.leafColor);
        oi++;
      }
    });

    [trunks, pines, oaks].forEach((r) => {
      if (!r.current) return;
      r.current.instanceMatrix.needsUpdate = true;
      if (r.current.instanceColor) r.current.instanceColor.needsUpdate = true;
    });
  }, [trees]);

  return (
    <group>
      <instancedMesh
        ref={trunks}
        args={[undefined, undefined, trees.length]}
        castShadow={false}
      >
        <cylinderGeometry args={[0.09, 0.16, 1, 5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} flatShading />
      </instancedMesh>

      <instancedMesh ref={pines} args={[undefined, undefined, pineCount]}>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />
      </instancedMesh>

      <instancedMesh ref={oaks} args={[undefined, undefined, oakCount]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} flatShading />
      </instancedMesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0}>
      <circleGeometry args={[80, 48]} />
      <meshStandardMaterial color="#274427" roughness={1} />
    </mesh>
  );
}

function SunGlow() {
  const tex = useMemo(() => makeRadialTexture(), []);
  return (
    <group position={[-7, 3.4, -52]}>
      <Billboard>
        <mesh>
          <planeGeometry args={[34, 34]} />
          <meshBasicMaterial
            map={tex}
            color="#ffab54"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
          />
        </mesh>
        <mesh>
          <circleGeometry args={[3.1, 32]} />
          <meshBasicMaterial color="#ffe3ae" transparent opacity={0.95} depthWrite={false} fog={false} />
        </mesh>
      </Billboard>
    </group>
  );
}

const BEAMS = [
  { x: -6.5, y: 9, z: -18, w: 2.6, tilt: 0.3, o: 0.075 },
  { x: -1.5, y: 10, z: -24, w: 3.2, tilt: 0.26, o: 0.09 },
  { x: 4.5, y: 9.5, z: -21, w: 2.4, tilt: 0.34, o: 0.065 },
  { x: 8.5, y: 10.5, z: -28, w: 2.8, tilt: 0.28, o: 0.07 },
  { x: -9.5, y: 10, z: -26, w: 3.4, tilt: 0.31, o: 0.08 },
] as const;

function Rays() {
  const tex = useMemo(() => makeBeamTexture(), []);
  return (
    <group>
      {BEAMS.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]} rotation-z={b.tilt}>
          <planeGeometry args={[b.w, 26]} />
          <meshBasicMaterial
            map={tex}
            color="#ffdca8"
            transparent
            opacity={b.o}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            fog={false}
          />
        </mesh>
      ))}
    </group>
  );
}

const MISTS = [
  { pos: [0, 1.1, -10] as const, w: 26, h: 8, opacity: 0.1, tint: "#9fd8b0", speed: 0.05 },
  { pos: [-5, 1.5, -20] as const, w: 30, h: 9, opacity: 0.09, tint: "#a8ddb4", speed: 0.042 },
  { pos: [5, 1.3, -28] as const, w: 32, h: 10, opacity: 0.08, tint: "#ffc98a", speed: 0.048 },
  { pos: [0, 2, -38] as const, w: 38, h: 12, opacity: 0.07, tint: "#ffd9a0", speed: 0.036 },
];

function Mist() {
  const tex = useMemo(() => makeRadialTexture(), []);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.children.forEach((child, i) => {
      const spot = MISTS[i];
      if (!spot) return;
      child.position.x = spot.pos[0] + Math.sin(t * spot.speed + i * 1.7) * 2.4;
    });
  });

  return (
    <group ref={group}>
      {MISTS.map((s, i) => (
        <Billboard key={i} position={[...s.pos]}>
          <mesh>
            <planeGeometry args={[s.w, s.h]} />
            <meshBasicMaterial
              map={tex}
              color={s.tint}
              transparent
              opacity={s.opacity}
              depthWrite={false}
              fog={false}
            />
          </mesh>
        </Billboard>
      ))}
    </group>
  );
}

const FLY_COUNT = 260;

const flyVertex = `
uniform float uTime;
uniform float uSize;
attribute float aPhase;
attribute float aSpeed;
attribute float aAmp;
varying float vTw;
void main() {
  vec3 p = position;
  float t = uTime * aSpeed + aPhase;
  p.y += sin(t) * aAmp;
  p.x += cos(t * 0.7 + aPhase) * aAmp * 0.6;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.65 + 0.35 * sin(t * 3.0)) * (160.0 / max(1.0, -mv.z));
  gl_Position = projectionMatrix * mv;
  vTw = 0.55 + 0.45 * sin(t * 3.0);
}
`;

const flyFragment = `
uniform vec3 uColor;
varying float vTw;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.08, d) * vTw;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
}
`;

function Fireflies() {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const { positions, phases, speeds, amps } = useMemo(() => {
    const rng = mulberry32(4242);
    const positions = new Float32Array(FLY_COUNT * 3);
    const phases = new Float32Array(FLY_COUNT);
    const speeds = new Float32Array(FLY_COUNT);
    const amps = new Float32Array(FLY_COUNT);
    for (let i = 0; i < FLY_COUNT; i++) {
      positions[i * 3] = rng() * 26 - 13;
      positions[i * 3 + 1] = Math.pow(rng(), 1.5) * 2.8 + 0.25;
      positions[i * 3 + 2] = 6 - rng() * 34;
      phases[i] = rng() * Math.PI * 2;
      speeds[i] = 0.4 + rng();
      amps[i] = 0.2 + rng() * 0.55;
    }
    return { positions, phases, speeds, amps };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 3.4 },
      uColor: { value: new THREE.Color("#d8ffa0") },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aAmp" args={[amps, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={flyVertex}
        fragmentShader={flyFragment}
      />
    </points>
  );
}

const LEAF_COUNT = 70;

function FallingLeaves() {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const leaves = useMemo(() => {
    const rng = mulberry32(99);
    return Array.from({ length: LEAF_COUNT }, () => ({
      x: rng() * 24 - 12,
      y: rng() * 9,
      z: 6 - rng() * 32,
      fall: 0.25 + rng() * 0.5,
      spin: 0.5 + rng() * 1.6,
      phase: rng() * Math.PI * 2,
      size: 0.1 + rng() * 0.16,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const im = mesh.current;
    if (!im) return;
    const t = clock.elapsedTime;

    leaves.forEach((l, i) => {
      const y = ((l.y - t * l.fall) % 9 + 9) % 9;
      dummy.position.set(
        l.x + Math.sin(t * l.spin * 0.6 + l.phase) * 0.9,
        y,
        l.z + Math.cos(t * l.spin * 0.4 + l.phase) * 0.5,
      );
      dummy.rotation.set(
        t * l.spin + l.phase,
        t * l.spin * 0.8 + l.phase,
        t * l.spin * 0.5,
      );
      dummy.scale.setScalar(l.size);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);

      const warm = 0.5 + 0.5 * Math.sin(l.phase * 3.7);
      color.setRGB(0.85, 0.45 + warm * 0.25, 0.12 + warm * 0.1);
      im.setColorAt(i, color);
    });

    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, LEAF_COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial side={THREE.DoubleSide} transparent opacity={0.9} fog={false} />
    </instancedMesh>
  );
}

function CameraRig() {
  const target = useMemo(() => new THREE.Vector3(0, 2.2, -14), []);
  const smooth = useRef({ x: 0, y: 0 });

  useFrame(({ camera, clock, pointer }, delta) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = 1 - Math.pow(0.001, delta); // frame-rate independent lerp

    smooth.current.x += (pointer.x - smooth.current.x) * k;
    smooth.current.y += (pointer.y - smooth.current.y) * k;

    const t = clock.elapsedTime;
    camera.position.set(
      smooth.current.x * 0.9 + (reduced ? 0 : Math.sin(t * 0.16) * 0.3),
      1.75 + smooth.current.y * 0.35 + (reduced ? 0 : Math.sin(t * 0.23) * 0.06),
      9,
    );
    camera.lookAt(target);
  });

  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 52, near: 0.1, far: 220, position: [0, 1.75, 9] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#13200f"]} />
      <fog attach="fog" args={["#22331c", 13, 56]} />

      <ambientLight color="#3d5233" intensity={0.55} />
      <hemisphereLight args={["#ffd9a0", "#16281a", 0.55]} />
      <directionalLight color="#ff9440" intensity={2.4} position={[-12, 7, -30]} />

      <CameraRig />
      <Ground />
      <Trees />
      <SunGlow />
      <Rays />
      <Mist />
      <Fireflies />
      <FallingLeaves />
    </Canvas>
  );
}
