# PMAAI canonical entity model

One mutable fact → one authoritative owner → many derived views.

## Entities and canonical routes

| Entity | Canonical instance(s) | Route ownership |
|---|---|---|
| ACADEMY | PMAAI, 180 New Cleveland Rd Tingalpa QLD 4173, (07) 3393 9329 / 0412 400 836 | address/contact owned once, rendered into footer, contact, schema |
| PROGRAM | Kali · Jeet Kune Do Concepts · Lee Jun Fan Gung Fu · Maphilindo Silat · Grappling/BJJ · Muay Thai · Mini Muscles (kids) | existing flat URLs kept (search equity); `/training/` added as hub |
| DISCIPLINE (subtypes) | Grappling/BJJ ⊃ {Machado BJJ, Inosanto grappling/Dumog, Jun Fan Grappling, CSW/Shoot Wrestling} | subdiscipline sections of the one program page, never separate routes |
| TIMETABLE ENTRY | one structured dataset | owns every schedule render (today/week/audience/discipline views) |
| INSTRUCTOR | people graph; roles: PRINCIPAL / CURRENT / SUPPORT / ADMIN / HISTORICAL / CERTIFIED-UNDER-INOSANTO | directory page + profile URLs only where durable content exists (Guro Dan, Sifu Francis posts re-homed) |
| EVENT | lifecycle UPCOMING→CURRENT→COMPLETED→ARCHIVED; e.g. JJ Machado seminar Apr 2026 | event page owns date/status; registration = linked PRODUCT |
| MEDIA | 6 galleries, event-tagged | keep URLs; indexed from one archive hub, out of primary nav |
| PRODUCT / CATEGORY | 237 products; tags deduplicated (4 alias merges) | WooCommerce; archive DVD stock to be separated from active stock with order data |
| ENQUIRY | START TRAINING (acquisition) ≠ GENERAL CONTACT | `/start-training/` (new) vs `/contact/` |
| HISTORICAL RECORD | PMAAI History, Ranges article, blog | `/pmaai-history/` (= About), `/ranges/` reclassified reference |

## Resolved taxonomy questions (evidence in baseline/html/)

- **JKD Concepts ↔ Jun Fan**: DISTINCT ENTITIES. `/jeet-kune-do-concepts/` = concepts/philosophy curriculum; `/lee-jun-fan-gung-fu/` = the specific Bruce Lee system (trapping/kicking core). Related siblings, cross-linked, never merged.
- **BJJ ↔ Grappling ↔ CSW ↔ Shoot Wrestling**: ONE canonical program (`/grappling-bjj/`); the page itself names Machado BJJ, Inosanto blend, Jun Fan Grappling, CSW as its sources → SUBTYPES.
- **Thai Boxing ↔ Muay Thai**: DUPLICATE. `/thai-boxing/` is a legacy copy → 301 to `/muay-thai/`.
- **Current ↔ Certified instructor**: DISTINCT RELATIONSHIPS. Roster (works here now) vs certification record (recognised by Guro Inosanto). Two pages retained, cross-referenced through the people graph.
- **Ranges**: not a PROGRAM — reference article; leaves "Arts We Teach" nav.
- Commerce tag aliases: muay-thai-thai-boxing→muay-thai, jun-fan-gung-fu-jkd & jeet-kune-do→jun-fan-gung-fu, pentjak-silat→pencak-silat (bersilat / pencak / mande-muda kept: distinct arts).

## Relationship map (drives structural internal linking)

PROGRAM↔TIMETABLE, PROGRAM↔INSTRUCTOR, INSTRUCTOR↔CLASS, INSTRUCTOR↔EVENT,
EVENT↔DISCIPLINE, EVENT↔MEDIA, EVENT↔PRODUCT (registration), HISTORY↔PEOPLE,
HISTORY↔MEDIA, PRODUCT↔CATEGORY, PROGRAM↔RELEVANT PRODUCT (e.g. Kali page ↔ kali sticks/DVDs).
