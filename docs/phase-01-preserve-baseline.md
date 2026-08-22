# Phase 1 — PRESERVE + BASELINE

Purpose: before anything on https://progressivemartialarts.com.au/ is touched,
capture (a) a restorable authoritative copy of the whole production system and
(b) an objective external "before" reference. Every later phase (2–33) diffs
against, or restores from, what this phase produces. **Phase 2 must not start
until the checklist at the bottom is fully green.**

## What the site is (established during this phase)

- WordPress + WooCommerce storefront, Yoast SEO (sitemap index at
  `/sitemap_index.xml`), REST API locked to authenticated users (401 on `/wp-json/`).
- Public URL universe: dominated by WooCommerce products, product tags and
  categories, with a small page/post core — exact per-type counts are
  generated into `baseline/BASELINE-SUMMARY.md` and must be read from there.
- Cart/checkout live on a non-default slug: `/checkout/` → 301 →
  `/shopping-bag/` (noindex). `/cart/` and `/my-account/` return **404** —
  confirmed pre-existing production behaviour, recorded so the migration is
  never blamed for it (and phase 21 must fix or intentionally redirect them).
- A leftover demo homepage exists at `/home-1-boxer/` (555 KB, indexable) and
  demo LMS content at `/courses/hair-*`, `/courses/nail-*`, `/courses/makeup-*`
  ("Hair Advanced Cource" etc.) — template remnants for phase 4 to classify,
  protected until then.

## Artefacts

| Artefact | Producer | Consumed by |
|---|---|---|
| `snapshots/<stamp>/database.sql.gz` | `tools/00-snapshot-production.sh` | rollback, staging (phases 2–32) |
| `snapshots/<stamp>/wp-content.tar.gz` (uploads, themes, plugins, wp-config, .htaccess) | same | rollback, media work (19) |
| `snapshots/<stamp>/configuration.txt` (core/plugins/themes/menus/permalinks) | same | discovery (2), plugin audit (27) |
| `snapshots/<stamp>/commerce-counters.tsv` | same | restore proof, commerce phases (20–21) |
| `snapshots/<stamp>/media-manifest.tsv` (path+size of every upload) | same | media dedupe (19) — no original may vanish unaccounted |
| `baseline/url-inventory.tsv` (all sitemap URLs + critical extras; count in `baseline/BASELINE-SUMMARY.md`) | `tools/01-url-inventory.sh` | discovery (2), invariants (3), completeness (31) |
| `baseline/http-baseline.tsv` (status, redirects, title, canonical, robots, description, body hash per URL) | `tools/02-capture-baseline.sh` | invariants (3), SEO (25), completeness (31) |
| `baseline/redirect-map.tsv` (every observed 3xx hop) | same | invariant redirects (3, 25) |
| `baseline/html/*.html` (raw HTML archive of every 200 page) | same | correction (4), editorial (23) — legacy copy stays recoverable |
| `baseline/renders/*.png` + `baseline/perf-baseline.tsv` (TTFB/DCL/load/LCP/CLS/weight/requests, desktop+mobile, per template family) | `tools/03-performance-baseline.sh` | budgets (7), perf (27), visual QA (28) |
| Search/analytics exports (manual, below) | site owner | invariants (3), measurement (33) |

## Manual steps (need production/owner access — cannot run from this repo)

1. **Server snapshot**: `SSH_TARGET=… WP_PATH=… tools/00-snapshot-production.sh`
   (plus the host's own backup, e.g. cPanel/hosting snapshot, as second copy).
2. **Search state**: Google Search Console → export performance (16 months),
   index coverage, and manual-action status. Bing Webmaster equivalent.
3. **Analytics state**: export GA4 (or whatever is installed — verify in the
   captured HTML for gtag/GTM IDs) audience + acquisition + landing pages.
4. **Google Business Profile**: screenshot/export current listing (Tingalpa
   NAP data) — local-discovery invariant for phase 25.
5. **Staging + rollback proof**: restore the snapshot into staging and run
   `DEST=… STAGING_SSH=… STAGING_URL=… tools/04-verify-restore.sh`.
   The rollback path is *proven* only when this exits green.

## Rollback contract

At any point in phases 2–32, production is recoverable by restoring the most
recent verified snapshot (database import + wp-content untar + URL
search-replace back to production home). `tools/04-verify-restore.sh` is the
same procedure pointed at staging, so every restore rehearsal is also a
rollback rehearsal. Snapshots are immutable once `SHA256SUMS` is written.

## Exit checklist (gate to Phase 2)

- [ ] Production snapshot taken; `SHA256SUMS` verified
- [ ] Snapshot restored into staging; `04-verify-restore.sh` green
      (counters match, smoke URLs 200, staging noindexed)
- [x] URL inventory captured (all sitemaps + critical extras — counts live in `baseline/BASELINE-SUMMARY.md`)
- [x] HTTP/SEO baseline captured for every inventoried URL, HTML archived
- [x] Redirect behaviour recorded (incl. `/checkout/`→`/shopping-bag/`,
      `/cart/` + `/my-account/` = pre-existing 404s)
- [x] Representative renders + performance/accessibility counters captured
      (desktop + mobile, per template family)
- [ ] Search Console / analytics / GBP exports archived

## Stack facts (from archived markup — no server access needed)

- Theme: `cherie` (+ `cherie-core` plugin) — an Elementor-based commercial theme
- Page builder: Elementor 4.0.7 (external CSS print method, Google Fonts enabled)
- Commerce: WooCommerce + WooCommerce PayPal Payments
- Forms: Contact Form 7 sitewide; Simple Cloudflare Turnstile present on some pages
- SEO: Yoast (sitemaps, canonicals, robots directives observed per-URL)
- Analytics: **none** — no GA4/UA/GTM/pixel loader anywhere in the captured
  pages (baseline/analytics-state.tsv). Phase 33 needs analytics installed
  first; there is no historical web-analytics dataset to preserve, so the
  "analytics export" manual step reduces to Search Console + GBP only.
