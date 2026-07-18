import { describe, expect, it } from "vitest";
import { localizedAlternates } from "./seo";

describe("localizedAlternates", () => {
  it("builds a Russian-default canonical and complete language alternatives", () => {
    expect(localizedAlternates("en", "universities/korea-university")).toEqual({
      canonical: "/en/universities/korea-university",
      languages: {
        ru: "/ru/universities/korea-university",
        en: "/en/universities/korea-university",
        "x-default": "/ru/universities/korea-university",
      },
    });
  });

  it("does not add a trailing slash to locale roots", () => {
    expect(localizedAlternates("ru")).toMatchObject({ canonical: "/ru" });
  });
});
