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
