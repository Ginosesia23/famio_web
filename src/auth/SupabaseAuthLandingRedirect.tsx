import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Supabase password recovery should open `/reset-password`, but if `redirectTo` is not
 * in the project allowlist, Supabase falls back to the **Site URL** (`/`). We move
 * valid recovery tokens to `/reset-password`. If the link already failed (e.g.
 * `otp_expired`), send users to forgot-password with a hint.
 */
export function SupabaseAuthLandingRedirect() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/') return

    const { hash, search } = window.location
    const blob = `${search}\n${hash}`

    if (blob.includes('otp_expired')) {
      navigate('/forgot-password?link=expired', { replace: true })
      return
    }

    const recoveryInHash =
      hash.length > 2 &&
      /\baccess_token=/.test(hash) &&
      (hash.includes('type=recovery') || hash.includes('type%3Drecovery'))

    if (recoveryInHash) {
      navigate({ pathname: '/reset-password', search, hash }, { replace: true })
      return
    }

    const qp = new URLSearchParams(
      search.startsWith('?') ? search.slice(1) : search,
    )
    if (qp.get('code') && !qp.get('error')) {
      navigate({ pathname: '/reset-password', search, hash }, { replace: true })
    }
  }, [location.pathname, navigate])

  return null
}
