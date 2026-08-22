#!/usr/bin/env bash
# Phase 1 (PRESERVE + BASELINE): build the authoritative public URL inventory
# from the Yoast sitemap index. Output: baseline/url-inventory.tsv
#   columns: url <TAB> source-sitemap <TAB> lastmod
set -euo pipefail
. "$(dirname "$0")/lib.sh"

OUT="${OUT:-$BASELINE_DIR/url-inventory.tsv}"
SMAPS="$BASELINE_DIR/sitemaps"
mkdir -p "$(dirname "$OUT")" "$SMAPS"

fetch "$SITE/sitemap_index.xml" > "$SMAPS/sitemap_index.xml"

printf 'url\tsitemap\tlastmod\n' > "$OUT"

# entries() prints "<loc>\t<lastmod>" per <url>/<sitemap> node: pull the two
# tags in document order, then pair a lastmod with the loc it follows.
entries() {
  grep -oE '<(loc|lastmod)>[^<]*' \
    | awk -F'>' '/^<loc/{if(loc)print loc"\t"; loc=$2; next} {print loc"\t"$2; loc=""} END{if(loc)print loc"\t"}'
}

entries < "$SMAPS/sitemap_index.xml" | cut -f1 | while read -r child; do
  [ -n "$child" ] || continue
  name="$(basename "$child")"
  fetch "$child" > "$SMAPS/$name"
  entries < "$SMAPS/$name" \
    | awk -F'\t' -v s="$name" 'NF && $1 !~ /\.xml$/ {print $1"\t"s"\t"$2}' >> "$OUT"
done

# Surfaces never in a sitemap but which must be preserved/tested, plus probes.
tsv_body "$CRITICAL_PATHS_TSV" | cut -f1 | while read -r p; do
  printf '%s\t%s\t\n' "$SITE$p" "manual-critical" >> "$OUT"
done
for probe in /?s=test /this-url-must-404-$RANDOM; do
  printf '%s\t%s\t\n' "$SITE$probe" "manual-critical" >> "$OUT"
done

echo "inventory: $(tsv_rows "$OUT") URLs -> $OUT"
