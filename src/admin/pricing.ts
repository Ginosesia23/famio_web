const n = (v: string | undefined): number | undefined => {
  if (v === undefined || v.trim() === '') return undefined
  const x = Number(v)
  return Number.isFinite(x) ? x : undefined
}

/** Monthly GBP aligned with FamioLanding marketing copy (£6.99 Plus, £12.99 Gold). */
export function getFamioMonthlyPricesGbp(): {
  plus: number
  gold: number
} {
  return {
    plus: n(import.meta.env.VITE_ADMIN_PRICE_PLUS_MONTHLY_GBP) ?? 6.99,
    gold: n(import.meta.env.VITE_ADMIN_PRICE_GOLD_MONTHLY_GBP) ?? 12.99,
  }
}

/** Simple MRR: families on each paid tier × list monthly price (Starter = 0). */
export function estimateMonthlyRecurringGbp(
  _starterFamilies: number,
  plusFamilies: number,
  goldFamilies: number,
): { mrr: number; byTier: { starter: number; plus: number; gold: number } } {
  const { plus, gold } = getFamioMonthlyPricesGbp()
  const byTier = {
    starter: 0,
    plus: Math.round(plusFamilies * plus * 100) / 100,
    gold: Math.round(goldFamilies * gold * 100) / 100,
  }
  return {
    mrr: Math.round((byTier.plus + byTier.gold) * 100) / 100,
    byTier,
  }
}
