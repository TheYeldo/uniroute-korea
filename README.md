# UniRoute Korea

A personalized university admission planner for international students applying to South Korea.

UniRoute Korea is a bilingual discovery and planning product for school students and recent graduates from Kazakhstan and other Russian-speaking countries. It combines a source-aware university catalog with a personal dashboard, shortlist, comparison, roadmap, document tracker, deadline calendar, scholarship directory, notes, and transparent admission-readiness analysis.

The application never predicts admission or scholarship success. It separates official requirements, recommendations, estimates, missing information, and dates that still require verification.

## Product scope

The first release supports South Korea only and includes:

- Russian-first and complete English interfaces through `next-intl`;
- a public catalog of 10 South Korean universities and 10 structured program records;
- official/government source references, checked dates, academic-year labels, and explicit missing-data states;
- public university profiles, program catalog, scholarships, comparison, and 10 practical guides;
- email/password, magic-link, Google-ready, reset, verification, logout, and deletion flows with Supabase Auth;
- guest mode with local persistence and compatible guest-data migration after authentication;
- six-part onboarding for academics, languages, study preferences, finances, and priorities;
- a dashboard, shortlist, private Markdown notes, and saved comparisons;
- a generated roadmap with list, timeline, and calendar views;
- a metadata-only document tracker—sensitive document uploads are intentionally excluded;
- a localized deadline calendar with Asia/Seoul labels, filters, personal dates, and `.ics` export;
- deterministic recommendations and explainable readiness categories without admission probabilities;
- notification preferences, theme/timezone/currency/date settings, data export, and privacy controls;
- normalized PostgreSQL migrations, indexes, Row Level Security, and seed records.

## Stack

- Next.js 16 App Router, React 19, strict TypeScript
- Tailwind CSS 4 and shadcn/ui primitives
- Motion for restrained interface transitions
- Supabase PostgreSQL, Authentication, SSR client utilities, and RLS
- next-intl, TanStack Query, React Hook Form, Zod, date-fns
- Lucide React, next-themes, React Markdown, Sonner
- Vitest, ESLint, and Prettier

## Local setup

Requirements: Node.js 22 or newer and npm 10 or newer.

```bash
git clone https://github.com/TheYeldo/uniroute-korea.git
cd uniroute-korea
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The first request is redirected to `/ru`; a previous locale choice is preserved by the localization cookie.

Public pages and all guest-mode planning tools work without Supabase credentials. Authentication and cloud persistence require a Supabase project.

## Environment variables

| Variable                          | Exposure                          | Required              | Purpose                                                    |
| --------------------------------- | --------------------------------- | --------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Browser-safe project URL          | For auth/cloud sync   | Supabase project URL                                       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Browser-safe publishable/anon key | For auth/cloud sync   | RLS-constrained client access                              |
| `NEXT_PUBLIC_SITE_URL`            | Public                            | Recommended           | Canonical URL, metadata, sitemap                           |
| `SUPABASE_SERVICE_ROLE_KEY`       | Server only                       | Account deletion only | Deletes the authenticated account through the server route |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | Public boolean                    | No                    | Shows Google sign-in after the provider is configured      |

Never expose the service-role key with a `NEXT_PUBLIC_` prefix. Do not commit `.env.local`.

## Supabase setup

1. Create a Supabase project and copy `.env.example` to `.env.local`.
2. Apply the migrations in order:

   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   ```

   Alternatively, execute `supabase/migrations/0001_initial_schema.sql` and then `0002_seed_public_data.sql` in the SQL editor.

3. In Authentication → URL Configuration, set the local site URL to `http://localhost:3000` and allow `http://localhost:3000/**` as a redirect URL.
4. For production, add `https://YOUR_DOMAIN/**` and use that domain as the site URL.
5. Keep email confirmation enabled. Configure SMTP for reliable production delivery.
6. Optional: enable Google in Supabase Auth, configure its OAuth credentials, then set `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true`.

The schema creates profiles and notification preferences after signup. Public reference data is readable by anonymous users. Personal rows are restricted to `auth.uid()` by RLS. See [DATABASE.md](./DATABASE.md).

## Commands

```bash
npm run dev             # local development
npm run lint            # ESLint with zero warnings
npm run typecheck       # strict TypeScript check
npm test                # unit tests
npm run test:coverage   # coverage report
npm run format:check    # Prettier verification
npm run build           # optimized production build
npm run check           # lint + types + tests + build
```

## Architecture

```text
src/
├── app/
│   ├── [locale]/
│   │   ├── (public)/       # landing, catalog, profiles, guides
│   │   ├── (auth)/         # authentication and recovery
│   │   └── (app)/          # dashboard and personal planning tools
│   └── api/account/        # authenticated account deletion
├── components/             # feature and reusable UI components
├── data/                   # reviewed TypeScript reference data
├── i18n/                   # next-intl routing/navigation/request config
├── lib/
│   ├── recommendations/    # deterministic matching
│   ├── readiness/          # explainable readiness evaluation
│   ├── supabase/           # lazy browser/server/admin clients
│   ├── universities/       # filters and catalog helpers
│   ├── validation/         # Zod schemas and safe redirects
│   └── formatting/         # dates and money
├── messages/               # complete ru/en interface messages
└── types/                  # domain and database types

supabase/migrations/        # PostgreSQL schema, RLS, indexes, seed data
```

Server Components render public content and metadata. Client components are limited to interactive filters, local/cloud personal state, forms, and planners. Public data is maintained in typed source files for reviewability and mirrored by an idempotent normalized SQL seed; the PostgreSQL schema is ready for a protected administration workflow.

## Recommendation logic

`src/lib/recommendations/engine.ts` checks the requested degree and major, instruction language, city, university type, annual tuition budget, and scholarship dependency. It produces:

- a qualitative status: strong, possible, trade-off, or insufficient data;
- matched criteria;
- mismatches;
- unknown data;
- trade-offs.

An internal integer orders results, but it is never presented as an admission probability. Major/degree/language compatibility has more weight than preference-only criteria. Missing tuition or language data remains unknown instead of becoming zero or “not required.”

## Readiness logic

`src/lib/readiness/evaluate.ts` evaluates academics, graduation timing, English, Korean, budget, scholarship dependency, document state, deadline risk, and program compatibility. Every result contains a status, a reason, and—when useful—an action. It preserves the difference between an official minimum and a recommended score.

The evaluator is organizational guidance. It does not replace an admissions office and never asserts eligibility, admission, or scholarship selection.

## Data workflow

Reference records live in `src/data` and contain source IDs. Each source includes an organization, URL, checked date, source type, optional academic year, and limitation note. Only future, still-current official dates are displayed as active deadlines.

To add or update a record:

1. start with an official university, NIIED/Study in Korea, or government page;
2. record the exact URL, academic cycle, and check date in `sources.ts`;
3. encode only claims supported by that source;
4. use `null`, `varies`, or an unconfirmed status when the value is unavailable;
5. update the database seed if the record belongs in hosted public data;
6. add or update tests and [DATA_SOURCES.md](./DATA_SOURCES.md);
7. run `npm run check`.

## Localization

Russian is the default locale and English is secondary. Locale-aware routes use `/ru` and `/en`. Navigation helpers live in `src/i18n`; user-facing messages live in `src/messages/ru.json` and `en.json`. Data records use bilingual fields where translation is appropriate. Korean names, official program names, and test names remain original where accuracy benefits.

To add Kazakh later, add the locale to `routing.ts`, create a complete `kk.json`, translate bilingual data fields, and extend static params and metadata. Do not expose a partially translated locale.

## Privacy and security

- Personal PostgreSQL tables use RLS and an authenticated user identifier.
- Public browser code receives only the Supabase anon key; the service role stays server-side.
- Account deletion revalidates the session on the server before using the admin API.
- Redirect targets are validated to same-origin application paths.
- The MVP stores document metadata only—no passport scans, bank data, or precise home address.
- Guest data remains in the current browser until exported or cleared.
- Email reminders are disabled by default and require explicit consent.

Review [PRIVACY.md](./PRIVACY.md) before operating a public instance. A production operator should also configure SMTP, abuse controls, logs/retention, backups, and a jurisdiction-specific privacy policy.

## Deployment

1. Import the GitHub repository into Vercel or run `vercel` from the project root.
2. Add the public Supabase variables for Preview and Production.
3. Add `SUPABASE_SERVICE_ROLE_KEY` only as a protected server-side variable if account deletion is enabled.
4. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
5. add the production callback origin in Supabase Auth;
6. run `npm run check`, deploy, and verify `/ru`, `/en`, public profiles, guest tools, and real authentication.

Private workspaces are excluded in `robots.txt`; public university and guide pages provide localized metadata, canonical routes, sitemap entries, breadcrumbs, and structured university data.

## Current limitations

- The curated scope is 10 universities and a small program/scholarship set, not the entire Korean sector.
- Several universities deliberately show partial or unconfirmed values because a current official source did not provide a safe universal figure.
- Only three future deadlines were current and sufficiently verified on the data check date.
- Public pages currently read the typed editorial dataset at build time; database-backed catalog administration and runtime pagination are prepared by the schema but are not enabled yet.
- Cloud sync is a guest-data upsert path in this release; full multi-device hydration/conflict resolution is a next step.
- Document file uploads and email reminders are not enabled.
- Local Supabase migrations and cross-user RLS isolation have been verified; hosted auth delivery, Google OAuth, and production callback behavior still require a configured Supabase project.
- Visa/legal information is general guidance and must be confirmed with official authorities.

## Roadmap

1. Add an authenticated data-admin workflow and stale-record review queue.
2. Hydrate personal state from Supabase and add conflict-safe offline synchronization.
3. Expand verified program-level data, costs, scholarships, and future cycles.
4. Add integration tests against disposable Supabase projects and browser E2E coverage.
5. Add consent-based reminder delivery and secure private storage only after a privacy review.
6. Add Kazakh only when a complete translation and content review are available.

## Contributing and license

See [CONTRIBUTING.md](./CONTRIBUTING.md), [DATA_SOURCES.md](./DATA_SOURCES.md), and [CHANGELOG.md](./CHANGELOG.md). The code is available under the [MIT License](./LICENSE). Admission data retains the terms of its original official sources.
