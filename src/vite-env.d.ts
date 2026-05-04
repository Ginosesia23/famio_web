/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Legacy static admin when Supabase URL/anon are not both set */
  readonly VITE_ADMIN_EMAIL?: string
  readonly VITE_ADMIN_PASSWORD?: string
  /** Comma-separated staff emails permitted for /admin when using Supabase Auth */
  readonly VITE_ADMIN_ALLOWED_EMAILS?: string
  /** Optional HTTPS URL that returns dashboard stats JSON */
  readonly VITE_ADMIN_DASHBOARD_STATS_URL?: string
  /** Sent as `Authorization: Bearer …` when calling the dashboard stats URL */
  readonly VITE_ADMIN_API_KEY?: string
  /** Set to `'true'` to send cookies (`credentials: 'include'`) on the stats request */
  readonly VITE_ADMIN_STATS_WITH_CREDENTIALS?: string

  /** Supabase project URL (https://….supabase.co). Admin counts read family_members + family_subscriptions with the signed-in staff JWT */
  readonly VITE_SUPABASE_URL?: string
  /** Public anon key — never put the service role key in Vite */
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** Revenue page: override list £/mo for Plus (default 6.99) */
  readonly VITE_ADMIN_PRICE_PLUS_MONTHLY_GBP?: string
  /** Revenue page: override list £/mo for Gold (default 12.99) */
  readonly VITE_ADMIN_PRICE_GOLD_MONTHLY_GBP?: string

  /** Base site URL for auth emails (omit trailing slash); default `window.location.origin` */
  readonly VITE_AUTH_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
