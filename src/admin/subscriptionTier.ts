/** Mirrors `famio_admin_metrics_example.sql` filters / plan mapping for client-side joins. */

export const MEMBER_STATUS_EXCLUDE = ['invited', 'pending', 'removed'] as const

/** Stripe-ish + common app labels — non-billing rows are treated like free for tier UI. */
export const BILLING_STATUS_OK = [
  'active',
  'trialing',
  'past_due',
  'past due',
  'paid',
] as const

export function normalizeStatus(s: string | null | undefined): string {
  return (s ?? '').trim().toLowerCase()
}

export function isMemberStatusExcluded(status: string | null | undefined): boolean {
  const t = normalizeStatus(status)
  return MEMBER_STATUS_EXCLUDE.some((x) => x === t)
}

export function isBillingStatusOk(status: string | null | undefined): boolean {
  const t = normalizeStatus(status)
  return BILLING_STATUS_OK.some((x) => x === t)
}

/**
 * Pick tier from latest subscription row (plan + status text).
 */
export function tierFromSubscription(
  plan: string | null | undefined,
  status: string | null | undefined,
): 'starter' | 'plus' | 'gold' {
  const planNorm = normalizeStatus(plan ?? '')
  if (!isBillingStatusOk(status)) return 'starter'

  if (
    planNorm === 'premium' ||
    planNorm === 'famio_premium' ||
    planNorm.includes('premium')
  ) {
    return 'plus'
  }

  if (
    planNorm === 'plus' ||
    planNorm === 'famio_plus' ||
    planNorm.includes('plus')
  ) {
    return 'plus'
  }
  if (
    planNorm === 'gold' ||
    planNorm === 'famio_gold' ||
    planNorm.includes('gold')
  ) {
    return 'gold'
  }
  if (
    planNorm === 'starter' ||
    planNorm === 'famio_starter' ||
    planNorm === 'free' ||
    planNorm.includes('starter') ||
    planNorm.includes('free')
  ) {
    return 'starter'
  }
  return 'starter'
}
