import type { Scholarship } from "@/types/domain";

export const scholarships: Scholarship[] = [
  {
    id: "gks-u",
    slug: "global-korea-scholarship-undergraduate",
    title: "Global Korea Scholarship — Undergraduate (GKS-U)",
    provider: "National Institute for International Education (NIIED)",
    category: "government",
    funding: "full",
    coverage: {
      en: "Government scholarship with degree study support and Korean language training. Exact benefits, quotas, tracks, and eligible universities are defined in each annual guide.",
      ru: "Государственная стипендия с поддержкой обучения и курсом корейского языка. Точный состав, квоты, треки и доступные вузы определяются ежегодным гайдом.",
    },
    eligibility: {
      en: "Nationality, age, education, grades, health, and track-specific conditions apply. Use the current annual guide; a potential match is not confirmation of eligibility.",
      ru: "Действуют условия по гражданству, возрасту, образованию, успеваемости, здоровью и треку. Возможное совпадение не подтверждает право на стипендию.",
    },
    degreeLevels: ["bachelor"],
    nationality: ["international"],
    majors: ["all eligible majors in annual university information files"],
    universityIds: [],
    languageRequirements: [],
    requiredDocuments: [
      "Application forms",
      "Academic records",
      "Personal statement",
      "Study plan",
      "Recommendation",
    ],
    applicationPeriod: {
      en: "Annual cycle; the 2026 guide is archived. Check the GKS notice board for the next call.",
      ru: "Ежегодный конкурс; гайд 2026 находится в архиве. Следите за новым объявлением на доске GKS.",
    },
    deadline: null,
    sourceIds: ["gks-2026"],
    lastVerifiedAt: "2026-07-19",
  },
  {
    id: "postech-international-support",
    slug: "postech-international-undergraduate-support",
    title: "POSTECH International Undergraduate Support",
    provider: "POSTECH",
    category: "tuition-waiver",
    funding: "full",
    coverage: {
      en: "The official page describes tuition waiver support, a learning voucher, and track-dependent arrival and living support. Continuation and track conditions apply.",
      ru: "Официальная страница описывает освобождение от оплаты, учебный ваучер и поддержку приезда и проживания для отдельных треков. Действуют условия продления.",
    },
    eligibility: {
      en: "Eligibility depends on admission track, enrollment status, and continuing academic conditions described by POSTECH.",
      ru: "Право зависит от трека поступления, статуса зачисления и дальнейших академических условий POSTECH.",
    },
    degreeLevels: ["bachelor"],
    nationality: ["international"],
    majors: ["STEM"],
    universityIds: ["postech"],
    languageRequirements: [],
    requiredDocuments: [
      "Admission application; scholarship consideration is generally linked to admission",
    ],
    applicationPeriod: {
      en: "Aligned with the relevant international admission cycle; verify the current support page.",
      ru: "Связан с соответствующим международным набором; проверьте актуальную страницу поддержки.",
    },
    deadline: null,
    sourceIds: ["postech-scholarship"],
    lastVerifiedAt: "2026-07-19",
  },
  {
    id: "ku-international-scholarships",
    slug: "korea-university-international-scholarships",
    title: "Korea University International Student Scholarships",
    provider: "Korea University",
    category: "university",
    funding: "varies",
    coverage: {
      en: "University scholarship options are published within the international undergraduate admission portal. Coverage and selection change by cycle.",
      ru: "Университетские стипендии публикуются на портале международного бакалавриата. Покрытие и отбор меняются по наборам.",
    },
    eligibility: {
      en: "Selection and renewal requirements vary. Review the scholarship section in the current application guide.",
      ru: "Критерии отбора и продления различаются. Проверьте раздел стипендий в актуальном гайде.",
    },
    degreeLevels: ["bachelor"],
    nationality: ["international"],
    majors: ["varies"],
    universityIds: ["korea"],
    languageRequirements: [],
    requiredDocuments: ["Varies by scholarship"],
    applicationPeriod: {
      en: "Varies by admission cycle.",
      ru: "Зависит от набора.",
    },
    deadline: null,
    sourceIds: ["ku-admission"],
    lastVerifiedAt: "2026-07-19",
  },
];

export const scholarshipsById = new Map(scholarships.map((item) => [item.id, item]));
