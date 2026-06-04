"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { extend, useFrame, type Object3DNode } from "@react-three/fiber";
import { MarchingCubes as MarchingCubesImpl } from "three-stdlib";
import { SHAPES, SHAPE_COLORING, type ShapeName } from "./shapes";
import { seededSwatches, type ThemeName, type Coloring } from "./palettes";

// Register the raw three-stdlib MarchingCubes as a JSX element. We drive it
// directly (manual addBall in local field space) instead of drei's <MarchingCube>
// wrapper, because that wrapper feeds balls using absolute WORLD position — which
// breaks the moment the mesh is translated for layout. Local field coords let the
// same mesh be positioned/scaled freely in a shared scene.
extend({ MarchingCubesImpl });

declare module "@react-three/fiber" {
  interface ThreeElements {
    marchingCubesImpl: Object3DNode<MarchingCubesImpl, typeof MarchingCubesImpl>;
  }
}

type MotionConfig = {
  // Amplitudes; set any to 0, or pass `false` for the whole config, to disable.
  breathe?: number; // scale pulse (fraction of spread)
  bob?: number; // vertical float (world units)
  wobble?: number; // in-plane sway (radians)
  drift?: number; // per-lobe organic jitter (world units)
  spin?: number; // continuous in-plane rotation (radians/sec) — turns about the
  // field center, so a centred core stays put while outer lobes orbit it
};

const DEFAULT_MOTION: Required<MotionConfig> = {
  breathe: 0.05,
  bob: 0.05,
  wobble: 0.12,
  drift: 0.03,
  spin: 0,
};

export type GummyBlobProps = {
  shape: ShapeName;
  theme?: ThemeName;
  seed?: number;
  coloring?: Coloring;
  // Layout transform within a shared canvas.
  position?: [number, number, number];
  scale?: number;
  spread?: number;
  speed?: number;
  // Surface detail. Lower for tiny/background blobs, higher for hero close-ups.
  resolution?: number;
  maxPolyCount?: number;
  // Override any MeshPhysicalMaterial params; merged over the gummy defaults.
  // Pass nothing to share one default material instance across all blobs.
  material?: Partial<THREE.MeshPhysicalMaterialParameters>;
  // Animation amplitudes, or `false` for a static blob.
  motion?: MotionConfig | false;
};

function rampColor(ramp: string[], t: number): THREE.Color {
  const x = THREE.MathUtils.clamp(t, 0, 1) * (ramp.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = new THREE.Color(ramp[i]);
  const b = new THREE.Color(ramp[Math.min(i + 1, ramp.length - 1)]);
  return a.lerp(b, f);
}

function confettiColor(swatches: string[], index: number): THREE.Color {
  const h = (index * 2654435761) >>> 0;
  return new THREE.Color(swatches[h % swatches.length]);
}

// Default gummy look. Shared as a single instance when a blob doesn't override
// material params (saves memory); overrides get their own instance.
const GUMMY_DEFAULTS: THREE.MeshPhysicalMaterialParameters = {
  vertexColors: true,
  roughness: 0.28,
  metalness: 0,
  transmission: 0.22,
  thickness: 0.6,
  ior: 1.4,
  iridescence: 0.4,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [120, 400],
  clearcoat: 0.5,
  clearcoatRoughness: 0.35,
  envMapIntensity: 1.1,
  attenuationColor: new THREE.Color("#fff2fb"),
  attenuationDistance: 6,
  sheen: 0.5,
  sheenRoughness: 0.4,
  sheenColor: new THREE.Color("#ffffff"),
};

const SHARED_MATERIAL = new THREE.MeshPhysicalMaterial(GUMMY_DEFAULTS);

export default function GummyBlob({
  shape,
  theme = "reference",
  seed = 0,
  coloring,
  position = [0, 0, 0],
  scale = 1,
  spread = 0.95,
  speed = 1,
  resolution = 72,
  maxPolyCount = 20000,
  material,
  motion,
}: GummyBlobProps) {
  const balls = SHAPES[shape];
  const meshRef = useRef<MarchingCubesImpl>(null);

  // Own material instance only when overridden; otherwise share the default.
  const mat = useMemo(
    () => (material ? new THREE.MeshPhysicalMaterial({ ...GUMMY_DEFAULTS, ...material }) : SHARED_MATERIAL),
    [material],
  );

  const m = motion === false ? null : { ...DEFAULT_MOTION, ...motion };

  // The mesh is created once via JSX args; reused across frames.
  const args = useMemo<[number, THREE.Material, boolean, boolean, number]>(
    () => [resolution, mat, false, true, maxPolyCount],
    [resolution, mat, maxPolyCount],
  );

  const phases = useMemo(
    () => balls.map((_, i) => ({ p: i * 1.7, q: i * 2.3 + 0.5, r: i * 0.9 + 1.1 })),
    [balls],
  );

  const colors = useMemo(() => {
    const swatches = seededSwatches(theme, seed);
    const style = coloring ?? SHAPE_COLORING[shape];
    if (style === "confetti") {
      return balls.map((_, i) => confettiColor(swatches, i));
    }
    const ys = balls.map((b) => b.pos[1]);
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const span = max - min || 1;
    return balls.map((b) => rampColor(swatches, (b.pos[1] - min) / span));
  }, [balls, shape, theme, seed, coloring]);

  useFrame((state) => {
    const mc = meshRef.current;
    if (!mc) return;
    const t = state.clock.elapsedTime * speed;
    const bob = m ? Math.sin(t * 0.9) * m.bob : 0;
    // sway (oscillating) + spin (continuous) share one rotation about the center
    const ang = m ? Math.sin(t * 0.6) * m.wobble + t * m.spin : 0;
    const cos = Math.cos(ang);
    const sin = Math.sin(ang);
    // Whole-body breathing as a spread pulse (cannot scale the field directly).
    const breathe = m ? spread * (1 + Math.sin(t * 0.75) * m.breathe) : spread;

    mc.reset();
    for (let i = 0; i < balls.length; i++) {
      const [x, y, z] = balls[i].pos;
      const sx = x * breathe;
      const sy = y * breathe;
      const rx = sx * cos - sy * sin;
      const ry = sx * sin + sy * cos;
      let dx = 0,
        dy = 0,
        dz = 0;
      if (m) {
        const ph = phases[i];
        dx = Math.sin(t * 1.1 + ph.p) * m.drift;
        dy = Math.cos(t * 0.9 + ph.q) * m.drift;
        dz = Math.sin(t * 1.3 + ph.r) * (m.drift * 0.83);
      }
      // Field coord: 0.5 + p*0.5 maps [-1,1] -> [0,1].
      const px = rx + dx;
      const py = ry + bob + dy;
      const pz = z * breathe + dz;
      mc.addBall(
        0.5 + px * 0.5,
        0.5 + py * 0.5,
        0.5 + pz * 0.5,
        balls[i].strength,
        balls[i].subtract,
        colors[i],
      );
    }
    mc.update();
  });

  return (
    <marchingCubesImpl
      ref={meshRef}
      args={args}
      position={position}
      scale={scale}
      material={mat}
    />
  );
}
