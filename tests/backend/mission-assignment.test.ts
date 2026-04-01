import { describe, expect, it } from "vitest";

import {
  FIRST_14_DAY_SCHEDULE,
  getAssignedCategoryForSequenceDay,
  isDeepDiveDay,
} from "@/lib/server/missions/assignment";

describe("mission assignment", () => {
  it("has a 14-day alternating mission/deepdive schedule", () => {
    expect(FIRST_14_DAY_SCHEDULE).toHaveLength(14);
    // Odd days are missions, even days are deepdives
    expect(FIRST_14_DAY_SCHEDULE[0].type).toBe("mission");
    expect(FIRST_14_DAY_SCHEDULE[1].type).toBe("deepdive");
    expect(FIRST_14_DAY_SCHEDULE[2].type).toBe("mission");
    expect(FIRST_14_DAY_SCHEDULE[3].type).toBe("deepdive");
  });

  it("returns the spec category for mission days", () => {
    expect(getAssignedCategoryForSequenceDay(1)).toBe("world");
    expect(getAssignedCategoryForSequenceDay(7)).toBe("perspective");
    expect(getAssignedCategoryForSequenceDay(13)).toBe("synthesis");
  });

  it("returns null category for deepdive days", () => {
    expect(getAssignedCategoryForSequenceDay(2)).toBeNull();
    expect(getAssignedCategoryForSequenceDay(4)).toBeNull();
  });

  it("correctly identifies deepdive days", () => {
    expect(isDeepDiveDay(1)).toBe(false);
    expect(isDeepDiveDay(2)).toBe(true);
    expect(isDeepDiveDay(3)).toBe(false);
    expect(isDeepDiveDay(4)).toBe(true);
  });
});
