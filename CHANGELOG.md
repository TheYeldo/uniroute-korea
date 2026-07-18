# Changelog

All notable changes are documented here. This project follows semantic versioning after the first stable release.

## [0.1.0] — 2026-07-19

### Added

- Next.js App Router foundation with strict TypeScript, Tailwind CSS, shadcn/ui, and restrained responsive themes.
- Complete Russian and English routing, content, metadata, validation, empty, error, and accessibility labels.
- Ten source-aware South Korean university records, ten program records, scholarships, verified current deadlines, and ten public guides.
- Search, filters, sorting, profiles, source states, comparison, share URLs, and saved comparison state.
- Supabase authentication flows, lazy server/browser clients, safe redirects, and account deletion endpoint.
- Onboarding, dashboard, shortlist, readiness, recommendations, roadmap, document tracker, calendar, Markdown notes, notifications, and settings.
- Guest-mode persistence, personal-data export, and guest-to-account upsert migration path.
- Normalized PostgreSQL schema, indexes, public/personal RLS policies, profile trigger, and seed migration.
- Robots rules, sitemap, localized metadata, canonical routes, breadcrumbs, and JSON-LD university data.
- Unit tests for recommendation, readiness, date, filter, validation, formatting, and access-control logic.

### Security and privacy

- Personal database rows are owner-restricted with RLS.
- Sensitive document uploads are intentionally excluded; the MVP stores metadata only.
- Service-role access is isolated to a server-only account deletion route.

### Known limitations

- Supabase must be configured by the deployer for real authentication and cloud persistence.
- Multi-device hydration and conflict resolution are not implemented yet.
- The editorial catalog is deliberately small and several records remain partial where official data is unavailable.
