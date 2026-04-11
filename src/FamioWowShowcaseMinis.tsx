/**
 * Polished SVG mini visuals for “What you actually get” cards.
 */

export function WowMiniChat() {
  return (
    <div className="famio-wow-mini famio-wow-mini--chat" aria-hidden={true}>
      <svg
        className="famio-wow-mini-canvas"
        viewBox="0 0 200 168"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wow-chat-bg" x1="40" y1="28" x2="160" y2="148" gradientUnits="userSpaceOnUse">
            <stop offset="0" className="wow-chat-grad-stop-0" />
            <stop offset="1" className="wow-chat-grad-stop-1" />
          </linearGradient>
          <filter id="wow-chat-drop" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.07" />
          </filter>
        </defs>
        <rect x="30" y="18" width="140" height="132" rx="18" className="wow-chat-device" />
        <rect x="38" y="26" width="124" height="116" rx="12" fill="url(#wow-chat-bg)" />
        <g className="wow-pro-chat-bubble-group wow-pro-chat-bubble-group--a" filter="url(#wow-chat-drop)">
          <rect x="96" y="38" width="74" height="28" rx="11" className="wow-chat-bubble-accent" />
          <text x="133" y="55" textAnchor="middle" className="wow-chat-svg-text wow-chat-svg-text--ink">
            Flight landed ✓
          </text>
        </g>
        <g className="wow-pro-chat-bubble-group wow-pro-chat-bubble-group--b" filter="url(#wow-chat-drop)">
          <rect x="38" y="78" width="102" height="30" rx="11" className="wow-chat-bubble-paper" />
          <text x="89" y="96" textAnchor="middle" className="wow-chat-svg-text wow-chat-svg-text--ink">
            Sunday brunch?
          </text>
        </g>
        <g className="wow-pro-chat-bubble-group wow-pro-chat-bubble-group--c" filter="url(#wow-chat-drop)">
          <rect x="72" y="118" width="90" height="28" rx="11" className="wow-chat-bubble-mint" />
          <text x="117" y="135" textAnchor="middle" className="wow-chat-svg-text wow-chat-svg-text--ink">
            On the calendar
          </text>
        </g>
      </svg>
    </div>
  )
}

export function WowMiniMap() {
  return (
    <div className="famio-wow-mini famio-wow-mini--map" aria-hidden={true}>
      <svg
        className="famio-wow-mini-canvas famio-wow-mini-canvas--map"
        viewBox="0 0 200 148"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wow-map-sky" x1="6" y1="6" x2="194" y2="142" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--map-demo-surface)" />
            <stop offset="1" stopColor="var(--map-demo-chrome)" />
          </linearGradient>
          <clipPath id="wow-map-clip">
            <rect x="6" y="6" width="188" height="136" rx="12" />
          </clipPath>
        </defs>
        <g clipPath="url(#wow-map-clip)">
          <rect x="6" y="6" width="188" height="136" fill="url(#wow-map-sky)" />
          <rect x="12" y="14" width="48" height="34" rx="5" className="wow-map-building" />
          <rect x="66" y="18" width="40" height="26" rx="5" className="wow-map-building-muted" />
          <rect x="112" y="12" width="56" height="38" rx="5" className="wow-map-building" />
          <rect x="22" y="56" width="62" height="28" rx="5" className="wow-map-building-muted" />
          <rect x="128" y="58" width="52" height="32" rx="5" className="wow-map-building" />
          <ellipse cx="52" cy="118" rx="32" ry="22" className="wow-map-park" />
          <path
            d="M138 108c16-6 34-4 46 6s18 26 12 40-22 24-38 22-32-12-38-28 6-32 18-40z"
            className="wow-map-water"
          />
          <path
            d="M100 10v128M26 78h148"
            className="wow-map-road"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M34 48 C 58 32, 86 36, 108 50 S 152 68, 156 96"
            className="famio-wow-mini-map-route-line"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g className="wow-map-pin wow-map-pin--1">
            <line x1="46" y1="56" x2="46" y2="44" className="wow-map-pin-stem" strokeWidth="2.2" />
            <circle cx="46" cy="40" r="6" className="wow-map-pin-head wow-map-pin-head--accent" />
          </g>
          <g className="wow-map-pin wow-map-pin--2">
            <line x1="142" y1="72" x2="142" y2="60" className="wow-map-pin-stem" strokeWidth="2.2" />
            <circle cx="142" cy="56" r="6" className="wow-map-pin-head wow-map-pin-head--sky" />
          </g>
          <g className="wow-map-pin wow-map-pin--3">
            <line x1="88" y1="112" x2="88" y2="100" className="wow-map-pin-stem" strokeWidth="2.2" />
            <circle cx="88" cy="96" r="6" className="wow-map-pin-head wow-map-pin-head--mint" />
          </g>
        </g>
        <rect x="6" y="6" width="188" height="136" rx="12" className="wow-map-frame" />
      </svg>
    </div>
  )
}

export function WowMiniTravel() {
  return (
    <div className="famio-wow-mini famio-wow-mini--travel" aria-hidden={true}>
      <svg
        className="famio-wow-mini-canvas"
        viewBox="0 0 200 148"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wow-travel-bg" x1="100" y1="8" x2="100" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0" className="wow-travel-grad-stop-0" />
            <stop offset="1" className="wow-travel-grad-stop-1" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="184" height="132" rx="12" fill="url(#wow-travel-bg)" />
        <path d="M16 118 L184 118 L172 132 L28 132Z" className="wow-travel-road-fill" />
        <path
          d="M24 118 L176 118"
          className="wow-travel-road-dash"
          strokeWidth="2"
          strokeDasharray="10 14"
          strokeLinecap="round"
        />
        <g className="wow-travel-van-group">
          <ellipse cx="0" cy="11" rx="16" ry="3.5" className="wow-travel-van-shadow" />
          <rect x="-19" y="-9" width="38" height="17" rx="4" className="wow-travel-van-body" />
          <rect x="-13" y="-6" width="15" height="8" rx="2" className="wow-travel-van-window" />
        </g>
        <rect x="54" y="22" width="92" height="26" rx="13" className="wow-travel-eta-chip" />
        <text x="100" y="39" textAnchor="middle" className="wow-travel-eta-svg">
          12 min · Home
        </text>
      </svg>
    </div>
  )
}

export function WowMiniField() {
  return (
    <div className="famio-wow-mini famio-wow-mini--field" aria-hidden={true}>
      <svg
        className="famio-wow-mini-canvas"
        viewBox="0 0 200 148"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient
            id="wow-field-ball-grad"
            cx="32%"
            cy="28%"
            r="68%"
          >
            <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="0.4" stopColor="#ffc14d" />
            <stop offset="1" stopColor="#e0780a" />
          </radialGradient>
        </defs>
        <rect x="8" y="8" width="184" height="132" rx="12" className="wow-field-chrome" />
        <ellipse cx="100" cy="82" rx="74" ry="50" className="wow-field-turf" />
        <line x1="100" y1="38" x2="100" y2="126" className="wow-field-line" strokeWidth="2" strokeLinecap="round" />
        <circle cx="100" cy="82" r="14" className="wow-field-center-ring" />
        <g className="wow-field-ball-group">
          <ellipse cx="0" cy="13" rx="11" ry="3" className="wow-field-ball-shadow" />
          <circle r="11.5" className="wow-field-ball" />
        </g>
      </svg>
    </div>
  )
}

export function WowMiniGlance() {
  return (
    <div className="famio-wow-mini famio-wow-mini--glance" aria-hidden={true}>
      <svg
        className="famio-wow-mini-canvas"
        viewBox="0 0 200 148"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="74" r="60" className="wow-glance-band wow-glance-band--c" />
        <circle cx="100" cy="74" r="48" className="wow-glance-band wow-glance-band--b" />
        <circle cx="100" cy="74" r="36" className="wow-glance-band wow-glance-band--a" />
        <circle cx="100" cy="74" r="24" className="wow-glance-inner" />
        <circle cx="100" cy="74" r="7" className="wow-glance-dot" />
      </svg>
    </div>
  )
}

export function WowMiniPlans() {
  return (
    <div className="famio-wow-mini famio-wow-mini--plans" aria-hidden={true}>
      <svg
        className="famio-wow-mini-canvas"
        viewBox="0 0 200 148"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="wow-plans-gold"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0" stopColor="#f5d56a" />
            <stop offset="1" stopColor="#d4a41f" />
          </linearGradient>
        </defs>
        <rect x="22" y="30" width="156" height="88" rx="14" className="wow-plans-panel" />
        <g className="wow-plans-row wow-plans-row--free">
          <rect x="36" y="44" width="128" height="20" rx="8" className="wow-plans-bar wow-plans-bar--free" />
          <text x="48" y="58" className="wow-plans-svg-label">
            Free
          </text>
        </g>
        <g className="wow-plans-row wow-plans-row--plus">
          <rect x="36" y="72" width="128" height="20" rx="8" className="wow-plans-bar wow-plans-bar--plus" />
          <text x="48" y="86" className="wow-plans-svg-label">
            Plus
          </text>
        </g>
        <g className="wow-plans-row wow-plans-row--gold">
          <rect x="36" y="100" width="128" height="20" rx="8" className="wow-plans-bar wow-plans-bar--gold" />
          <text x="48" y="114" className="wow-plans-svg-label wow-plans-svg-label--gold">
            Gold
          </text>
        </g>
      </svg>
    </div>
  )
}
