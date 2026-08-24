"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ForestScene from "@/components/scene/ForestScene";

export default function JourneyCanvas({
  progressRef,
  freeWalk = false,
  mapMode = false,
  onWalkExit,
  onBiomeSelect,
}: {
  progressRef: { current: number };
  freeWalk?: boolean;
  mapMode?: boolean;
  onWalkExit?: () => void;
  onBiomeSelect?: (chapterIndex: number) => void;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 55, near: 0.1, far: 1100, position: [7, 2.4, 30] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <ForestScene
          progressRef={progressRef}
          freeWalk={freeWalk}
          mapMode={mapMode}
          onWalkExit={onWalkExit}
          onBiomeSelect={onBiomeSelect}
        />
      </Suspense>
    </Canvas>
  );
}
