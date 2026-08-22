#!/usr/bin/env bash
# Phase 1 (PRESERVE + BASELINE): capture the objective before-state of every
# inventoried URL, plus a raw HTML archive used as the diff reference for
# every later phase.
#
# Outputs:
#   baseline/http-baseline.tsv   one row per URL (status, redirects, SEO head, hashes)
#   baseline/redirect-map.tsv    every 3xx hop observed (INVARIANT input for phase 3)
#   baseline/html/<slug>.html    raw HTML archive of each 200 HTML response
#   baseline/capture-date.txt    when this sweep ran (consumed by 06)
set -euo pipefail
. "$(dirname "$0")/lib.sh"

IN="${IN:-$BASELINE_DIR/url-inventory.tsv}"
OUT="${OUT:-$BASELINE_DIR/http-baseline.tsv}"
JOBS="${JOBS:-6}"
# partial reruns (custom IN) must not clobber the accumulated redirect map
RESET_REDIRECT_MAP="${RESET_REDIRECT_MAP:-1}"

# Working files live inside the repo tree, NOT /tmp: this environment purges
# /tmp on a schedule, which silently destroys a long sweep's intermediate rows.
ROWS="$BASELINE_DIR/.rows.$$"; mkdir -p "$ROWS"; trap 'rm -rf "$ROWS"' EXIT
mkdir -p "$ARCHIVE_DIR" "$(dirname "$OUT")"

slug() {
  # NB: an empty path ("/") must still yield a name — a pipeline-final
  # `sed s#^$#index#` never fires on zero-line input, so default in the shell.
  local s
  s="$(printf '%s' "$1" | sed -e 's#^https\?://[^/]*##' -e 's#[^A-Za-z0-9._-]#_#g' -e 's#^_*##' | cut -c1-120)"
  printf '%s' "${s:-index}"
}
# hdrval <hdr-file> <header-name> — value of the last occurrence (final response)
hdrval() { grep -i "^$2:" "$1" | tail -1 | cut -d: -f2- | sed 's/^ *//' | tr -d '\r'; }
# first_attr <flat-html-file> <tag-regex> <attr> — attribute-order agnostic
first_attr() {
  grep -oiE "<$2[^>]*>" "$1" | head -1 \
    | grep -oiE "$3=[\"'][^\"']*" | head -1 | sed -e "s/^$3=[\"']//" | tr -d '\t'
}

capture() {
  url="$1"
  s="$(slug "$url")"
  hdr="$(mktemp -p "$ROWS")"; body="$(mktemp -p "$ROWS")"
  out="$(fetch "$url" -L -D "$hdr" -o "$body" -w '%{http_code}\t%{size_download}' || printf '000\t0')"
  code="${out%%$'\t'*}"; bytes="${out##*$'\t'}"
  final="$(hdrval "$hdr" location)"; [ -n "$final" ] || final="$url"
  ctype="$(hdrval "$hdr" content-type | cut -d';' -f1)"

  # record each redirect hop for the invariant map; hop count derives from it
  awk -v u="$url" 'BEGIN{IGNORECASE=1}
    /^HTTP\/[0-9.]+ 3[0-9][0-9]/{c=$2}
    /^[Ll]ocation:/{sub(/^[^:]*: */,"");gsub(/\r/,"");if(c)print u"\t"c"\t"$0}' "$hdr" > "$ROWS/$s.redir"
  hops="$(wc -l < "$ROWS/$s.redir")"

  title=""; canon=""; robots=""; desc=""; h1=""; hash=""
  if [ "$code" = "200" ] && [ "$ctype" = "text/html" ]; then
    cp "$body" "$ARCHIVE_DIR/$s.html"
    flat="$(mktemp -p "$ROWS")"
    tr '\n' ' ' < "$body" > "$flat"   # flatten once; every extractor reads this
    title="$(grep -oiE '<title[^>]*>[^<]*' "$flat" | head -1 | sed 's/^<[^>]*>//' | tr -d '\t')"
    canon="$(first_attr "$flat" "link[^>]*rel=[\"']canonical[\"']" href)"
    robots="$(first_attr "$flat" "meta[^>]*(name|property)=[\"']robots[\"']" content)"
    desc="$(first_attr "$flat" "meta[^>]*(name|property)=[\"']description[\"']" content)"
    h1="$(sed -n 's#.*<[hH]1[^>]*>\([^<]*\).*#\1#p' "$flat" | tr -s ' ' | tr -d '\t' | cut -c1-160)"
    hash="$(sha256sum "$body" | cut -c1-16)"
    rm -f "$flat"
  fi
  # one row per URL in its own file: concurrent appends to one shared stream
  # interleave under load, and a corrupted row is a corrupted baseline.
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
    "$url" "$code" "$hops" "$final" "$ctype" "$bytes" "$hash" "$title" "$canon" "$robots" "$desc" \
    | tr -d '\r' > "$ROWS/$s.row"
  rm -f "$hdr" "$body"
}
export -f capture slug hdrval first_attr fetch
export ROWS

printf 'url\tstatus\tredirect_hops\tfinal_location\tcontent_type\tbytes\tbody_sha256_16\ttitle\tcanonical\tmeta_robots\tmeta_description\n' > "$OUT"
[ "$RESET_REDIRECT_MAP" = 1 ] && printf 'source_url\tstatus\tlocation\n' > "$BASELINE_DIR/redirect-map.tsv"
date -u +%Y-%m-%dT%H:%M:%SZ > "$BASELINE_DIR/capture-date.txt"

tsv_body "$IN" | cut -f1 | sort -u \
  | xargs -P "$JOBS" -I{} bash -c 'capture "$@"' _ {} || true  # a failed URL still leaves a row; never abort the sweep

cat "$ROWS"/*.row | sort >> "$OUT"
cat "$ROWS"/*.redir 2>/dev/null | sort -u >> "$BASELINE_DIR/redirect-map.tsv"
echo "captured $(tsv_rows "$OUT") URLs; $(tsv_rows "$BASELINE_DIR/redirect-map.tsv") redirect hops"
