import './FeedbackMessage.css'

export default function FeedbackMessage({ visible }) {
  return (
    <p className={`feedback-message${visible ? ' feedback-message--visible' : ''}`}>
      ✓ Saved to My Events
    </p>
  )
}
