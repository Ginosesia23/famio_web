/**
 * Link target for Supabase `resetPasswordForEmail` (must appear in Dashboard → Authentication → Redirect URLs).
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
