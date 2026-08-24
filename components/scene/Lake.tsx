"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
uniform float uTime;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  p.z += sin(p.x * 0.25 + uTime * 0.5) * 0.05 + cos(p.y * 0.2 + uTime * 0.35) * 0.04;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;
void main() {
  float w1 = sin(vUv.y * 26.0 - uTime * 0.55) * 0.5 + 0.5;
  float w2 = sin(vUv.x * 9.0 + vUv.y * 13.0 - uTime * 0.4) * 0.5 + 0.5;
  vec3 deep = vec3(0.031, 0.145, 0.196);
  vec3 lit = vec3(0.157, 0.494, 0.545);
  vec3 col = mix(deep, lit, w1 * 0.32 + w2 * 0.2);
  float spark = pow(
    max(sin(vUv.y * 130.0 - uTime * 0.9) * sin(vUv.x * 46.0 + uTime * 0.7), 0.0),
    30.0
  );
  col += vec3(0.85, 0.96, 1.0) * spark * 0.3;
  float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float fade = smoothstep(0.0, 0.16, edge);
  gl_FragColor = vec4(col, fade * 0.97);
}
`;

export default function Lake() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh position={[0, 0.07, -68]} rotation={[-Math.PI / 2, 0, 0.06]}>
      <planeGeometry args={[64, 44]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
