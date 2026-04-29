import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { events } from '../data/events'
import PageHeader from '../components/PageHeader'
import MyEventRow from '../components/MyEventRow'
import AnimatedPage from '../components/AnimatedPage'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import './MyEvents.css'

export default function MyEvents({ rsvpIds = [], onUnRSVP }) {
  const prefersReduced = useReducedMotion()
  const rsvpdEvents = events.filter(e => rsvpIds.includes(e.id))

  return (
    <AnimatedPage>
    <div className="page">
      <PageHeader tag="Your Schedule" title="My Events" subtitle="Events you've RSVP'd to. Saved locally in your browser." />

      {rsvpdEvents.length > 0 ? (
        <>
          <div className="section-heading my-events__heading">
            RSVP'd Events ({rsvpdEvents.length})
          </div>
          <div className="my-events__list">
            <AnimatePresence initial={false}>
              {rsvpdEvents.map(event => (
                <motion.div
                  key={event.id}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
                  transition={{ duration: 0.18 }}
                >
                  <MyEventRow
                    event={event}
                    onUnRSVP={onUnRSVP}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div className="my-events__empty">
          <div className="my-events__empty-icon">🎵</div>
          <h2>No events yet</h2>
          <p>Head to the Events page and RSVP to something!</p>
          <Button as={Link} to="/events" variant="outline-danger" size="sm">Browse Events →</Button>
        </div>
      )}
    </div>
    </AnimatedPage>
  )
}
