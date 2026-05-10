import { type FormEvent, useEffect, useState } from 'react'
import type { AuthChangeEvent } from '@supabase/supabase-js'
import { Link, useNavigate } from 'react-router-dom'
import { clearPasswordRecoveryActive } from '../auth/passwordRecoveryPending'
import { useAuth } from '../auth/AuthContext'
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'

const MIN_LEN = 8
const RECOVERY_CHECK_MS = 30000

export default function ResetPasswordPage() {
  const { ready } = useAuth()
  const navigate = useNavigate()
  const supabaseAuth = isSupabaseConfigured()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [pending, setPending] = useState(false)
  /** null = checking, true = magic link/session ok, false = invalid or timed out */
  const [recoveryOk, setRecoveryOk] = useState<boolean | null>(null)

  useEffect(() => {
    if (!supabaseAuth) {
      setRecoveryOk(false)
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setRecoveryOk(false)
      return
    }

    let cancelled = false

    /** Ensure URL→session exchange finished; then retry a few times (mobile / slow locks). */
    void (async () => {
      await supabase.auth.initialize()
      for (let attempt = 0; attempt < 6 && !cancelled; attempt++) {
        const { data } = await supabase.auth.getSession()
        if (cancelled) return
        if (data.session) {
          setRecoveryOk(true)
          return
        }
        await new Promise((r) => setTimeout(r, 120 * (attempt + 1)))
      }
    })()

    const { data } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session) => {
        if (cancelled) return
        if (event === 'PASSWORD_RECOVERY' && session) {
          setRecoveryOk(true)
          return
        }
        if (session) setRecoveryOk(true)
      },
    )

    const t = window.setTimeout(() => {
      if (!cancelled) setRecoveryOk((prev) => (prev === null ? false : prev))
    }, RECOVERY_CHECK_MS)

    return () => {
      cancelled = true
      window.clearTimeout(t)
      data.subscription.unsubscribe()
    }
  }, [supabaseAuth])

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setError(undefined)

    if (password.length < MIN_LEN) {
      setError(`Use at least ${MIN_LEN} characters.`)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setError('Supabase client is unavailable.')
      return
    }

    setPending(true)
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })
    setPending(false)

    if (updateError) {
      setError(updateError.message || 'Could not update password.')
      return
    }

    clearPasswordRecoveryActive()
    await supabase.auth.signOut().catch(() => {})
    navigate('/login', { replace: true, state: { passwordUpdated: true } })
  }

  if (!ready) {
    return (
      <div className="admin-auth-page admin-route-loading">
        <div className="admin-route-loading-dot" aria-hidden />
        <span className="visually-hidden">Loading…</span>
      </div>
    )
  }

  if (!supabaseAuth) {
    return (
      <div className="admin-auth-page">
        <div className="admin-auth-bg" aria-hidden />
        <div className="admin-auth-card-wrap">
          <header className="admin-auth-brand">
            <Link to="/" className="admin-auth-logo">
              Famio
            </Link>
            <p className="admin-auth-brand-sub">Reset password</p>
          </header>
          <div className="admin-auth-card">
            <h1 className="admin-auth-title">Reset unavailable</h1>
            <p className="admin-auth-lede">
              Configure Supabase Auth to use email password recovery.
            </p>
            <p className="admin-auth-footer-note">
              <Link to="/login">← Back to sign in</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (recoveryOk === null) {
    return (
      <div className="admin-auth-page admin-route-loading">
        <div className="admin-route-loading-dot" aria-hidden />
        <span className="visually-hidden">Confirming reset link…</span>
      </div>
    )
  }

  if (recoveryOk === false) {
    return (
      <div className="admin-auth-page">
        <div className="admin-auth-bg" aria-hidden />
        <div className="admin-auth-card-wrap">
          <header className="admin-auth-brand">
            <Link to="/" className="admin-auth-logo">
              Famio
            </Link>
            <p className="admin-auth-brand-sub">Reset password</p>
          </header>
          <div className="admin-auth-card">
            <h1 className="admin-auth-title">Link invalid or expired</h1>
            <p className="admin-auth-lede">
              Open the latest email we sent and tap the link once. If you started
              from the Famio app, finish in the browser that opens—then you can
              return to the app and sign in.
            </p>
            <p className="admin-auth-footer-note">
              <Link to="/forgot-password">Request a new link →</Link>
            </p>
            <p className="admin-auth-footer-note">
              <Link to="/login">← Back to sign in</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-bg" aria-hidden />

      <div className="admin-auth-card-wrap">
        <header className="admin-auth-brand">
          <Link to="/" className="admin-auth-logo">
            Famio
          </Link>
          <p className="admin-auth-brand-sub">New password</p>
        </header>

        <div className="admin-auth-card">
          <h1 className="admin-auth-title">Choose a password</h1>
          <p className="admin-auth-lede">
            After saving, you’ll sign back in with this password. Admin access
            still follows your profile and RLS rules.
          </p>

          <form className="admin-auth-form" onSubmit={handleSubmit}>
            <div className="admin-auth-field">
              <label htmlFor="reset-password">New password</label>
              <input
                id="reset-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={MIN_LEN}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="admin-auth-field">
              <label htmlFor="reset-password-confirm">Confirm password</label>
              <input
                id="reset-password-confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={MIN_LEN}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
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
              {pending ? 'Saving…' : 'Save password'}
            </button>
          </form>

          <p className="admin-auth-footer-note">
            <Link to="/login">← Cancel and sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
