import type { User } from '@supabase/supabase-js'

function parseEmailAllowlist(raw?: string): string[] {
  const t = raw?.trim()
  if (!t) return []
  return t
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Legacy staff check: JWT metadata + VITE_ADMIN_* email allowlists.
 * Prefer `profiles.access = 'admin'` via `resolveAdminDashboardAccess()` when available.
 *
 * Emails allowed if listed in `VITE_ADMIN_ALLOWED_EMAILS` **or** matching
 * `VITE_ADMIN_EMAIL` (so one-staff setups can reuse the legacy single-email var).
 */
export function isAuthorizedAdminUser(user: User): boolean {
  const meta = user.app_metadata ?? {}
  const umeta = user.user_metadata ?? {}
  if (meta.admin === true || umeta.admin === true) return true

  const roleRaw = meta.role ?? umeta.role
  const roleOk =
    typeof roleRaw === 'string' &&
    roleRaw.trim().toLowerCase() === 'admin'
  if (roleOk) return true

  const fromList = parseEmailAllowlist(import.meta.env.VITE_ADMIN_ALLOWED_EMAILS)
  const legacySingle = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase()
  const allow = [...fromList, ...(legacySingle ? [legacySingle] : [])]
  const uniq = [...new Set(allow)]

  if (uniq.length === 0) return false

  const em = user.email?.trim().toLowerCase()
  return !!em && uniq.includes(em)
}
