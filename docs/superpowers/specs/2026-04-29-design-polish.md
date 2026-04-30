# MIMS Design Polish — Cinematic Editorial Pass

**Date:** 2026-04-29  
**Status:** Approved — ready for implementation  
**Scope:** Visual/design polish only. No new features. No new libraries.

---

## Goal

Elevate the MIMS site from "clean dark starter" to "premium, cinematic, music-industry-specific" without adding feature creep, gimmicks, or literal music decoration. Identity comes through rhythm, atmosphere, and graphic language — not icons or symbolic decoration.

**Not in scope:** new routes, new data, new user interactions, accessibility regressions.

---

## Direction: Approach B — Cinematic Editorial

Chosen over:
- **A (Atmospheric Restraint):** Adds presence but insufficient identity
- **C (Venue Lighting):** Too aggressive; risks crossing into gimmicky territory (always-on glows, text-shadow on type)

The target is: more identity than A, more restraint than C. ~10–15% more music/editorial flavor, not 50%.

---

## Priority 1 — Layered Backgrounds & Depth

### Body grain texture
- Add to `body` in `index.css` via `background-image` with an inline SVG fractal noise filter
- Opacity: ~4% — barely conscious, but you'll notice its absence
- Creates "printed surface" feel that distinguishes from a flat screen

```css
body {
  background-image: url("data:image/svg+xml,..."); /* fractalNoise, 4% */
  background-size: 200px 200px;
}
```

### Page-specific hero glows
Each page gets distinct atmospheric glow placement. Home's glow attaches to `.home__hero::before` (already exists — update values). All other pages attach to `.page::before` in their respective `.css` files — the `.page` wrapper div is present on every page and is the correct anchor.

| Page | Selector | Glow position | Intensity |
|------|----------|--------------|-----------|
| Home | `.home__hero::before` (+ new `::after` for warm glow) | Dual: red 15% top-right + warm (#b42800) 6% bottom-left | Richest — this is the hero |
| Events | `.page::before` in `Events.css` | Single: red 12% top-left | Directional, off-center |
| Leadership | `.page::before` in `Leadership.css` | Single: red 10% center-right | Quieter — grid provides structure |
| About | `.page::before` in `About.css` | Single: red 9% right | Intentionally calmer — informational page, not atmospheric |
| MyEvents | No page glow (empty state has own atmospheric treatment) | — | — |

All `::before` glows use `position: absolute`, `pointer-events: none`, `z-index: 0`. The `.page` class in `index.css` does not currently have `position` or `overflow` set — **add both** to `.page`:
```css
.page {
  position: relative;
  overflow: hidden;
}
```

**Restraint rule:** The warm (secondary) glow exists to add depth by stopping the background from feeling flat. It must NOT shift the site's dark/red color identity. 6–7% max. If in doubt, reduce.

### Navbar
No atmospheric treatment. Keep flat `var(--bg)` with border-bottom. Adding glow to the navbar would make every page feel the same from the top.

---

## Priority 2 — Card Polish

### EventCard (`src/components/EventCard.css`)

**Before:** `border-left: 3px solid var(--red)` — flat stripe, high contrast, generic

**After:**
```css
.event-card {
  background: linear-gradient(170deg, #191919 0%, #131313 100%);
  border-left: 1px solid rgba(204, 0, 0, 0.65);
  box-shadow:
    -3px 0 8px rgba(204, 0, 0, 0.10),   /* left edge glow — edge-lighting effect */
    0 4px 24px rgba(0, 0, 0, 0.50),      /* depth shadow */
    inset 0 1px 0 rgba(255, 255, 255, 0.025); /* inner top highlight */
}
```

Effect: red appears to bleed from the left edge as light, not as a painted stripe. Surface gradient adds tactile weight.

**Hover enhancement:**
```css
.event-card:hover {
  box-shadow:
    -4px 0 14px rgba(204, 0, 0, 0.17),
    0 8px 32px rgba(0, 0, 0, 0.60),
    inset 0 1px 0 rgba(255, 255, 255, 0.025);
}
```

### OfficerCard (`src/components/OfficerCard.css`)

**Avatar ring — add outer halo:**
```css
.officer-card__avatar {
  box-shadow: 0 0 0 1px rgba(204, 0, 0, 0.2), 0 0 12px rgba(204, 0, 0, 0.22);
}
```

**Hover — intensify halo:**
```css
.officer-card:hover .officer-card__avatar {
  box-shadow: 0 0 0 1px rgba(204, 0, 0, 0.3), 0 0 18px rgba(204, 0, 0, 0.35);
}
```

Effect: spotlight on a performer. Reads as intentional lighting, not just a colored border.

### About what-cards (`src/pages/About.css`)
Apply matching surface gradient. Do NOT add the left edge glow — these cards use `border-left: 3px solid red` as a design element, not edge-lighting. Keep that distinction.

### MyEventRow (`src/components/MyEventRow.css`)
Same surface gradient as EventCard. The existing `border-left: 3px solid var(--red)` can stay on MyEventRow since it serves a different visual purpose (a "my list" indicator vs an event card).

---

## Priority 3 — Typography

### Hero headline split (`src/pages/Home.jsx` + `Home.css`)

**Concept:** Three-step contrast — hook / secondary / payoff. Music editorial pattern (album campaigns, festival headlines).

**Implementation:** Wrap each word in a `<span>`:
```jsx
<motion.h1 ...>
  <span className="home__hero-h1--w1">Connect.</span>
  <span className="home__hero-h1--w2">Learn.</span>
  <span className="home__hero-h1--w3">Grow.</span>
</motion.h1>
```

```css
.home__hero h1 { display: flex; flex-direction: column; }
.home__hero-h1--w1 { color: #ffffff; }
.home__hero-h1--w2 { color: rgba(255, 255, 255, 0.45); }
.home__hero-h1--w3 { color: var(--red-text); } /* flat #ff3333, not gradient */
```

**Restraint note:** Use flat `var(--red-text)` on "Grow." — NOT a CSS gradient. Gradient text has webkit rendering edge cases and the flat color achieves the same payoff cleanly.

### Section headings (`src/index.css`)

**Before:** `border-bottom: 1px solid var(--border)` — label treatment

**After:** Left rule — editorial category marker
```css
.section-heading {
  border-bottom: none;
  border-left: 2px solid var(--red);
  padding-left: 10px;
  padding-bottom: 0;
  line-height: 1.3;
  letter-spacing: 1.5px; /* was 1px */
}
```

### PageHeader tag badge (`src/components/PageHeader.jsx` + `PageHeader.css`)

Replace Bootstrap `<Badge bg="danger">` with a custom `<span>`:
```jsx
<span className="mims-tag">{tag}</span>
```

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
}
```

Reads as "press/media category label" rather than a filled pill badge.

### Home.jsx inline badges

`Home.jsx` contains two `<Badge bg="danger" className="red-tag">` elements (hero section and community section) that do **not** go through `PageHeader`. Convert both to `<span className="mims-tag">` using the same class. The existing `.red-tag` class in `index.css` can be left in place (it may be referenced elsewhere) but will be visually overridden for these instances. Remove the Bootstrap `Badge` import from `Home.jsx` if it is no longer used after the conversion.

---

## Priority 4 — Branded Micro-details

### WaveformDivider component (`src/components/WaveformDivider.jsx`)

New component. Pure CSS — no animation, no randomness.

```jsx
// Heights define a fixed waveform envelope — never randomized
const HEIGHTS = [3,5,8,12,7,11,14,9,13,6,10,4,8,13,7,11,3,9,14,6,10,5,12,8,4,11,7,13,9,3,12,6,10,14,5,8,11,4,9,13,7,3,11,8,14,6,10,5,12,9,4,13,7,11,3,8,12,6,10,14,5,9,4,11];
```

```css
.waveform-divider {
  display: flex; align-items: center; gap: 2px;
  height: 16px; overflow: hidden; margin: 20px 0;
}
.waveform-divider__bar {
  width: 2px; border-radius: 1px;
  background: var(--red);
  /* opacity set inline per bar: 0.15 + (h/14)*0.40 */
}
```

The `aria-hidden="true"` attribute must be on the JSX element itself, not in CSS:
```jsx
<div className="waveform-divider" aria-hidden="true">
  {HEIGHTS.map((h, i) => (
    <div
      key={i}
      className="waveform-divider__bar"
      style={{ height: h, opacity: 0.15 + (h / 14) * 0.40 }}
    />
  ))}
</div>
```

**Usage — exactly 2 instances:**
1. `Home.jsx`: between the hero section and the Community section. Replace the `<hr className="divider">` that currently sits between those sections with `<WaveformDivider />`.
2. `Events.jsx`: above the event list, below the PageHeader divider

**Not used:** About, Leadership, MyEvents, Navbar, footer. Treat it like punctuation — if it appears everywhere it stops meaning anything.

### Event metadata treatment (`src/components/EventCard.css`)

**Goal:** Reads like event-poster / lineup metadata. Not a form label.

```css
.event-card__meta {
  font-size: 11px; /* keep current — do not reduce */
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Date span */
.event-card__date {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--red-text);
}
```

**Restraint rule:** Uppercase + tracking applies to the date column only. Location and time stay at normal case with minimal tracking. This preserves readability while the date reads as a "headliner slot" marker.

**Separator `·` in metadata:** Tint slightly: `color: rgba(204, 0, 0, 0.4)` — warm, not gray. Subtle but consistent with the red identity.

**Emoji removal:** The current `EventCard.jsx` renders `📍 {event.location}`. Remove the `📍` emoji from the metadata string — it conflicts with `text-transform: uppercase` and `letter-spacing` applied to the metadata line, and is inconsistent with the event-poster/industry treatment. Replace with plain text: `{event.location} · {event.time}` (the `·` separator already provides visual separation).

---

## Priority 5 — Hover/Focus States

### Nav link hover — animated underline (`src/components/Navbar.css`)

```css
.mims-navbar .nav-link {
  position: relative;
}
.mims-navbar .nav-link::after {
  content: '';
  position: absolute;
  bottom: 4px; left: 12px; right: 12px;
  height: 1px;
  background: var(--red-text);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}
.mims-navbar .nav-link:hover::after {
  transform: scaleX(1);
}
/* Active state: underline visible without hover */
.mims-navbar .nav-link.active::after {
  transform: scaleX(1);
  opacity: 0.7;
}
```

**Implementation note:** Before adding the `::after` underline rules, remove the existing `border-bottom: 1px solid var(--red-text)` from `.mims-navbar .nav-link.active` — otherwise the active state will show both simultaneously (doubled underline). The `::after` underline replaces it entirely.

**Accessibility note:** Active state must be visible without hover. The existing `.active` color treatment (`color: var(--red-text) !important`) stays — only the `border-bottom` is removed. The `::after` underline is additive to that color treatment.

### Button hover fill (`src/pages/Home.css`)

Add `background` to the **existing** `.btn-mims--primary:hover` block (do not create a second `:hover` selector):
```css
.btn-mims--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(204, 0, 0, 0.35) !important;
  background: rgba(204, 0, 0, 0.06) !important; /* add this line only */
}
```

### Global focus rings (`src/index.css`)
No changes — the existing `outline: 2px solid var(--red-text); outline-offset: 3px` is correct and WCAG AA compliant.

---

## Priority 6 — Empty State

**File:** `src/pages/MyEvents.jsx` + `src/pages/MyEvents.css`

### Container
```css
.my-events__empty {
  border: 1px dashed rgba(204, 0, 0, 0.15); /* was var(--border) */
  background: var(--bg); /* was var(--surface-raised) — slightly recessed */
  position: relative;
  overflow: hidden;
}
```

### Atmospheric glow behind icon
```css
.my-events__empty-icon {
  position: relative;
}
.my-events__empty-icon::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 80px; height: 80px;
  background: radial-gradient(circle, rgba(204, 0, 0, 0.08) 0%, transparent 70%);
  pointer-events: none;
}
```

### Icon color
Change from `var(--text-muted)` (#888) to `rgba(204, 0, 0, 0.35)` — dim red "no signal" state.

### Copy
```
"No events saved yet."
"Browse the lineup and RSVP to your first."
```
"Lineup" is industry language. More specific than "Events page."

### CTA button
```
"Browse the Lineup →"
```

---

## What's Not Changing

- Font: Inter stays. No new typeface loads.
- Color tokens: no new variables added. All changes use existing tokens or inline rgba values derived from existing tokens.
- No new animations (beyond the nav link scaleX underline — CSS only, no framer-motion).
- No literal music decoration (music notes, vinyl, play buttons, equalizer bars used decoratively).
- No Bootstrap overrides beyond what already exists.
- Accessibility: all changes maintain or improve WCAG AA compliance.

---

## Files Affected

| File | Change |
|------|--------|
| `src/index.css` | Body grain texture; section heading redesign; `.mims-tag` new class |
| `src/pages/Home.css` | Hero dual glow; hero split typography; waveform divider placement |
| `src/pages/Home.jsx` | Hero h1 split spans; WaveformDivider component usage; PageHeader tag swap |
| `src/pages/Events.css` | Page glow; WaveformDivider placement |
| `src/pages/Events.jsx` | WaveformDivider component usage |
| `src/pages/About.css` | Page glow; surface gradient on what-cards |
| `src/pages/Leadership.css` | Page glow |
| `src/pages/MyEvents.css` | Empty state polish |
| `src/pages/MyEvents.jsx` | Copy changes; icon color; CTA text |
| `src/components/EventCard.jsx` | Remove 📍 emoji from metadata string |
| `src/components/EventCard.css` | Edge-lighting card treatment; metadata treatment |
| `src/components/OfficerCard.css` | Avatar halo; hover intensification |
| `src/components/Navbar.css` | Nav link underline animation |
| `src/components/PageHeader.jsx` | Badge → custom mims-tag span |
| `src/components/PageHeader.css` | mims-tag styles (or moved to index.css) |
| `src/components/WaveformDivider.jsx` | **New component** (only new file) |

---

## Success Criteria

1. The site feels atmospherically distinct on each page without being loud
2. Cards feel like premium printed material, not a CSS framework default
3. The hero headline reads as editorial — creates a rhythm, not just a slogan
4. The waveform divider reads as structural punctuation, not a decoration
5. Hover states feel designed and responsive without overshadowing content
6. The empty state feels considered, not abandoned
7. No new lint errors, no accessibility regressions, no new dependencies
