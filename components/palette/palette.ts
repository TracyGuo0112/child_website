// Color system for the kids-product site: warm-paper background + a family of
// muted "dusty macaron" pastels + soft warm ink. Restraint is the point — every
// pastel is pinned to the same lightness/chroma so the set harmonizes (that's
// what reads as "premium" rather than primary-color clown).
//
// Authored in OKLCH (perceptually even, unlike HSL) and verified with APCA, then
// frozen to the hex below as the app's single source of truth. The OKLCH spec is
// kept in comments so re-tuning stays principled — edit the spec, regenerate,
// don't hand-pick hex. See README.md for the why and the generator spec.

// Backgrounds — sampled from the reference images, not OKLCH-generated.
export const surface = {
  paper: "#F7F1DD", // page background (warm cream)
  raised: "#FDFDF1", // lifted card / sheet surface (cooler ivory, reads "above" the paper)
} as const;

// Soft warm ink — never pure black on a kids site. OKLCH hue ~55-60°, tiny chroma.
//   900 oklch(.30 .020 60) · 700 oklch(.45 .018 55) · 500 oklch(.62 .015 55) · line oklch(.90 .012 60)
export const ink = {
  900: "#362C24", // titles
  700: "#5E534C", // body text (APCA +78 on paper)
  500: "#8E847E", // muted / meta
  line: "#E4DCD6", // hairlines / borders
} as const;

export type PastelName = "blush" | "clay" | "mustard" | "sage" | "sky" | "wisteria";
export type PastelRole = "tint" | "soft" | "mid" | "deep";

// Each hue carries 4 roles at fixed OKLCH L/C, only the hue angle changes:
//   tint oklch(.905 .045 h) — card / section background
//   soft oklch(.85  .060 h) — chip / tag background
//   mid  oklch(.745 .090 h) — illustration / blob fill
//   deep oklch(.50  .085 h) — label text (legible on its own tint/soft)
// Hue angles (OKLCH°): blush 15 · clay 50 · mustard 90 · sage 145 · sky 245 · wisteria 310
export const pastels: Record<PastelName, Record<PastelRole, string>> = {
  blush: { tint: "#FCD4D6", soft: "#F3BEC1", mid: "#DF959A", deep: "#8D4E53" },
  clay: { tint: "#FAD8C6", soft: "#EFC3AB", mid: "#DB9C79", deep: "#8A5435" },
  mustard: { tint: "#EBDFBE", soft: "#DDCDA1", mid: "#C2AA68", deep: "#766122" },
  sage: { tint: "#CEE8CE", soft: "#B6D9B6", mid: "#88BC89", deep: "#427044" },
  sky: { tint: "#C8E4FC", soft: "#AED3F3", mid: "#7BB3E2", deep: "#356890" },
  wisteria: { tint: "#E9D8F7", soft: "#DAC3EC", mid: "#BE9DD7", deep: "#725587" },
} as const;

export const pastelNames = Object.keys(pastels) as PastelName[];
