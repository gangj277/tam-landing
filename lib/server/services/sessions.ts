import { getFamilyContextFromPayload } from "./auth";
import { recalculateProfileByChildId } from "./profile";
import {
  generateScenarioRound as generateScenarioRoundAI,
  generateSessionRoundStream,
  generateThinkingToolCard as generateThinkingToolCardAI,
  generateThinkingToolStream,
  generateEpilogue,
  generateMirrorResult,
} from "@/lib/server/ai/generators";
import {
  generateId,
  ensureSessionIsActive,
  isSessionExpired,
  createChoiceLabel,
} from "@/lib/server/helpers";
import { addHours, nowIso, toKstDateKey } from "@/lib/server/utils/date";
import { ApiError } from "@/lib/server/utils/http";
import type { Store } from "@/lib/server/store";
import type {
  AuthTokenPayload,
  ExpansionToolType,
  GeneratedScenarioRound,
  MirrorResult,
  MissionSession,
  SessionDetail,
  SessionReaction,
  SessionToolUsage,
  ThinkingToolCard,
  ValueTag,
} from "@/lib/server/types";

async function expireSession(store: Store, session: MissionSession) {
  if (session.status !== "active") {
    return session;
  }

  const expiredSession: MissionSession = {
    ...session,
    status: "expired",
    updatedAt: nowIso(),
  };
  await store.upsertSession(expiredSession);
  return expiredSession;
}

async function expireStaleSessions(store: Store, childId: string) {
  const childSessions = await store.listSessionsByChild(childId);
  for (const session of childSessions) {
    if (isSessionExpired(session)) {
      await expireSession(store, session);
    }
  }
}

async function getOwnedSession(payload: AuthTokenPayload, sessionId: string) {
  const { store, family } = await getFamilyContextFromPayload(payload);
  const session = await store.getSession(sessionId);
  if (!session) {
    throw new ApiError(404, "SESSION_NOT_FOUND", "Session was not found");
  }

  const child = await store.getChild(session.childId);
  if (!child || child.familyId !== family.id) {
    throw new ApiError(403, "SESSION_FORBIDDEN", "The requested session does not belong to the authenticated family");
  }

  return { store, session, child };
}

export async function createMissionSession(payload: AuthTokenPayload, input: { missionId: string }) {
  const { store, activeChild } = await getFamilyContextFromPayload(payload);
  const mission = await store.getMission(input.missionId);
  if (!mission) {
    throw new ApiError(404, "MISSION_NOT_FOUND", "Mission was not found");
  }

  await expireStaleSessions(store, activeChild.id);
  const childSessions = await store.listSessionsByChild(activeChild.id);
  const reusable = childSessions.find(
    (session) =>
      session.missionId === input.missionId &&
      session.status === "active" &&
      new Date(session.expiresAt).getTime() > Date.now(),
  );

  if (reusable) {
    return {
      sessionId: reusable.id,
      startedAt: reusable.startedAt,
      reused: true,
    };
  }

  const session: MissionSession = {
    id: generateId("session"),
    childId: activeChild.id,
    missionId: input.missionId,
    status: "active",
    startedAt: nowIso(),
    completedAt: null,
    initialChoiceId: null,
    initialChoiceLabel: null,
    reflectionNote: null,
    closingResponse: null,
    mirrorId: null,
    expiresAt: addHours(nowIso(), 24),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  await store.upsertSession(session);

  return {
    sessionId: session.id,
    startedAt: session.startedAt,
    reused: false,
  };
}

export async function recordInitialChoice(
  payload: AuthTokenPayload,
  sessionId: string,
  input: { choiceId: string; reflectionNote?: string },
) {
  const { store, session } = await getOwnedSession(payload, sessionId);
  ensureSessionIsActive(session);
  if (session.initialChoiceId) {
    return session;
  }

  const mission = await store.getMission(session.missionId);
  if (!mission) {
    throw new ApiError(404, "MISSION_NOT_FOUND", "Mission was not found");
  }

  const updatedSession: MissionSession = {
    ...session,
    initialChoiceId: input.choiceId,
    initialChoiceLabel: createChoiceLabel(mission, input.choiceId),
    reflectionNote: input.reflectionNote ?? session.reflectionNote,
    updatedAt: nowIso(),
  };
  await store.upsertSession(updatedSession);
  return updatedSession;
}

export async function recordSessionReaction(
  payload: AuthTokenPayload,
  sessionId: string,
  input: {
    roundIndex: number;
    emotionId: string;
    emotionLabel: string;
    methodId: string;
    methodLabel: string;
    valueTags: ValueTag[];
  },
) {
  const { store, session } = await getOwnedSession(payload, sessionId);
  ensureSessionIsActive(session);

  const generatedRound = await store.getGeneratedRound(session.id, input.roundIndex);
  if (!generatedRound) {
    throw new ApiError(409, "ROUND_NOT_READY", "Generate the round before recording its reaction");
  }

  const existingReactions = await store.listReactionsBySession(session.id);
  const existing = existingReactions.find((reaction) => reaction.roundIndex === input.roundIndex);
  const timestamp = nowIso();
  const reaction: SessionReaction = {
    id: existing?.id ?? generateId("reaction"),
    sessionId: session.id,
    roundIndex: input.roundIndex,
    emotionId: input.emotionId,
    emotionLabel: input.emotionLabel,
    methodId: input.methodId,
    methodLabel: input.methodLabel,
    valueTags: input.valueTags,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };

  await store.upsertReaction(reaction);
  return reaction;
}

export async function recordThinkingToolUsage(
  payload: AuthTokenPayload,
  sessionId: string,
  input: { roundIndex: number; toolType: ExpansionToolType },
) {
  const { store, session } = await getOwnedSession(payload, sessionId);
  ensureSessionIsActive(session);
  const tool: SessionToolUsage = {
    id: generateId("tool"),
    sessionId: session.id,
    roundIndex: input.roundIndex,
    toolType: input.toolType,
    createdAt: nowIso(),
  };
  await store.addTool(tool);
  return tool;
}

export async function recordClosingResponse(
  payload: AuthTokenPayload,
  sessionId: string,
  input: { closingResponse: string },
) {
  const { store, session } = await getOwnedSession(payload, sessionId);
  ensureSessionIsActive(session);
  const updatedSession: MissionSession = {
    ...session,
    closingResponse: input.closingResponse,
    updatedAt: nowIso(),
  };
  await store.upsertSession(updatedSession);
  return updatedSession;
}

export async function generateSessionRound(
  payload: AuthTokenPayload,
  input: { sessionId: string; roundIndex: number },
) {
  const { store, session } = await getOwnedSession(payload, input.sessionId);
  ensureSessionIsActive(session);
  if (!session.initialChoiceId) {
    throw new ApiError(409, "INITIAL_CHOICE_REQUIRED", "Initial choice must be recorded before generating rounds");
  }

  const existingRound = await store.getGeneratedRound(session.id, input.roundIndex);
  if (existingRound) {
    return existingRound;
  }

  if (input.roundIndex > 0) {
    const reactions = await store.listReactionsBySession(session.id);
    if (!reactions.find((reaction) => reaction.roundIndex === input.roundIndex - 1)) {
      throw new ApiError(409, "PREVIOUS_REACTION_REQUIRED", "Previous round reaction is required");
    }
  }

  const mission = await store.getMission(session.missionId);
  if (!mission) {
    throw new ApiError(404, "MISSION_NOT_FOUND", "Mission was not found");
  }

  const previousRounds = await store.listGeneratedRoundsBySession(session.id);
  const previousReactions = await store.listReactionsBySession(session.id);
  const round = await generateScenarioRoundAI(mission, session, input.roundIndex, previousRounds, previousReactions);
  await store.upsertGeneratedRound(session.id, round);
  return round;
}

export async function generateSessionThinkingTool(
  payload: AuthTokenPayload,
  input: { sessionId: string; roundIndex: number; toolType: ExpansionToolType },
) {
  const { store, session } = await getOwnedSession(payload, input.sessionId);
  ensureSessionIsActive(session);

  const generatedRound = await store.getGeneratedRound(session.id, input.roundIndex);
  if (!generatedRound) {
    throw new ApiError(409, "ROUND_NOT_READY", "Generate the round before requesting a thinking tool");
  }

  const existingCard = await store.getThinkingToolCard(session.id, input.roundIndex, input.toolType);
  if (existingCard) {
    return existingCard;
  }

  const mission = await store.getMission(session.missionId);
  if (!mission) {
    throw new ApiError(404, "MISSION_NOT_FOUND", "Mission was not found");
  }

  const reactions = await store.listReactionsBySession(session.id);
  const card = await generateThinkingToolCardAI(mission, session, input.roundIndex, input.toolType, generatedRound, reactions);
  await store.upsertThinkingToolCard(session.id, input.roundIndex, input.toolType, card);
  return card;
}

export async function prepareSessionRoundStream(
  payload: AuthTokenPayload,
  input: { sessionId: string; roundIndex: number },
): Promise<{ stream: ReadableStream<Uint8Array>; saveRound: (round: GeneratedScenarioRound) => Promise<void> }> {
  const { store, session } = await getOwnedSession(payload, input.sessionId);
  ensureSessionIsActive(session);
  if (!session.initialChoiceId) {
    throw new ApiError(409, "INITIAL_CHOICE_REQUIRED", "Initial choice must be recorded before generating rounds");
  }

  const existingRound = await store.getGeneratedRound(session.id, input.roundIndex);
  if (existingRound) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(`event: complete\ndata: ${JSON.stringify(existingRound)}\n\n`));
        controller.close();
      },
    });
    return { stream, saveRound: async () => {} };
  }

  if (input.roundIndex > 0) {
    const reactions = await store.listReactionsBySession(session.id);
    if (!reactions.find((reaction) => reaction.roundIndex === input.roundIndex - 1)) {
      throw new ApiError(409, "PREVIOUS_REACTION_REQUIRED", "Previous round reaction is required");
    }
  }

  const mission = await store.getMission(session.missionId);
  if (!mission) {
    throw new ApiError(404, "MISSION_NOT_FOUND", "Mission was not found");
  }

  const previousRounds = await store.listGeneratedRoundsBySession(session.id);
  const allReactions = await store.listReactionsBySession(session.id);
  const stream = generateSessionRoundStream(mission, session, input.roundIndex, previousRounds, allReactions);

  const encoder = new TextEncoder();
  const savedStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = stream.getReader();
      let savedRound = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = new TextDecoder().decode(value);
          if (text.includes("event: complete\n")) {
            const dataMatch = text.match(/event: complete\ndata: (.+)\n/);
            if (dataMatch?.[1] && !savedRound) {
              try {
                const roundData = JSON.parse(dataMatch[1]);
                const round: GeneratedScenarioRound = {
                  id: `${session.id}:${input.roundIndex}`,
                  roundIndex: input.roundIndex,
                  ...roundData,
                };
                await store.upsertGeneratedRound(session.id, round);
                savedRound = true;
              } catch {
                // Save failed — not fatal, round can be regenerated
              }
            }
          }

          controller.enqueue(value);
        }
      } finally {
        controller.close();
      }
    },
  });

  return {
    stream: savedStream,
    saveRound: async (round: GeneratedScenarioRound) => {
      await store.upsertGeneratedRound(session.id, round);
    },
  };
}

export async function prepareSessionThinkingToolStream(
  payload: AuthTokenPayload,
  input: { sessionId: string; roundIndex: number; toolType: ExpansionToolType },
): Promise<{ stream: ReadableStream<Uint8Array> }> {
  const { store, session } = await getOwnedSession(payload, input.sessionId);
  ensureSessionIsActive(session);

  const generatedRound = await store.getGeneratedRound(session.id, input.roundIndex);
  if (!generatedRound) {
    throw new ApiError(409, "ROUND_NOT_READY", "Generate the round before requesting a thinking tool");
  }

  const existingCard = await store.getThinkingToolCard(session.id, input.roundIndex, input.toolType);
  if (existingCard) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(`event: complete\ndata: ${JSON.stringify({ narrative: existingCard.card.narrative })}\n\n`));
        controller.close();
      },
    });
    return { stream };
  }

  const mission = await store.getMission(session.missionId);
  if (!mission) {
    throw new ApiError(404, "MISSION_NOT_FOUND", "Mission was not found");
  }

  const reactions = await store.listReactionsBySession(session.id);
  const rawStream = generateThinkingToolStream(mission, session, input.roundIndex, input.toolType, generatedRound, reactions);

  const toolMeta =
    mission.aiContext.expansionTools.find((tool) => tool.type === input.toolType) ??
    mission.aiContext.expansionTools[0];

  const encoder = new TextEncoder();
  const savedStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = rawStream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = new TextDecoder().decode(value);
          if (text.includes("event: complete\n")) {
            const dataMatch = text.match(/event: complete\ndata: (.+)\n/);
            if (dataMatch?.[1]) {
              try {
                const parsed = JSON.parse(dataMatch[1]);
                const card: ThinkingToolCard = {
                  type: input.toolType,
                  label: toolMeta?.label ?? input.toolType,
                  emoji: input.toolType === "broaden" ? "🔭" : input.toolType === "reframe" ? "🔄" : "🌀",
                  card: { narrative: parsed.narrative },
                };
                await store.upsertThinkingToolCard(session.id, input.roundIndex, input.toolType, card);
              } catch {
                // Save failed — not fatal
              }
            }
          }

          controller.enqueue(value);
        }
      } finally {
        controller.close();
      }
    },
  });

  return { stream: savedStream };
}

export async function generateSessionEpilogue(payload: AuthTokenPayload, input: { sessionId: string }) {
  const { store, session } = await getOwnedSession(payload, input.sessionId);
  ensureSessionIsActive(session);
  const existing = await store.getEpilogue(session.id);
  if (existing) {
    return existing;
  }

  const reactions = await store.listReactionsBySession(session.id);
  if (reactions.length < 5) {
    throw new ApiError(409, "REACTIONS_INCOMPLETE", "Five reactions are required before generating an epilogue");
  }

  const mission = await store.getMission(session.missionId);
  if (!mission) {
    throw new ApiError(404, "MISSION_NOT_FOUND", "Mission was not found");
  }

  const allRounds = await store.listGeneratedRoundsBySession(session.id);
  const epilogue = await generateEpilogue(mission, session, allRounds, reactions, session.closingResponse);
  await store.upsertEpilogue(session.id, epilogue);
  return epilogue;
}

export async function generateSessionMirror(payload: AuthTokenPayload, input: { sessionId: string }) {
  const { store, session, child } = await getOwnedSession(payload, input.sessionId);
  ensureSessionIsActive(session);
  const existing = await store.getMirrorBySession(session.id);
  if (existing) {
    return existing;
  }

  const epilogue = await store.getEpilogue(session.id);
  if (!epilogue) {
    throw new ApiError(409, "EPILOGUE_REQUIRED", "Generate the epilogue before creating the mirror");
  }

  const mission = await store.getMission(session.missionId);
  if (!mission) {
    throw new ApiError(404, "MISSION_NOT_FOUND", "Mission was not found");
  }

  const reactions = await store.listReactionsBySession(session.id);
  const toolsUsed = await store.listToolsBySession(session.id);
  const previousMirrors = (await store.listMirrorsByChild(child.id)).filter((mirror) => mirror.sessionId !== session.id);
  const allRounds = await store.listGeneratedRoundsBySession(session.id);
  const mirrorBody = await generateMirrorResult({
    mission,
    session,
    allRounds,
    reactions,
    toolsUsed,
    previousMirrors,
  });

  const mirror: MirrorResult = {
    id: generateId("mirror"),
    sessionId: session.id,
    childId: child.id,
    missionId: mission.id,
    createdAt: nowIso(),
    ...mirrorBody,
  };
  await store.upsertMirror(mirror);
  return mirror;
}

export async function completeMissionSession(
  payload: AuthTokenPayload,
  sessionId: string,
  input: { mirrorId?: string },
) {
  const { store, session, child } = await getOwnedSession(payload, sessionId);
  if (session.status === "completed") {
    return {
      session,
      profile: await recalculateProfileByChildId(child.id),
    };
  }
  ensureSessionIsActive(session);
  const mirror =
    (input.mirrorId ? await store.getMirrorById(input.mirrorId) : null) ??
    (await store.getMirrorBySession(session.id));
  if (!mirror) {
    throw new ApiError(409, "MIRROR_REQUIRED", "Mirror generation must complete before finishing the session");
  }

  const completedAt = nowIso();
  const updatedSession: MissionSession = {
    ...session,
    status: "completed",
    completedAt,
    mirrorId: mirror.id,
    updatedAt: completedAt,
  };
  await store.upsertSession(updatedSession);

  if (!child.onboardedAt) {
    await store.upsertChild({
      ...child,
      onboardedAt: completedAt,
    });
  }

  const profile = await recalculateProfileByChildId(child.id);
  return {
    session: updatedSession,
    profile,
  };
}

export async function getSessionDetail(payload: AuthTokenPayload, sessionId: string): Promise<SessionDetail> {
  const { store, session } = await getOwnedSession(payload, sessionId);
  const mission = await store.getMission(session.missionId);
  if (!mission) {
    throw new ApiError(404, "MISSION_NOT_FOUND", "Mission was not found");
  }

  const [reactions, toolsUsed, generatedRounds, thinkingToolCards, epilogue, mirror] = await Promise.all([
    store.listReactionsBySession(session.id),
    store.listToolsBySession(session.id),
    store.listGeneratedRoundsBySession(session.id),
    store.listThinkingCardsBySession(session.id),
    store.getEpilogue(session.id),
    store.getMirrorBySession(session.id),
  ]);

  return {
    session,
    mission,
    reactions: reactions.sort((a, b) => a.roundIndex - b.roundIndex),
    toolsUsed,
    generatedRounds: generatedRounds.sort((a, b) => a.roundIndex - b.roundIndex),
    thinkingToolCards,
    epilogue,
    mirror,
  };
}

export async function listCompletedSessions(payload: AuthTokenPayload, childId?: string, limit = 10) {
  const { store, family } = await getFamilyContextFromPayload(payload);
  const targetChildId = childId ?? family.activeChildId;
  const targetChild = await store.getChild(targetChildId);
  if (!targetChild || targetChild.familyId !== family.id) {
    throw new ApiError(404, "CHILD_NOT_FOUND", "Child profile was not found");
  }

  const allSessions = await store.listSessionsByChild(targetChildId);
  const completed = allSessions
    .filter((session) => session.status === "completed")
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""))
    .slice(0, limit);

  const missionsList = await store.listMissions();

  return completed.map((session) => {
    const mission = missionsList.find((candidate) => candidate.id === session.missionId);
    const choiceSummary = [
      session.initialChoiceLabel,
      ...(session.closingResponse ? [session.closingResponse] : []),
    ]
      .filter(Boolean)
      .join(" → ");

    return {
      sessionId: session.id,
      missionId: session.missionId,
      missionTitle: mission?.title ?? "알 수 없는 미션",
      category: mission?.category ?? "world",
      completedAt: toKstDateKey(session.completedAt ?? session.startedAt),
      choiceSummary,
    };
  });
}
