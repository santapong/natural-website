import * as THREE from "three";

interface Stop {
  t: number;
  color: string;
  density: number;
  light: string;
  intensity: number;
}

const STOPS: Stop[] = [
  // forest floor
  { t: 0.0, color: "#0b2418", density: 0.03, light: "#cfe8d2", intensity: 1.1 },
  // canopy
  { t: 0.14, color: "#12351f", density: 0.02, light: "#e9ffd9", intensity: 1.25 },
  // mirror lake
  { t: 0.29, color: "#0d3034", density: 0.018, light: "#bfffe9", intensity: 1.15 },
  // waterfall mist
  { t: 0.43, color: "#2c474c", density: 0.032, light: "#dff5f2", intensity: 1.25 },
  // fjord
  { t: 0.57, color: "#14262e", density: 0.02, light: "#a9ccd6", intensity: 1.05 },
  // tundra
  { t: 0.71, color: "#26333e", density: 0.012, light: "#dbe9f5", intensity: 1.3 },
  // desert approach
  { t: 0.86, color: "#4a2f12", density: 0.016, light: "#ffc27a", intensity: 1.45 },
  // golden sand finale
  { t: 1.0, color: "#6b3410", density: 0.02, light: "#ff9a45", intensity: 1.6 },
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
