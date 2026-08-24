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
  p.z += sin(p.x * 0.6 + uTime * 1.3) * 0.06 + cos(p.y * 0.5 + uTime * 0.9) * 0.05;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;
void main() {
  float w1 = sin(vUv.y * 70.0 - uTime * 1.6) * 0.5 + 0.5;
  float w2 = sin(vUv.x * 14.0 + vUv.y * 30.0 - uTime * 1.1) * 0.5 + 0.5;
  vec3 deep = vec3(0.043, 0.184, 0.208);
  vec3 lit = vec3(0.114, 0.494, 0.478);
  vec3 col = mix(deep, lit, w1 * 0.45 + w2 * 0.25);
  float spark = pow(
    max(sin(vUv.y * 240.0 - uTime * 3.0) * sin(vUv.x * 60.0 + uTime * 2.0), 0.0),
    24.0
  );
  col += vec3(0.9, 1.0, 0.95) * spark * 0.35;
  float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float fade = smoothstep(0.0, 0.12, edge);
  gl_FragColor = vec4(col, fade * 0.96);
}
`;

export default function River() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh position={[0, 0.14, -94]} rotation={[-Math.PI / 2, 0, 0.22]}>
      <planeGeometry args={[46, 62]} />
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
