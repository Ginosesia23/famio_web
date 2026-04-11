import { useState } from 'react'
import {
  WowMiniChat,
  WowMiniField,
  WowMiniGlance,
  WowMiniMap,
  WowMiniPlans,
  WowMiniTravel,
} from './FamioWowShowcaseMinis'
import { FamioFamilyMomentsVisual } from './FamioFamilyMomentsVisual'
import { FlightProgressBar } from './FlightProgressBar'
import { FamioLiveWidgetsVisual } from './FamioLiveWidgetsVisual'
import { FamioWowVisual } from './FamioWowVisual'
import './App.css'

/** Opens the user’s mail app with a short template for product ideas. */
const FEATURE_REQUEST_HREF =
  'mailto:hello@famio.app?subject=' +
  encodeURIComponent('Famio feature idea') +
  '&body=' +
  encodeURIComponent(
    'Hi Famio team,\n\n' +
      'I use Famio and have an idea:\n\n' +
      '\n\n' +
      'Why it would help our family:\n\n' +
      '\n\n' +
      'Thanks!\n',
  )

const FAMIO_CREW_MOMENTS = [
  {
    id: 'pickups',
    title: 'Pickups & drop-offs',
    body: "Who's grabbing who—often settled before the last bell, not in a flurry of texts.",
    vibe: 'mint' as const,
  },
  {
    id: 'flights',
    title: 'Flights & arrivals',
    body: 'Gates, delays, and ETAs land in the same place your family already talks.',
    vibe: 'sky' as const,
  },
  {
    id: 'road',
    title: 'Road trips & carpools',
    body: 'Progress and stops update quietly—no mile-by-mile commentary required.',
    vibe: 'accent' as const,
  },
  {
    id: 'game',
    title: 'Game days & fields',
    body: 'Field numbers, rides, and “running late” live next to the sideline chaos.',
    vibe: 'mint' as const,
  },
  {
    id: 'nights',
    title: 'Ordinary Tuesday nights',
    body: 'Dinner, homework, who’s home—glanceable without another “you up?” ping.',
    vibe: 'sky' as const,
  },
  {
    id: 'chat',
    title: 'The chat you still like',
    body: 'Logistics have a grown-up home in Famio—your group thread stays silly and human.',
    vibe: 'accent' as const,
  },
]

function FamilyMapExample() {
  return (
    <figure className="feature-map-demo">
      <svg
        className="family-map-svg"
        viewBox="0 0 360 260"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="family-map-svg-title"
      >
        <title id="family-map-svg-title">
          Example neighborhood map with Mom, Dad, Alex, and Sam marked on it
        </title>
        <defs>
          <filter
            id="map-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodOpacity="0.12"
            />
          </filter>
        </defs>

        <rect
          className="family-map-svg__frame"
          x="0"
          y="0"
          width="360"
          height="260"
          rx="16"
        />

        {/* Blocks & terrain */}
        <rect
          className="family-map-svg__block"
          x="12"
          y="14"
          width="100"
          height="72"
          rx="6"
        />
        <rect
          className="family-map-svg__block family-map-svg__block--muted"
          x="118"
          y="18"
          width="88"
          height="56"
          rx="6"
        />
        <ellipse
          className="family-map-svg__park"
          cx="72"
          cy="168"
          rx="58"
          ry="42"
        />
        <path
          className="family-map-svg__water"
          d="M268 175c18-8 38-6 52 4 14 10 22 28 18 48-4 20-20 36-40 40s-42-4-54-20c-12-16-14-38-4-54 10-16 28-22 28-18z"
        />
        <rect
          className="family-map-svg__block"
          x="210"
          y="22"
          width="138"
          height="64"
          rx="6"
        />
        <rect
          className="family-map-svg__block family-map-svg__block--muted"
          x="148"
          y="118"
          width="96"
          height="62"
          rx="6"
        />

        {/* Roads */}
        <path
          className="family-map-svg__road"
          d="M180 0v260M95 0v260M270 0v260M0 190h360"
          fill="none"
          strokeLinecap="round"
        />
        <path
          className="family-map-svg__road family-map-svg__road--major"
          d="M0 120h360"
          fill="none"
          strokeLinecap="round"
        />

        {/* Member pins */}
        <g className="family-map-svg__member" filter="url(#map-shadow)">
          <line
            className="family-map-svg__pin-stem"
            x1="102"
            y1="118"
            x2="102"
            y2="98"
          />
          <circle className="family-map-svg__pin mom" cx="102" cy="92" r="15" />
          <text
            className="family-map-svg__initial"
            x="102"
            y="97"
            textAnchor="middle"
          >
            M
          </text>
          <text
            className="family-map-svg__label"
            x="102"
            y="134"
            textAnchor="middle"
          >
            Mom
          </text>
        </g>

        <g className="family-map-svg__member" filter="url(#map-shadow)">
          <line
            className="family-map-svg__pin-stem"
            x1="232"
            y1="108"
            x2="232"
            y2="88"
          />
          <circle className="family-map-svg__pin dad" cx="232" cy="82" r="15" />
          <text
            className="family-map-svg__initial"
            x="232"
            y="87"
            textAnchor="middle"
          >
            D
          </text>
          <text
            className="family-map-svg__label"
            x="232"
            y="124"
            textAnchor="middle"
          >
            Dad
          </text>
        </g>

        <g className="family-map-svg__member" filter="url(#map-shadow)">
          <line
            className="family-map-svg__pin-stem"
            x1="188"
            y1="198"
            x2="188"
            y2="178"
          />
          <circle className="family-map-svg__pin alex" cx="188" cy="172" r="15" />
          <text
            className="family-map-svg__initial"
            x="188"
            y="177"
            textAnchor="middle"
          >
            A
          </text>
          <text
            className="family-map-svg__label"
            x="188"
            y="214"
            textAnchor="middle"
          >
            Alex
          </text>
        </g>

        <g className="family-map-svg__member" filter="url(#map-shadow)">
          <line
            className="family-map-svg__pin-stem"
            x1="298"
            y1="152"
            x2="298"
            y2="132"
          />
          <circle className="family-map-svg__pin sam" cx="298" cy="126" r="15" />
          <text
            className="family-map-svg__initial"
            x="298"
            y="131"
            textAnchor="middle"
          >
            S
          </text>
          <text
            className="family-map-svg__label"
            x="298"
            y="168"
            textAnchor="middle"
          >
            Sam
          </text>
        </g>

        <text className="family-map-svg__hint" x="180" y="248" textAnchor="middle">
          Live view — everyone on one map
        </text>
      </svg>
    </figure>
  )
}

function FeatureChatGraphic() {
  return (
    <div className="showcase-graphic showcase-graphic--chat" aria-hidden="true">
      <div className="chat-phone">
        <div className="chat-phone-bar" />
        <p className="chat-phone-title">Family chat</p>
        <div className="chat-thread">
          <div className="chat-msg chat-msg--in">
            <span className="chat-msg-tag chat-msg-tag--mint">Invite</span>
            Leo&apos;s party · Sat 3pm
          </div>
          <div className="chat-msg chat-msg--out">
            <span className="chat-msg-tag chat-msg-tag--sky">You</span>
            Grabbing cake on the way!
          </div>
          <div className="chat-msg chat-msg--card">
            <span className="chat-msg-card-icon" aria-hidden="true">
              ✈
            </span>
            <div className="chat-msg-card-body">
              <strong>UA 182</strong>
              <span>On time · arrives 4:20pm</span>
            </div>
          </div>
        </div>
        <div className="chat-smart-row">
          <span className="chat-chip chat-chip--accent">Flights</span>
          <span className="chat-chip chat-chip--sky">Calendar</span>
          <span className="chat-chip chat-chip--mint">Invites</span>
        </div>
      </div>
    </div>
  )
}

function FeatureTravelGraphic() {
  return (
    <div className="showcase-graphic showcase-graphic--travel" aria-hidden="true">
      <p className="travel-banner">Travel mode on</p>
      <div className="travel-timeline">
        <div className="travel-stop">
          <span className="travel-pin travel-pin--mint" />
          <span className="travel-stop-label">Left home</span>
        </div>
        <div className="travel-track">
          <span className="travel-track-fill" />
        </div>
        <div className="travel-stop">
          <span className="travel-pin travel-pin--sky" />
          <span className="travel-stop-label">En route</span>
        </div>
        <div className="travel-track travel-track--dim">
          <span className="travel-track-fill travel-track-fill--muted" />
        </div>
        <div className="travel-stop">
          <span className="travel-pin travel-pin--accent" />
          <span className="travel-stop-label">Landed</span>
        </div>
      </div>
      <p className="travel-caption">Everyone sees ETAs &amp; arrivals</p>
    </div>
  )
}

function App() {
  const [navOpen, setNavOpen] = useState(false)

  const closeNav = () => setNavOpen(false)

  return (
    <div className="page">
      <div className="page-bg" aria-hidden="true" />

      <header className={`header ${navOpen ? 'header--nav-open' : ''}`}>
        <a className="brand" href="/" onClick={closeNav}>
          <span className="brand-wordmark">Famio</span>
          <span className="brand-dots" aria-hidden="true">
            <span className="brand-dot brand-dot--mint" />
            <span className="brand-dot brand-dot--sky" />
            <span className="brand-dot brand-dot--accent" />
          </span>
        </a>

        <nav className="nav" id="site-nav" aria-label="Primary">
          <a href="#chat-events" onClick={closeNav}>
            Chat
          </a>
          <a href="#family-map" onClick={closeNav}>
            Map
          </a>
          <a href="#travel-mode" onClick={closeNav}>
            Travel
          </a>
          <a href="#live-widgets" onClick={closeNav}>
            Live
          </a>
          <a href="#family-moments" onClick={closeNav}>
            Keepsakes
          </a>
          <a href="#moments" onClick={closeNav}>
            Why Famio
          </a>
          <a href="#plans" onClick={closeNav}>
            Plans
          </a>
          <a href="#crew-pulse" onClick={closeNav}>
            Pulse
          </a>
          <a href="#download" onClick={closeNav}>
            Download
          </a>
          <a href="#ideas" onClick={closeNav}>
            Ideas
          </a>
        </nav>

        <div className="header-end">
          <a className="btn btn-primary header-cta" href="#download">
            Get the app
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={navOpen}
            aria-controls="site-nav"
            onClick={() => setNavOpen((o) => !o)}
          >
            <span className="nav-toggle-bars" aria-hidden="true" />
            <span className="visually-hidden">
              {navOpen ? 'Close menu' : 'Open menu'}
            </span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow">The app your whole family will actually use</p>
            <h1 id="hero-heading">
              Chat, map, and travel updates—family style
            </h1>
            <p className="lede">
              Famio brings your household together with a fun family chat,
              events that appear like magic from flights and invites, a live
              map to see where everyone is, and travel mode so nobody has to
              text &ldquo;Just landed!&rdquo; five times.
            </p>
            <ul className="hero-tags" aria-label="Things Famio helps with">
              <li>Flight status</li>
              <li>Parties &amp; plans</li>
              <li>Calendar</li>
              <li>And more</li>
            </ul>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#download">
                Join the family
              </a>
              <a className="btn btn-ghost" href="#chat-events">
                Peek at features
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-device-scene">
              <div className="hero-device-blob hero-device-blob--a" />
              <div className="hero-device-blob hero-device-blob--b" />
              <div className="hero-phone">
                <div className="hero-phone-bezel">
                  <div className="hero-phone-screen">
                    <div className="hero-phone-notch" />
                    <header className="hero-phone-header">
                      <div className="hero-phone-header-main">
                        <span className="hero-phone-title">Family chat</span>
                        <span className="hero-phone-subtitle">
                          The whole household
                        </span>
                      </div>
                      <div className="hero-phone-avatars" aria-hidden={true}>
                        <span className="hero-phone-av hero-phone-av--1" />
                        <span className="hero-phone-av hero-phone-av--2" />
                        <span className="hero-phone-av hero-phone-av--3" />
                      </div>
                    </header>
                    <div className="hero-phone-feed">
                      <div className="hero-msg hero-msg--mom">
                        <span className="hero-msg-author">Mom</span>
                        <div className="hero-msg-bubble">
                          Grandma&apos;s flight is delayed—Famio already shows
                          the new landing time ✈️
                        </div>
                      </div>

                      <div className="hero-flight-card hero-flight-card--delayed">
                        <div className="hero-flight-card-top">
                          <span className="hero-flight-badge">Famio</span>
                          <span className="hero-flight-pill hero-flight-pill--delayed">
                            Delayed
                          </span>
                        </div>
                        <p className="hero-flight-was">Was 3:14 PM</p>
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
                        <FlightProgressBar progress={58} status="delayed" />
                        <div className="hero-flight-meta">
                          <span>+28 min</span>
                          <span className="hero-flight-dot" />
                          <span>Est. 3:42 PM</span>
                          <span className="hero-flight-dot" />
                          <span>Gate B12</span>
                        </div>
                      </div>

                      <div className="hero-msg hero-msg--you">
                        <span className="hero-msg-author">You</span>
                        <div className="hero-msg-bubble hero-msg-bubble--you">
                          Same here—saw the delay in Famio. On our way to pick
                          her up!
                        </div>
                      </div>

                      <div className="hero-msg hero-msg--dad">
                        <span className="hero-msg-author">Dad</span>
                        <div className="hero-msg-bubble">
                          Parking now. See you both at Terminal 2 💚
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features" id="features" aria-labelledby="features-heading">
          <div className="section-inner">
            <h2 id="features-heading" className="section-title">
              Everything fun families need
            </h2>
            <p className="section-sub section-sub--compact">
              See how Famio works—chat, map, and travel at a glance.
            </p>

            <div className="showcase-grid">
              <article className="showcase-card" id="chat-events">
                <div className="showcase-card-visual">
                  <FeatureChatGraphic />
                </div>
                <div className="showcase-card-copy">
                  <h3>Chat → calendar</h3>
                  <p className="showcase-blurb">
                    Flights, calendars, and invites drop into the thread as real
                    events—no retyping the plan.
                  </p>
                  <ul className="showcase-chips" aria-label="Smart sources">
                    <li>Flights</li>
                    <li>Calendar</li>
                    <li>Invites</li>
                  </ul>
                </div>
              </article>

              <article className="showcase-card showcase-card--map" id="family-map">
                <div className="showcase-card-visual showcase-card-visual--flush">
                  <FamilyMapExample />
                </div>
                <div className="showcase-card-copy">
                  <h3>Live family map</h3>
                  <p className="showcase-blurb">
                    Everyone on one map—quick check-ins without blowing up the
                    group chat.
                  </p>
                  <ul className="showcase-chips" aria-label="Map highlights">
                    <li>Live pins</li>
                    <li>Privacy</li>
                    <li>Glanceable</li>
                  </ul>
                </div>
              </article>

              <article className="showcase-card" id="travel-mode">
                <div className="showcase-card-visual">
                  <FeatureTravelGraphic />
                </div>
                <div className="showcase-card-copy">
                  <h3>Travel mode</h3>
                  <p className="showcase-blurb">
                    One toggle shares your trip—timelines, ETAs, and arrivals
                    for everyone along for the ride.
                  </p>
                  <ul className="showcase-chips" aria-label="Travel mode">
                    <li>Live progress</li>
                    <li>ETAs</li>
                    <li>Arrivals</li>
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          className="famio-live-widgets"
          id="live-widgets"
          aria-labelledby="famio-live-widgets-heading"
        >
          <div className="famio-live-widgets-glow" aria-hidden={true} />
          <div className="section-inner famio-live-widgets-inner">
            <div className="famio-live-widgets-layout">
              <div className="famio-live-widgets-copy">
                <span className="famio-live-widgets-dots brand-dots" aria-hidden={true}>
                  <span className="brand-dot brand-dot--mint" />
                  <span className="brand-dot brand-dot--sky" />
                  <span className="brand-dot brand-dot--accent" />
                </span>
                <p className="famio-live-widgets-kicker">iPhone</p>
                <h2 id="famio-live-widgets-heading" className="famio-live-widgets-title">
                  Flights on your Lock Screen
                </h2>
                <p className="famio-live-widgets-lede">
                  Shared trips can show up as a Live Activity—gate, ETA, and status
                  without unlocking your phone.
                </p>
                <ul
                  className="showcase-chips famio-live-widgets-chips"
                  aria-label="Highlights"
                >
                  <li>Live Activity</li>
                  <li>Gate &amp; ETA</li>
                  <li>Auto-updates</li>
                </ul>
                <p className="famio-live-widgets-footnote">
                  Supported iPhone, iOS, and Famio permissions where available.
                </p>
                <div className="famio-live-widgets-actions">
                  <a className="btn btn-primary" href="#download">
                    Get Famio
                  </a>
                  <a className="btn btn-ghost" href="#chat-events">
                    Flights in chat
                  </a>
                </div>
              </div>
              <div className="famio-live-widgets-visual-col">
                <FamioLiveWidgetsVisual />
              </div>
            </div>
          </div>
        </section>

        <section
          className="famio-moments"
          id="family-moments"
          aria-labelledby="famio-moments-heading"
        >
          <div className="famio-moments-glow" aria-hidden={true} />
          <div className="section-inner famio-moments-inner">
            <div className="famio-moments-layout">
              <div className="famio-moments-copy">
                <span className="famio-moments-dots brand-dots" aria-hidden={true}>
                  <span className="brand-dot brand-dot--mint" />
                  <span className="brand-dot brand-dot--sky" />
                  <span className="brand-dot brand-dot--accent" />
                </span>
                <p className="famio-moments-kicker">The big stuff deserves its own shelf</p>
                <h2 id="famio-moments-heading" className="famio-moments-title">
                  Family Moments
                </h2>
                <p className="famio-moments-lede">
                  Some updates are more than logistics. When someone joins the
                  family, a kid has a first day to remember, or you finally get
                  everyone together—those stories shouldn&apos;t vanish under a
                  pile of &ldquo;pick up milk&rdquo; messages.
                </p>
                <p className="famio-moments-lede famio-moments-lede--tight">
                  <strong className="famio-moments-strong">Family Moments</strong>{' '}
                  are sharable keepsakes you add on purpose. They&apos;re saved in
                  one calm timeline next to your everyday feed—easy to revisit,
                  celebrate again, and pass around the crew.
                </p>
                <ul className="famio-moments-points">
                  <li>
                    <span className="famio-moments-point-icon" aria-hidden={true} />
                    Mark births, anniversaries, graduations, reunions, and
                    whatever your family calls a big deal.
                  </li>
                  <li>
                    <span className="famio-moments-point-icon" aria-hidden={true} />
                    Add a short story (and photos when you want them) so the
                    memory stays vivid years later.
                  </li>
                  <li>
                    <span className="famio-moments-point-icon" aria-hidden={true} />
                    Everyone who should see it can—without rereading three weeks
                    of chat to find that one photo dump.
                  </li>
                </ul>
                <div className="famio-moments-actions">
                  <a className="btn btn-primary" href="#download">
                    Save moments in Famio
                  </a>
                  <a className="btn btn-ghost" href="#features">
                    Explore features
                  </a>
                </div>
              </div>
              <div className="famio-moments-visual-col">
                <FamioFamilyMomentsVisual />
              </div>
            </div>
          </div>
        </section>

        <section className="famio-wow" id="moments" aria-labelledby="famio-wow-heading">
          <div className="famio-wow-aurora" aria-hidden="true" />
          <div className="famio-wow-grid-bg" aria-hidden="true" />
          <div className="section-inner famio-wow-inner">
            <div className="famio-wow-layout">
              <div className="famio-wow-copy">
                <p className="famio-wow-kicker">Not another group chat.</p>
                <h2 id="famio-wow-heading" className="famio-wow-title">
                  The moment your family stops juggling threads—and{' '}
                  <span className="famio-wow-title-accent">finally clicks</span>.
                </h2>
                <p className="famio-wow-lede">
                  Famio is built for the beautiful chaos of real family life: one
                  place for chat, a live map everyone can trust, and travel
                  updates that don&apos;t need a novel-length text chain.
                </p>
                <ul className="famio-wow-wins">
                  <li>
                    <span className="famio-wow-win-icon" aria-hidden={true} />
                    Wake up knowing who&apos;s where—without the 7am ping storm.
                  </li>
                  <li>
                    <span className="famio-wow-win-icon" aria-hidden={true} />
                    Flights, invites, and calendars become real events in your
                    thread.
                  </li>
                  <li>
                    <span className="famio-wow-win-icon" aria-hidden={true} />
                    Road trips and school nights feel lighter for everyone.
                  </li>
                </ul>
                <div className="famio-wow-cta-row">
                  <a className="btn btn-primary" href="#download">
                    Get Famio free
                  </a>
                  <a className="btn btn-ghost" href="#plans">
                    See plans
                  </a>
                </div>
                <p className="famio-wow-footnote">
                  Free to start · No credit card · The people you love, one calm
                  home base
                </p>
              </div>
              <FamioWowVisual />
            </div>

            <div className="famio-wow-features">
              <h3 className="famio-wow-features-title">What you actually get</h3>
              <p className="famio-wow-features-lede">
                Famio isn&apos;t a generic messenger—it&apos;s the family stack:
                chat, map, travel, and smart events wired together so the day
                runs smoother.
              </p>
              <div className="showcase-grid famio-wow-showcase-grid">
                <article className="showcase-card famio-wow-showcase-p1">
                  <div className="showcase-card-visual">
                    <WowMiniChat />
                  </div>
                  <div className="showcase-card-copy">
                    <h3>Smart chat → real events</h3>
                    <p className="showcase-blurb">
                      Flights, calendar holds, and invites surface in the thread
                      as proper events—skip the screenshot-and-retype routine.
                    </p>
                    <ul
                      className="showcase-chips"
                      aria-label="Smart event sources"
                    >
                      <li>Flights</li>
                      <li>Calendar</li>
                      <li>Invites</li>
                    </ul>
                  </div>
                </article>

                <article className="showcase-card famio-wow-showcase-p2">
                  <div className="showcase-card-visual">
                    <WowMiniMap />
                  </div>
                  <div className="showcase-card-copy">
                    <h3>Live family map</h3>
                    <p className="showcase-blurb">
                      See where everyone is when it matters, with a map built
                      for quick check-ins—not constant surveillance.
                    </p>
                    <ul className="showcase-chips" aria-label="Map highlights">
                      <li>Live pins</li>
                      <li>Privacy</li>
                      <li>Glanceable</li>
                    </ul>
                  </div>
                </article>

                <article className="showcase-card famio-wow-showcase-p3">
                  <div className="showcase-card-visual">
                    <WowMiniTravel />
                  </div>
                  <div className="showcase-card-copy">
                    <h3>Travel mode</h3>
                    <p className="showcase-blurb">
                      Road trips and flights get shared ETAs, stops, and
                      arrivals—one calm stream for drivers and family at home.
                    </p>
                    <ul className="showcase-chips" aria-label="Travel mode">
                      <li>Live progress</li>
                      <li>Stops</li>
                      <li>Arrivals</li>
                    </ul>
                  </div>
                </article>

                <article className="showcase-card famio-wow-showcase-p2">
                  <div className="showcase-card-visual">
                    <WowMiniField />
                  </div>
                  <div className="showcase-card-copy">
                    <h3>Sports &amp; school rhythm</h3>
                    <p className="showcase-blurb">
                      Practices, games, and carpools sit next to your family chat
                      so sideline logistics don&apos;t live in ten different
                      apps.
                    </p>
                    <ul className="showcase-chips" aria-label="Schedule">
                      <li>Team chat</li>
                      <li>Calendar</li>
                      <li>Reminders</li>
                    </ul>
                  </div>
                </article>

                <article className="showcase-card famio-wow-showcase-p1">
                  <div className="showcase-card-visual">
                    <WowMiniGlance />
                  </div>
                  <div className="showcase-card-copy">
                    <h3>Glanceable peace of mind</h3>
                    <p className="showcase-blurb">
                      Fewer &ldquo;where are you?&rdquo; pings before school,
                      dinner, or pickup—status lives where your family already
                      looks.
                    </p>
                    <ul className="showcase-chips" aria-label="Check-ins">
                      <li>Map</li>
                      <li>Chat</li>
                      <li>Quiet</li>
                    </ul>
                  </div>
                </article>

                <article className="showcase-card famio-wow-showcase-p3">
                  <div className="showcase-card-visual">
                    <WowMiniPlans />
                  </div>
                  <div className="showcase-card-copy">
                    <h3>Grows with your village</h3>
                    <p className="showcase-blurb">
                      Start free with your household, move up to Plus for
                      smarter travel and flights in chat, or choose Gold for the
                      full experience—upgrade anytime in the app.
                    </p>
                    <ul className="showcase-chips" aria-label="Plans">
                      <li>Free</li>
                      <li>Plus</li>
                      <li>Gold</li>
                    </ul>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="plans" id="plans" aria-labelledby="plans-heading">
          <div className="section-inner">
            <h2 id="plans-heading" className="section-title">
              Plans for every size of family
            </h2>
            <p className="section-sub plans-sub">
              Starter covers the essentials for up to six people. Plus adds smarter
              events, live flights in chat, and travel mode for bigger households.
              Gold is the full experience—with multiple family groups coming soon.
            </p>

            <div className="tier-grid">
              <article
                className="tier-card tier-card--free"
                aria-labelledby="tier-famio-name"
              >
                <p className="tier-badge tier-badge-free">Starter</p>
                <h3 id="tier-famio-name" className="tier-name tier-name--with-brand">
                  <span className="tier-name-lockup">
                    <span className="tier-name-wordmark">Famio</span>
                    <span className="tier-name-dots brand-dots" aria-hidden={true}>
                      <span className="brand-dot brand-dot--mint" />
                      <span className="brand-dot brand-dot--sky" />
                      <span className="brand-dot brand-dot--accent" />
                    </span>
                  </span>
                </h3>
                <p className="tier-limit">
                  Up to <span className="tier-limit-num">6</span> members
                </p>
                <p className="tier-price">
                  <span className="tier-price-amount">£0</span>
                  <span className="tier-price-unit">forever</span>
                </p>
                <ul className="tier-features">
                  <li>Family feed &amp; chat</li>
                  <li>Live family map</li>
                  <li>Basic flight status</li>
                  <li>All your calendar events in one place</li>
                </ul>
                <a className="btn btn-ghost tier-cta" href="#download">
                  Get the app
                </a>
              </article>

              <article
                className="tier-card tier-card--plus tier-card-popular"
                aria-labelledby="tier-plus-name"
              >
                <p className="tier-badge tier-badge-plus">Most popular</p>
                <h3 id="tier-plus-name" className="tier-name tier-name--with-brand">
                  <span className="tier-name-lockup">
                    <span className="tier-name-wordmark">Famio</span>
                    <span className="tier-name-dots brand-dots" aria-hidden={true}>
                      <span className="brand-dot brand-dot--mint" />
                      <span className="brand-dot brand-dot--sky" />
                      <span className="brand-dot brand-dot--accent" />
                    </span>
                  </span>
                  <span className="tier-name-suffix">Plus</span>
                </h3>
                <p className="tier-limit">
                  Up to <span className="tier-limit-num">12</span> members
                </p>
                <p className="tier-price">
                  <span className="tier-price-amount">£6.99</span>
                  <span className="tier-price-unit">
                    per month · about £49/yr if you go annual
                  </span>
                </p>
                <ul className="tier-features">
                  <li>All Starter features</li>
                  <li>Smarter events from flights, invites &amp; calendars</li>
                  <li>Live flight status in family feed chat</li>
                  <li>Travel mode for trips &amp; road trips</li>
                </ul>
                <a className="btn btn-blue tier-cta" href="#download">
                  Get Plus in the app
                </a>
              </article>

              <article
                className="tier-card tier-card--gold"
                aria-labelledby="tier-gold-name"
              >
                <p className="tier-badge tier-badge-gold">Full experience</p>
                <h3 id="tier-gold-name" className="tier-name tier-name--with-brand">
                  <span className="tier-name-lockup">
                    <span className="tier-name-wordmark">Famio</span>
                    <span className="tier-name-dots brand-dots" aria-hidden={true}>
                      <span className="brand-dot brand-dot--mint" />
                      <span className="brand-dot brand-dot--sky" />
                      <span className="brand-dot brand-dot--accent" />
                    </span>
                  </span>
                  <span className="tier-name-suffix">Gold</span>
                </h3>
                <p className="tier-limit">
                  <span className="tier-limit-num">Unlimited</span> members
                </p>
                <p className="tier-price">
                  <span className="tier-price-amount">£12.99</span>
                  <span className="tier-price-unit">
                    per month · about £99/yr annual (best for big families)
                  </span>
                </p>
                <ul className="tier-features">
                  <li>Everything in Plus</li>
                  <li>Unlimited members—extended family, caregivers &amp; big gatherings</li>
                  <li className="tier-features-soon">
                    Multiple family groups under one subscription—coming soon
                  </li>
                </ul>
                <a className="btn btn-gold tier-cta" href="#download">
                  Get Gold in the app
                </a>
              </article>
            </div>
          </div>
        </section>

        <section
          className="famio-crew"
          id="crew-pulse"
          aria-labelledby="famio-crew-heading"
        >
          <div className="famio-crew-atmosphere" aria-hidden={true} />
          <div className="section-inner famio-crew-inner">
            <div className="famio-crew-layout">
              <div className="famio-crew-intro">
                <span className="famio-crew-dots brand-dots" aria-hidden={true}>
                  <span className="brand-dot brand-dot--mint" />
                  <span className="brand-dot brand-dot--sky" />
                  <span className="brand-dot brand-dot--accent" />
                </span>
                <p className="famio-crew-kicker">Don&apos;t miss this layer</p>
                <h2 id="famio-crew-heading" className="famio-crew-title">
                  The family pulse everyone actually checks.
                </h2>
                <p className="famio-crew-lede">
                  Famio isn&apos;t another tab to forget—it&apos;s the shared
                  rhythm for pickups, trips, flights, and everyday chaos. When
                  the crew runs here, fewer moments slip through the cracks.
                </p>
                <p className="famio-crew-hook">
                  If you&apos;ve ever thought{' '}
                  <em>&ldquo;I wish we had one place for all of this&rdquo;</em>
                  —this is it.
                </p>
                <div className="famio-crew-intro-cta">
                  <a className="btn btn-primary" href="#download">
                    Get the app
                  </a>
                  <a className="btn btn-ghost" href="#features">
                    See how it works
                  </a>
                </div>
              </div>
              <ul className="famio-crew-mosaic" aria-label="Moments Famio catches for your crew">
                {FAMIO_CREW_MOMENTS.map((m) => (
                  <li
                    key={m.id}
                    className={`famio-crew-card famio-crew-card--${m.vibe}`}
                  >
                    <h3 className="famio-crew-card-title">{m.title}</h3>
                    <p className="famio-crew-card-body">{m.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="download" id="download" aria-labelledby="download-heading">
          <div className="section-inner download-section-inner">
            <div className="download-card">
              <div className="download-card-blob download-card-blob--1" aria-hidden={true} />
              <div className="download-card-blob download-card-blob--2" aria-hidden={true} />
              <div className="download-card-blob download-card-blob--3" aria-hidden={true} />
              <div className="download-card-grid">
                <div className="download-card-main">
                  <div className="download-brand-lockup" aria-hidden={true}>
                    <span className="download-brand-word">Famio</span>
                    <span className="download-brand-dots">
                      <span className="download-brand-dot download-brand-dot--mint" />
                      <span className="download-brand-dot download-brand-dot--sky" />
                      <span className="download-brand-dot download-brand-dot--accent" />
                    </span>
                  </div>
                  <p className="download-kicker">
                    Free for up to 6 · No credit card to start
                  </p>
                  <h2 id="download-heading">Bring your family on Famio</h2>
                  <p className="download-lede">
                    One download, one place for your household—chat, live map,
                    smarter events, and travel updates on iPhone, iPad, and
                    Android.
                  </p>
                  <ul className="download-perks">
                    <li>Invite everyone in minutes</li>
                    <li>Kids, parents &amp; teens on the same page</li>
                    <li>Upgrade to Plus or Gold anytime in the app</li>
                  </ul>
                </div>
                <div className="download-card-aside">
                  <p className="download-aside-label">Get the app</p>
                  <div className="download-stores">
                    <a
                      className="download-store-btn download-store-btn--apple"
                      href="https://apps.apple.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="download-store-icon-wrap" aria-hidden={true}>
                        <svg
                          className="download-store-svg"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            width="32"
                            height="32"
                            rx="8"
                            fill="url(#dl-apple-grad)"
                          />
                          <path
                            d="M21.2 16.7c0-2.5 1.6-3.7 1.7-3.8-1-.9-2.3-1.5-3.6-1.5-1.5 0-2.2.9-3.3.9-1.1 0-1.9-.9-3.3-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.3 1.9 2.7 3.3 2.7 1.3 0 1.8-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.3-1.3 3.2-2.5.6-.9 1.1-1.8 1.5-2.8-3.8-1.4-4.4-6.6-1.2-8.9z"
                            fill="#fff"
                            opacity="0.95"
                          />
                          <path
                            d="M19.1 10.2c.8-1 1.3-2.3 1.2-3.6-1.1 0-2.5.7-3.3 1.7-.7.9-1.4 2.4-1.2 3.7 1.2.1 2.4-.6 3.3-1.8z"
                            fill="#fff"
                            opacity="0.95"
                          />
                          <defs>
                            <linearGradient
                              id="dl-apple-grad"
                              x1="6"
                              y1="4"
                              x2="26"
                              y2="28"
                            >
                              <stop stopColor="#50D291" />
                              <stop offset="0.5" stopColor="#4182F1" />
                              <stop offset="1" stopColor="#C012B1" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                      <span className="download-store-text">
                        <span className="download-store-micro">
                          Download on the
                        </span>
                        <span className="download-store-title">App Store</span>
                      </span>
                    </a>
                    <a
                      className="download-store-btn download-store-btn--google"
                      href="https://play.google.com/store"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="download-store-icon-wrap" aria-hidden={true}>
                        <svg
                          className="download-store-svg"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            width="32"
                            height="32"
                            rx="8"
                            fill="url(#dl-play-grad)"
                          />
                          <path
                            d="M14 11v10l8-5-8-5z"
                            fill="#fff"
                          />
                          <defs>
                            <linearGradient
                              id="dl-play-grad"
                              x1="8"
                              y1="6"
                              x2="26"
                              y2="26"
                            >
                              <stop stopColor="#4182F1" />
                              <stop offset="1" stopColor="#50D291" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                      <span className="download-store-text">
                        <span className="download-store-micro">Get it on</span>
                        <span className="download-store-title">Google Play</span>
                      </span>
                    </a>
                  </div>
                  <p className="download-fineprint">
                    Works on iPhone, iPad &amp; Android phones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="feature-request"
          id="ideas"
          aria-labelledby="feature-request-heading"
        >
          <div className="section-inner feature-request-inner">
            <div className="feature-request-card">
              <div className="feature-request-accent" aria-hidden={true} />
              <div className="feature-request-head">
                <span className="feature-request-dots brand-dots" aria-hidden={true}>
                  <span className="brand-dot brand-dot--mint" />
                  <span className="brand-dot brand-dot--sky" />
                  <span className="brand-dot brand-dot--accent" />
                </span>
                <p className="feature-request-kicker">Shape what we build next</p>
                <h2 id="feature-request-heading" className="feature-request-title">
                  Got a feature idea?
                </h2>
              </div>
              <p className="feature-request-lede">
                If you&apos;re using Famio and something would make family life
                easier, we want to hear it. Send a quick note—we read every
                message.
              </p>
              <div className="feature-request-actions">
                <a
                  className="btn btn-primary feature-request-cta"
                  href={FEATURE_REQUEST_HREF}
                >
                  Request a feature
                </a>
                <a className="btn btn-ghost feature-request-secondary" href="#download">
                  Get the app
                </a>
              </div>
              <p className="feature-request-hint">
                <span className="feature-request-hint-dots brand-dots" aria-hidden={true}>
                  <span className="brand-dot brand-dot--mint" />
                  <span className="brand-dot brand-dot--sky" />
                  <span className="brand-dot brand-dot--accent" />
                </span>
                <span className="feature-request-hint-copy">
                  Opens your email to{' '}
                  <span className="feature-request-email">hello@famio.app</span>
                  {' '}with a starter template you can edit.
                </span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-row">
            <div className="footer-brand-block">
              <p className="footer-brand">Famio</p>
              <p className="footer-tagline">
                Chat, maps, and travel updates—built for busy families.
              </p>
            </div>
            <nav className="footer-nav" aria-label="Footer">
              <a href="mailto:hello@famio.app">Contact</a>
              <a href="#ideas">Feature ideas</a>
              <a href="#crew-pulse">The pulse</a>
              <a href="#family-moments">Family Moments</a>
              <a href="#live-widgets">Live widgets</a>
              <a href="#download">Download</a>
              <a href="#features">Features</a>
            </nav>
          </div>
          <p className="footer-legal">
            © {new Date().getFullYear()} Famio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
