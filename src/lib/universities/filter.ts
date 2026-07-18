import type { InstructionLanguage, University } from "@/types/domain";

export interface UniversityFilters {
  query?: string;
  city?: string;
  type?: University["type"];
  subject?: string;
  language?: InstructionLanguage;
  scholarship?: boolean;
  dormitory?: boolean;
}

export function filterUniversities(items: University[], filters: UniversityFilters): University[] {
  const query = filters.query?.trim().toLocaleLowerCase();
  return items.filter((university) => {
    const searchable = [
      university.name,
      university.koreanName,
      university.shortName,
      university.city,
      ...university.subjectAreas,
    ]
      .join(" ")
      .toLocaleLowerCase();
    if (query && !searchable.includes(query)) return false;
    if (filters.city && university.city !== filters.city) return false;
    if (filters.type && university.type !== filters.type) return false;
    if (filters.subject && !university.subjectAreas.includes(filters.subject)) return false;
    if (filters.language && !university.instructionLanguages.includes(filters.language))
      return false;
    if (filters.scholarship && university.scholarshipAvailability.value !== true) return false;
    if (filters.dormitory && university.dormitory.value !== true) return false;
    return true;
  });
}
