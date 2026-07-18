import { canAccessOwnedRecord, isPublicDataTable } from "./access-control";
import { describe, expect, it } from "vitest";

describe("access control utilities", () => {
  it("denies anonymous and cross-user access", () => {
    expect(canAccessOwnedRecord(null, "user-a")).toBe(false);
    expect(canAccessOwnedRecord("user-b", "user-a")).toBe(false);
  });
  it("allows the owner", () => expect(canAccessOwnedRecord("user-a", "user-a")).toBe(true));
  it("keeps notes private while universities are public", () => {
    expect(isPublicDataTable("universities")).toBe(true);
    expect(isPublicDataTable("notes")).toBe(false);
  });
});
