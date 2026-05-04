export type FlightProgressStatus =
  | 'delayed'
  | 'on-time'
  | 'early'
  /** Departed behind schedule, but on track to land ahead of the published arrival */
  | 'recovery'

const fillClass: Record<FlightProgressStatus, string> = {
  delayed: 'hero-flight-track-fill--delayed',
  'on-time': 'hero-flight-track-fill--on-time',
  early: 'hero-flight-track-fill--early',
  recovery: 'hero-flight-track-fill--recovery',
}

function FlightPlaneGlyph() {
  return (
    <svg
      className="hero-flight-track-plane-svg"
      viewBox="0 0 24 24"
      width={22}
      height={22}
      aria-hidden={true}
    >
      <g transform="translate(12 12) rotate(90) translate(-12 -12)">
        <path
          fill="currentColor"
          d="M21 16v-2l-8-5V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
        />
      </g>
    </svg>
  )
}

type FlightProgressBarProps = {
  /** 0–100: filled portion of the track; plane sits on the leading edge */
  progress: number
  status: FlightProgressStatus
}

/**
 * Bar fill is a solid color per flight status; plane stays brand blue.
 */
export function FlightProgressBar({ progress, status }: FlightProgressBarProps) {
  const pct = Math.min(100, Math.max(0, progress))

  return (
    <div className="hero-flight-track">
      <div className="hero-flight-track-progress" style={{ width: `${pct}%` }}>
        <span className={`hero-flight-track-fill ${fillClass[status]}`} />
        <span className="hero-flight-track-plane" aria-hidden={true}>
          <FlightPlaneGlyph />
        </span>
      </div>
    </div>
  )
}
