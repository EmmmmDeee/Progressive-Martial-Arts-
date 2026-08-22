#!/usr/bin/env bash
# Shared configuration + helpers for the Phase 1 baseline toolchain.
# Every tools/*.sh sources this; perf-baseline.mjs reads the exported env vars.

SITE="${SITE:-https://progressivemartialarts.com.au}"
BASELINE_UA="${BASELINE_UA:-PMAAI-migration-baseline/1.0}"
BASELINE_DIR="${BASELINE_DIR:-baseline}"
ARCHIVE_DIR="${ARCHIVE_DIR:-$BASELINE_DIR/html}"
RENDER_DIR="${RENDER_DIR:-$BASELINE_DIR/renders}"
# path + expected production status for surfaces that must never silently change
CRITICAL_PATHS_TSV="${CRITICAL_PATHS_TSV:-tools/critical-paths.tsv}"
export SITE BASELINE_UA BASELINE_DIR ARCHIVE_DIR RENDER_DIR

# fetch <url> [curl-args...] — the one retry/timeout policy for baseline HTTP.
# Whether a flaky URL records as 000 depends on this policy, so it must be
# identical everywhere baselines are captured or compared.
fetch() { local u="$1"; shift; curl -sS --max-time 60 --retry 3 --retry-delay 2 -A "$BASELINE_UA" "$@" "$u"; }

# TSV conventions: first line is a header.
tsv_body() { tail -n +2 "$1" 2>/dev/null; }
tsv_rows() { tsv_body "$1" | wc -l; }
# tsv_col <name> <file> — 1-based index of a named column
tsv_col() { awk -F'\t' -v n="$1" 'NR==1{for(i=1;i<=NF;i++)if($i==n){print i;exit}}' "$2"; }
