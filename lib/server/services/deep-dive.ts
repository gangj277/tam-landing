import { HARDCODED_DEEP_DIVES } from "@/lib/dummy-data";
import { callOpenRouterStream } from "@/lib/server/ai/client";
import {
  buildDeepDiveTurnPrompt,
  buildDeepDivePortfolioPrompt,
} from "@/lib/server/ai/prompts";
import {
  deepDiveExpertMessageSchema,
  deepDivePortfolioSchema,
} from "@/lib/server/ai/schemas";
import { env } from "@/lib/server/env";
import { generateId } from "@/lib/server/helpers";
import { withSeededStore } from "@/lib/server/store";
import { nowIso } from "@/lib/server/utils/date";
import { ApiError } from "@/lib/server/utils/http";
import type {
  AuthTokenPayload,
  DeepDive,
  DeepDiveTurn,
  DeepDiveTurnType,
  DeepDiveInteractionType,
  DeepDiveTurnOption,
} from "@/lib/server/types";

// ─── Turn structure definition ───

const TURN_DEFINITIONS: {
  type: DeepDiveTurnType;
  interactionType: DeepDiveInteractionType;
  optionsKey?: "turn0" | "turn1" | "turn3";
}[] = [
  { type: "arrival",   interactionType: "reaction",   optionsKey: "turn0" },
  { type: "case",      interactionType: "comparison",  optionsKey: "turn1" },
  { type: "question",  interactionType: "text" },
  { type: "insight",   interactionType: "reflection",  optionsKey: "turn3" },
  { type: "portfolio", interactionType: "portfolio" },
];

// ─── Create a deep-dive session ───

export async function createDeepDiveSession(
  payload: AuthTokenPayload,
  { missionId }: { missionId: string },
) {
  const store = await withSeededStore();
  const childId = payload.activeChildId;

  // Find hardcoded expert for this mission
  const hardcoded = HARDCODED_DEEP_DIVES.find((dd) => dd.missionId === missionId);
  if (!hardcoded) {
    throw new ApiError(404, "NO_EXPERT_FOR_MISSION", `No expert data for mission ${missionId}`);
  }

  // Check if there's already an active deep-dive for this mission
  const existing = await store.listDeepDivesByChild(childId);
  const activeForMission = existing.find(
    (dd) => dd.missionId === missionId && dd.status === "active",
  );
  if (activeForMission) {
    return { deepDiveId: activeForMission.id, reused: true };
  }

  // Find the most recent completed session for this mission
  const sessions = await store.listSessionsByChild(childId);
  const missionSession = sessions
    .filter((s) => s.missionId === missionId && s.status === "completed")
    .sort((a, b) => b.completedAt!.localeCompare(a.completedAt!))
    .at(0);

  const deepDiveId = generateId("dd");
  const now = nowIso();

  // Create the deep-dive record
  await store.upsertDeepDive({
    id: deepDiveId,
    missionId,
    sessionId: missionSession?.id ?? null,
    childId,
    expert: hardcoded.expert,
    realWorldCase: hardcoded.realWorldCase,
    portfolioEntry: null,
    status: "active",
    startedAt: now,
    completedAt: null,
    createdAt: now,
  });

  // Create 5 turn stubs
  for (let i = 0; i < 5; i++) {
    const def = TURN_DEFINITIONS[i];
    let options: DeepDiveTurnOption[] | undefined;

    if (def.optionsKey && hardcoded.interactionOptions[def.optionsKey]) {
      options = hardcoded.interactionOptions[def.optionsKey].map((opt) => ({
        id: opt.id,
        label: opt.label,
        valueTags: "valueTags" in opt ? (opt as { valueTags: string[] }).valueTags : undefined,
      }));
    }

    await store.upsertDeepDiveTurn({
      id: generateId("ddt"),
      deepDiveId,
      turnIndex: i,
      type: def.type,
      expertMessage: null,
      interactionType: def.interactionType,
      options,
      selectedOptionId: undefined,
      textResponse: undefined,
      createdAt: now,
    });
  }

  return { deepDiveId, reused: false };
}

// ─── Stream a deep-dive turn's expert message ───

export async function streamDeepDiveTurn(
  payload: AuthTokenPayload,
  deepDiveId: string,
  turnIndex: number,
): Promise<ReadableStream<Uint8Array>> {
  const store = await withSeededStore();
  const deepDive = await store.getDeepDive(deepDiveId);
  if (!deepDive) throw new ApiError(404, "DEEP_DIVE_NOT_FOUND", "Deep dive not found");
  if (deepDive.childId !== payload.activeChildId) {
    throw new ApiError(403, "FORBIDDEN", "Not your deep dive");
  }
  if (deepDive.status !== "active") {
    throw new ApiError(409, "DEEP_DIVE_NOT_ACTIVE", "Deep dive is not active");
  }

  const turn = deepDive.turns.find((t) => t.turnIndex === turnIndex);
  if (!turn) throw new ApiError(404, "TURN_NOT_FOUND", `Turn ${turnIndex} not found`);

  // If already has expert message, return it as a completed stream
  if (turn.expertMessage) {
    return createCompletedStream(turn.expertMessage);
  }

  const mission = await store.getMission(deepDive.missionId);
  if (!mission) throw new ApiError(404, "MISSION_NOT_FOUND", "Mission not found");

  const child = await store.getChild(payload.activeChildId);
  if (!child) throw new ApiError(404, "CHILD_NOT_FOUND", "Child not found");

  // Get the session (may be null)
  const session = deepDive.sessionId ? await store.getSession(deepDive.sessionId) : null;

  // Get previous turns
  const previousTurns = deepDive.turns.filter((t) => t.turnIndex < turnIndex);

  // Get turn template from hardcoded data
  const hardcoded = HARDCODED_DEEP_DIVES.find((dd) => dd.missionId === deepDive.missionId);
  const turnType = TURN_DEFINITIONS[turnIndex].type;
  const turnTemplate = hardcoded?.turnTemplates[turnType as keyof typeof hardcoded.turnTemplates] ?? {};

  // Mock mode
  if (env.TAM_AI_MODE === "mock") {
    const mockMessages: Record<DeepDiveTurnType, string> = {
      arrival: `안녕! 나는 ${deepDive.expert.name}이야. ${deepDive.expert.organization}에서 ${deepDive.expert.role}으로 일하고 있어. ${mission.title} 미션 했다며? 어땠어?`,
      case: `내가 겪은 일 하나 들려줄게. ${deepDive.realWorldCase.headline}. ${deepDive.realWorldCase.context}`,
      question: `${deepDive.realWorldCase.keyQuestion} 너는 어떻게 생각해?`,
      insight: `우리 대화하면서 느낀 건데, 정답은 없는 것 같아. 하지만 이렇게 생각해보는 과정 자체가 중요한 거야.`,
      portfolio: `오늘 나눈 이야기 중에서 가장 기억에 남는 걸 한 줄로 써볼래? 네 생각이 담긴 한 문장이면 돼!`,
    };

    const mockMessage = mockMessages[turnType];

    // Save the message
    await store.upsertDeepDiveTurn({
      ...turn,
      expertMessage: mockMessage,
    });

    return createCompletedStream(mockMessage);
  }

  // Real AI streaming
  const { systemPrompt, userPrompt } = buildDeepDiveTurnPrompt(
    { turnIndex, type: turnType },
    deepDive.expert,
    mission,
    session,
    deepDive.realWorldCase,
    child.name,
    child.age,
    previousTurns,
    turnTemplate as Record<string, string>,
  );

  // Use the streaming client, wrapping in JSON for schema compatibility
  const aiStream = callOpenRouterStream({
    schema: deepDiveExpertMessageSchema,
    schemaName: "deep_dive_expert_message",
    systemPrompt,
    userPrompt,
  });

  // Wrap the stream to save the message on completion
  return wrapStreamWithSave(aiStream, deepDiveId, turnIndex, store, turn);
}

// ─── Record child's response to a turn ───

export async function recordDeepDiveTurnResponse(
  payload: AuthTokenPayload,
  deepDiveId: string,
  { turnIndex, selectedOptionId, textResponse }: {
    turnIndex: number;
    selectedOptionId?: string;
    textResponse?: string;
  },
) {
  const store = await withSeededStore();
  const deepDive = await store.getDeepDive(deepDiveId);
  if (!deepDive) throw new ApiError(404, "DEEP_DIVE_NOT_FOUND", "Deep dive not found");
  if (deepDive.childId !== payload.activeChildId) {
    throw new ApiError(403, "FORBIDDEN", "Not your deep dive");
  }
  if (deepDive.status !== "active") {
    throw new ApiError(409, "DEEP_DIVE_NOT_ACTIVE", "Deep dive is not active");
  }

  const turn = deepDive.turns.find((t) => t.turnIndex === turnIndex);
  if (!turn) throw new ApiError(404, "TURN_NOT_FOUND", `Turn ${turnIndex} not found`);

  await store.upsertDeepDiveTurn({
    ...turn,
    selectedOptionId: selectedOptionId ?? turn.selectedOptionId,
    textResponse: textResponse ?? turn.textResponse,
  });

  return { ok: true };
}

// ─── Complete a deep-dive ───

export async function completeDeepDive(
  payload: AuthTokenPayload,
  deepDiveId: string,
  { portfolioEntry }: { portfolioEntry: string },
) {
  const store = await withSeededStore();
  const deepDive = await store.getDeepDive(deepDiveId);
  if (!deepDive) throw new ApiError(404, "DEEP_DIVE_NOT_FOUND", "Deep dive not found");
  if (deepDive.childId !== payload.activeChildId) {
    throw new ApiError(403, "FORBIDDEN", "Not your deep dive");
  }

  const now = nowIso();
  await store.upsertDeepDive({
    id: deepDive.id,
    missionId: deepDive.missionId,
    sessionId: deepDive.sessionId,
    childId: deepDive.childId,
    expert: deepDive.expert,
    realWorldCase: deepDive.realWorldCase,
    portfolioEntry,
    status: "completed",
    startedAt: deepDive.startedAt,
    completedAt: now,
    createdAt: deepDive.createdAt,
  });

  return { ok: true, completedAt: now };
}

// ─── Get deep-dive detail ───

export async function getDeepDiveDetail(
  payload: AuthTokenPayload,
  deepDiveId: string,
) {
  const store = await withSeededStore();
  const deepDive = await store.getDeepDive(deepDiveId);
  if (!deepDive) throw new ApiError(404, "DEEP_DIVE_NOT_FOUND", "Deep dive not found");
  if (deepDive.childId !== payload.activeChildId) {
    throw new ApiError(403, "FORBIDDEN", "Not your deep dive");
  }
  return { deepDive };
}

// ─── List deep-dives for child ───

export async function listDeepDivesByChild(
  payload: AuthTokenPayload,
) {
  const store = await withSeededStore();
  const deepDives = await store.listDeepDivesByChild(payload.activeChildId);
  return { deepDives };
}

// ─── Portfolio by child ───

export async function getPortfolioByChild(
  payload: AuthTokenPayload,
  childId: string,
) {
  const store = await withSeededStore();
  if (childId !== payload.activeChildId) {
    throw new ApiError(403, "FORBIDDEN", "Not your child");
  }
  const deepDives = await store.listDeepDivesByChild(childId);
  const completed = deepDives.filter((dd) => dd.status === "completed" && dd.portfolioEntry);

  const entries = [];
  for (const dd of completed) {
    const mission = await store.getMission(dd.missionId);
    entries.push({
      deepDiveId: dd.id,
      missionTitle: mission?.title ?? "알 수 없는 미션",
      expertName: dd.expert.name,
      title: `${dd.expert.name}과의 대화`,
      portfolioEntry: dd.portfolioEntry!,
      completedAt: dd.completedAt!,
    });
  }

  return { entries };
}

// ─── Today's activity (mission or deepdive) ───

export async function getTodayActivity(payload: AuthTokenPayload) {
  // Import dynamically to avoid circular dependency issues
  const { getTodayMission } = await import("./missions");
  const { getDaySchedule, FIRST_14_DAY_SCHEDULE } = await import("@/lib/server/missions/assignment");
  const { diffDays, toKstDateKey } = await import("@/lib/server/utils/date");

  const store = await withSeededStore();
  const child = await store.getChild(payload.activeChildId);
  if (!child) throw new ApiError(404, "CHILD_NOT_FOUND", "Child not found");

  // Determine which day of the 14-day schedule we're on
  const onboardedAt = child.onboardedAt;
  if (!onboardedAt) {
    // Not onboarded yet — default to mission
    const missionResult = await getTodayMission(payload);
    return { type: "mission" as const, ...missionResult };
  }

  const today = toKstDateKey(new Date());
  const startDate = toKstDateKey(onboardedAt);
  const sequenceDay = diffDays(today, startDate) + 1;

  // Beyond the 14-day schedule or before day 1 — always mission
  if (sequenceDay < 1 || sequenceDay > FIRST_14_DAY_SCHEDULE.length) {
    const missionResult = await getTodayMission(payload);
    return { type: "mission" as const, ...missionResult };
  }

  const schedule = getDaySchedule(sequenceDay);
  if (!schedule || schedule.type !== "deepdive") {
    const missionResult = await getTodayMission(payload);
    return { type: "mission" as const, ...missionResult };
  }

  // It's a deep-dive day! Find the previous mission's expert
  // Get the most recent completed session for this child
  const sessions = await store.listSessionsByChild(payload.activeChildId);
  const completedSessions = sessions
    .filter((s) => s.status === "completed")
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));

  const lastSession = completedSessions[0];
  if (!lastSession) {
    // No completed missions yet — fall back to mission
    const missionResult = await getTodayMission(payload);
    return { type: "mission" as const, ...missionResult };
  }

  const mission = await store.getMission(lastSession.missionId);
  if (!mission) {
    const missionResult = await getTodayMission(payload);
    return { type: "mission" as const, ...missionResult };
  }

  // Check if expert exists for this mission
  const hardcoded = HARDCODED_DEEP_DIVES.find((dd) => dd.missionId === lastSession.missionId);
  if (!hardcoded) {
    const missionResult = await getTodayMission(payload);
    return { type: "mission" as const, ...missionResult };
  }

  // Check if there's already an active deep-dive
  const existingDeepDives = await store.listDeepDivesByChild(payload.activeChildId);
  const activeDD = existingDeepDives.find(
    (dd) => dd.missionId === lastSession.missionId && dd.status === "active",
  );

  return {
    type: "deepdive" as const,
    missionId: lastSession.missionId,
    missionTitle: mission.title,
    expert: {
      name: hardcoded.expert.name,
      role: hardcoded.expert.role,
      organization: hardcoded.expert.organization,
    },
    deepDiveId: activeDD?.id ?? null,
  };
}

// ─── Helper: create a completed stream from existing message ───

function createCompletedStream(message: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      // Send the message as tokens character by character (batched)
      const CHUNK_SIZE = 5;
      for (let i = 0; i < message.length; i += CHUNK_SIZE) {
        const chunk = message.slice(i, i + CHUNK_SIZE);
        controller.enqueue(
          encoder.encode(`event: token\ndata: ${JSON.stringify({ t: chunk })}\n\n`),
        );
      }
      controller.enqueue(
        encoder.encode(`event: complete\ndata: ${JSON.stringify({ expertMessage: message })}\n\n`),
      );
      controller.close();
    },
  });
}

// ─── Helper: wrap AI stream to save on completion ───

function wrapStreamWithSave(
  source: ReadableStream<Uint8Array>,
  deepDiveId: string,
  turnIndex: number,
  store: Awaited<ReturnType<typeof withSeededStore>>,
  turn: DeepDiveTurn,
): ReadableStream<Uint8Array> {
  const reader = source.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let fullMessage = "";

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }

      // Pass through to client
      controller.enqueue(value);

      // Parse to extract the complete message
      const text = decoder.decode(value, { stream: true });
      const lines = text.split("\n");
      for (const line of lines) {
        if (line.startsWith("event: complete")) {
          // Next data line contains the final message
        } else if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.expertMessage) {
              fullMessage = data.expertMessage;
              // Save to store
              await store.upsertDeepDiveTurn({
                ...turn,
                expertMessage: fullMessage,
              });
            }
          } catch {
            // Not JSON or not relevant
          }
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}
