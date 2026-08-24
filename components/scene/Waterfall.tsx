"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";
import { makeRadialTexture } from "@/lib/textures";

const SPRAY_COUNT = 240;

const sprayVertex = `
uniform float uTime;
uniform float uSize;
attribute float aPhase;
attribute float aSpeed;
attribute float aRise;
varying float vTw;
void main() {
  vec3 p = position;
  float t = uTime * aSpeed + aPhase;
  p.y += mod(t * aRise, 5.0);
  p.x += sin(t * 1.4 + aPhase) * (0.35 + p.y * 0.22);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * (0.7 + 0.3 * sin(t * 2.2)) * (160.0 / max(1.0, -mv.z));
  gl_Position = projectionMatrix * mv;
  vTw = (1.0 - smoothstep(0.0, 5.0, mod(t * aRise, 5.0))) * 0.75 + 0.05;
}
`;

const sprayFragment = `
uniform vec3 uColor;
varying float vTw;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.1, d) * vTw;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
}
`;

const sheetVertex = `
uniform float uTime;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const sheetFragment = `
uniform float uTime;
varying vec2 vUv;
void main() {
  float speed = 0.9;
  float s1 = sin((vUv.y * 22.0 + uTime * speed) ) * 0.5 + 0.5;
  float s2 = sin(vUv.y * 47.0 + uTime * speed * 1.6 + sin(vUv.x * 12.0)) * 0.5 + 0.5;
  float streak = s1 * 0.55 + s2 * 0.45;
  vec3 deep = vec3(0.36, 0.56, 0.62);
  vec3 foam = vec3(0.92, 0.98, 1.0);
  vec3 col = mix(deep, foam, pow(streak, 1.6));
  float edgeX = min(vUv.x, 1.0 - vUv.x);
  float edgeFade = smoothstep(0.0, 0.18, edgeX);
  float topFade = smoothstep(0.96, 0.82, vUv.y);
  float bottomFoam = smoothstep(0.14, 0.0, vUv.y) * 0.6;
  col = mix(col, foam, bottomFoam);
  float alpha = edgeFade * topFade * (0.72 + streak * 0.28);
  gl_FragColor = vec4(col, alpha);
}
`;

export default function Waterfall() {
  const sheetMat = useRef<THREE.ShaderMaterial>(null);
  const sprayMat = useRef<THREE.ShaderMaterial>(null);
  const tex = useMemo(() => makeRadialTexture(), []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const sprayUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 3.0 },
      uColor: { value: new THREE.Color("#dff5fa") },
    }),
    [],
  );

  const spray = useMemo(() => {
    const rng = mulberry32(505);
    const positions = new Float32Array(SPRAY_COUNT * 3);
    const phases = new Float32Array(SPRAY_COUNT);
    const speeds = new Float32Array(SPRAY_COUNT);
    const rises = new Float32Array(SPRAY_COUNT);
    for (let i = 0; i < SPRAY_COUNT; i++) {
      positions[i * 3] = rng() * 16 - 8;
      positions[i * 3 + 1] = 0.3 + rng() * 0.8;
      positions[i * 3 + 2] = rng() * 8 - 11;
      phases[i] = rng() * Math.PI * 2;
      speeds[i] = 0.5 + rng() * 0.9;
      rises[i] = 0.6 + rng() * 1.2;
    }
    return { positions, phases, speeds, rises };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (sheetMat.current) sheetMat.current.uniforms.uTime.value = t;
    if (sprayMat.current) sprayMat.current.uniforms.uTime.value = t;
  });

  const mists = [
    { pos: [0, 2.2, -126], w: 20, h: 8, o: 0.14 },
    { pos: [-5, 3.5, -122], w: 16, h: 7, o: 0.1 },
    { pos: [6, 4.5, -124], w: 14, h: 7, o: 0.09 },
    { pos: [0, 30, -128], w: 18, h: 7, o: 0.08 },
  ] as const;

  return (
    <group position={[0, 0, -24]}>
      {/* twin rock towers flanking the notch the river pours through */}
      <mesh position={[-24, 21, -134]}>
        <boxGeometry args={[32, 46, 5]} />
        <meshStandardMaterial color="#2a3944" roughness={1} flatShading />
      </mesh>
      <mesh position={[23, 21, -134]}>
        <boxGeometry args={[30, 46, 5]} />
        <meshStandardMaterial color="#253340" roughness={1} flatShading />
      </mesh>
      <mesh position={[-27, 24, -141]}>
        <boxGeometry args={[30, 54, 6]} />
        <meshStandardMaterial color="#222e38" roughness={1} flatShading />
      </mesh>
      <mesh position={[28, 23, -140]}>
        <boxGeometry args={[28, 52, 6]} />
        <meshStandardMaterial color="#253340" roughness={1} flatShading />
      </mesh>

      {/* stone ledge the stream flows off before falling */}
      <mesh position={[0, 33.2, -132.5]}>
        <boxGeometry args={[19, 3.4, 8]} />
        <meshStandardMaterial color="#2a3944" roughness={1} flatShading />
      </mesh>

      {/* falling water sheet */}
      <mesh position={[0, 17.5, -131.4]}>
        <planeGeometry args={[13, 34]} />
        <shaderMaterial
          ref={sheetMat}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          vertexShader={sheetVertex}
          fragmentShader={sheetFragment}
        />
      </mesh>

      {/* bright lip at the top edge of the ledge */}
      <mesh position={[0, 31.6, -130.5]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[13.6, 2.2]} />
        <meshBasicMaterial color="#cfeef5" transparent opacity={0.85} />
      </mesh>

      {/* churning foam pool at the base */}
      <mesh position={[0, 0.12, -127]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[9.5, 40]} />
        <meshBasicMaterial
          map={tex}
          color="#e8f7fb"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* rising spray */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[spray.positions, 3]} />
          <bufferAttribute attach="attributes-aPhase" args={[spray.phases, 1]} />
          <bufferAttribute attach="attributes-aSpeed" args={[spray.speeds, 1]} />
          <bufferAttribute attach="attributes-aRise" args={[spray.rises, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={sprayMat}
          uniforms={sprayUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={sprayVertex}
          fragmentShader={sprayFragment}
        />
      </points>

      {/* drifting mist around the falls */}
      <group>
        {mists.map((m, i) => (
          <Billboard key={i} position={[...m.pos]}>
            <mesh>
              <planeGeometry args={[m.w, m.h]} />
              <meshBasicMaterial
                map={tex}
                color="#dff0f2"
                transparent
                opacity={m.o}
                depthWrite={false}
              />
            </mesh>
          </Billboard>
        ))}
      </group>

      {/* cold light inside the gorge */}
      <pointLight position={[0, 6, -120]} intensity={40} distance={46} decay={2} color="#bfeaf2" />
    </group>
  );
}
