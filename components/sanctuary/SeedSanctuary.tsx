"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* SEED SANCTUARY — a tiny physics playground (type #16).              */
/* Drag upward & release to toss glowing wish-seeds; they arc,         */
/* bounce, settle… and sprout into a grove of little glowing trees.    */
/* ------------------------------------------------------------------ */

const G = 19;
const GROUND_Y = 0.16;
const REST = 0.42;
const BOUND = 11;

type Command = { type: "launch"; dx: number; power: number } | { type: "reset" };

type Sprout = { id: number; x: number; z: number; hue: number };

let nextId = 1;

function SproutTree({ sprout }: { sprout: Sprout }) {
  const group = useRef<THREE.Group>(null);
  const mounted = useRef<number | null>(null);
  const leaf = useMemo(
    () => new THREE.Color().setHSL(sprout.hue, 0.55, 0.45),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    if (mounted.current === null) mounted.current = clock.elapsedTime;
    const t = Math.min(1, (clock.elapsedTime - mounted.current) / 1.1);
    g.scale.setScalar(t * (1 + Math.sin(t * Math.PI) * 0.18));
  });

  return (
    <group ref={group} position={[sprout.x, GROUND_Y, sprout.z]} scale={0}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.05, 0.09, 0.7, 5]} />
        <meshStandardMaterial color="#7a5a37" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color={leaf} roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.07, 6, 5]} />
        <meshStandardMaterial color="#d8ffa0" emissive="#d8ffa0" emissiveIntensity={1.4} />
      </mesh>
      <pointLight position={[0, 0.9, 0]} intensity={2.2} distance={4} color="#d8ffa0" />
    </group>
  );
}

function AimRing({
  aimRef,
}: {
  aimRef: { current: { active: boolean; x: number; z: number } };
}) {
  const ring = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const r = ring.current;
    if (!r) return;
    r.visible = aimRef.current.active;
    r.position.set(aimRef.current.x, 0.2, aimRef.current.z);
    const mat = r.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.45 + Math.sin(performance.now() * 0.012) * 0.2;
  });

  return (
    <mesh ref={ring} rotation-x={-Math.PI / 2} visible={false}>
      <ringGeometry args={[0.5, 0.74, 26]} />
      <meshBasicMaterial color="#ffd97a" transparent opacity={0.6} depthWrite={false} />
    </mesh>
  );
}

function PhysicsWorld({
  cmdRef,
  aimRef,
  onSprout,
}: {
  cmdRef: { current: Command[] };
  aimRef: { current: { active: boolean; x: number; z: number } };
  onSprout: (x: number, z: number) => void;
}) {
  const layer = useRef<THREE.Group>(null);
  const wishLight = useRef<THREE.PointLight>(null);

  const assets = useMemo(
    () => ({
      seedGeo: new THREE.SphereGeometry(0.17, 10, 8),
      seedMat: new THREE.MeshStandardMaterial({
        color: "#ffd97a",
        emissive: "#ffb84d",
        emissiveIntensity: 1.6,
        roughness: 0.4,
      }),
    }),
    [],
  );

  const seeds = useRef<
    { id: number; pos: THREE.Vector3; vel: THREE.Vector3; mesh: THREE.Mesh }[]
  >([]);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dtRaw) => {
    const dt = Math.min(0.033, dtRaw);
    const L = layer.current;
    if (!L) return;

    // consume commands queued by the DOM handlers
    const cmds = cmdRef.current.splice(0);
    for (const c of cmds) {
      if (c.type === "reset") {
        for (const s of seeds.current) L.remove(s.mesh);
        seeds.current = [];
      } else if (c.type === "launch") {
        const mesh = new THREE.Mesh(assets.seedGeo, assets.seedMat);
        mesh.position.set(0, 2.4, 8.4);
        L.add(mesh);
        seeds.current.push({
          id: nextId++,
          pos: mesh.position.clone(),
          vel: new THREE.Vector3(-c.dx * 0.02, 5 + 7 * c.power, -(6.5 + 6 * c.power)),
          mesh,
        });
        if (seeds.current.length > 10) {
          const old = seeds.current.shift();
          if (old) L.remove(old.mesh);
        }
      }
    }

    // integrate
    const settled: THREE.Vector3[] = [];
    for (const s of seeds.current) {
      s.vel.y -= G * dt;
      s.pos.addScaledVector(s.vel, dt);

      if (s.pos.y <= GROUND_Y && s.vel.y < 0) {
        s.pos.y = GROUND_Y;
        s.vel.y *= -REST;
        s.vel.x *= 0.82;
        s.vel.z *= 0.82;
        if (Math.abs(s.vel.y) < 1.2) s.vel.y = 0;
      }
      if (Math.abs(s.pos.x) > BOUND) {
        s.pos.x = Math.sign(s.pos.x) * BOUND;
        s.vel.x *= -0.5;
      }
      if (Math.abs(s.pos.z) > BOUND + 1) {
        s.pos.z = Math.sign(s.pos.z) * (BOUND + 1);
        s.vel.z *= -0.5;
      }

      s.mesh.position.copy(s.pos);
      const spin = s.vel.length() * dt;
      s.mesh.rotation.x += spin;
      s.mesh.rotation.z += spin * 0.75;

      if (
        s.pos.y <= GROUND_Y + 0.01 &&
        s.vel.lengthSq() < 0.25 &&
        Math.abs(s.pos.x) < BOUND &&
        Math.abs(s.pos.z) < BOUND + 1
      ) {
        settled.push(s.pos.clone());
      }
    }

    for (const p of settled) {
      const i = seeds.current.findIndex((s) => s.pos.equals(p));
      if (i >= 0) {
        L.remove(seeds.current[i].mesh);
        seeds.current.splice(i, 1);
      }
      onSprout(p.x, p.z);
    }

    // wish-light follows the newest airborne seed
    if (wishLight.current) {
      const flying = seeds.current[seeds.current.length - 1];
      tmp.set(flying ? flying.pos.x : 0, flying ? flying.pos.y + 0.5 : 3.4, flying ? flying.pos.z : 3);
      wishLight.current.position.lerp(tmp, 0.12);
      wishLight.current.intensity +=
        ((flying ? 30 : 7) - wishLight.current.intensity) * 0.08;
    }
    void clock;
  });

  return (
    <>
      <color attach="background" args={["#07120c"]} />
      <ambientLight intensity={0.55} color="#cfe8d2" />
      <directionalLight position={[5, 9, 6]} intensity={1.25} color="#ffe0b0" />

      {/* mossy clearing */}
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[BOUND + 1.5, 40]} />
        <meshStandardMaterial color="#2c4425" roughness={1} />
      </mesh>
      {[...Array(7)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(i * 2.4) * (4 + i * 0.9),
            0.22,
            Math.sin(i * 2.4) * (4 + i * 0.9),
          ]}
          rotation={[0, i, i * 0.4]}
        >
          <dodecahedronGeometry args={[0.28 + (i % 3) * 0.14, 0]} />
          <meshStandardMaterial color="#6a7360" roughness={1} flatShading />
        </mesh>
      ))}

      <Sparkles
        count={70}
        scale={[18, 6, 18]}
        position={[0, 3, 0]}
        size={3.4}
        speed={0.3}
        color="#ffd97a"
        opacity={0.65}
      />

      <AimRing aimRef={aimRef} />
      <group ref={layer} />
      <pointLight ref={wishLight} intensity={7} distance={20} decay={2} color="#ffcf7a" />
    </>
  );
}

function SanctuaryCanvasImpl({
  cmdRef,
  aimRef,
  sprouts,
  onSprout,
}: {
  cmdRef: { current: Command[] };
  aimRef: { current: { active: boolean; x: number; z: number } };
  sprouts: Sprout[];
  onSprout: (x: number, z: number) => void;
}) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ fov: 40, near: 0.1, far: 90, position: [0, 6.4, 11] }}>
      <CameraAim />
      <PhysicsWorld cmdRef={cmdRef} aimRef={aimRef} onSprout={onSprout} />
      {sprouts.map((s) => (
        <SproutTree key={s.id} sprout={s} />
      ))}
    </Canvas>
  );
}

function CameraAim() {
  useFrame(({ camera }) => {
    camera.lookAt(0, 1.1, -1.2);
  });
  return null;
}

const SanctuaryCanvas = dynamic(() => Promise.resolve(SanctuaryCanvasImpl), {
  ssr: false,
  loading: () => <div className="anatomy-loading" />,
});

export default function SeedSanctuary() {
  const cmdRef = useRef<Command[]>([]);
  const aimRef = useRef({ active: false, x: 0, z: 0 });
  const drag = useRef({ down: false, sx: 0, sy: 0, dx: 0, dy: 0 });
  const [sprouts, setSprouts] = useState<Sprout[]>([]);
  const [wishes, setWishes] = useState(0);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!drag.current.down) return;
      drag.current.dx = e.clientX - drag.current.sx;
      drag.current.dy = e.clientY - drag.current.sy;

      const power = Math.min(1, Math.max(0, drag.current.dy / 260));
      const vy = 5 + 7 * power;
      const vz = -(6.5 + 6 * power);
      const vx = -drag.current.dx * 0.02;
      const disc = vy * vy + 2 * G * (2.4 - GROUND_Y);
      const t = (vy + Math.sqrt(Math.max(0, disc))) / G;
      let lx = vx * t;
      let lz = 8.4 + vz * t;
      const len = Math.hypot(lx, lz);
      if (len > BOUND - 0.6) {
        lx *= (BOUND - 0.6) / len;
        lz *= (BOUND - 0.6) / len;
      }
      aimRef.current = { active: true, x: lx, z: lz };
    };

    const up = () => {
      if (!drag.current.down) return;
      drag.current.down = false;
      aimRef.current.active = false;

      const power = Math.min(1, Math.max(0.08, drag.current.dy / 260));
      cmdRef.current.push({ type: "launch", dx: drag.current.dx, power });
      setWishes((w) => w + 1);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  const onSprout = (x: number, z: number) => {
    setSprouts((prev) =>
      [
        ...prev,
        {
          id: nextId++,
          x: THREE.MathUtils.clamp(x, -BOUND + 0.5, BOUND - 0.5),
          z: THREE.MathUtils.clamp(z, -BOUND + 0.5, BOUND - 0.5),
          hue: 0.26 + Math.random() * 0.12,
        },
      ].slice(-26),
    );
  };

  return (
    <section id="sanctuary" className="sanctuary">
      <div className="sanctuary-stage">
        <div
          className="sanctuary-canvas"
          onPointerDown={(e) => {
            drag.current.down = true;
            drag.current.sx = e.clientX;
            drag.current.sy = e.clientY;
            drag.current.dx = 0;
            drag.current.dy = 0;
          }}
        >
          <SanctuaryCanvas
            cmdRef={cmdRef}
            aimRef={aimRef}
            sprouts={sprouts}
            onSprout={onSprout}
          />
        </div>

        <header className="anatomy-head">
          <p className="kicker">Creative corner · Physics playground</p>
          <h2>Seed Sanctuary</h2>
          <p className="body">
            Drag upward anywhere and release to toss a glowing wish-seed.
            Wherever it comes to rest, a small tree will grow.
          </p>
        </header>

        <div className="sanctuary-hud">
          <span className="chip">🌱 Wishes: {wishes}</span>
          <span className="chip">🌳 Grove: {sprouts.length}/26</span>
          <button
            type="button"
            className="chip chip-btn"
            onClick={() => {
              cmdRef.current.push({ type: "reset" });
              setSprouts([]);
            }}
          >
            ↺ Reset grove
          </button>
        </div>
      </div>
    </section>
  );
}
