import type { LocalizedText } from "@/types/domain";

export interface GuideSection {
  heading: LocalizedText;
  body: LocalizedText;
}

export interface Guide {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  sections: GuideSection[];
  sourceIds: string[];
  updatedAt: string;
}

const verifySection: GuideSection = {
  heading: { en: "Final verification", ru: "Финальная проверка" },
  body: {
    en: "Open the current university or government guide, confirm the intake and academic year, and save the source link and checked date. A previous-year PDF is context, not a current requirement.",
    ru: "Откройте текущий гайд университета или государственного органа, проверьте набор и учебный год, сохраните ссылку и дату проверки. PDF прошлого года — контекст, а не актуальное требование.",
  },
};

export const guides: Guide[] = [
  {
    slug: "how-korean-university-admission-works",
    title: {
      en: "How admission to South Korean universities works",
      ru: "Как устроено поступление в университеты Южной Кореи",
    },
    summary: {
      en: "A practical map from eligibility to enrollment for an international applicant.",
      ru: "Практическая схема от проверки права на участие до зачисления иностранного абитуриента.",
    },
    sections: [
      {
        heading: { en: "Start with the admission track", ru: "Начните с трека поступления" },
        body: {
          en: "Universities separate international tracks by nationality and education history. Confirm the exact track before comparing requirements or preparing documents.",
          ru: "Университеты разделяют международные треки по гражданству и истории обучения. Сначала определите точный трек, затем сравнивайте требования и готовьте документы.",
        },
      },
      {
        heading: { en: "Build a source-backed checklist", ru: "Составьте чек-лист по источникам" },
        body: {
          en: "Record eligibility, required documents, language evidence, application method, document delivery method, result date, and tuition payment period separately.",
          ru: "Отдельно запишите право на участие, документы, языковые подтверждения, способ подачи, доставку оригиналов, дату результата и период оплаты.",
        },
      },
      verifySection,
    ],
    sourceIds: ["snu-admission", "ku-admission", "kaist-admission"],
    updatedAt: "2026-07-19",
  },
  {
    slug: "spring-vs-fall-intake",
    title: { en: "Spring vs Fall intake", ru: "Весенний и осенний набор" },
    summary: {
      en: "How timing affects graduation, documents, scholarships, and program availability.",
      ru: "Как время набора влияет на выпуск, документы, стипендии и доступность программ.",
    },
    sections: [
      {
        heading: { en: "The key difference is the calendar", ru: "Главное отличие — календарь" },
        body: {
          en: "Spring classes generally begin around February or March; Fall classes around August or September. Application windows can open many months earlier and differ by university.",
          ru: "Весенние занятия обычно начинаются в феврале–марте, осенние — в августе–сентябре. Заявки могут открываться за много месяцев и различаются по вузам.",
        },
      },
      {
        heading: { en: "Check graduation compatibility", ru: "Сверьте срок выпуска" },
        body: {
          en: "Your final certificate must be available by the date stated in the chosen guide. Expected-graduate rules and final-document deadlines are not identical across universities.",
          ru: "Аттестат должен быть доступен к дате из выбранного гайда. Правила для будущих выпускников и сроки финальных документов различаются.",
        },
      },
      verifySection,
    ],
    sourceIds: ["kaist-eligibility", "postech-calendar", "ku-admission"],
    updatedAt: "2026-07-19",
  },
  {
    slug: "ielts-toefl-topik",
    title: { en: "IELTS, TOEFL, and TOPIK", ru: "IELTS, TOEFL и TOPIK" },
    summary: {
      en: "Choose the test that the target program actually accepts.",
      ru: "Выбирайте экзамен, который действительно принимает целевая программа.",
    },
    sections: [
      {
        heading: { en: "Program language is not enough", ru: "Языка программы недостаточно" },
        body: {
          en: "A program can list courses in English yet still use different admission evidence. Record the exact test, minimum, exemptions, validity period, and whether the rule varies by department.",
          ru: "Даже англоязычная программа может использовать разные подтверждения. Запишите экзамен, минимум, исключения, срок действия и зависимость от факультета.",
        },
      },
      {
        heading: {
          en: "Do not convert scores informally",
          ru: "Не пересчитывайте баллы неофициально",
        },
        body: {
          en: "Use only the score accepted by the university. Testing systems change; for example, IELTS notes that TOEFL iBT comparisons before and after January 2026 should not be assumed equivalent.",
          ru: "Используйте только балл, который принимает университет. Системы меняются: IELTS отдельно предупреждает, что TOEFL iBT до и после января 2026 нельзя считать напрямую сопоставимыми.",
        },
      },
      verifySection,
    ],
    sourceIds: ["ielts-scoring", "skku-admission", "kaist-admission"],
    updatedAt: "2026-07-19",
  },
  {
    slug: "school-documents",
    title: { en: "Required school documents", ru: "Школьные документы для поступления" },
    summary: {
      en: "Plan transcripts, graduation evidence, translations, and verification as separate tasks.",
      ru: "Разделите аттестат, выписку оценок, переводы и легализацию на отдельные задачи.",
    },
    sections: [
      {
        heading: { en: "Request originals early", ru: "Запрашивайте оригиналы заранее" },
        body: {
          en: "Schools may need time to issue transcripts, expected-graduation letters, or sealed records. Record who issues each document and how many originals you need.",
          ru: "Школе может понадобиться время на выписку оценок, справку о будущем выпуске или запечатанные документы. Запишите ответственного и число оригиналов.",
        },
      },
      {
        heading: {
          en: "Separate content from legalization",
          ru: "Отделяйте содержание от легализации",
        },
        body: {
          en: "Translation, notarization, apostille or consular authentication are different steps. Follow the exact wording in the current guide and local issuing authority guidance.",
          ru: "Перевод, нотариальное заверение, апостиль и консульская легализация — разные этапы. Следуйте формулировкам актуального гайда и органа выдачи.",
        },
      },
      verifySection,
    ],
    sourceIds: ["khu-admission", "snu-admission", "ku-admission"],
    updatedAt: "2026-07-19",
  },
  {
    slug: "translations-notarization-apostille",
    title: {
      en: "Translation, notarization, and apostille",
      ru: "Перевод, нотариальное заверение и апостиль",
    },
    summary: {
      en: "Treat document legalization as a sequence, not one checkbox.",
      ru: "Считайте легализацию последовательностью, а не одним пунктом.",
    },
    sections: [
      {
        heading: { en: "Map the chain", ru: "Разложите цепочку" },
        body: {
          en: "For every document, record issuer, original language, required target language, translator rules, notarization, apostille or consular authentication, and the receiving deadline.",
          ru: "Для каждого документа запишите орган выдачи, исходный и целевой язык, правила перевода, нотариат, апостиль или консульскую легализацию и дедлайн приёма.",
        },
      },
      verifySection,
    ],
    sourceIds: ["khu-admission", "ku-admission"],
    updatedAt: "2026-07-19",
  },
  {
    slug: "how-scholarships-work",
    title: { en: "How scholarships work", ru: "Как работают стипендии" },
    summary: {
      en: "Separate government, admission, merit, and tuition-waiver routes.",
      ru: "Разделяйте государственные, вступительные, академические стипендии и скидки.",
    },
    sections: [
      {
        heading: { en: "Funding is not one category", ru: "Финансирование бывает разным" },
        body: {
          en: "A tuition waiver may not cover housing or living expenses. Record coverage, duration, renewal conditions, separate application, and whether the deadline comes before university admission.",
          ru: "Освобождение от оплаты может не покрывать жильё и жизнь. Запишите покрытие, срок, продление, отдельную заявку и порядок дедлайнов.",
        },
      },
      {
        heading: { en: "Potential match is not eligibility", ru: "Совпадение не означает право" },
        body: {
          en: "Use profile matching to identify candidates for research, then confirm nationality, academic, age, language, and track rules in the official call.",
          ru: "Подбор помогает найти варианты для исследования, но гражданство, успеваемость, возраст, язык и трек подтверждаются в официальном конкурсе.",
        },
      },
      verifySection,
    ],
    sourceIds: ["gks-2026", "postech-scholarship", "ku-admission"],
    updatedAt: "2026-07-19",
  },
  {
    slug: "compare-tuition-and-living-costs",
    title: {
      en: "Compare tuition and living costs",
      ru: "Как сравнить обучение и расходы на жизнь",
    },
    summary: {
      en: "Normalize currency, period, campus, and what each number includes.",
      ru: "Приведите к одному виду валюту, период, кампус и состав суммы.",
    },
    sections: [
      {
        heading: { en: "Compare like with like", ru: "Сравнивайте сопоставимые суммы" },
        body: {
          en: "Convert semester tuition to the same annual basis, keep application fees separate, and label estimates. Program, credit load, insurance, and campus can change the total.",
          ru: "Переведите семестровую стоимость в общий годовой формат, сборы держите отдельно, оценки помечайте. Программа, нагрузка, страховка и кампус меняют итог.",
        },
      },
      verifySection,
    ],
    sourceIds: ["study-korea-tuition", "study-korea-costs"],
    updatedAt: "2026-07-19",
  },
  {
    slug: "verify-official-requirements",
    title: {
      en: "How to verify official requirements",
      ru: "Как проверять официальные требования",
    },
    summary: {
      en: "A repeatable source-checking method for changing admission data.",
      ru: "Повторяемый метод проверки меняющихся данных о поступлении.",
    },
    sections: [
      {
        heading: { en: "Use a source hierarchy", ru: "Используйте иерархию источников" },
        body: {
          en: "Prefer the current university admission guide, then the program page, Study in Korea or another government source. Secondary summaries are discovery aids, not final evidence.",
          ru: "Сначала актуальный гайд приёмной комиссии, затем страница программы и Study in Korea или другой госисточник. Вторичные обзоры — только для поиска.",
        },
      },
      verifySection,
    ],
    sourceIds: ["ku-admission", "study-korea-tuition"],
    updatedAt: "2026-07-19",
  },
  {
    slug: "common-application-mistakes",
    title: { en: "Common application mistakes", ru: "Частые ошибки при подаче" },
    summary: {
      en: "Avoid track, deadline, document, and source-version errors.",
      ru: "Избегайте ошибок с треком, сроками, документами и версиями источников.",
    },
    sections: [
      {
        heading: { en: "The high-risk mistakes", ru: "Самые рискованные ошибки" },
        body: {
          en: "Using the wrong international track, relying on an expired guide, assuming the online deadline also covers originals, and treating recommended language scores as mandatory are common avoidable errors.",
          ru: "Неверный международный трек, устаревший гайд, смешение онлайн-дедлайна со сроком оригиналов и путаница рекомендованных баллов с обязательными — частые ошибки.",
        },
      },
      verifySection,
    ],
    sourceIds: ["ku-admission", "khu-admission", "kaist-admission"],
    updatedAt: "2026-07-19",
  },
  {
    slug: "personal-statement",
    title: { en: "Preparing a personal statement", ru: "Как подготовить personal statement" },
    summary: {
      en: "Connect evidence from your past to a specific academic direction.",
      ru: "Свяжите подтверждённый опыт с конкретной учебной целью.",
    },
    sections: [
      {
        heading: { en: "Make every claim verifiable", ru: "Пишите проверяемо" },
        body: {
          en: "Use concrete examples, explain your role and learning, and connect them to the program. Follow each university’s format, word count, prohibited assistance rules, and submission method.",
          ru: "Используйте конкретные примеры, объясняйте свою роль и выводы и связывайте их с программой. Соблюдайте формат, объём, правила помощи и способ подачи конкретного вуза.",
        },
      },
      verifySection,
    ],
    sourceIds: ["snu-admission", "ku-admission"],
    updatedAt: "2026-07-19",
  },
];

export const guidesBySlug = new Map(guides.map((guide) => [guide.slug, guide]));
