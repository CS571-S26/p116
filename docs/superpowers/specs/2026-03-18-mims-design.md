# MIMS Club Website — Design Spec

**Project:** CS571 Web Project
**Club:** MIMS — Music Industry for Madison Students
**Date:** 2026-03-18
**Stack:** Vite + React + React Router + plain CSS
**Status:** Approved

---

## Overview

A multi-page club website for MIMS at UW-Madison. Phase 1 (current) scaffolds all 5 pages with static content and correct routing. Phase 2 (future) adds working RSVP functionality with localStorage persistence.

---

## Visual Design System

### Palette
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0d0d0d` | Page background |
| `--surface` | `#1a1a1a` | Cards, panels |
| `--border` | `#1f1f1f` | Dividers, outlines |
| `--red` | `#cc0000` | Primary accent, CTAs |
| `--red-hover` | `#ff1a1a` | Button hover state |
| `--text-primary` | `#ffffff` | Headings, names |
| `--text-secondary` | `#777777` | Body text |
| `--text-muted` | `#555555` | Meta, labels |

### Typography
- **Font:** System sans-serif stack (no external fonts for now; Inter or similar can be added in Phase 2)
- **Heading sizes:** 28px (page title), 18px (section title), 13px (nav logo)
- **Body:** 14px, line-height 1.6
- **Labels:** 9–10px, letter-spacing 2–3px, uppercase

### Aesthetic
Full dark — near-black background (#0d0d0d) with red (#cc0000) as the sole accent color. Borders and dividers use subtle dark greys. Buttons are outlined (ghost) by default; filled red for primary CTAs and active states.

---

## Architecture

```
mims-club/
├── public/
│   └── vite.svg
├── src/
│   ├── main.jsx          # ReactDOM.createRoot, BrowserRouter
│   ├── App.jsx           # Route definitions
│   ├── index.css         # Global CSS variables + resets
│   ├── data/
│   │   ├── events.js     # Static event objects
│   │   └── officers.js   # Static officer objects
│   ├── components/
│   │   └── Navbar.jsx    # Shared nav with active link highlighting
│   └── pages/
│       ├── Home.jsx
│       ├── About.jsx
│       ├── Leadership.jsx
│       ├── Events.jsx
│       └── MyEvents.jsx
├── index.html
├── vite.config.js
└── package.json
```

### Routing (React Router v6)
| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page |
| `/about` | `About` | Club overview |
| `/leadership` | `Leadership` | Officer roster |
| `/events` | `Events` | Event listings |
| `/my-events` | `MyEvents` | User's RSVP list |

---

## Page Designs

### Navbar (shared)
- Left: `MIMS` logo in bold white, letter-spaced
- Right: nav links — Home · About · Leadership · Events · My Events
- Active link: red color + 1px red underline
- Bottom border: `1px solid #1f1f1f`
- Sticky, full-width

---

### Home (`/`)

**Hero section:**
- Red tag: `MUSIC INDUSTRY FOR MADISON STUDENTS`
- H1: `Connect. Learn. Grow.`
- Subtext: club one-liner
- Two CTA buttons: `Explore Events →` (red outline) · `About MIMS` (ghost)

**Community section:**
- Label: `JOIN THE COMMUNITY`
- Three social buttons side-by-side, each with brand logo + label:
  | Button | Brand color | Label |
  |---|---|---|
  | Discord | `#5865F2` | Join Discord |
  | GroupMe | `#00AFF0` | Join GroupMe |
  | Instagram | gradient (`#f09433 → #bc1888`) | Follow Instagram |
- Each opens link in new tab (`target="_blank"`)
- Placeholder `href="#"` in Phase 1; real URLs dropped in Phase 2

**Upcoming Events preview:**
- Section heading: `UPCOMING EVENTS`
- Shows first 2 events from the static events list
- Each row: date (red) · title · location · `View →` button
- `View →` links to `/events`

---

### About (`/about`)

- Red tag + H1: `About MIMS`
- **Mission section:** 2–3 sentence paragraph about the club's purpose
- **What We Do:** 2×2 grid of cards (surface background, red left border):
  - Industry Panels
  - Networking Mixers
  - Workshops
  - Career Support
- **Membership section:** Open membership paragraph, meeting cadence info

---

### Leadership (`/leadership`)

- Red tag + H1: `Leadership`
- Subtext: academic year (e.g., 2024–25)
- Officer grid: 3 columns, repeating rows
- Each officer card (surface bg, centered):
  - Avatar circle: initials on dark red bg, red border
  - Name (white, bold)
  - Role (red, small)
- Placeholder officers for Phase 1 (real names/photos in Phase 2 if needed)

**Placeholder officer data:**
| Name | Role |
|---|---|
| Alex Rivera | President |
| Jordan Kim | Vice President |
| Maya Patel | Treasurer |
| Sam Torres | Secretary |
| Lily Chen | Events Director |
| Dev Nguyen | Marketing Lead |

---

### Events (`/events`)

- Red tag + H1: `Upcoming Events`
- Subtext: RSVP prompt
- Event list — each row:
  - **Date** (red, bold, e.g. `MAR 25`)
  - **Title** (white, bold)
  - **Location + time** (muted, with 📍 icon)
  - **Description** (secondary text, 1–2 lines)
  - **RSVP button** (right-aligned):
    - Default: `RSVP` — red outline
    - Active/RSVP'd: `✓ RSVP'd` — red fill

**Phase 1:** Button is static (no click handler). RSVP'd state shown as a visual example on the first event only.

**Phase 2 — RSVP logic (implement later):**
- Click `RSVP` → add event to `localStorage` key `mims_rsvps` (array of event IDs)
- Button toggles to `✓ RSVP'd` (filled) immediately
- Click again → un-RSVP, remove from localStorage, button reverts
- State derived on mount from localStorage

**Placeholder event data:**
| ID | Date | Title | Location | Time | Description |
|---|---|---|---|---|---|
| 1 | MAR 25 | Industry Mixer | Union South | 6:00 PM | Network with professionals from labels, agencies, and management companies. |
| 2 | APR 3 | Label Deep Dive | Music Hall | 7:00 PM | Inside look at how major and indie labels operate, sign artists, and market releases. |
| 3 | APR 17 | Resume Workshop | Ingraham Hall | 5:30 PM | Bring your resume. Industry mentors will give live feedback for music-biz roles. |
| 4 | MAY 2 | End-of-Year Showcase | Memorial Union | 7:00 PM | Celebrate the year with live performances and a farewell to graduating seniors. |

---

### My Events (`/my-events`)

- Red tag + H1: `My Events`
- Subtext: "Events you've RSVP'd to. Saved locally in your browser."

**State A — Has RSVPs:**
- Section heading: `RSVP'D EVENTS (n)` where n = count
- Each saved event row (surface bg, red left border):
  - Title (bold white) + date/location meta (muted)
  - `Remove` button (ghost, right-aligned)

**State B — Empty:**
- Centered empty state box (dark bg, dashed border):
  - 🎵 emoji icon
  - Heading: `No events yet`
  - Subtext: `Head to the Events page and RSVP to something!`
  - `Browse Events →` red outline button → links to `/events`

**Phase 1:** Always renders empty state (no localStorage reads yet).

**Phase 2 — localStorage logic (implement later):**
- On mount: read `mims_rsvps` from localStorage
- Render matching events from the shared events list
- `Remove` → remove ID from localStorage array, re-render
- Count in heading updates reactively

---

## Data

All data is static in Phase 1. Define in `src/data/events.js` and `src/data/officers.js` so Phase 2 can import without restructuring.

```js
// src/data/events.js
export const events = [
  { id: 1, date: 'MAR 25', title: 'Industry Mixer', location: 'Union South', time: '6:00 PM', description: '...' },
  // ...
];

// src/data/officers.js
export const officers = [
  { name: 'Alex Rivera', role: 'President', initials: 'AR' },
  // ...
];
```

---

## Phase 2 Implementation Notes (Future)

When adding RSVP functionality, reference this spec for:
1. `localStorage` key: `mims_rsvps` — JSON array of event IDs (numbers)
2. RSVP toggle lives in a React `useState` hook initialized from localStorage on mount
3. A `useEffect` syncs state back to localStorage on every change
4. My Events derives its list by filtering `events` array against the saved IDs
5. Both Events and My Events pages must stay in sync — lift state to `App.jsx` or use a simple context

When adding animations (Phase 2+):
- Hero: fade-in + slight upward slide on mount
- Event rows: staggered fade-in
- RSVP button: scale pulse on toggle
- Nav: smooth underline transition on active link change
- Library: Framer Motion (same as `pacific-dermatology` project)
