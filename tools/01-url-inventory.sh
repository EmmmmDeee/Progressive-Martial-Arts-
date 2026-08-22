#!/usr/bin/env bash
# Phase 1 (PRESERVE + BASELINE): build the authoritative public URL inventory
# from the Yoast sitemap index. Output: baseline/url-inventory.tsv
#   columns: url <TAB> source-sitemap <TAB> lastmod
set -euo pipefail

SITE="${SITE:-https://progressivemartialarts.com.au}"
OUT="${OUT:-baseline/url-inventory.tsv}"
CURL=(curl -sS --max-time 60 --retry 3 --retry-delay 2 -A "PMAAI-migration-baseline/1.0")

mkdir -p "$(dirname "$OUT")" baseline/sitemaps

index_url="$SITE/sitemap_index.xml"
"${CURL[@]}" "$index_url" > baseline/sitemaps/sitemap_index.xml

printf 'url\tsitemap\tlastmod\n' > "$OUT"

# entries() prints "<loc>\t<lastmod>" for every <url>/<sitemap> node.
entries() {
  tr '\n' ' ' \
    | sed -e 's#</\(url\|sitemap\)>#\n#g' \
    | sed -n 's#.*<loc>\([^<]*\)</loc>\(.*\)#\1\t\2#p' \
    | sed -e 's#\t.*<lastmod>\([^<]*\)</lastmod>.*#\t\1#' -e 's#\t[^\t]*<[^\t]*$#\t#'
}

while IFS=$'\t' read -r child _; do
  [ -n "$child" ] || continue
  name="$(basename "$child")"
  "${CURL[@]}" "$child" > "baseline/sitemaps/$name"
  entries < "baseline/sitemaps/$name" \
    | awk -F'\t' -v s="$name" 'NF && $1 !~ /\.xml$/ {print $1"\t"s"\t"$2}' >> "$OUT"
done < <(entries < baseline/sitemaps/sitemap_index.xml)

# Surfaces that are never in a sitemap but must be preserved/tested.
for extra in / /shop/ /cart/ /checkout/ /my-account/ /contact/ /?s=test /this-url-must-404-$RANDOM; do
  printf '%s\t%s\t\n' "$SITE$extra" "manual-critical" >> "$OUT"
done

echo "inventory: $(( $(wc -l < "$OUT") - 1 )) URLs -> $OUT"
