# MIMS Club — RSVP Functionality & Light Polish Design Spec

**Project:** CS571 Web Project — Check-in #3
**Date:** 2026-04-20
**Status:** Approved
**Builds on:** `docs/superpowers/specs/2026-03-18-mims-design.md` (Phase 1 scaffold)

---

## Overview

Phase 2 implements the RSVP interaction that was stubbed out in Phase 1. Users can now RSVP to events from the Events page, see their saved events on the My Events page, and remove RSVPs from either page. State persists across browser sessions via `localStorage`. Light UX polish is added around the RSVP interaction: clear button state labeling, hover affordances, and an inline feedback message on RSVP.

This phase also extracts two new components (`EventCard`, `MyEventRow`) and a sub-component (`FeedbackMessage`), pushing the component count comfortably past the 8-component requirement.

---

## Shared Data

The `events` array lives in `src/data/events.js` — this file was created in Phase 1 and already contains all four events. **No changes are needed to this file.** Both `Events.jsx` and `MyEvents.jsx` import from it.

### Event object shape

```js
// src/data/events.js
{
  id: number,          // unique numeric ID (1, 2, 3, 4)
  date: string,        // display string, e.g. "MAR 25"
  title: string,       // e.g. "Industry Mixer"
  location: string,    // e.g. "Union South"
  time: string,        // e.g. "6:00 PM"
  description: string  // 1–2 sentence description
}
```

---

## State Architecture

### Single source of truth in `App.jsx`

```
App.jsx
  useState<number[]>(rsvpIds)   ← initialized from localStorage on mount
  useEffect → writes rsvpIds to localStorage on every change

  addRSVP(id: number)    → setRsvpIds(prev => prev.includes(id) ? prev : [...prev, id])
  removeRSVP(id: number) → setRsvpIds(prev => prev.filter(x => x !== id))

  <Navbar rsvpCount={rsvpIds.length} />
  <Events rsvpIds={rsvpIds} onRSVP={addRSVP} onUnRSVP={removeRSVP} />
  <MyEvents rsvpIds={rsvpIds} onUnRSVP={removeRSVP} />
```

**localStorage key:** `mims_rsvps` — JSON array of event ID numbers (e.g. `[1, 3]`)

**Initialization (with corruption guard):**
```js
function loadRsvpIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem('mims_rsvps') || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
// used as: useState(loadRsvpIds)
```

**Sync:**
```js
useEffect(() => {
  localStorage.setItem('mims_rsvps', JSON.stringify(rsvpIds))
}, [rsvpIds])
```

**Stale IDs:** If a stored ID has no matching event in the `events` array (e.g. from a future data change), the `filter` in MyEvents silently drops it. This is correct behavior — no error or warning state is needed.

No fake loading state — localStorage is synchronous. No Context — only two pages consume this state.

---

## New & Modified Files

| File | Action | Change |
|---|---|---|
| `src/App.jsx` | Modify | Add rsvpIds state, localStorage sync, pass props |
| `src/components/Navbar.jsx` | Modify | Accept `rsvpCount` prop, render badge |
| `src/components/Navbar.css` | Modify | Badge styles |
| `src/components/EventCard.jsx` | Create | Extracted event row with RSVP logic |
| `src/components/EventCard.css` | Create | EventCard styles (moved/adapted from Events.css) |
| `src/components/FeedbackMessage.jsx` | Create | Inline "Saved to My Events" fade message |
| `src/components/MyEventRow.jsx` | Create | Single saved-event row with Remove button |
| `src/components/MyEventRow.css` | Create | MyEventRow styles |
| `src/pages/Events.jsx` | Modify | Replace inline map with EventCard, receive props |
| `src/pages/Events.css` | Modify | Remove styles now in EventCard.css |
| `src/pages/MyEvents.jsx` | Modify | Add populated state using rsvpIds + events data |
| `src/pages/MyEvents.css` | Modify | Add populated state styles |
| `src/data/events.js` | No change | Already exists; imported by Events and MyEvents |

---

## Component Designs

### `EventCard` (`src/components/EventCard.jsx`)

**Props:**
```
event: EventObject   (shape defined in Shared Data section above)
isRsvpd: boolean
onRSVP: (id: number) => void
onUnRSVP: (id: number) => void
```

**Internal state:** `showFeedback: boolean` — controls the "Saved to My Events" message.

**Behavior:**
- On RSVP click: call `onRSVP(event.id)`, set `showFeedback = true`, auto-clear after 1500ms via `setTimeout`
- On Un-RSVP click: call `onUnRSVP(event.id)` — no feedback needed, removal is self-evident
- `useEffect` cleanup clears the timeout on unmount to prevent state-on-unmounted-component warnings

**List rendering:** Parent `Events.jsx` renders `<EventCard key={event.id} ... />` for each event.

**Layout:**
```
[DATE]  [TITLE]                            [RSVP BUTTON]
        [📍 Location · Time]
        [Description]
        <FeedbackMessage visible={showFeedback} />
```

---

### `FeedbackMessage` (`src/components/FeedbackMessage.jsx`)

**Props:** `visible: boolean`

Always present in the DOM (no conditional render) to avoid layout shift. Controlled by `opacity` transition:

```css
.feedback-message {
  opacity: 0;
  transition: opacity 0.2s;
  color: var(--text-muted);   /* #555555 — matches the existing muted palette */
  font-size: 12px;
  margin-top: 4px;
}
.feedback-message--visible {
  opacity: 1;
}
```

**Text:** `"✓ Saved to My Events"` — the `✓` is a Unicode character (`U+2713`), no icon library needed.

The muted color (`--text-muted`, `#555555`) is intentional — this is a subtle confirmation, not a prominent success alert. Green would introduce a new color not in the Phase 1 palette.

---

### RSVP Button States

| State | Label | Bootstrap Variant | Hover behavior |
|---|---|---|---|
| Not RSVP'd | `RSVP` | `outline-danger` | Fills red (Bootstrap default) |
| RSVP'd | `✓ RSVP'd` | `danger` | Label changes to `Remove` |

The hover label swap on the RSVP'd state is implemented via React `onMouseEnter` / `onMouseLeave` on the button, setting local `hovered: boolean` state. CSS `::after` content tricks are not used — Bootstrap overrides make them unreliable on `<Button>` components.

---

### `MyEventRow` (`src/components/MyEventRow.jsx`)

**Props:**
```
event: EventObject   (same shape as EventCard)
onUnRSVP: (id: number) => void
```

Renders a surface-bg row with:
- Left red border (matching the About page card style — `border-left: 3px solid var(--red)`)
- Event title (bold white) + date · location (muted, `var(--text-muted)`)
- `Remove` button (Bootstrap `outline-danger` sm, right-aligned) — calls `onUnRSVP(event.id)`

---

### `MyEvents` — Two States

**State A — Has RSVPs:**
```
RSVP'D EVENTS (3)   ← section heading with live count
────────────────────
<MyEventRow key={event.id} /> × n
```

Events are derived by filtering the shared `events` array against `rsvpIds`:
```js
import { events } from '../data/events'
const rsvpdEvents = events.filter(e => rsvpIds.includes(e.id))
```

Unmatched IDs (stale) are silently excluded by the filter — no error state needed.

**State B — Empty:**
Unchanged from Phase 1 — centered empty state with 🎵 icon and "Browse Events →" link. Appears automatically when `rsvpdEvents.length === 0`.

---

### Navbar Badge

`Navbar` receives `rsvpCount: number` prop.

When `rsvpCount > 0`, renders a small red pill badge inline after the "My Events" link text:

```jsx
<NavLink to="/my-events">
  My Events {rsvpCount > 0 && <span className="navbar__badge">{rsvpCount}</span>}
</NavLink>
```

**Badge CSS:**
```css
.navbar__badge {
  display: inline-block;
  background: var(--red);       /* #cc0000 */
  color: #fff;                  /* hardcoded white — NOT a Bootstrap utility class */
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
  margin-left: 4px;
  vertical-align: middle;
  line-height: 1.6;
}
```

**Note:** Text color is hardcoded `#fff`, not a Bootstrap color utility class. This avoids the red-on-red text bug from Phase 1 (`dd37f2d`) where a Bootstrap override caused red text on a red background.

---

## Component Count (post Phase 2)

| # | Component | Type | Phase |
|---|---|---|---|
| 1 | `Navbar` | Shared component | Phase 1 (modified) |
| 2 | `EventCard` | New component | Phase 2 |
| 3 | `FeedbackMessage` | New sub-component | Phase 2 |
| 4 | `MyEventRow` | New component | Phase 2 |
| 5 | `Home` | Page component | Phase 1 |
| 6 | `About` | Page component | Phase 1 |
| 7 | `Leadership` | Page component | Phase 1 |
| 8 | `Events` | Page component | Phase 1 (modified) |
| 9 | `MyEvents` | Page component | Phase 1 (modified) |

Total: **9 named React components** — comfortably exceeds the 8-component requirement.

---

## UX Polish Summary

- **RSVP button transition:** CSS `transition: background 0.15s, color 0.15s` (already in place from Phase 1)
- **Hover "Remove" label:** React `onMouseEnter/Leave` state on the RSVP button when in RSVP'd state
- **Feedback message:** Always in DOM, `opacity` transition 0→1 over 200ms, auto-hidden after 1500ms
- **Navbar badge:** Live count appears/disappears as RSVPs change
- **Remove row:** Disappears instantly when removed (exit animation deferred to Phase 3)

---

## Phase 3 Ideas (deferred)

- **Framer Motion animations:** staggered event list entrance, spring scale pulse on RSVP toggle, page transition fade, animated exit on MyEventRow remove
- **Event detail modal:** click a card to see full event details in a Bootstrap Modal
- **Filter/search bar** on Events page (by date, keyword)
- **Full design pass:** spacing, typography refinements, Inter font, hero section visual upgrade
- **Real data:** actual officer photos, real Discord/GroupMe/Instagram links

---

## Out of Scope (this phase)

- No React Context (Approach A with lifted state is sufficient)
- No Framer Motion (CSS transitions only)
- No fake loading/disabled states (localStorage is synchronous)
- No filter or search on Events page
- No event detail pages or modals
