import { HARDCODED_DEEP_DIVES } from "@/lib/dummy-data";
import { callOpenRouterStream } from "@/lib/server/ai/client";
import {
  buildAgentSystemPrompt,
  buildAgentUserPrompt,
} from "@/lib/server/ai/prompts";
import {
  agentResponseSchema,
} from "@/lib/server/ai/schemas";
import { env } from "@/lib/server/env";
import { generateId } from "@/lib/server/helpers";
import { withSeededStore } from "@/lib/server/store";
import type { Store } from "@/lib/server/store";
import { nowIso } from "@/lib/server/utils/date";
import { ApiError } from "@/lib/server/utils/http";
import type {
  AuthTokenPayload,
  DeepDive,
  DeepDiveMessage,
  AgentState,
  AgentToolCall,
} from "@/lib/server/types";

// ─── Create a deep-dive session ───

export async function createDeepDiveSession(
  payload: AuthTokenPayload,
  { missionId, sessionId }: { missionId: string; sessionId: string },
) {
  const store = await withSeededStore();
  const childId = payload.activeChildId;

  const hardcoded = HARDCODED_DEEP_DIVES.find((dd) => dd.missionId === missionId);
  if (!hardcoded) {
    throw new ApiError(404, "NO_EXPERT_FOR_MISSION", `No expert data for mission ${missionId}`);
  }

  // Check for existing active deep-dive for this mission
  const existing = await store.listDeepDivesByChild(childId);
  const activeForMission = existing.find(
    (dd) => dd.missionId === missionId && dd.status === "active",
  );
  if (activeForMission) {
    return { deepDiveId: activeForMission.id, reused: true };
  }

  const deepDiveId = generateId("dd");
  const now = nowIso();

  const initialAgentState: AgentState = {
    casePresentedAtIndex: null,
    insightCount: 0,
    turnCount: 0,
    endingInitiated: false,
    portfolioRequested: false,
  };

  await store.upsertDeepDive({
    id: deepDiveId,
    missionId,
    sessionId,
    childId,
    expert: hardcoded.expert,
    realWorldCase: hardcoded.realWorldCase,
    portfolioEntry: null,
    status: "active",
    agentState: initialAgentState,
    startedAt: now,
    completedAt: null,
    createdAt: now,
  });

  return { deepDiveId, reused: false };
}

// ─── List deep-dives for child ───

export async function listDeepDivesByChild(
  payload: AuthTokenPayload,
) {
  const store = await withSeededStore();
  const deepDives = await store.listDeepDivesByChild(payload.activeChildId);
  return { deepDives };
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

// ═══════════════════════════════════════════════════════════════
// DEEP-DIVE AGENT-BASED FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// ─── Mock responses for agent mode ───

const MOCK_AGENT_RESPONSES: Array<{
  getMessage: (expert: { name: string }, mission: { title: string }) => string;
  toolCalls?: AgentToolCall[];
}> = [
  {
    // Turn 0: intro
    getMessage: (expert, mission) =>
      `안녕! 나는 ${expert.name}이야. 방금 ${mission.title} 미션 끝냈다며? 어떤 선택을 했어? 진짜 궁금해!`,
    toolCalls: [],
  },
  {
    // Turn 1: probe
    getMessage: () => `오 그렇구나! 근데 그 선택 하면서 좀 고민되지 않았어? 다른 쪽도 나름 이유가 있잖아.`,
    toolCalls: [{ name: "probe_deeper", arguments: { type: "why" } }],
  },
  {
    // Turn 2: present case
    getMessage: (expert) =>
      `아 맞다, 나도 비슷한 일 겪은 적 있어. 실제로 이런 일이 있었거든. 들어볼래?`,
    toolCalls: [{ name: "present_real_case" }],
  },
  {
    // Turn 3: offer perspective + save insight
    getMessage: () =>
      `진짜 좋은 생각이다. 나는 현장에서 일하면서 느낀 건데, 정답이 하나만 있는 게 아니더라고.`,
    toolCalls: [
      { name: "offer_perspective" },
      {
        name: "save_insight",
        arguments: {
          text: "아이가 다양한 관점을 인식하기 시작함",
          valueTags: ["fairness", "empathy"],
        },
      },
    ],
  },
  {
    // Turn 4: deeper probe
    getMessage: () =>
      `근데 만약에 상황이 좀 달랐다면? 예를 들어 시간이 훨씬 촉박했다면 같은 선택 했을까?`,
    toolCalls: [{ name: "probe_deeper", arguments: { type: "what_if" } }],
  },
  {
    // Turn 5: save insight
    getMessage: () =>
      `와, 그렇게 생각할 수도 있구나. 나는 그 부분을 놓치고 있었어. 고마워!`,
    toolCalls: [
      {
        name: "save_insight",
        arguments: {
          text: "상황 의존적 판단의 중요성을 스스로 발견함",
          valueTags: ["logic", "independence"],
        },
      },
    ],
  },
  {
    // Turn 6+: end conversation
    getMessage: () =>
      `오늘 너랑 대화하면서 나도 많이 배웠어. 마지막으로 오늘 이야기 중에서 가장 기억에 남는 걸 한 줄로 써볼래? 네 생각이 담긴 한 문장이면 돼!`,
    toolCalls: [{ name: "end_conversation" }],
  },
];

// ─── Stream an agent response ───

export async function streamAgentResponse(
  payload: AuthTokenPayload,
  deepDiveId: string,
  childMessage: string | null,
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

  const now = nowIso();

  // Save child message if provided
  if (childMessage !== null) {
    const nextIndex = deepDive.messages.length;
    await store.appendDeepDiveMessage({
      id: generateId("ddm"),
      deepDiveId,
      messageIndex: nextIndex,
      role: "child",
      content: childMessage,
      createdAt: now,
    });
    // Refresh messages in our local object
    deepDive.messages.push({
      id: "pending",
      deepDiveId,
      messageIndex: nextIndex,
      role: "child",
      content: childMessage,
      createdAt: now,
    });
  }

  // Check turn limits
  if (deepDive.agentState.turnCount >= 12) {
    throw new ApiError(409, "MAX_TURNS_REACHED", "Maximum turns reached");
  }

  // Load context data
  const mission = await store.getMission(deepDive.missionId);
  if (!mission) throw new ApiError(404, "MISSION_NOT_FOUND", "Mission not found");

  const child = await store.getChild(payload.activeChildId);
  if (!child) throw new ApiError(404, "CHILD_NOT_FOUND", "Child not found");

  const session = await store.getSession(deepDive.sessionId);

  // Get turn templates from hardcoded data
  const hardcoded = HARDCODED_DEEP_DIVES.find((dd) => dd.missionId === deepDive.missionId);
  const turnTemplates = hardcoded?.turnTemplates;

  // Mock mode
  if (env.TAM_AI_MODE === "mock") {
    const mockIdx = Math.min(deepDive.agentState.turnCount, MOCK_AGENT_RESPONSES.length - 1);
    const mock = MOCK_AGENT_RESPONSES[mockIdx];
    const mockMessage = mock.getMessage(
      deepDive.expert,
      { title: mission.title },
    );

    const mockToolCalls = mock.toolCalls ?? [];

    // Process tool calls
    const messageIndex = deepDive.messages.length;
    await processAgentToolCalls(
      store,
      deepDiveId,
      { ...deepDive.agentState },
      mockToolCalls,
      messageIndex,
    );

    // Save expert message
    await store.appendDeepDiveMessage({
      id: generateId("ddm"),
      deepDiveId,
      messageIndex,
      role: "expert",
      content: mockMessage,
      toolCalls: mockToolCalls.length > 0 ? mockToolCalls : undefined,
      createdAt: nowIso(),
    });

    // Build the enriched complete payload
    const updatedDD = await store.getDeepDive(deepDiveId);
    const isEnding = updatedDD?.agentState.endingInitiated ?? false;

    return createAgentCompletedStream(mockMessage, updatedDD?.agentState ?? deepDive.agentState, isEnding);
  }

  // Real AI streaming
  const systemPrompt = buildAgentSystemPrompt({
    expert: deepDive.expert,
    child: { name: child.name, age: child.age },
    mission: {
      title: mission.title,
      coreSituation: mission.situation,
    },
    session: session
      ? { initialChoice: session.initialChoiceLabel ?? undefined }
      : null,
    realWorldCase: deepDive.realWorldCase,
    turnTemplates: turnTemplates as Record<string, unknown> | undefined,
  });

  const userPrompt = buildAgentUserPrompt({
    messages: deepDive.messages,
    agentState: deepDive.agentState,
  });

  const aiStream = callOpenRouterStream({
    schema: agentResponseSchema,
    schemaName: "agent_response",
    systemPrompt,
    userPrompt,
  });

  return wrapAgentStreamWithSave(aiStream, store, deepDiveId, deepDive);
}

// ─── Helper: create a completed stream for agent mock mode ───

function createAgentCompletedStream(
  message: string,
  agentState: AgentState,
  isEnding: boolean,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      const CHUNK_SIZE = 5;
      for (let i = 0; i < message.length; i += CHUNK_SIZE) {
        const chunk = message.slice(i, i + CHUNK_SIZE);
        controller.enqueue(
          encoder.encode(`event: token\ndata: ${JSON.stringify({ t: chunk })}\n\n`),
        );
      }
      controller.enqueue(
        encoder.encode(
          `event: complete\ndata: ${JSON.stringify({ message, agentState, isEnding })}\n\n`,
        ),
      );
      controller.close();
    },
  });
}

// ─── Wrap agent AI stream to process tool calls and save on completion ───

function wrapAgentStreamWithSave(
  source: ReadableStream<Uint8Array>,
  store: Store,
  deepDiveId: string,
  deepDive: DeepDive,
): ReadableStream<Uint8Array> {
  const reader = source.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let foundComplete = false;

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }

      const text = decoder.decode(value, { stream: true });
      const lines = text.split("\n");

      // We need to intercept `event: complete` and its data line
      // to process tool calls before re-emitting the enriched event
      const outputLines: string[] = [];

      for (const line of lines) {
        if (line === "event: complete") {
          foundComplete = true;
          // Don't emit yet — wait for data line
          continue;
        }

        if (foundComplete && line.startsWith("data: ")) {
          // This is the complete event data
          try {
            const parsed = JSON.parse(line.slice(6));
            const agentMessage: string = parsed.message ?? "";
            const toolCalls: AgentToolCall[] = parsed.toolCalls ?? [];

            // Process tool calls (side effects: save insights, update state)
            const messageIndex = deepDive.messages.length;
            await processAgentToolCalls(
              store,
              deepDiveId,
              { ...deepDive.agentState },
              toolCalls,
              messageIndex,
            );

            // Save expert message
            await store.appendDeepDiveMessage({
              id: generateId("ddm"),
              deepDiveId,
              messageIndex,
              role: "expert",
              content: agentMessage,
              toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
              createdAt: nowIso(),
            });

            // Fetch updated state
            const updatedDD = await store.getDeepDive(deepDiveId);
            const updatedState = updatedDD?.agentState ?? deepDive.agentState;
            const isEnding = updatedState.endingInitiated;

            // Re-emit enriched complete event
            const enriched = { message: agentMessage, agentState: updatedState, isEnding };
            outputLines.push(`event: complete`);
            outputLines.push(`data: ${JSON.stringify(enriched)}`);
            outputLines.push("");
          } catch {
            // If parsing fails, pass through as-is
            outputLines.push("event: complete");
            outputLines.push(line);
            outputLines.push("");
          }
          foundComplete = false;
          continue;
        }

        // If we had a pending foundComplete flag but this isn't a data line, flush both
        if (foundComplete) {
          outputLines.push("event: complete");
          outputLines.push(line);
          foundComplete = false;
          continue;
        }

        // Regular lines (tokens, errors, etc.) — pass through
        outputLines.push(line);
      }

      if (outputLines.length > 0) {
        controller.enqueue(encoder.encode(outputLines.join("\n")));
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

// ─── Process agent tool calls (side effects) ───

async function processAgentToolCalls(
  store: Store,
  deepDiveId: string,
  agentState: AgentState,
  toolCalls: AgentToolCall[],
  messageIndex: number,
): Promise<void> {
  for (const tc of toolCalls) {
    switch (tc.name) {
      case "present_real_case":
        agentState.casePresentedAtIndex = messageIndex;
        break;

      case "save_insight": {
        const args = tc.arguments as { text?: string; valueTags?: string[] } | undefined;
        if (args?.text) {
          await store.appendDeepDiveInsight({
            id: generateId("ddi"),
            deepDiveId,
            text: args.text,
            sourceMessageIndex: messageIndex,
            valueTags: args.valueTags ?? [],
            createdAt: nowIso(),
          });
          agentState.insightCount += 1;
        }
        break;
      }

      case "end_conversation":
        agentState.endingInitiated = true;
        agentState.portfolioRequested = true;
        break;

      case "probe_deeper":
      case "offer_perspective":
        // These are display-only signals; no server-side state change.
        break;
    }
  }

  // Increment turn count
  agentState.turnCount += 1;

  // Persist updated agent state
  await store.updateAgentState(deepDiveId, agentState);
}

// ─── Submit portfolio entry ───

export async function submitPortfolioEntry(
  payload: AuthTokenPayload,
  deepDiveId: string,
  text: string,
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
    portfolioEntry: text,
    status: "completed",
    agentState: deepDive.agentState,
    startedAt: deepDive.startedAt,
    completedAt: now,
    createdAt: deepDive.createdAt,
  });

  return { ok: true, completedAt: now };
}
