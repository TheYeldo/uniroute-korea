# Privacy notice and implementation notes

Last updated: 2026-07-19

UniRoute Korea is an organizational and informational tool. It is not a university, government service, admissions agent, visa authority, or guarantee of admission or funding.

This repository provides a baseline privacy design. The operator of a deployed instance is responsible for publishing legally appropriate contact, controller, retention, subprocessors, and jurisdiction-specific terms before collecting real user data.

## Data the application uses

The optional student profile may include:

- country, city, school grade, expected graduation year, and age range;
- approximate grades, subjects, activities, and achievements;
- language levels and optional IELTS, TOEFL, or TOPIK scores;
- degree, major, city, language, intake, and university preferences;
- broad tuition/living budgets and scholarship dependency;
- shortlist, roadmap, document metadata, deadlines, comparison choices, settings, and personal notes;
- email address and authentication metadata when an account is created.

The product does not ask for passport numbers, bank details, a precise home address, or identity-document scans.

## Guest mode

Guest planning data is stored in the browser’s `localStorage` under `uniroute-korea:personal-data:v1`. It is not sent to Supabase until the user authenticates and compatible data is upserted. Anyone with access to the same unlocked browser profile may be able to read guest data.

Users can export or clear guest data in Settings. Clearing site storage in the browser also removes it.

## Account mode

With Supabase configured, authentication is processed by the selected Supabase project. Personal rows are stored in PostgreSQL and protected with Row Level Security based on the authenticated user ID. The browser receives only the public anon/publishable key.

Current cloud synchronization pushes compatible local records after authentication. Full server-to-device hydration and conflict resolution are not part of this release, so users should export important planning data before switching devices.

## Documents and files

The MVP stores only document names, status, dates, notes, relationships, and whether translation/notarization/apostille may be needed. File upload state is fixed to `metadata-only`; no private storage bucket is included.

Do not upload or paste passport scans, financial statements, identity numbers, or other sensitive records into notes. A future upload feature must use private Supabase Storage, storage RLS, signed URLs, file validation, retention controls, malware scanning, and a separate security/privacy review.

## Email and notifications

In-app reminders can be enabled in Settings. Email reminders are off by default and the current release does not send reminder emails. Authentication providers may send verification, magic-link, and password-reset messages when explicitly requested.

## Sources and outbound links

Public catalog data links to university/government websites. Those sites have their own privacy policies and may receive standard browser request information when opened.

## Retention, export, and deletion

- Guest data remains until cleared by the user/browser.
- Account data remains in the configured Supabase project until deleted under the operator’s retention policy.
- Settings provides a JSON export of personal application state.
- Account deletion revalidates the current Supabase session on the server, then deletes the auth user with a server-only service-role key. Foreign-key cascades remove owned application rows.
- If the service-role key is not configured, automated account deletion is unavailable and the operator must provide a support process.

Database backups, logs, email-provider retention, and platform logs may have separate retention periods chosen by the operator.

## Security controls

- RLS is enabled on public and personal tables.
- Owner policies use `auth.uid()` for reads and writes.
- Public data is read-only to anonymous/authenticated browser roles.
- Secrets are read from server environment variables and are not committed.
- Redirect validation rejects external and protocol-relative destinations.
- Errors shown to users avoid exposing database or authentication internals.

No software can promise absolute security. Operators should keep dependencies updated, enable MFA for administrative accounts, restrict production access, configure monitoring/backups, test RLS with multiple users, and maintain an incident-response process.

## Minors

The audience includes school students. A production operator must assess local age-of-consent and parental-consent rules before offering accounts to minors. Collect only what is needed for planning and provide clear deletion/support routes.

## Accuracy and decisions

Admission information changes. UniRoute Korea records sources and check dates but cannot guarantee completeness or currentness. Users must verify requirements, deadlines, scholarships, visa/legal steps, and costs with the relevant official organization before making a decision or payment.
