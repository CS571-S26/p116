# Hero Signal Trace Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an animated SVG oscilloscope trace to the Home hero background — a slow-sweeping bright node traveling along a low-contrast line — that reads as signal/sound language without overpowering the typography.

**Architecture:** One new isolated component (`HeroTrace.jsx` + `HeroTrace.css`) placed as the first child of `.home__hero` at z-index 0. An SVG gradient mask fades the left 40% to transparent so the trace never conflicts with the text. CSS keyframes handle all animation; no JS, no Framer Motion. Responsive breakpoints reduce or hide the trace on mobile.

**Tech Stack:** React 18, plain CSS (no modules), SVG, CSS keyframe animation. Vite dev server at `http://localhost:5176/p116/` is already running.

---

## Chunk 1: All Tasks

### Task 1: Create HeroTrace.css

**Files:**
- Create: `src/components/HeroTrace.css`

No test framework is configured. Visual verification is the test: the animation must be visible in the browser before Task 2 is considered done.

- [ ] **Step 1: Create the CSS file with all keyframes and responsive rules**

```css
/* src/components/HeroTrace.css */

@keyframes hero-trace-pulse {
  0%, 100% { opacity: 0.10; }
  50%       { opacity: 0.18; }
}

@keyframes hero-trace-sweep {
  from { stroke-dashoffset: 60; }
  to   { stroke-dashoffset: -1320; }
}

/* Tablet variant — lower opacity range */
@keyframes hero-trace-pulse-tablet {
  0%, 100% { opacity: 0.07; }
  50%       { opacity: 0.12; }
}

.hero-trace {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: visible;
}

.hero-trace__base {
  animation: hero-trace-pulse 10s ease-in-out infinite;
}

.hero-trace__sweep {
  animation: hero-trace-sweep 8s linear infinite;
  filter: drop-shadow(0 0 6px rgba(204, 0, 0, 0.95)) drop-shadow(0 0 16px rgba(204, 0, 0, 0.4));
}

/* ── Tablet (≤768px): quieter ── */
@media (max-width: 768px) {
  .hero-trace__base {
    animation: hero-trace-pulse-tablet 10s ease-in-out infinite;
  }
  .hero-trace__sweep {
    opacity: 0.65;
  }
}

/* ── Mobile (≤480px): trace is structural line only, no motion ── */
@media (max-width: 480px) {
  .hero-trace__base {
    animation: none;
    opacity: 0.06;
  }
  .hero-trace__sweep {
    animation: none;
    opacity: 0;
  }
}

/* ── Reduced motion: static trace, sweep hidden ── */
@media (prefers-reduced-motion: reduce) {
  .hero-trace__base {
    animation: none;
    opacity: 0.10;
  }
  .hero-trace__sweep {
    animation: none;
    opacity: 0;
  }
}
```

- [ ] **Step 2: Verify the file exists**

```bash
ls src/components/HeroTrace.css
```
Expected: file listed

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroTrace.css
git commit -m "feat: HeroTrace CSS — keyframes and responsive rules"
```

---

### Task 2: Create HeroTrace.jsx

**Files:**
- Create: `src/components/HeroTrace.jsx`

The SVG path `d` attribute is a 4-arc waveform. The path ends at x=1040, so the viewBox is declared as `0 0 1050 320` (50 units of headroom) to ensure the SVG mask rect — which covers 100% of viewBox width — fully encloses the path. Without this, the final 40 units of the path would be outside the mask and appear unmasked at the right edge. The gradient mask fades the left 40% of the viewBox to transparent.

Note: the spec's example path uses `strokeDasharray="60 10000"` but this plan uses `strokeDasharray="65 10000"` — a 65-unit segment length — because the dashoffset animation (`from: 60, to: -(L+65)`) is calibrated around 65. The spec and implementation are self-consistent; this is an intentional refinement, not a discrepancy.

- [ ] **Step 1: Create the component**

```jsx
// src/components/HeroTrace.jsx
import './HeroTrace.css'

const PATH =
  'M0,230 C120,230 160,160 240,160 C320,160 360,290 460,290 ' +
  'C560,290 600,175 700,175 C800,175 840,250 960,250 ' +
  'C1000,250 1010,240 1040,240'

export default function HeroTrace() {
  return (
    <svg
      className="hero-trace"
      viewBox="0 0 1050 320"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="hero-trace-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="white" stopOpacity="0" />
          <stop offset="40%"  stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="hero-trace-mask">
          <rect width="100%" height="100%" fill="url(#hero-trace-fade)" />
        </mask>
      </defs>
      <g mask="url(#hero-trace-mask)">
        <path
          className="hero-trace__base"
          d={PATH}
          fill="none"
          stroke="rgba(204,0,0,1)"
          strokeWidth="1.5"
        />
        <path
          className="hero-trace__sweep"
          d={PATH}
          fill="none"
          stroke="rgba(220,0,0,0.9)"
          strokeWidth="2.5"
          strokeDasharray="65 10000"
        />
      </g>
    </svg>
  )
}
```

- [ ] **Step 2: Verify the file exists and has no syntax errors**

```bash
node --input-type=module <<'EOF'
import fs from 'fs'
const content = fs.readFileSync('src/components/HeroTrace.jsx', 'utf8')
console.log(content.includes('hero-trace-mask') ? 'OK: mask ID present' : 'MISSING: mask ID')
console.log(content.includes('aria-hidden') ? 'OK: aria-hidden present' : 'MISSING: aria-hidden')
console.log(content.includes('preserveAspectRatio') ? 'OK: preserveAspectRatio present' : 'MISSING: preserveAspectRatio')
EOF
```

Expected output:
```
OK: mask ID present
OK: aria-hidden present
OK: preserveAspectRatio present
```

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroTrace.jsx
git commit -m "feat: HeroTrace component — SVG signal trace with gradient mask"
```

---

### Task 3: Integrate into Home.jsx and fix mims-tag z-index

**Files:**
- Modify: `src/pages/Home.jsx` (add import + JSX element)
- Modify: `src/index.css` (add z-index to `.mims-tag`)

**Read both files before editing.**

- [ ] **Step 1: Read Home.jsx**

Use the Read tool on `src/pages/Home.jsx`. Do not use `cat`.

Confirm `<section className="home__hero">` exists and its only child is a `<motion.div>` that wraps all hero text (mims-tag span, h1, paragraph, buttons div). Note the exact line number of `<section className="home__hero">` — you will insert `<HeroTrace />` on the line immediately after it.

- [ ] **Step 2: Add HeroTrace import to Home.jsx**

Add this import after the existing AnimatedPage import:

```jsx
import HeroTrace from '../components/HeroTrace'
```

- [ ] **Step 3: Place HeroTrace in the hero section**

Insert `<HeroTrace />` on the line immediately after `<section className="home__hero">`, before the existing `<motion.div>`. Do not modify any existing children of the motion div — insert only the one new line. The result should look like:

```jsx
<section className="home__hero">
  <HeroTrace />
  <motion.div
    variants={prefersReduced ? {} : heroParent}
    initial="hidden"
    animate="visible"
  >
    {/* ALL existing children of this motion.div remain exactly as they were */}
  </motion.div>
</section>
```

The `{/* ALL existing children... */}` comment above is documentation shorthand — do not write it to the file. The actual children (mims-tag motion div, h1 motion div, paragraph motion div, buttons motion div) must remain unchanged.

- [ ] **Step 4: Read src/index.css and find the .mims-tag rule**

```bash
grep -n "mims-tag" src/index.css
```

- [ ] **Step 5: Add position and z-index to .mims-tag in index.css**

Use the Read tool on `src/index.css` to find the `.mims-tag` rule. The existing rule ends with `margin-bottom: 8px;` and has no `position` or `z-index` properties. Add only those two lines. The final rule should look like:

```css
.mims-tag {
  display: inline-block;
  background: rgba(204, 0, 0, 0.10);
  border: 1px solid rgba(204, 0, 0, 0.28);
  color: var(--red-text);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 2px;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.jsx src/index.css
git commit -m "feat: integrate HeroTrace into Home hero, fix mims-tag z-index"
```

---

### Task 4: Browser verification and dashoffset calibration

**Files:** `src/components/HeroTrace.css` (may need one edit to adjust `stroke-dashoffset` endpoint)

The `stroke-dashoffset` end value (`-1320`) is an estimate. The actual SVG path length in viewBox units must be confirmed and the CSS adjusted if the sweep exits/re-enters awkwardly.

- [ ] **Step 1: Open the site at http://localhost:5176/p116/**

The Vite dev server should already be running. If not: `npm run dev`

- [ ] **Step 2: Measure the actual path length**

Open browser DevTools console and run:

```js
document.querySelector('.hero-trace__sweep').getTotalLength()
```

Note the returned value (in SVG viewBox units, not pixels). Call this `L`.

- [ ] **Step 3: Determine correct dashoffset range**

The sweep animation should go from `stroke-dashoffset: 60` (segment near path start) to `stroke-dashoffset: -(L + 65)` (segment fully past path end). The `+65` accounts for the segment length.

If `getTotalLength()` returns, for example, `1278`, the correct end value is `-(1278 + 65) = -1343`. If this differs from `-1320` by more than 50 units, update the CSS:

```css
@keyframes hero-trace-sweep {
  from { stroke-dashoffset: 60; }
  to   { stroke-dashoffset: -[L+65]; }  /* replace with actual value */
}
```

- [ ] **Step 4: Visual check — desktop (≥ 900px)**

Verify:
- [ ] The base trace is visible as a very faint red line in the right portion of the hero
- [ ] The sweep node travels smoothly left-to-right and exits cleanly, then restarts
- [ ] The trace is invisible in the left 40% where the text lives (gradient mask working)
- [ ] The typography (mims-tag, h1, paragraph, buttons) all render clearly above the trace
- [ ] The sweep node does NOT overlap or compete with the "Connect." headline

If the trace feels too prominent: reduce `stroke` opacity on `.hero-trace__base` (currently `rgba(204,0,0,1)` with CSS-controlled opacity). If the sweep node is too bright: reduce opacity of `.hero-trace__sweep`.

- [ ] **Step 5: Visual check — tablet (~600px)**

Resize browser to ~600px width. Verify:
- [ ] The trace is visibly quieter than at desktop
- [ ] The sweep node is still visible but less prominent (0.65 opacity from CSS)
- [ ] No arcs look bunched or awkward at this width
- [ ] Text remains fully legible

If arcs feel too compressed at this width, also reduce `.hero-trace__base` opacity at the 768px breakpoint (e.g., `opacity: 0.05`).

- [ ] **Step 6: Visual check — mobile (~375px)**

Resize to ~375px width. Verify:
- [ ] The sweep node is completely invisible (CSS sets `opacity: 0` at ≤480px)
- [ ] The base trace is at most barely perceptible (static `opacity: 0.06`)
- [ ] Hero text and CTA button are fully readable and unobstructed
- [ ] The page does not feel broken or empty without the animation

- [ ] **Step 7: Check prefers-reduced-motion**

In DevTools, enable `prefers-reduced-motion` (Chrome: Rendering panel → Emulate CSS media feature). Verify:
- [ ] Sweep node is invisible
- [ ] Base trace is static (no pulsing), barely visible at `opacity: 0.10`

- [ ] **Step 8: Commit final calibrated CSS**

```bash
git add src/components/HeroTrace.css
git commit -m "feat: calibrate HeroTrace dashoffset and verify across breakpoints"
```
