import type { SupabaseClient } from '@supabase/supabase-js'
import type { PlanCounts } from './dashboardStats.types'
import {
  isMemberStatusExcluded,
  isBillingStatusOk,
  tierFromSubscription,
} from './subscriptionTier'

const PAGE = 900

export type FamilyMemberDbRow = {
  family_id: string
  user_id: string | null
  email: string | null
  display_name: string | null
  role: string | null
  status: string | null
}

export type FamilySubscriptionDbRow = {
  family_id: string
  plan: string | null
  status: string | null
  updated_at: string | null
  created_at: string | null
}

export type AdminFamilyDirectoryRow = {
  familyId: string
  memberCount: number
  activeMemberCount: number
  tier: 'starter' | 'plus' | 'gold'
  subscriptionStatus: string | null
  planLabel: string | null
}

export type AdminUserDirectoryRow = {
  key: string
  userId: string | null
  email: string | null
  displayName: string | null
  roles: string[]
  familyIds: string[]
  /** Rows in family_members (non-excluded statuses) */
  memberships: number
}

async function fetchAllPages<T>(
  fetchPage: (
    from: number,
    to: number,
  ) => Promise<{ data: T[] | null; error: { message: string } | null }>,
): Promise<T[]> {
  let offset = 0
  const out: T[] = []
  for (;;) {
    const to = offset + PAGE - 1
    const { data, error } = await fetchPage(offset, to)
    if (error) throw new Error(error.message)
    const rows = data ?? []
    out.push(...rows)
    if (rows.length < PAGE) break
    offset += PAGE
  }
  return out
}

/**
 * Prefer a billable row (see `subscriptionTier.BILLING_STATUS_OK`) when several
 * `family_subscriptions` rows exist; otherwise newest by `updated_at`/`created_at`.
 * Avoids a recently-written `canceled` row hiding an older `active` subscription.
 */
function pickBestSubscriptionPerFamily(
  subs: FamilySubscriptionDbRow[],
): Map<string, FamilySubscriptionDbRow> {
  function rowTime(r: FamilySubscriptionDbRow): number {
    return new Date(r.updated_at ?? r.created_at ?? 0).getTime()
  }

  const byFam = new Map<string, FamilySubscriptionDbRow[]>()
  for (const row of subs) {
    const id = row.family_id
    if (!id) continue
    let list = byFam.get(id)
    if (!list) {
      list = []
      byFam.set(id, list)
    }
    list.push(row)
  }

  const out = new Map<string, FamilySubscriptionDbRow>()
  for (const [familyId, rows] of byFam) {
    const billable = rows.filter((r) => isBillingStatusOk(r.status))
    const pool = billable.length > 0 ? billable : rows
    pool.sort((a, b) => rowTime(b) - rowTime(a))
    const best = pool[0]
    if (best) out.set(familyId, best)
  }
  return out
}

async function loadMembersAndSubscriptions(
  client: SupabaseClient,
): Promise<{
  members: FamilyMemberDbRow[]
  subs: FamilySubscriptionDbRow[]
}> {
  const members = await fetchAllPages<FamilyMemberDbRow>(
    async (from, to) =>
      await client
        .from('family_members')
        .select('family_id,user_id,email,display_name,role,status')
        .range(from, to),
  )

  const subs = await fetchAllPages<FamilySubscriptionDbRow>(
    async (from, to) =>
      await client
        .from('family_subscriptions')
        .select('family_id,plan,status,updated_at,created_at')
        .range(from, to),
  )

  return { members, subs }
}

/**
 * Plan mix + totals from Supabase rows (latest subscription per family × tier rules in
 * `subscriptionTier.ts`). Matches the Families directory; use for Revenue MRR counts.
 */
export async function fetchStaffRollupFromSupabase(
  client: SupabaseClient,
): Promise<{
  totalMembers: number
  totalFamilies: number
  planCounts: PlanCounts
}> {
  const { members, subs } = await loadMembersAndSubscriptions(client)
  const latestSub = pickBestSubscriptionPerFamily(subs)

  const eligibleUserIds = new Set<string>()
  const byFamily = new Map<
    string,
    { memberCount: number; activeMemberCount: number }
  >()

  for (const row of members) {
    let cur = byFamily.get(row.family_id)
    if (!cur) {
      cur = { memberCount: 0, activeMemberCount: 0 }
      byFamily.set(row.family_id, cur)
    }
    cur.memberCount += 1
    if (!isMemberStatusExcluded(row.status)) cur.activeMemberCount += 1
    const uid = row.user_id?.trim()
    if (uid && !isMemberStatusExcluded(row.status)) eligibleUserIds.add(uid)
  }

  const planCounts: PlanCounts = { starter: 0, plus: 0, gold: 0 }

  for (const familyId of byFamily.keys()) {
    const sub = latestSub.get(familyId)
    const tier = tierFromSubscription(sub?.plan, sub?.status)
    planCounts[tier] += 1
  }

  return {
    totalMembers: eligibleUserIds.size,
    totalFamilies: byFamily.size,
    planCounts,
  }
}

export async function fetchFamilyMemberDirectory(
  client: SupabaseClient,
): Promise<AdminFamilyDirectoryRow[]> {
  const { members, subs } = await loadMembersAndSubscriptions(client)

  const latestSub = pickBestSubscriptionPerFamily(subs)

  const byFamily = new Map<
    string,
    { memberCount: number; activeMemberCount: number }
  >()

  for (const row of members) {
    let cur = byFamily.get(row.family_id)
    if (!cur) {
      cur = { memberCount: 0, activeMemberCount: 0 }
      byFamily.set(row.family_id, cur)
    }
    cur.memberCount += 1
    if (!isMemberStatusExcluded(row.status)) cur.activeMemberCount += 1
  }

  const rows: AdminFamilyDirectoryRow[] = []
  for (const [familyId, counts] of byFamily) {
    const sub = latestSub.get(familyId)
    const tier = tierFromSubscription(sub?.plan, sub?.status)
    rows.push({
      familyId,
      memberCount: counts.memberCount,
      activeMemberCount: counts.activeMemberCount,
      tier,
      subscriptionStatus: sub?.status ?? null,
      planLabel: sub?.plan ?? null,
    })
  }

  rows.sort((a, b) => a.familyId.localeCompare(b.familyId))
  return rows
}

export async function fetchUserDirectory(
  client: SupabaseClient,
): Promise<AdminUserDirectoryRow[]> {
  const members = await fetchAllPages<FamilyMemberDbRow>(
    async (from, to) =>
      await client
        .from('family_members')
        .select('family_id,user_id,email,display_name,role,status')
        .range(from, to),
  )

  const byKey = new Map<
    string,
    {
      userId: string | null
      email: string | null
      displayName: string | null
      roles: Set<string>
      families: Set<string>
      membershipCount: number
    }
  >()

  for (const row of members) {
    if (isMemberStatusExcluded(row.status)) continue

    const stableKey =
      row.user_id?.trim() ??
      (row.email?.trim() ? `email:${row.email.trim().toLowerCase()}` : null)
    if (!stableKey) continue

    let agg = byKey.get(stableKey)
    if (!agg) {
      agg = {
        userId: row.user_id,
        email: row.email,
        displayName: row.display_name,
        roles: new Set(),
        families: new Set(),
        membershipCount: 0,
      }
      byKey.set(stableKey, agg)
    }
    agg.membershipCount += 1
    agg.families.add(row.family_id)
    const roleTrim = row.role?.trim()
    if (roleTrim) agg.roles.add(roleTrim)
    if (!agg.displayName?.trim() && row.display_name?.trim()) {
      agg.displayName = row.display_name
    }
    if (!agg.email?.trim() && row.email?.trim()) agg.email = row.email
    if (!agg.userId?.trim() && row.user_id?.trim()) agg.userId = row.user_id
  }

  const rows: AdminUserDirectoryRow[] = [...byKey.entries()].map(
    ([stableKey, v]) => ({
      key: stableKey,
      userId: v.userId,
      email: v.email,
      displayName: v.displayName,
      roles: [...v.roles].sort((a, b) => a.localeCompare(b)),
      familyIds: [...v.families].sort(),
      memberships: v.membershipCount,
    }),
  )

  rows.sort((a, b) =>
    (a.email ?? a.userId ?? '').localeCompare(b.email ?? b.userId ?? '', undefined, {
      sensitivity: 'base',
    }),
  )
  return rows
}
