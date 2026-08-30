---
name: StockLens — Soundings
description: A stock dashboard for first-year investors: every holding classified by how far it moved today, against a volatility threshold you set.
colors:
  paper: "oklch(0.955 0.014 85)"
  paper-raised: "oklch(0.976 0.009 85)"
  paper-sunk: "oklch(0.918 0.017 85)"
  shoal-1: "oklch(0.921 0.021 226)"
  shoal-2: "oklch(0.856 0.041 229)"
  shoal-3: "oklch(0.757 0.062 232)"
  shoal-4: "oklch(0.646 0.079 234)"
  ink: "oklch(0.216 0.014 220)"
  ink-2: "oklch(0.451 0.023 222)"
  ink-3: "oklch(0.532 0.026 224)"
  water: "oklch(0.436 0.079 233)"
  land: "oklch(0.895 0.048 86)"
  caution: "oklch(0.532 0.204 350)"
  rising: "oklch(0.472 0.093 158)"
  falling: "oklch(0.483 0.146 34)"
  rule: "oklch(0.216 0.014 220 / 0.22)"
  rule-strong: "oklch(0.216 0.014 220 / 0.46)"
  # Flat hex handed to the TradingView embeds, which cannot take oklch.
  # Kept in sync by hand with the tokens above; see lib/constants.tsx.
  plate-day-bg: "#faf6ec"
  plate-day-grid: "#e2dccd"
  plate-night-bg: "#1a2530"
  plate-night-grid: "#2b3a48"
  plate-water: "#2e6e8e"
  plate-rising: "#2c6b52"
  plate-falling: "#9c4526"
  plate-caution: "#c42b7b"
  plate-scale: "#5b6b72"
typography:
  display:
    fontFamily: "Libre Caslon Display, Georgia, serif"
    fontSize: "clamp(2rem, 6.5vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "0.02em"
  station:
    fontFamily: "Libre Caslon Display, Georgia, serif"
    fontSize: "clamp(3.5rem, 13vw, 9rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "0.06em"
  body:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  afloat:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  apparatus:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.16em"
  apparatus-lg:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.13em"
  sounding:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  # The full ramp the build uses, smallest to largest. Every literal size in
  # the source is one of these; a new size means extending the ramp here
  # first, not inventing one at the call site.
  tag:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.5625rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.16em"
  keycap:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  control:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.13em"
  caption:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  field:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  reading:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  value:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  wordmark:
    fontFamily: "Libre Caslon Display, Georgia, serif"
    fontSize: "1.6rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.18em"
  quote:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "clamp(1.375rem, 2.3vw, 1.875rem)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "normal"
  title-section:
    fontFamily: "Libre Caslon Display, Georgia, serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
  title-page:
    fontFamily: "Libre Caslon Display, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "0.02em"
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "56px"
components:
  detent:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.apparatus}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  detent-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  detent-filled:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  detent-caution:
    backgroundColor: "transparent"
    textColor: "{colors.caution}"
    rounded: "{rounded.none}"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 2px"
  plate:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px"
  overprint:
    backgroundColor: "oklch(0.532 0.204 350 / 0.09)"
    textColor: "{colors.caution}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
---

# StockLens — Soundings

## Overview

StockLens is drawn as an **Admiralty hydrographic chart**: the document a
navigator with limited experience uses to cross dangerous water without
running aground. That is the same job a first-year investor has, so the chart
is not decoration — it is the information model. Depth is volatility. A
watchlist is a plotted course. Magenta is danger, and only danger.

The world exists to refuse the category default. Every stock dashboard ships
near-black with neon green/red deltas and glassy rounded cards; this one is a
light, ruled, engraved paper object with **no rounded corners anywhere** and
**no cards at all**. If a new surface starts to look like a grid of shadowed
tiles, it has left the system.

Two lighting conditions, not two themes: **Day** (`:root`) and **Night light**
(`.dark`), the latter named for the low red-lit chart table that preserves a
navigator's dark adaptation. The same physical sheet, differently lit.

**The vocabulary rule.** The visual system is chart-derived; the **UI copy is
not**. Every user-facing string uses plain financial language — *volatility
threshold*, *Stable / Drifting / Active / Volatile*, *watchlist*, *panel*,
*instrument*, *updated*. The nautical vocabulary survives only where users
never read it: CSS custom properties (`--shoal-*`), component names
(`DepthField`, `DepthRail`), and source comments, where it keeps the system's
origin legible to whoever edits it next. Do not reintroduce metaphor into
labels, headings, empty states, toasts, `alt` text, or `aria-label`s: a
first-year investor should never have to decode a figure of speech to read
their own position.

## Colors

**Strategy: full palette, four named roles.** Colour commits at page scale —
depth tints own whole regions and the ground itself is a tint. Accents
scattered over a neutral field are not this system.

| Role | Tokens | Meaning |
| --- | --- | --- |
| Ground | `paper`, `paper-raised`, `paper-sunk` | The chart sheet. Warm bone stock, not white and not cream-as-fashion. |
| Depth | `shoal-1` → `shoal-4` | Water. On a real chart **deeper blue means shallower, more dangerous water** — that inversion is deliberate and load-bearing. |
| Land | `land` | Everything fixed and dry. Currently the sheet's footer imprint. |
| Caution | `caution` | **Reserved.** Magenta appears only for hazard, notice, error, and the current selection. Never decorative. |

Ink is tinted, never gray: `ink` / `ink-2` / `ink-3` all carry hue 220–224, so
secondary text sits in the same family as the ground rather than going flat.
`water` (hue 233) is the hydrographic ink used for symbols and anything afloat.

**Direction is never hue alone.** `rising` and `falling` always ship paired
with a sign and a drawn bearing mark (filled triangle up, hollow triangle
down, bar for flat) — see `components/chart/Apparatus.tsx`. A colourblind
reader and a monochrome printout both survive.

## Typography

Four families, one per lettering register, mirroring how a chart actually
letters itself:

- **Libre Caslon Display** — engraved titles and place names. Caslon is the
  historically correct face for English admiralty printing.
- **Libre Caslon Text**, *italic* — the **hydrographic rule**: on a chart,
  anything afloat or submerged is lettered in italic; anything fixed and dry
  is upright. In the build, italic carries glosses, captions, readings, and
  explanatory prose. Use `.afloat`.
- **Archivo** — the apparatus: pearl-scale caps at `0.16em` tracking for
  legend labels, nav, and controls. Use `.apparatus` / `.apparatus-lg`.
- **Azeret Mono** — soundings. Every figure on the sheet, always tabular and
  lining. Applied by the `data-figure` attribute or `.figure`, which sets
  `font-variant-numeric: tabular-nums lining-nums` globally.

**Hierarchy comes from scale contrast alone** — pearl caps against large
figures — never from a box, badge, or border. Body measure is capped at
`46–62ch` via `max-w-[Nch]`.

## Layout

`.chart-block` is the container: `max-width: 96rem`, padding `1.25rem` →
`2.5rem` (768px) → `3.5rem` (1280px).

The recurring page shape is **rail + field**: a `lg:w-60` sticky aside
carrying the Depth Rail and the legend, beside a `min-w-0 flex-1` main
column. Below `lg` the rail stacks above the content and its detents run
horizontally.

Grids are deliberately **unequal** — the dashboard runs `xl:grid-cols-3` with
the heatmap taking `col-span-2`. Equal-width tiles are the pattern this
system exists to avoid. More space above a heading than below it.

## Elevation & Depth

**The system is flat and tonal.** Depth is communicated by tint band and
hairline rule, not by shadow. There are exactly two shadows in the build, both
for genuinely floating layers: the command palette
(`0 24px 60px -24px`) and the auth page's mounted plate (`0 28px 70px -32px`).
Both carry a real offset and a soft blur; a zero-offset colored halo is not
part of this system.

Layering instead uses: `paper-sunk` (below) → `paper` (ground) →
`paper-raised` (above), plus `backdrop-blur-[2px]` on plates so the live
depth field reads through them.

**The atmospheric ground is a real drawing, not an image.**
`components/chart/DepthField.tsx` renders a seeded 3-octave value-noise
seabed to canvas: the tint plate is quantised into flat depth bands and
upscaled soft, then isobaths are cut over it at one device pixel by marching
squares, then sounding figures are dropped at staggered survey points. It
drifts at 10fps, re-reads its palette on theme change, and goes static under
`prefers-reduced-motion`.

## Shapes

**`border-radius: 0` is enforced globally** in `@layer base` with
`!important` on `*`. This is the system's single most identifying rule. Do not
add rounded corners to new components; a rounded element is off-system by
definition here.

- Every rule is **one device pixel**: `rule` (0.22 alpha) for internal
  divisions, `rule-strong` (0.46) for structural boundaries.
- `.neatline` draws a chart's double border as nested inset shadows.
- `.graticule` is the ruled measurement grid over the depth field. It is a
  measurement surface, which is the one context a grid-line background is
  legitimate — do not reuse it as page decoration.
- `.tooth` overlays fibrous paper noise (`feTurbulence`, 4.5% multiply; 3.5%
  screen at night).
- Marks are **drawn SVG at a consistent 1.1–1.4 stroke**: compass rose,
  bearing triangles, dividers, survey station, strike, caret. No icon font, no
  emoji, no glyph substitutes.

## Components

**Detent** (`.detent`) — the only button. States are printed marks, not colour
swaps: hairline box at rest, filled on hover, `water` on press, and
**struck through with `line-through` when disabled**. `.detent-filled` for
primary, `.detent-caution` for destructive.

**Field** (`.field`) — inputs are printed blanks: transparent, ruled on the
bottom edge only, focus moves that rule to `caution`. No box, no fill.

**Plate** — the panel primitive (`Plate` in `Apparatus.tsx`, and the
`TradingViewWidget` wrapper): `border-rule-strong`, `paper-raised/70`,
`backdrop-blur-[2px]`, and a ruled title band carrying apparatus caps with an
optional plate index (I, II, III). This replaces the card.

**Gloss** (`Apparatus.tsx`) — the beginner's apparatus, and a product
requirement rather than an ornament: any term a first-year investor may not
know is wrapped in a dotted-underline trigger with a drawn magenta asterisk,
and its note brackets out on **both hover and keyboard focus**. Every jargon
column heading in `WatchlistTable` uses it.

**Depth Rail + Legend** (`components/chart/DepthRail.tsx`) — the system's one
control, a `radiogroup` of six discrete stops with full arrow/Home/End
support. It sets a **real, stated threshold** (a percent daily move), never a
decorative unit, and one change re-solves the watchlist banding and the depth
field together.

**Notice** (`.overprint`, `NoticeToInvestors`) — magenta hazard overprint.
It reports only what is computable from data on screen; it must never claim a
personalisation the product cannot prove.

**Survey table** (`.watchlist-table`, `.table-*`) — ruled rows, no zebra fill,
figures right-aligned and tabular, a depth-band swatch in the left gutter so
the eye lands on shallow water first. Row actions stay at `opacity-0` until
hover or keyboard focus.

**Browser surfaces are themed**: selection, caret, scrollbar track and thumb,
focus ring (`1.5px solid caution`, `2px` offset), and underline offset all
come from the palette rather than the browser defaults.

## Do's and Don'ts

**Do**

- Commit colour at region scale; let a depth tint own a whole area.
- Reserve magenta strictly for caution, notice, error, and current selection.
- Set every number with `data-figure` so columns compare down the page.
- Pair direction colour with a sign and a drawn mark, always.
- Letter anything afloat or explanatory in Caslon italic; keep fixed labels
  upright in Archivo caps.
- Gloss any term a first-year investor might not know, in place.
- State only what is true. Prefer a computed fact over a claim.
- Name things in plain financial language. The chart is the look, not the vocabulary.

**Don't**

- Add a border radius. Anywhere.
- Introduce a card — a rounded, shadowed, equal-width tile with icon + heading
  + text. Use a Plate.
- Use gray for secondary text; tint it from the ground's hue instead.
- Use a decorative grid background outside the graticule's measurement role.
- Let hue alone carry rise or fall.
- Reach for glyphs or emoji where a drawn mark belongs.
- Invent personalisation, testimonials, counts, or proof. The signup intake
  feeds the email pipeline, not the on-screen copy.
- Let the nautical source leak into UI copy. `--shoal-2` is a token name; a
  heading that says "shoaling" is a defect.
