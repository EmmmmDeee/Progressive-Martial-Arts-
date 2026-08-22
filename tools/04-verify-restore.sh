#!/usr/bin/env bash
# Phase 1 (PRESERVE + BASELINE): prove the snapshot actually restores.
# An unverified backup is not a backup, so this must pass before phase 2 begins.
#
#   DEST=snapshots/<stamp> STAGING_SSH=user@staging STAGING_WP=/var/www/staging \
#     ./tools/04-verify-restore.sh
set -euo pipefail

: "${DEST:?set DEST=snapshots/<stamp>}"
: "${STAGING_SSH:?set STAGING_SSH=user@staging}"
: "${STAGING_URL:?set STAGING_URL=https://staging.example.com}"
STAGING_WP="${STAGING_WP:-/var/www/staging}"
. "$(dirname "$0")/lib.sh"
RSH=(ssh -o BatchMode=yes -o ControlMaster=auto -o ControlPath=~/.ssh/cm-%r@%h:%p -o ControlPersist=120 "$STAGING_SSH")
WP="wp --path=$STAGING_WP --skip-plugins --skip-themes"
fail=0
check() { if [ "$2" = "$3" ]; then echo "  ok   $1 ($2)"; else echo "  FAIL $1: expected $2 got $3"; fail=1; fi; }

echo "==> 1/5 archive integrity"
( cd "$DEST" && sha256sum -c SHA256SUMS ) || { echo "FAIL: archives corrupt"; exit 1; }

echo "==> 2/5 restore into staging"
gzip -dc "$DEST/database.sql.gz" | "${RSH[@]}" "$WP db import -"
"${RSH[@]}" "tar -C $STAGING_WP -xzf -" < "$DEST/wp-content.tar.gz"

echo "==> 3/5 rewrite URLs for staging (staging must never serve production URLs)"
prod_home="$(awk '/### siteurl\/home/{getline; print; exit}' "$DEST/configuration.txt" | tr -d '\r')"
"${RSH[@]}" "$WP search-replace '$prod_home' '$STAGING_URL' --all-tables --precise --report-changed-only"
"${RSH[@]}" "$WP option update blog_public 0"   # staging must stay unindexable

echo "==> 4/5 commerce counters match production"
while IFS=$'\t' read -r pt expected; do
  got="$("${RSH[@]}" "$WP post list --post_type=$pt --post_status=any --format=count" 2>/dev/null || echo 0)"
  check "$pt count" "$expected" "$got"
done < "$DEST/commerce-counters.tsv"

# Expectations are the RECORDED production statuses (tools/critical-paths.tsv):
# a faithful restore reproduces production, pre-existing 404s included.
echo "==> 5/5 staging smoke test"
while IFS=$'\t' read -r path expected; do
  code="$(fetch "$STAGING_URL$path" -o /dev/null -L -w '%{http_code}' || echo 000)"
  check "GET $path" "$expected" "$code"
done < <(tsv_body "$CRITICAL_PATHS_TSV")

[ "$fail" = 0 ] && echo "RESTORE VERIFIED — rollback path is proven, phase 2 may begin" \
                || { echo "RESTORE NOT VERIFIED — do not proceed to phase 2"; exit 1; }
