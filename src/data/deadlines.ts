import type { AdmissionDeadline } from "@/types/domain";

export const deadlines: AdmissionDeadline[] = [
  {
    id: "ku-spring-2027-application",
    universityId: "korea",
    title: {
      en: "Korea University Spring 2027 online application",
      ru: "Онлайн-заявка Korea University — весна 2027",
    },
    category: "application",
    intake: "spring",
    academicYear: "2027",
    startsAt: "2026-08-03T10:00:00+09:00",
    endsAt: "2026-08-31T17:00:00+09:00",
    timezone: "Asia/Seoul",
    official: true,
    sourceId: "ku-admission",
  },
  {
    id: "ku-spring-2027-documents",
    universityId: "korea",
    title: {
      en: "Korea University Spring 2027 document submission",
      ru: "Подача документов Korea University — весна 2027",
    },
    category: "documents",
    intake: "spring",
    academicYear: "2027",
    startsAt: "2026-08-03T10:00:00+09:00",
    endsAt: "2026-09-07T17:00:00+09:00",
    timezone: "Asia/Seoul",
    official: true,
    sourceId: "ku-admission",
  },
  {
    id: "postech-spring-2027-application",
    universityId: "postech",
    title: {
      en: "POSTECH Spring 2027 international application",
      ru: "Международная заявка POSTECH — весна 2027",
    },
    category: "application",
    intake: "spring",
    academicYear: "2027",
    startsAt: "2026-08-25T00:00:00+09:00",
    endsAt: "2026-09-02T23:59:00+09:00",
    timezone: "Asia/Seoul",
    official: true,
    sourceId: "postech-calendar",
  },
];

export const futureDeadlines = (now = new Date()) =>
  deadlines.filter((item) => new Date(item.endsAt) >= now);
