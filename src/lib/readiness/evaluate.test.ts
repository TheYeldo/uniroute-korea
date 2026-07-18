import { defaultProfile } from "@/data/defaults";
import { deadlines } from "@/data/deadlines";
import { programsById } from "@/data/programs";
import { universitiesById } from "@/data/universities";
import { evaluateReadiness } from "./evaluate";
import { describe, expect, it } from "vitest";

describe("evaluateReadiness", () => {
  it("keeps a recommended KAIST IELTS score distinct from a minimum", () => {
    const results = evaluateReadiness({
      profile: { ...defaultProfile, ieltsScore: 5.5 },
      university: universitiesById.get("kaist")!,
      program: programsById.get("kaist-undeclared-cs"),
      documents: [],
      deadlines,
      now: new Date("2026-07-19T00:00:00Z"),
    });
    const english = results.find((item) => item.category === "english");
    expect(english?.status).toBe("likely");
    expect(english?.reason.en).toContain("recommended");
  });

  it("reports missing documents transparently", () => {
    const results = evaluateReadiness({
      profile: defaultProfile,
      university: universitiesById.get("korea")!,
      documents: [],
      deadlines,
    });
    expect(results.find((item) => item.category === "documents")?.status).toBe("missing");
  });
});
