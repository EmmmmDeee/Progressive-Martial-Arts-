# Building the PMAAI site rebuild

Next.js 16 (App Router) + Prisma/SQLite + shadcn. Single `/` route with
client-side hash routing for detail views (see `docs/baseline.md`).

## Toolchain note
`bun install` hangs behind this environment's egress proxy (its TLS does not
trust the proxy CA). Use **npm** with the CA bundle exported:

```bash
export NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt
npm install --no-audit --no-fund
```

## Setup
```bash
cp .env.example .env   # DATABASE_URL="file:./db/custom.db" (resolved by Prisma
                       # relative to prisma/schema.prisma -> prisma/db/custom.db)
npx prisma generate
npx prisma db push --accept-data-loss
npx tsx prisma/seed.ts        # 6 arts, 4 instructors, 8 products, 17 classes, 3 seminars, 6 testimonials
npx tsx prisma/seed-blog.ts   # 6 blog articles
```

## Build & run
```bash
npx next build                # ~13s, 17 static pages + 19 API routes, clean
npx next start -p 3000
```

## Verified (2026-08-22, this environment)
- `next build` compiles clean (0 errors/warnings after `outputFileTracingRoot` pin).
- Browser render: 200, 28 sections, **0 console errors, no hydration mismatch**
  (fixed by `dir="ltr"` on the header NavigationMenu).
- API: GET arts/classes/seminars/instructors/testimonials/products 200 with seeded data.
- Conversion core: POST /api/enroll → 200 "Trial class booked" (DB write); bad input → 400.
- Commerce journey (verified end-to-end): GET /api/products → 8 items; POST /api/orders → 200 with order id; GET /api/orders/{id} → 200 confirmation.

## Canonical database location
Prisma resolves the relative `file:` SQLite URL **relative to `prisma/schema.prisma`**,
so the one canonical DB is `prisma/db/custom.db` — used identically by the CLI
(`db push`, `migrate`) and the runtime `@prisma/client`. Do NOT create or delete a
`db/` at the project root: a split between the two locations produces
`Error code 14: unable to open the database file`. The `.db` files are gitignored;
regenerate them any time with the two seed commands above.
- POST /api/newsletter → 200; /robots.txt, /sitemap.xml → 200.
