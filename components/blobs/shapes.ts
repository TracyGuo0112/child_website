// Metaball layouts for each gummy blob.
//
// Coordinates are in the MarchingCubes *world* space. drei's <MarchingCube>
// maps a ball at world (x,y,z) to field cell (0.5 + x*0.5, ...), so the usable
// field is world [-1, 1]. We keep balls within ~[-0.7, 0.7] so the surface never
// clips the field boundary. Shape identity comes purely from where the balls sit
// and how strong they are — same material, different topology.

import type { Coloring } from "./palettes";

export type ShapeName = "cloud" | "splat" | "donut" | "star" | "pebble" | "pill";

export type Ball = {
  pos: [number, number, number];
  strength: number;
  subtract: number;
};

// Influence radius of one ball (in normalized field units) is sqrt(strength/SUB).
// Neighbours fuse into a gummy neck when that radius is a healthy fraction of
// their spacing, so strengths below are tuned for overlap, not isolated spheres.
const SUB = 12; // falloff; lower = wider/softer ball

// Even ring of balls in the XY plane, optional center kept empty (donut hole).
function ring(count: number, radius: number, strength: number, phase = 0): Ball[] {
  return Array.from({ length: count }, (_, i) => {
    const a = phase + (i / count) * Math.PI * 2;
    return {
      pos: [Math.cos(a) * radius, Math.sin(a) * radius, 0] as [number, number, number],
      strength,
      subtract: SUB,
    };
  });
}

// Center ball + N arms pointing outward — the puffy star.
function star(points: number, radius: number, armStrength: number, coreStrength: number): Ball[] {
  const core: Ball = { pos: [0, 0, 0], strength: coreStrength, subtract: SUB };
  const arms = Array.from({ length: points }, (_, i) => {
    const a = Math.PI / 2 + (i / points) * Math.PI * 2; // first point straight up
    return {
      pos: [Math.cos(a) * radius, Math.sin(a) * radius, 0] as [number, number, number],
      strength: armStrength,
      subtract: SUB,
    };
  });
  return [core, ...arms];
}

export const SHAPES: Record<ShapeName, Ball[]> = {
  // Rounded fused cloud — big core, soft lobes, a small drip at the bottom.
  cloud: [
    { pos: [0, 0, 0], strength: 1.15, subtract: SUB },
    { pos: [-0.3, 0.12, 0.04], strength: 0.9, subtract: SUB },
    { pos: [0.28, 0.16, -0.04], strength: 0.92, subtract: SUB },
    { pos: [0.07, 0.32, 0.02], strength: 0.8, subtract: SUB },
    { pos: [0.32, -0.09, 0.04], strength: 0.8, subtract: SUB },
    { pos: [-0.14, -0.27, -0.02], strength: 0.7, subtract: SUB },
  ],

  // Irregular splash — a core with droplet arms of mixed sizes.
  splat: [
    { pos: [0, 0, 0], strength: 1.0, subtract: SUB },
    { pos: [-0.18, 0.32, 0.04], strength: 0.85, subtract: SUB },
    { pos: [0.36, 0.1, -0.04], strength: 0.6, subtract: SUB },
    { pos: [-0.3, -0.27, 0.02], strength: 0.8, subtract: SUB },
    { pos: [0.27, -0.32, 0.04], strength: 0.68, subtract: SUB },
    { pos: [0.46, -0.15, 0], strength: 0.42, subtract: SUB },
  ],

  // Ring with an open center — strengths fuse neighbours into a tube while the
  // center (distance 0.38 from every ball) stays below threshold, keeping the hole.
  donut: ring(10, 0.42, 0.62),

  // Five-point puffy star — strong core fuses the arms into points.
  star: star(5, 0.42, 0.82, 1.05),

  // Irregular squished pebble — a few off-size lobes, flatter and lumpier than
  // the cloud. The hero-section floaters are this kind of random rounded blob.
  pebble: [
    { pos: [0, 0, 0], strength: 1.05, subtract: SUB },
    { pos: [-0.26, 0.08, 0.05], strength: 0.85, subtract: SUB },
    { pos: [0.24, 0.14, -0.05], strength: 0.78, subtract: SUB },
    { pos: [0.18, -0.2, 0.03], strength: 0.7, subtract: SUB },
    { pos: [-0.22, -0.16, -0.03], strength: 0.62, subtract: SUB },
  ],

  // Small pill / bean — two lobes side by side, a simple soft capsule.
  pill: [
    { pos: [-0.16, 0, 0], strength: 0.85, subtract: SUB },
    { pos: [0.16, 0.02, 0], strength: 0.85, subtract: SUB },
  ],
};

// Default coloring style per shape. Most shapes flow a gradient ("ramp"); the
// loose hero floaters scatter color as patches ("confetti"). Callers can
// override via the GummyBlob `coloring` prop.
export const SHAPE_COLORING: Record<ShapeName, Coloring> = {
  cloud: "ramp",
  splat: "ramp",
  donut: "ramp",
  star: "ramp",
  pebble: "confetti",
  pill: "confetti",
};
