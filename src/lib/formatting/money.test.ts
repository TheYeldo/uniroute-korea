import { formatMoneyRange } from "./money";
import { describe, expect, it } from "vitest";

describe("formatMoneyRange", () => {
  it("returns null for missing data", () => expect(formatMoneyRange(null, "en")).toBeNull());
  it("preserves currency and period", () => {
    const result = formatMoneyRange(
      { min: 750000, max: 1000000, currency: "KRW", period: "month" },
      "en",
    );
    expect(result).toContain("₩");
    expect(result).toContain("month");
  });
  it("localizes periods", () => {
    const result = formatMoneyRange(
      { min: 750000, max: 1000000, currency: "KRW", period: "month" },
      "ru",
    );
    expect(result).toContain("месяц");
  });
});
