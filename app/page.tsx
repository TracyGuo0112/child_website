import { HeroSky } from "./hero/HeroSky";
import { ShellBlobs, Skyline } from "@/components/site";
import { OverviewSection } from "./sections/Overview";
import { ArchitectureSection } from "./sections/Architecture";
import { ParentSection } from "./sections/Parent";
import { ToySection } from "./sections/Toy";
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
          {/* seed rotates each divider's rainbow start hue; flip alternates the
              mirroring — five dividers, no two alike */}
          <Skyline seed={0} />
          <ArchitectureSection />
          <Skyline seed={2} flip />
          <ParentSection />
          <Skyline seed={4} />
          <ToySection />
          <Skyline seed={1} flip />
          <ConstraintsSection />
          <Skyline seed={5} />
          <ProcessSection />
        </div>
      </div>
    </main>
  );
}
