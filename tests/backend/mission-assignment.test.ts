import { describe, expect, it } from "vitest";

import {
  FIRST_SEVEN_DAY_CATEGORY_SEQUENCE,
  getAssignedCategoryForSequenceDay,
} from "@/lib/server/missions/assignment";

describe("mission assignment", () => {
  it("uses the fixed first-seven-day category sequence from the spec", () => {
    expect(FIRST_SEVEN_DAY_CATEGORY_SEQUENCE).toEqual([
      "world",
      "world",
      "value",
      "perspective",
      "real",
      "value",
      "synthesis",
    ]);
  });

  it("returns the spec category for a 1-based sequence day", () => {
    expect(getAssignedCategoryForSequenceDay(1)).toBe("world");
    expect(getAssignedCategoryForSequenceDay(4)).toBe("perspective");
    expect(getAssignedCategoryForSequenceDay(7)).toBe("synthesis");
  });
});
