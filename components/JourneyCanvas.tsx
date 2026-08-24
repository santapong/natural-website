"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ForestScene from "@/components/scene/ForestScene";

export default function JourneyCanvas({
  progressRef,
}: {
  progressRef: { current: number };
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 55, near: 0.1, far: 400, position: [7, 2.4, 30] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <ForestScene progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
