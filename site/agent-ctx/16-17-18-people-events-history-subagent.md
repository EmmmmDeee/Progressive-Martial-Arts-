# Task ID: 16-17-18 — People, Events, History Subagent

**Agent**: people-events-history-subagent
**Scope**: Build instructor pages + events lifecycle + history timeline (5 client components).

## Work Log

### Files created
1. `/home/z/my-project/src/components/site/instructors-page.tsx` — Index of all instructors with discipline filter pills, card grid, quote banner.
2. `/home/z/my-project/src/components/site/instructor-detail.tsx` — Single instructor page: hero portrait + name/role/specialty/certs/quote/socials, long bio, disciplines taught (links to programs), classes grouped by day, upcoming seminars, CTA.
3. `/home/z/my-project/src/components/site/events-page.tsx` — Events index with Upcoming | Past Events | Archive lifecycle Tabs, featured banner with Progress + Reserve CTA, status-aware grid with Progress bars and status badges, empty state per tab.
4. `/home/z/my-project/src/components/site/event-detail.tsx` — Single seminar page: hero with image + status badge + key facts table + spots Progress, ICS calendar download (Blob URL → anchor click), instructor card link, discipline art link, past-event notice with gallery link, related upcoming events strip.
5. `/home/z/my-project/src/components/site/history-page.tsx` — History & Lineage page: vertical timeline (8 milestones 1989→2026, alternating left/right on desktop), lineage tree (Bruce Lee → Inosanto + Fong; Carlos Gracie → Machado brothers), historical media gallery from `/api/media?category=historical`, quote/CTA banner.

### Key decisions
- **Routing**: Used `useRouter()` from `@/lib/router` + `RouteLink`-style navigation via `navigate({ name: "instructor"|"event"|"program", slug })`. Breadcrumbs use `<a href="#/...">` hash links which the router's `hashchange` listener picks up.
- **Type safety**: Defined `InstructorWithRelations` (instructor + `.classes?` + `.events?`) and `SeminarWithRelations` (seminar + `.art?` + `.instructor?`) extending the base types from `@/lib/data`.
- **Lint compliance**: Refactored `instructor-detail` and `event-detail` to use the `loadedSlug` pattern (matching `program-detail.tsx`) instead of synchronous `setState` at the start of `useEffect`. The Next.js 16 lint rule "Calling setState synchronously within an effect" now passes for all 5 files.
- **Accessibility**: All clickable cards use `role="button" tabIndex={0}` with `onKeyDown` Enter/Space handlers, plus `aria-label` on icon-only buttons, `sr-only` text in icon nav, `aria-selected` on filter pills, `role="tablist"`/`role="tab"` for filter group.
- **ICS download**: Built pure client-side. Generates VEVENT with DTSTART/DTEND (UTC), escapes commas/newlines in SUMMARY/DESCRIPTION/LOCATION, creates Blob (`text/calendar;charset=utf-8`), `URL.createObjectURL`, dynamically injected anchor with `download`, click, then revoke. `sonner` toast confirms download.
- **Status badges**: STATUS_META map for seminar statuses (upcoming/current/completed/archived) with color-coded badges — emerald for upcoming, crimson for current, gold for completed, secondary for archived.
- **Past event UX**: If seminar status is `completed` or `archived`, hides Reserve CTA, shows AlertCircle "Past event" notice with optional galleryUrl link.
- **Lineage tree**: Two root→branch groups rendered as root node (Flame icon in primary circle) + vertical connector + 2-col branch grid. Pure CSS/Tailwind, no external diagram library.
- **Timeline**: Center line on desktop (sm:left-1/2), left line on mobile. Alternating cards left/right with ping-animated dots. Highlighted milestones (founding, Inosanto seminar, 2026 dual seminar) get accent-colored dots and primary border.

### APIs used
- `GET /api/instructors` (index list)
- `GET /api/instructors/:id` (detail with classes + events relations)
- `GET /api/seminars` (list with status/featured)
- `GET /api/seminars/:id` (detail with art + instructor relations)
- `GET /api/arts` (disciplines for filter + cross-links)
- `GET /api/media?category=historical` (gallery for history page)

### Type-check results
- `bunx tsc --noEmit` — 0 errors in any of the 5 new files (other unrelated example/skill files have pre-existing errors).
- `bun run lint` — 0 errors in any of the 5 new files after the loadedSlug refactor.

### Integration notes for orchestrator
- These components receive a `slug` prop (for `InstructorDetail` and `EventDetail`) — page.tsx wiring should extract the slug from `useRouter().route` and pass it in. Alternatively use the `useRouteSlug()` helper exported from `@/lib/router`.
- `InstructorsPage`, `EventsPage`, `HistoryPage` take no props.
- All 5 components assume the page wrapper has `<Header />` above and `<Footer />` below (which already provide sticky footer via `flex-col + mt-auto` on root).
