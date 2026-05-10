import { type FormEvent, useEffect, useRef, useState } from 'react'
import {
  isAuthPKCECodeVerifierMissingError,
  type AuthChangeEvent,
} from '@supabase/supabase-js'
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
  /**
   * PKCE recovery needs a code_verifier stored when the reset was *requested*.
   * Opening the email on another device/browser has no verifier — exchange fails.
   */
  const [pkceWrongBrowser, setPkceWrongBrowser] = useState(false)

  const failTimerRef = useRef<ReturnType<typeof window.setTimeout> | undefined>(
    undefined,
  )

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
    setPkceWrongBrowser(false)

    const clearFailTimer = () => {
      if (failTimerRef.current !== undefined) {
        window.clearTimeout(failTimerRef.current)
        failTimerRef.current = undefined
      }
    }

    const settleOk = () => {
      if (!cancelled) {
        clearFailTimer()
        setRecoveryOk(true)
      }
    }

    failTimerRef.current = window.setTimeout(() => {
      if (!cancelled) setRecoveryOk((prev) => (prev === null ? false : prev))
    }, RECOVERY_CHECK_MS)

    void (async () => {
      await supabase.auth.initialize()
      if (cancelled) return

      let {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        settleOk()
        return
      }

      const code = new URLSearchParams(window.location.search).get('code')
      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code)
        if (cancelled) return

        if (exchangeError && isAuthPKCECodeVerifierMissingError(exchangeError)) {
          clearFailTimer()
          setPkceWrongBrowser(true)
          setRecoveryOk(false)
          return
        }

        if (!exchangeError) {
          ;({
            data: { session },
          } = await supabase.auth.getSession())
          if (session) {
            settleOk()
            return
          }
        }
      }

      for (let attempt = 0; attempt < 6 && !cancelled; attempt++) {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          settleOk()
          return
        }
        await new Promise((r) => setTimeout(r, 120 * (attempt + 1)))
      }
    })()

    const { data } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session) => {
        if (cancelled) return
        if (event === 'PASSWORD_RECOVERY' && session) {
          settleOk()
          return
        }
        if (session) settleOk()
      },
    )

    return () => {
      cancelled = true
      clearFailTimer()
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
            <h1 className="admin-auth-title">
              {pkceWrongBrowser
                ? 'Open the link in this browser'
                : 'Link invalid or expired'}
            </h1>
            {pkceWrongBrowser ? (
              <p className="admin-auth-lede">
                This secure link only works in the{' '}
                <strong>same browser</strong> where the reset was requested (the
                link and that page share a one-time key). Request a new email
                and open it <strong>here</strong>—or request the reset from this
                phone’s browser if you prefer to stay on mobile.
              </p>
            ) : (
              <p className="admin-auth-lede">
                Open the latest email we sent and tap the link once. If you
                started from the Famio app, finish in the browser that
                opens—then you can return to the app and sign in.
              </p>
            )}
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
