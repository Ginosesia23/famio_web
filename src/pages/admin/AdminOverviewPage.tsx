import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { DashboardStats } from '../../admin/dashboardStats.types'
import {
  estimateMonthlyRecurringGbp,
  getFamioMonthlyPricesGbp,
} from '../../admin/pricing'
import { useDashboardStats } from '../../admin/useDashboardStats'

const nf = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })
const nfMoney = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'GBP',
})

function fmt(n: number) {
  return nf.format(n)
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

function SourcePill({ source }: { source: DashboardStats['source'] }) {
  const label =
    source === 'api'
      ? 'Live API'
      : source === 'supabase'
        ? 'Supabase'
        : source === 'unavailable'
          ? 'Supabase offline'
          : source === 'static_file'
            ? 'Static JSON'
            : 'Demo data'
  return (
    <span className={`admin-dash-source admin-dash-source--${source}`}>
      {label}
    </span>
  )
}

export default function AdminOverviewPage() {
  const { stats, notice, loading, refresh } = useDashboardStats()
  const pricing = useMemo(() => getFamioMonthlyPricesGbp(), [])

  const { starterPct, plusPct, goldPct } = useMemo(() => {
    if (!stats) {
      return { starterPct: 0, plusPct: 0, goldPct: 0 }
    }
    const sum =
      stats.planCounts.starter +
      stats.planCounts.plus +
      stats.planCounts.gold
    const denom = sum > 0 ? sum : 1
    return {
      starterPct: Math.round((100 * stats.planCounts.starter) / denom),
      plusPct: Math.round((100 * stats.planCounts.plus) / denom),
      goldPct: Math.round((100 * stats.planCounts.gold) / denom),
    }
  }, [stats])

  const rev = useMemo(() => {
    if (!stats) return null
    return estimateMonthlyRecurringGbp(
      stats.planCounts.starter,
      stats.planCounts.plus,
      stats.planCounts.gold,
    )
  }, [stats])

  const paidFamilies =
    stats !== null ? stats.planCounts.plus + stats.planCounts.gold : 0

  return (
    <main className="admin-dash-main" id="main">
      <div className="admin-dash-meta-row">
        <h1 className="admin-dash-page-title">Overview</h1>
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
              <SourcePill source={stats.source} />
              <span className="admin-dash-synced">
                Updated {formatFetchedAt(stats.fetchedAt)}
              </span>
            </>
          ) : (
            <span className="admin-dash-synced">Loading…</span>
          )}
        </div>
      </div>

      {notice ? (
        <aside className="admin-dash-banner" role="status">
          {notice}{' '}
          <Link to="/" className="admin-dash-banner-link">
            Marketing site →
          </Link>
        </aside>
      ) : null}

      <p className="admin-dash-intro admin-dash-intro--tight">
        Members, families, and plan mix from your connected data (Supabase
        directory when available). Estimated MRR uses list prices on the Revenue
        page.
      </p>

      {loading && !stats ? (
        <p className="admin-dash-loading">Pulling numbers…</p>
      ) : null}

      {stats && rev ? (
        <>
          <ul className="admin-dash-stat-cards" aria-live="polite">
            <li className="admin-dash-stat-card">
              <p className="admin-dash-stat-label">Members</p>
              <p className="admin-dash-stat-value">{fmt(stats.totalMembers)}</p>
              <p className="admin-dash-stat-hint">
                Distinct people (excludes invited / pending / removed)
              </p>
            </li>
            <li className="admin-dash-stat-card">
              <p className="admin-dash-stat-label">Families</p>
              <p className="admin-dash-stat-value">
                {fmt(stats.totalFamilies)}
              </p>
              <p className="admin-dash-stat-hint">
                Households with at least one member row
              </p>
            </li>
            <li className="admin-dash-stat-card">
              <p className="admin-dash-stat-label">Paid families</p>
              <p className="admin-dash-stat-value">{fmt(paidFamilies)}</p>
              <p className="admin-dash-stat-hint">
                Counted as Plus or Gold with an active billing status
              </p>
            </li>
            <li className="admin-dash-stat-card admin-dash-stat-card--money">
              <p className="admin-dash-stat-label">Est. MRR</p>
              <p className="admin-dash-stat-value">
                {nfMoney.format(rev.mrr)}
              </p>
              <p className="admin-dash-stat-hint">
                {nfMoney.format(pricing.plus)} Plus · {nfMoney.format(pricing.gold)}{' '}
                Gold · <Link to="/admin/revenue">full breakdown</Link>
              </p>
            </li>
            {typeof stats.betaSignups === 'number' ? (
              <li className="admin-dash-stat-card admin-dash-stat-card--muted">
                <p className="admin-dash-stat-label">Beta interest</p>
                <p className="admin-dash-stat-value">
                  {fmt(stats.betaSignups)}
                </p>
                <p className="admin-dash-stat-hint">
                  From your dashboard API or static JSON when configured
                </p>
              </li>
            ) : null}
          </ul>

          <section
            className="admin-dash-overview-plans"
            aria-labelledby="overview-plans"
          >
            <h2 className="admin-dash-section-title" id="overview-plans">
              Households by plan
            </h2>

            <div className="admin-dash-plan-block">
              <div
                className="admin-dash-plan-bar"
                role="img"
                aria-label={`Starter ${stats.planCounts.starter}, Plus ${stats.planCounts.plus}, Gold ${stats.planCounts.gold}`}
              >
                <span
                  className="admin-dash-plan-seg admin-dash-plan-seg--starter"
                  style={{ width: `${starterPct}%` }}
                  title={`Starter · ${stats.planCounts.starter}`}
                />
                <span
                  className="admin-dash-plan-seg admin-dash-plan-seg--plus"
                  style={{ width: `${plusPct}%` }}
                  title={`Plus · ${stats.planCounts.plus}`}
                />
                <span
                  className="admin-dash-plan-seg admin-dash-plan-seg--gold"
                  style={{ width: `${goldPct}%` }}
                  title={`Gold · ${stats.planCounts.gold}`}
                />
              </div>

              <dl className="admin-dash-plan-legend">
                <div className="admin-dash-plan-row">
                  <dt>
                    <span
                      className="admin-dash-sw admin-dash-sw--starter"
                      aria-hidden
                    />{' '}
                    Starter
                  </dt>
                  <dd>{fmt(stats.planCounts.starter)}</dd>
                  <dd className="admin-dash-plan-pct">
                    {starterPct}%
                  </dd>
                </div>
                <div className="admin-dash-plan-row">
                  <dt>
                    <span
                      className="admin-dash-sw admin-dash-sw--plus"
                      aria-hidden
                    />{' '}
                    Plus
                  </dt>
                  <dd>{fmt(stats.planCounts.plus)}</dd>
                  <dd className="admin-dash-plan-pct">{plusPct}%</dd>
                </div>
                <div className="admin-dash-plan-row">
                  <dt>
                    <span
                      className="admin-dash-sw admin-dash-sw--gold"
                      aria-hidden
                    />{' '}
                    Gold
                  </dt>
                  <dd>{fmt(stats.planCounts.gold)}</dd>
                  <dd className="admin-dash-plan-pct">{goldPct}%</dd>
                </div>
              </dl>
            </div>
          </section>

          <nav className="admin-dash-overview-nav" aria-label="Admin sections">
            <Link to="/admin/revenue">Revenue</Link>
            <Link to="/admin/families">Families</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/">Marketing site</Link>
          </nav>
        </>
      ) : null}
    </main>
  )
}
