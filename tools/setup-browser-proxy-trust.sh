#!/usr/bin/env bash
# One-time per container: let headless Chromium work through the session's
# TLS-re-terminating egress proxy WITHOUT weakening verification.
#  1. install the proxy CA into the browser NSS store
#  2. disable post-quantum key agreement via enterprise policy (the gateway
#     resets oversized TLS 1.3 hellos; perf-baseline.mjs additionally caps
#     the proxy path at TLS 1.2)
set -euo pipefail
CA=/root/.ccr/agent-proxy-ca.crt
[ -f "$CA" ] || { echo "no agent proxy CA at $CA — nothing to do"; exit 0; }
command -v certutil >/dev/null || { apt-get update -q && apt-get install -y -q libnss3-tools; }
mkdir -p "$HOME/.pki/nssdb"
certutil -d "sql:$HOME/.pki/nssdb" -A -t "C,," -n ccr-agent-proxy -i "$CA" 2>/dev/null || true
mkdir -p /etc/chromium/policies/managed /etc/opt/chrome/policies/managed
printf '{"PostQuantumKeyAgreementEnabled": false}\n' \
  | tee /etc/chromium/policies/managed/pq.json > /etc/opt/chrome/policies/managed/pq.json
echo "browser proxy trust configured"
