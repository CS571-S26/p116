# MIMS Club — Final Design Overhaul Spec

**Project:** CS571 Web Project — Final Submission Pass
**Date:** 2026-04-29
**Status:** Approved
**Builds on:** `2026-04-20-rsvp-functionality-design.md` (Phase 2 RSVP)

---

## Overview

Phase 3 is a design overhaul targeting final-submission quality. All existing functionality is preserved. The pass covers: component extraction to hit the 12-component rubric requirement, color/typography polish, cinematic depth visual direction, Framer Motion animations (tasteful, "somewhere in between"), and accessibility fixes. No new features or pages are added.

---

## Guiding Principles

- **Clean/professional over flashy** — every design decision is graded on whether it looks submission-quality, not portfolio-showpiece quality
- **Events/RSVP/MyEvents is the interaction centerpiece** — the strongest motion and polish live here
- **Accessibility is a hard requirement** — WCAG AA contrast, correct heading structure, visible focus states
- **No feature creep** — if it isn't listed here, don't add it

---

## 1. Color System

### Updated design tokens (`src/index.css`)

| Token | Old value | New value | Notes |
|---|---|---|---|
| `--red` | `#cc0000` | `#cc0000` | Unchanged — used for backgrounds only (filled buttons, badges). White text on this passes WCAG AA (~5.9:1). |
| `--red-text` | *(new)* | `#ff3333` | New token for red text on dark backgrounds. Contrast on `#0d0d0d`: 4.88:1 ✅. Used for: nav active links, outline button text/border, date labels. |
| `--red-hover` | `#ff1a1a` | `#ff4444` | Hover state, keeps existing feel |
| `--text-primary` | `#ffffff` | `#ffffff` | Unchanged |
| `--text-secondary` | `#777777` | `#aaaaaa` | Bumped — old value was borderline failing (4.49:1). New: 7.6:1 ✅. Used for body paragraphs. |
| `--text-muted` | `#555555` | `#888888` | Bumped — old value clearly failing (2.7:1). New: 5.4:1 ✅. Used for meta labels, event locations, dates. |
| `--surface` | `#1a1a1a` | `#1a1a1a` | Unchanged |
| `--surface-raised` | *(new)* | `#161616` | New token. Used for event cards and officer cards — slightly lifts them off the page bg for cinematic depth. |
| `--bg` | `#0d0d0d` | `#0d0d0d` | Unchanged |
| `--border` | `#1f1f1f` | `#252525` | Slightly more visible — was nearly invisible on dark surface |

**Bootstrap override additions:** `--bs-danger` is kept at `#cc0000` for filled button backgrounds. Outline button text color is overridden via `.btn-outline-danger` CSS rule to use `var(--red-text)`.

---

## 2. Typography

- Add **Inter** font via Google Fonts CDN in `index.html`:
  `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">`
- Update `font-family` in `index.css` body rule:
  `font-family: 'Inter', system-ui, -apple-system, sans-serif;`
- **Home H1 size:** `clamp(36px, 6vw, 56px)` — responsive, scales on mobile without clipping
- No other type scale changes. The existing hierarchy is solid.

---

## 3. Component Architecture

### Post-overhaul component inventory (12 total)

| # | Component | File | Status | Why meaningful |
|---|---|---|---|---|
| 1 | `Navbar` | `components/Navbar.jsx` | Polish | Shared nav, active state, RSVP badge |
| 2 | `EventCard` | `components/EventCard.jsx` | Polish | RSVP interaction centerpiece |
| 3 | `FeedbackMessage` | `components/FeedbackMessage.jsx` | Color fix | RSVP confirmation message |
| 4 | `MyEventRow` | `components/MyEventRow.jsx` | Polish + exit animation | Saved event row with remove |
| 5 | `Home` | `pages/Home.jsx` | Polish | Landing page |
| 6 | `About` | `pages/About.jsx` | Heading fix + PageHeader | Club overview |
| 7 | `Leadership` | `pages/Leadership.jsx` | OfficerCard extraction | Officer roster |
| 8 | `Events` | `pages/Events.jsx` | Polish | Event list — visual centrepiece |
| 9 | `MyEvents` | `pages/MyEvents.jsx` | Polish | Personal RSVP list |
| **10** | **`OfficerCard`** | **`components/OfficerCard.jsx`** | **New** | Extracted from Leadership inline map. Props: `officer: { name, role, initials }`. Renders avatar circle + name + role. |
| **11** | **`PageHeader`** | **`components/PageHeader.jsx`** | **New** | Shared header used on all 5 pages. Props: `tag` (string), `title` (string), `subtitle?` (string). Renders red badge + h1 + optional subtitle + `<hr className="divider">`. Eliminates repeated pattern across codebase. |
| **12** | **`AnimatedPage`** | **`components/AnimatedPage.jsx`** | **New** | Framer Motion page transition wrapper. Wraps every page route. Centralizes animation config. Respects `prefers-reduced-motion`. |

**Verification requirement:** After implementation, count the components actually imported and rendered in the app. The target is 12 meaningfully-used components, not just 12 files.

---

## 4. Per-Page Layout Changes

### Navbar (`components/Navbar.jsx` + `Navbar.css`)
- Active link color: change from Bootstrap `--bs-danger` to `var(--red-text)` for WCAG compliance
- Add visible keyboard **focus ring** on all nav links: `outline: 2px solid var(--red-text); outline-offset: 3px` (apply via `:focus-visible` to avoid showing on mouse clicks)
- Increase nav horizontal padding slightly for breathing room

### Home (`pages/Home.jsx` + `Home.css`)
- Use `<PageHeader>` for the red tag (the hero already has an h1, so PageHeader variant: no divider in hero)
  - Actually: Home's hero is structurally different from other pages (it has its own layout). Don't force PageHeader into the hero — only use PageHeader on the 4 inner pages (About, Leadership, Events, MyEvents). Home's hero stays hand-crafted. PageHeader still gets used 4/5 pages.
- H1: add `clamp(36px, 6vw, 56px)` responsive size
- Hero: add subtle `radial-gradient(ellipse at 85% 0%, rgba(204,0,0,0.10) 0%, transparent 60%)` behind the hero section
- Update `.home__event-date` to use `var(--red-text)` instead of `var(--red)` (text-on-dark fix)

### About (`pages/About.jsx` + `About.css`)
- Use `<PageHeader tag="Who We Are" title="About MIMS" />`
- **Fix heading skip:** The "What We Do" grid currently uses `<h3>` card titles with no `<h2>` between the page `<h1>` and them. Change card titles to `<h2>` (or use a div if a heading at that level feels wrong — but a heading is semantically appropriate here since each "What We Do" item is a distinct subsection).
- The section-heading divs ("Our Mission", "What We Do", "Membership") are styled divs, not headings — this is fine as long as the real heading hierarchy is clean.

### Leadership (`pages/Leadership.jsx` + `Leadership.css`)
- Use `<PageHeader tag="The Team" title="Leadership" subtitle="Meet the officers running MIMS for 2024–25." />`
- Extract `OfficerCard` component — Leadership renders `officers.map(o => <OfficerCard key={o.id} officer={o} />)`
- Stagger `OfficerCard` entrance with Framer Motion (see Section 5)

### Events (`pages/Events.jsx` + `Events.css`)
- Use `<PageHeader tag="What's Happening" title="Upcoming Events" subtitle="RSVP to save events to your personal list." />`
- `EventCard` gets: `border-left: 3px solid var(--red)`, `background: var(--surface-raised)`, `box-shadow: 0 4px 20px rgba(0,0,0,0.35)`
- **Fix heading skip:** `Card.Title` currently renders as `<h5>` by default in React Bootstrap. Event titles are list items, not document sections — change to `<Card.Title as="div">`.
- Stagger EventCard entrance (see Section 5)

### MyEvents (`pages/MyEvents.jsx` + `MyEvents.css`)
- Use `<PageHeader tag="Your Schedule" title="My Events" subtitle="Events you've RSVP'd to. Saved locally in your browser." />`
- `MyEventRow` exit animation via `AnimatePresence` (see Section 5)
- Polish empty state: tighten spacing, ensure "No events yet" renders as `<h2>` (it currently does — good)

---

## 5. Framer Motion

### Installation
```
npm install framer-motion
```

### `AnimatedPage` (`components/AnimatedPage.jsx`)

```jsx
import { motion, useReducedMotion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
}

export default function AnimatedPage({ children }) {
  const prefersReduced = useReducedMotion()
  const v = prefersReduced ? reducedVariants : variants
  return (
    <motion.div
      variants={v}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

### `App.jsx` — AnimatePresence

Wrap `<Routes>` in `<AnimatePresence mode="wait">`. Pass `location` key for route-aware transitions:

```jsx
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

// inside App:
const location = useLocation()
return (
  <>
    <Navbar rsvpCount={rsvpIds.length} />
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        ...
      </Routes>
    </AnimatePresence>
  </>
)
```

Each page component wraps its content in `<AnimatedPage>`.

### Hero stagger (Home)

Wrap the hero `<section>` children in a `motion.div` with `staggerChildren: 0.08`. Each child (tag, h1, p, buttons) gets `variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}`.

### EventCard list entrance

In `Events.jsx`, wrap the list in a `motion.div` with `variants={{ visible: { transition: { staggerChildren: 0.06 } } }}`. Each `EventCard` gets fade-up entrance. `EventCard` itself: `whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300 } }}`.

### RSVP interaction (strongest motion)

In `EventCard`:
- Wrap the RSVP `<Button>` in `<motion.div whileTap={{ scale: 0.93 }}>`
- On RSVP (when `handleRSVP` fires): animate the button wrapper with a spring scale 1 → 1.10 → 1 using `useAnimate` or a `key`-driven `motion.div` re-mount trick

### MyEventRow exit animation

In `MyEvents.jsx`, wrap the list in `<AnimatePresence>`. Each `MyEventRow` gets:
```jsx
<motion.div
  key={event.id}
  exit={{ opacity: 0, x: -16 }}
  transition={{ duration: 0.18 }}
>
  <MyEventRow ... />
</motion.div>
```

### OfficerCard stagger

Same pattern as EventCard list — `staggerChildren: 0.05` in Leadership's grid.

### Reduced motion

`useReducedMotion()` in `AnimatedPage` disables transforms (opacity-only fades). For inline `whileHover`/`whileTap`, check the hook result in EventCard and disable transforms when true.

---

## 6. Accessibility Audit Checklist

| Requirement | Status | Action |
|---|---|---|
| No skipped heading levels | ⚠️ Fix needed | About: h3 titles → h2. Events: Card.Title `as="div"`. MyEvents empty state h2 is fine. |
| Alt text on images | ✅ Trivially met | No `<img>` tags exist in the codebase. Officer cards use CSS/text initials, not images. |
| WCAG AA color contrast | ⚠️ Fix needed | `--text-muted`, `--text-secondary`, and red-text-on-dark all updated. |
| All inputs labeled | ✅ Trivially met | No form inputs exist in this app. **Verify after implementation that this remains true.** |
| Forms completable via keyboard | ✅ Trivially met | No forms. Same verification note. |
| Focus states on interactive elements | ⚠️ Add explicitly | Add `:focus-visible` ring (2px solid `--red-text`, offset 3px) to: nav links, RSVP buttons, Remove buttons, social links on Home. |
| Navbar present and functional | ✅ Already working | Polish pass only |

---

## 7. Implementation Sequence

1. **Install Framer Motion:** `npm install framer-motion`
2. **Color tokens:** Update `index.css` with new tokens
3. **Typography:** Add Inter to `index.html`, update `font-family` in `index.css`
4. **Extract components:** `OfficerCard`, `PageHeader`, `AnimatedPage`
5. **Wire AnimatedPage:** Add `AnimatePresence` to `App.jsx`, wrap each page
6. **CSS polish pass:** Navbar, Home hero, EventCard, About, Leadership, Events, MyEvents — in that order
7. **Accessibility fixes:** Heading levels (About, Events), focus states across all interactive elements
8. **Framer Motion:** Hero stagger → EventCard list → RSVP interaction → MyEventRow exit → OfficerCard stagger
9. **Final verification pass:** Component count, heading structure, contrast, forms/inputs check, functionality check

---

## 8. Final Rubric Checklist (run after implementation)

- [ ] Committed and pushed to GitHub
- [ ] Live and functional on GitHub Pages (https://kanujv.github.io/mims-club/ or equivalent)
- [ ] Consistent React Bootstrap usage throughout
- [ ] Primary navbar present, functional, visually polished, correct active states
- [ ] 5 pages fully developed with React Router (Home, About, Leadership, Events, MyEvents)
- [ ] 12 components defined and meaningfully used (verify actual imports, not just file count)
- [ ] Meaningfully interactable element: RSVP / Events / My Events flow is polished and functional
- [ ] Thoughtful design principles: visual hierarchy, spacing, contrast, motion, cohesion
- [ ] No skipped heading levels (verify with browser devtools or axe)
- [ ] Appropriate alt text (no img tags — trivially satisfied, but confirm)
- [ ] WCAG AA color contrast (verify with browser contrast checker)
- [ ] All inputs labeled (no inputs — trivially satisfied, but confirm)
- [ ] All forms keyboard-completable (no forms — trivially satisfied, but confirm)
- [ ] Focus states visible on keyboard navigation (nav, RSVP, Remove buttons)

---

## Out of Scope

- No new pages or routes
- No backend or server-side logic
- No images (richness from gradients, shadows, Inter font, and motion is sufficient)
- No event detail modals or filter/search
- No React Context (lifted state in App.jsx is still sufficient)
- No changes to event or officer data
