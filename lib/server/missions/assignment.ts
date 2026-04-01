import type { MissionCategory } from "@/lib/server/types";

export type DayType = "mission" | "deepdive";

export interface DaySchedule {
  day: number;
  type: DayType;
  missionIndex?: number;
  category?: MissionCategory;
}

export const FIRST_14_DAY_SCHEDULE: DaySchedule[] = [
  { day: 1,  type: "mission",   missionIndex: 0, category: "world" },
  { day: 2,  type: "deepdive" },
  { day: 3,  type: "mission",   missionIndex: 1, category: "world" },
  { day: 4,  type: "deepdive" },
  { day: 5,  type: "mission",   missionIndex: 2, category: "value" },
  { day: 6,  type: "deepdive" },
  { day: 7,  type: "mission",   missionIndex: 3, category: "perspective" },
  { day: 8,  type: "deepdive" },
  { day: 9,  type: "mission",   missionIndex: 4, category: "real" },
  { day: 10, type: "deepdive" },
  { day: 11, type: "mission",   missionIndex: 5, category: "value" },
  { day: 12, type: "deepdive" },
  { day: 13, type: "mission",   missionIndex: 6, category: "synthesis" },
  { day: 14, type: "deepdive" },
];

export function getDaySchedule(sequenceDay: number): DaySchedule | null {
  if (sequenceDay < 1 || sequenceDay > FIRST_14_DAY_SCHEDULE.length) return null;
  return FIRST_14_DAY_SCHEDULE[sequenceDay - 1] ?? null;
}

export function getAssignedCategoryForSequenceDay(day: number): MissionCategory | null {
  const schedule = getDaySchedule(day);
  if (!schedule) return null;
  return schedule.category ?? null;
}

export function isDeepDiveDay(sequenceDay: number): boolean {
  const schedule = getDaySchedule(sequenceDay);
  return schedule?.type === "deepdive";
}

/**
 * Returns the missionIndex of the most recent mission day BEFORE this deepdive day.
 * Used to link a deepdive to the previous mission's expert.
 */
export function getPreviousMissionIndex(sequenceDay: number): number | null {
  for (let d = sequenceDay - 1; d >= 1; d--) {
    const s = getDaySchedule(d);
    if (s?.type === "mission" && s.missionIndex != null) return s.missionIndex;
  }
  return null;
}
