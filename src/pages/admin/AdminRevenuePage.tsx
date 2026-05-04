import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  estimateMonthlyRecurringGbp,
  getFamioMonthlyPricesGbp,
} from '../../admin/pricing'
import type { DashboardStats } from '../../admin/dashboardStats.types'
import { useDashboardStats } from '../../admin/useDashboardStats'

const nf0 = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })
const nfMoney = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'GBP',
})

function fmt0(n: number) {
  return nf0.format(n)
}

function formatFetchedAt(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function SourcePillMini({ source }: { source: DashboardStats['source'] }) {
  const label =
    source === 'api'
      ? 'Live API'
      : source === 'supabase'
        ? 'Supabase'
        : source === 'unavailable'
          ? 'Offline'
          : source === 'static_file'
            ? 'Static JSON'
            : 'Demo'
  return (
    <span className={`admin-dash-source admin-dash-source--${source}`}>
      {label}
    </span>
  )
}

export default function AdminRevenuePage() {
  const { stats, notice, loading, refresh } = useDashboardStats()

  const pricing = useMemo(() => getFamioMonthlyPricesGbp(), [])
  const rev = useMemo(() => {
    if (!stats) return null
    return estimateMonthlyRecurringGbp(
      stats.planCounts.starter,
      stats.planCounts.plus,
      stats.planCounts.gold,
    )
  }, [stats])

  return (
    <main className="admin-dash-main" id="main">
      <div className="admin-dash-meta-row">
        <h1 className="admin-dash-page-title">Revenue</h1>
        <div className="admin-dash-meta-end">
          <button
            type="button"
            className="btn btn-ghost admin-dash-refresh"
            onClick={() => refresh()}
            disabled={loading}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
          {stats ? (
            <>
              <SourcePillMini source={stats.source} />
              <span className="admin-dash-synced">
                {formatFetchedAt(stats.fetchedAt)}
              </span>
            </>
          ) : null}
        </div>
      </div>

      <p className="admin-dash-intro">
        Estimated <strong>monthly recurring revenue (MRR)</strong> using list
        prices from the marketing site (
        <strong>{nfMoney.format(pricing.plus)}</strong>/mo Plus,{' '}
        <strong>{nfMoney.format(pricing.gold)}</strong>/mo Gold). Starter stays
        at £0. Tune with{' '}
        <code>VITE_ADMIN_PRICE_PLUS_MONTHLY_GBP</code> /{' '}
        <code>VITE_ADMIN_PRICE_GOLD_MONTHLY_GBP</code>. This is not payouts from
        Stripe—only a directional view from household counts by tier.
      </p>

      {notice ? (
        <aside className="admin-dash-banner" role="status">
          {notice}{' '}
          <Link to="/" className="admin-dash-banner-link">
            Marketing site →
          </Link>
        </aside>
      ) : null}

      {loading && !stats ? (
        <p className="admin-dash-loading">Loading plan mix…</p>
      ) : null}

      {stats && rev ? (
        <>
          <ul className="admin-dash-stat-cards admin-dash-rev-cards">
            <li className="admin-dash-stat-card">
              <p className="admin-dash-stat-label">Estimated MRR</p>
              <p className="admin-dash-stat-value admin-dash-rev-mrr">
                {nfMoney.format(rev.mrr)}
              </p>
              <p className="admin-dash-stat-hint">
                Plus + Gold families × list price
              </p>
            </li>
          </ul>

          <section className="admin-dash-plan-block" aria-labelledby="rev-table">
            <h2 className="admin-dash-section-title" id="rev-table">
              By tier
            </h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tier</th>
                    <th>Families</th>
                    <th>List price</th>
                    <th>Est. contribution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Starter (free)</td>
                    <td>{fmt0(stats.planCounts.starter)}</td>
                    <td>£0</td>
                    <td>{nfMoney.format(rev.byTier.starter)}</td>
                  </tr>
                  <tr>
                    <td>Plus</td>
                    <td>{fmt0(stats.planCounts.plus)}</td>
                    <td>{nfMoney.format(pricing.plus)} / mo</td>
                    <td>{nfMoney.format(rev.byTier.plus)}</td>
                  </tr>
                  <tr>
                    <td>Gold</td>
                    <td>{fmt0(stats.planCounts.gold)}</td>
                    <td>{nfMoney.format(pricing.gold)} / mo</td>
                    <td>{nfMoney.format(rev.byTier.gold)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <p className="admin-dash-footnote">
            Household tier counts come from{' '}
            <code>family_subscriptions</code> (billable row preference + rules
            on the <Link to="/admin/families">Families</Link> page). MRR = Plus
            and Gold households × list prices above. Beta or other KPIs can come
            from <code>VITE_ADMIN_DASHBOARD_STATS_URL</code> or{' '}
            <code>public/admin-stats.json</code>.
          </p>
        </>
      ) : null}
    </main>
  )
}
