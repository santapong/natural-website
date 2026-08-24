"use client";

import { useEffect, useRef } from "react";
import { PointerLockControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const EYE = 1.7;
const WALK = 5.5;
const RUN = 10.5;
const BOUNDS = {
  x: 46,
  zMin: -448,
  zMax: 34,
};

const UP = new THREE.Vector3(0, 1, 0);

export default function FreeWalkRig({
  spawn,
  onExit,
}: {
  spawn: THREE.Vector3;
  onExit: () => void;
}) {
  const keys = useRef<Record<string, boolean>>({});
  const vel = useRef(new THREE.Vector3());
  const wish = useRef(new THREE.Vector3());
  const fwd = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const bobT = useRef(0);
  const placed = useRef(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    const blur = () => {
      keys.current = {};
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  useFrame((state, dt) => {
    const { camera } = state;

    // spawn where the scroll journey left off (first frame only)
    if (!placed.current) {
      camera.position.set(spawn.x, EYE, spawn.z);
      vel.current.set(0, 0, 0);
      placed.current = true;
    }

    const k = keys.current;
    const iz = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0);
    const ix = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0);

    // yaw-only movement so looking up/down doesn't cause flying
    camera.getWorldDirection(fwd.current);
    fwd.current.y = 0;
    if (fwd.current.lengthSq() < 1e-6) fwd.current.set(0, 0, -1);
    fwd.current.normalize();
    right.current.crossVectors(fwd.current, UP).normalize();

    wish.current
      .set(0, 0, 0)
      .addScaledVector(fwd.current, iz)
      .addScaledVector(right.current, ix);
    const moving = wish.current.lengthSq() > 0;
    if (moving) wish.current.normalize();

    const running = Boolean(k.ShiftLeft || k.ShiftRight);
    const speed = running ? RUN : WALK;
    wish.current.multiplyScalar(speed);

    const damp = 1 - Math.pow(0.0001, dt);
    vel.current.lerp(wish.current, damp);
    camera.position.addScaledVector(vel.current, dt);

    // keep the walker inside the world
    camera.position.x = THREE.MathUtils.clamp(
      camera.position.x,
      -BOUNDS.x,
      BOUNDS.x,
    );
    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z,
      BOUNDS.zMin,
      BOUNDS.zMax,
    );

    // gentle head bob while walking, eased toward eye height
    if (moving) bobT.current += dt * (running ? 11.5 : 8);
    const targetY = EYE + (moving ? Math.sin(bobT.current) * 0.035 : 0);
    camera.position.y += (targetY - camera.position.y) * Math.min(1, dt * 10);
  });

  return <PointerLockControls onUnlock={onExit} makeDefault />;
}
