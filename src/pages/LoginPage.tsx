import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { isSupabaseConfigured } from '../supabase/client'

export default function LoginPage() {
  const { user, ready, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const stateFrom = (location.state as { from?: string } | null)?.from
  const passwordUpdated = Boolean(
    (location.state as { passwordUpdated?: boolean } | null)?.passwordUpdated,
  )
  const redirectTo =
    stateFrom && stateFrom.startsWith('/admin') ? stateFrom : '/admin'

  const supabaseAuth = isSupabaseConfigured()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [pending, setPending] = useState(false)

  if (!ready) {
    return (
      <div className="admin-auth-page admin-route-loading">
        <div className="admin-route-loading-dot" aria-hidden />
        <span className="visually-hidden">Loading session…</span>
      </div>
    )
  }

  if (user) {
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setError(undefined)
    setPending(true)
    const out = await login(email, password)
    setPending(false)
    if (!out.ok) {
      setError(out.message)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-bg" aria-hidden />

      <div className="admin-auth-card-wrap">
        <header className="admin-auth-brand">
          <Link to="/" className="admin-auth-logo">
            Famio
          </Link>
          <p className="admin-auth-brand-sub">Staff sign in</p>
        </header>

        <div className="admin-auth-card">
          <h1 className="admin-auth-title">Log in</h1>
          {passwordUpdated ? (
            <p className="admin-auth-success" role="status">
              Password updated — sign in with your new password.
            </p>
          ) : null}
          {supabaseAuth ? (
            <p className="admin-auth-lede">
              Sign in with Supabase Auth. Primary rule:{' '}
              <code>profiles.access = admin</code> (otherwise{' '}
              <code>member</code> stays on the household app only). Fallbacks:
              JWT <code>admin</code> metadata or{' '}
              <code>VITE_ADMIN_EMAIL</code> / <code>VITE_ADMIN_ALLOWED_EMAILS</code>.
            </p>
          ) : (
            <p className="admin-auth-lede">
              Access the admin dashboard. Set <code>VITE_SUPABASE_URL</code> and{' '}
              <code>VITE_SUPABASE_ANON_KEY</code> to use real accounts; otherwise
              use <code>VITE_ADMIN_EMAIL</code> and{' '}
              <code>VITE_ADMIN_PASSWORD</code> (or dev defaults below).
            </p>
          )}

          {import.meta.env.DEV && !supabaseAuth ? (
            <p className="admin-auth-demo-hint">
              Dev demo (no Supabase):&nbsp;
              <strong>admin@famio.local</strong> ·{' '}
              <strong>famio-admin-dev</strong>
            </p>
          ) : null}

          <form className="admin-auth-form" onSubmit={handleSubmit}>
            <div className="admin-auth-field">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="admin-auth-field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {supabaseAuth ? (
                <p className="admin-auth-forgot-wrap">
                  <Link
                    to="/forgot-password"
                    className="admin-auth-forgot-link"
                  >
                    Forgot password?
                  </Link>
                </p>
              ) : null}
            </div>

            {error ? (
              <p className="admin-auth-error" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="btn btn-primary admin-auth-submit"
              disabled={pending}
            >
              {pending ? 'Signing in…' : 'Continue'}
            </button>
          </form>

          <p className="admin-auth-footer-note">
            <Link to="/">← Back to famio website</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
