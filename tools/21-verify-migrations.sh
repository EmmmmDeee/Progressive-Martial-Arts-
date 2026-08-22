#!/usr/bin/env bash
# Verify every migration-map row against the live (or staging) site:
# single-hop redirect to the exact target, or hard 410/404 — no chains, no soft 404s.
set -euo pipefail
. "$(dirname "$0")/lib.sh"
BASE="${1:-$SITE}"
fail=0
while IFS=$'\t' read -r old dispo new code canon note; do
  [ "$old" = "old_url" ] && continue
  path="${old#https://progressivemartialarts.com.au}"
  read -r got_code got_loc < <(curl -sS -o /dev/null -A "$BASELINE_UA" --max-time 30 \
      -w '%{http_code} %{redirect_url}\n' "$BASE$path" || echo "000 -")
  want_loc="${new/https:\/\/progressivemartialarts.com.au/$BASE}"
  if [ "$code" = "410" ]; then
    [ "$got_code" = 410 ] || [ "$got_code" = 404 ] \
      && echo "ok   $path -> $got_code" || { echo "FAIL $path: want 410/404 got $got_code"; fail=1; }
  else
    [ "$got_code" = "$code" ] && [ "$got_loc" = "$want_loc" ] \
      && echo "ok   $path -> $got_code $got_loc" \
      || { echo "FAIL $path: want $code -> $want_loc, got $got_code -> $got_loc"; fail=1; }
  fi
done < graph/migration-map.tsv
exit $fail
