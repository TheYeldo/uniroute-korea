import { universities } from "@/data/universities";
import { filterUniversities } from "./filter";
import { describe, expect, it } from "vitest";

describe("filterUniversities", () => {
  it("searches names, cities, and subjects", () =>
    expect(filterUniversities(universities, { query: "Pohang" }).map((item) => item.id)).toEqual([
      "postech",
    ]));
  it("does not treat missing dormitory data as false confirmation", () =>
    expect(
      filterUniversities(universities, { dormitory: true }).every(
        (item) => item.dormitory.value === true,
      ),
    ).toBe(true));
  it("filters verified English instruction", () =>
    expect(
      filterUniversities(universities, { language: "english" }).some(
        (item) => item.id === "postech",
      ),
    ).toBe(true));
});
