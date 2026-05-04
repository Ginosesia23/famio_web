/** Normalized stats for the admin overview (wired from API or static JSON). */

export type PlanCounts = {
  /** Starter / free households */
  starter: number
  /** Famio Plus */
  plus: number
  /** Famio Gold */
  gold: number
}

export type DashboardStats = {
  totalMembers: number
  /** Distinct households / family groups */
  totalFamilies: number
  planCounts: PlanCounts
  /** Pending beta-interest count if your backend exposes it */
  betaSignups?: number
  /** When this snapshot was built (ISO 8601) */
  fetchedAt: string
  /** Where the numbers came from */
  source:
    | 'api'
    | 'static_file'
    | 'demo'
    | 'supabase'
    | 'unavailable'
}

export type StatsLoadOutcome = {
  stats: DashboardStats
  /** Shown once when falling back from API misconfiguration/errors */
  notice?: string
}
