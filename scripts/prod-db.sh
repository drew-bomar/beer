#!/usr/bin/env bash
# Run psql against the production Supabase database.
# Reads SUPABASE_DB_PASSWORD from .env.local; never echoes it.
# Usage: scripts/prod-db.sh [-f file.sql | -c "sql"] [...psql args]
set -euo pipefail
cd "$(dirname "$0")/.."

PASSWORD=$(grep '^SUPABASE_DB_PASSWORD=' .env.local | cut -d= -f2- | tr -d '"')
if [ -z "$PASSWORD" ]; then
  echo "SUPABASE_DB_PASSWORD not found in .env.local" >&2
  exit 1
fi

PROJECT_REF="vwtjzespzowkoicoaosu"

# Try the direct host first (IPv6), then the IPv4 session poolers by region.
HOSTS=(
  "db.${PROJECT_REF}.supabase.co:5432:postgres"
  "aws-1-us-east-1.pooler.supabase.com:5432:postgres.${PROJECT_REF}"
  "aws-0-us-east-1.pooler.supabase.com:5432:postgres.${PROJECT_REF}"
  "aws-1-us-east-2.pooler.supabase.com:5432:postgres.${PROJECT_REF}"
  "aws-0-us-east-2.pooler.supabase.com:5432:postgres.${PROJECT_REF}"
)

for entry in "${HOSTS[@]}"; do
  HOST=$(echo "$entry" | cut -d: -f1)
  PORT=$(echo "$entry" | cut -d: -f2)
  USER=$(echo "$entry" | cut -d: -f3)
  if docker exec -e PGPASSWORD="$PASSWORD" -e PGCONNECT_TIMEOUT=8 beer-db \
      psql -h "$HOST" -p "$PORT" -U "$USER" -d postgres -c "select 1" >/dev/null 2>&1; then
    echo "connected via $HOST as $USER" >&2
    docker exec -i -e PGPASSWORD="$PASSWORD" beer-db \
      psql -h "$HOST" -p "$PORT" -U "$USER" -d postgres -v ON_ERROR_STOP=1 "$@"
    exit $?
  fi
done

echo "Could not connect to production database via any known host" >&2
exit 1
