import { useCallback, useEffect, useState } from 'react'
import { loadDashboardStats } from './loadDashboardStats'
import type { DashboardStats } from './dashboardStats.types'

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [notice, setNotice] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const { stats: s, notice: n } = await loadDashboardStats()
      setStats(s)
      setNotice(n)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { stats, notice, loading, refresh }
}
