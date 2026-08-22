# Phase 2 — DISCOVER + MAP summary

Derived from the 488-page archived corpus (`baseline/html/`) by
`tools/10-discover-map.py`. All tables in `discovery/` are TSV-with-header.

## Stack (as shipped to browsers)
- Theme: **cherie** (+ cherie-core plugin) with **Elementor** page builder
  (23 widget types; `page-map.tsv` marks which pages are Elementor-built).
- Plugins visible in output on every page: cherie-core, contact-form-7,
  elementor, woocommerce, woocommerce-paypal-payments; Turnstile on 5 pages.
- Shortcode remnants rendering as raw text: `[custom-facebook-feed]` on the
  homepage, `[rev_slider]` on /home-1-boxer/ — both broken (plugin absent).

## Content universe (page-map.tsv)
237 product pages, 214 archive pages (categories/tags/brands), 26 pages,
5 posts, 4 demo "courses", 1 search, 2 home variants.

## Navigation (nav-structure.tsv)
Single primary menu sitewide: 7 adult programs + Mini Muscles (kids),
Timetable, Shop, Contact, History/About, two instructor pages, six galleries,
visitor info, links. One nav item targets a raw `?page_id=14587` URL
("Affiliate Clubs") instead of a permalink.

## Entities (entity-inventory.tsv)
7 adult programs, 1 kids program, 1 timetable, 2 people directories +
2 person posts, 1 history/about, 5 event/media galleries + 1 student gallery,
1 upcoming seminar event, shop, contact, blog.

## Dependency findings that gate later phases
- **Dead conversion link**: /professor-jean-jacques-seminar/ links its
  registration product `…seminar-brisbane-april-23-26-2026/` which returns
  **404** (only crawl-discovered URL not in any sitemap). Fix in phase 4;
  event/commerce linking in phase 18.
- **Orphans** (no inbound links): 2 hashed author pages, demo pages
  (/home-1-boxer/, /shop-2/, 4 hair/nail/makeup "courses"), plus /checkout/
  and /shopping-bag/ (reachable only by redirect/cart actions — expected).
- **Pagination surfaces** (115 `/page/N/` URLs) are linked but per Yoast
  convention not sitemapped — they must survive as crawlable paths or 301 in
  the new architecture (`linked-but-uninventoried.tsv`).
- **Legacy PDFs**: 3 newsletters (2020) linked only from the orphaned
  /home-1-boxer/ demo home — archival candidates, not live surfaces.
- **External runtime deps**: Cloudflare Turnstile (5 pages), Google Maps
  embeds (home + contact), one WordPress oEmbed of the 404 seminar product.
- **Media**: 4,395 page→asset references (`media-usage.tsv`) feed the
  phase 19 dedupe/classify pipeline.
- **Forms**: every page carries the CF7 markup (734 form actions recorded);
  conversion journey work (phase 10) touches a sitewide component, not a page.
