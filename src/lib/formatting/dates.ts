import { differenceInCalendarDays, formatISO, isAfter, parseISO, subMonths } from "date-fns";

export function daysUntil(value: string, now = new Date()): number {
  return differenceInCalendarDays(parseISO(value), now);
}

export function isDeadlinePassed(value: string, now = new Date()): boolean {
  return isAfter(now, parseISO(value));
}

export function suggestedDate(targetIntake: string, monthsBefore: number): string {
  return formatISO(subMonths(parseISO(`${targetIntake}-01`), monthsBefore), {
    representation: "date",
  });
}

export function toIcsDate(value: string): string {
  return new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}
