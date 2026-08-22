# PMAAI Structural Migration Specification
**Target:** https://progressivemartialarts.com.au/ · **Compiled:** 2026-08-22
**Evidence base:** 488-page archived corpus + same-day recrawls + live HTTP probes of all 27 seed URLs and technical variants. Machine-readable companions: `graph/url-graph.tsv` (492 rows), `graph/migration-map.tsv` (20 rows), `implementation/redirects.htaccess`.
**Evidence classes:** VERIFIED (observed this session) · INFERRED · UNKNOWN (needs owner/authenticated access) · CONTRADICTED.

---

## 1. HIGHEST-VALUE VERIFIED GAPS

Ranked by severity × reach × conversion/crawl impact ÷ migration risk.

| Rank | Gap | Exact URL(s) | Evidence |
|---|---|---|---|
| 1 | **Timetable is a single JPEG** — the entire schedule is one image (`.../2022/10/2026-06-16-PMAAI-Class-Schedule.jpeg`, `alt=""`, unlinked); 0 `<table>`, illegible at 390px (~110px wide). Every program page's primary CTA lands here. Inaccessible, uncrawlable, unlinkable. | https://progressivemartialarts.com.au/timetable/ | VERIFIED |
| 2 | **No acquisition path exists.** No `/start-training/`, `/free-trial/`, `/join/`, `/pricing/` page and no booking widget anywhere. Every program CTA funnels to the overloaded `/contact/`. The only free-trial copy sits on an orphaned legacy homepage. | all `/…program…/`, /contact/, /home-1-boxer/ | VERIFIED |
| 3 | **`/contact/` terminal-state bugs.** Mobile number is `href="tel:tel:0061412400836"` (double scheme, dead on dialers); email `vassiliou@bigpond.com` is plain heading text, not a `mailto:`. The single conversion endpoint partially fails. | https://progressivemartialarts.com.au/contact/ | VERIFIED |
| 4 | **Live page promotes a completed event via a 404 link.** `/professor-jean-jacques-seminar/` (200, dated Apr 2026) sells the past Apr 23-26 seminar with one CTA → `/product/jean-jacques-machado-seminar-brisbane-april-23-26-2026/` → **404**. | those two URLs | VERIFIED |
| 5 | **`http://` is not redirected to HTTPS** (`http://…/kali/` → 200; HSTS emitted only on the https response). First-contact downgrade exposure. | whole host | VERIFIED |
| 6 | **"Affiliate Clubs" nav item → homepage.** `/?page_id=14587` (only non-pretty menu URL, on all 488 pages) 301-redirects to `/` — a named destination resolving to an unrelated page. | https://progressivemartialarts.com.au/?page_id=14587 | VERIFIED |
| 7 | **JKD search-intent collision.** `/jeet-kune-do-concepts/` holds the exact-match title "Jeet Kune Do \| Brisbane" but is a ~300-word dead end (no CTA, 1 body link); `/lee-jun-fan-gung-fu/` is the maintained page. Two URLs compete for one query. | those two URLs | VERIFIED |
| 8 | **"More" hides 54% of navigation** (13 of 24 destinations), including **About** and **Instructors** — the school's primary trust assets. "Arts We Teach" is `href="#"` with no landing page. | / (menu) | VERIFIED |
| 9 | **Instructor identity is not single-sourced.** 6 people spelled two ways across the two directory pages (Georgiou/Georgio, Sulivan/Sullivan, McCulloch/McCullough, Bratty, Shaw, Jr/Junior Vassiliou); interstate certified names listed as Brisbane staff. | /pmaai-instructors-and-support-crew/, /certified-instructors-under-guro-daniel-inosanto/ | VERIFIED |
| 10 | **Two empty galleries indexed + in nav.** `/pictures-master-jean-jacques-machado-seminar-2023/` (0 images, first item in Pictures menu) and the "Wynnum" gallery on `/student-photos/`. | those URLs | VERIFIED |
| 11 | **Homepage overloaded with non-hub duties:** a Louie McHugh memorial with **bank/BSB/PayPal details** in slot #2, three external-business promos (2 sending clicks off-site to Facebook), a raw `[custom-facebook-feed]` shortcode rendering as text, and zero links to any program page. | / | VERIFIED |
| 12 | **Fact contradictions in operational data.** Mini Muscles days: text says "Mon, Wed, Sat"; the grid shows Mon–Sat. Age range: `/mini-muscles/` says 4-10; grid advertises 3-4 and 5-10 bands. | /timetable/, /mini-muscles/ | CONTRADICTED |

---

## 2. CURRENT PRODUCTION URL GRAPH (verified structure)

**Host/transport (VERIFIED):** LiteSpeed; `www`→apex 301; `http://`→**200 (no redirect)**; trailing-slash enforced (`/kali`→301 `/kali/`); case-insensitive (`/KALI/`→200 with correct lowercase canonical); `?utm=`/param variants→200 self-canonical; feeds 403; `?p=14587`→404 but `?page_id=14587`→301 `/`.

**Menu tree (VERIFIED, desktop mega-menu == mobile):**
```
Home /                    Martial Arts Shop /shop/        Timetable /timetable/
Arts We Teach [href="#"]  → Lee Jun Fan Gung Fu /lee-jun-fan-gung-fu/, Kali /kali/,
                            Jeet Kune Do Concepts /jeet-kune-do-concepts/, Maphilindo Silat /silat/,
                            Grappling / BJJ /grappling-bjj/, Muay Thai /muay-thai/
Mini Muscles /mini-muscles/
More [href="#"]           → About/History /pmaai-history/, Visiting Student Information
                            /visiting-student-information/, Ranges /ranges/, Links /links/,
                            Affiliate Clubs /?page_id=14587,
                            Pictures → 6 galleries, Instructors → /pmaai-instructors-and-support-crew/,
                            /certified-instructors-under-guro-daniel-inosanto/
Contact /contact/
```
**Structural facts (VERIFIED):** "Arts We Teach" and "More" are non-navigable containers (`href="#"`). Homepage body links: shop, timetable, 2 seminar products, 8 merch products, 2 sister-business Facebook pages, Progressive Strength — **no program-page links, no /contact/ link**. All 6 galleries + both instructor pages + About are template-nav-only (single editorial inbound link in the entire gallery cluster). Commerce: `/cart/`→404, cart at `/shopping-bag/` (200, noindex), `/checkout/`→302 `/shopping-bag/`. Full 492-URL record with per-URL status/canonical/inbound/outbound: `graph/url-graph.tsv`.

---

## 3. AUTHORITATIVE GAP REGISTER (deduplicated, root-cause)

| GAP-ID | Exact URL(s) | Root cause | Impact | Remediation | Priority |
|---|---|---|---|---|---|
| G-TT-01 | /timetable/ + schedule JPEG | Schedule authored as an image, not data | Inaccessible (WCAG), uncrawlable, unlinkable, illegible on mobile; every program CTA dead-ends | Rebuild as HTML table/accordion; JPEG demoted to printable supplement; class names link to art pages | P1 |
| G-CV-01 | all program pages, /contact/ | No acquisition endpoint; single overloaded contact form (Name/Email/Phone/Message, no purpose field) | Trial, membership, facility-hire, visiting-student intents collide; weak conversion | Create **PROPOSED /start-training/**; add enquiry-type field; program CTAs point to it | P1 |
| G-CV-02 | /contact/ | `tel:tel:` doubled scheme; email as plain text | Tap-to-call fails; no mailto | Fix `href="tel:0061412400836"`; hyperlink email | P0 |
| G-EV-01 | /professor-jean-jacques-seminar/, .../april-23-26-2026/ | Expired product hard-deleted (404) while still linked; post still "upcoming" | Broken conversion link; stale promo | 301 product → /product-category/seminar/; mark post completed; swap link to 2023 photos | P0 |
| G-TLS-01 | whole host | No http→https 301 | First-visit MITM/downgrade | Add `RewriteCond %{HTTPS} !=on` 301 (in `implementation/redirects.htaccess`) | P0 |
| G-NAV-01 | /?page_id=14587 | Unpublished/retargeted page; menu kept the raw ID | Named nav item silently lands on homepage | Publish under /affiliate-clubs/ or remove item; update menu | P1 |
| G-TAX-01 | /jeet-kune-do-concepts/ vs /lee-jun-fan-gung-fu/ | Two pages for one Bruce-Lee-JKD entity; thin page holds the head-term title | SEO cannibalisation; dead-end page | MERGE+301 into /lee-jun-fan-gung-fu/ **iff no separate Concepts class** (UNKNOWN — image timetable); else DIFFERENTIATE + add CTA | P2 |
| G-TAX-02 | /lee-jun-fan-gung-fu/ | "Filipino Kali" anchor links to the page itself | /kali/ loses its only contextual inlink | Rewrite href → /kali/ | P2 |
| G-TAX-03 | /muay-thai/, /grappling-bjj/ | JSON-LD placed in a visible HTML widget, not a `<script>` | Schema renders as page text; no rich-result eligibility | Move to `<script type="application/ld+json">` | P2 |
| G-NAV-02 | / menu | "More" junk-drawer hides About + Instructors; "Arts We Teach" `href="#"` | Trust assets invisible; beginners choose blind among insider terms | Promote About + Instructors top-level; dissolve More; build **PROPOSED /arts-we-teach/** | P1 |
| G-PPL-01 | both instructor pages | No single source of truth for people | 6 name conflicts; non-Brisbane names listed as staff; 6 copy-paste bios, 7 empty | One canonical spelling per person; crew=staff, certified=registry; distinct bios | P2 |
| G-HIS-01 | 6 galleries | Flat siblings in nav; content thin/empty; 100% template-nav inbound | Archive pollution in primary nav; blank pages indexed | Consolidate to 1 hub under About; 301 empty/thin ones (see matrix) | P2 |
| G-HOME-01 | / | Homepage carries memorial+bank details, 3 external promos, dead-end copy, broken shortcode | Dilutes enquiry path; leaks bank details on highest-traffic page; visible defect | Move memorial to **PROPOSED /louie-mchugh/**; sister businesses → /links/; delete shortcode; link program grid | P1 |
| G-DATA-01 | /timetable/, /mini-muscles/, /guro-dan/, /sifu-francis/ | Duplicated mutable facts (days, ages, seminar prices) across image + text + stale posts | Contradictory info; 2022 posts sell expired events with live Buy-now | Reconcile with academy; single owner per fact; archive/redirect 2022 posts | P1 |
| G-SHOP-01 | /shop/, /product-category/dvd/ | 114/237 products (48%) are archive DVDs mixed with active stock and live events | Live seminars buried; catalogue disorganised | Feature Nov-2026 seminars; label DVD category "Seminar Recordings (Archive)" | P3 |
| G-ORPH-01 | /home-1-boxer/, /shop-2/, /latest-news/, /thai-boxing/, hashed /author/* | Legacy duplicates 200+indexable | Duplicate content; dead-CTA landing pages | 410/301 per migration matrix | P2 |

---

## 4. OPTIMAL TARGET INFORMATION ARCHITECTURE

Every top-level answers one verified user intent. **EXISTING** URLs kept for equity; **PROPOSED** only where no owner exists (3 new pages).

```
/ (hub)                         What is PMAAI? → route + convert
├ Training  PROPOSED /arts-we-teach/   What can I train? (overview → 7 programs)
│   ├ /lee-jun-fan-gung-fu/  (JKD primary; absorbs /jeet-kune-do-concepts/ per G-TAX-01)
│   ├ /kali/  /silat/  /grappling-bjj/  /muay-thai/
│   └ Kids /mini-muscles/            What's for my child?
├ /timetable/                   When are classes? (HTML schedule + fees owner)
├ Instructors /pmaai-instructors-and-support-crew/   Who teaches? (+ /certified-…/ as registry)
├ Seminars  PROPOSED /seminars/       What's upcoming? (discovery → product = payment only)
├ About /pmaai-history/          Why trust PMAAI? (history + galleries hub + lineage)
├ /shop/                         Buy gear/recordings
├ /visiting-student-information/ Can I drop in?
├ Start Training  PROPOSED /start-training/   How do I start? (canonical conversion)
└ /contact/                      General enquiry / directions
   demoted from nav: /links/ (+affiliates), /ranges/ (glossary, linked from programs), galleries (under About)
```

---

## 5. TARGET URL GRAPH (dispositions; full table in `graph/url-graph.tsv`)

Counts across 492 URLs: **KEEP 281 · VERIFY 169** (mostly product tags — commerce-data phase) **· MODERNISE 18 · CONSOLIDATE 12 · REMOVE 8 · REDIRECT 4**.

**PROPOSED new URLs (3):**
| PROPOSED URL | Purpose | Intent | Parent | Nav role | Template | Key inbound | Key outbound |
|---|---|---|---|---|---|---|---|
| /start-training/ | Canonical acquisition | "how do I start" | / | Top-level CTA | conversion | every program CTA, hero, timetable | /timetable/, /contact/ |
| /arts-we-teach/ | Programs overview/router | "what can I train" | / | Top-level | archive/hub | header "Training", homepage grid | 7 program pages |
| /seminars/ | Event discovery | "what's upcoming" | / | Top-level/More | event | homepage 2026 block, /latest-news/, /timetable/ | 2 product pages |
| /louie-mchugh/ | Memorial + donation | tribute | /about | none (linked banner) | resource | homepage banner | — |

**Key MODERNISE (keep URL, fix responsibility):** / , /timetable/ , /contact/ , /shop/ , /pmaai-history/ , 6 program pages, /professor-jean-jacques-seminar/ , /pmaai-instructors-and-support-crew/ , /certified-instructors-under-guro-daniel-inosanto/ .

---

## 6. PRIMARY NAVIGATION SPECIFICATION

| Label | Destination | Level | Intent | Justification |
|---|---|---|---|---|
| Home | / | 1 | orient | — |
| Training | PROPOSED /arts-we-teach/ | 1 | discover training | replaces `href="#"`; gives the taxonomy a crawlable parent |
| Timetable | /timetable/ | 1 | when/cost | highest-intent page; kept top-level |
| Kids | /mini-muscles/ | 1 | parent journey | distinct audience; label clarified from insider term |
| Instructors | /pmaai-instructors-and-support-crew/ | 1 | trust | promoted out of "More" (was 54%-hidden) |
| Seminars | PROPOSED /seminars/ | 1 | events | no nav entry exists today for live revenue events |
| Shop | /shop/ | 1 | buy | kept |
| About | /pmaai-history/ | 1 | trust | promoted out of "More"; parents the galleries |
| **Start Training** | PROPOSED /start-training/ | 1 (CTA) | convert | the missing conversion endpoint, visually distinct |
| Contact | /contact/ | 1 | enquiry/directions | kept |

**Removed containers:** "Arts We Teach `#`" → real /arts-we-teach/ page; **"More" dissolved** (children redistributed to About/Training/Seminars). **Demoted from primary nav:** 6 galleries (→ under About), /ranges/ (glossary, body-linked from programs), /links/ + affiliates (→ footer/About). "Affiliate Clubs" raw `?page_id=` item removed until published at a slug.

---

## 7. CANONICAL PAGE-RESPONSIBILITY MAP (one dominant duty per URL)

| Exact URL | Owns | Excludes |
|---|---|---|
| / | Positioning + routing + one shop teaser + map/contact | Memorial+bank details, external-business promos, long program copy, raw shortcode |
| /timetable/ | **Single source of truth for class times, age bands, private-lesson windows** (HTML) | Duplicated day/age text that contradicts the grid; Progressive Strength fees (external) |
| /pmaai-instructors-and-support-crew/ | Who teaches at PMAAI (bios, roles → arts/timetable/contact) | Certification registry duplication; interstate names; commerce |
| /certified-instructors-under-guro-daniel-inosanto/ | Certification/anti-fraud registry (canonical names, regions) | Staff-listing function; being linked as "our instructors" |
| /lee-jun-fan-gung-fu/ | The Bruce Lee JKD program + "jeet kune do brisbane" head term | Self-linking "Kali" anchor; (absorbs Concepts page per G-TAX-01) |
| /pmaai-history/ | About + venue timeline + lineage + galleries hub | Being a bare history page with no CTA |
| PROPOSED /start-training/ | The one acquisition action | — |
| PROPOSED /seminars/ | Event discovery/editorial | Payment (that stays on the product) |
| /product/…-november-2026/ (×2) | Seminar **transaction** only | Being the sole discovery surface |
| /contact/ | General enquiry + directions | Acquisition (→ /start-training/), facility-hire as unlabeled block |

---

## 8. INTERNAL-LINK SPECIFICATION (structurally generated)

| Source | Destination | Context | Purpose |
|---|---|---|---|
| each program page | /timetable/ | "when we train" | close program→schedule loop |
| /timetable/ (each class name) | its program page | schedule row | close schedule→program loop |
| each program page | /pmaai-instructors-and-support-crew/ | "our instructors" | trust (fix /kali/ which points at certified registry) |
| /lee-jun-fan-gung-fu/ "Filipino Kali" | /kali/ | body | fix self-link (G-TAX-02) |
| program pages (ranges sentences) | /ranges/ | glossary | give the orphan a real inbound path |
| / (arts grid) | 7 program pages | homepage section | taxonomy parenting; currently zero |
| / "Mini Muscles" teaser | /mini-muscles/ | homepage | fix unlinked duplicate copy |
| each program CTA | PROPOSED /start-training/ | end-of-page CTA | single conversion funnel |
| /pmaai-history/ lineage ¶ | /photos-of-cookie-with-other-instructors/ | evidence | attach lineage galleries |
| PROPOSED /seminars/ | 2 product pages | "book" | discovery→transaction |
| /professor-jean-jacques-seminar/ | /pictures-master-jean-jacques-machado-seminar-2023/ | recap | replace the 404 link |
| /visiting-student-information/ | /contact/ | CTA | fix stale www/`/contact-us/` link |

---

## 9. USER-JOURNEY VALIDATION (current → target)

| Journey | Current (VERIFIED) | Target |
|---|---|---|
| First-time student | / (no program links, no CTA) → guess menu → program → CTA → /timetable/ (JPEG dead end). **Dead end, ≥3 hops** | / → Training → program → Start Training. **2–3 hops, no dead end** |
| Parent | / Mini Muscles copy **unlinked** → find /mini-muscles/ → /contact/ (generic). Age/day facts contradict grid | / → Kids → /mini-muscles/ (age bands correct) → Start Training |
| Experienced practitioner | / → program → (instructor link points to wrong page) → /timetable/ JPEG → /visiting-student-information/ (**stale www /contact-us/ link**) | program → Instructors → /timetable/ → /visiting-student-information/ → /contact/, all links valid |
| Seminar attendee | Only via homepage block or Shop dig; /professor-…/ → **404**. No /seminars/ | / or Seminars → /seminars/ → product → cart → checkout |
| Existing student | /timetable/ = image, no tap-to-call, no fees | HTML schedule + fees + tel: + seminar banner |

---

## 10. AUTHORITATIVE URL MIGRATION MATRIX (single-hop; machine copy `graph/migration-map.tsv`)

| Current URL | Action | Target | HTTP | Gap |
|---|---|---|---|---|
| http://…/* | 301 | https://…/* | 301 | G-TLS-01 |
| /?page_id=14587 | REDIRECT/REPUBLISH | /affiliate-clubs/ (publish) or remove item | 301/200 | G-NAV-01 |
| /cart/ | 301 | /shopping-bag/ | 301 | plumbing |
| /checkout/ | 301 (was 302) | /shopping-bag/ | 301 | plumbing |
| /product/…machado-seminar-brisbane-april-23-26-2026/ | 301 | /product-category/seminar/ | 301 | G-EV-01 |
| /pictures-master-jean-jacques-machado-seminar-2023/ | REDIRECT (fix-or-301) | /pictures-from-earlier-seminars/ | 301 | G-HIS-01 |
| /historical-pictures-from-various-classes/ | MERGE→301 | /pmaai-history/ | 301 | G-HIS-01 |
| /student-photos/ | MERGE→301 | /pictures-from-earlier-seminars/ | 301 | G-HIS-01 |
| /thai-boxing/ | 301 | /muay-thai/ | 301 | duplicate program |
| /latest-news/ | 301 | /blog/ (or /seminars/) | 301 | duplicate news |
| /jeet-kune-do-concepts/ | MERGE→301 **(conditional)** | /lee-jun-fan-gung-fu/ | 301 | G-TAX-01 |
| /home-1-boxer/, /shop-2/ | REMOVE | — | 410 | G-ORPH-01 |
| /courses/hair-*, /courses/nail-*, /courses/makeup-* | REMOVE | — | 410 | demo remnants |
| /author/15ef25c842b4a4bf/, /author/7afa0b863b49dcc6/ | REMOVE | — | 410 | orphan author archives |
| product tag aliases ×4 | 301 | canonical tag | 301 | commerce dedupe |
| /professor-jean-jacques-seminar/ | MODERNISE (keep) | self | 200 | G-EV-01 |

No target appears as a source (no chains); every removed/redirected URL has exactly one disposition; nothing disappears implicitly.

---

## 11. DEPENDENCY-ORDERED IMPLEMENTATION PLAN

**P0 — correctness (no dependencies):** http→https 301; `/product/…april-23-26-2026/`→301 + de-link the completed-seminar promo; fix `tel:tel:` and email link on /contact/; `/cart/`→/shopping-bag/. *(All in `implementation/redirects.htaccess` + `implementation/wp-workorders.sh`.)*
**P1 — structural blockage (depends on P0 routing):** rebuild /timetable/ as HTML (owns times/ages/private-lesson facts) → build PROPOSED /start-training/ → repoint program CTAs → build PROPOSED /arts-we-teach/ + link homepage program grid → dissolve "More", promote About/Instructors/Seminars → move memorial to /louie-mchugh/, delete `[custom-facebook-feed]` shortcode → reconcile Mini Muscles days/ages with the academy.
**P2 — systemic debt (depends on canonical owners from P1):** JKD merge decision (needs class-existence answer); fix self-link + JSON-LD `<script>` on program pages; single-source instructor names, split crew/registry duties; consolidate 6 galleries → hub, 301 empty/thin; archive 2022 seminar posts.
**P3 — discovery/maintainability:** feature Nov-2026 seminars + label DVD archive; product-tag fragmentation review (needs sales data); demote /links/, rename /ranges/ label.

**Blocking UNKNOWNs (owner input):** does a separate JKD-Concepts class run (gates G-TAX-01)? Are regular fees meant to be public (the JPEG header promises a "PRICE LIST" that isn't there)? Correct Mini Muscles days/ages? Live status of `?page_id=14587`, `/contact-us/`, the 2022 www product URLs, and the Dec-2025 homepage screenshot widget.

---

## 12. ADVERSARIAL VALIDATION RESULTS (attacks on the target graph)

- **Chains:** http→https then a path 301 = two hops for legacy `http://` deep links. *Accepted* — unavoidable and both are 301; alternative (per-path https rules) multiplies rules. No `301→301` within the path set (verified: no migration target is also a source).
- **JKD cannibalisation after merge:** folding /jeet-kune-do-concepts/ risks losing the exact-match "Jeet Kune Do \| Brisbane" title. *Mitigation:* the surviving /lee-jun-fan-gung-fu/ adopts a "Jeet Kune Do (JKD)" H2 + title treatment. **Conditional** on the class-existence UNKNOWN — do not merge blind.
- **Gallery 301s → orphaned inbound:** safe — inbound to all galleries is 100% template-nav (one editorial link excepted, which is preserved by keeping /pictures-from-earlier-seminars/ as the hub).
- **/seminars/ vs product cannibalisation:** discovery page and product target the same event. *Mitigation:* /seminars/ canonical self, product canonical self, product excluded from the informational query by intent (transactional title). Post-event, product 301s to /seminars/ recap — no lingering 404 (fixes the pattern that produced G-EV-01).
- **Removing "More" → lost destinations:** each child re-homed (verified 1:1 in matrix); none dropped.
- **/ranges/ demotion → orphan:** prevented by the new program-body inbound links (§8).
- **Event lifecycle:** defined — live (published, capacity-capped, linked from /seminars/) → over (unpublish + 301 to recap). Diarised 2026-11-27 for the two Nov products.

Residual defects fed back into the register: none new above P3.

---

## 13. FIXED-POINT VERDICT

**Not yet a fixed point** — but every residual is an explicit owner-input UNKNOWN, not an unresolved analysis gap. Achieved: every one of the 492 discovered URLs has a disposition; every retained URL a single canonical owner and dominant responsibility; the timetable named as the single schedule/fees owner; deterministic single-hop redirects with no chains/loops within the path set; navigation realigned to the 12 verified user intents; the 5 critical journeys reduced and de-dead-ended; instructor/event/gallery responsibilities separated; internal links generated from entity relationships.

**Blocking the fixed point (all UNKNOWN, need owner/authenticated access):** JKD class existence; whether fees are public; correct Mini Muscles days/ages; live status of `?page_id=14587`, `/contact-us/`, the 2022 www products, and the Dec-2025 homepage screenshot. These are listed, not silently assumed. **No admissible structural change with positive expected value remains that does not depend on one of these answers or on production write access.**
