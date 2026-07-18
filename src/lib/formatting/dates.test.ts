import { daysUntil, isDeadlinePassed, suggestedDate, toIcsDate } from "./dates";
import { describe, expect, it } from "vitest";

describe("date calculations", () => {
  it("calculates calendar days deterministically", () =>
    expect(daysUntil("2026-07-29", new Date("2026-07-19T12:00:00Z"))).toBe(10));
  it("detects expired deadlines", () =>
    expect(isDeadlinePassed("2026-01-01", new Date("2026-07-19"))).toBe(true));
  it("creates suggested milestones", () => expect(suggestedDate("2027-09", 6)).toBe("2027-03-01"));
  it("formats ICS timestamps", () =>
    expect(toIcsDate("2026-08-31T08:00:00.000Z")).toBe("20260831T080000Z"));
});
