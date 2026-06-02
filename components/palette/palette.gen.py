#!/usr/bin/env python3
"""Dev-time generator for palette.ts. Authors colors in OKLCH, verifies contrast
in APCA, prints the hex table to paste into palette.ts. Run: python3 palette.gen.py

This is the source of truth for the *derivation* — to re-tune, edit the specs
below and regenerate; don't hand-pick hex in palette.ts."""
import math

# ---- OKLCH -> sRGB hex, with chroma reduced until it fits the sRGB gamut ----
def _lin(L, a, b):
    l_ = L + 0.3963377774*a + 0.2158037573*b
    m_ = L - 0.1055613458*a - 0.0638541728*b
    s_ = L - 0.0894841775*a - 1.2914855480*b
    l, m, s = l_**3, m_**3, s_**3
    return (4.0767416621*l - 3.3077115913*m + 0.2309699292*s,
            -1.2684380046*l + 2.6097574011*m - 0.3413193965*s,
            -0.0041960863*l - 0.7034186147*m + 1.7076147010*s)

def _gamma(c):
    c = max(0.0, c)
    return 1.055*c**(1/2.4) - 0.055 if c > 0.0031308 else 12.92*c

def _in_gamut(L, C, h):
    r = math.radians(h)
    return all(-1e-4 <= v <= 1 + 1e-4 for v in _lin(L, C*math.cos(r), C*math.sin(r)))

def oklch(L, C, h):
    if not _in_gamut(L, C, h):
        lo, hi = 0.0, C
        for _ in range(24):
            mid = (lo + hi) / 2
            lo, hi = (mid, hi) if _in_gamut(L, mid, h) else (lo, mid)
        C = lo
    r = math.radians(h)
    rgb = _lin(L, C*math.cos(r), C*math.sin(r))
    return "#%02X%02X%02X" % tuple(round(max(0, min(1, _gamma(v)))*255) for v in rgb)

# ---- APCA (APCA-W3 0.1.9) ----
def _Y(hx):
    r, g, b = [int(hx[i:i+2], 16)/255 for i in (1, 3, 5)]
    return 0.2126729*r**2.4 + 0.7151522*g**2.4 + 0.0721750*b**2.4

def apca(text_hex, bg_hex):
    Yt, Yb = _Y(text_hex), _Y(bg_hex)
    clamp = lambda y: y + (0.022 - y)**1.414 if y < 0.022 else y
    Yt, Yb = clamp(Yt), clamp(Yb)
    if abs(Yb - Yt) < 0.0005:
        return 0.0
    if Yb > Yt:
        s = (Yb**0.56 - Yt**0.57) * 1.14
        out = 0.0 if s < 0.1 else s - 0.027
    else:
        s = (Yb**0.65 - Yt**0.62) * 1.14
        out = 0.0 if s > -0.1 else s + 0.027
    return round(out * 100, 1)

assert round(apca("#000000", "#FFFFFF")) == 106  # algorithm self-check

# ---- specs (keep in sync with palette.ts) ----
PAPER, SURFACE = "#F7F1DD", "#FDFDF1"  # sampled from reference images, not generated
INK = {"900": oklch(.30, .020, 60), "700": oklch(.45, .018, 55),
       "500": oklch(.62, .015, 55), "line": oklch(.90, .012, 60)}
# role -> (L, C); hue angle per pastel below. Same L/C across hues = harmony.
ROLES = {"tint": (.905, .045), "soft": (.85, .060), "mid": (.745, .090), "deep": (.50, .085)}
HUES = {"blush": 15, "clay": 50, "mustard": 90, "sage": 145, "sky": 245, "wisteria": 310}

if __name__ == "__main__":
    print(f"paper {PAPER} · raised {SURFACE}")
    print("ink", {k: v for k, v in INK.items()})
    for name, h in HUES.items():
        row = {r: oklch(L, C, h) for r, (L, C) in ROLES.items()}
        print(f"{name:<9}", row)
    print(f"\nAPCA  ink.700/paper {apca(INK['700'], PAPER):+.0f}"
          f" · blush.deep/blush.soft {apca(oklch(.50,.085,15), oklch(.85,.060,15)):+.0f}")
