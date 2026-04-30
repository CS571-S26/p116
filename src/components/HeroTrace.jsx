import './HeroTrace.css'

const PATH =
  'M0,215 C100,215 150,158 230,158 C310,158 355,272 460,272 ' +
  'C565,272 610,165 720,165 C830,165 875,228 1000,228 ' +
  'C1030,228 1045,222 1040,222'

export default function HeroTrace() {
  return (
    <svg
      className="hero-trace"
      viewBox="0 0 1050 320"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="hero-trace-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="white" stopOpacity="0" />
          <stop offset="40%"  stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="hero-trace-mask">
          <rect width="100%" height="100%" fill="url(#hero-trace-fade)" />
        </mask>
      </defs>
      <g mask="url(#hero-trace-mask)">
        <path
          className="hero-trace__base"
          d={PATH}
          fill="none"
          stroke="rgba(204,0,0,1)"
          strokeWidth="1.5"
        />
        <path
          className="hero-trace__sweep"
          d={PATH}
          fill="none"
          stroke="rgba(220,0,0,0.9)"
          strokeWidth="2.5"
          strokeDasharray="65 10000"
        />
      </g>
    </svg>
  )
}
