// Color themes for the gummy blobs — independent of shape topology (which lives
// in shapes.ts). A theme is just a list of vivid swatches. GummyBlob turns a
// theme into per-ball colors in one of two ways:
//   - "ramp": sort swatches into a bottom->top gradient (smooth flowing color)
//   - "confetti": scatter swatches as random patches (loose multicolor look)
// A `seed` rotates/shuffles the swatch order, so the same shape + theme yields
// several distinct variants without new color data.

export type ThemeName =
  | "reference"
  | "sunset"
  | "ocean"
  | "candy"
  | "candyHarmony"
  | "aurora"
  | "bubblegum";

export type Coloring = "ramp" | "confetti";

// Swatches are listed in a pleasing low->high order; the ramp uses them as-is,
// confetti ignores order. Keep them bright/high-key — the look is soft-lit neon.
export const THEMES: Record<ThemeName, string[]> = {
  // the original UG Labs reference: hot pink -> coral/amber -> mint -> violet
  reference: ["#ff3f9a", "#ff6b6b", "#ff9a52", "#9fe06a", "#5fd39a", "#b07cf0"],
  // warm dusk: magenta -> coral -> orange -> gold
  sunset: ["#ff478f", "#ff5f6b", "#ff7a45", "#ff9e3d", "#ffc857", "#ffe08a"],
  // cool water: violet -> indigo -> blue -> cyan -> teal
  ocean: ["#7c5cff", "#5c7bff", "#4aa3ff", "#37c9e0", "#3fe0c4", "#9be8d8"],
  // bright candy rainbow, full spectrum
  candy: ["#ff4fa0", "#ff8a3d", "#ffd24d", "#7fe0a0", "#4ac9e0", "#b070f0"],
  // harmonized candy: same rainbow order as `candy`, but one unified saturation/
  // value so neighbouring swatches transition smoothly — keeps the full spectrum
  // while letting the hero star read as cohesive against the rainbow ribbon bg.
  candyHarmony: ["#ff5fa8", "#ff9a5c", "#ffd95c", "#82e0b0", "#5ccfe6", "#b87cf0"],
  // aurora: green -> teal -> violet -> magenta, luminous
  aurora: ["#5fe39a", "#3fd9c4", "#5cb0ff", "#9b7bff", "#d96bf0", "#ff6bc4"],
  // soft pinks and lilacs
  bubblegum: ["#ff8fd0", "#ff6bb0", "#ff90c8", "#c89bf0", "#a0c4ff", "#ffc2e8"],
};

// Deterministic order for a given seed: rotate the swatch list and optionally
// reverse, so seeds 0..n produce visibly different arrangements from one theme.
export function seededSwatches(theme: ThemeName, seed: number): string[] {
  const base = THEMES[theme];
  const n = base.length;
  const rot = ((seed % n) + n) % n;
  const rotated = [...base.slice(rot), ...base.slice(0, rot)];
  // Odd seeds flip direction for extra variation.
  return seed % 2 === 1 ? rotated.reverse() : rotated;
}
