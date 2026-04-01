import { seededMissions } from "@/lib/server/constants";
import { getFamilyContextFromPayload } from "./auth";
import { withSeededStore } from "@/lib/server/store";
import type { Store } from "@/lib/server/store";
import { callOpenRouter } from "@/lib/server/ai/client";
import { generatedMissionSchema, previewSetSchema } from "@/lib/server/ai/schemas";
import {
  buildMissionGenerationPrompts,
  buildPreviewGenerationPrompts,
} from "@/lib/server/ai/prompts";
import {
  FIRST_14_DAY_SCHEDULE,
  getAssignedCategoryForSequenceDay,
} from "@/lib/server/missions/assignment";
import {
  generateId,
  initialChoiceReason,
  categoryForLowConfidenceAxis,
  chooseMissionByCategory,
} from "@/lib/server/helpers";
import {
  diffDays,
  isWeekendKst,
  nowIso,
  previousKstDate,
  toKstDateKey,
} from "@/lib/server/utils/date";
import { ApiError } from "@/lib/server/utils/http";
import { env } from "@/lib/server/env";
import type {
  AuthTokenPayload,
  ChildProfile,
  DailyChoiceSet,
  DifficultyType,
  ExpansionToolType,
  Mission,
  MissionAssignment,
  MissionCategory,
  MissionPreview,
  ValueTag,
} from "@/lib/server/types";

async function generateNewMission(
  store: Store,
  childId: string,
  category: MissionCategory,
  difficulty: DifficultyType,
  preview?: MissionPreview,
): Promise<Mission> {
  const profile = await store.getProfile(childId);
  if (!profile) {
    throw new ApiError(404, "PROFILE_NOT_FOUND", "Child profile is required for mission generation");
  }

  const mirrors = await store.listMirrorsByChild(childId);
  const sessions = await store.listSessionsByChild(childId);
  const allMissions = await store.listMissions();

  const completedMissionIds = new Set(
    sessions.filter((s) => s.status === "completed").map((s) => s.missionId),
  );
  const pastMissions = allMissions.filter((m) => completedMissionIds.has(m.id));
  const pastTitles = pastMissions.map((m) => m.title);
  const pastLocations = pastMissions.map((m) => m.worldSetting.location);

  const { systemPrompt, userPrompt } = buildMissionGenerationPrompts(
    category,
    difficulty,
    profile,
    mirrors,
    pastTitles,
    pastLocations,
    preview,
  );

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const parsed = await callOpenRouter({
        schema: generatedMissionSchema,
        schemaName: "mission",
        systemPrompt,
        userPrompt,
      });

      if (parsed.choices.length !== 3) continue;
      if (parsed.aiContext.expansionTools.length !== 3) continue;
      if (parsed.aiContext.followUpAngles.length !== 4) continue;

      const validTags = new Set(["fairness", "efficiency", "safety", "adventure", "empathy", "creativity", "independence", "community", "logic", "emotion"]);
      const tagsValid = parsed.choices.every(
        (c) => c.valueTags.length === 2 && c.valueTags.every((t) => validTags.has(t)),
      );
      if (!tagsValid) continue;

      const mission: Mission = {
        id: generateId("mission"),
        title: parsed.title,
        role: parsed.role,
        category,
        difficulty,
        worldSetting: parsed.worldSetting,
        situation: parsed.situation,
        coreQuestion: parsed.coreQuestion,
        choices: parsed.choices.map((c) => ({
          ...c,
          valueTags: c.valueTags as ValueTag[],
        })),
        aiContext: {
          persona: parsed.aiContext.persona,
          followUpAngles: parsed.aiContext.followUpAngles,
          expansionTools: parsed.aiContext.expansionTools.map((t) => ({
            ...t,
            type: t.type as ExpansionToolType,
          })),
        },
        tags: parsed.tags,
        estimatedMinutes: Math.max(5, Math.min(10, parsed.estimatedMinutes)),
        ageRange: parsed.ageRange as [number, number],
        isActive: true,
        createdAt: nowIso(),
      };

      await store.upsertMission(mission);
      return mission;
    } catch {
      if (attempt >= 1) break;
    }
  }

  const fallback = allMissions.find((m) => m.category === category) ?? allMissions[0];
  if (!fallback) {
    throw new ApiError(500, "NO_MISSIONS_AVAILABLE", "No missions available for fallback");
  }
  return fallback;
}

async function generateDailyPreviewsForChild(
  store: Store,
  child: ChildProfile,
): Promise<DailyChoiceSet> {
  const todayDate = toKstDateKey(nowIso());

  const existing = await store.getChoiceSet(child.id, todayDate);
  if (existing) return existing;

  const profile = await store.getProfile(child.id);
  if (!profile) {
    throw new ApiError(404, "PROFILE_NOT_FOUND", "Profile is required for preview generation");
  }

  const mirrors = await store.listMirrorsByChild(child.id);
  const sessions = await store.listSessionsByChild(child.id);
  const allMissions = await store.listMissions();
  const recentChoiceSets = await store.listChoiceSetsByChild(child.id);

  const completedMissionIds = new Set(
    sessions.filter((s) => s.status === "completed").map((s) => s.missionId),
  );
  const pastMissions = allMissions.filter((m) => completedMissionIds.has(m.id));
  const pastTitles = pastMissions.map((m) => m.title);
  const pastLocations = pastMissions.map((m) => m.worldSetting.location);

  let rawPreviews: Array<{
    title: string;
    role: string;
    category: MissionCategory;
    difficulty: DifficultyType;
    worldLocation: string;
    era: string;
    pitch: string;
  }>;

  if (env.TAM_AI_MODE === "mock") {
    const usedCategories = new Set<string>();
    const picked: Mission[] = [];
    for (const m of seededMissions) {
      if (!usedCategories.has(m.category) && picked.length < 3) {
        usedCategories.add(m.category);
        picked.push(m);
      }
    }
    while (picked.length < 3) picked.push(seededMissions[picked.length % seededMissions.length]);

    rawPreviews = picked.map((m) => ({
      title: m.title,
      role: m.role,
      category: m.category as MissionCategory,
      difficulty: m.difficulty as DifficultyType,
      worldLocation: m.worldSetting.location,
      era: m.worldSetting.era,
      pitch: m.situation.slice(0, 15) + "...",
    }));
  } else {
    const { systemPrompt, userPrompt } = buildPreviewGenerationPrompts(
      profile,
      mirrors,
      pastTitles,
      pastLocations,
      recentChoiceSets,
    );

    const parsed = await callOpenRouter({
      schema: previewSetSchema,
      schemaName: "previews",
      systemPrompt,
      userPrompt,
    });

    rawPreviews = parsed.previews.slice(0, 3) as typeof rawPreviews;
  }

  const slots: Array<"fit" | "stretch" | "reveal"> = ["fit", "stretch", "reveal"];
  const previews: MissionPreview[] = rawPreviews.map((p, i) => ({
    index: i,
    title: p.title,
    role: p.role,
    category: p.category,
    difficulty: p.difficulty,
    worldLocation: p.worldLocation,
    era: p.era,
    pitch: p.pitch,
    slot: slots[i],
  }));

  const choiceSet: DailyChoiceSet = {
    id: generateId("choice"),
    childId: child.id,
    choiceDate: todayDate,
    previews,
    chosenIndex: null,
    chosenMissionId: null,
    strategy: { fit: 0, stretch: 1, reveal: 2 },
    createdAt: nowIso(),
    chosenAt: null,
  };

  await store.upsertChoiceSet(choiceSet);
  return choiceSet;
}

async function getTodayOrTomorrowMission(payload: AuthTokenPayload, dayOffset: number) {
  const { store, activeChild } = await getFamilyContextFromPayload(payload);
  const missionsList = await store.listMissions();
  const targetDate = previousKstDate(toKstDateKey(new Date(Date.now() + dayOffset * 24 * 60 * 60 * 1000)), 0);
  const existing = await store.getAssignment(activeChild.id, targetDate);
  if (existing) {
    const mission = await store.getMission(existing.missionId);
    if (!mission) {
      throw new ApiError(500, "ASSIGNED_MISSION_MISSING", "Assigned mission was not found");
    }
    return { mission, reason: existing.reason };
  }

  const previousAssignments = await store.listAssignmentsByChild(activeChild.id);
  const sequenceDay = diffDays(targetDate, toKstDateKey(activeChild.createdAt)) + 1;
  let category: MissionCategory | null = null;
  let reason = "";

  if (sequenceDay >= 1 && sequenceDay <= FIRST_14_DAY_SCHEDULE.length) {
    category = getAssignedCategoryForSequenceDay(sequenceDay);
    reason = initialChoiceReason(category!);
  } else {
    const seenCategories = new Set(
      previousAssignments
        .map((assignment) => missionsList.find((mission) => mission.id === assignment.missionId)?.category)
        .filter(Boolean),
    );
    category = (["world", "value", "perspective", "real", "synthesis"] as MissionCategory[]).find(
      (candidate) => !seenCategories.has(candidate),
    ) ?? categoryForLowConfidenceAxis(await store.getProfile(activeChild.id));

    const recentAssignments = previousAssignments
      .slice()
      .sort((a, b) => b.assignmentDate.localeCompare(a.assignmentDate))
      .slice(0, 3);
    const recentCategories = new Set(
      recentAssignments
        .map((assignment) => missionsList.find((mission) => mission.id === assignment.missionId)?.category)
        .filter(Boolean),
    );

    if (!category || recentCategories.has(category)) {
      category =
        (["world", "value", "perspective", "real", "synthesis"] as MissionCategory[]).find(
          (candidate) => !recentCategories.has(candidate),
        ) ?? "world";
    }

    reason = isWeekendKst(new Date())
      ? "주말이라 조금 더 자유롭게 새로운 카테고리를 열어뒀어요"
      : "최근 패턴과 아직 적게 본 카테고리를 함께 고려했어요";
  }

  let mission = chooseMissionByCategory(missionsList, category!, previousAssignments);

  if (!mission) {
    if (env.TAM_AI_MODE === "openrouter" && sequenceDay > FIRST_14_DAY_SCHEDULE.length) {
      const difficultyMap: Record<MissionCategory, DifficultyType> = {
        world: "value-conflict",
        value: "dilemma",
        perspective: "perspective-shift",
        real: "observation",
        synthesis: "expression",
      };
      mission = await generateNewMission(store, activeChild.id, category!, difficultyMap[category!]);
      reason = "네 탐험 기록을 바탕으로 새로운 세계를 만들었어요";
    } else {
      const categoryMissions = missionsList.filter((m) => m.category === category);
      mission = categoryMissions[0] ?? missionsList[0];
    }
  }

  const assignment: MissionAssignment = {
    id: generateId("assignment"),
    childId: activeChild.id,
    assignmentDate: targetDate,
    missionId: mission.id,
    reason,
    createdAt: nowIso(),
  };
  await store.upsertAssignment(assignment);

  return { mission, reason };
}

export async function listAllMissions() {
  const store = await withSeededStore();
  return await store.listMissions();
}

export async function getMissionById(missionId: string) {
  const store = await withSeededStore();
  const mission = await store.getMission(missionId);
  if (!mission) {
    throw new ApiError(404, "MISSION_NOT_FOUND", "Mission was not found");
  }
  return mission;
}

export async function getDailyChoices(payload: AuthTokenPayload) {
  const { store, activeChild } = await getFamilyContextFromPayload(payload);

  const sequenceDay = diffDays(
    toKstDateKey(nowIso()),
    toKstDateKey(activeChild.createdAt),
  ) + 1;

  if (sequenceDay <= FIRST_14_DAY_SCHEDULE.length) {
    const { mission, reason } = await getTodayOrTomorrowMission(payload, 0);
    return { status: "sequence" as const, mission, reason };
  }

  const todayDate = toKstDateKey(nowIso());
  const existingSet = await store.getChoiceSet(activeChild.id, todayDate);

  if (existingSet?.chosenMissionId) {
    const mission = await store.getMission(existingSet.chosenMissionId);
    if (mission) {
      return { status: "chosen" as const, mission, reason: "네가 고른 세계야" };
    }
  }

  const choiceSet = existingSet ?? await generateDailyPreviewsForChild(store, activeChild);
  return {
    status: "choosing" as const,
    previews: choiceSet.previews,
    choiceSetId: choiceSet.id,
  };
}

export async function selectDailyMission(
  payload: AuthTokenPayload,
  input: { chosenIndex: number },
) {
  const { store, activeChild } = await getFamilyContextFromPayload(payload);
  const todayDate = toKstDateKey(nowIso());

  const choiceSet = await store.getChoiceSet(activeChild.id, todayDate);
  if (!choiceSet) {
    throw new ApiError(404, "NO_CHOICE_SET", "No daily choices available for today");
  }

  if (choiceSet.chosenMissionId) {
    const mission = await store.getMission(choiceSet.chosenMissionId);
    if (!mission) throw new ApiError(500, "MISSION_MISSING", "Chosen mission not found");
    return { mission, reason: "네가 고른 세계야" };
  }

  if (input.chosenIndex < 0 || input.chosenIndex >= choiceSet.previews.length) {
    throw new ApiError(400, "INVALID_INDEX", "Invalid preview index");
  }

  const preview = choiceSet.previews[input.chosenIndex];

  const mission = await generateNewMission(
    store,
    activeChild.id,
    preview.category,
    preview.difficulty,
    preview,
  );

  const updatedSet: DailyChoiceSet = {
    ...choiceSet,
    chosenIndex: input.chosenIndex,
    chosenMissionId: mission.id,
    chosenAt: nowIso(),
  };
  await store.upsertChoiceSet(updatedSet);

  const assignment: MissionAssignment = {
    id: generateId("assignment"),
    childId: activeChild.id,
    assignmentDate: todayDate,
    missionId: mission.id,
    reason: `"${preview.title}" — 네가 직접 고른 세계`,
    createdAt: nowIso(),
  };
  await store.upsertAssignment(assignment);

  return { mission, reason: assignment.reason };
}

export async function getTodayMission(payload: AuthTokenPayload) {
  return await getTodayOrTomorrowMission(payload, 0);
}

export async function getTomorrowMission(payload: AuthTokenPayload) {
  return await getTodayOrTomorrowMission(payload, 1);
}
