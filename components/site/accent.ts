// Brand accent — single knob for every CTA / highlight. Coral-red ramp anchored
// to the mascot icon's signature red (its 喇叭/"听" badge is ~#F4452D, the most
// recognisable brand mark). `deep` #EE5A2A is that red nudged toward orange so
// large white-on-fill text clears ~3.4:1 (AA large). The whole tint→deep ramp is
// unified to one hue (H≈15°), varying only saturation/lightness, so the pale
// wash backgrounds and the solid fill stay in the same colour family.
export const ACCENT = {
  tint: "#F9E3DC",
  soft: "#F0A289",
  mid: "#EF6D43",
  deep: "#EE5A2A",
} as const;
