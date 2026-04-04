import type { MissionCategory } from "@/lib/server/types";

export interface DaySchedule {
  day: number;
  missionIndex: number;
  category: MissionCategory;
}

/**
 * 7-day onboarding schedule. Each day is a mission.
 * After day 7, the system switches to AI-generated 3-choice mode.
 * Deep dives now happen as an optional continuation after each mission,
 * not on separate days.
 */
export const FIRST_7_DAY_SCHEDULE: DaySchedule[] = [
  { day: 1, missionIndex: 0, category: "world" },        // 해저 탐사대
  { day: 2, missionIndex: 1, category: "perspective" },   // 유튜버 논란
  { day: 3, missionIndex: 2, category: "value" },         // AI 초상화
  { day: 4, missionIndex: 3, category: "perspective" },   // 전학생의 이틀
  { day: 5, missionIndex: 4, category: "real" },          // 편의점 설계도
  { day: 6, missionIndex: 5, category: "world" },         // 나라 살림 48시간
  { day: 7, missionIndex: 6, category: "synthesis" },     // 3가지 물건
];

export function getDaySchedule(sequenceDay: number): DaySchedule | null {
  if (sequenceDay < 1 || sequenceDay > FIRST_7_DAY_SCHEDULE.length) return null;
  return FIRST_7_DAY_SCHEDULE[sequenceDay - 1] ?? null;
}

export function getAssignedCategoryForSequenceDay(day: number): MissionCategory | null {
  const schedule = getDaySchedule(day);
  if (!schedule) return null;
  return schedule.category ?? null;
}
