#!/usr/bin/env bash
# Phase 1 (PRESERVE + BASELINE): authoritative, restorable snapshot of the
# production WordPress/WooCommerce system.
#
# This is the ONLY artefact that makes every later phase reversible. It must be
# run from a host with SSH + WP-CLI access to production. Nothing in phases 2+
# may start until `tools/04-verify-restore.sh` has passed against its output.
#
#   SSH_TARGET=user@host WP_PATH=/var/www/html ./tools/00-snapshot-production.sh
set -euo pipefail

: "${SSH_TARGET:?set SSH_TARGET=user@host}"
WP_PATH="${WP_PATH:-/var/www/html}"
STAMP="${STAMP:-$(date -u +%Y%m%dT%H%M%SZ)}"
DEST="${DEST:-snapshots/$STAMP}"
# multiplexed: the ~17 wp/tar invocations below share one SSH connection
RSH=(ssh -o BatchMode=yes -o ControlMaster=auto -o ControlPath=~/.ssh/cm-%r@%h:%p -o ControlPersist=120 "$SSH_TARGET")
WP="wp --path=$WP_PATH --skip-plugins --skip-themes"

mkdir -p "$DEST"
echo "==> snapshot $STAMP -> $DEST"

# 1. Database. --single-transaction keeps the dump consistent without locking
#    the storefront; WooCommerce order tables must not be locked during trade.
"${RSH[@]}" "$WP db export - --single-transaction --quick --default-character-set=utf8mb4" \
  | gzip -9 > "$DEST/database.sql.gz"

# 2. Files. Whole wp-content: uploads (media + historical assets), themes,
#    plugins, mu-plugins. Excludes regenerable caches and WooCommerce logs.
"${RSH[@]}" "tar -C $WP_PATH -czf - \
    --exclude='wp-content/cache' \
    --exclude='wp-content/uploads/cache' \
    --exclude='wp-content/uploads/wc-logs' \
    --exclude='wp-content/uploads/woocommerce_transient_files' \
    wp-content wp-config.php .htaccess" > "$DEST/wp-content.tar.gz"

# 3. Configuration state, captured as text so it is diffable in later phases.
{
  echo "### core"; "${RSH[@]}" "$WP core version --extra"
  echo "### plugins"; "${RSH[@]}" "$WP plugin list --format=csv"
  echo "### themes"; "${RSH[@]}" "$WP theme list --format=csv"
  echo "### post types"; "${RSH[@]}" "$WP post-type list --format=csv"
  echo "### taxonomies"; "${RSH[@]}" "$WP taxonomy list --format=csv"
  echo "### post counts"; "${RSH[@]}" "$WP post list --post_type=any --post_status=any --format=count" || true
  echo "### users"; "${RSH[@]}" "$WP user list --fields=ID,user_login,user_email,roles --format=csv"
  echo "### menus"; "${RSH[@]}" "$WP menu list --format=csv"
  echo "### permalink structure"; "${RSH[@]}" "$WP option get permalink_structure"
  echo "### siteurl/home"; "${RSH[@]}" "$WP option get siteurl"; "${RSH[@]}" "$WP option get home"
  echo "### woocommerce"; "${RSH[@]}" "$WP wc --version" || true
  echo "### php"; "${RSH[@]}" "php -v"
} > "$DEST/configuration.txt" 2>&1

# 4. Commerce integrity counters. Compared verbatim after any restore; a
#    changed order/product count is a failed restore, not a rounding error.
{
  for pt in product product_variation shop_order shop_coupon; do
    printf '%s\t' "$pt"
    "${RSH[@]}" "$WP post list --post_type=$pt --post_status=any --format=count" 2>/dev/null || echo 0
  done
} > "$DEST/commerce-counters.tsv"

# 5. Media manifest: every uploaded asset with size + hash, so phase 19
#    deduplication can never silently destroy an original.
"${RSH[@]}" "find $WP_PATH/wp-content/uploads -type f ! -path '*/wc-logs/*' -printf '%p\t%s\n' \
   | sort" > "$DEST/media-manifest.tsv"

( cd "$DEST" && sha256sum database.sql.gz wp-content.tar.gz > SHA256SUMS )
echo "==> done. verify with: DEST=$DEST tools/04-verify-restore.sh"
