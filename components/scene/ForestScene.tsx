"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sampleAtmosphere } from "@/lib/atmosphere";
import CameraRig from "./CameraRig";
import Trees from "./Trees";
import Rocks from "./Rocks";
import Mushrooms from "./Mushrooms";
import Fireflies from "./Fireflies";
import FallingLeaves from "./FallingLeaves";
import MistPlanes from "./MistPlanes";
import Rays from "./Rays";
import Lake from "./Lake";
import Waterfall from "./Waterfall";
import Fjord from "./Fjord";
import Tundra from "./Tundra";
import Desert from "./Desert";
import SunFinale from "./SunFinale";

export default function ForestScene({
  progressRef,
}: {
  progressRef: { current: number };
}) {
  const eased = useRef(0);
  const dirLight = useRef<THREE.DirectionalLight>(null);

  useFrame((state, dt) => {
    eased.current = THREE.MathUtils.damp(
      eased.current,
      progressRef.current,
      2.8,
      dt,
    );
    const atmo = sampleAtmosphere(eased.current);
    const bg = state.scene.background;
    if (bg instanceof THREE.Color) bg.copy(atmo.fogColor);
    const fog = state.scene.fog;
    if (fog instanceof THREE.FogExp2) {
      fog.color.copy(atmo.fogColor);
      fog.density = atmo.density;
    }
    if (dirLight.current) {
      dirLight.current.color.copy(atmo.lightColor);
      dirLight.current.intensity = atmo.intensity;
    }
  });

  return (
    <>
      <color attach="background" args={["#0b2418"]} />
      <fogExp2 attach="fog" args={["#0b2418", 0.03]} />
      <hemisphereLight args={["#9fd8b0", "#10241a", 0.55]} />
      <ambientLight intensity={0.15} />
      <directionalLight
        ref={dirLight}
        position={[30, 42, -18]}
        intensity={1.1}
        color="#cfe8d2"
      />

      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[260, 48]} />
        <meshStandardMaterial color="#10301d" roughness={1} metalness={0} />
      </mesh>

      <CameraRig eased={eased} />
      <Trees />
      <Rocks />
      <Mushrooms />
      <Fireflies />
      <FallingLeaves />
      <MistPlanes />
      <Rays />

      {/* biome chain: forest > lake > waterfall > fjord > tundra > desert */}
      <Lake />
      <Waterfall />
      <Fjord />
      <Tundra />
      <Desert />
      <SunFinale />
    </>
  );
}
