/**
 * Marks an in-progress Supabase password recovery so INITIAL_SESSION
 * re-runs (e.g. React Strict Mode remount) don't call signOut() and
 * invalidate the one-time recovery session.
 */
const STORAGE_KEY = 'famio-password-recovery-active'

export function markPasswordRecoveryActive(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(Date.now()))
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearPasswordRecoveryActive(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

/** Recovery flows should skip admin gate + avoid signOut (session stays for /reset-password). */
export function isPasswordRecoveryActive(): boolean {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const t = Number(raw)
    if (Number.isFinite(t) && Date.now() - t > 30 * 60 * 1000) {
      sessionStorage.removeItem(STORAGE_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}
