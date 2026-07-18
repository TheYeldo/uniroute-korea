-- UniRoute Korea initial schema
-- Apply with: supabase db push, or paste into the Supabase SQL editor.

create extension if not exists pgcrypto;

create table public.sources (
  id text primary key,
  title text not null,
  url text not null check (url ~ '^https://'),
  organization text not null,
  checked_at date not null,
  academic_year text,
  source_type text not null check (source_type in ('official', 'government', 'estimated', 'secondary')),
  note_ru text,
  note_en text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.universities (
  id text primary key,
  slug text not null unique,
  name text not null,
  korean_name text not null,
  short_name text not null,
  city text not null,
  campus text not null,
  university_type text not null check (university_type in ('national', 'private', 'science-and-technology')),
  overview_ru text not null,
  overview_en text not null,
  official_website text not null,
  admission_website text not null,
  data_completeness text not null default 'partial' check (data_completeness in ('verified-core', 'partial')),
  last_verified_at date not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.university_sources (
  university_id text not null references public.universities(id) on delete cascade,
  source_id text not null references public.sources(id) on delete restrict,
  data_category text not null,
  primary key (university_id, source_id, data_category)
);

create table public.programs (
  id text primary key,
  university_id text not null references public.universities(id) on delete cascade,
  slug text not null,
  degree_level text not null check (degree_level in ('bachelor', 'master', 'doctoral')),
  field text not null,
  title text not null,
  department text not null,
  instruction_language text not null check (instruction_language in ('english', 'korean', 'mixed', 'varies')),
  duration_years numeric(3,1),
  tuition_min_krw bigint,
  tuition_max_krw bigint,
  tuition_period text check (tuition_period in ('semester', 'year', 'month', 'one-time')),
  tuition_source_id text references public.sources(id),
  program_url text not null,
  last_verified_at date not null,
  is_published boolean not null default true,
  unique (university_id, slug, degree_level)
);

create table public.requirements (
  id uuid primary key default gen_random_uuid(),
  university_id text references public.universities(id) on delete cascade,
  program_id text references public.programs(id) on delete cascade,
  category text not null check (category in ('eligibility', 'academic', 'language', 'document', 'portfolio', 'interview', 'financial')),
  requirement_text_ru text not null,
  requirement_text_en text not null,
  test_name text,
  minimum_value numeric,
  recommended_value numeric,
  varies_by_department boolean not null default false,
  verification_status text not null check (verification_status in ('official', 'government', 'estimated', 'unconfirmed')),
  source_id text references public.sources(id),
  academic_year text,
  last_verified_at date,
  check (university_id is not null or program_id is not null)
);

create table public.scholarships (
  id text primary key,
  slug text not null unique,
  title text not null,
  provider text not null,
  category text not null,
  funding text not null check (funding in ('full', 'partial', 'varies')),
  coverage_ru text not null,
  coverage_en text not null,
  eligibility_ru text not null,
  eligibility_en text not null,
  application_period_ru text not null,
  application_period_en text not null,
  deadline timestamptz,
  source_id text references public.sources(id),
  last_verified_at date not null,
  is_published boolean not null default true
);

create table public.scholarship_universities (
  scholarship_id text not null references public.scholarships(id) on delete cascade,
  university_id text not null references public.universities(id) on delete cascade,
  primary key (scholarship_id, university_id)
);

create table public.deadlines (
  id text primary key,
  university_id text references public.universities(id) on delete cascade,
  scholarship_id text references public.scholarships(id) on delete cascade,
  title_ru text not null,
  title_en text not null,
  category text not null,
  intake text not null check (intake in ('spring', 'fall')),
  academic_year text not null,
  starts_at timestamptz,
  ends_at timestamptz not null,
  timezone text not null default 'Asia/Seoul',
  is_official boolean not null default true,
  source_id text not null references public.sources(id),
  created_at timestamptz not null default now(),
  check (university_id is not null or scholarship_id is not null)
);

create table public.data_verification (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  source_id text not null references public.sources(id),
  checked_at date not null,
  next_review_at date,
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  status text not null check (status in ('verified', 'needs-review', 'outdated', 'unconfirmed')),
  note text,
  unique (entity_type, entity_id, source_id)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  country text,
  city text,
  school_grade text,
  graduation_year integer,
  age_range text,
  interface_language text not null default 'ru' check (interface_language in ('ru', 'en')),
  grading_system text,
  average_grade numeric,
  strong_subjects text[] not null default '{}',
  weak_subjects text[] not null default '{}',
  achievements text,
  extracurriculars text,
  english_level text,
  ielts_score numeric(3,1) check (ielts_score between 0 and 9),
  toefl_score integer check (toefl_score between 0 and 120),
  korean_level text,
  topik_level integer check (topik_level between 0 and 6),
  study_language text check (study_language in ('english', 'korean', 'mixed', 'varies')),
  degree_level text check (degree_level in ('bachelor', 'master', 'doctoral')),
  preferred_major text,
  preferred_cities text[] not null default '{}',
  university_type text,
  target_intake text check (target_intake in ('spring', 'fall')),
  admission_year integer,
  language_program_first boolean not null default false,
  annual_tuition_budget bigint,
  monthly_living_budget bigint,
  scholarship_required boolean not null default false,
  partial_funding_accepted boolean not null default true,
  family_funding_available boolean not null default false,
  priorities text[] not null default '{}',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_universities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  university_id text not null references public.universities(id) on delete cascade,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  application_status text not null default 'exploring',
  selected_program_id text references public.programs(id) on delete set null,
  notes text not null default '',
  advantages text not null default '',
  concerns text not null default '',
  target_intake text,
  scholarship_plan text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, university_id)
);

create table public.selected_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id text not null references public.programs(id) on delete cascade,
  target_intake text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, program_id)
);

create table public.roadmap_tasks (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null,
  due_at date,
  status text not null check (status in ('not-started', 'needs-attention', 'in-progress', 'ready', 'verify')),
  priority text not null check (priority in ('low', 'medium', 'high')),
  university_id text references public.universities(id) on delete set null,
  source_id text references public.sources(id) on delete set null,
  notes text not null default '',
  dependencies uuid[] not null default '{}',
  is_suggested boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  status text not null,
  due_at date,
  notes text not null default '',
  translation_required boolean not null default false,
  notarization_required boolean not null default false,
  apostille_required boolean not null default false,
  expires_at date,
  file_upload_status text not null default 'metadata-only' check (file_upload_status = 'metadata-only'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.document_universities (
  document_id uuid not null references public.documents(id) on delete cascade,
  university_id text not null references public.universities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  primary key (document_id, university_id)
);

create table public.notes (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null default '',
  entity_type text not null check (entity_type in ('university', 'program', 'scholarship', 'document', 'task', 'general')),
  entity_id text,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Comparison',
  share_token text unique,
  criteria text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.comparison_items (
  comparison_id uuid not null references public.comparisons(id) on delete cascade,
  university_id text not null references public.universities(id) on delete cascade,
  position smallint not null check (position between 1 and 4),
  primary key (comparison_id, university_id),
  unique (comparison_id, position)
);

create table public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  in_app_enabled boolean not null default true,
  email_enabled boolean not null default false,
  deadline_days_before integer[] not null default '{30,14,7,1}',
  timezone text not null default 'Asia/Almaty',
  updated_at timestamptz not null default now()
);

create index programs_university_idx on public.programs(university_id);
create index programs_field_degree_idx on public.programs(field, degree_level);
create index deadlines_ends_at_idx on public.deadlines(ends_at) where ends_at is not null;
create index deadlines_university_idx on public.deadlines(university_id, ends_at);
create index verification_review_idx on public.data_verification(next_review_at, status);
create index saved_universities_user_idx on public.saved_universities(user_id, application_status);
create index roadmap_tasks_user_due_idx on public.roadmap_tasks(user_id, due_at);
create index documents_user_due_idx on public.documents(user_id, due_at);
create index notes_user_updated_idx on public.notes(user_id, updated_at desc);

alter table public.sources enable row level security;
alter table public.universities enable row level security;
alter table public.university_sources enable row level security;
alter table public.programs enable row level security;
alter table public.requirements enable row level security;
alter table public.scholarships enable row level security;
alter table public.scholarship_universities enable row level security;
alter table public.deadlines enable row level security;
alter table public.data_verification enable row level security;

create policy "Public sources are readable" on public.sources for select using (true);
create policy "Published universities are readable" on public.universities for select using (is_published);
create policy "Public university source links are readable" on public.university_sources for select using (true);
create policy "Published programs are readable" on public.programs for select using (is_published);
create policy "Public requirements are readable" on public.requirements for select using (true);
create policy "Published scholarships are readable" on public.scholarships for select using (is_published);
create policy "Public scholarship links are readable" on public.scholarship_universities for select using (true);
create policy "Public deadlines are readable" on public.deadlines for select using (true);
create policy "Verification metadata is readable" on public.data_verification for select using (true);

alter table public.profiles enable row level security;
alter table public.saved_universities enable row level security;
alter table public.selected_programs enable row level security;
alter table public.roadmap_tasks enable row level security;
alter table public.documents enable row level security;
alter table public.document_universities enable row level security;
alter table public.notes enable row level security;
alter table public.comparisons enable row level security;
alter table public.comparison_items enable row level security;
alter table public.notification_preferences enable row level security;

create policy "Users own profiles" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users own saved universities" on public.saved_universities for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own selected programs" on public.selected_programs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own roadmap tasks" on public.roadmap_tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own documents" on public.documents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own document links" on public.document_universities for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own notes" on public.notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own comparisons" on public.comparisons for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own comparison items" on public.comparison_items for all
  using (exists (select 1 from public.comparisons c where c.id = comparison_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.comparisons c where c.id = comparison_id and c.user_id = auth.uid()));
create policy "Users own notification preferences" on public.notification_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, interface_language) values (new.id, coalesce(new.raw_user_meta_data->>'locale', 'ru'));
  insert into public.notification_preferences (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

revoke all on all tables in schema public from anon, authenticated;
grant select on public.sources, public.universities, public.university_sources, public.programs, public.requirements, public.scholarships, public.scholarship_universities, public.deadlines, public.data_verification to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.saved_universities, public.selected_programs, public.roadmap_tasks, public.documents, public.document_universities, public.notes, public.comparisons, public.comparison_items, public.notification_preferences to authenticated;
