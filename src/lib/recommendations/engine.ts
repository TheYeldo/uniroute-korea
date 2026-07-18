import type { Program, University, UserProfile } from "@/types/domain";

export type MatchStatus = "strong" | "possible" | "tradeoff" | "insufficient-data";

export interface RecommendationResult {
  universityId: string;
  programIds: string[];
  status: MatchStatus;
  internalOrder: number;
  matched: string[];
  mismatched: string[];
  missing: string[];
  tradeoffs: string[];
}

export function recommendUniversity(
  profile: UserProfile,
  university: University,
  programs: Program[],
): RecommendationResult {
  const matched: string[] = [];
  const mismatched: string[] = [];
  const missing: string[] = [];
  const tradeoffs: string[] = [];
  let score = 0;

  const relevantPrograms = programs.filter(
    (program) =>
      program.universityId === university.id &&
      program.degreeLevel === profile.degreeLevel &&
      program.field.toLocaleLowerCase().includes(profile.preferredMajor.toLocaleLowerCase()),
  );
  if (relevantPrograms.length) {
    matched.push("major");
    score += 4;
  } else {
    mismatched.push("major");
    score -= 3;
  }

  if (university.degreeLevels.includes(profile.degreeLevel)) {
    matched.push("degree");
    score += 2;
  } else {
    mismatched.push("degree");
    score -= 4;
  }

  if (
    profile.preferredCities.length === 0 ||
    profile.preferredCities.some((city) => university.city.includes(city))
  ) {
    matched.push("city");
    score += 1;
  } else {
    tradeoffs.push("city");
  }

  if (profile.universityType === "any" || profile.universityType === university.type) {
    matched.push("university-type");
    score += 1;
  } else {
    tradeoffs.push("university-type");
  }

  if (university.instructionLanguages.includes(profile.studyLanguage)) {
    matched.push("instruction-language");
    score += 3;
  } else if (university.instructionLanguages.includes("varies")) {
    missing.push("instruction-language");
  } else {
    mismatched.push("instruction-language");
    score -= 3;
  }

  if (profile.annualTuitionBudget === null || university.tuition.value === null) {
    missing.push("tuition");
  } else if (
    university.tuition.value.period === "year" &&
    university.tuition.value.max <= profile.annualTuitionBudget
  ) {
    matched.push("tuition");
    score += 2;
  } else {
    tradeoffs.push("tuition");
    score -= 1;
  }

  if (profile.scholarshipRequired) {
    if (university.scholarshipAvailability.value === true) {
      matched.push("scholarship-available");
      score += 2;
    } else if (university.scholarshipAvailability.value === null) {
      missing.push("scholarship");
    } else {
      mismatched.push("scholarship");
      score -= 2;
    }
  }

  const status: MatchStatus =
    missing.length >= 4
      ? "insufficient-data"
      : score >= 8
        ? "strong"
        : score >= 3
          ? "possible"
          : "tradeoff";
  return {
    universityId: university.id,
    programIds: relevantPrograms.map((program) => program.id),
    status,
    internalOrder: score,
    matched,
    mismatched,
    missing,
    tradeoffs,
  };
}

export function rankRecommendations(
  profile: UserProfile,
  universities: University[],
  programs: Program[],
) {
  return universities
    .map((university) => recommendUniversity(profile, university, programs))
    .sort((a, b) => b.internalOrder - a.internalOrder);
}
