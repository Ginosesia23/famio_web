-- ============================================
-- Famio — optional server-side aggregates table
-- ============================================
-- The marketing admin SPA no longer reads this table; it loads live counts from
-- family_members + family_subscriptions in the browser (see loadDashboardStats).
-- Keep this SQL if you refresh aggregates for other jobs, exports, or dashboards.
-- ============================================

CREATE TABLE IF NOT EXISTS public.famio_admin_metrics (
  id text PRIMARY KEY DEFAULT 'default',
  updated_at timestamptz NOT NULL DEFAULT now(),
  total_members integer NOT NULL DEFAULT 0,
  total_families integer NOT NULL DEFAULT 0,
  plan_starter integer NOT NULL DEFAULT 0,
  plan_plus integer NOT NULL DEFAULT 0,
  plan_gold integer NOT NULL DEFAULT 0,
  beta_signups integer
);

ALTER TABLE public.famio_admin_metrics ENABLE ROW LEVEL SECURITY;

-- Option A — readable by anon + authenticated (only safe if this table holds
-- non-sensitive aggregates; anyone with your project ref + anon key can SELECT).
CREATE POLICY "public_read_famio_admin_metrics"
  ON public.famio_admin_metrics
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- If you rely only on signed-in admins and want to drop anon access, add a stricter
-- policy for `authenticated` only and revoke `anon` via a migration (project-specific).

-- Writes should use service_role or a locked-down role (not from the browser).
INSERT INTO public.famio_admin_metrics (id, total_members, total_families, plan_starter, plan_plus, plan_gold, beta_signups)
VALUES ('default', 0, 0, 0, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;


-- =====================================================================
-- Refresh aggregates from `family_members` + `family_subscriptions`
-- =====================================================================
-- • Members — distinct `user_id` among rows you treat as onboarded/active.
-- • Families — distinct `family_id` among those rows.
-- • Plan — latest subscription row per `family_id` (by updated_at); if missing
--   or status is not billable/active, tier defaults to Starter (free).
--
-- Tune the two filter lists (`member_status_exclude`, `billing_status_ok`) to match
-- the exact TEXT values written by your app (case-insensitive).


INSERT INTO public.famio_admin_metrics (
  id,
  total_members,
  total_families,
  plan_starter,
  plan_plus,
  plan_gold,
  beta_signups
)
WITH constants AS (
  SELECT
    ARRAY[
      /* Status values on family_members that should NOT count toward totals */
      'invited',
      'pending',
      'removed'
      /* append e.g. 'inactive' when you use it */
    ]::text[] AS member_status_exclude,
    ARRAY[
      /* keep in sync with src/admin/subscriptionTier.ts BILLING_STATUS_OK */
      'active',
      'trialing',
      'past_due',
      'past due',
      'paid'
    ]::text[] AS billing_status_ok
),
eligible_members AS (
  SELECT
    fm.family_id,
    fm.user_id
  FROM public.family_members AS fm
  CROSS JOIN constants AS c
  WHERE
    fm.user_id IS NOT NULL
    AND trim(lower(coalesce(fm.status::text, ''))) <> ALL (
      SELECT trim(lower(x)) FROM unnest(c.member_status_exclude) AS x
    )
),
distinct_families AS (
  SELECT DISTINCT family_id FROM eligible_members
),
subscription_ranked AS (
  SELECT
    fs.family_id,
    trim(lower(coalesce(fs.plan::text, ''))) AS plan_norm,
    trim(lower(coalesce(fs.status::text, ''))) AS status_norm,
    row_number() OVER (
      PARTITION BY fs.family_id
      ORDER BY
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM unnest((SELECT billing_status_ok FROM constants LIMIT 1)) AS st(x)
            WHERE trim(lower(st.x::text))
              = trim(lower(coalesce(fs.status::text, '')))
          )
          THEN 0
          ELSE 1
        END,
        fs.updated_at DESC NULLS LAST,
        fs.created_at DESC NULLS LAST
    ) AS rn
  FROM public.family_subscriptions AS fs
  INNER JOIN distinct_families AS df ON df.family_id = fs.family_id
),
latest_subscription AS (
  SELECT
    family_id,
    plan_norm,
    status_norm
  FROM subscription_ranked
  WHERE rn = 1
),
family_tier AS (
  SELECT
    df.family_id,
    CASE
      WHEN ls.family_id IS NULL THEN 'starter'
      WHEN ls.status_norm <> ALL (
        ARRAY(
          SELECT trim(lower(x))
          FROM unnest(c.billing_status_ok) AS x
        )
      )
        THEN 'starter'
      ELSE (
        CASE
          WHEN ls.plan_norm IN ('premium', 'famio_premium')
            OR ls.plan_norm LIKE '%premium%'
            THEN 'plus'
          WHEN ls.plan_norm IN ('plus', 'famio_plus')
            OR ls.plan_norm LIKE '%plus%'
            THEN 'plus'
          WHEN ls.plan_norm IN ('gold', 'famio_gold')
            OR ls.plan_norm LIKE '%gold%'
            THEN 'gold'
          WHEN ls.plan_norm IN ('starter', 'famio_starter', 'free', '')
            THEN 'starter'
          WHEN ls.plan_norm LIKE '%starter%'
            OR ls.plan_norm LIKE '%free%'
            THEN 'starter'
          ELSE 'starter'
        END
      )
    END AS tier
  FROM distinct_families AS df
  CROSS JOIN constants AS c
  LEFT JOIN latest_subscription AS ls ON ls.family_id = df.family_id
),
agg AS (
  SELECT
    (SELECT count(DISTINCT user_id)::int FROM eligible_members) AS total_members,
    (SELECT count(*)::int FROM distinct_families) AS total_families,
    (SELECT count(*)::int FROM family_tier WHERE tier = 'starter') AS plan_starter,
    (SELECT count(*)::int FROM family_tier WHERE tier = 'plus') AS plan_plus,
    (SELECT count(*)::int FROM family_tier WHERE tier = 'gold') AS plan_gold
)
SELECT
  'default',
  agg.total_members,
  agg.total_families,
  agg.plan_starter,
  agg.plan_plus,
  agg.plan_gold,
  /* Keep any manually curated beta count on conflict */
  (SELECT m.beta_signups FROM public.famio_admin_metrics AS m WHERE m.id = 'default')
FROM agg
ON CONFLICT (id) DO UPDATE SET
  updated_at = now(),
  total_members = EXCLUDED.total_members,
  total_families = EXCLUDED.total_families,
  plan_starter = EXCLUDED.plan_starter,
  plan_plus = EXCLUDED.plan_plus,
  plan_gold = EXCLUDED.plan_gold,
  beta_signups = public.famio_admin_metrics.beta_signups;


-- ---------- Optional: SECURITY DEFINER RPC ----------
--
-- Older SPA builds could call famio_dashboard_stats_rpc via env — not wired in current app.
--
-- CREATE OR REPLACE FUNCTION public.famio_dashboard_stats_rpc()
-- RETURNS jsonb
-- LANGUAGE sql
-- STABLE
-- SECURITY DEFINER
-- SET search_path = public
-- AS $$
--   WITH constants AS (
--     SELECT ARRAY['invited', 'pending', 'removed']::text[] AS member_status_exclude,
--            ARRAY['active', 'trialing']::text[] AS billing_status_ok
--   ),
--   eligible_members AS (
--     SELECT fm.family_id, fm.user_id
--     FROM public.family_members fm
--     CROSS JOIN constants c
--     WHERE fm.user_id IS NOT NULL
--       AND trim(lower(coalesce(fm.status::text, ''))) <> ALL (
--                SELECT trim(lower(x)) FROM unnest(c.member_status_exclude) x)
--   ),
--   distinct_families AS (
--     SELECT DISTINCT family_id FROM eligible_members
--   ),
--   latest_subscription AS (
--     SELECT DISTINCT ON (fs.family_id) fs.family_id,
--           trim(lower(coalesce(fs.plan::text, ''))) AS plan_norm,
--           trim(lower(coalesce(fs.status::text, ''))) AS status_norm
--     FROM public.family_subscriptions fs
--     INNER JOIN distinct_families df ON df.family_id = fs.family_id
--     ORDER BY fs.family_id, fs.updated_at DESC NULLS LAST, fs.created_at DESC NULLS LAST
--   ),
--   family_tier AS (
--     SELECT df.family_id,
--            CASE WHEN ls.family_id IS NULL THEN 'starter'
--                 WHEN ls.status_norm <> ALL (ARRAY(SELECT trim(lower(x))
--                                       FROM unnest(c.billing_status_ok) x))
--                      THEN 'starter'
--                 WHEN ls.plan_norm IN ('plus','famio_plus')
--                      OR ls.plan_norm LIKE '%plus%' THEN 'plus'
--                 WHEN ls.plan_norm IN ('gold','famio_gold')
--                      OR ls.plan_norm LIKE '%gold%' THEN 'gold'
--                 ELSE 'starter' END AS tier
--     FROM distinct_families df
--     CROSS JOIN constants c
--     LEFT JOIN latest_subscription ls ON ls.family_id = df.family_id
--   ),
--   agg AS (
--     SELECT
--       (SELECT count(DISTINCT user_id)::int FROM eligible_members) AS total_members,
--       (SELECT count(*)::int FROM distinct_families) AS total_families,
--       (SELECT count(*)::int FROM family_tier WHERE tier = 'starter') AS starter,
--       (SELECT count(*)::int FROM family_tier WHERE tier = 'plus') AS plus,
--       (SELECT count(*)::int FROM family_tier WHERE tier = 'gold') AS gold
--   )
--   SELECT jsonb_build_object(
--     'totalMembers', a.total_members,
--     'totalFamilies', a.total_families,
--     'planCounts', jsonb_build_object(
--       'starter', a.starter,
--       'plus', a.plus,
--       'gold', a.gold
--     )
--   )
--   FROM agg AS a;
-- $$;
--
-- REVOKE ALL ON FUNCTION public.famio_dashboard_stats_rpc() FROM PUBLIC;
-- GRANT EXECUTE ON FUNCTION public.famio_dashboard_stats_rpc() TO anon, authenticated;
--
