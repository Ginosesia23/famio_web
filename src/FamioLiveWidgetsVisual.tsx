import { useEffect, useMemo, useState } from 'react'
import { FlightProgressBar } from './FlightProgressBar'

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function scheduleNextFlightTick(
  reduceMotion: boolean,
  onTick: () => void,
): () => void {
  if (reduceMotion) {
    return () => {}
  }
  let cancelled = false
  let timeoutId: ReturnType<typeof setTimeout>

  const run = () => {
    if (cancelled) return
    const delay = randomBetween(1800, 5200)
    timeoutId = window.setTimeout(() => {
      if (cancelled) return
      onTick()
      run()
    }, delay)
  }
  run()
  return () => {
    cancelled = true
    window.clearTimeout(timeoutId)
  }
}

/**
 * Lock Screen preview using the same device chrome as the hero, with a Famio
 * flight card showing a delay that nudges on irregular intervals.
 */
export function FamioLiveWidgetsVisual() {
  const [lockNow, setLockNow] = useState(() => new Date())
  const [trackProgress, setTrackProgress] = useState(0.58)
  const [scheduledLanding] = useState(() => {
    const s = new Date()
    s.setMinutes(s.getMinutes() + 28 + Math.floor(Math.random() * 10))
    return s
  })
  const [delayMinutes, setDelayMinutes] = useState(
    () => 22 + Math.floor(Math.random() * 14),
  )

  const revisedLanding = useMemo(
    () =>
      new Date(scheduledLanding.getTime() + delayMinutes * 60 * 1000),
    [scheduledLanding, delayMinutes],
  )

  useEffect(() => {
    const id = window.setInterval(() => setLockNow(new Date()), 20000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reduceMotion = mq.matches

    return scheduleNextFlightTick(reduceMotion, () => {
      setDelayMinutes((d) => {
        const delta = Math.floor(randomBetween(-2, 5))
        return Math.min(52, Math.max(14, d + delta))
      })
      setTrackProgress((p) => {
        const next = p + randomBetween(-0.014, 0.009)
        return Math.min(0.72, Math.max(0.46, next))
      })
    })
  }, [])

  const lockTime = lockNow.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
  const lockDate = lockNow.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const scheduledStr = scheduledLanding.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
  const revisedStr = revisedLanding.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })

  const pct = Math.round(trackProgress * 1000) / 10

  return (
    <figure className="live-widgets-visual-root" aria-hidden={true}>
      <div className="hero-device-scene live-widgets-device-scene">
        <div className="hero-device-blob hero-device-blob--a" />
        <div className="hero-device-blob hero-device-blob--b" />
        <div className="hero-phone">
          <div className="hero-phone-bezel">
            <div className="hero-phone-screen">
              <div className="hero-phone-notch" />
              <div className="live-widgets-lock-body live-widgets-lock-body--light">
                <div className="live-widgets-lock-wallpaper" />
                <div className="live-widgets-lock-main">
                  <p className="live-widgets-lock-time">{lockTime}</p>
                  <p className="live-widgets-lock-date">{lockDate}</p>
                </div>
                <div className="live-widgets-lock-footer">
                  <div className="hero-flight-card live-widgets-live-flight live-widgets-live-flight--delayed">
                    <div className="hero-flight-card-top">
                      <span className="hero-flight-badge">Famio</span>
                      <span className="hero-flight-pill hero-flight-pill--delayed">
                        Delayed
                      </span>
                    </div>
                    <p className="live-widgets-flight-was">
                      Was {scheduledStr}
                    </p>
                    <div className="hero-flight-airline">
                      <span className="hero-flight-code">UA 182</span>
                      <span className="hero-flight-plane" aria-hidden={true}>
                        ✈
                      </span>
                    </div>
                    <div className="hero-flight-route">
                      <span>SFO</span>
                      <span className="hero-flight-arrow">→</span>
                      <span>ORD</span>
                    </div>
                    <FlightProgressBar progress={pct} status="delayed" />
                    <div className="hero-flight-meta">
                      <span>+{delayMinutes} min</span>
                      <span className="hero-flight-dot" />
                      <span>Est. {revisedStr}</span>
                      <span className="hero-flight-dot" />
                      <span>Gate B12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}
