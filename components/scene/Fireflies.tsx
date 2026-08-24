"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";

const COUNT = 380;

const vertexShader = `
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

const fragmentShader = `
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

export default function Fireflies() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, phases, speeds, amps } = useMemo(() => {
    const rng = mulberry32(777);
    const positions = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const amps = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = rng() * 44 - 22;
      positions[i * 3 + 1] = Math.pow(rng(), 1.6) * 3.8 + 0.25;
      positions[i * 3 + 2] = 10 - rng() * 80;
      phases[i] = rng() * Math.PI * 2;
      speeds[i] = 0.4 + rng();
      amps[i] = 0.2 + rng() * 0.65;
    }
    return { positions, phases, speeds, amps };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 3.2 },
      uColor: { value: new THREE.Color("#caff87") },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
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
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
}
