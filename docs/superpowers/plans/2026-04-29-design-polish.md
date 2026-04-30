# Design Polish — Cinematic Editorial Pass Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply a CSS/JSX-only visual polish pass that elevates the MIMS site from a clean dark starter to a premium, cinematic, music-industry-specific design — with layered backgrounds, edge-lit cards, editorial typography, a waveform divider component, and polished empty states.

**Architecture:** All changes are CSS and JSX edits to existing files plus one new component (`WaveformDivider`). No new libraries. No new routes. No data changes. The work is decomposed by visual system (backgrounds → cards → typography → micro-details → hover states → empty state) so each task is independently verifiable in the browser.

**Tech Stack:** React 18, Bootstrap 5, Framer Motion (already installed — not a new dependency), plain CSS (no CSS modules, no Tailwind), Vite dev server. No new packages are added by this plan.

---

## Chunk 1: Foundation — Globals, Backgrounds, and `.page` anchor

### Task 1: Add body grain texture and fix `.page` positioning

**Files:**
- Modify: `src/index.css`

This is the foundation for all page glows in later tasks. `.page` needs `position: relative; overflow: hidden` before any `::before` pseudo-elements can be attached to it.

- [ ] **Step 1: Add position and overflow to `.page`**

Open `src/index.css`. Find the `.page` block (currently lines 68–72). Add two properties:

```css
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 48px;
  position: relative;    /* ADD */
  overflow: hidden;      /* ADD */
}
```

- [ ] **Step 2: Add body grain texture to `body`**

Find the `body` block (around line 48). Add the `background-image` and `background-size` properties:

```css
body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  min-height: 100vh;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); /* ADD */
  background-size: 200px 200px;  /* ADD */
}
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev` (if not already running). Open any page. The background should look identical to before — the grain is intentionally subliminal. If you see a jarring pattern, the opacity value in the SVG is too high (reduce `0.04` to `0.03`).

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "feat: add body grain texture and page positioning for glow anchors"
```

---

### Task 2: Redesign `.section-heading` and add `.mims-tag` to globals

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace section heading border treatment**

Find `.section-heading` block in `src/index.css`. Replace entirely:

```css
.section-heading {
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 14px;
  border-left: 2px solid var(--red);
  padding-left: 10px;
  line-height: 1.3;
}
```

(Removed: `padding-bottom: 8px`, `border-bottom: 1px solid var(--border)`)

- [ ] **Step 2: Add `.mims-tag` class**

After the `.section-heading` block, add:

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

- [ ] **Step 3: Verify in browser**

Check any page that uses a section heading (Home has "Upcoming Events", Leadership has "Executive Board"). It should now show a left red rule instead of a bottom border. Check Leadership — the grid should still be correctly spaced below the heading.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "feat: section heading left-rule treatment and mims-tag global class"
```

---

### Task 3: Home page — dual radial glow

**Files:**
- Modify: `src/pages/Home.css`

The Home hero already has a `::before` glow (8% single). Upgrade to dual-layer.

- [ ] **Step 1: Update `.home__hero::before` — red glow**

The existing `::before` glow uses an ellipse covering 50% width × 100% height of the hero. Replace it with a fixed-size circle for tighter directional control — this shape change is intentional:

```css
.home__hero::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(204, 0, 0, 0.15) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 2: Add `.home__hero::after` — warm secondary glow**

Add immediately after the `::before` block:

```css
.home__hero::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: -20px;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(180, 40, 0, 0.06) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 3: Verify in browser**

Open the Home page. The hero area should feel slightly richer and less one-dimensional than before. The warm glow at bottom-left should NOT be visually distinct — it adds depth, not a second color. If it looks orange or warm, reduce the opacity from `0.06` to `0.04`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.css
git commit -m "feat: home hero dual radial glow — red + warm secondary"
```

---

### Task 4: Events, Leadership, About — page-specific glows

**Files:**
- Modify: `src/pages/Events.css`
- Modify: `src/pages/Leadership.css`
- Modify: `src/pages/About.css`

Each gets a unique single-glow `::before` attached to `.page`.

- [ ] **Step 1: Events — top-left red glow**

Add a page-specific class to the `<div className="page">` in `Events.jsx` so the glow can be targeted without interfering with other pages.

In `src/pages/Events.jsx`, change:
```jsx
<div className="page">
```
to:
```jsx
<div className="page events-page">
```

Then in `src/pages/Events.css`, add:
```css
.events-page::before {
  content: '';
  position: absolute;
  top: -30px;
  left: -20px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(204, 0, 0, 0.12) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 2: Leadership — center-right red glow**

In `src/pages/Leadership.jsx`, change:
```jsx
<div className="page">
```
to:
```jsx
<div className="page leadership-page">
```

Add to `src/pages/Leadership.css`:
```css
.leadership-page::before {
  content: '';
  position: absolute;
  top: -10px;
  right: -20px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(204, 0, 0, 0.10) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 3: About — right-side red glow**

In `src/pages/About.jsx`, change:
```jsx
<div className="page">
```
to:
```jsx
<div className="page about-page">
```

Add to `src/pages/About.css`:
```css
.about-page::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(204, 0, 0, 0.09) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
```

Note: About is intentionally calmer than Events (9% vs 12%) — it's informational, not atmospheric. Keep this lower than the Events and Leadership values.

- [ ] **Step 4: Verify all three pages in browser**

Navigate Events, Leadership, About. Each should have a subtle atmospheric glow from a different corner. None should look like a spotlight — these are background depth, not focal elements. If any glow looks obvious or distracting, reduce its rgba opacity by 0.03.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Events.css src/pages/Events.jsx \
        src/pages/Leadership.css src/pages/Leadership.jsx \
        src/pages/About.css src/pages/About.jsx
git commit -m "feat: page-specific atmospheric glows — Events, Leadership, About"
```

---

## Chunk 2: Card Polish

### Task 5: EventCard — edge-lighting treatment

**Files:**
- Modify: `src/components/EventCard.css`
- Modify: `src/components/EventCard.jsx`

- [ ] **Step 1: Replace the hard border-left stripe with edge-lighting**

In `src/components/EventCard.css`, find `.event-card`. Replace the entire block:

```css
.event-card {
  background: linear-gradient(170deg, #191919 0%, #131313 100%) !important;
  border: 1px solid var(--border) !important;
  border-left: 1px solid rgba(204, 0, 0, 0.65) !important;
  border-radius: 4px !important;
  margin-bottom: 10px;
  box-shadow:
    -3px 0 8px rgba(204, 0, 0, 0.10),
    0 4px 24px rgba(0, 0, 0, 0.50),
    inset 0 1px 0 rgba(255, 255, 255, 0.025);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
```

- [ ] **Step 2: Update hover state**

Find `.event-card:hover`. Replace:

```css
.event-card:hover {
  box-shadow:
    -4px 0 14px rgba(204, 0, 0, 0.17),
    0 8px 32px rgba(0, 0, 0, 0.60),
    inset 0 1px 0 rgba(255, 255, 255, 0.025);
}
```

- [ ] **Step 3: Update event date styling**

Find `.event-card__date`. Replace:

```css
.event-card__date {
  color: var(--red-text);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  width: 52px;
  flex-shrink: 0;
  padding-top: 2px;
}
```

- [ ] **Step 4: Update event metadata styling**

Find `.event-card__meta`. Replace:

```css
.event-card__meta {
  color: var(--text-muted) !important;
  font-size: 11px;
  letter-spacing: 0.5px;
  margin-bottom: 5px !important;
}
```

- [ ] **Step 5: Remove the 📍 emoji and tint the separator in EventCard.jsx**

Open `src/components/EventCard.jsx`. Find the line:
```jsx
<Card.Subtitle className="event-card__meta">
  📍 {event.location} · {event.time}
</Card.Subtitle>
```

Change to (remove emoji, wrap separator in a span for the warm tint):
```jsx
<Card.Subtitle className="event-card__meta">
  {event.location} <span className="event-card__meta-sep">·</span> {event.time}
</Card.Subtitle>
```

Add to `EventCard.css`:
```css
.event-card__meta-sep {
  color: rgba(204, 0, 0, 0.4);
  margin: 0 2px;
}
```

- [ ] **Step 6: Verify in browser**

Open the Events page. Cards should feel like premium printed material — the left edge has a faint red glow rather than a painted stripe. The surface should have subtle depth (gradient). On hover the left glow intensifies.

- [ ] **Step 7: Commit**

```bash
git add src/components/EventCard.css src/components/EventCard.jsx
git commit -m "feat: event card edge-lighting, surface gradient, and metadata polish"
```

---

### Task 6: OfficerCard — avatar spotlight halo

**Files:**
- Modify: `src/components/OfficerCard.css`

- [ ] **Step 1: Add halo to avatar ring**

In `src/components/OfficerCard.css`, find `.officer-card__avatar`. Add `box-shadow`:

```css
.officer-card__avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #1a0000;
  border: 2px solid var(--red);
  box-shadow: 0 0 0 1px rgba(204, 0, 0, 0.2), 0 0 12px rgba(204, 0, 0, 0.22); /* ADD */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: var(--red-text);
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 1px;
}
```

- [ ] **Step 2: Add hover intensification**

Add after `.officer-card:hover`:

```css
.officer-card:hover .officer-card__avatar {
  box-shadow: 0 0 0 1px rgba(204, 0, 0, 0.3), 0 0 18px rgba(204, 0, 0, 0.35);
}
```

- [ ] **Step 3: Add surface gradient to card**

Find `.officer-card`. Add background gradient:

```css
.officer-card {
  background: linear-gradient(160deg, #191919 0%, #141414 100%);
  border: 1px solid var(--border);
  padding: 24px 16px;
  text-align: center;
  border-radius: 4px;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
```

- [ ] **Step 4: Verify in browser**

Open Leadership. Officer cards should have a subtle surface gradient. Avatar rings should have a soft red halo — reads as a spotlight. On hover, the halo deepens slightly.

- [ ] **Step 5: Commit**

```bash
git add src/components/OfficerCard.css
git commit -m "feat: officer card avatar spotlight halo and surface gradient"
```

---

### Task 7: About what-cards and MyEventRow — surface gradient

**Files:**
- Modify: `src/pages/About.css`
- Modify: `src/components/MyEventRow.css`

- [ ] **Step 1: About what-cards — surface gradient**

In `src/pages/About.css`, find `.about__what-card`. Add gradient background:

```css
.about__what-card {
  background: linear-gradient(160deg, #191919 0%, #141414 100%);
  border: 1px solid var(--border);
  border-left: 3px solid var(--red);
  padding: 20px;
  border-radius: 4px;
}
```

Note: These cards keep `border-left: 3px solid var(--red)` — this is a design element (category marker), not edge-lighting. Do NOT apply the edge-lighting shadow here.

- [ ] **Step 2: MyEventRow — surface gradient**

In `src/components/MyEventRow.css`, find `.my-event-row`. Add gradient background:

```css
.my-event-row {
  background: linear-gradient(170deg, #191919 0%, #141414 100%);
  border-left: 3px solid var(--red);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
}
```

- [ ] **Step 3: Verify in browser**

Check About page — "What We Do" cards should have a surface gradient visible on close inspection. Check MyEvents page (RSVP to an event first) — saved event rows should show the same gradient treatment.

- [ ] **Step 4: Commit**

```bash
git add src/pages/About.css src/components/MyEventRow.css
git commit -m "feat: surface gradient on About cards and MyEventRow"
```

---

## Chunk 3: Typography

### Task 8: PageHeader — replace Badge with mims-tag

**Files:**
- Modify: `src/components/PageHeader.jsx`

- [ ] **Step 1: Remove Badge import, add mims-tag span**

Open `src/components/PageHeader.jsx`. The current file imports `Badge` from `react-bootstrap`. Replace the entire file:

```jsx
import './PageHeader.css'

export default function PageHeader({ tag, title, subtitle }) {
  return (
    <div className="page-header">
      <span className="mims-tag">{tag}</span>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
      <hr className="divider" />
    </div>
  )
}
```

- [ ] **Step 2: Verify all pages using PageHeader**

Navigate Events, Leadership, About, MyEvents. Each page's tag (e.g. "What's Happening", "The Team", "Who We Are", "Your Schedule") should now show as a dark red bordered label instead of a filled red pill. The heading and subtitle below should look identical to before.

- [ ] **Step 3: Commit**

```bash
git add src/components/PageHeader.jsx
git commit -m "feat: PageHeader tag — Badge to mims-tag border label"
```

---

### Task 9: Home.jsx — hero split typography and inline badge conversion

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/Home.css`

- [ ] **Step 1: Wrap hero headline words in spans (Home.jsx)**

Open `src/pages/Home.jsx`. Find:
```jsx
<motion.h1 variants={prefersReduced ? {} : heroChild}>Connect. Learn. Grow.</motion.h1>
```

Replace with:
```jsx
<motion.h1 variants={prefersReduced ? {} : heroChild} className="home__hero-h1">
  <span className="home__hero-h1--w1">Connect.</span>
  <span className="home__hero-h1--w2">Learn.</span>
  <span className="home__hero-h1--w3">Grow.</span>
</motion.h1>
```

- [ ] **Step 2: Convert the two inline Badge elements to mims-tag**

In `Home.jsx`, find:
```jsx
<Badge bg="danger" className="red-tag">Music Industry for Madison Students</Badge>
```
Replace with:
```jsx
<span className="mims-tag">Music Industry for Madison Students</span>
```

And find:
```jsx
<Badge bg="danger" className="red-tag" style={{ marginBottom: '12px' }}>Join the Community</Badge>
```
Replace with:
```jsx
<span className="mims-tag" style={{ marginBottom: '12px' }}>Join the Community</span>
```

- [ ] **Step 3: Remove Badge import from Home.jsx if unused**

Check the top of `Home.jsx`:
```jsx
import { Link } from 'react-router-dom'
import { Badge, Button } from 'react-bootstrap'
```

After the conversions, `Badge` is no longer used. Change to:
```jsx
import { Button } from 'react-bootstrap'
```

- [ ] **Step 4: Add hero split typography styles (Home.css)**

In `src/pages/Home.css`, find `.home__hero h1`. Replace:

```css
.home__hero h1 {
  font-size: clamp(36px, 6vw, 56px);
  font-weight: 900;
  margin-bottom: 12px;
  line-height: 1.1;
  letter-spacing: -1.5px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.home__hero-h1--w1 {
  color: #ffffff;
}

.home__hero-h1--w2 {
  color: rgba(255, 255, 255, 0.45);
}

.home__hero-h1--w3 {
  color: var(--red-text);
}
```

- [ ] **Step 5: Verify in browser**

Open Home. The hero headline should read as three distinct levels: "Connect." (white), "Learn." (dimmed), "Grow." (red). Each on its own line. The effect should feel editorial — like an album campaign — not flashy. If "Grow." in red looks too loud, reduce `--red-text` to `rgba(255, 80, 80, 0.85)` inline. But try the flat color first.

Also verify the two inline badges (hero and community section) now look like the border-label style, not filled pills.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.jsx src/pages/Home.css
git commit -m "feat: hero headline split typography and convert Home badges to mims-tag"
```

---

## Chunk 4: Branded Micro-details

### Task 10: WaveformDivider component

**Files:**
- Create: `src/components/WaveformDivider.jsx`
- Create: `src/components/WaveformDivider.css`

- [ ] **Step 1: Create WaveformDivider.css**

```css
.waveform-divider {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 16px;
  overflow: hidden;
  margin: 20px 0;
}

.waveform-divider__bar {
  width: 2px;
  border-radius: 1px;
  background: var(--red);
  flex-shrink: 0;
}
```

- [ ] **Step 2: Create WaveformDivider.jsx**

```jsx
import './WaveformDivider.css'

const HEIGHTS = [3,5,8,12,7,11,14,9,13,6,10,4,8,13,7,11,3,9,14,6,10,5,12,8,4,11,7,13,9,3,12,6,10,14,5,8,11,4,9,13,7,3,11,8,14,6,10,5,12,9,4,13,7,11,3,8,12,6,10,14,5,9,4,11]

export default function WaveformDivider() {
  return (
    <div className="waveform-divider" aria-hidden="true">
      {HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="waveform-divider__bar"
          style={{ height: h, opacity: 0.15 + (h / 14) * 0.40 }}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Verify component renders**

At this stage the component exists but is not yet used. There's nothing to verify in the browser yet — proceed to Task 11.

- [ ] **Step 4: Commit**

```bash
git add src/components/WaveformDivider.jsx src/components/WaveformDivider.css
git commit -m "feat: WaveformDivider component — fixed-envelope audio bar motif"
```

---

### Task 11: Place WaveformDivider in Home and Events

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/Events.jsx`

- [ ] **Step 1: Add WaveformDivider to Home — replace hero/community divider**

Open `src/pages/Home.jsx`. Add import at the top:
```jsx
import WaveformDivider from '../components/WaveformDivider'
```

Find the `{/* Community */}` section. There is currently no `<hr>` between the hero and community sections (they're separated by `border-bottom` on `.home__hero`). Add `<WaveformDivider />` as the last child inside `.home__hero`, just before the closing `</section>` tag:

```jsx
<section className="home__hero">
  <motion.div ...>
    {/* existing hero content */}
  </motion.div>
  <WaveformDivider />
</section>
```

Then remove the `border-bottom: 1px solid var(--border)` from `.home__hero` in `Home.css` — the WaveformDivider now acts as the visual separator.

- [ ] **Step 2: Update Home.css — remove hero border-bottom**

In `src/pages/Home.css`, find `.home__hero`:
```css
.home__hero {
  padding: 64px 0 40px;
  border-bottom: 1px solid var(--border);  /* REMOVE this line */
  position: relative;
  overflow: hidden;
}
```

- [ ] **Step 3: Add WaveformDivider to Events — above the list**

Open `src/pages/Events.jsx`. Add import:
```jsx
import WaveformDivider from '../components/WaveformDivider'
```

Find the area between `<PageHeader ... />` and `<motion.div className="events__list" ...>`. Add the component there:

```jsx
<PageHeader tag="What's Happening" title="Upcoming Events" subtitle="RSVP to save events to your personal list." />
<WaveformDivider />
<motion.div
  className="events__list"
  ...
>
```

- [ ] **Step 4: Verify in browser**

Open Home — the waveform should appear at the bottom of the hero section, acting as a visual transition to the Community section. Open Events — the waveform should appear between the header and the first card. Both should look like structural punctuation, not decoration. If either feels too prominent, it's fine — the bars are small.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.jsx src/pages/Home.css src/pages/Events.jsx
git commit -m "feat: place WaveformDivider in Home hero and Events page"
```

---

## Chunk 5: Hover/Focus States

### Task 12: Navbar animated underline

**Files:**
- Modify: `src/components/Navbar.css`

- [ ] **Step 1: Remove existing border-bottom from active state**

In `src/components/Navbar.css`, find:
```css
.mims-navbar .nav-link.active {
  color: var(--red-text) !important;
  border-bottom: 1px solid var(--red-text);
}
```

Remove `border-bottom: 1px solid var(--red-text);` — the `::after` underline replaces it:
```css
.mims-navbar .nav-link.active {
  color: var(--red-text) !important;
}
```

- [ ] **Step 2: Add `position: relative` to nav links**

Find `.mims-navbar .nav-link`. Add `position: relative`:

```css
.mims-navbar .nav-link {
  color: var(--text-muted) !important;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
  padding: 8px 12px !important;
  transition: color 0.15s ease;
  position: relative; /* ADD */
}
```

- [ ] **Step 3: Add ::after underline rules**

Add after the `.mims-navbar .nav-link:hover` block:

```css
.mims-navbar .nav-link::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 12px;
  right: 12px;
  height: 1px;
  background: var(--red-text);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}

.mims-navbar .nav-link:hover::after {
  transform: scaleX(1);
}

.mims-navbar .nav-link.active::after {
  transform: scaleX(1);
  opacity: 0.7;
}
```

- [ ] **Step 4: Verify in browser — keyboard accessibility**

Navigate between pages using both mouse and keyboard (Tab to nav links). Active route should show the red underline without hover. Hovering any nav link should animate the underline growing from left. Focus ring (`outline: 2px solid var(--red-text)`) should still appear on keyboard focus — the `::after` underline does not interfere with it.

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar.css
git commit -m "feat: navbar animated underline — scaleX grow on hover, visible on active"
```

---

### Task 13: Button hover fill (Home)

**Files:**
- Modify: `src/pages/Home.css`

- [ ] **Step 1: Add background to existing primary button hover**

In `src/pages/Home.css`, find the existing `.btn-mims--primary:hover` block:

```css
.btn-mims--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(204, 0, 0, 0.35) !important;
}
```

Add `background` to this existing block (do NOT create a second `:hover` selector):

```css
.btn-mims--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(204, 0, 0, 0.35) !important;
  background: rgba(204, 0, 0, 0.06) !important;
}
```

- [ ] **Step 2: Verify in browser**

Hover the "Explore Events →" button on Home. It should subtly gain a near-invisible red fill. The effect is "reacts to presence" — if you have to look for it, it's about right.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.css
git commit -m "feat: primary button hover — add subtle red fill on hover"
```

---

## Chunk 6: Empty State

### Task 14: MyEvents empty state polish

**Files:**
- Modify: `src/pages/MyEvents.css`
- Modify: `src/pages/MyEvents.jsx`

- [ ] **Step 1: Update empty state container styles**

In `src/pages/MyEvents.css`, find `.my-events__empty`. Replace:

```css
.my-events__empty {
  text-align: center;
  padding: 60px 24px;
  background: var(--bg);
  border: 1px dashed rgba(204, 0, 0, 0.15);
  border-radius: 6px;
  margin-top: 8px;
  position: relative;
  overflow: hidden;
}
```

- [ ] **Step 2: Update icon wrapper — add atmospheric glow**

Find `.my-events__empty-icon`. Replace:

```css
.my-events__empty-icon {
  color: rgba(204, 0, 0, 0.35);
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  position: relative;
}

.my-events__empty-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(204, 0, 0, 0.08) 0%, transparent 70%);
  pointer-events: none;
}
```

- [ ] **Step 3: Update copy and CTA in MyEvents.jsx**

Open `src/pages/MyEvents.jsx`. Find the empty state JSX:

```jsx
<h2>No events yet</h2>
<p>Head to the Events page and RSVP to something!</p>
<Button as={Link} to="/events" variant="outline-danger" size="sm">Browse Events →</Button>
```

Replace with:

```jsx
<h2>No events saved yet.</h2>
<p>Browse the lineup and RSVP to your first.</p>
<Button as={Link} to="/events" variant="outline-danger" size="sm">Browse the Lineup →</Button>
```

- [ ] **Step 4: Verify empty state in browser**

Navigate to My Events (without any RSVPs — clear localStorage if needed: open browser console, run `localStorage.clear()`, then reload). The empty state should have:
- A faint red-tinted dashed border
- The music icon in dim red (not gray)
- A radial glow behind the icon (barely visible)
- The updated copy ("lineup" not "events page")

- [ ] **Step 5: Commit**

```bash
git add src/pages/MyEvents.css src/pages/MyEvents.jsx
git commit -m "feat: MyEvents empty state — atmospheric treatment, updated copy"
```

---

## Final Verification

### Task 15: Cross-page review pass

- [ ] **Step 1: Full browser review — Home**

Open Home. Check:
- Body grain texture present (subtle — if you can't notice it, it's working)
- Dual glow in hero area (red top-right, barely-visible warm bottom-left)
- Hero headline "Connect. / Learn. / Grow." in three-step contrast
- WaveformDivider visible between hero and Community section
- Section headings use left red rule (no border-bottom)
- "Upcoming Events" section heading has the left rule
- Event rows in preview have no visual regressions

- [ ] **Step 2: Full browser review — Events**

- Page glow visible top-left (subtle)
- WaveformDivider between PageHeader and card list
- Cards: edge-lit (no hard stripe), surface gradient
- Date column: uppercase, tight tracking, red
- Metadata: no 📍 emoji, clean text
- RSVP button hover: faint red fill

- [ ] **Step 3: Full browser review — Leadership**

- Page glow visible center-right (subtle)
- Section heading "Executive Board" has left red rule
- Officer cards: surface gradient, avatar halo
- Hover: avatar halo deepens

- [ ] **Step 4: Full browser review — About**

- Page glow visible right (subtle)
- "What We Do" cards: surface gradient, keep hard red left stripe
- Section headings use left red rule
- Mission and Membership body text: no regressions

- [ ] **Step 5: Full browser review — MyEvents (empty)**

Clear RSVPs (`localStorage.clear()` in browser console + reload). Check empty state. Then RSVP to an event, return to MyEvents — check saved event rows show surface gradient.

- [ ] **Step 6: Navbar review**

Check active state (the current page link): should show red underline without hover. Hover non-active links: underline grows from left. Tab through nav with keyboard: focus ring visible on each link.

- [ ] **Step 7: Accessibility spot-check**

Keyboard-navigate the full site (Tab through every interactive element). All focus states must show a visible outline. Nothing added in this pass should interfere with focus visibility.

- [ ] **Step 8: Final commit**

If any minor fixes were needed during review, commit them. Then:

```bash
git log --oneline -12
```

Confirm all feature commits landed cleanly. The branch is ready.
