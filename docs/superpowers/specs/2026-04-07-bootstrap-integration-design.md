# MIMS Club — React Bootstrap Integration Design

**Date:** 2026-04-07
**Status:** Approved
**Scope:** Add React Bootstrap (Option A — minimal) to satisfy CS571 design library requirement

---

## Goal

Integrate React Bootstrap components into the existing MIMS Club site without redesigning or breaking the current dark red/black aesthetic. The requirement is "some use of React Bootstrap or some other design library" — this design satisfies it clearly and verifiably.

---

## Approach: Minimal / Additive

Install React Bootstrap and swap in specific components where they add clear value. Keep all existing custom CSS files. No layout changes, no color changes, no visual regressions.

---

## Bootstrap Components Used

| Component | Replaces | Pages |
|---|---|---|
| `Navbar`, `Nav`, `Nav.Link`, `Container` | Custom `navbar` + `navbar__inner` HTML | `Navbar.jsx` |
| `Badge` | `.red-tag` div | Home, About, Leadership, Events, MyEvents |
| `Button` | `<a className="btn-red">`, `<button>` elements | Home, Events, MyEvents |
| `Card`, `Card.Body`, `Card.Title`, `Card.Text` | `.event-item` rows | Events page |

4 distinct Bootstrap components, used across all 5 pages.

---

## CSS Strategy

1. **Bootstrap CSS imported first** in `src/main.jsx` — app CSS follows and overrides as needed
2. **Bootstrap dark mode** — `data-bs-theme="dark"` added to `<html>` in `index.html`
3. **Bootstrap CSS variable overrides** in `src/index.css`:
   - `--bs-danger: #cc0000` — Buttons/Badges use `variant="danger"`, so this token controls the red color
   - `--bs-primary: #cc0000` — fallback override for any primary-variant elements
   - `--bs-body-bg: #0d0d0d` — matches existing page background
   - `--bs-body-color: #ffffff` — white text default
   - `--bs-card-bg: #1a1a1a` — matches existing surface color
   - `--bs-border-color: #1f1f1f` — matches existing border color
4. **Existing page CSS untouched** — `Home.css`, `About.css`, `Leadership.css`, `Events.css`, `MyEvents.css` stay as-is

---

## File Changeset

| File | Change |
|---|---|
| `package.json` | Add `react-bootstrap` + `bootstrap` to `dependencies` |
| `index.html` | Add `data-bs-theme="dark"` to `<html>` tag |
| `src/main.jsx` | Import `bootstrap/dist/css/bootstrap.min.css` before other imports |
| `src/index.css` | Add Bootstrap CSS variable overrides block |
| `src/components/Navbar.jsx` | Rewrite using `Navbar`, `Nav`, `Nav.Link`, `Container` from react-bootstrap |
| `src/components/Navbar.css` | Slim down — remove rules now handled by Bootstrap + overrides |
| `src/pages/Home.jsx` | `.red-tag` → `Badge`, CTA links → `Button as={Link}` |
| `src/pages/About.jsx` | `.red-tag` → `Badge` |
| `src/pages/Leadership.jsx` | `.red-tag` → `Badge` |
| `src/pages/Events.jsx` | `.red-tag` → `Badge`, `.event-item` → `Card`, RSVP `<button>` → `Button` |
| `src/pages/MyEvents.jsx` | `.red-tag` → `Badge`, links → `Button as={Link}` |

---

## Component Details

### Navbar.jsx
Use `react-bootstrap` `Navbar` with `expand="md"` for mobile collapse support. Use `Nav.Link as={NavLink}` to preserve React Router's active link detection. Wrap in `Container fluid`.

### Badge (all pages)
Replace `<div className="red-tag">TEXT</div>` with `<Badge bg="danger" className="red-tag">TEXT</Badge>`. Keep the `.red-tag` class for letter-spacing and margin CSS already defined in each page's CSS file.

### Button (Home, Events, MyEvents)
Replace `<Link className="btn-red" to="...">` with `<Button as={Link} to="..." variant="danger">`. Replace ghost buttons with `variant="outline-danger"`. Replace `<button className="rsvp-btn">` on Events page with `<Button variant="danger" size="sm">`.

### Card (Events page)
Replace `.event-item` div structure with `<Card className="event-item mb-3">`. Use `Card.Body` for the content area. Date and RSVP button remain positioned using existing CSS flexbox on the outer `.event-item` class applied to the Card.

---

## What Doesn't Change

- All 5 routes and React Router setup
- Page layout structure and CSS
- Data files (`events.js`, `officers.js`)
- Visual design (colors, typography, spacing)
- GitHub Pages deployment config

---

## Requirements Satisfied After Implementation

| Requirement | How |
|---|---|
| Committed & pushed to GitHub | Already done |
| Live on GitHub.io | Already done |
| React Bootstrap or design library | `react-bootstrap` with Navbar, Badge, Button, Card |
| Primary navbar | Bootstrap `Navbar` component |
| 2+ pages with React Router | 5 pages via React Router v6 |
| 5+ components | Navbar + 5 page components = 6 |
