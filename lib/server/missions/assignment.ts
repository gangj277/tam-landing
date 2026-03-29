import type { MissionCategory } from "@/lib/server/types";

export const FIRST_SEVEN_DAY_CATEGORY_SEQUENCE: MissionCategory[] = [
  "world",
  "world",
  "value",
  "perspective",
  "real",
  "value",
  "synthesis",
];

export function getAssignedCategoryForSequenceDay(day: number): MissionCategory | null {
  if (day < 1 || day > FIRST_SEVEN_DAY_CATEGORY_SEQUENCE.length) {
    return null;
  }

  return FIRST_SEVEN_DAY_CATEGORY_SEQUENCE[day - 1] ?? null;
}
