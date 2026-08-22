#!/usr/bin/env bash
# Phase 1 (PRESERVE + BASELINE): condense the captured baselines into the
# human-readable reference used at every later phase gate.
set -euo pipefail
B=baseline
OUT=$B/BASELINE-SUMMARY.md
n() { tail -n +2 "$1" 2>/dev/null | wc -l; }

{
echo "# Production baseline summary — $(head -1 $B/capture-date.txt 2>/dev/null || echo 'date unrecorded')"
echo
echo "Site: https://progressivemartialarts.com.au/ (WordPress + WooCommerce + Yoast)"
echo
echo "## URL universe"
echo "- Inventoried URLs: $(n $B/url-inventory.tsv)"
tail -n +2 $B/url-inventory.tsv | cut -f2 | sort | uniq -c | sort -rn | awk '{print "  - "$2": "$1}'
echo
echo "## HTTP status (must not regress without an explicit redirect decision)"
tail -n +2 $B/http-baseline.tsv | cut -f2 | sort | uniq -c | sort -rn | awk '{print "- "$2": "$1}'
echo
echo "### Non-200 surfaces (pre-existing; recorded so the migration is never blamed)"
tail -n +2 $B/http-baseline.tsv | awk -F'\t' '$2!=200{print "- "$2" "$1}'
echo
echo "### Redirects observed"
tail -n +2 $B/redirect-map.tsv | awk -F'\t' '{print "- "$2": "$1" -> "$3}'
echo
echo "### Noindex surfaces"
tail -n +2 $B/http-baseline.tsv | awk -F'\t' '$10 ~ /noindex/{print "- "$1}'
echo
echo "### Canonical mismatches (canonical differs from served URL)"
tail -n +2 $B/http-baseline.tsv | awk -F'\t' '$2==200 && $9!="" && $9!=$1{print "- "$1" -> "$9}'
echo
echo "## Duplicate content (identical body hash on 2+ URLs)"
tail -n +2 $B/http-baseline.tsv | awk -F'\t' '$7!=""{print $7"\t"$1}' | sort \
  | awk -F'\t' '{if($1==p){if(!h){print "- group "$1":"; print "  - "u; h=1} print "  - "$2} else h=0; p=$1; u=$2}'
echo
echo "## Tracking / integrations shipped by the live site"
tail -n +2 $B/analytics-state.tsv 2>/dev/null | awk -F'\t' '{print "- "$1": "$2" (on "$3" pages)"}'
echo
echo "## Performance / render baseline (desktop + mobile)"
echo '```'
# column(1) is absent on minimal images — align with awk instead
awk -F'\t' '{for(i=1;i<=NF;i++) printf "%-*s", (i==3?42:(i==1?14:10)), $i; print ""}' $B/perf-baseline.tsv 2>/dev/null || echo "perf baseline missing"
echo '```'
} > "$OUT"
echo "summary -> $OUT"
