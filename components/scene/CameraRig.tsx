"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cameraPath, lookPath } from "@/lib/chapters";

const tmpPos = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

export default function CameraRig({ eased }: { eased: { current: number } }) {
  useFrame(({ camera, clock }) => {
    const t = THREE.MathUtils.clamp(eased.current, 0, 1);
    const time = clock.elapsedTime;
    cameraPath.getPoint(t, tmpPos);
    camera.position.x = tmpPos.x + Math.sin(time * 0.35) * 0.18;
    camera.position.y = tmpPos.y + Math.sin(time * 0.5) * 0.08;
    camera.position.z = tmpPos.z;
    lookPath.getPoint(t, tmpLook);
    tmpLook.x += Math.cos(time * 0.3) * 0.12;
    camera.lookAt(tmpLook);
  });

  return null;
}
