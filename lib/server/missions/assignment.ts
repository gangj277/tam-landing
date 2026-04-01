import type { MissionCategory } from "@/lib/server/types";

export type DayType = "mission" | "deepdive";

export interface DaySchedule {
  day: number;
  type: DayType;
  missionIndex?: number;
  linkedMissionDay?: number;
  category?: MissionCategory;
}

export const FIRST_14_DAY_SCHEDULE: DaySchedule[] = [
  { day: 1,  type: "mission",  missionIndex: 0, category: "world" },
  { day: 2,  type: "deepdive", linkedMissionDay: 1 },
  { day: 3,  type: "mission",  missionIndex: 1, category: "world" },
  { day: 4,  type: "deepdive", linkedMissionDay: 3 },
  { day: 5,  type: "mission",  missionIndex: 2, category: "value" },
  { day: 6,  type: "deepdive", linkedMissionDay: 5 },
  { day: 7,  type: "mission",  missionIndex: 3, category: "perspective" },
  { day: 8,  type: "deepdive", linkedMissionDay: 7 },
  { day: 9,  type: "mission",  missionIndex: 4, category: "real" },
  { day: 10, type: "deepdive", linkedMissionDay: 9 },
  { day: 11, type: "mission",  missionIndex: 5, category: "value" },
  { day: 12, type: "deepdive", linkedMissionDay: 11 },
  { day: 13, type: "mission",  missionIndex: 6, category: "synthesis" },
  { day: 14, type: "deepdive", linkedMissionDay: 13 },
];

export function getDaySchedule(sequenceDay: number): DaySchedule | null {
  if (sequenceDay < 1 || sequenceDay > 14) return null;
  return FIRST_14_DAY_SCHEDULE[sequenceDay - 1] ?? null;
}

export function isDeepDiveDay(sequenceDay: number): boolean {
  if (sequenceDay <= 14) {
    const schedule = FIRST_14_DAY_SCHEDULE[sequenceDay - 1];
    return schedule?.type === "deepdive";
  }
  return sequenceDay % 2 === 0;
}

export function isMissionDay(sequenceDay: number): boolean {
  return !isDeepDiveDay(sequenceDay);
}

export function getAssignedCategoryForSequenceDay(day: number): MissionCategory | null {
  const schedule = getDaySchedule(day);
  if (!schedule || schedule.type !== "mission") return null;
  return schedule.category ?? null;
}
