#!/usr/bin/env bash
# Phase 1 (PRESERVE + BASELINE): render + performance/accessibility baseline
# for a representative page set, using headless Chromium. These numbers are
# the objective "before" reference that phases 26-28 are measured against.
#
# Outputs:
#   baseline/renders/<slug>-{desktop,mobile}.png   representative renders
#   baseline/perf-baseline.tsv                     timing + weight metrics
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p baseline/renders
node tools/perf-baseline.mjs
