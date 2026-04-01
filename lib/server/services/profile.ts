import { seededMissions } from "@/lib/server/constants";
import { getFamilyContextFromPayload } from "./auth";
import { withSeededStore } from "@/lib/server/store";
import {
  clampScore,
  confidenceFor,
  roleBucket,
  topValueTags,
  trendFromScores,
} from "@/lib/server/helpers";
import {
  diffDays,
  nowIso,
  previousKstDate,
  toKstDateKey,
} from "@/lib/server/utils/date";
import { ApiError } from "@/lib/server/utils/http";
import type {
  AuthTokenPayload,
  DailyChoiceSet,
  Mission,
  MissionCategory,
  MissionSession,
  SessionReaction,
  SessionToolUsage,
  UserProfileSnapshot,
  ValueTag,
} from "@/lib/server/types";

function buildInterestMap(
  completedSessions: MissionSession[],
  completedMissions: Mission[],
  reactions: SessionReaction[],
  tools: SessionToolUsage[],
  previousProfile: UserProfileSnapshot | null,
  choiceSets: DailyChoiceSet[],
) {
  const config = [
    {
      category: "창작 & 표현",
      missionTags: ["디자인", "브랜딩", "카피라이팅", "표현력", "창작"],
      valueTags: ["creativity", "emotion"] as ValueTag[],
    },
    {
      category: "리더십 & 의사결정",
      missionTags: ["리더십", "자원관리", "위기대응", "트레이드오프"],
      valueTags: ["efficiency", "independence"] as ValueTag[],
    },
    {
      category: "공감 & 관계",
      missionTags: ["공감", "다중관점", "감정", "이해"],
      valueTags: ["empathy", "emotion"] as ValueTag[],
    },
    {
      category: "윤리 & 사회",
      missionTags: ["공정성", "공동체", "윤리", "책임"],
      valueTags: ["fairness", "community"] as ValueTag[],
    },
    {
      category: "탐구 & 분석",
      missionTags: ["관찰력", "분석", "디자인사고", "문제해결"],
      valueTags: ["logic", "efficiency"] as ValueTag[],
    },
    {
      category: "모험 & 상상",
      missionTags: ["우주", "모험", "상상력", "미래"],
      valueTags: ["adventure", "creativity"] as ValueTag[],
    },
    {
      category: "환경 & 지속가능성",
      missionTags: ["환경", "자연", "생태", "도시설계", "도시"],
      valueTags: ["community", "safety"] as ValueTag[],
    },
  ];

  return config.map((item) => {
    let choiceSignal = 0;
    let rejectionCount = 0;
    for (const cs of choiceSets) {
      if (cs.chosenIndex == null) continue;
      const chosenPreview = cs.previews[cs.chosenIndex];
      const chosenMissionTags = completedMissions
        .find((m) => m.id === cs.chosenMissionId)?.tags ?? [];
      if (
        chosenMissionTags.some((tag) => item.missionTags.includes(tag)) ||
        item.valueTags.some((vt) => chosenPreview.category === "world" && vt === "adventure")
      ) {
        choiceSignal += 1;
      }
      for (let i = 0; i < cs.previews.length; i++) {
        if (i === cs.chosenIndex) continue;
        const rejected = cs.previews[i];
        const rejectedMission = completedMissions.find((m) =>
          m.worldSetting.location === rejected.worldLocation,
        );
        if (
          (rejectedMission?.tags ?? []).some((tag) => item.missionTags.includes(tag)) ||
          item.missionTags.some((mt) => rejected.title.includes(mt))
        ) {
          rejectionCount += 1;
        }
      }
    }

    const valueMatchCount = reactions.flatMap((reaction) => reaction.valueTags).filter((tag) =>
      item.valueTags.includes(tag),
    ).length;

    const categoryMissionIds = new Set(
      completedMissions.filter((m) => m.tags.some((t) => item.missionTags.includes(t))).map((m) => m.id),
    );
    const categoryToolCount = tools.filter((t) => {
      const session = completedSessions.find((s) => s.id === t.sessionId);
      return session && categoryMissionIds.has(session.missionId);
    }).length;

    const currentScore = clampScore(
      choiceSignal * 30 + valueMatchCount * 8 + rejectionCount * (-5) + categoryToolCount * 3,
    );
    const previousScore =
      previousProfile?.interestMap.find((entry) => entry.category === item.category)?.score ?? 0;
    const dataPoints = choiceSignal + valueMatchCount;

    return {
      category: item.category,
      score: currentScore,
      trend: trendFromScores(currentScore, previousScore, dataPoints),
    };
  });
}

export async function recalculateProfileByChildId(childId: string) {
  const store = await withSeededStore();
  const child = await store.getChild(childId);
  if (!child) {
    throw new ApiError(404, "CHILD_NOT_FOUND", "Child profile was not found");
  }

  const previousProfile = await store.getProfile(child.id);
  const allSessions = await store.listSessionsByChild(child.id);
  const completedSessions = allSessions
    .filter((session) => session.status === "completed")
    .sort((a, b) => (a.completedAt ?? "").localeCompare(b.completedAt ?? ""));
  const missionMap = new Map((await store.listMissions()).map((mission) => [mission.id, mission]));
  const completedMissions = completedSessions
    .map((session) => missionMap.get(session.missionId))
    .filter(Boolean) as Mission[];

  const reactions = (
    await Promise.all(completedSessions.map((session) => store.listReactionsBySession(session.id)))
  ).flat();
  const tools = (
    await Promise.all(completedSessions.map((session) => store.listToolsBySession(session.id)))
  ).flat();
  const choiceSets = await store.listChoiceSetsByChild(child.id);

  const completedDateKeys = [...new Set(completedSessions.map((session) => toKstDateKey(session.completedAt!)))].sort();
  const todayKey = toKstDateKey(nowIso());
  const yesterdayKey = previousKstDate(todayKey);
  let currentStreak = 0;
  const streakStart = completedDateKeys.includes(todayKey)
    ? todayKey
    : completedDateKeys.includes(yesterdayKey)
      ? yesterdayKey
      : null;
  if (streakStart) {
    let cursor = streakStart;
    while (completedDateKeys.includes(cursor)) {
      currentStreak += 1;
      cursor = previousKstDate(cursor);
    }
  }

  let longestStreak = 0;
  let running = 0;
  let previousDate: string | null = null;
  for (const dateKey of completedDateKeys) {
    if (previousDate && diffDays(dateKey, previousDate) === 1) {
      running += 1;
    } else {
      running = 1;
    }
    longestStreak = Math.max(longestStreak, running);
    previousDate = dateKey;
  }

  const valueTags = topValueTags(
    reactions,
    completedMissions[0] ?? seededMissions[0],
    completedSessions[0] ?? {
      id: "",
      childId,
      missionId: "",
      status: "completed",
      startedAt: nowIso(),
      completedAt: nowIso(),
      initialChoiceId: null,
      initialChoiceLabel: null,
      reflectionNote: null,
      closingResponse: null,
      mirrorId: null,
      expiresAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  );

  const roleCounts = new Map<string, number>();
  for (const mission of completedMissions) {
    const bucket = roleBucket(mission.role);
    roleCounts.set(bucket, (roleCounts.get(bucket) ?? 0) + 1);
  }
  const topRole = [...roleCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "관찰";

  const emotionCounts = new Map<string, number>();
  for (const reaction of reactions) {
    emotionCounts.set(reaction.emotionLabel, (emotionCounts.get(reaction.emotionLabel) ?? 0) + 1);
  }
  const topEmotion = [...emotionCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "차분하게";

  const profile: UserProfileSnapshot = {
    id: child.id,
    childId: child.id,
    name: child.name,
    age: child.age,
    createdAt: child.createdAt,
    stats: {
      totalMissions: completedSessions.length,
      currentStreak,
      longestStreak,
      totalMinutes: completedMissions.reduce((sum, mission) => sum + mission.estimatedMinutes, 0),
    },
    discoveries: {
      worldPreference: {
        label: "끌리는 세계",
        summary:
          completedMissions.length > 0
            ? `${completedMissions[0].worldSetting.location}처럼 세계관이 분명한 장면에서 더 오래 머무는 편이야.`
            : "아직 어떤 세계에 끌리는지 탐색 중이야.",
        dataPoints: completedMissions.length,
        confidence: confidenceFor(completedMissions.length),
        icon: "🌍",
      },
      valueOrientation: {
        label: "중요하게 여기는 것",
        summary:
          valueTags.length > 0
            ? `${valueTags[0]} 쪽 기준이 먼저 보이고, ${valueTags[1] ?? valueTags[0]}도 같이 챙기려는 편이야.`
            : "아직 가치 기준을 모으는 중이야.",
        dataPoints: reactions.length + completedSessions.length,
        confidence: confidenceFor(reactions.length + completedSessions.length),
        icon: "⚖️",
      },
      roleEnergy: {
        label: "에너지가 생기는 역할",
        summary: `${topRole} 쪽 역할에서 특히 몰입도가 높게 쌓이고 있어.`,
        dataPoints: completedMissions.length,
        confidence: confidenceFor(completedMissions.length),
        icon: "⚡",
      },
      decisionStyle: {
        label: "결정하는 방식",
        summary:
          tools.length > 0
            ? `직감으로 고른 뒤에도 생각 도구로 한 번 더 비교해보는 편이야.`
            : `처음 고른 선택을 비교적 곧게 밀고 가는 편이야.`,
        dataPoints: completedSessions.length,
        confidence: confidenceFor(completedSessions.length),
        icon: "🎯",
      },
      tonePreference: {
        label: "선호하는 분위기",
        summary: `${topEmotion} 같은 톤을 자주 택하는 편이야.`,
        dataPoints: reactions.length,
        confidence: confidenceFor(reactions.length),
        icon: "🎭",
      },
    },
    interestMap: buildInterestMap(completedSessions, completedMissions, reactions, tools, previousProfile, choiceSets),
    updatedAt: nowIso(),
  };

  await store.upsertProfile(profile);
  return profile;
}

export async function getProfileByChildId(payload: AuthTokenPayload, childId: string) {
  const { store, family } = await getFamilyContextFromPayload(payload);
  const child = await store.getChild(childId);
  if (!child || child.familyId !== family.id) {
    throw new ApiError(404, "CHILD_NOT_FOUND", "Child profile was not found");
  }

  const cached = await store.getProfile(childId);
  // Recalculate if no profile or interestMap is stale (< 7 categories)
  if (!cached || (cached.interestMap && cached.interestMap.length < 7)) {
    return await recalculateProfileByChildId(childId);
  }
  return cached;
}
