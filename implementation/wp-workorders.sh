#!/usr/bin/env bash
# Structural work orders generated from graph/url-graph.tsv + entity model.
# Run against STAGING first (wp --path=...), verify, then production.
# Ordered P0 -> P2. Every order is idempotent and independently verifiable.
set -euo pipefail
WP="wp ${WP_ARGS:-}"

echo "== P0-1: restore WooCommerce cart/account endpoints (currently 404)"
# /shopping-bag/ serves the cart; recreate the My Account page and verify the
# cart page id mapping. Verify with: curl -I /my-account/ -> 200
$WP option get woocommerce_myaccount_page_id || true
# if 0/empty: create page + assign
# $WP post create --post_type=page --post_title='My Account' --post_name=my-account --post_content='<!-- wp:shortcode -->[woocommerce_my_account]<!-- /wp:shortcode -->' --post_status=publish --porcelain
# $WP option update woocommerce_myaccount_page_id <ID>

echo "== P0-2: repair the 2026 seminar registration link (event page -> 404 product)"
# Republish or relink the product on /professor-jean-jacques-seminar/.
$WP post list --post_type=product --s='jean-jacques-machado-seminar' --post_status=any --fields=ID,post_status,post_name

echo "== P0-3: remove broken shortcode remnants rendering as text"
# [custom-facebook-feed] on the homepage; [rev_slider] on demo page (deleted below).
$WP db query "SELECT ID FROM wp_posts WHERE post_status='publish' AND post_content LIKE '%[custom-facebook-feed%'"

echo "== P1-1: delete theme demo remnants (410 handled by redirects.htaccess)"
for slug in home-1-boxer shop-2 ; do
  id=$($WP post list --post_type=page --name=$slug --post_status=any --field=ID) && [ -n "$id" ] && $WP post delete "$id" --force
done
$WP post list --post_type=courses --post_status=any --field=ID | xargs -r -n1 $WP post delete --force
# then unregister the 'courses' CPT (theme demo) and drop its sitemap

echo "== P1-2: give 'Affiliate Clubs' (page_id=14587) a permalink and fix the menu item"
$WP post update 14587 --post_name=affiliate-clubs
# update the nav menu item to the permalink; verify no ?page_id= URLs remain in menus

echo "== P1-3: disable author archives (Yoast) — hashed author URLs 410"
$WP option patch update wpseo_titles disable-author true || echo "set via Yoast admin: Search Appearance -> Archives"

echo "== P2-1: merge duplicate product tags (single-hop 301s in redirects.htaccess)"
declare -A MERGE=( [muay-thai-thai-boxing]=muay-thai [jun-fan-gung-fu-jkd]=jun-fan-gung-fu
                   [jeet-kune-do]=jun-fan-gung-fu [pentjak-silat]=pencak-silat )
for from in "${!MERGE[@]}"; do
  to=${MERGE[$from]}
  echo "merge product_tag $from -> $to"
  # $WP term list product_tag --slug=$from --field=term_id | xargs -I{} <reassign + delete>
done

echo "== P2-2: consolidate duplicate program page"
# /thai-boxing/ content is superseded by /muay-thai/: unpublish after redirect live.
$WP post list --pagename=thai-boxing --field=ID | xargs -r -n1 $WP post update --post_status=draft
$WP post list --pagename=latest-news --field=ID | xargs -r -n1 $WP post update --post_status=draft

echo "== P2-3: convert /checkout/ 302 to the deterministic 301 (redirects.htaccess)"
echo "All work orders staged. Recrawl with tools/01+02, rerun tools/20-url-graph.py, diff."

echo "== P3-1: lexicography — one brand suffix + separator sitewide (graph/lexicon.tsv)"
# Yoast: separator '|', sitename 'Progressive Martial Arts'; remove per-page
# off-brand suffixes (PMA / PMAAI / ...Academy / ...Australia): 10 pages in
# graph/title-defects.tsv carry hand-written SEO titles — clear or align them.

echo "== P3-2: lexicography — strip hand-typed brand from 3 product titles (doubled suffix)"
for slug in long-pants-progressive-martial-arts singlet-ladies-progressive-martial-arts t-shirt-progressive-martial-arts; do
  id=$($WP post list --post_type=product --name=$slug --field=ID) && [ -n "$id" ] \
    && $WP post update "$id" --post_title="$($WP post get "$id" --field=post_title | sed 's/ - Progressive Martial Arts$//')"
done

echo "== P3-3: lexicography — canonical term spellings in titles/terms"
# Brazilian Jiu-Jitsu (hyphenated): rename product_tag/category titles
#   'Brazilian Jiu Jitsu' -> 'Brazilian Jiu-Jitsu'; product title for the
#   Machado t-shirt likewise.
# Muay Thai: retitle the muay-thai-thai-boxing archive (tag merge already in
#   migration map); 'Thai Boxing Shorts' product -> 'Muay Thai Shorts';
#   /thai-boxing/ page consolidation already in migration map.
# Proper-noun exemptions stand: 'World Thai Boxing Association', Inosanto DVD
#   titles, 'Lameco Eskrima' keep official names.
# Full defect list: graph/title-defects.tsv (regenerate: tools/22-lexicon-audit.py)

echo "== P0-4: enforce protocol canonicalisation (VERIFIED 2026-08-22)"
# http://progressivemartialarts.com.au/ serves 200 with no redirect to https
# (HSTS header is sent on the http response, where browsers ignore it).
# Add at the top of .htaccess, before all other rules:
#   RewriteCond %{HTTPS} !=on
#   RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
# Keep HSTS on https responses only. www -> apex 301 already works (verified).
