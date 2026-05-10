import { type FormEvent, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getPasswordResetRedirectUrl } from '../auth/authSiteUrl'
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'

export default function ForgotPasswordPage() {
  const supabaseAuth = isSupabaseConfigured()
  const [searchParams] = useSearchParams()
  const linkIssue = searchParams.get('link')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setError(undefined)

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setError('Password reset is not available right now. Please try again later.')
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
          {!sent && linkIssue === 'expired' ? (
            <p className="admin-auth-error" role="status">
              That reset link has expired or was already used (some apps and mail
              clients open links once for security). Request a new email and tap
              the link once—finish in the browser that opens.
            </p>
          ) : null}

          {!supabaseAuth ? (
            <>
              <p className="admin-auth-lede">
                Password reset is not enabled for this site yet. Please contact
                your team if you need help accessing your account.
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
                Requested this from the Famio app? Tap the link in your email—it
                opens in your browser—and set your new password there before going
                back to the app.
              </p>
              <p className="admin-auth-demo-hint">
                Didn’t get the email after a minute or two? Check spam / junk, or
                try again later.
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
