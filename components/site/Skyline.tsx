// Section divider: two tapered jelly-rainbow ribbons weaving high→low→high /
// low→high→low. They swap vertical position twice and only touch near the
// crossings, so sky shows through between them everywhere else. Blur is kept
// moderate — heavier blur would bleed across the gap and re-merge them into
// one mass.
//
// Hues form a closed wheel (each neighbour pair, including wisteria→blush,
// interpolates cleanly in sRGB). Palette sage/mustard are deliberately absent —
// sage is too grey for a backlit ribbon, and a direct yellow→blue stop pair
// interpolates through grey-green, so butter→aqua bridges that zone instead.
const HUES = [
  "243,190,193", // blush
  "239,195,171", // clay
  "242,226,166", // butter
  "169,221,227", // aqua
  "174,211,243", // sky
  "218,195,236", // wisteria
];

// "Random" color distribution = rotating the wheel by `seed`. A real shuffle
// could land non-neighbour hues side by side and reintroduce the mud; rotation
// varies every divider while keeping all transitions adjacent on the wheel.
function sweep(seed: number, reverse: boolean): string[] {
  const seq = HUES.map((_, i) => HUES[(seed + i) % HUES.length]);
  return reverse ? seq.reverse() : seq;
}

function Stops({ colors }: { colors: string[] }) {
  return (
    <>
      {colors.map((c, i) => {
        const edge = i === 0 || i === colors.length - 1;
        return <stop key={i} offset={`${(i * 100) / (colors.length - 1)}%`} stopColor={`rgba(${c},${edge ? 0.85 : 0.82})`} />;
      })}
    </>
  );
}

// `seed` rotates the rainbow so consecutive dividers start on different hues;
// `flip` mirrors the artwork horizontally. Vary both down the page so no two
// dividers repeat. Gradient ids embed the seed — SVG ids are document-global,
// and duplicate ids would make every instance sample the first one's colors.
export function Skyline({ seed = 0, flip = false }: { seed?: number; flip?: boolean }) {
  const idA = `jelly-a-${seed}`;
  const idB = `jelly-b-${seed}`;
  return (
    <div aria-hidden className="relative h-24 sm:h-32">
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-1/2 h-20 w-full -translate-y-1/2"
        style={flip ? { transform: "translateY(-50%) scaleX(-1)" } : undefined}
      >
        <defs>
          {/* strand B runs the sweep reversed, so at each crossing two distant
              hues meet instead of near-neighbours */}
          <linearGradient id={idA} x1="0" y1="0" x2="1" y2="0">
            <Stops colors={sweep(seed, false)} />
          </linearGradient>
          <linearGradient id={idB} x1="0" y1="0" x2="1" y2="0">
            <Stops colors={sweep(seed, true)} />
          </linearGradient>
        </defs>
        <path
          d="M0,17 C260,11 460,33 720,40 C980,47 1220,15 1440,15 L1440,28 C1220,30 980,60 720,53 C460,46 260,19 0,23 Z"
          fill={`url(#${idA})`}
          style={{ filter: "blur(8px)" }}
        />
        <path
          d="M0,40 C280,35 500,11 740,11 C1000,11 1240,31 1440,33 L1440,46 C1240,44 1000,24 740,24 C500,24 280,48 0,48 Z"
          fill={`url(#${idB})`}
          style={{ filter: "blur(8px)" }}
        />
      </svg>
    </div>
  );
}
