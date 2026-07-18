import type { MoneyRange } from "@/types/domain";

export function formatMoneyRange(value: MoneyRange | null, locale: string): string | null {
  if (!value) return null;
  if (value.min === 0 && value.max === 0) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: value.currency,
      maximumFractionDigits: 0,
    }).format(0);
  }
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: value.currency,
    maximumFractionDigits: 0,
  });
  const amount =
    value.min === value.max
      ? formatter.format(value.min)
      : `${formatter.format(value.min)}–${formatter.format(value.max)}`;
  const periods: Record<"en" | "ru", Record<MoneyRange["period"], string>> = {
    en: { month: "month", semester: "semester", year: "year", "one-time": "one time" },
    ru: { month: "месяц", semester: "семестр", year: "год", "one-time": "разово" },
  };
  const language = locale.startsWith("ru") ? "ru" : "en";
  return `${amount} / ${periods[language][value.period]}`;
}
