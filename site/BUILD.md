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
echo 'DATABASE_URL="file:./db/custom.db"' > .env
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
- POST /api/newsletter → 200; /robots.txt, /sitemap.xml → 200.
