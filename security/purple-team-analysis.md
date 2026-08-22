# Purple Team Analysis — progressivemartialarts.com.au

**Scope:** external, passive posture assessment of the owner's own production
site. Method: benign HEAD/GET requests + analysis of the archived corpus
(`baseline/`, `baseline/recrawl/`). **No** fuzzing, injection, credential,
brute-force, or DoS testing was performed. Date: 2026-08-22.

**Evidence classes:** VERIFIED = directly observed in a response this session.
PROVISIONAL = observed but server-side truth unconfirmable externally.
UNKNOWN = not determinable without authenticated/admin access.

Stack (VERIFIED): LiteSpeed web server, WordPress + WooCommerce 10.7.0,
Elementor 8.4.5, Contact Form 7 6.1.5, WooCommerce PayPal Payments 4.0.3,
cherie theme + cherie-core, Cloudflare Turnstile on forms.

---

## BLUE — controls confirmed working (defensive baseline)

| # | Control | Evidence (VERIFIED) | Why it matters |
|---|---|---|---|
| B1 | REST user enumeration blocked | `/wp-json/wp/v2/users` and `/?rest_route=/wp/v2/users` → 302 to `/` | Denies the standard username-harvest step before credential attacks |
| B2 | Author-archive enumeration blocked | `/?author=1` → 302 to `/`; author archives that exist use **hashed** slugs (`/author/15ef25c842b4a4bf/`) not usernames | Usernames not leaked via author URLs |
| B3 | XML-RPC disabled | `/xmlrpc.php` → 403 | Kills pingback DDoS amplification and `system.multicall` brute-force |
| B4 | Sensitive files blocked | `readme.html`, `license.txt`, `wp-config.php.bak`, `.env`, `.git/config`, `wp-content/debug.log` all → 403 | No version leak via readme; no secret/backup/VCS exposure |
| B5 | Directory listing off | `/wp-content/uploads/` → 403 | No media/upload directory browsing |
| B6 | Form bot protection | Cloudflare Turnstile present in `/wp-login.php` markup and on Contact Form 7 forms | Raises cost of automated login/form abuse |
| B7 | Transport security | HSTS `max-age=31536000` on HTTPS responses; `www` → apex 301 | Enforces HTTPS for returning visitors on the canonical host |
| B8 | First-party script isolation | Home + timetable pages load all 60 `<script src>` from the same origin; third-party JS limited to Turnstile / Google Maps / PayPal on the pages that need them | Small, auditable supply-chain surface |
| B9 | Privacy headers | `Referrer-Policy: strict-origin-when-cross-origin`; scoped `Permissions-Policy` | Limits referrer leakage and private-state-token origins |

---

## RED — attack surface an unauthenticated observer sees

| # | Exposure | Evidence | Attacker use |
|---|---|---|---|
| R1 | **`http://` is not redirected to `https://`** | `http://…/kali/` → **200** (no 301); HSTS header is sent only on the http response, where browsers ignore it | First-visit / HSTS-cold clients are MITM/downgrade-exploitable; a coffee-shop attacker can strip TLS on the initial plaintext hit |
| R2 | **Login page openly reachable** | `/wp-login.php` → 200 | Primary credential-stuffing / brute-force target. Turnstile (B6) raises cost but rate-limiting + lockout are UNKNOWN |
| R3 | **`wp-cron.php` reachable** | `/wp-cron.php` → 200 | Repeated calls can be used to induce load (resource-exhaustion lever), and pseudo-cron timing is unreliable |
| R4 | **Software-version disclosure** | Plugin/theme `?ver=` query strings leak exact versions in page source: WooCommerce 10.7.0, Elementor 8.4.5, CF7 6.1.5, PayPal Payments 4.0.3; `generator` meta leaks Elementor build | Lets an attacker match installed versions to public advisories offline, with zero requests to you |
| R5 | **Version currency vs. known CVEs** | Versions in R4 are VERIFIED; whether each is the latest patched release is **UNKNOWN** from outside | Any unpatched component in this set is the most likely real-world entry point |
| R6 | **Commerce/PII surface** | WooCommerce checkout + PayPal Payments 4.0.3; forms sitewide (CF7) | Payment/PII flow = highest-value target; input-validation and 3-D-Secure posture UNKNOWN |
| R7 | **`admin-ajax.php` reachable** | `/wp-admin/admin-ajax.php` → 400 (expected) | Normal, but every plugin's registered `nopriv` AJAX actions are reachable pre-auth — surface scales with plugin count |

---

## PURPLE — synthesis: technique → control → residual risk → action

Ordered by expected risk (severity × exposure ÷ mitigation).

### P1 — TLS downgrade on first contact  *(HIGH · fix now)*
- **Technique:** SSL-strip / plaintext MITM on the initial `http://` request.
- **Red:** R1 — `http://` serves 200, no redirect.
- **Blue gap:** HSTS exists (B7) but is emitted on the *https* response, so it never protects the *first* plaintext visit or any HSTS-cold client.
- **Action (VERIFIED remediation):** add a top-of-`.htaccess`/LiteSpeed rule
  `RewriteCond %{HTTPS} !=on` → `301 https://%{HTTP_HOST}%{REQUEST_URI}`, keep
  HSTS on https, and add `preload` + `includeSubDomains` then submit to the
  HSTS preload list. *(Already staged as work-order P0-4 in
  `implementation/wp-workorders.sh`.)*
- **Detection:** monitor for 200s on `:80`; alert if any `http://` response is
  non-3xx.

### P2 — Credential attack on the open login  *(HIGH · verify controls)*
- **Technique:** credential stuffing / password spray against `/wp-login.php`.
- **Red:** R2. **Blue:** Turnstile (B6) present; XML-RPC path already closed (B3).
- **Residual (UNKNOWN):** server-side rate-limiting, failed-login lockout, and
  2FA for admin accounts are not externally observable.
- **Action:** confirm a login-lockout / rate-limit control and enforce 2FA on
  all admin/shop-manager accounts; consider moving the login slug or IP-gating
  `/wp-admin`. Keep Turnstile.
- **Detection:** alert on failed-login bursts and logins from new ASNs/countries.

### P3 — Unpatched component exploitation  *(HIGH if any lag · verify)*
- **Technique:** exploit a known CVE in an outdated plugin/theme/core.
- **Red:** R4 discloses exact versions; R5 is the open question.
- **Blue gap:** none observable; this is patch-management hygiene.
- **Action:** run an authenticated WPScan / wp-admin update check; patch any
  component behind latest — prioritise WooCommerce, PayPal Payments, Elementor,
  CF7 (all internet-facing, high-CVE-frequency). Reduce disclosure by stripping
  `?ver=` and the `generator` meta (defence-in-depth; **not** a substitute for
  patching).
- **Detection:** subscribe to the WPScan/vendor advisory feed for the installed set.

### P4 — Commerce / PII abuse  *(MED–HIGH · verify)*
- **Technique:** carding, checkout tampering, form-to-PII harvesting.
- **Red:** R6. **Blue:** Turnstile on forms; PayPal offloads card data (good —
  PAN never touches the site if using PayPal-hosted fields).
- **Residual (UNKNOWN):** 3-D Secure enforcement, checkout rate-limiting,
  cookie `Secure`/`HttpOnly`/`SameSite` flags on cart/session cookies
  (no `Set-Cookie` seen on a cached GET; confirm on an authenticated cart).
- **Action:** confirm cart/session cookies carry `Secure; HttpOnly; SameSite`;
  enable 3-D Secure in PayPal Payments; add checkout velocity limits.
- **Detection:** monitor for gateway decline spikes (carding signature).

### P5 — Pre-auth AJAX & cron load levers  *(LOW–MED · hygiene)*
- **Technique:** abuse `nopriv` AJAX actions or hammer `wp-cron.php` for load.
- **Red:** R3, R7. **Blue:** WAF/Cloudflare edge (Turnstile implies Cloudflare
  in front) likely absorbs volumetric abuse — but WAF ruleset is UNKNOWN.
- **Action:** set `define('DISABLE_WP_CRON', true)` + a real server cron; audit
  which plugins register `wp_ajax_nopriv_*` actions and gate them.
- **Detection:** alert on `wp-cron.php` / `admin-ajax.php` request-rate anomalies.

---

## Explicitly UNKNOWN (needs authenticated/owner access — do not assume)
- Latest-patch status of every plugin/theme/core (P3/R5).
- Login rate-limiting, lockout, and admin 2FA (P2).
- WAF/Cloudflare rule coverage and bot-management tier (P5).
- Session/cart cookie security flags (P4).
- File-integrity monitoring, backup encryption, and DB-user least privilege.
- Whether `wp-config.php` disables the file editor (`DISALLOW_FILE_EDIT`).

## What this analysis did NOT do
No exploitation, no injection/XSS/SQLi probing, no brute-force, no DoS, no
authenticated testing. Confirming the UNKNOWN items requires either owner
access to wp-admin/server or written authorisation for active testing.
