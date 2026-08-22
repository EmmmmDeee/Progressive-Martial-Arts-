# Rollback runbook (invariant from Phase 1)

Applies at any point in phases 2–32. Target time: < 30 minutes.

## Preconditions
- A verified snapshot exists: `snapshots/<stamp>/` with green `SHA256SUMS`
  and a passing `tools/04-verify-restore.sh` rehearsal recorded for it.
- SSH + WP-CLI access to the production host.

## Procedure
1. **Freeze**: put the site into maintenance mode
   (`wp maintenance-mode activate`) so no new orders arrive mid-restore.
2. **Verify archives**: `cd snapshots/<stamp> && sha256sum -c SHA256SUMS`.
3. **Database**: `gzip -dc database.sql.gz | ssh PROD "wp db import - --path=$WP_PATH"`.
4. **Files**: `cat wp-content.tar.gz | ssh PROD "tar -C $WP_PATH -xzf -"`
   (restores wp-content, wp-config.php, .htaccess).
5. **Flush**: `wp cache flush; wp rewrite flush` on production.
6. **Smoke test** (all must return their baseline status from
   `baseline/http-baseline.tsv`): `/`, `/shop/`, `/shopping-bag/`, `/timetable/`,
   `/contact/`, one product URL, one program URL.
7. **Commerce counters**: re-run the counter query and compare to
   `snapshots/<stamp>/commerce-counters.tsv`.
   ⚠ Orders placed between snapshot and rollback are in the delta — export
   them (`wp wc shop_order list --after=<stamp>`) **before** step 3 and
   re-enter/reconcile them after.
8. **Unfreeze**: `wp maintenance-mode deactivate`.

## Decision rule
Roll back when a production regression is material (checkout broken, data
loss, sitewide layout failure) and a forward fix is not verified within
30 minutes. Never debug for hours on live commerce.
