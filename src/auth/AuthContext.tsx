import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { resolveAdminDashboardAccess } from './profileAccess'
import {
  clearStoredSession,
  loadStoredSession,
  persistSession,
  validateAdminCredentials,
} from './session'
import {
  clearPasswordRecoveryActive,
  markPasswordRecoveryActive,
  isPasswordRecoveryActive,
} from './passwordRecoveryPending'
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from '../supabase/client'

export type AuthUser = { email: string }

export type LoginOutcome =
  | { ok: true }
  | { ok: false; message: string }

type AuthContextValue = {
  user: AuthUser | null
  /** Hydration finished (Supabase getSession / legacy restore). */
  ready: boolean
  login: (email: string, password: string) => Promise<LoginOutcome>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function sessionToUser(session: Session | null): AuthUser | null {
  const u = session?.user
  const email = u?.email?.trim().toLowerCase()
  return email ? { email } : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabaseAuth = isSupabaseConfigured()

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (supabaseAuth) return null
    const s = loadStoredSession()
    return s?.email ? { email: s.email } : null
  })

  const [ready, setReady] = useState(() => !supabaseAuth)

  useEffect(() => {
    if (!supabaseAuth) return

    let cancelled = false

    clearStoredSession()
    const sb = getSupabaseBrowserClient()
    const markReady = () => {
      queueMicrotask(() => {
        if (!cancelled) setReady(true)
      })
    }

    if (!sb) {
      markReady()
      return () => {
        cancelled = true
      }
    }

    const client = sb

    async function evaluateSupabaseSession(session: Session | null) {
      const u = session?.user
      if (!u) {
        setUser(null)
        return
      }

      /** Recovery JWT is not a full staff login; never signOut or admin users miss the form. */
      if (isPasswordRecoveryActive()) {
        setUser(null)
        return
      }

      let allowed = false
      try {
        allowed = await resolveAdminDashboardAccess(client, u)
      } catch {
        allowed = false
      }

      if (cancelled) return

      if (allowed) {
        setUser(sessionToUser(session))
      } else {
        await client.auth.signOut()
        setUser(null)
      }
    }

    const onResetPasswordRoute = () =>
      typeof window !== 'undefined' &&
      window.location.pathname === '/reset-password'

    /** Recovery flow: avoid treating half-reset sessions like a full admin login. */
    async function dispatchAuthSession(
      event: AuthChangeEvent | 'INITIAL_SESSION',
      session: Session | null,
    ) {
      if (event === 'PASSWORD_RECOVERY') {
        markPasswordRecoveryActive()
        setUser(null)
        return
      }
      if (onResetPasswordRoute()) {
        if (session) markPasswordRecoveryActive()
        setUser(null)
        return
      }
      await evaluateSupabaseSession(session)
    }

    /**
     * GoTrue applies URL recovery sessions synchronously inside init, but notifies
     * `PASSWORD_RECOVERY` on `setTimeout(0)` — after `initializePromise` settles.
     * `getSession().then(...)` therefore often runs INITIAL_SESSION **before**
     * PASSWORD_RECOVERY. Evaluating admin on `/` sign-outs non-admins (correct for
     * normal log-in) which **revokes** the freshly stored recovery session. Defer one
     * macrotask and skip INITIAL_SESSION when PASSWORD_RECOVERY already dispatched.
     */
    let consumeInitialBecauseRecovery = false

    const { data } = client.auth.onAuthStateChange((event, session) => {
      if (cancelled) return
      if (event === 'PASSWORD_RECOVERY') {
        consumeInitialBecauseRecovery = true
      }
      void dispatchAuthSession(event, session)
    })

    void client.auth.getSession().then(async ({ data }) => {
      if (cancelled) return
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 0)
      })
      if (cancelled) return
      if (consumeInitialBecauseRecovery) {
        consumeInitialBecauseRecovery = false
        markReady()
        return
      }
      await dispatchAuthSession('INITIAL_SESSION', data.session)
      markReady()
    })

    return () => {
      cancelled = true
      data.subscription.unsubscribe()
    }
  }, [supabaseAuth])

  const login = useCallback(
    async (email: string, password: string): Promise<LoginOutcome> => {
      const delay = () => new Promise((r) => setTimeout(r, 280))

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient()
        if (!supabase) {
          return {
            ok: false,
            message:
              'Sign-in is not available right now. Please try again later.',
          }
        }
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error || !data.user) {
          await delay()
          return {
            ok: false,
            message: 'Wrong email or password. Check your credentials and try again.',
          }
        }

        let allowed = false
        try {
          allowed = await resolveAdminDashboardAccess(supabase, data.user)
        } catch {
          allowed = false
        }

        if (!allowed) {
          await supabase.auth.signOut()
          await delay()
          return {
            ok: false,
            message:
              'Wrong email or password. Check your credentials and try again.',
          }
        }
        clearPasswordRecoveryActive()
        setUser({
          email:
            data.user.email?.trim().toLowerCase() ??
            email.trim().toLowerCase(),
        })
        return { ok: true }
      }

      if (!validateAdminCredentials(email, password)) {
        await delay()
        return {
          ok: false,
          message: 'Wrong email or password. Check your credentials and try again.',
        }
      }
      clearPasswordRecoveryActive()
      persistSession(email.trim().toLowerCase())
      setUser({ email: email.trim().toLowerCase() })
      return { ok: true }
    },
    [],
  )

  const logout = useCallback(() => {
    clearPasswordRecoveryActive()
    clearStoredSession()
    setUser(null)
    if (isSupabaseConfigured()) {
      void getSupabaseBrowserClient()?.auth.signOut()
    }
  }, [])

  const value = useMemo(
    () => ({ user, ready, login, logout }),
    [user, ready, login, logout],
  )

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- hook bundled with provider
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
