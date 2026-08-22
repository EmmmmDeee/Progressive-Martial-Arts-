#!/usr/bin/env bash
# Phase 1 (PRESERVE + BASELINE): record which tracking / integration IDs the
# live site ships, from the archived HTML. These IDs are invariants: the
# migrated site must keep reporting into the same properties (phase 3 locks
# them; phase 33 measures through them).
set -euo pipefail
ARCHIVE="${ARCHIVE:-baseline/html}"
OUT="${OUT:-baseline/analytics-state.tsv}"

printf 'kind\tid\tpages\n' > "$OUT"
scan() { # scan <kind> <regex> — zero matches is a result, not an error
  { grep -hoE "$2" "$ARCHIVE"/*.html 2>/dev/null || true; } | sort | uniq -c | sort -rn \
    | awk -v k="$1" '{print k"\t"$2"\t"$1}'
}
{
  # anchor GA4 ids to the loader/config call — a bare G-XXXX pattern false-positives on product SKUs
  scan gtag        'gtag/js\?id=G-[A-Z0-9]{6,12}|gtag\(.config., ?.G-[A-Z0-9]{6,12}'
  scan universal   'UA-[0-9]{4,10}-[0-9]{1,3}'
  scan gtm         'GTM-[A-Z0-9]{4,10}'
  scan fb-pixel    'fbq\(.init., ?.[0-9]{8,20}' | sed "s/fbq(.init., \?.//"
  scan hotjar      'hjid[": ]+[0-9]{4,10}'
  scan gmaps-embed 'maps\.google\.[a-z.]+/maps|google\.com/maps/embed'
  scan youtube     'youtube(-nocookie)?\.com/embed/[A-Za-z0-9_-]{6,}'
  scan recaptcha   'www\.google\.com/recaptcha'
  scan mailchimp   'list-manage\.com'
  scan cf7-form    'wpcf7'
  scan gravity     'gform_wrapper'
} >> "$OUT"
echo "analytics/integration state -> $OUT"; cat "$OUT"
