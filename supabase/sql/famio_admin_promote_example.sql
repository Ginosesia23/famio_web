-- Promote a Supabase Auth user so the Famio web /admin gate accepts them.
-- PRIMARY: `public.profiles.access = 'admin'` (see Option C below).
-- Optional fallbacks still work: JWT `app_metadata`, or `.env` allowlists — see `auth/profileAccess.ts`.
-- Replace the UUID with Auth → Users → user id.

-- Option A — boolean flag (recommended)
-- UPDATE auth.users
-- SET raw_app_meta_data =
--   COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"admin": true}'::jsonb
-- WHERE id = '00000000-0000-0000-0000-000000000000'::uuid;

-- Option C — PRIMARY: profiles.access (Famio SPA checks this first via `profiles` row)
-- UPDATE public.profiles
-- SET access = 'admin'
-- WHERE id = '00000000-0000-0000-0000-000000000000'::uuid;

-- Option D — revoke admin back to household-only login
-- UPDATE public.profiles
-- SET access = 'member'
-- WHERE id = '00000000-0000-0000-0000-000000000000'::uuid;
