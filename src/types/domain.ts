export type LocaleCode = "ru" | "en";
export type LocalizedText = Record<LocaleCode, string>;
export type VerificationStatus = "official" | "government" | "estimated" | "unconfirmed";
export type ConfidenceLevel = "high" | "medium" | "low";
export type DegreeLevel = "bachelor" | "master" | "doctoral";
export type InstructionLanguage = "english" | "korean" | "mixed" | "varies";
export type Intake = "spring" | "fall";

export interface SourceReference {
  id: string;
  title: string;
  url: string;
  organization: string;
  checkedAt: string;
  academicYear?: string;
  sourceType: Exclude<VerificationStatus, "unconfirmed">;
  note?: LocalizedText;
}

export interface SourcedValue<T> {
  value: T | null;
  sourceId?: string;
  status: VerificationStatus;
  confidence: ConfidenceLevel;
  academicYear?: string;
  note?: LocalizedText;
}

export interface MoneyRange {
  min: number;
  max: number;
  currency: "KRW" | "USD";
  period: "semester" | "year" | "month" | "one-time";
}

export interface LanguageRequirement {
  test: "IELTS" | "TOEFL iBT" | "TOPIK";
  minimum: number | null;
  recommended?: number;
  variesByDepartment: boolean;
  sourceId?: string;
  status: VerificationStatus;
}

export interface Program {
  id: string;
  universityId: string;
  slug: string;
  degreeLevel: DegreeLevel;
  field: string;
  title: string;
  department: string;
  instructionLanguage: InstructionLanguage;
  durationYears: number | null;
  tuition: SourcedValue<MoneyRange>;
  intakes: Intake[];
  languageRequirements: LanguageRequirement[];
  url: string;
  lastVerifiedAt: string;
  sourceIds: string[];
}

export interface University {
  id: string;
  slug: string;
  name: string;
  koreanName: string;
  shortName: string;
  city: string;
  campus: string;
  type: "national" | "private" | "science-and-technology";
  overview: LocalizedText;
  officialWebsite: string;
  admissionWebsite: string;
  degreeLevels: DegreeLevel[];
  subjectAreas: string[];
  instructionLanguages: InstructionLanguage[];
  tuition: SourcedValue<MoneyRange>;
  applicationFee: SourcedValue<MoneyRange>;
  dormitory: SourcedValue<boolean>;
  internationalSupport: SourcedValue<boolean>;
  scholarshipAvailability: SourcedValue<boolean>;
  intakes: Intake[];
  languageRequirements: LanguageRequirement[];
  livingCost: SourcedValue<MoneyRange>;
  sourceIds: string[];
  lastVerifiedAt: string;
  dataCompleteness: "verified-core" | "partial";
}

export interface Scholarship {
  id: string;
  slug: string;
  title: string;
  provider: string;
  category: "government" | "university" | "merit" | "tuition-waiver";
  funding: "full" | "partial" | "varies";
  coverage: LocalizedText;
  eligibility: LocalizedText;
  degreeLevels: DegreeLevel[];
  nationality: string[];
  majors: string[];
  universityIds: string[];
  languageRequirements: LanguageRequirement[];
  requiredDocuments: string[];
  applicationPeriod: LocalizedText;
  deadline: string | null;
  sourceIds: string[];
  lastVerifiedAt: string;
}

export interface AdmissionDeadline {
  id: string;
  universityId?: string;
  scholarshipId?: string;
  title: LocalizedText;
  category: "application" | "documents" | "result" | "scholarship" | "enrollment";
  intake: Intake;
  academicYear: string;
  startsAt?: string;
  endsAt: string;
  timezone: "Asia/Seoul";
  official: boolean;
  sourceId: string;
}

export type ReadinessStatus =
  "meets" | "likely" | "needs-improvement" | "missing" | "verify" | "passed";

export interface ReadinessResult {
  category:
    | "academics"
    | "graduation"
    | "english"
    | "korean"
    | "budget"
    | "scholarship"
    | "documents"
    | "deadline"
    | "compatibility";
  status: ReadinessStatus;
  reason: LocalizedText;
  action?: LocalizedText;
}

export interface UserProfile {
  country: string;
  city: string;
  grade: string;
  graduationYear: number | null;
  ageRange: string;
  interfaceLanguage: LocaleCode;
  gradingSystem: string;
  averageGrade: number | null;
  strongSubjects: string[];
  weakSubjects: string[];
  achievements: string;
  extracurriculars: string;
  englishLevel: string;
  ieltsScore: number | null;
  toeflScore: number | null;
  koreanLevel: string;
  topikScore: number | null;
  studyLanguage: InstructionLanguage;
  degreeLevel: DegreeLevel;
  preferredMajor: string;
  preferredCities: string[];
  universityType: University["type"] | "any";
  targetIntake: Intake;
  admissionYear: number;
  languageProgramFirst: boolean;
  annualTuitionBudget: number | null;
  monthlyLivingBudget: number | null;
  scholarshipRequired: boolean;
  partialFundingAccepted: boolean;
  familyFundingAvailable: boolean;
  priorities: string[];
  onboardingComplete: boolean;
}

export type TaskStatus = "not-started" | "needs-attention" | "in-progress" | "ready" | "verify";
export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  universityId?: string;
  sourceId?: string;
  notes: string;
  dependencies: string[];
  suggested: boolean;
}

export type DocumentStatus =
  | "not-started"
  | "requested"
  | "received"
  | "translation-needed"
  | "verification-needed"
  | "ready"
  | "submitted"
  | "rejected"
  | "expired";

export interface TrackedDocument {
  id: string;
  name: string;
  status: DocumentStatus;
  dueDate: string;
  notes: string;
  universityIds: string[];
  translationRequired: boolean;
  notarizationRequired: boolean;
  apostilleRequired: boolean;
  expirationDate: string | null;
  fileUploadStatus: "metadata-only";
}

export interface PersonalNote {
  id: string;
  title: string;
  content: string;
  entityType: "university" | "program" | "scholarship" | "document" | "task" | "general";
  entityId?: string;
  pinned: boolean;
  updatedAt: string;
}

export type ApplicationStatus =
  | "exploring"
  | "shortlisted"
  | "preparing"
  | "ready-to-apply"
  | "submitted"
  | "interview"
  | "accepted"
  | "waitlisted"
  | "rejected"
  | "declined";

export interface SavedUniversity {
  universityId: string;
  priority: "low" | "medium" | "high";
  status: ApplicationStatus;
  selectedProgramId?: string;
  notes: string;
  advantages: string;
  concerns: string;
  targetIntake: string;
  scholarshipPlan: string;
}
