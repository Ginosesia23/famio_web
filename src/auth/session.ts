export const ADMIN_SESSION_STORAGE_KEY = 'famio-admin-session'

export type AdminSession = {
  email: string
  exp: number
}

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

/** Validates against env vars; in dev falls back to a documented demo account. */
export function validateAdminCredentials(
  email: string,
  password: string,
): boolean {
  const configuredEmail =
    import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase() ?? ''
  const configuredPass = import.meta.env.VITE_ADMIN_PASSWORD

  let expectEmail: string | undefined
  let expectPass: string | undefined

  if (
    configuredEmail !== '' &&
    configuredPass !== undefined &&
    configuredPass !== ''
  ) {
    expectEmail = configuredEmail
    expectPass = configuredPass
  } else if (import.meta.env.DEV) {
    expectEmail = 'admin@famio.local'
    expectPass = 'famio-admin-dev'
  }

  if (!expectEmail || expectPass === undefined) return false
  return (
    email.trim().toLowerCase() === expectEmail.trim().toLowerCase() &&
    password === expectPass
  )
}

export function loadStoredSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as AdminSession
    if (
      typeof s.exp !== 'number' ||
      !s.email ||
      typeof s.email !== 'string' ||
      Date.now() > s.exp
    ) {
      clearStoredSession()
      return null
    }
    return s
  } catch {
    clearStoredSession()
    return null
  }
}

export function persistSession(email: string) {
  const payload: AdminSession = {
    email,
    exp: Date.now() + SESSION_TTL_MS,
  }
  localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(payload))
}

export function clearStoredSession() {
  localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY)
}
