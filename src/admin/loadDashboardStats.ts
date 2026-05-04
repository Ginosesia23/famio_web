import type { DashboardStats, StatsLoadOutcome } from './dashboardStats.types'
import { normalizeStatsPayload } from './normalizeStatsPayload'
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from '../supabase/client'
import { fetchStaffRollupFromSupabase } from './fetchSupabaseDirectory'

const FALLBACK_NOTICE =
  'Configure Supabase (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY), VITE_ADMIN_DASHBOARD_STATS_URL, or public/admin-stats.json for live counts.'

function nowIso(): string {
  return new Date().toISOString()
}

function demoDefaults(): StatsLoadOutcome {
  const stats = normalizeStatsPayload(
    {
      totalMembers: 248,
      totalFamilies: 62,
      planCounts: { starter: 45, plus: 12, gold: 5 },
      betaSignups: 86,
    },
    'demo',
    nowIso(),
  )
  return {
    stats: stats!,
    notice: FALLBACK_NOTICE,
  }
}

/** Overlay live member / family / plan counts when Supabase directory read succeeds. */
function mergeTableRollup(
  base: DashboardStats,
  rollup: DashboardStats | null,
): DashboardStats {
  if (!rollup) return base
  return {
    ...base,
    totalMembers: rollup.totalMembers,
    totalFamilies: rollup.totalFamilies,
    planCounts: rollup.planCounts,
    fetchedAt: rollup.fetchedAt,
    source: 'supabase',
  }
}

function joinNotices(
  parts: Array<string | undefined>,
): string | undefined {
  const s = parts
    .map((p) => p?.trim())
    .filter((p): p is string => !!p && p.length > 0)
    .join(' ')
  return s || undefined
}

async function fetchLiveRollupStats(): Promise<{
  stats: DashboardStats | null
  failureNotices: string[]
}> {
  if (!isSupabaseConfigured())
    return { stats: null, failureNotices: [] }
  const client = getSupabaseBrowserClient()
  if (!client) return { stats: null, failureNotices: [] }
  try {
    const rollup = await fetchStaffRollupFromSupabase(client)
    return {
      stats: {
        totalMembers: rollup.totalMembers,
        totalFamilies: rollup.totalFamilies,
        planCounts: rollup.planCounts,
        fetchedAt: nowIso(),
        source: 'supabase',
      },
      failureNotices: [],
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return {
      stats: null,
      failureNotices: [
        `family_members / family_subscriptions read failed (${msg}). Confirm staff JWT + RLS (see supabase/sql/famio_admin_table_access.sql).`,
      ],
    }
  }
}

function packOutcome(
  stats: DashboardStats,
  live: { stats: DashboardStats | null; failureNotices: string[] },
  ...notices: (string | undefined)[]
): StatsLoadOutcome {
  const rollFail =
    isSupabaseConfigured() && !live.stats && live.failureNotices.length > 0
      ? live.failureNotices.join(' ')
      : undefined
  const notice = joinNotices([...notices, rollFail])
  return {
    stats,
    ...(notice ? { notice } : {}),
  }
}

export async function loadDashboardStats(): Promise<StatsLoadOutcome> {
  const livePromise = fetchLiveRollupStats()

  const apiUrl = import.meta.env.VITE_ADMIN_DASHBOARD_STATS_URL?.trim()
  let noticeFromApi: string | undefined

  if (apiUrl) {
    try {
      const headers: HeadersInit = { Accept: 'application/json' }
      const key = import.meta.env.VITE_ADMIN_API_KEY?.trim()
      if (key) headers.Authorization = `Bearer ${key}`
      const res = await fetch(apiUrl, {
        headers,
        cache: 'no-store',
        credentials:
          import.meta.env.VITE_ADMIN_STATS_WITH_CREDENTIALS === 'true'
            ? 'include'
            : 'omit',
      })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const json = (await res.json()) as unknown
      const n = normalizeStatsPayload(json, 'api', nowIso())
      if (n) {
        const live = await livePromise
        return packOutcome(mergeTableRollup(n, live.stats), live)
      }
      noticeFromApi = 'Dashboard API returned unexpected JSON. Falling back.'
    } catch {
      noticeFromApi = `Could not load stats from API. ${FALLBACK_NOTICE}`
    }
  }

  const live = await livePromise

  if (live.stats) {
    return packOutcome(live.stats, live, noticeFromApi)
  }

  try {
    const res = await fetch('/admin-stats.json', {
      cache: 'no-store',
    })
    if (res.ok) {
      const json = (await res.json()) as unknown
      const n = normalizeStatsPayload(json, 'static_file', nowIso())
      if (n) {
        /* At this point live.stats is null; merge keeps static beta etc. unchanged */
        return packOutcome(n, live, noticeFromApi)
      }
    }
  } catch {
    /* empty */
  }

  const demo = demoDefaults()
  const supabaseConfigured = isSupabaseConfigured()
  const out = packOutcome(demo.stats, live, noticeFromApi)
  if (!out.notice && demo.notice && !supabaseConfigured) {
    return { stats: out.stats, notice: demo.notice }
  }
  return out
}
