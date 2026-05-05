/**
 * Canonical public origin for auth email links (`resetPasswordForEmail` redirectTo).
 * Required in production builds if the app is opened from a different origin than
 * users use in the browser when requesting a reset (otherwise redirectTo can mismatch
 * Supabase allowlists). No trailing slash.
 * Example: https://www.famio.co.uk
 */
export function getPasswordResetRedirectUrl(): string {
  const raw = import.meta.env.VITE_AUTH_SITE_URL?.trim()
  const origin =
    raw ? raw.replace(/\/$/, '') : typeof window !== 'undefined'
      ? window.location.origin
      : ''
  if (!origin) return '/reset-password'
  return `${origin}/reset-password`
}
