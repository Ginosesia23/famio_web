/** Decorative visual: layered “deck” of map, flight, and family chat — mint & sky accents */

export function FamioWowVisual() {
  return (
    <div className="famio-wow-visual" aria-hidden={true}>
      <div className="famio-wow-deck-blobs">
        <span className="famio-wow-deck-blob famio-wow-deck-blob--a" />
        <span className="famio-wow-deck-blob famio-wow-deck-blob--b" />
      </div>

      <svg
        className="famio-wow-deck-arc"
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden={true}
      >
        <path
          className="famio-wow-deck-arc-path"
          d="M24 198c42-52 118-88 198-72 28 6 54 18 76 36"
        />
        <path
          className="famio-wow-deck-arc-path famio-wow-deck-arc-path--soft"
          d="M48 52c58 28 112 78 138 148"
        />
      </svg>

      <div className="famio-wow-deck">
        <div className="famio-wow-deck-card famio-wow-deck-card--map">
          <span className="famio-wow-deck-card-label">Where everyone is</span>
          <svg
            className="famio-wow-deck-map"
            viewBox="0 0 120 88"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden={true}
          >
            <rect
              className="famio-wow-deck-map-surface"
              x="4"
              y="4"
              width="112"
              height="80"
              rx="10"
            />
            <path
              className="famio-wow-deck-map-road"
              d="M60 8v72M20 44h80"
              strokeLinecap="round"
            />
            <circle className="famio-wow-deck-map-pin famio-wow-deck-map-pin--a" cx="38" cy="36" r="5" />
            <circle className="famio-wow-deck-map-pin famio-wow-deck-map-pin--b" cx="72" cy="52" r="5" />
            <circle className="famio-wow-deck-map-pin famio-wow-deck-map-pin--c" cx="86" cy="30" r="5" />
          </svg>
        </div>

        <div className="famio-wow-deck-card famio-wow-deck-card--flight famio-wow-deck-card--flight-delayed">
          <span className="famio-wow-deck-flight-brand">Famio</span>
          <span className="famio-wow-deck-flight-row">
            <span className="famio-wow-deck-flight-code">UA 182</span>
            <span className="famio-wow-deck-flight-pill famio-wow-deck-flight-pill--delayed">
              Delayed
            </span>
          </span>
          <span className="famio-wow-deck-flight-was">Was 3:14 PM</span>
          <span className="famio-wow-deck-flight-route">SFO → ORD</span>
          <span className="famio-wow-deck-flight-meta">
            +28 min · Est. 3:42 PM · Gate B12
          </span>
        </div>

        <div className="famio-wow-deck-card famio-wow-deck-card--events">
          <span className="famio-wow-deck-card-label">On the calendar</span>
          <ul className="famio-wow-deck-events">
            <li className="famio-wow-deck-event">
              <span className="famio-wow-deck-event-day">Sun</span>
              <span className="famio-wow-deck-event-line">Brunch · 11:30</span>
            </li>
            <li className="famio-wow-deck-event">
              <span className="famio-wow-deck-event-day">Tue</span>
              <span className="famio-wow-deck-event-line">Soccer · Field 4</span>
            </li>
          </ul>
        </div>

        <div className="famio-wow-deck-card famio-wow-deck-card--chat">
          <div className="famio-wow-deck-chat-head">
            <span className="famio-wow-deck-chat-title">Family</span>
            <div className="famio-wow-deck-chat-avatars">
              <span className="famio-wow-deck-chat-av" />
              <span className="famio-wow-deck-chat-av famio-wow-deck-chat-av--b" />
              <span className="famio-wow-deck-chat-av famio-wow-deck-chat-av--c" />
            </div>
          </div>
          <div className="famio-wow-deck-chat-body">
            <div className="famio-wow-deck-bubble famio-wow-deck-bubble--them">
              <span className="famio-wow-deck-bubble-who">Mom</span>
              So we’re all set for Sunday brunch?
            </div>
            <div className="famio-wow-deck-bubble famio-wow-deck-bubble--you">
              Yep—everyone’s in this thread now 💚
            </div>
          </div>
        </div>

        <div className="famio-wow-deck-badge">Famio</div>
      </div>
    </div>
  )
}
