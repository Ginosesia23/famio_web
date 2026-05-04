#!/usr/bin/env bash
# Apply RLS so staff JWTs can SELECT family_members / family_subscriptions.
#
# Option A — Supabase hosts the DB: open Dashboard → SQL Editor, paste the file:
#   supabase/sql/famio_admin_table_access.sql
#
# Option B — Apply from your machine (needs psql):
#   SUPABASE_DB_URL="postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres" \
#     bash scripts/apply-famio-admin-rls.sh
#
# Get the URL from Project Settings → Database (use “Session mode” pooler URI).

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SQL_FILE="$ROOT/supabase/sql/famio_admin_table_access.sql"

if [[ ! -f "$SQL_FILE" ]]; then
  echo "Missing: $SQL_FILE" >&2
  exit 1
fi

if [[ -z "${SUPABASE_DB_URL:-}" ]]; then
  echo "SUPABASE_DB_URL is not set. Apply the SQL manually in the Supabase SQL editor:"
  echo "  $SQL_FILE"
  exit 1
fi

psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$SQL_FILE"
echo "OK — applied $SQL_FILE"
