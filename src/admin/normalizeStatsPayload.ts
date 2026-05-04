import type { DashboardStats } from './dashboardStats.types'

function num(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return Math.max(0, Math.round(v))
  if (typeof v === 'string') {
    const t = v.trim()
    if (t === '') return null
    const x = Number(t)
    if (Number.isFinite(x)) return Math.max(0, Math.round(x))
  }
  return null
}

/**
 * Accepts documented keys or loose aliases (`members`, `families`,
 * `planCounts.plus` vs `premium`, etc.).
 */
export function normalizeStatsPayload(
  raw: unknown,
  source: DashboardStats['source'],
  fetchedAt: string,
): DashboardStats | null {
  if (!raw || typeof raw !== 'object') return null

  const o = raw as Record<string, unknown>
  const nested =
    typeof o.data === 'object' && o.data !== null
      ? (o.data as Record<string, unknown>)
      : null
  const r = nested ? { ...o, ...nested } : o

  const planBlob =
    typeof r.planCounts === 'object' && r.planCounts !== null
      ? (r.planCounts as Record<string, unknown>)
      : typeof r.plans === 'object' && r.plans !== null
        ? (r.plans as Record<string, unknown>)
        : {}

  const starter =
    num(planBlob.starter) ??
    num(planBlob.free) ??
    num(planBlob.starterFamilies) ??
    num(r.starterFamilies) ??
    num(r.freeFamilies)

  const plus =
    num(planBlob.plus) ??
    num(planBlob.premium) ??
    num(r.plusFamilies)

  const gold =
    num(planBlob.gold) ??
    num(r.goldFamilies)

  let totalFamilies =
    num(r.totalFamilies) ??
    num(r.families) ??
    num(r.households) ??
    num(r.familyGroups)

  const sumPlans =
    (starter ?? 0) + (plus ?? 0) + (gold ?? 0)

  if (totalFamilies === null && sumPlans > 0) totalFamilies = sumPlans
  if (totalFamilies === null) totalFamilies = num(r.familyCount)

  const totalMembers =
    num(r.totalMembers) ?? num(r.members) ?? num(r.memberCount)

  if (starter === null && plus === null && gold === null) {
    if (totalFamilies === null && totalMembers === null) return null
  }

  return {
    totalMembers: totalMembers ?? 0,
    totalFamilies: totalFamilies ?? 0,
    planCounts: {
      starter: starter ?? 0,
      plus: plus ?? 0,
      gold: gold ?? 0,
    },
    betaSignups:
      num(r.betaSignups) ??
      num(r.betaRequests) ??
      num(r.betaSignupsPending) ??
      undefined,
    fetchedAt,
    source,
  }
}
