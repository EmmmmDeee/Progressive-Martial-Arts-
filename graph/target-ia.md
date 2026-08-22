# Target information architecture & navigation

Principle: preserve equity-bearing flat URLs; add hubs, not churn.

## Primary navigation (from user intent, replaces 25-item menu)
1. **Training** → `/training/` hub → 7 program pages (existing URLs)
2. **Timetable** → `/timetable/`
3. **Kids** → `/mini-muscles/` (label "Kids — Mini Muscles")
4. **Instructors** → `/pmaai-instructors-and-support-crew/`
5. **Seminars** → seminar/event index (JJ Machado 2026 now; galleries as archive)
6. **Shop** → `/shop/`
7. **About** → `/pmaai-history/` (+ Visiting Student Info, Ranges, Links/Affiliates, Certified Instructors)
8. **START TRAINING** (CTA, visually distinct) → `/start-training/` (new)

## Leaves primary nav (still reachable, one hub each)
- 6 photo galleries → "Archive" index under About/Seminars
- Ranges, Links, Affiliate Clubs, Certified Instructors → under About
- Blog stays footer/About level; `/latest-news/` 301 → `/blog/`

## New routes (3 only)
- `/training/` — program hub (no content dup: cards derived from program entities)
- `/start-training/` — canonical acquisition endpoint (form → validation → delivery → confirmation)
- `/seminars/` — event index with lifecycle states

## Journey contracts to prove after implementation
HOME → TRAINING → PROGRAM → TIMETABLE → START-TRAINING (≤4 clicks)
HOME → TIMETABLE → PROGRAM → START-TRAINING
HOME → KIDS → START-TRAINING
EVENT → REGISTRATION (currently broken: P0)
SHOP → PRODUCT → CART(/shopping-bag/) → CHECKOUT → CONFIRMATION
