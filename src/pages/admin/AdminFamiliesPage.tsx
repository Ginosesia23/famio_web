import { useMemo, useState } from 'react'
import type { AdminFamilyDirectoryRow } from '../../admin/fetchSupabaseDirectory'
import { useAdminFamiliesDirectory } from '../../admin/useAdminFamiliesDirectory'

function shortId(uuid: string) {
  if (uuid.length <= 10) return uuid
  return `${uuid.slice(0, 8)}…`
}

function tierLabel(t: AdminFamilyDirectoryRow['tier']) {
  if (t === 'starter') return 'Starter'
  if (t === 'plus') return 'Plus'
  return 'Gold'
}

export default function AdminFamiliesPage() {
  const { rows, error, loading, refresh } = useAdminFamiliesDirectory()
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const qn = q.trim().toLowerCase()
    if (!qn) return rows
    return rows.filter((r) => r.familyId.toLowerCase().includes(qn))
  }, [rows, q])

  return (
    <main className="admin-dash-main" id="main">
      <div className="admin-dash-meta-row">
        <h1 className="admin-dash-page-title">Families</h1>
        <button
          type="button"
          className="btn btn-ghost admin-dash-refresh"
          onClick={() => void refresh()}
          disabled={loading}
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <p className="admin-dash-intro">
        Rows from Supabase <code>family_members</code> (counts). Tier uses one{' '}
        <code>family_subscriptions</code> row per household: billable statuses
        (active, trialing, past due, paid, …) are preferred over canceled rows,
        then the newest by <code>updated_at</code>. Need staff RLS.
      </p>

      {error ? (
        <aside className="admin-dash-banner" role="alert">
          {error}
        </aside>
      ) : null}

      <div className="admin-dash-toolbar">
        <label className="admin-dash-filter">
          <span className="visually-hidden">Filter by family id</span>
          <input
            type="search"
            placeholder="Filter by family id…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="admin-dash-filter-input"
          />
        </label>
        <p className="admin-dash-muted">
          {filtered.length === rows.length
            ? `${rows.length} families`
            : `${filtered.length} of ${rows.length} families`}
        </p>
      </div>

      {loading ? <p className="admin-dash-loading">Loading families…</p> : null}

      {!loading && rows.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Family</th>
                <th>Tier</th>
                <th>Members</th>
                <th>Active*</th>
                <th>Billing status</th>
                <th>Plan (raw)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.familyId}>
                  <td title={r.familyId}>
                    <span className="admin-mono">{shortId(r.familyId)}</span>
                  </td>
                  <td>
                    <span
                      className={`admin-tier-pill admin-tier-pill--${r.tier}`}
                    >
                      {tierLabel(r.tier)}
                    </span>
                  </td>
                  <td>{r.memberCount}</td>
                  <td>{r.activeMemberCount}</td>
                  <td>{r.subscriptionStatus ?? '—'}</td>
                  <td className="admin-mono-muted">{r.planLabel ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {!loading && rows.length === 0 && !error ? (
        <p className="admin-dash-muted">No family rows loaded.</p>
      ) : null}

      <p className="admin-dash-footnote">
        *Active = member rows excluding invited/pending/removed statuses (same
        idea as Overview metrics refresh SQL).
      </p>
    </main>
  )
}
