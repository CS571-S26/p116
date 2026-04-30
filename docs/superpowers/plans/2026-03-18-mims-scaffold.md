# MIMS Club Website — Scaffold Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a 5-page React + Vite + React Router website for the MIMS club with static content, correct routing, a shared Navbar, and a design system — no working RSVP logic yet.

**Architecture:** Vite bootstraps the app; React Router v6 handles client-side routing across 5 pages. A single shared `Navbar` component handles nav and active-link highlighting. All page content is static; event and officer data live in dedicated data files so Phase 2 can wire them up without restructuring.

**Tech Stack:** Node.js/npm, Vite, React 18, React Router DOM v6, plain CSS (CSS custom properties)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `package.json` | Create | Dependencies, scripts |
| `vite.config.js` | Create | Vite config |
| `index.html` | Create | HTML entry point |
| `src/main.jsx` | Create | App mount + BrowserRouter |
| `src/App.jsx` | Create | Route definitions |
| `src/index.css` | Create | CSS variables, resets, shared utility classes |
| `src/data/events.js` | Create | Static event objects |
| `src/data/officers.js` | Create | Static officer objects |
| `src/components/Navbar.jsx` | Create | Shared nav, active link |
| `src/components/Navbar.css` | Create | Navbar styles |
| `src/pages/Home.jsx` | Create | Landing page |
| `src/pages/Home.css` | Create | Home styles |
| `src/pages/About.jsx` | Create | Club overview |
| `src/pages/About.css` | Create | About styles |
| `src/pages/Leadership.jsx` | Create | Officer roster |
| `src/pages/Leadership.css` | Create | Leadership styles |
| `src/pages/Events.jsx` | Create | Event listings |
| `src/pages/Events.css` | Create | Events styles |
| `src/pages/MyEvents.jsx` | Create | RSVP list (empty state only) |
| `src/pages/MyEvents.css` | Create | MyEvents styles |

---

## Chunk 1: Project Bootstrap

### Task 1: Initialize the repo and Vite project

**Files:**
- Create: `mims-club/` (directory, already exists at `/Users/kanuj/mims-club`)
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`

- [ ] **Step 1: Init git repo**

```bash
cd /Users/kanuj/mims-club
git init
```

Expected: `Initialized empty Git repository in .../mims-club/.git/`

- [ ] **Step 2: Create package.json**

Create `package.json`:

```json
{
  "name": "mims-club",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.3.1"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 4: Create vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 5: Create index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MIMS — Music Industry for Madison Students</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create .gitignore**

```
node_modules/
dist/
.DS_Store
.superpowers/
```

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html .gitignore
git commit -m "chore: init Vite + React + React Router project"
```

---

### Task 2: Create entry point and design system CSS

**Files:**
- Create: `src/main.jsx`
- Create: `src/index.css`

- [ ] **Step 1: Create src/main.jsx**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 2: Create src/index.css**

```css
/* ── Design Tokens ── */
:root {
  --bg: #0d0d0d;
  --surface: #1a1a1a;
  --border: #1f1f1f;
  --red: #cc0000;
  --red-hover: #ff1a1a;
  --text-primary: #ffffff;
  --text-secondary: #777777;
  --text-muted: #555555;
}

/* ── Reset ── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  font-family: inherit;
}

/* ── Shared Utilities ── */
.page {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px;
}

.red-tag {
  color: var(--red);
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.page-title {
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 6px;
}

.page-subtitle {
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 20px;
}

.divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 20px 0;
}

.section-heading {
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 14px;
}

.btn-red {
  display: inline-block;
  border: 1px solid var(--red);
  color: var(--red);
  font-size: 12px;
  padding: 8px 18px;
  background: transparent;
  transition: background 0.15s, color 0.15s;
}

.btn-red:hover {
  background: var(--red);
  color: #fff;
}

.btn-ghost {
  display: inline-block;
  border: 1px solid #333;
  color: var(--text-muted);
  font-size: 12px;
  padding: 8px 18px;
  background: transparent;
  transition: border-color 0.15s, color 0.15s;
}

.btn-ghost:hover {
  border-color: #555;
  color: var(--text-secondary);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/main.jsx src/index.css
git commit -m "feat: add entry point and CSS design system"
```

---

## Chunk 2: Data + Routing Shell

### Task 3: Create static data files

**Files:**
- Create: `src/data/events.js`
- Create: `src/data/officers.js`

- [ ] **Step 1: Create src/data/events.js**

```js
export const events = [
  {
    id: 1,
    date: 'MAR 25',
    title: 'Industry Mixer',
    location: 'Union South',
    time: '6:00 PM',
    description: 'Network with professionals from labels, agencies, and management companies.',
  },
  {
    id: 2,
    date: 'APR 3',
    title: 'Label Deep Dive',
    location: 'Music Hall',
    time: '7:00 PM',
    description: 'Inside look at how major and indie labels operate, sign artists, and market releases.',
  },
  {
    id: 3,
    date: 'APR 17',
    title: 'Resume Workshop',
    location: 'Ingraham Hall',
    time: '5:30 PM',
    description: 'Bring your resume. Industry mentors will give live feedback for music-biz roles.',
  },
  {
    id: 4,
    date: 'MAY 2',
    title: 'End-of-Year Showcase',
    location: 'Memorial Union',
    time: '7:00 PM',
    description: 'Celebrate the year with live performances and a farewell to graduating seniors.',
  },
]
```

- [ ] **Step 2: Create src/data/officers.js**

```js
export const officers = [
  { id: 1, name: 'Alex Rivera',  role: 'President',        initials: 'AR' },
  { id: 2, name: 'Jordan Kim',   role: 'Vice President',   initials: 'JK' },
  { id: 3, name: 'Maya Patel',   role: 'Treasurer',        initials: 'MP' },
  { id: 4, name: 'Sam Torres',   role: 'Secretary',        initials: 'ST' },
  { id: 5, name: 'Lily Chen',    role: 'Events Director',  initials: 'LC' },
  { id: 6, name: 'Dev Nguyen',   role: 'Marketing Lead',   initials: 'DN' },
]
```

- [ ] **Step 3: Commit**

```bash
git add src/data/
git commit -m "feat: add static events and officers data"
```

---

### Task 4: Create Navbar component

**Files:**
- Create: `src/components/Navbar.jsx`
- Create: `src/components/Navbar.css`

- [ ] **Step 1: Create src/components/Navbar.css**

```css
.navbar {
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar__inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__logo {
  color: var(--text-primary);
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 3px;
  text-decoration: none;
}

.navbar__links {
  display: flex;
  gap: 24px;
  list-style: none;
}

.navbar__links a {
  color: var(--text-muted);
  font-size: 12px;
  text-decoration: none;
  padding-bottom: 2px;
  transition: color 0.15s;
}

.navbar__links a:hover {
  color: var(--text-secondary);
}

.navbar__links a.active {
  color: var(--red);
  border-bottom: 1px solid var(--red);
}
```

- [ ] **Step 2: Create src/components/Navbar.jsx**

```jsx
import { NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__logo">MIMS</NavLink>
        <ul className="navbar__links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/leadership">Leadership</NavLink></li>
          <li><NavLink to="/events">Events</NavLink></li>
          <li><NavLink to="/my-events">My Events</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}
```

Note: React Router's `NavLink` automatically applies an `active` class to the matched link. The `end` prop on the Home link prevents it from staying active on all routes.

- [ ] **Step 3: Commit**

```bash
git add src/components/
git commit -m "feat: add Navbar component with active link highlighting"
```

---

### Task 5: Create App.jsx with all routes

**Files:**
- Create: `src/App.jsx`

- [ ] **Step 1: Create src/App.jsx**

```jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Leadership from './pages/Leadership'
import Events from './pages/Events'
import MyEvents from './pages/MyEvents'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/leadership" element={<Leadership />} />
        <Route path="/events" element={<Events />} />
        <Route path="/my-events" element={<MyEvents />} />
      </Routes>
    </>
  )
}
```

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts at `http://localhost:5173`. Browser shows blank page or a React error (pages not created yet) — no crash in the terminal.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add React Router route definitions"
```

---

## Chunk 3: Pages

### Task 6: Home page

**Files:**
- Create: `src/pages/Home.jsx`
- Create: `src/pages/Home.css`

- [ ] **Step 1: Create src/pages/Home.css**

```css
.home__hero {
  padding: 48px 0 32px;
  border-bottom: 1px solid var(--border);
}

.home__hero h1 {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.15;
}

.home__hero p {
  color: var(--text-secondary);
  font-size: 14px;
  max-width: 480px;
  margin-bottom: 24px;
}

.home__hero-buttons {
  display: flex;
  gap: 10px;
}

.home__community {
  padding: 28px 0;
  border-bottom: 1px solid var(--border);
}

.home__social-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.15s;
}

.social-btn:hover {
  opacity: 0.88;
}

.social-btn--discord {
  background: #5865F2;
}

.social-btn--groupme {
  background: #00AFF0;
}

.social-btn--instagram {
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}

.home__events {
  padding: 28px 0;
}

.home__event-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.home__event-row:last-child {
  border-bottom: none;
}

.home__event-date {
  color: var(--red);
  font-size: 11px;
  font-weight: 700;
  width: 52px;
  flex-shrink: 0;
}

.home__event-info {
  flex: 1;
}

.home__event-name {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
}

.home__event-meta {
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 2px;
}
```

- [ ] **Step 2: Create src/pages/Home.jsx**

```jsx
import { Link } from 'react-router-dom'
import { events } from '../data/events'
import './Home.css'

const DiscordIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

const GroupMeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
)

export default function Home() {
  const previewEvents = events.slice(0, 2)

  return (
    <div className="page">
      {/* Hero */}
      <section className="home__hero">
        <div className="red-tag">Music Industry for Madison Students</div>
        <h1>Connect. Learn. Grow.</h1>
        <p>The home for music industry students at UW–Madison. Network with professionals, attend exclusive events, and launch your career.</p>
        <div className="home__hero-buttons">
          <Link to="/events" className="btn-red">Explore Events →</Link>
          <Link to="/about" className="btn-ghost">About MIMS</Link>
        </div>
      </section>

      {/* Community */}
      <section className="home__community">
        <div className="red-tag" style={{ marginBottom: '12px' }}>Join the Community</div>
        <div className="home__social-buttons">
          <a href="#" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--discord">
            <DiscordIcon /> Join Discord
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--groupme">
            <GroupMeIcon /> Join GroupMe
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="social-btn social-btn--instagram">
            <InstagramIcon /> Follow Instagram
          </a>
        </div>
      </section>

      {/* Events preview */}
      <section className="home__events">
        <div className="section-heading">Upcoming Events</div>
        {previewEvents.map(event => (
          <div key={event.id} className="home__event-row">
            <div className="home__event-date">{event.date}</div>
            <div className="home__event-info">
              <div className="home__event-name">{event.title}</div>
              <div className="home__event-meta">{event.location} · {event.time}</div>
            </div>
            <Link to="/events" className="btn-red">View →</Link>
          </div>
        ))}
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:5173/`. Expected: hero text, 3 social buttons, 2 event preview rows. No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx src/pages/Home.css
git commit -m "feat: add Home page"
```

---

### Task 7: About page

**Files:**
- Create: `src/pages/About.jsx`
- Create: `src/pages/About.css`

- [ ] **Step 1: Create src/pages/About.css**

```css
.about__mission p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.about__what-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.about__what-card {
  background: var(--surface);
  border-left: 3px solid var(--red);
  padding: 14px 16px;
}

.about__what-card h3 {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 4px;
}

.about__what-card p {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.6;
}

.about__membership p {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}
```

- [ ] **Step 2: Create src/pages/About.jsx**

```jsx
import './About.css'

const whatWeDo = [
  { title: 'Industry Panels', desc: 'Hear directly from label executives, managers, and artists.' },
  { title: 'Networking Mixers', desc: 'Build your professional network before you graduate.' },
  { title: 'Workshops', desc: 'Hands-on skills in music marketing, A&R, and more.' },
  { title: 'Career Support', desc: 'Resume reviews, mock interviews, and internship leads.' },
]

export default function About() {
  return (
    <div className="page">
      <div className="red-tag">Who We Are</div>
      <h1 className="page-title">About MIMS</h1>
      <hr className="divider" />

      <section className="about__mission">
        <div className="section-heading">Our Mission</div>
        <p>
          MIMS — Music Industry for Madison Students — bridges the gap between UW–Madison academics
          and the professional music business world. We bring together students passionate about
          labels, publishing, management, marketing, and live events.
        </p>
      </section>

      <hr className="divider" />

      <section>
        <div className="section-heading">What We Do</div>
        <div className="about__what-grid">
          {whatWeDo.map(item => (
            <div key={item.title} className="about__what-card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section className="about__membership">
        <div className="section-heading">Membership</div>
        <p>
          Open to all UW–Madison students. No audition, no experience required — just a passion
          for the music industry. Meetings are biweekly on Tuesdays.
        </p>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:5173/about`. Expected: mission paragraph, 2×2 card grid, membership paragraph. No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/About.jsx src/pages/About.css
git commit -m "feat: add About page"
```

---

### Task 8: Leadership page

**Files:**
- Create: `src/pages/Leadership.jsx`
- Create: `src/pages/Leadership.css`

- [ ] **Step 1: Create src/pages/Leadership.css**

```css
.leadership__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.officer-card {
  background: var(--surface);
  padding: 20px 16px;
  text-align: center;
}

.officer-card__avatar {
  width: 48px;
  height: 48px;
  background: #2a0000;
  border: 2px solid var(--red);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  color: var(--red);
  font-size: 14px;
  font-weight: 800;
}

.officer-card__name {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 700;
}

.officer-card__role {
  color: var(--red);
  font-size: 11px;
  margin-top: 3px;
}
```

- [ ] **Step 2: Create src/pages/Leadership.jsx**

```jsx
import { officers } from '../data/officers'
import './Leadership.css'

export default function Leadership() {
  return (
    <div className="page">
      <div className="red-tag">The Team</div>
      <h1 className="page-title">Leadership</h1>
      <p className="page-subtitle">Meet the officers running MIMS for 2024–25.</p>
      <hr className="divider" />
      <div className="section-heading">Executive Board</div>
      <div className="leadership__grid">
        {officers.map(officer => (
          <div key={officer.id} className="officer-card">
            <div className="officer-card__avatar">{officer.initials}</div>
            <div className="officer-card__name">{officer.name}</div>
            <div className="officer-card__role">{officer.role}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:5173/leadership`. Expected: 3-column officer grid with 6 cards. No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Leadership.jsx src/pages/Leadership.css
git commit -m "feat: add Leadership page"
```

---

### Task 9: Events page

**Files:**
- Create: `src/pages/Events.jsx`
- Create: `src/pages/Events.css`

- [ ] **Step 1: Create src/pages/Events.css**

```css
.events__list {
  display: flex;
  flex-direction: column;
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}

.event-item:last-child {
  border-bottom: none;
}

.event-item__date {
  color: var(--red);
  font-size: 11px;
  font-weight: 700;
  width: 52px;
  flex-shrink: 0;
  padding-top: 2px;
}

.event-item__body {
  flex: 1;
}

.event-item__title {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 3px;
}

.event-item__meta {
  color: var(--text-muted);
  font-size: 12px;
  margin-bottom: 5px;
}

.event-item__desc {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.rsvp-btn {
  flex-shrink: 0;
  border: 1px solid var(--red);
  color: var(--red);
  background: transparent;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 14px;
  letter-spacing: 0.5px;
  transition: background 0.15s, color 0.15s;
  margin-top: 2px;
}

.rsvp-btn:hover {
  background: var(--red);
  color: #fff;
}

.rsvp-btn--active {
  background: var(--red);
  color: #fff;
}
```

- [ ] **Step 2: Create src/pages/Events.jsx**

```jsx
import { events } from '../data/events'
import './Events.css'

export default function Events() {
  return (
    <div className="page">
      <div className="red-tag">What's Happening</div>
      <h1 className="page-title">Upcoming Events</h1>
      <p className="page-subtitle">RSVP to save events to your personal list.</p>
      <hr className="divider" />
      <div className="events__list">
        {events.map((event, index) => (
          <div key={event.id} className="event-item">
            <div className="event-item__date">{event.date}</div>
            <div className="event-item__body">
              <div className="event-item__title">{event.title}</div>
              <div className="event-item__meta">📍 {event.location} · {event.time}</div>
              <div className="event-item__desc">{event.description}</div>
            </div>
            {/* Phase 1: first event shows RSVP'd state as a static visual mock */}
            <button className={`rsvp-btn${index === 0 ? ' rsvp-btn--active' : ''}`}>
              {index === 0 ? '✓ RSVP\'d' : 'RSVP'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:5173/events`. Expected: 4 events listed; first shows `✓ RSVP'd` (filled red), rest show `RSVP` (outline). No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Events.jsx src/pages/Events.css
git commit -m "feat: add Events page with static RSVP button states"
```

---

### Task 10: My Events page

**Files:**
- Create: `src/pages/MyEvents.jsx`
- Create: `src/pages/MyEvents.css`

- [ ] **Step 1: Create src/pages/MyEvents.css**

```css
.my-events__empty {
  text-align: center;
  padding: 48px 24px;
  border: 1px dashed var(--border);
  border-radius: 4px;
  margin-top: 8px;
}

.my-events__empty-icon {
  font-size: 36px;
  margin-bottom: 14px;
}

.my-events__empty h2 {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 6px;
}

.my-events__empty p {
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 20px;
}
```

- [ ] **Step 2: Create src/pages/MyEvents.jsx**

```jsx
import { Link } from 'react-router-dom'
import './MyEvents.css'

export default function MyEvents() {
  return (
    <div className="page">
      <div className="red-tag">Your Schedule</div>
      <h1 className="page-title">My Events</h1>
      <p className="page-subtitle">Events you've RSVP'd to. Saved locally in your browser.</p>
      <hr className="divider" />

      {/* Phase 1: always shows empty state — localStorage wired up in Phase 2 */}
      <div className="my-events__empty">
        <div className="my-events__empty-icon">🎵</div>
        <h2>No events yet</h2>
        <p>Head to the Events page and RSVP to something!</p>
        <Link to="/events" className="btn-red">Browse Events →</Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:5173/my-events`. Expected: empty state with 🎵 icon, heading, subtext, and `Browse Events →` link. No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/MyEvents.jsx src/pages/MyEvents.css
git commit -m "feat: add My Events page with empty state"
```

---

## Chunk 4: Final Wiring

### Task 11: Smoke test all routes and push to GitHub

- [ ] **Step 1: Manual smoke test**

Visit each route and confirm no errors:
- `http://localhost:5173/` — Home loads
- `http://localhost:5173/about` — About loads
- `http://localhost:5173/leadership` — Leadership loads
- `http://localhost:5173/events` — Events loads
- `http://localhost:5173/my-events` — My Events loads
- Click nav links — active link turns red
- Click `Browse Events →` on My Events — navigates to `/events`
- Click `Explore Events →` on Home — navigates to `/events`

- [ ] **Step 2: Create GitHub repo and push**

```bash
gh repo create mims-club --public --source=. --remote=origin --push
```

If `gh` is not installed, use:
```bash
git remote add origin https://github.com/<your-username>/mims-club.git
git push -u origin main
```

Expected: repo created at `github.com/<username>/mims-club`, all commits pushed.

- [ ] **Step 3: Verify dev server is running for review**

```bash
npm run dev
```

Expected: Site running at `http://localhost:5173`. Share this URL for local review.
