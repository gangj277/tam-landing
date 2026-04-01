import { HARDCODED_DEEP_DIVES } from "@/lib/dummy-data";
import { DUMMY_MISSIONS } from "@/lib/server/constants";
import { getFamilyContextFromPayload } from "./auth";
import { getTodayMission } from "./missions";
import {
  FIRST_14_DAY_SCHEDULE,
  getDaySchedule,
  isDeepDiveDay,
} from "@/lib/server/missions/assignment";
import { generateId } from "@/lib/server/helpers";
import { diffDays, nowIso, previousKstDate, toKstDateKey } from "@/lib/server/utils/date";
import { ApiError } from "@/lib/server/utils/http";
import type {
  AuthTokenPayload,
  DeepDive,
  DeepDiveStep,
} from "@/lib/server/types";

function buildDeepDiveStepsFromTemplate(
  deepDiveId: string,
  hardcoded: (typeof HARDCODED_DEEP_DIVES)[number],
  now: string,
): DeepDiveStep[] {
  const { stepTemplates, realWorldCase } = hardcoded;
  const steps: DeepDiveStep[] = [];

  // Step 0: case
  steps.push({
    id: generateId("dds"),
    deepDiveId,
    stepIndex: 0,
    type: "case",
    prompt: stepTemplates.caseIntro + "\n\n" + realWorldCase.context,
    response: null,
    options: undefined,
    selectedOptionId: undefined,
    createdAt: now,
  });

  // Step 1: question
  steps.push({
    id: generateId("dds"),
    deepDiveId,
    stepIndex: 1,
    type: "question",
    prompt: JSON.stringify(stepTemplates.questions),
    response: null,
    options: stepTemplates.questions[0]?.options?.map((o) => ({ id: o.id, label: o.label })),
    selectedOptionId: undefined,
    createdAt: now,
  });

  // Step 2: opinion — JSON with template + scaffolds
  steps.push({
    id: generateId("dds"),
    deepDiveId,
    stepIndex: 2,
    type: "opinion",
    prompt: JSON.stringify({ template: stepTemplates.opinionTemplate, scaffolds: stepTemplates.opinionScaffolds }),
    response: null,
    options: undefined,
    selectedOptionId: undefined,
    createdAt: now,
  });

  // Step 3: portfolio
  steps.push({
    id: generateId("dds"),
    deepDiveId,
    stepIndex: 3,
    type: "portfolio",
    prompt: "AI가 포트폴리오 문장을 생성합니다",
    response: null,
    options: undefined,
    selectedOptionId: undefined,
    createdAt: now,
  });

  return steps;
}

export async function getTodayActivity(payload: AuthTokenPayload) {
  const { store, activeChild } = await getFamilyContextFromPayload(payload);
  const today = toKstDateKey(new Date());
  const sequenceDay = diffDays(today, toKstDateKey(activeChild.createdAt)) + 1;

  if (isDeepDiveDay(sequenceDay)) {
    let linkedMissionId: string | null = null;

    if (sequenceDay >= 2 && sequenceDay <= 14) {
      const schedule = getDaySchedule(sequenceDay);
      if (schedule?.linkedMissionDay) {
        const linkedSchedule = FIRST_14_DAY_SCHEDULE[schedule.linkedMissionDay - 1];
        if (linkedSchedule?.missionIndex !== undefined) {
          const dummyMission = DUMMY_MISSIONS[linkedSchedule.missionIndex];
          if (dummyMission) {
            const mission = await store.getMission(dummyMission.id);
            linkedMissionId = mission?.id ?? null;
          }
        }
      }
    } else {
      const yesterday = previousKstDate(today);
      const yesterdayAssignment = await store.getAssignment(activeChild.id, yesterday);
      if (yesterdayAssignment) {
        linkedMissionId = yesterdayAssignment.missionId;
      }
    }

    if (!linkedMissionId) {
      const missionResult = await getTodayMission(payload);
      return { type: "mission" as const, ...missionResult };
    }

    const linkedMission = await store.getMission(linkedMissionId);
    if (!linkedMission) {
      const missionResult = await getTodayMission(payload);
      return { type: "mission" as const, ...missionResult };
    }

    const childSessions = await store.listSessionsByChild(activeChild.id);
    const completedSession = childSessions.find(
      (s) => s.missionId === linkedMissionId && s.status === "completed",
    );

    if (!completedSession) {
      return {
        type: "deepdive_pending" as const,
        linkedMission,
        reason: "딥다이브를 시작하려면 먼저 연결된 미션을 완료해야 해요",
      };
    }

    const existing = await store.getDeepDiveByChildAndMission(activeChild.id, linkedMissionId);
    if (existing) {
      const steps = await store.listDeepDiveSteps(existing.id);
      return {
        type: "deepdive" as const,
        deepDive: { ...existing, steps },
        linkedMission,
        reason: "이전에 시작한 딥다이브를 이어가요",
      };
    }

    const hardcoded = HARDCODED_DEEP_DIVES.find((dd) => dd.missionId === linkedMissionId);
    if (hardcoded) {
      const deepDiveId = generateId("dd");
      const now = nowIso();

      const deepDive: Omit<DeepDive, "steps"> = {
        id: deepDiveId,
        missionId: linkedMissionId,
        sessionId: completedSession.id,
        childId: activeChild.id,
        title: hardcoded.title,
        realWorldCase: {
          headline: hardcoded.realWorldCase.headline,
          context: hardcoded.realWorldCase.context,
          keyQuestion: hardcoded.realWorldCase.keyQuestion,
          source: hardcoded.realWorldCase.source,
        },
        portfolioEntry: null,
        status: "active",
        startedAt: now,
        completedAt: null,
        createdAt: now,
      };
      await store.upsertDeepDive(deepDive);

      const steps = buildDeepDiveStepsFromTemplate(deepDiveId, hardcoded, now);
      for (const step of steps) {
        await store.upsertDeepDiveStep(step);
      }

      return {
        type: "deepdive" as const,
        deepDive: { ...deepDive, steps },
        linkedMission,
        reason: "어제 미션과 연결된 현실 사례를 탐구해봐요",
      };
    }

    const missionResult = await getTodayMission(payload);
    return { type: "mission" as const, ...missionResult };
  }

  const missionResult = await getTodayMission(payload);
  return { type: "mission" as const, ...missionResult };
}

export async function createDeepDiveSession(
  payload: AuthTokenPayload,
  input: { missionId: string },
) {
  const { store, activeChild } = await getFamilyContextFromPayload(payload);

  const existing = await store.getDeepDiveByChildAndMission(activeChild.id, input.missionId);
  if (existing && existing.status === "active") {
    const steps = await store.listDeepDiveSteps(existing.id);
    return { deepDive: { ...existing, steps }, reused: true };
  }

  const hardcoded = HARDCODED_DEEP_DIVES.find((dd) => dd.missionId === input.missionId);
  if (!hardcoded) {
    throw new ApiError(404, "DEEP_DIVE_NOT_FOUND", "No deep-dive template found for this mission");
  }

  const childSessions = await store.listSessionsByChild(activeChild.id);
  const completedSession = childSessions.find(
    (s) => s.missionId === input.missionId && s.status === "completed",
  );

  const deepDiveId = generateId("dd");
  const now = nowIso();

  const deepDive: Omit<DeepDive, "steps"> = {
    id: deepDiveId,
    missionId: input.missionId,
    sessionId: completedSession?.id ?? null,
    childId: activeChild.id,
    title: hardcoded.title,
    realWorldCase: {
      headline: hardcoded.realWorldCase.headline,
      context: hardcoded.realWorldCase.context,
      keyQuestion: hardcoded.realWorldCase.keyQuestion,
      source: hardcoded.realWorldCase.source,
    },
    portfolioEntry: null,
    status: "active",
    startedAt: now,
    completedAt: null,
    createdAt: now,
  };
  await store.upsertDeepDive(deepDive);

  const steps = buildDeepDiveStepsFromTemplate(deepDiveId, hardcoded, now);
  for (const step of steps) {
    await store.upsertDeepDiveStep(step);
  }

  return { deepDive: { ...deepDive, steps }, reused: false };
}

export async function getDeepDiveDetail(
  payload: AuthTokenPayload,
  deepDiveId: string,
) {
  const { store, activeChild } = await getFamilyContextFromPayload(payload);

  const deepDive = await store.getDeepDive(deepDiveId);
  if (!deepDive || deepDive.childId !== activeChild.id) {
    throw new ApiError(404, "DEEP_DIVE_NOT_FOUND", "Deep-dive session was not found");
  }

  const steps = await store.listDeepDiveSteps(deepDiveId);
  const linkedMission = await store.getMission(deepDive.missionId);

  return {
    deepDive: { ...deepDive, steps },
    linkedMission,
  };
}

export async function recordDeepDiveStepResponse(
  payload: AuthTokenPayload,
  deepDiveId: string,
  input: { stepIndex: number; response?: string; selectedOptionId?: string },
) {
  const { store, activeChild } = await getFamilyContextFromPayload(payload);

  const deepDive = await store.getDeepDive(deepDiveId);
  if (!deepDive || deepDive.childId !== activeChild.id) {
    throw new ApiError(404, "DEEP_DIVE_NOT_FOUND", "Deep-dive session was not found");
  }

  if (deepDive.status !== "active") {
    throw new ApiError(400, "DEEP_DIVE_NOT_ACTIVE", "Deep-dive session is not active");
  }

  if (input.stepIndex > 0) {
    const prevStep = await store.getDeepDiveStep(deepDiveId, input.stepIndex - 1);
    if (!prevStep || prevStep.response === null) {
      throw new ApiError(400, "STEP_ORDER_VIOLATION", "Previous step must be completed first");
    }
  }

  const step = await store.getDeepDiveStep(deepDiveId, input.stepIndex);
  if (!step) {
    throw new ApiError(404, "STEP_NOT_FOUND", "Deep-dive step was not found");
  }

  await store.upsertDeepDiveStep({
    ...step,
    response: input.response ?? step.response,
    selectedOptionId: input.selectedOptionId ?? step.selectedOptionId,
  });

  return { ok: true };
}

export async function completeDeepDive(
  payload: AuthTokenPayload,
  deepDiveId: string,
  input: { portfolioEntry: string },
) {
  const { store, activeChild } = await getFamilyContextFromPayload(payload);

  const deepDive = await store.getDeepDive(deepDiveId);
  if (!deepDive || deepDive.childId !== activeChild.id) {
    throw new ApiError(404, "DEEP_DIVE_NOT_FOUND", "Deep-dive session was not found");
  }

  if (deepDive.status !== "active") {
    throw new ApiError(400, "DEEP_DIVE_NOT_ACTIVE", "Deep-dive session is not active");
  }

  const steps = await store.listDeepDiveSteps(deepDiveId);
  const sortedSteps = steps.sort((a, b) => a.stepIndex - b.stepIndex);
  for (const step of sortedSteps) {
    if (step.stepIndex < 3 && step.response === null) {
      throw new ApiError(400, "STEPS_INCOMPLETE", `Step ${step.stepIndex} has not been completed`);
    }
  }

  const now = nowIso();
  await store.upsertDeepDive({
    ...deepDive,
    portfolioEntry: input.portfolioEntry,
    status: "completed",
    completedAt: now,
  });

  const portfolioStep = sortedSteps.find((s) => s.stepIndex === 3);
  if (portfolioStep) {
    await store.upsertDeepDiveStep({
      ...portfolioStep,
      response: input.portfolioEntry,
    });
  }

  try {
    const profile = await store.getProfile(activeChild.id);
    if (profile) {
      const allDeepDives = await store.listDeepDivesByChild(activeChild.id);
      const completedCount = allDeepDives.filter((dd) => dd.status === "completed").length + 1;
      const portfolioCount = allDeepDives.filter(
        (dd) => dd.status === "completed" && dd.portfolioEntry,
      ).length + 1;

      await store.upsertProfile({
        ...profile,
        stats: {
          ...profile.stats,
          totalDeepDives: completedCount,
          portfolioEntries: portfolioCount,
        },
        updatedAt: now,
      });
    }
  } catch {
    // Profile update is best-effort; don't fail the completion
  }

  return { ok: true };
}

export async function listDeepDivesByChild(payload: AuthTokenPayload, childId?: string) {
  const { store, activeChild } = await getFamilyContextFromPayload(payload);
  const targetId = childId ?? activeChild.id;
  const deepDives = await store.listDeepDivesByChild(targetId);

  const result = await Promise.all(
    deepDives.map(async (dd) => {
      const steps = await store.listDeepDiveSteps(dd.id);
      return { ...dd, steps };
    }),
  );

  return { deepDives: result };
}

export async function getPortfolioByChild(payload: AuthTokenPayload, childId: string) {
  const { store, family } = await getFamilyContextFromPayload(payload);
  const child = await store.getChild(childId);
  if (!child || child.familyId !== family.id) {
    throw new ApiError(404, "CHILD_NOT_FOUND", "Child was not found");
  }

  const deepDives = await store.listDeepDivesByChild(childId);
  const completedDeepDives = deepDives.filter(
    (dd) => dd.status === "completed" && dd.portfolioEntry,
  );

  const entries = await Promise.all(
    completedDeepDives.map(async (dd) => {
      const mission = await store.getMission(dd.missionId);
      return {
        deepDiveId: dd.id,
        missionId: dd.missionId,
        missionTitle: mission?.title ?? "미션",
        title: dd.title,
        portfolioEntry: dd.portfolioEntry!,
        completedAt: dd.completedAt!,
      };
    }),
  );

  return {
    childId,
    entries: entries.sort((a, b) => b.completedAt.localeCompare(a.completedAt)),
  };
}
