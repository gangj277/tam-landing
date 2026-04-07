import type {
  AuthTokenPayload,
  ChildProfile,
  ConfidenceLevel,
  Mission,
  MissionAssignment,
  MissionCategory,
  MissionSession,
  PublicChild,
  SessionReaction,
  UserProfileSnapshot,
  ValueTag,
} from "@/lib/server/types";
import { ApiError } from "@/lib/server/utils/http";

export function generateId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function toPublicChild(child: ChildProfile): PublicChild {
  return {
    id: child.id,
    name: child.name,
    age: child.age,
    avatarSeed: child.avatarSeed,
    isDefault: child.isDefault,
  };
}

export function deriveAvatarSeed(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "") || "child";
}

export function parentIsFresh(payload: AuthTokenPayload) {
  if (!payload.parentVerified || !payload.parentVerifiedAt) {
    return false;
  }

  const PARENT_VERIFIED_TTL_SECONDS = 60 * 5;
  return Date.now() - new Date(payload.parentVerifiedAt).getTime() <= PARENT_VERIFIED_TTL_SECONDS * 1000;
}

export function isSessionExpired(session: MissionSession) {
  return session.status === "active" && new Date(session.expiresAt).getTime() <= Date.now();
}

export function ensureSessionIsActive(session: MissionSession) {
  if (session.status !== "active") {
    throw new ApiError(409, "SESSION_NOT_ACTIVE", "Only active sessions can be updated");
  }
  if (isSessionExpired(session)) {
    throw new ApiError(409, "SESSION_EXPIRED", "This session has expired and can no longer be updated");
  }
}

export function createChoiceLabel(mission: Mission, choiceId: string) {
  return mission.choices.find((choice) => choice.id === choiceId)?.label ?? choiceId;
}

export function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function confidenceFor(dataPoints: number): ConfidenceLevel {
  if (dataPoints >= 10) return "high";
  if (dataPoints >= 5) return "medium";
  return "low";
}

export function topValueTags(reactions: SessionReaction[], mission: Mission, session: MissionSession, deepDiveInsightTags: ValueTag[] = []): ValueTag[] {
  const counts = new Map<ValueTag, number>();
  const initialChoice = mission.choices.find((choice) => choice.id === session.initialChoiceId);
  for (const tag of initialChoice?.valueTags ?? []) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  for (const reaction of reactions) {
    for (const tag of reaction.valueTags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  for (const tag of deepDiveInsightTags) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([tag]) => tag);
}

export function roleBucket(role: string) {
  if (role.includes("리더") || role.includes("시장") || role.includes("책임자") || role.includes("대장")) return "리더십";
  if (role.includes("디자이너") || role.includes("크리에이티브") || role.includes("큐레이터") || role.includes("기획")) return "창작";
  if (role.includes("중재") || role.includes("공감") || role.includes("조율") || role.includes("조정") || role.includes("탐정")) return "조율";
  if (role.includes("심사") || role.includes("연구") || role.includes("분석")) return "분석";
  return "관찰";
}

export function trendFromScores(current: number, previous: number, dataPoints: number): "up" | "stable" | "exploring" {
  if (dataPoints < 3) return "exploring";
  const delta = current - previous;
  if (delta > 5) return "up";
  return "stable";
}

export function initialChoiceReason(category: MissionCategory) {
  switch (category) {
    case "world":
      return "몰입감 높은 세계 탐험을 먼저 배정했어요";
    case "value":
      return "가치 딜레마 경험을 넓혀보려고 했어요";
    case "perspective":
      return "다른 시각으로 생각해보는 연습을 이어가요";
    case "real":
      return "현실과 연결되는 관찰 미션을 넣었어요";
    case "synthesis":
      return "표현과 종합 미션으로 주간 루프를 마무리해요";
  }
}

export function categoryForLowConfidenceAxis(profile: UserProfileSnapshot | null): MissionCategory | null {
  if (!profile) return null;
  const discoveries = profile.discoveries;
  if (discoveries.worldPreference.confidence === "low") return "world";
  if (discoveries.valueOrientation.confidence === "low") return "value";
  if (discoveries.roleEnergy.confidence === "low") return "world";
  if (discoveries.decisionStyle.confidence === "low") return "perspective";
  if (discoveries.tonePreference.confidence === "low") return "synthesis";
  return null;
}

export function chooseMissionByCategory(
  missionsList: Mission[],
  category: MissionCategory,
  previousAssignments: MissionAssignment[],
): Mission | null {
  const assignedMissionIds = new Set(previousAssignments.map((assignment) => assignment.missionId));
  const categoryMissions = missionsList.filter((mission) => mission.category === category);
  return categoryMissions.find((mission) => !assignedMissionIds.has(mission.id)) ?? null;
}
