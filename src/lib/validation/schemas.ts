import { z } from "zod";

const optionalScore = (min: number, max: number) =>
  z.union([z.number().min(min).max(max), z.null()]);

export const profileSchema = z.object({
  country: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(100),
  grade: z.string().trim().min(1).max(30),
  graduationYear: z.union([z.number().int().min(2020).max(2040), z.null()]),
  ageRange: z.string().max(30),
  interfaceLanguage: z.enum(["ru", "en"]),
  gradingSystem: z.string().max(50),
  averageGrade: z.union([z.number().min(0).max(100), z.null()]),
  strongSubjects: z.array(z.string().max(80)).max(20),
  weakSubjects: z.array(z.string().max(80)).max(20),
  achievements: z.string().max(3000),
  extracurriculars: z.string().max(3000),
  englishLevel: z.string().max(30),
  ieltsScore: optionalScore(0, 9),
  toeflScore: optionalScore(0, 120),
  koreanLevel: z.string().max(30),
  topikScore: optionalScore(0, 6),
  studyLanguage: z.enum(["english", "korean", "mixed", "varies"]),
  degreeLevel: z.enum(["bachelor", "master", "doctoral"]),
  preferredMajor: z.string().trim().min(2).max(120),
  preferredCities: z.array(z.string().max(100)).max(20),
  universityType: z.enum(["national", "private", "science-and-technology", "any"]),
  targetIntake: z.enum(["spring", "fall"]),
  admissionYear: z.number().int().min(2026).max(2040),
  languageProgramFirst: z.boolean(),
  annualTuitionBudget: z.union([z.number().min(0).max(1000000000), z.null()]),
  monthlyLivingBudget: z.union([z.number().min(0).max(100000000), z.null()]),
  scholarshipRequired: z.boolean(),
  partialFundingAccepted: z.boolean(),
  familyFundingAvailable: z.boolean(),
  priorities: z.array(z.string().max(100)).max(20),
  onboardingComplete: z.boolean(),
});

export const roadmapTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(2).max(200),
  description: z.string().max(2000),
  category: z.string().max(80),
  deadline: z.iso.date(),
  status: z.enum(["not-started", "needs-attention", "in-progress", "ready", "verify"]),
  priority: z.enum(["low", "medium", "high"]),
  universityId: z.string().max(80).optional(),
  sourceId: z.string().max(80).optional(),
  notes: z.string().max(3000),
  dependencies: z.array(z.string().uuid()).max(50),
  suggested: z.boolean(),
});

export const noteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(200),
  content: z.string().max(20000),
  entityType: z.enum(["university", "program", "scholarship", "document", "task", "general"]),
  entityId: z.string().max(100).optional(),
  pinned: z.boolean(),
  updatedAt: z.iso.datetime(),
});

export function isSafeRedirect(value: string | null, locale: string): boolean {
  if (!value) return false;
  return value.startsWith(`/${locale}/`) && !value.startsWith("//") && !value.includes("\\");
}
