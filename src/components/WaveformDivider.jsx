import './WaveformDivider.css'

const HEIGHTS = [3,5,8,12,7,11,14,9,13,6,10,4,8,13,7,11,3,9,14,6,10,5,12,8,4,11,7,13,9,3,12,6,10,14,5,8,11,4,9,13,7,3,11,8,14,6,10,5,12,9,4,13,7,11,3,8,12,6,10,14,5,9,4,11]

export default function WaveformDivider() {
  return (
    <div className="waveform-divider" aria-hidden="true">
      {HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="waveform-divider__bar"
          style={{ height: h, opacity: 0.15 + (h / 14) * 0.40 }}
        />
      ))}
    </div>
  )
}
