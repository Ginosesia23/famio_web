import { useMemo, useState } from 'react'
import { useAdminUsersDirectory } from '../../admin/useAdminUsersDirectory'

function shortId(uuid: string) {
  if (uuid.length <= 10) return uuid
  return `${uuid.slice(0, 8)}…`
}

export default function AdminUsersPage() {
  const { rows, error, loading, refresh } = useAdminUsersDirectory()
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const qn = q.trim().toLowerCase()
    if (!qn) return rows
    return rows.filter((r) => {
      const pool = [r.email, r.displayName, r.userId ?? '', r.roles.join(' ')]
        .join(' ')
        .toLowerCase()
      return pool.includes(qn)
    })
  }, [rows, q])

  return (
    <main className="admin-dash-main" id="main">
      <div className="admin-dash-meta-row">
        <h1 className="admin-dash-page-title">Users</h1>
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
        Distinct people from <code>family_members</code> excluding
        invited/pending/removed. Roles are merged across households; without a{' '}
        <code>user_id</code> we fall back to email until an invite completes.
      </p>

      {error ? (
        <aside className="admin-dash-banner" role="alert">
          {error}
        </aside>
      ) : null}

      <div className="admin-dash-toolbar">
        <label className="admin-dash-filter">
          <span className="visually-hidden">Filter users</span>
          <input
            type="search"
            placeholder="Search email, name, role…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="admin-dash-filter-input"
          />
        </label>
        <p className="admin-dash-muted">
          {filtered.length === rows.length
            ? `${rows.length} people`
            : `${filtered.length} of ${rows.length} people`}
        </p>
      </div>

      {loading ? <p className="admin-dash-loading">Loading users…</p> : null}

      {!loading && rows.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Display name</th>
                <th>Role(s)</th>
                <th>Families</th>
                <th>Memberships</th>
                <th>User id</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.key}>
                  <td>{r.email ?? '—'}</td>
                  <td>{r.displayName ?? '—'}</td>
                  <td>{r.roles.length ? r.roles.join(', ') : '—'}</td>
                  <td>{r.familyIds.length}</td>
                  <td>{r.memberships}</td>
                  <td
                    title={r.userId ?? undefined}
                    className="admin-mono-muted"
                  >
                    {r.userId ? shortId(r.userId) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {!loading && rows.length === 0 && !error ? (
        <p className="admin-dash-muted">No user rows loaded.</p>
      ) : null}
    </main>
  )
}
