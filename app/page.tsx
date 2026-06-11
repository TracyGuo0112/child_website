import { HeroSky } from "./hero/HeroSky";
import { ShellBlobs } from "@/components/site";
import { OverviewSection } from "./sections/Overview";
import { ArchitectureSection } from "./sections/Architecture";
import { ParentSection } from "./sections/Parent";
import { ToySection } from "./sections/Toy";
import { IntegrationSection } from "./sections/Integration";
import { ConstraintsSection } from "./sections/Constraints";
import { ProcessSection } from "./sections/Process";

// Single-page site mirroring《喜马拉雅儿童内容接入方案（对外版）》: hero, then the
// proposal chapters as anchored sections the sticky nav scroll-positions into.
// One shared ShellBlobs backdrop spans the whole content run — never one WebGL
// context per section.
export default function Home() {
  return (
    <main>
      <HeroSky />
      <div className="relative overflow-hidden">
        <ShellBlobs />
        <div className="relative z-10 pb-8">
          <OverviewSection />
          <ArchitectureSection />
          <ParentSection />
          <ToySection />
          <IntegrationSection />
          <ConstraintsSection />
          <ProcessSection />
        </div>
      </div>
    </main>
  );
}
