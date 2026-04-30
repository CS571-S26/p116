# Hero Signal Trace — Design Spec

## Goal

Add an animated ambient SVG signal trace to the Home hero background that reads as sound/signal language — editorial and distinctive — without overriding the typography.

## Constraints

- No new libraries (CSS animations only — no Framer Motion for this element)
- `prefers-reduced-motion` must disable all animation
- The trace must be `aria-hidden="true"` — purely decorative
- The trace must not compete with the headline or CTA area
- The site should still fundamentally feel black/charcoal/red; the trace adds texture, not a new color

---

## Component

**`src/components/HeroTrace.jsx`** — new component, used only in `src/pages/Home.jsx`.  
**`src/components/HeroTrace.css`** — keyframe animations and SVG styles.

`Home.jsx` imports `HeroTrace` and places it as the first child of `<section className="home__hero">`, before the motion div that contains the hero text.

---

## SVG Design

### Geometry

- `viewBox="0 0 1000 320"`, `preserveAspectRatio="none"`, `width="100%"`, `height="100%"`
- `position: absolute; inset: 0; z-index: 0`
- `aria-hidden="true"`, `focusable="false"`
- `pointer-events: none`

### Path character

**2–3 broad, sweeping arcs.** Not a tight repeating sine wave — each arc is wide, the peaks and troughs are separated by long horizontal stretches that feel like signal settling before the next event. The overall impression is an EKG-style editorial line, not a frequency display.

Path sits in the **lower 55–65% of the hero vertically** (y = 170–300 of a 320px viewBox). This keeps it below the mims-tag and h1, which occupy the upper portion of the hero.

Example path geometry (final path tuned during implementation):
```
M0,230 C120,230 160,160 240,160 C320,160 360,290 460,290 C560,290 600,175 700,175 C800,175 840,250 960,250 C1000,250 1010,240 1040,240
```
Characteristics: starts near y=230, sweeps up to y=160 (a broad crest), drops to y=290 (a broad trough), recovers to y=175, then settles near y=250. Exactly 3 arc events. The long C-curve handles ensure the transitions are smooth and gradual, not sharp.

### Two path layers

1. **Base trace**: `stroke="rgba(204,0,0,1)"`, `strokeWidth="1.5"`, opacity controlled by CSS (`0.10` → `0.18` pulsing). Always visible. The structural line.

2. **Sweep node**: same `d` attribute. `strokeDasharray="60 10000"` (60px bright segment, massive gap). `strokeDashoffset` animated via CSS. `filter: drop-shadow(0 0 6px rgba(204,0,0,1)) drop-shadow(0 0 16px rgba(204,0,0,0.4))`. This is the moving element that reads as an active signal.

### Left-edge gradient mask

SVG `<defs>` defines a `<linearGradient id="trace-fade" x1="0" x2="1" y1="0" y2="0">`:
- stop at `0%`: `stop-opacity: 0`
- stop at `40%`: `stop-opacity: 1`
- stop at `100%`: `stop-opacity: 1`

A `<mask id="trace-mask">` contains a `<rect width="100%" height="100%" fill="url(#trace-fade)"/>`.

Both paths are wrapped in `<g mask="url(#trace-mask)">`. The trace is invisible over the text area on the left, materializing at ~40% width. The sweep node appears to emerge as it crosses the threshold.

---

## Animation

### CSS keyframes (in HeroTrace.css)

```css
@keyframes hero-trace-pulse {
  0%, 100% { opacity: 0.10; }
  50%       { opacity: 0.18; }
}

@keyframes hero-trace-sweep {
  from { stroke-dashoffset: 60; }
  to   { stroke-dashoffset: -1100; }
}
```

### Applied

| Element | Class | Animation |
|---|---|---|
| Base trace path | `.hero-trace__base` | `hero-trace-pulse 10s ease-in-out infinite` |
| Sweep node path | `.hero-trace__sweep` | `hero-trace-sweep 8s linear infinite` |

The sweep offset range (`60` to `-1100`) is calibrated to the path length at viewBox scale (~1040px wide with curves ≈ 1100–1200px path length). Final value confirmed during implementation by measuring the path's actual `getTotalLength()`.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .hero-trace__base  { animation: none; opacity: 0.10; }
  .hero-trace__sweep { animation: none; opacity: 0; }
}
```

The base trace stays visible statically. The sweep node is hidden entirely (opacity 0) when motion is reduced, so nothing blinks or flashes.

---

## Integration with Existing Hero

- The `<HeroTrace />` element is `position: absolute; inset: 0; z-index: 0`
- `.home__hero` is already `position: relative`
- The hero text content div uses `position: relative; z-index: 1` (via existing `.home__hero` children styles)
- The breathing glow (`::before` on `.home__hero`) is also at `z-index: 0` — the trace sits at the same level, they layer naturally without conflict

---

## Files

| File | Action |
|---|---|
| `src/components/HeroTrace.jsx` | Create |
| `src/components/HeroTrace.css` | Create |
| `src/pages/Home.jsx` | Add import + `<HeroTrace />` before hero content |

No other files change.

---

## Out of Scope

- The WaveformDivider on the Events page is unchanged
- No other pages get a signal trace
- No changes to the glow system, card treatments, or navbar
