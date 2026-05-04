import { useCallback, useEffect, useState } from 'react'
import type { AdminFamilyDirectoryRow } from './fetchSupabaseDirectory'
import { fetchFamilyMemberDirectory } from './fetchSupabaseDirectory'
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client'

export function useAdminFamiliesDirectory() {
  const [rows, setRows] = useState<AdminFamilyDirectoryRow[]>([])
  const [error, setError] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setRows([])
      setError(
        'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to load families from Supabase.',
      )
      setLoading(false)
      return
    }
    const client = getSupabaseBrowserClient()
    if (!client) {
      setRows([])
      setError('Could not initialize Supabase client.')
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      setRows(await fetchFamilyMemberDirectory(client))
      setError(undefined)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setRows([])
      setError(`${msg} Staff must pass RLS — run supabase/sql/famio_admin_table_access.sql in the Supabase SQL editor (JWT admin or email allowlist there).`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { rows, error, loading, refresh }
}
