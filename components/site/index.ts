// Public API for the site chrome — NavBar, Footer, Section, and the shared
// atoms / tokens / nav data. Consumers import from "@/components/site".
//
// NOTE: server components inside this folder (Footer, Section) import atoms /
// accent / nav by PATH, not through this barrel — the barrel re-exports the
// client NavBar, and routing a server file through it would drag it into the
// client bundle.
export { NavBar } from "./NavBar";
export { Footer } from "./Footer";
export { Section } from "./Section";
export { Skyline } from "./Skyline";
export { ShellBlobs } from "./ShellBlobs";
export { SiteBackground } from "./SiteBackground";
export { Wordmark, SolidBtn, LineBtn, cardSurface } from "./atoms";
export { ACCENT } from "./accent";
export { BRAND, NAV } from "./nav";
