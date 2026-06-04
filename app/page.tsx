import { HeroSky } from "./hero/HeroSky";

// Home is intentionally minimal: just the full-bleed sky hero. NavBar and the
// closing-CTA Footer come from the root layout; detail content lives on the
// dedicated routes (/scenarios, /capabilities, …). HeroBookSpread / HeroGlassWide
// remain in app/hero/ as backups.
export default function Home() {
  return <HeroSky />;
}
