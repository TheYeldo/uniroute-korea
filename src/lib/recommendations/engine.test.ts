import { defaultProfile } from "@/data/defaults";
import { programs } from "@/data/programs";
import { universitiesById } from "@/data/universities";
import { recommendUniversity } from "./engine";
import { describe, expect, it } from "vitest";

describe("recommendUniversity", () => {
  it("explains matches, tradeoffs, and missing values without admission probability", () => {
    const result = recommendUniversity(
      { ...defaultProfile, preferredMajor: "Computer Science", studyLanguage: "english" },
      universitiesById.get("postech")!,
      programs,
    );
    expect(result.matched).toContain("major");
    expect(result.matched).toContain("instruction-language");
    expect(result.status).toBe("strong");
    expect(result).not.toHaveProperty("probability");
  });

  it("marks an unavailable degree as mismatch", () => {
    const university = { ...universitiesById.get("korea")!, degreeLevels: ["bachelor" as const] };
    const result = recommendUniversity(
      { ...defaultProfile, degreeLevel: "doctoral" },
      university,
      programs,
    );
    expect(result.mismatched).toContain("degree");
  });
});
