"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";

const COUNT = 220;

const PALETTE = ["#d98a3d", "#c96f2f", "#b5541f", "#e0a94f"].map(
  (hex) => new THREE.Color(hex),
);

const vertexShader = `
uniform float uTime;
attribute float aPhase;
attribute float aSpeed;
attribute float aSway;
attribute vec3 aColor;
varying vec3 vColor;
varying float vFade;
void main() {
  vec3 p = position;
  float fall = mod(p.y - uTime * aSpeed, 11.5);
  p.y = 0.3 + fall;
  p.x += sin(uTime * 0.8 + aPhase) * aSway;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = 5.0 * (140.0 / max(1.0, -mv.z));
  gl_Position = projectionMatrix * mv;
  vColor = aColor;
  vFade = smoothstep(0.0, 1.5, fall) * (1.0 - smoothstep(10.0, 11.5, fall));
}
`;

const fragmentShader = `
varying vec3 vColor;
varying float vFade;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.25, d) * vFade * 0.9;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}
`;

export default function FallingLeaves() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, phases, speeds, sways, colors } = useMemo(() => {
    const rng = mulberry32(2024);
    const positions = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const sways = new Float32Array(COUNT);
    const colors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = rng() * 44 - 22;
      positions[i * 3 + 1] = 6 + rng() * 8;
      positions[i * 3 + 2] = -14 - rng() * 34;
      phases[i] = rng() * Math.PI * 2;
      speeds[i] = 0.5 + rng() * 0.7;
      sways[i] = 0.6 + rng() * 1.0;
      const col = PALETTE[Math.floor(rng() * PALETTE.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return { positions, phases, speeds, sways, colors };
  }, []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aSway" args={[sways, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
}
