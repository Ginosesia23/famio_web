-- =============================================================================
-- Famio admin: staff read access to family_members & family_subscriptions
-- =============================================================================
-- Run once in Supabase Dashboard → SQL → New query (as postgres role).
--
-- Staff can SELECT these tables when (`famio_jwt_can_read_staff_tables()` is true):
--   • public.profiles.access = 'admin' for auth.uid()
-- plus legacy fallbacks (same idea as `auth/profileAccess.ts` + `auth/adminGate.ts`):
--   • app_metadata.admin = true or user_metadata.admin = true
--   • app_metadata.role or user_metadata.role = 'admin'
--   • Rows in famio_staff_email_allowlist (email-only ops)
--
-- After running: sign in via /login and open Families / Users in the SPA.
--
-- Remove old permissive policies (USING true) first if you already applied them.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS citext;

-- Optional email allowlist (citext ignores case when comparing with =)
CREATE TABLE IF NOT EXISTS public.famio_staff_email_allowlist (
  email citext PRIMARY KEY,
  note text DEFAULT ''
);

COMMENT ON TABLE public.famio_staff_email_allowlist IS
  'Staff emails allowed to load admin directory tables via famio_jwt_can_read_staff_tables(). Manage only from SQL/service role — not exposed to anon.';

ALTER TABLE IF EXISTS public.famio_staff_email_allowlist ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.famio_staff_email_allowlist FROM anon;
REVOKE ALL ON TABLE public.famio_staff_email_allowlist FROM authenticated;

-- Staff check: SECURITY DEFINER allows reading the email allowlist without
-- granting SELECT on it to ordinary users (they only EXECUTE this function).
CREATE OR REPLACE FUNCTION public.famio_jwt_can_read_staff_tables()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND lower(trim(coalesce(p.access, ''))) = 'admin'
    )
    OR COALESCE((auth.jwt()->'app_metadata'->>'admin')::boolean, false)
    OR COALESCE((auth.jwt()->'user_metadata'->>'admin')::boolean, false)
    OR lower(trim(coalesce(auth.jwt()->'app_metadata'->>'role', ''))) = 'admin'
    OR lower(trim(coalesce(auth.jwt()->'user_metadata'->>'role', ''))) = 'admin'
    OR EXISTS (
      SELECT 1
      FROM public.famio_staff_email_allowlist a
      WHERE a.email IS NOT NULL
        AND trim(a.email::text) <> ''
        AND lower(trim(coalesce(auth.jwt()->>'email', ''))) = lower(trim(a.email::text))
    );
$$;

REVOKE ALL ON FUNCTION public.famio_jwt_can_read_staff_tables() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.famio_jwt_can_read_staff_tables() TO authenticated;

-- Target tables --------------------------------------------------------------
ALTER TABLE IF EXISTS public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.family_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS famio_staff_read_family_members ON public.family_members;
DROP POLICY IF EXISTS famio_staff_select_family_members ON public.family_members;
DROP POLICY IF EXISTS famio_staff_select_family_members_jwt ON public.family_members;

DROP POLICY IF EXISTS famio_staff_read_family_subscriptions ON public.family_subscriptions;
DROP POLICY IF EXISTS famio_staff_select_family_subscriptions ON public.family_subscriptions;
DROP POLICY IF EXISTS famio_staff_select_family_subscriptions_jwt ON public.family_subscriptions;

CREATE POLICY famio_staff_select_family_members_jwt
  ON public.family_members
  FOR SELECT
  TO authenticated
  USING (public.famio_jwt_can_read_staff_tables());

CREATE POLICY famio_staff_select_family_subscriptions_jwt
  ON public.family_subscriptions
  FOR SELECT
  TO authenticated
  USING (public.famio_jwt_can_read_staff_tables());

-- ---------------------------------------------------------------------------
-- Add staff emails WITHOUT promoting JWT metadata (optional):
--
-- INSERT INTO public.famio_staff_email_allowlist (email)
-- VALUES ('you@yourdomain.com')
-- ON CONFLICT DO NOTHING;

-- Let each user read their own profile (needed for SPA login gate that reads profiles.access).
-- Uncomment if missing:
--
-- DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
-- CREATE POLICY profiles_select_own
--   ON public.profiles
--   FOR SELECT
--   TO authenticated
--   USING (auth.uid() = id);
