import type { SupabaseClient, User } from '@supabase/supabase-js'

import { isAuthorizedAdminUser } from './adminGate'

/** From `profiles.access` (normalized). */
export type ProfileAccessTier = 'admin' | 'member' | 'unknown'

/**
 * Loads `profiles.access` for Supabase `/admin` gating.
 * Returns `unknown` if the row is missing, RLS blocks the read, or the value is unrecognized.
 */
export async function fetchProfilesAccessTier(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileAccessTier> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('access')
      .eq('id', userId)
      .maybeSingle()
    if (error || data == null || typeof data !== 'object') return 'unknown'
    const access = Reflect.get(data as object, 'access')
    const raw = typeof access === 'string' ? access.trim().toLowerCase() : ''
    if (raw === 'admin') return 'admin'
    if (raw === 'member') return 'member'
    return 'unknown'
  } catch {
    return 'unknown'
  }
}

/**
 * True if user may load `/admin`:
 * • `profiles.access === 'admin'`
 * • `profiles.access === 'member'` → false (family-only)
 * • missing/other → existing JWT/email allowlist (see `adminGate`)
 */
export async function resolveAdminDashboardAccess(
  supabase: SupabaseClient,
  user: User,
): Promise<boolean> {
  const tier = await fetchProfilesAccessTier(supabase, user.id)
  if (tier === 'admin') return true
  if (tier === 'member') return false
  return isAuthorizedAdminUser(user)
}
