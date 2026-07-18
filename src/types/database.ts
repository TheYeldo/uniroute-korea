export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type TableDefinition<
  Row extends Record<string, unknown>,
  RequiredInsert extends keyof Row = never,
> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, RequiredInsert>;
  Update: Partial<Row>;
  Relationships: [];
};

type SourceRow = {
  id: string;
  title: string;
  url: string;
  organization: string;
  checked_at: string;
  academic_year: string | null;
  source_type: "official" | "government" | "estimated" | "secondary";
  note_ru: string | null;
  note_en: string | null;
  created_at: string;
  updated_at: string;
};

type UniversityRow = {
  id: string;
  slug: string;
  name: string;
  korean_name: string;
  short_name: string;
  city: string;
  campus: string;
  university_type: "national" | "private" | "science-and-technology";
  overview_ru: string;
  overview_en: string;
  official_website: string;
  admission_website: string;
  data_completeness: "verified-core" | "partial";
  last_verified_at: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

type ProgramRow = {
  id: string;
  university_id: string;
  slug: string;
  degree_level: "bachelor" | "master" | "doctoral";
  field: string;
  title: string;
  department: string;
  instruction_language: "english" | "korean" | "mixed" | "varies";
  duration_years: number | null;
  tuition_min_krw: number | null;
  tuition_max_krw: number | null;
  tuition_period: "semester" | "year" | "month" | "one-time" | null;
  tuition_source_id: string | null;
  program_url: string;
  last_verified_at: string;
  is_published: boolean;
};

type RequirementRow = {
  id: string;
  university_id: string | null;
  program_id: string | null;
  category:
    "eligibility" | "academic" | "language" | "document" | "portfolio" | "interview" | "financial";
  requirement_text_ru: string;
  requirement_text_en: string;
  test_name: string | null;
  minimum_value: number | null;
  recommended_value: number | null;
  varies_by_department: boolean;
  verification_status: "official" | "government" | "estimated" | "unconfirmed";
  source_id: string | null;
  academic_year: string | null;
  last_verified_at: string | null;
};

type ScholarshipRow = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  category: string;
  funding: "full" | "partial" | "varies";
  coverage_ru: string;
  coverage_en: string;
  eligibility_ru: string;
  eligibility_en: string;
  application_period_ru: string;
  application_period_en: string;
  deadline: string | null;
  source_id: string | null;
  last_verified_at: string;
  is_published: boolean;
};

type DeadlineRow = {
  id: string;
  university_id: string | null;
  scholarship_id: string | null;
  title_ru: string;
  title_en: string;
  category: string;
  intake: "spring" | "fall";
  academic_year: string;
  starts_at: string | null;
  ends_at: string;
  timezone: string;
  is_official: boolean;
  source_id: string;
  created_at: string;
};

type DataVerificationRow = {
  id: string;
  entity_type: string;
  entity_id: string;
  source_id: string;
  checked_at: string;
  next_review_at: string | null;
  confidence: "high" | "medium" | "low";
  status: "verified" | "needs-review" | "outdated" | "unconfirmed";
  note: string | null;
};

type ProfileRow = {
  id: string;
  country: string | null;
  city: string | null;
  school_grade: string | null;
  graduation_year: number | null;
  age_range: string | null;
  interface_language: "ru" | "en";
  grading_system: string | null;
  average_grade: number | null;
  strong_subjects: string[];
  weak_subjects: string[];
  achievements: string | null;
  extracurriculars: string | null;
  english_level: string | null;
  ielts_score: number | null;
  toefl_score: number | null;
  korean_level: string | null;
  topik_level: number | null;
  study_language: "english" | "korean" | "mixed" | "varies" | null;
  degree_level: "bachelor" | "master" | "doctoral" | null;
  preferred_major: string | null;
  preferred_cities: string[];
  university_type: string | null;
  target_intake: "spring" | "fall" | null;
  admission_year: number | null;
  language_program_first: boolean;
  annual_tuition_budget: number | null;
  monthly_living_budget: number | null;
  scholarship_required: boolean;
  partial_funding_accepted: boolean;
  family_funding_available: boolean;
  priorities: string[];
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
};

type SavedUniversityRow = {
  id: string;
  user_id: string;
  university_id: string;
  priority: "low" | "medium" | "high";
  application_status: string;
  selected_program_id: string | null;
  notes: string;
  advantages: string;
  concerns: string;
  target_intake: string | null;
  scholarship_plan: string;
  created_at: string;
  updated_at: string;
};

type RoadmapTaskRow = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  due_at: string | null;
  status: "not-started" | "needs-attention" | "in-progress" | "ready" | "verify";
  priority: "low" | "medium" | "high";
  university_id: string | null;
  source_id: string | null;
  notes: string;
  dependencies: string[];
  is_suggested: boolean;
  created_at: string;
  updated_at: string;
};

type DocumentRow = {
  id: string;
  user_id: string;
  name: string;
  status: string;
  due_at: string | null;
  notes: string;
  translation_required: boolean;
  notarization_required: boolean;
  apostille_required: boolean;
  expires_at: string | null;
  file_upload_status: "metadata-only";
  created_at: string;
  updated_at: string;
};

type NoteRow = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  entity_type: "university" | "program" | "scholarship" | "document" | "task" | "general";
  entity_id: string | null;
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

type ComparisonRow = {
  id: string;
  user_id: string;
  title: string;
  share_token: string | null;
  criteria: string[];
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      sources: TableDefinition<
        SourceRow,
        "id" | "title" | "url" | "organization" | "checked_at" | "source_type"
      >;
      universities: TableDefinition<
        UniversityRow,
        | "id"
        | "slug"
        | "name"
        | "korean_name"
        | "short_name"
        | "city"
        | "campus"
        | "university_type"
        | "overview_ru"
        | "overview_en"
        | "official_website"
        | "admission_website"
        | "last_verified_at"
      >;
      university_sources: TableDefinition<
        { university_id: string; source_id: string; data_category: string },
        "university_id" | "source_id" | "data_category"
      >;
      programs: TableDefinition<
        ProgramRow,
        | "id"
        | "university_id"
        | "slug"
        | "degree_level"
        | "field"
        | "title"
        | "department"
        | "instruction_language"
        | "program_url"
        | "last_verified_at"
      >;
      requirements: TableDefinition<
        RequirementRow,
        "category" | "requirement_text_ru" | "requirement_text_en" | "verification_status"
      >;
      scholarships: TableDefinition<
        ScholarshipRow,
        | "id"
        | "slug"
        | "title"
        | "provider"
        | "category"
        | "funding"
        | "coverage_ru"
        | "coverage_en"
        | "eligibility_ru"
        | "eligibility_en"
        | "application_period_ru"
        | "application_period_en"
        | "last_verified_at"
      >;
      scholarship_universities: TableDefinition<
        { scholarship_id: string; university_id: string },
        "scholarship_id" | "university_id"
      >;
      deadlines: TableDefinition<
        DeadlineRow,
        | "id"
        | "title_ru"
        | "title_en"
        | "category"
        | "intake"
        | "academic_year"
        | "ends_at"
        | "source_id"
      >;
      data_verification: TableDefinition<
        DataVerificationRow,
        "entity_type" | "entity_id" | "source_id" | "checked_at" | "confidence" | "status"
      >;
      profiles: TableDefinition<ProfileRow, "id">;
      saved_universities: TableDefinition<SavedUniversityRow, "user_id" | "university_id">;
      selected_programs: TableDefinition<
        {
          id: string;
          user_id: string;
          program_id: string;
          target_intake: string | null;
          is_primary: boolean;
          created_at: string;
        },
        "user_id" | "program_id"
      >;
      roadmap_tasks: TableDefinition<
        RoadmapTaskRow,
        "id" | "user_id" | "title" | "status" | "priority"
      >;
      documents: TableDefinition<DocumentRow, "id" | "user_id" | "name" | "status">;
      document_universities: TableDefinition<
        { document_id: string; university_id: string; user_id: string },
        "document_id" | "university_id" | "user_id"
      >;
      notes: TableDefinition<NoteRow, "id" | "user_id" | "title" | "entity_type">;
      comparisons: TableDefinition<ComparisonRow, "user_id">;
      comparison_items: TableDefinition<
        { comparison_id: string; university_id: string; position: number },
        "comparison_id" | "university_id" | "position"
      >;
      notification_preferences: TableDefinition<
        {
          user_id: string;
          in_app_enabled: boolean;
          email_enabled: boolean;
          deadline_days_before: number[];
          timezone: string;
          updated_at: string;
        },
        "user_id"
      >;
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
