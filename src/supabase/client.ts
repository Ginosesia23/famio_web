import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

function trimQuoted(raw?: string): string | undefined {
  let t = raw?.trim()
  if (!t) return undefined
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    t = t.slice(1, -1).trim()
  }
  return t || undefined
}

/** True when URL + anon key are wired (restart Vite after .env edits). */
export function isSupabaseConfigured(): boolean {
  return !!(
    trimQuoted(import.meta.env.VITE_SUPABASE_URL) &&
    trimQuoted(import.meta.env.VITE_SUPABASE_ANON_KEY)
  )
}

/**
 * Shared browser client — sessions persist so admin auth + gated API reads use JWT.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = trimQuoted(import.meta.env.VITE_SUPABASE_URL)
  const key = trimQuoted(import.meta.env.VITE_SUPABASE_ANON_KEY)
  if (!url || !key) return null
  if (!cached) {
    cached = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: localStorage,
      },
    })
  }
  return cached
}
