# PMAAI — Migration Baseline & Roadmap (Stages 1-3)

> Reference plan: 33-stage enterprise migration methodology. This document
> captures the PRESERVE/DISCOVER baseline (Stages 1-2) and the protected
> invariants (Stage 3) that govern every subsequent stage.

## 1. PRESERVE — Baseline Snapshot (v1.0)

**Captured:** 2026-08-22, dev server PID 2729, Next.js 16.1.3 (Turbopack)

### Production-equivalent state
- Framework: Next.js 16 App Router, single `/` route (constraint: only `/` is user-visible)
- Render: SSR + client hydration, Turbopack
- DB: Prisma + SQLite (`db/custom.db`)
- Theme: dark (charcoal `oklch(0.14 0.005 50)` + crimson primary `oklch(0.58 0.24 27)` + gold accent `oklch(0.78 0.14 75)`)

### Performance baseline (localhost, warm)
| Metric | Value |
|---|---|
| Load time (loadEventEnd) | 1,464 ms |
| DOMContentLoaded | 1,437 ms |
| Resources fetched | 29 |
| Transfer size | 1,085,637 B (~1.06 MB) |
| Body height | 11,877 px |
| Sections | 11 |
| Images on page | 32 |
| Headings (h1-h3) | 37 |
| Forms | 2 |
| Links | 42 |
| Snapshot baseline screenshot | `/tmp/baseline-full.png` (5.2 MB full-page) |

### Database state (seeded)
| Model | Count |
|---|---|
| ArtDiscipline | 6 |
| Instructor | 4 |
| Product | 8 |
| ClassSchedule | 17 |
| Seminar | 3 |
| Testimonial | 6 |
| TrialEnrollment | 1 (test) |
| ContactMessage | 0 |
| NewsletterSub | 0 |

### Media assets (generated, `/public/images/`)
20 AI-generated images (~3.1 MB): hero-bg, 6 art portraits, 2 programs, seminar, about, 4 instructors, 3 student avatars, cta-bg, emblem.

### URLs / routes (current)
- `/` — single page (all sections anchored via `#about`, `#arts`, `#programs`, `#timetable`, `#instructors`, `#shop`, `#seminars`, `#contact`)
- `/api/*` — 9 API routes (arts, classes, contact, enroll, instructors, newsletter, products, seminars, testimonials)

### API endpoints (functional, zod-validated)
GET/POST `/api/contact`, `/api/enroll`, `/api/newsletter`; GET `/api/products`, `/api/classes`, `/api/instructors`, `/api/testimonials`, `/api/seminars`, `/api/arts`.

## 2. DISCOVER + MAP — Inventory (current v1 surface)

### Page sections (canonical anchors)
1. `#top` Hero — CTA, stats, rating
2. (marquee) — discipline ticker
3. `#about` About — lineage, 3 pillars
4. `#arts` Arts We Teach — 6 disciplines grid
5. `#programs` Programs — Progressive Strength + Mini Muscles
6. `#shop` Shop — 8 products
7. `#timetable` Timetable — day-tab interactive
8. `#instructors` Instructors — 4 portraits + quote
9. `#seminars` Seminars — featured + list
10. `#testimonials` Testimonials — 6 stories
11. `#contact` Contact — enquiry + trial booking forms
12. Footer — newsletter, contact, social

### Content types present
- Disciplines, People (instructors), Schedule, Events, Commerce (products), Social proof (testimonials), Leads (contact/enroll), Subscribers.

## 3. LOCK MIGRATION INVARIANTS — Protected Assets

| Invariant | Protection rule |
|---|---|
| `/` route only | No new page routes; detail views via client-side hash router |
| Brand identity | PMAAI name, (07) 3393 9329, 180 New Cleveland Rd Tingalpa QLD 4173 |
| Inosanto lineage | "Guro Dan Inosanto / Inosanto Academy" attribution preserved |
| Discipline set | Muay Thai, BJJ, Kali, JKD, Maphilindo Silat, Jun Fan Gung Fu |
| Kids program | "Mini Muscles" name preserved |
| 24/7 gym | "Progressive Strength" name preserved |
| Established 1989 | Heritage claim preserved |
| Anchor URLs | `#about #arts #programs #timetable #instructors #shop #seminars #contact` remain valid |
| API contracts | Existing 9 API routes keep their shape; additive changes only |
| Theme tokens | dark/charcoal + crimson + gold remain the brand palette |
| Data continuity | existing seeded records preserved across schema migrations (additive cols only) |

## 33-Stage Roadmap Status

**This turn executes Stages 5-13, 15, 16, 18, 20-21, 25.** Stages 14, 17, 19, 22-24, 26-33 are deferred to the recurring 15-min webDevReview cron (job 332437).

| # | Stage | Status |
|---|---|---|
| 1 | PRESERVE | done |
| 2 | DISCOVER | done |
| 3 | PROTECT invariants | done |
| 4 | CORRECT + NORMALISE | in-flight |
| 5 | ARCHITECT | this turn |
| 6 | MODEL structured data | this turn |
| 7 | DESIGN system | this turn |
| 8 | BUILD design system | this turn |
| 9 | SHELL global | this turn |
| 10 | CONVERSION core | this turn |
| 11 | TIMETABLE core | this turn |
| 12 | PROVE program | this turn |
| 13 | MIGRATE programs | this turn |
| 14 | KIDS + TEENS | deferred → cron |
| 15 | HOMEPAGE compose | this turn |
| 16 | PEOPLE unify | this turn |
| 17 | HISTORY + LINEAGE | deferred → cron |
| 18 | EVENTS lifecycle | this turn |
| 19 | MEDIA galleries | deferred → cron |
| 20 | COMMERCE data | this turn |
| 21 | COMMERCE UX | this turn |
| 22 | ELIMINATE legacy | deferred → cron |
| 23 | EDITORIAL unify | deferred → cron |
| 24 | CONNECT graph | deferred → cron |
| 25 | SEO + local | this turn |
| 26 | ACCESSIBILITY | partial → cron |
| 27 | PERFORMANCE | deferred → cron |
| 28 | VISUAL QA | deferred → cron |
| 29 | FUNCTIONAL QA | deferred → cron |
| 30 | ELEVATE whole | deferred → cron |
| 31 | PROVE complete | deferred → cron |
| 32 | RELEASE | deferred → cron |
| 33 | MEASURE | deferred → cron |
