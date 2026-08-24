"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SKY_POS = new THREE.Vector3(30, 330, -150);
const TARGET = new THREE.Vector3(0, 0, -205);

/** Pulls the camera high above the world for the map overview */
export default function MapRig() {
  const target = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());
  const placed = useRef(false);

  useFrame(({ camera }, dt) => {
    if (!placed.current) {
      // begin the pull-up from wherever the camera currently looks
      camera.getWorldDirection(dir.current);
      target.current
        .copy(camera.position)
        .addScaledVector(dir.current, 26);
      placed.current = true;
    }

    const k = 1 - Math.pow(0.02, dt);
    camera.position.lerp(SKY_POS, k);
    target.current.lerp(TARGET, Math.min(1, k * 1.2));
    camera.lookAt(target.current);
  });

  return null;
}
