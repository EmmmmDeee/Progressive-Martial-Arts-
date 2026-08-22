#!/usr/bin/env bash
# Phase 1 (PRESERVE + BASELINE): capture the objective before-state of every
# inventoried URL, plus a raw HTML archive used as the diff reference for
# every later phase.
#
# Outputs:
#   baseline/http-baseline.tsv   one row per URL (status, redirects, SEO head, hashes)
#   baseline/redirect-map.tsv    every 3xx hop observed (INVARIANT input for phase 3)
#   baseline/html/<slug>.html    raw HTML archive of each 200 HTML response
set -euo pipefail

IN="${IN:-baseline/url-inventory.tsv}"
OUT="${OUT:-baseline/http-baseline.tsv}"
ARCHIVE="${ARCHIVE:-baseline/html}"
JOBS="${JOBS:-6}"
UA="PMAAI-migration-baseline/1.0"

# Working files live inside the repo tree, NOT /tmp: this environment purges
# /tmp on a schedule, which silently destroys a long sweep's intermediate rows.
ROWS="baseline/.rows.$$"; mkdir -p "$ROWS"; trap 'rm -rf "$ROWS"' EXIT
mkdir -p "$ARCHIVE" "$(dirname "$OUT")"

slug() {
  # NB: an empty path ("/") must still yield a name — a pipeline-final
  # `sed s#^$#index#` never fires on zero-line input, so default in the shell.
  local s
  s="$(printf '%s' "$1" | sed -e 's#^https\?://[^/]*##' -e 's#[^A-Za-z0-9._-]#_#g' -e 's#^_*##' | cut -c1-120)"
  printf '%s' "${s:-index}"
}
meta() { # meta <html-file> <name-or-property> ; first match, attribute-order agnostic
  tr '\n' ' ' < "$1" \
    | grep -oiE "<meta[^>]*(name|property)=[\"']$2[\"'][^>]*>" \
    | head -1 | grep -oiE "content=[\"'][^\"']*" | sed -e "s/^content=[\"']//" | tr -d '\t'
}

capture() {
  url="$1"
  s="$(slug "$url")"
  hdr="$(mktemp -p "$ROWS")"; body="$(mktemp -p "$ROWS")"
  code="$(curl -sS -L -A "$UA" --max-time 60 --retry 2 --retry-delay 2 \
          -D "$hdr" -o "$body" -w '%{http_code}' "$url" || echo 000)"
  final="$(grep -i '^location:' "$hdr" | tail -1 | sed 's/^[Ll]ocation: *//' | tr -d '\r')"
  [ -n "$final" ] || final="$url"
  hops="$(grep -ciE '^HTTP/[0-9.]+ 3[0-9][0-9]' "$hdr" || true)"
  ctype="$(grep -i '^content-type:' "$hdr" | tail -1 | sed 's/^[^:]*: *//' | tr -d '\r' | cut -d';' -f1)"

  # record each redirect hop for the invariant map
  awk 'BEGIN{IGNORECASE=1} /^HTTP\/[0-9.]+ 3[0-9][0-9]/{c=$2} /^[Ll]ocation:/{sub(/^[^:]*: */,"");gsub(/\r/,"");if(c)print c"\t"$0}' "$hdr" \
    | while IFS=$'\t' read -r c loc; do printf '%s\t%s\t%s\n' "$url" "$c" "$loc"; done > "$ROWS/$s.redir"

  title=""; canon=""; robots=""; desc=""; h1=""; hash=""
  if [ "$code" = "200" ] && [ "$ctype" = "text/html" ]; then
    cp "$body" "$ARCHIVE/$s.html"
    title="$(tr '\n' ' ' < "$body" | grep -oiE '<title[^>]*>[^<]*' | head -1 | sed 's/^<[^>]*>//' | tr -d '\t')"
    canon="$(tr '\n' ' ' < "$body" | grep -oiE "<link[^>]*rel=[\"']canonical[\"'][^>]*>" | head -1 | grep -oiE "href=[\"'][^\"']*" | sed -e "s/^href=[\"']//")"
    robots="$(meta "$body" robots)"
    desc="$(meta "$body" description)"
    h1="$(tr '\n' ' ' < "$body" | grep -oiE '<h1[^>]*>.*?</h1>' | head -1 | sed -e 's/<[^>]*>//g' | tr -s ' ' | tr -d '\t' | cut -c1-160)"
    hash="$(sha256sum "$body" | cut -c1-16)"
  fi
  # one row per URL in its own file: concurrent appends to one shared stream
  # interleave under load, and a corrupted row is a corrupted baseline.
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
    "$url" "$code" "$hops" "$final" "$ctype" "$(wc -c < "$body")" "$hash" "$title" "$canon" "$robots" "$desc" \
    | tr -d '\r' > "$ROWS/$s.row"
  rm -f "$hdr" "$body"
}
export -f capture slug meta
export ARCHIVE UA ROWS

printf 'url\tstatus\tredirect_hops\tfinal_location\tcontent_type\tbytes\tbody_sha256_16\ttitle\tcanonical\tmeta_robots\tmeta_description\n' > "$OUT"
# partial reruns (custom IN) must not clobber the accumulated redirect map
[ "$IN" = "baseline/url-inventory.tsv" ] && printf 'source_url\tstatus\tlocation\n' > baseline/redirect-map.tsv || true

tail -n +2 "$IN" | cut -f1 | sort -u \
  | xargs -P "$JOBS" -I{} bash -c 'capture "$@"' _ {} || true  # a failed URL still leaves a row; never abort the sweep

cat "$ROWS"/*.row | sort >> "$OUT"
cat "$ROWS"/*.redir 2>/dev/null | sort -u >> baseline/redirect-map.tsv
echo "captured $(( $(wc -l < "$OUT") - 1 )) URLs; $(( $(wc -l < baseline/redirect-map.tsv) - 1 )) redirect hops"
