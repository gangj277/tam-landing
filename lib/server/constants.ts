import { MISSIONS as DUMMY_MISSIONS } from "@/lib/dummy-data";
import type { Mission } from "@/lib/server/types";

export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
export const PARENT_VERIFIED_TTL_SECONDS = 60 * 5;
export const RESET_PIN_TTL_SECONDS = 60 * 15;
export const REPORT_DOWNLOAD_TTL_SECONDS = 60 * 15;
export const SYSTEM_CREATED_AT = "2026-03-29T00:00:00.000Z";

export const seededMissions: Mission[] = DUMMY_MISSIONS.map((mission) => ({
  ...mission,
  isActive: true,
  createdAt: SYSTEM_CREATED_AT,
}));

export { DUMMY_MISSIONS };
