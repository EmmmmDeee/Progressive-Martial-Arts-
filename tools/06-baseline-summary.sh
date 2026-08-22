#!/usr/bin/env bash
# Phase 1 (PRESERVE + BASELINE): condense the captured baselines into the
# human-readable reference used at every later phase gate.
set -euo pipefail
. "$(dirname "$0")/lib.sh"
B="$BASELINE_DIR"
OUT="${OUT:-$B/BASELINE-SUMMARY.md}"
HTTP="$B/http-baseline.tsv"

# resolve http-baseline columns by header name — 02 owns the schema
c_status=$(tsv_col status "$HTTP"); c_hash=$(tsv_col body_sha256_16 "$HTTP")
c_canon=$(tsv_col canonical "$HTTP"); c_robots=$(tsv_col meta_robots "$HTTP")

{
echo "# Production baseline summary — $(head -1 "$B/capture-date.txt" 2>/dev/null || echo 'date unrecorded')"
echo
echo "Site: $SITE/ (WordPress + WooCommerce + Yoast)"
echo
echo "## URL universe"
echo "- Inventoried URLs: $(tsv_rows "$B/url-inventory.tsv")"
tsv_body "$B/url-inventory.tsv" | cut -f2 | sort | uniq -c | sort -rn | awk '{print "  - "$2": "$1}'
echo
echo "## HTTP status (must not regress without an explicit redirect decision)"
tsv_body "$HTTP" | cut -f"$c_status" | sort | uniq -c | sort -rn | awk '{print "- "$2": "$1}'
echo
echo "### Non-200 surfaces (pre-existing; recorded so the migration is never blamed)"
tsv_body "$HTTP" | awk -F'\t' -v s="$c_status" '$s!=200{print "- "$s" "$1}'
echo
echo "### Redirects observed"
tsv_body "$B/redirect-map.tsv" | awk -F'\t' '{print "- "$2": "$1" -> "$3}'
echo
echo "### Noindex surfaces"
tsv_body "$HTTP" | awk -F'\t' -v r="$c_robots" '$r ~ /noindex/{print "- "$1}'
echo
echo "### Canonical mismatches (canonical differs from served URL)"
tsv_body "$HTTP" | awk -F'\t' -v s="$c_status" -v c="$c_canon" '$s==200 && $c!="" && $c!=$1{print "- "$1" -> "$c}'
echo
echo "## Duplicate content (identical body hash on 2+ URLs)"
tsv_body "$HTTP" | awk -F'\t' -v h="$c_hash" '$h!=""{print $h"\t"$1}' | sort \
  | awk -F'\t' '{if($1==p){if(!h){print "- group "$1":"; print "  - "u; h=1} print "  - "$2} else h=0; p=$1; u=$2}'
echo
echo "## Tracking / integrations shipped by the live site"
tsv_body "$B/analytics-state.tsv" | awk -F'\t' '{print "- "$1": "$2" (on "$3" pages)"}'
echo
echo "## Performance / render baseline (desktop + mobile)"
echo '```'
# column(1) is absent on minimal images — align with awk instead
awk -F'\t' '{for(i=1;i<=NF;i++) printf "%-*s", (i==3?42:(i==1?14:10)), $i; print ""}' "$B/perf-baseline.tsv" 2>/dev/null || echo "perf baseline missing"
echo '```'
} > "$OUT"
echo "summary -> $OUT"
