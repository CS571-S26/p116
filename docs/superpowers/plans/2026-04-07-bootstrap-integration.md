# React Bootstrap Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add React Bootstrap components (Navbar, Badge, Button, Card) to the MIMS Club site to satisfy the CS571 design library requirement without changing the existing dark red/black aesthetic.

**Architecture:** Install `react-bootstrap` + `bootstrap`, configure Bootstrap dark mode and CSS variable overrides, then swap in Bootstrap components file-by-file. All existing custom CSS is preserved — Bootstrap sits on top with overrides applied at the `:root` level.

**Tech Stack:** Vite 5, React 18, React Router v6, React Bootstrap 2.x, Bootstrap 5.x

**Spec:** `docs/superpowers/specs/2026-04-07-bootstrap-integration-design.md`

---

## Chunk 1: Installation and Configuration

### Task 1: Install packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install react-bootstrap and bootstrap**

Run from `/Users/kanuj/mims-club`:
```bash
npm install react-bootstrap bootstrap
```

Expected: both packages appear in `node_modules/`, `package.json` `dependencies` now includes `"bootstrap": "^5.x.x"` and `"react-bootstrap": "^2.x.x"`

- [ ] **Step 2: Verify install succeeded**

```bash
npm run build
```

Expected: build completes with no errors. (Site not yet changed — this just confirms the packages don't break the build.)

---

### Task 2: Enable Bootstrap dark mode

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add `data-bs-theme="dark"` to the `<html>` tag**

Current line 2:
```html
<html lang="en">
```

Change to:
```html
<html lang="en" data-bs-theme="dark">
```

This tells Bootstrap 5.3+ to apply dark-mode defaults globally (dark card backgrounds, light text, etc.) without any JS needed.

---

### Task 3: Import Bootstrap CSS and add variable overrides

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/index.css`

- [ ] **Step 1: Import Bootstrap CSS in `src/main.jsx` before app CSS**

Current `src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
```

Change to:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
```

Bootstrap must come **before** `index.css` so our custom CSS wins the cascade.

- [ ] **Step 2: Add Bootstrap CSS variable overrides to `src/index.css`**

Add the following block immediately after the `/* ── Design Tokens ── */` `:root` block (after line 11, before the `/* ── Reset ── */` comment):

```css
/* ── Bootstrap Overrides ── */
:root,
[data-bs-theme="dark"] {
  --bs-danger: #cc0000;
  --bs-danger-rgb: 204, 0, 0;
  --bs-primary: #cc0000;
  --bs-primary-rgb: 204, 0, 0;
  --bs-body-bg: #0d0d0d;
  --bs-body-color: #ffffff;
  --bs-card-bg: #1a1a1a;
  --bs-card-border-color: #1f1f1f;
  --bs-border-color: #1f1f1f;
}
```

`--bs-danger` and `--bs-danger-rgb` are both required — Bootstrap computes alpha variants from the RGB triplet. Without the RGB token, semi-transparent danger colors (hover states, focus rings) will be wrong.

- [ ] **Step 3: Verify Bootstrap loaded and overrides apply**

```bash
npm run dev
```

Open http://localhost:5173. The page should look essentially unchanged — same dark background, same text. If Bootstrap's default light background appears, the import order is wrong (Bootstrap after index.css).

- [ ] **Step 4: Commit configuration**

```bash
git add index.html src/main.jsx src/index.css package.json package-lock.json
git commit -m "feat: install react-bootstrap and configure dark mode overrides"
```

---

## Chunk 2: Component Updates

### Task 4: Replace Navbar with Bootstrap Navbar

**Files:**
- Modify: `src/components/Navbar.jsx`
- Modify: `src/components/Navbar.css`

- [ ] **Step 1: Rewrite `src/components/Navbar.jsx`**

Replace the entire file with:

```jsx
import { NavLink } from 'react-router-dom'
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap'
import './Navbar.css'

export default function Navbar() {
  return (
    <BsNavbar className="mims-navbar" expand="md" sticky="top">
      <Container fluid className="mims-navbar__inner">
        <BsNavbar.Brand as={NavLink} to="/" className="mims-navbar__logo">
          MIMS
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="main-nav" />
        <BsNavbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/about">About</Nav.Link>
            <Nav.Link as={NavLink} to="/leadership">Leadership</Nav.Link>
            <Nav.Link as={NavLink} to="/events">Events</Nav.Link>
            <Nav.Link as={NavLink} to="/my-events">My Events</Nav.Link>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}
```

Key points:
- `as={NavLink}` on `Nav.Link` preserves React Router's active class detection
- `expand="md"` gives a hamburger menu on mobile (bonus)
- `sticky="top"` replaces the custom `position: sticky` CSS

- [ ] **Step 2: Update `src/components/Navbar.css`**

Replace the entire file with the slimmer version (Bootstrap handles layout, sticky, and flex — we only need brand styling and active link override):

```css
.mims-navbar {
  background: var(--bg) !important;
  border-bottom: 1px solid var(--border);
}

.mims-navbar__inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px;
}

.mims-navbar__logo {
  color: var(--text-primary) !important;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 3px;
  text-decoration: none;
}

/* Nav links */
.mims-navbar .nav-link {
  color: var(--text-muted) !important;
  font-size: 12px;
  padding-bottom: 2px;
}

.mims-navbar .nav-link:hover {
  color: var(--text-secondary) !important;
}

/* React Router sets .active on NavLink when route matches */
.mims-navbar .nav-link.active {
  color: var(--red) !important;
  border-bottom: 1px solid var(--red);
}

/* Bootstrap mobile toggle button */
.mims-navbar .navbar-toggler {
  border-color: var(--border);
}

.mims-navbar .navbar-toggler-icon {
  filter: invert(1);
}
```

- [ ] **Step 3: Verify Navbar in browser**

```bash
npm run dev
```

Check:
- Navbar renders dark background, "MIMS" logo on left, links on right
- Active link is red with underline
- At narrow viewport (< 768px) a hamburger icon appears and links collapse

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.jsx src/components/Navbar.css
git commit -m "feat: replace custom Navbar with Bootstrap Navbar component"
```

---

### Task 5: Replace `.red-tag` with Bootstrap Badge (all pages)

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/About.jsx`
- Modify: `src/pages/Leadership.jsx`
- Modify: `src/pages/Events.jsx`
- Modify: `src/pages/MyEvents.jsx`

The `.red-tag` class in `index.css` controls letter-spacing, font-size, and margin. We keep it on the Badge so that styling is preserved — Bootstrap Badge just adds the component semantics.

- [ ] **Step 1: Update `src/pages/Home.jsx`**

Add import at top (after existing imports):
```jsx
import { Badge } from 'react-bootstrap'
```

Replace:
```jsx
<div className="red-tag">Music Industry for Madison Students</div>
```
With:
```jsx
<Badge bg="danger" className="red-tag">Music Industry for Madison Students</Badge>
```

Replace:
```jsx
<div className="red-tag" style={{ marginBottom: '12px' }}>Join the Community</div>
```
With:
```jsx
<Badge bg="danger" className="red-tag" style={{ marginBottom: '12px' }}>Join the Community</Badge>
```

Replace:
```jsx
<div className="section-heading">Upcoming Events</div>
```
With (this one stays as-is — it's a section heading, not a red tag).

- [ ] **Step 2: Update `src/pages/About.jsx`**

Add import:
```jsx
import { Badge } from 'react-bootstrap'
```

Replace:
```jsx
<div className="red-tag">Who We Are</div>
```
With:
```jsx
<Badge bg="danger" className="red-tag">Who We Are</Badge>
```

- [ ] **Step 3: Update `src/pages/Leadership.jsx`**

Add import:
```jsx
import { Badge } from 'react-bootstrap'
```

Replace:
```jsx
<div className="red-tag">The Team</div>
```
With:
```jsx
<Badge bg="danger" className="red-tag">The Team</Badge>
```

- [ ] **Step 4: Update `src/pages/Events.jsx`**

Add import:
```jsx
import { Badge } from 'react-bootstrap'
```

Replace:
```jsx
<div className="red-tag">What's Happening</div>
```
With:
```jsx
<Badge bg="danger" className="red-tag">What's Happening</Badge>
```

- [ ] **Step 5: Update `src/pages/MyEvents.jsx`**

Add import:
```jsx
import { Badge } from 'react-bootstrap'
```

Replace:
```jsx
<div className="red-tag">Your Schedule</div>
```
With:
```jsx
<Badge bg="danger" className="red-tag">Your Schedule</Badge>
```

- [ ] **Step 6: Verify all pages in browser**

```bash
npm run dev
```

Visit each route — `/`, `/about`, `/leadership`, `/events`, `/my-events`. Each page should show the red tag label at the top. It should look identical to before (same red color, same small uppercase text) since `.red-tag` CSS is still in `index.css`.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Home.jsx src/pages/About.jsx src/pages/Leadership.jsx src/pages/Events.jsx src/pages/MyEvents.jsx
git commit -m "feat: replace red-tag divs with Bootstrap Badge component"
```

---

### Task 6: Replace buttons/links with Bootstrap Button (Home, MyEvents)

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/MyEvents.jsx`

- [ ] **Step 1: Update `src/pages/Home.jsx` — hero CTA buttons**

Add `Button` to the existing `react-bootstrap` import:
```jsx
import { Badge, Button } from 'react-bootstrap'
```

Replace the two hero buttons:
```jsx
<Link to="/events" className="btn-red">Explore Events →</Link>
<Link to="/about" className="btn-ghost">About MIMS</Link>
```
With:
```jsx
<Button as={Link} to="/events" variant="outline-danger" size="sm">Explore Events →</Button>
<Button as={Link} to="/about" variant="outline-secondary" size="sm">About MIMS</Button>
```

Replace the event preview "View →" buttons (inside the `.map()`):
```jsx
<Link to="/events" className="btn-red">View →</Link>
```
With:
```jsx
<Button as={Link} to="/events" variant="outline-danger" size="sm">View →</Button>
```

Note: the `.section-heading` div (`<div className="section-heading">Upcoming Events</div>`) is **not** a red-tag — leave it unchanged.

- [ ] **Step 2: Update `src/pages/MyEvents.jsx` — empty state button**

Add import:
```jsx
import { Badge, Button } from 'react-bootstrap'
```

Replace:
```jsx
<Link to="/events" className="btn-red">Browse Events →</Link>
```
With:
```jsx
<Button as={Link} to="/events" variant="outline-danger" size="sm">Browse Events →</Button>
```

- [ ] **Step 3: Verify buttons in browser**

Visit `/` and `/my-events`. Buttons should render red-outlined, matching the existing aesthetic. Hover state should show red fill (Bootstrap's `outline-danger` hover behavior).

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx src/pages/MyEvents.jsx
git commit -m "feat: replace custom buttons with Bootstrap Button component"
```

---

### Task 7: Replace event items with Bootstrap Card (Events page)

**Files:**
- Modify: `src/pages/Events.jsx`
- Modify: `src/pages/Events.css`

- [ ] **Step 1: Update `src/pages/Events.jsx`**

Replace the entire file with:

```jsx
import { Badge, Button, Card } from 'react-bootstrap'
import { events } from '../data/events'
import './Events.css'

export default function Events() {
  return (
    <div className="page">
      <Badge bg="danger" className="red-tag">What's Happening</Badge>
      <h1 className="page-title">Upcoming Events</h1>
      <p className="page-subtitle">RSVP to save events to your personal list.</p>
      <hr className="divider" />
      <div className="events__list">
        {events.map((event, index) => (
          <Card key={event.id} className="event-card mb-3">
            <Card.Body className="event-card__body">
              <div className="event-card__date">{event.date}</div>
              <div className="event-card__content">
                <Card.Title className="event-card__title">{event.title}</Card.Title>
                <Card.Subtitle className="event-card__meta mb-1">
                  📍 {event.location} · {event.time}
                </Card.Subtitle>
                <Card.Text className="event-card__desc">{event.description}</Card.Text>
              </div>
              <Button
                variant={index === 0 ? 'danger' : 'outline-danger'}
                size="sm"
                className="event-card__rsvp"
              >
                {index === 0 ? '✓ RSVP\'d' : 'RSVP'}
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update `src/pages/Events.css`**

The old `.event-item` styles need to be replaced with `.event-card` styles that work with Bootstrap Card's structure. Replace the contents of `Events.css` — keep only what Bootstrap doesn't provide:

```css
.events__list {
  display: flex;
  flex-direction: column;
}

.event-card {
  background: var(--surface) !important;
  border-color: var(--border) !important;
}

.event-card__body {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px !important;
}

.event-card__date {
  color: var(--red);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  min-width: 48px;
  padding-top: 2px;
}

.event-card__content {
  flex: 1;
}

.event-card__title {
  color: var(--text-primary) !important;
  font-size: 15px !important;
  font-weight: 700 !important;
  margin-bottom: 4px !important;
}

.event-card__meta {
  color: var(--text-muted) !important;
  font-size: 12px !important;
}

.event-card__desc {
  color: var(--text-secondary) !important;
  font-size: 13px !important;
  margin-top: 6px !important;
  margin-bottom: 0 !important;
}

.event-card__rsvp {
  align-self: center;
  flex-shrink: 0;
  font-size: 11px !important;
  letter-spacing: 1px;
}
```

- [ ] **Step 3: Verify Events page in browser**

Visit `/events`. Should show 4 event cards with dark surface background, red date on left, title/meta/description in center, RSVP button on right. First event shows filled red "✓ RSVP'd" button, others show outlined "RSVP".

- [ ] **Step 4: Commit**

```bash
git add src/pages/Events.jsx src/pages/Events.css
git commit -m "feat: replace event rows with Bootstrap Card component"
```

---

## Chunk 3: Final Verification and Deploy

### Task 8: Full build and GitHub Pages deploy

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: `dist/` folder created, no errors, no warnings about missing modules.

- [ ] **Step 2: Preview production build locally**

```bash
npm run preview
```

Open http://localhost:4173. Visit all 5 pages (`/`, `/about`, `/leadership`, `/events`, `/my-events`) and verify:
- Dark background throughout
- Red accent on badges, active nav link, buttons, event dates
- No visual regressions (layout unchanged from before)
- Bootstrap Navbar collapses on narrow viewport
- Event cards display correctly

- [ ] **Step 3: Push to GitHub**

```bash
git push origin main
```

GitHub Actions (or Pages auto-deploy) will rebuild and deploy. Verify the live site at your GitHub Pages URL after ~1 minute.

- [ ] **Step 4: Confirm live site**

Open the GitHub Pages URL. Confirm all pages load, Navbar works, no 404s.
