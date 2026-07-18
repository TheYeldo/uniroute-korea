# Database architecture

UniRoute Korea uses PostgreSQL through Supabase. The schema is normalized so public admissions data can be curated independently from private student planning data.

## Migrations

- `supabase/migrations/0001_initial_schema.sql` creates tables, checks, indexes, RLS policies, grants, and the new-user trigger.
- `supabase/migrations/0002_seed_public_data.sql` inserts 18 official/government sources, 10 universities, 10 programs, four sourced requirement records, three scholarships, three current future deadlines, provenance links, and editorial verification records.

Apply them with `npx supabase db push` after linking the project, or run the files in order in the Supabase SQL editor.

## Relationships

```text
sources ─┬─< university_sources >─ universities ─┬─< programs
         ├─< requirements                       ├─< deadlines
         ├─< scholarships                       ├─< saved_universities
         └─< data_verification                   └─< document_universities

auth.users ─┬─1 profiles
            ├─1 notification_preferences
            ├─< saved_universities
            ├─< selected_programs
            ├─< roadmap_tasks
            ├─< documents ─< document_universities
            ├─< notes
            └─< comparisons ─< comparison_items
```

## Public reference tables

| Table                      | Purpose                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `sources`                  | Direct source URL, organization, checked date, academic year, type, bilingual limitation notes   |
| `universities`             | Identity, location, type, bilingual overview, official links, publication and verification state |
| `university_sources`       | Many-to-many provenance links by data category                                                   |
| `programs`                 | University-level degree/program records with language, tuition, URL, and verification date       |
| `requirements`             | Atomic academic/language/document/interview requirements with official/recommended semantics     |
| `scholarships`             | Coverage, eligibility, application period, funding type, provider, and source                    |
| `scholarship_universities` | Scholarship-to-university applicability                                                          |
| `deadlines`                | Intake/year-aware dates with explicit IANA timezone and source                                   |
| `data_verification`        | Editorial review state, confidence, next review date, and notes                                  |

Published reference records are anonymously readable. Writes are intentionally not granted to public clients; administration should use a protected server workflow.

## Personal tables

| Table                      | Owner column          | Purpose                                                         |
| -------------------------- | --------------------- | --------------------------------------------------------------- |
| `profiles`                 | `id = auth.uid()`     | Onboarding and study/financial preferences                      |
| `saved_universities`       | `user_id`             | Shortlist, priority, selected program, notes, application state |
| `selected_programs`        | `user_id`             | Saved program choices                                           |
| `roadmap_tasks`            | `user_id`             | Suggested/manual milestones, dependencies, deadlines, status    |
| `documents`                | `user_id`             | Metadata-only checklist and legalization states                 |
| `document_universities`    | `user_id`             | Private document/university associations                        |
| `notes`                    | `user_id`             | Private Markdown notes linked to product entities               |
| `comparisons`              | `user_id`             | Saved comparison metadata and criteria                          |
| `comparison_items`         | via parent comparison | Up to four ordered universities                                 |
| `notification_preferences` | `user_id`             | Consent, reminder offsets, and timezone                         |

Deleting an `auth.users` row cascades through personal records. Reference entities generally restrict or safely null dependent source links to preserve integrity.

## Row Level Security

RLS is enabled on every table.

- Public tables permit `SELECT` only; university/program/scholarship policies also require `is_published`.
- Personal policies require `auth.uid()` to equal the row owner in both `USING` and `WITH CHECK`.
- `comparison_items` derives ownership through an `EXISTS` check on its parent comparison.
- Grants are explicitly revoked and then restored at the minimum anonymous/authenticated level.
- The `handle_new_user` trigger is `SECURITY DEFINER` with a fixed `search_path` and only creates the matching profile/preferences rows.

The anon key is safe to expose only because RLS is the authorization boundary. The service-role key bypasses RLS and must remain server-side.

## Indexes

Indexes cover catalog joins and common planner queries:

- program by university and field/degree;
- deadline by end time and university;
- verification review queue;
- shortlist by user and application status;
- roadmap/document due dates per user;
- notes by user and most recent update.

## Seed process

The SQL seed is idempotent through `ON CONFLICT` and mirrors the MVP catalog entities maintained in the typed files under `src/data`. The typed files remain the build-time editorial source used by public pages; the normalized seed is ready for hosted reads and a future protected admin workflow.

When expanding hosted data:

1. verify and register the source;
2. insert/upsert source rows first;
3. insert the university, program, requirement, scholarship, or deadline;
4. attach provenance through foreign keys/junction tables;
5. create a `data_verification` record and next review date;
6. test anonymous reads and owner isolation with two authenticated users.

## RLS verification checklist

Use a disposable staging project:

1. As anon, confirm published public rows can be selected and cannot be inserted/updated/deleted.
2. Create users A and B.
3. As A, insert one row in every personal table.
4. As B, confirm A’s rows cannot be selected, updated, or deleted and cannot be referenced through a comparison/document link.
5. As A, confirm own CRUD works.
6. Delete A and confirm owned rows cascade.
7. Inspect browser bundles and network requests to confirm no service-role key is present.

The schema has been exercised against the local Supabase stack with two disposable users. The check verifies the signup trigger, owner CRUD, cross-user read/update/delete isolation, anti-spoofing on inserts, anonymous public reads, and public write denial. Repeat it against a disposable hosted project before production credentials are enabled; SQL policies remain the authoritative control boundary.
