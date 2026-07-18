import { suggestedDate } from "@/lib/formatting/dates";
import type { RoadmapTask, TrackedDocument, UserProfile } from "@/types/domain";

export const defaultProfile: UserProfile = {
  country: "Kazakhstan",
  city: "",
  grade: "",
  graduationYear: null,
  ageRange: "",
  interfaceLanguage: "ru",
  gradingSystem: "5-point",
  averageGrade: null,
  strongSubjects: [],
  weakSubjects: [],
  achievements: "",
  extracurriculars: "",
  englishLevel: "",
  ieltsScore: null,
  toeflScore: null,
  koreanLevel: "beginner",
  topikScore: null,
  studyLanguage: "english",
  degreeLevel: "bachelor",
  preferredMajor: "Computer Science",
  preferredCities: [],
  universityType: "any",
  targetIntake: "fall",
  admissionYear: 2027,
  languageProgramFirst: false,
  annualTuitionBudget: null,
  monthlyLivingBudget: null,
  scholarshipRequired: true,
  partialFundingAccepted: true,
  familyFundingAvailable: false,
  priorities: ["scholarship", "english-programs", "career"],
  onboardingComplete: false,
};

const task = (
  title: string,
  description: string,
  category: string,
  deadline: string,
  priority: RoadmapTask["priority"],
): RoadmapTask => ({
  id: crypto.randomUUID(),
  title,
  description,
  category,
  deadline,
  status: "not-started",
  priority,
  notes: "",
  dependencies: [],
  suggested: true,
});

export function createSuggestedRoadmap(profile: UserProfile): RoadmapTask[] {
  const target = `${profile.admissionYear}-${profile.targetIntake === "spring" ? "03" : "09"}`;
  const ru = profile.interfaceLanguage === "ru";
  const description = ru
    ? "Рекомендованный этап подготовки. Адаптируйте его к официальным дедлайнам выбранных университетов."
    : "Suggested preparation milestone. Adapt it to the official deadlines of your selected universities.";
  const titles = ru
    ? [
        "Изучить университеты и проверить треки поступления",
        "Выбрать программы и составить шорт-лист",
        "Составить план подготовки к IELTS, TOEFL или TOPIK",
        "Запросить выписку оценок и документ о выпуске",
        "Запланировать заверенный перевод и легализацию",
        "Подготовить рекомендации и personal statement",
        "Проверить дедлайны стипендий",
        "Подать заявки в университеты",
        "Подготовиться к интервью и результатам",
        "После зачисления подготовить визу и жильё",
      ]
    : [
        "Explore universities and verify admission tracks",
        "Select programs and build a shortlist",
        "Set an IELTS, TOEFL, or TOPIK preparation plan",
        "Request school transcripts and graduation evidence",
        "Plan certified translation and legalization",
        "Prepare recommendation letters and personal statement",
        "Verify scholarship deadlines",
        "Submit university applications",
        "Prepare for interviews and results",
        "Prepare visa and accommodation after admission",
      ];
  return [
    task(titles[0], description, "discovery", suggestedDate(target, 18), "high"),
    task(titles[1], description, "discovery", suggestedDate(target, 15), "high"),
    task(titles[2], description, "language", suggestedDate(target, 14), "high"),
    task(titles[3], description, "documents", suggestedDate(target, 10), "high"),
    task(titles[4], description, "documents", suggestedDate(target, 8), "high"),
    task(titles[5], description, "application", suggestedDate(target, 7), "medium"),
    task(titles[6], description, "scholarship", suggestedDate(target, 7), "high"),
    task(titles[7], description, "application", suggestedDate(target, 5), "high"),
    task(titles[8], description, "interview", suggestedDate(target, 3), "medium"),
    task(titles[9], description, "departure", suggestedDate(target, 2), "medium"),
  ];
}

export function createDefaultDocuments(): TrackedDocument[] {
  const names = [
    "Passport",
    "School transcript",
    "Graduation certificate",
    "Certified translation",
    "Apostille or consular authentication",
    "Recommendation letter",
    "Personal statement",
    "Study plan",
    "Language certificate",
    "Financial proof",
    "Family relationship documents",
    "Application form",
    "Passport photo",
    "Scholarship documents",
  ];
  return names.map((name) => ({
    id: crypto.randomUUID(),
    name,
    status: "not-started",
    dueDate: "",
    notes: "",
    universityIds: [],
    translationRequired: [
      "School transcript",
      "Graduation certificate",
      "Family relationship documents",
    ].includes(name),
    notarizationRequired: false,
    apostilleRequired: ["School transcript", "Graduation certificate"].includes(name),
    expirationDate: null,
    fileUploadStatus: "metadata-only",
  }));
}
