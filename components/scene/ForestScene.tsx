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
import Autumn from "./Autumn";
import Deer from "./Deer";
import Lake from "./Lake";
import Fish from "./Fish";
import Waterfall from "./Waterfall";
import Fjord from "./Fjord";
import Alpine from "./Alpine";
import Tundra from "./Tundra";
import Savanna from "./Savanna";
import Desert from "./Desert";
import SunFinale from "./SunFinale";
import Birds from "./Birds";
import Butterfly from "./Butterfly";
import Rabbit from "./Rabbit";
import Whale from "./Whale";
import Fox from "./Fox";
import Giraffe from "./Giraffe";
import Camel from "./Camel";

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

      {/* biome chain: forest > autumn > lake > waterfall > fjord > alpine > tundra > savanna > desert */}
      <Butterfly />
      <Autumn />
      <Deer />
      <Rabbit />
      <Lake />
      <Fish />
      <Birds center={[0, 9, -104]} radius={17} count={9} speed={0.14} color="#f4f7f9" scale={1.1} />
      <Waterfall />
      <Fjord />
      <Whale />
      <Alpine />
      <Birds
        center={[0, 15, -258]}
        radius={13}
        count={3}
        speed={-0.08}
        color="#5a4632"
        scale={2.4}
        flapSpeed={2.6}
      />
      <Tundra />
      <Fox />
      <Savanna />
      <Giraffe />
      <Birds center={[0, 7, -340]} radius={21} count={6} speed={-0.1} color="#3d3229" scale={0.8} />
      <Desert />
      <Camel />
      <SunFinale />
    </>
  );
}
