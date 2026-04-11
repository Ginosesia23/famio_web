/**
 * Decorative preview of the Family Moments keepsake timeline (marketing).
 */
export function FamioFamilyMomentsVisual() {
  return (
    <figure className="moments-visual-root" aria-hidden={true}>
      <div className="moments-visual">
        <div className="moments-visual-stack" aria-hidden={true}>
          <div className="moments-visual-feed-glimpse">
            <span className="moments-visual-feed-line moments-visual-feed-line--dim" />
            <span className="moments-visual-feed-line" />
            <span className="moments-visual-feed-line moments-visual-feed-line--dim" />
          </div>
        </div>
        <div className="moments-visual-panel">
          <div className="moments-visual-panel-head">
            <span className="moments-visual-pill">Keepsakes</span>
            <p className="moments-visual-panel-title">Family moments</p>
          </div>
          <ol className="moments-visual-timeline">
            <li className="moments-node moments-node--mint">
              <span className="moments-node-dot" />
              <div className="moments-node-card">
                <time className="moments-node-date" dateTime="2026-03-14">
                  Mar 14, 2026
                </time>
                <p className="moments-node-title">Welcome, baby June</p>
                <p className="moments-node-tag">New arrival</p>
              </div>
            </li>
            <li className="moments-node moments-node--sky">
              <span className="moments-node-dot" />
              <div className="moments-node-card">
                <time className="moments-node-date" dateTime="2025-09-02">
                  Sep 2, 2025
                </time>
                <p className="moments-node-title">First day of kindergarten</p>
                <p className="moments-node-tag">Milestone</p>
              </div>
            </li>
            <li className="moments-node moments-node--accent">
              <span className="moments-node-dot" />
              <div className="moments-node-card">
                <time className="moments-node-date" dateTime="2025-06-21">
                  Jun 21, 2025
                </time>
                <p className="moments-node-title">Grandma&apos;s 70th</p>
                <p className="moments-node-tag">Celebration</p>
              </div>
            </li>
          </ol>
          <div className="moments-visual-footer">
            <span className="moments-visual-add">+ Add a moment</span>
            <span className="moments-visual-hint">Saved here—not buried in chat</span>
          </div>
        </div>
      </div>
    </figure>
  )
}
