import { daysUntil } from "@/lib/formatting/dates";
import type {
  AdmissionDeadline,
  Program,
  ReadinessResult,
  TrackedDocument,
  University,
  UserProfile,
} from "@/types/domain";

const text = (en: string, ru: string) => ({ en, ru });

export function evaluateReadiness(input: {
  profile: UserProfile;
  university: University;
  program?: Program;
  documents: TrackedDocument[];
  deadlines: AdmissionDeadline[];
  now?: Date;
}): ReadinessResult[] {
  const { profile, university, program, documents, deadlines, now = new Date() } = input;
  const results: ReadinessResult[] = [];

  results.push(
    profile.averageGrade === null
      ? {
          category: "academics",
          status: "missing",
          reason: text(
            "No average grade is saved, and this university’s catalog record does not invent a minimum.",
            "Средний балл не указан, а карточка университета не выдумывает отсутствующий минимум.",
          ),
          action: text(
            "Add your grading system and approximate average, then check the current admission guide.",
            "Добавьте систему оценок и примерный средний балл, затем проверьте актуальный гайд.",
          ),
        }
      : {
          category: "academics",
          status: "verify",
          reason: text(
            "Your academic profile is recorded, but no universal official minimum is confirmed for this university.",
            "Учебный профиль заполнен, но единый официальный минимум для университета не подтверждён.",
          ),
          action: text(
            "Compare your transcript with the current department and track guidance.",
            "Сопоставьте выписку оценок с требованиями факультета и трека.",
          ),
        },
  );

  const requiredGraduationYear = profile.admissionYear;
  results.push(
    profile.graduationYear === null
      ? {
          category: "graduation",
          status: "missing",
          reason: text("Expected graduation year is missing.", "Не указан ожидаемый год выпуска."),
          action: text(
            "Add the year and confirm the final-certificate deadline.",
            "Добавьте год и проверьте срок финального аттестата.",
          ),
        }
      : profile.graduationYear <= requiredGraduationYear
        ? {
            category: "graduation",
            status: "likely",
            reason: text(
              "Your saved graduation year is not later than the target admission year.",
              "Сохранённый год выпуска не позже целевого года поступления.",
            ),
            action: text(
              "Verify the exact graduation date required by the current guide.",
              "Проверьте точную дату выпуска в актуальном гайде.",
            ),
          }
        : {
            category: "graduation",
            status: "needs-improvement",
            reason: text(
              "Your saved graduation year is later than the target admission year.",
              "Сохранённый год выпуска позже целевого года поступления.",
            ),
            action: text(
              "Choose a later intake or verify an expected-graduate route.",
              "Выберите более поздний набор или проверьте трек для будущих выпускников.",
            ),
          },
  );

  const englishReq =
    program?.languageRequirements.find((item) => item.test === "IELTS") ??
    university.languageRequirements.find((item) => item.test === "IELTS");
  if (!englishReq) {
    results.push({
      category: "english",
      status: "verify",
      reason: text(
        "No program-specific IELTS minimum is confirmed in this record.",
        "В карточке нет подтверждённого минимума IELTS для программы.",
      ),
      action: text(
        "Open the official program or admission guide.",
        "Откройте официальный гайд программы или приёма.",
      ),
    });
  } else if (englishReq.minimum === null) {
    const recommended = englishReq.recommended;
    results.push({
      category: "english",
      status: profile.ieltsScore ? "likely" : "missing",
      reason: text(
        recommended
          ? `The source presents IELTS ${recommended} as recommended, not a universal minimum.`
          : "The required English level varies or is not expressed as a confirmed minimum.",
        recommended
          ? `Источник указывает IELTS ${recommended} как рекомендацию, а не единый обязательный минимум.`
          : "Уровень английского зависит от программы или не указан подтверждённым минимумом.",
      ),
      action: text(
        "Verify the chosen admission unit before setting a test milestone.",
        "Проверьте выбранное подразделение до постановки языкового дедлайна.",
      ),
    });
  } else if ((profile.ieltsScore ?? 0) >= englishReq.minimum) {
    results.push({
      category: "english",
      status: "meets",
      reason: text(
        `The listed minimum is IELTS ${englishReq.minimum}; your saved score is ${profile.ieltsScore}.`,
        `Указанный минимум — IELTS ${englishReq.minimum}; ваш сохранённый балл — ${profile.ieltsScore}.`,
      ),
    });
  } else {
    results.push({
      category: "english",
      status: "needs-improvement",
      reason: text(
        `The listed minimum is IELTS ${englishReq.minimum}; your saved score is ${profile.ieltsScore ?? "missing"}.`,
        `Указанный минимум — IELTS ${englishReq.minimum}; ваш балл — ${profile.ieltsScore ?? "не указан"}.`,
      ),
      action: text(
        "Create an IELTS preparation milestone before the application deadline.",
        "Добавьте этап подготовки к IELTS до дедлайна заявки.",
      ),
    });
  }

  const needsKorean =
    program?.instructionLanguage === "korean" || profile.studyLanguage === "korean";
  results.push(
    needsKorean
      ? profile.topikScore
        ? {
            category: "korean",
            status: "verify",
            reason: text(
              `TOPIK level ${profile.topikScore} is saved, but the department-specific minimum still requires verification.`,
              `Сохранён TOPIK ${profile.topikScore}, но минимум факультета нужно проверить.`,
            ),
          }
        : {
            category: "korean",
            status: "needs-improvement",
            reason: text(
              "The target language is Korean, but no TOPIK level is saved.",
              "Целевой язык — корейский, но уровень TOPIK не указан.",
            ),
            action: text(
              "Check the program minimum and create a TOPIK milestone.",
              "Проверьте минимум программы и добавьте этап TOPIK.",
            ),
          }
      : {
          category: "korean",
          status: "likely",
          reason: text(
            "Korean is not selected as the main instruction language; it may still be valuable for study and daily life.",
            "Корейский не выбран основным языком обучения, но полезен для учёбы и жизни.",
          ),
        },
  );

  if (university.tuition.value === null || profile.annualTuitionBudget === null) {
    results.push({
      category: "budget",
      status: "missing",
      reason: text(
        "The tuition or your budget is not confirmed, so affordability cannot be concluded.",
        "Стоимость или ваш бюджет не подтверждены, поэтому доступность нельзя определить.",
      ),
      action: text(
        "Verify program tuition and include living costs in the same academic-year plan.",
        "Проверьте стоимость программы и добавьте расходы на жизнь за тот же год.",
      ),
    });
  } else {
    const annualMax =
      university.tuition.value.period === "semester"
        ? university.tuition.value.max * 2
        : university.tuition.value.max;
    results.push(
      annualMax <= profile.annualTuitionBudget
        ? {
            category: "budget",
            status: "likely",
            reason: text(
              "The sourced tuition range fits within the saved annual tuition budget.",
              "Подтверждённый диапазон стоимости укладывается в годовой бюджет.",
            ),
          }
        : {
            category: "budget",
            status: "needs-improvement",
            reason: text(
              "The sourced tuition range exceeds the saved annual tuition budget.",
              "Подтверждённая стоимость превышает сохранённый годовой бюджет.",
            ),
            action: text(
              "Research verified scholarships or adjust the shortlist.",
              "Изучите подтверждённые стипендии или скорректируйте шорт-лист.",
            ),
          },
    );
  }

  results.push(
    profile.scholarshipRequired
      ? university.scholarshipAvailability.value === true
        ? {
            category: "scholarship",
            status: "likely",
            reason: text(
              "The university publishes scholarship options, but selection is not guaranteed.",
              "Университет публикует стипендии, но получение не гарантировано.",
            ),
            action: text(
              "Track the separate scholarship rules and earlier deadlines.",
              "Отслеживайте отдельные условия и более ранние дедлайны.",
            ),
          }
        : {
            category: "scholarship",
            status: "missing",
            reason: text(
              "A scholarship is required, but availability is not confirmed in this record.",
              "Стипендия обязательна, но её наличие не подтверждено в карточке.",
            ),
            action: text(
              "Open the current official scholarship page before keeping this target.",
              "Откройте актуальную официальную страницу стипендий.",
            ),
          }
      : {
          category: "scholarship",
          status: "likely",
          reason: text(
            "Your plan is not fully dependent on scholarship funding.",
            "Ваш план не полностью зависит от стипендии.",
          ),
        },
  );

  const readyDocuments = documents.filter((item) =>
    ["ready", "submitted"].includes(item.status),
  ).length;
  results.push(
    documents.length === 0
      ? {
          category: "documents",
          status: "missing",
          reason: text("No document checklist exists yet.", "Чек-лист документов ещё не создан."),
          action: text(
            "Create the standard checklist and adapt it to the official guide.",
            "Создайте стандартный чек-лист и адаптируйте его к официальному гайду.",
          ),
        }
      : readyDocuments === documents.length
        ? {
            category: "documents",
            status: "meets",
            reason: text(
              "Every tracked document is marked ready or submitted.",
              "Все отслеживаемые документы отмечены готовыми или поданными.",
            ),
          }
        : {
            category: "documents",
            status: "needs-improvement",
            reason: text(
              `${readyDocuments} of ${documents.length} tracked documents are ready or submitted.`,
              `Готово или подано ${readyDocuments} из ${documents.length} документов.`,
            ),
            action: text(
              "Work through the earliest due document first.",
              "Начните с документа с ближайшим сроком.",
            ),
          },
  );

  const relevant = deadlines
    .filter((item) => item.universityId === university.id)
    .sort((a, b) => a.endsAt.localeCompare(b.endsAt));
  const nextDeadline = relevant.find((item) => daysUntil(item.endsAt, now) >= 0);
  const passed = relevant.at(-1) && daysUntil(relevant.at(-1)!.endsAt, now) < 0;
  results.push(
    nextDeadline
      ? {
          category: "deadline",
          status: daysUntil(nextDeadline.endsAt, now) <= 30 ? "needs-improvement" : "likely",
          reason: text(
            `The next verified deadline is in ${daysUntil(nextDeadline.endsAt, now)} days and uses Asia/Seoul time.`,
            `Ближайший подтверждённый дедлайн через ${daysUntil(nextDeadline.endsAt, now)} дн. по времени Asia/Seoul.`,
          ),
          action: text(
            "Open the source and confirm submission and document cutoffs separately.",
            "Откройте источник и отдельно проверьте сроки заявки и документов.",
          ),
        }
      : passed
        ? {
            category: "deadline",
            status: "passed",
            reason: text(
              "The verified deadline in this dataset has passed.",
              "Подтверждённый дедлайн из базы уже прошёл.",
            ),
            action: text(
              "Wait for the next official cycle; do not reuse the expired date.",
              "Дождитесь нового официального набора; не используйте старую дату.",
            ),
          }
        : {
            category: "deadline",
            status: "verify",
            reason: text(
              "No future official deadline is confirmed for this university.",
              "Для университета нет подтверждённого будущего дедлайна.",
            ),
            action: text(
              "Monitor the official admissions page.",
              "Следите за официальной страницей приёма.",
            ),
          },
  );

  const compatible = Boolean(
    program &&
    program.degreeLevel === profile.degreeLevel &&
    program.field.toLocaleLowerCase().includes(profile.preferredMajor.toLocaleLowerCase()),
  );
  results.push(
    compatible
      ? {
          category: "compatibility",
          status: "likely",
          reason: text(
            "The selected program matches the saved degree level and major field.",
            "Выбранная программа совпадает с уровнем и направлением профиля.",
          ),
          action: text(
            "Verify the current program availability and instruction language.",
            "Проверьте доступность программы и язык обучения.",
          ),
        }
      : {
          category: "compatibility",
          status: program ? "needs-improvement" : "missing",
          reason: text(
            program
              ? "The selected program does not directly match the saved major or degree level."
              : "No program is selected for this university.",
            program
              ? "Выбранная программа не совпадает с направлением или уровнем профиля."
              : "Для университета не выбрана программа.",
          ),
          action: text(
            "Select a sourced program before relying on this assessment.",
            "Выберите программу с источником до использования оценки.",
          ),
        },
  );

  return results;
}
