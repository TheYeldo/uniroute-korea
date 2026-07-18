# Contributing

Thank you for improving UniRoute Korea. Accuracy is more important than catalog size.

## Development

1. Fork or branch from `main`.
2. Run `npm install` and copy `.env.example` to `.env.local` if Supabase testing is needed.
3. Keep changes narrowly scoped and use strict TypeScript—do not introduce `any`.
4. Put interface text in both locale message files. Do not publish an incomplete locale.
5. Add tests for business logic and regressions.
6. Run `npm run check` and `npm run format:check` before opening a pull request.

## Admission data rules

- Prefer official university pages, official program pages, Study in Korea/NIIED, and government sources.
- Record the source title, direct URL, organization, date checked, academic year, and limitation.
- Never infer that an English program title means English-medium instruction.
- Never convert missing values into zero, “not required,” or false.
- Distinguish a stated minimum from a recommendation or department-dependent rule.
- Do not keep expired deadlines as current.
- Do not use blogs as the primary source for requirements.
- Confirm that automated collection is allowed before scraping.

Update both `src/data/sources.ts` and `DATA_SOURCES.md`; update the SQL seed when the record is part of the hosted database seed.

## Product rules

- Do not add admission probabilities, universal university rankings, or scholarship guarantees.
- Every readiness result must explain its evidence and recommended action.
- Preserve guest-mode recovery and never expose private data in a public route.
- New personal tables require `user_id`, RLS, indexes where appropriate, and cross-user access tests.
- Sensitive uploads require a separate security design, a private bucket, storage RLS, signed URLs, and type/size validation.

## Commit style

Use focused conventional commits, for example:

```text
feat: add verified program records
fix: preserve missing tuition state in comparison
test: cover deadline timezone calculations
docs: update university source register
```

## Pull request checklist

- [ ] Russian and English behavior is complete.
- [ ] Mobile and keyboard interaction were checked.
- [ ] Public claims have direct source references and check dates.
- [ ] No secret, private user data, `.next`, or generated output is committed.
- [ ] `npm run check` passes.
- [ ] Limitations and migrations are documented.
