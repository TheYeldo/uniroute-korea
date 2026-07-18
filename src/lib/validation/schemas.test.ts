import { defaultProfile } from "@/data/defaults";
import { isSafeRedirect, profileSchema } from "./schemas";
import { describe, expect, it } from "vitest";

describe("validation", () => {
  it("accepts a complete profile", () =>
    expect(
      profileSchema.safeParse({
        ...defaultProfile,
        city: "Almaty",
        grade: "11",
        graduationYear: 2027,
      }).success,
    ).toBe(true));
  it("rejects invalid IELTS scores", () =>
    expect(
      profileSchema.safeParse({ ...defaultProfile, city: "Almaty", grade: "11", ieltsScore: 12 })
        .success,
    ).toBe(false));
  it("allows only locale-scoped internal redirects", () => {
    expect(isSafeRedirect("/ru/dashboard", "ru")).toBe(true);
    expect(isSafeRedirect("https://evil.example", "ru")).toBe(false);
    expect(isSafeRedirect("//evil.example", "ru")).toBe(false);
  });
});
