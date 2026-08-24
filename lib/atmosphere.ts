import * as THREE from "three";

interface Stop {
  t: number;
  color: string;
  density: number;
  light: string;
  intensity: number;
}

const STOPS: Stop[] = [
  { t: 0.0, color: "#0b2418", density: 0.03, light: "#cfe8d2", intensity: 1.1 },
  { t: 0.34, color: "#12351f", density: 0.02, light: "#e9ffd9", intensity: 1.25 },
  { t: 0.62, color: "#0d3034", density: 0.018, light: "#bfffe9", intensity: 1.1 },
  { t: 1.0, color: "#57300f", density: 0.026, light: "#ffb45e", intensity: 1.5 },
];

const colors = STOPS.map((s) => ({
  ...s,
  c: new THREE.Color(s.color),
  l: new THREE.Color(s.light),
}));

export interface AtmosphereSample {
  fogColor: THREE.Color;
  density: number;
  lightColor: THREE.Color;
  intensity: number;
}

const scratch: AtmosphereSample = {
  fogColor: new THREE.Color(),
  density: 0,
  lightColor: new THREE.Color(),
  intensity: 1,
};

export function sampleAtmosphere(t: number): AtmosphereSample {
  const p = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < STOPS.length - 2 && p > STOPS[i + 1].t) i++;
  const a = colors[i];
  const b = colors[i + 1];
  const span = b.t - a.t || 1;
  const f = Math.min(1, Math.max(0, (p - a.t) / span));
  scratch.fogColor.lerpColors(a.c, b.c, f);
  scratch.lightColor.lerpColors(a.l, b.l, f);
  scratch.density = a.density + (b.density - a.density) * f;
  scratch.intensity = a.intensity + (b.intensity - a.intensity) * f;
  return scratch;
}
