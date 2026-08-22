#!/usr/bin/env bash
# Phase 1 (PRESERVE + BASELINE): prove the snapshot actually restores.
# An unverified backup is not a backup, so this must pass before phase 2 begins.
#
#   DEST=snapshots/<stamp> STAGING_SSH=user@staging STAGING_WP=/var/www/staging \
#     ./tools/04-verify-restore.sh
set -euo pipefail

: "${DEST:?set DEST=snapshots/<stamp>}"
: "${STAGING_SSH:?set STAGING_SSH=user@staging}"
STAGING_WP="${STAGING_WP:-/var/www/staging}"
STAGING_URL="${STAGING_URL:?set STAGING_URL=https://staging.example.com}"
RSH=(ssh -o BatchMode=yes "$STAGING_SSH")
WP="wp --path=$STAGING_WP --skip-plugins --skip-themes"
fail=0
check() { if [ "$2" = "$3" ]; then echo "  ok   $1 ($2)"; else echo "  FAIL $1: expected $2 got $3"; fail=1; fi; }

echo "==> 1/5 archive integrity"
( cd "$DEST" && sha256sum -c SHA256SUMS ) || { echo "FAIL: archives corrupt"; exit 1; }

echo "==> 2/5 restore into staging"
gzip -dc "$DEST/database.sql.gz" | "${RSH[@]}" "$WP db import -"
cat "$DEST/wp-content.tar.gz" | "${RSH[@]}" "tar -C $STAGING_WP -xzf -"

echo "==> 3/5 rewrite URLs for staging (staging must never serve production URLs)"
prod_home="$(sed -n '/### siteurl\/home/,$p' "$DEST/configuration.txt" | sed -n 2p | tr -d '\r')"
"${RSH[@]}" "$WP search-replace '$prod_home' '$STAGING_URL' --all-tables --precise --report-changed-only"
"${RSH[@]}" "$WP option update blog_public 0"   # staging must stay unindexable

echo "==> 4/5 commerce counters match production"
while IFS=$'\t' read -r pt expected; do
  got="$("${RSH[@]}" "$WP post list --post_type=$pt --post_status=any --format=count" 2>/dev/null || echo 0)"
  check "$pt count" "$expected" "$got"
done < "$DEST/commerce-counters.tsv"

echo "==> 5/5 staging smoke test"
for path in / /shop/ /cart/ /checkout/ /my-account/ /contact/; do
  code="$(curl -sS -o /dev/null -w '%{http_code}' -L --max-time 30 "$STAGING_URL$path" || echo 000)"
  check "GET $path" 200 "$code"
done

[ "$fail" = 0 ] && echo "RESTORE VERIFIED — rollback path is proven, phase 2 may begin" \
                || { echo "RESTORE NOT VERIFIED — do not proceed to phase 2"; exit 1; }
