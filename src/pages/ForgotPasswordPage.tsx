import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPasswordResetRedirectUrl } from '../auth/authSiteUrl'
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'

export default function ForgotPasswordPage() {
  const supabaseAuth = isSupabaseConfigured()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setError(undefined)

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setError('Supabase client is unavailable. Check URL and anon key in .env.')
      return
    }

    setPending(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: getPasswordResetRedirectUrl(),
      },
    )
    setPending(false)

    if (resetError) {
      setError(resetError.message || 'Could not send reset email.')
      return
    }
    setSent(true)
  }

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
          <h1 className="admin-auth-title">Forgot password?</h1>

          {!supabaseAuth ? (
            <>
              <p className="admin-auth-lede">
                Password reset uses Supabase Auth. Add{' '}
                <code>VITE_SUPABASE_URL</code> and{' '}
                <code>VITE_SUPABASE_ANON_KEY</code> to your env, restart Vite, and
                try again.
              </p>
              <p className="admin-auth-footer-note">
                <Link to="/login">← Back to sign in</Link>
              </p>
            </>
          ) : sent ? (
            <>
              <p className="admin-auth-lede">
                If an account exists for <strong>{email.trim()}</strong>, we sent a
                link to choose a new password. Check your inbox (and spam).
              </p>
              <p className="admin-auth-demo-hint">
                Redirect URL must be allowed in Supabase Dashboard → Authentication
                → URL configuration (add{' '}
                <code>{getPasswordResetRedirectUrl()}</code>).
              </p>
              <p className="admin-auth-footer-note">
                <Link to="/login">← Back to sign in</Link>
              </p>
            </>
          ) : (
            <>
              <p className="admin-auth-lede">
                Enter the email you use for staff sign-in. We’ll email you a secure
                link that expires after a short time.
              </p>

              <form className="admin-auth-form" onSubmit={handleSubmit}>
                <div className="admin-auth-field">
                  <label htmlFor="forgot-email">Email</label>
                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  {pending ? 'Sending…' : 'Email reset link'}
                </button>
              </form>

              <p className="admin-auth-footer-note">
                <Link to="/login">← Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
