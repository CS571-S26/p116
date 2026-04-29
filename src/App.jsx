import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Leadership from './pages/Leadership'
import Events from './pages/Events'
import MyEvents from './pages/MyEvents'

function loadRsvpIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem('mims_rsvps') || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function App() {
  const [rsvpIds, setRsvpIds] = useState(loadRsvpIds)
  const location = useLocation()

  useEffect(() => {
    localStorage.setItem('mims_rsvps', JSON.stringify(rsvpIds))
  }, [rsvpIds])

  function addRSVP(id) {
    setRsvpIds(prev => prev.includes(id) ? prev : [...prev, id])
  }

  function removeRSVP(id) {
    setRsvpIds(prev => prev.filter(x => x !== id))
  }

  return (
    <>
      <Navbar rsvpCount={rsvpIds.length} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"           element={<Home />} />
          <Route path="/about"      element={<About />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/events"     element={<Events rsvpIds={rsvpIds} onRSVP={addRSVP} onUnRSVP={removeRSVP} />} />
          <Route path="/my-events"  element={<MyEvents rsvpIds={rsvpIds} onUnRSVP={removeRSVP} />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
