import { z } from "zod";

import {
  buildScenarioRoundPrompts,
  buildThinkingToolPrompts,
  buildEpiloguePrompts,
  buildMirrorPrompts,
  buildGuideCommentPrompts,
} from "./prompts";
import { callOpenRouter, callOpenRouterStream } from "./client";
import {
  scenarioRoundSchema,
  thinkingToolSchema,
  epilogueSchema,
  mirrorSchema,
} from "./schemas";
import { env } from "@/lib/server/env";
import { generateId } from "@/lib/server/helpers";
import type {
  ExpansionToolType,
  GeneratedEpilogue,
  GeneratedScenarioRound,
  MirrorResult,
  Mission,
  MissionSession,
  SessionReaction,
  SessionToolUsage,
  ThinkingToolCard,
  UserProfileSnapshot,
  ValueTag,
  WeeklyReport,
} from "@/lib/server/types";
import { topValueTags } from "@/lib/server/helpers";

export function buildMockRound(mission: Mission, roundIndex: number, session: MissionSession): GeneratedScenarioRound {
  const roundNumber = roundIndex + 1;
  const choiceLabel = session.initialChoiceLabel ?? "너의 선택";
  return {
    id: `${session.id}:${roundIndex}`,
    roundIndex,
    consequence: {
      narrative:
        `${choiceLabel} 이후, ${mission.worldSetting.location}의 분위기가 조금 달라졌어.\n\n` +
        `${mission.role}로서 네 말과 태도를 지켜보는 사람들이 생겼고, 모두가 같은 마음은 아니라는 것도 보이기 시작했어.`,
      newDilemma: `${roundNumber}라운드에서는 누구의 마음을 먼저 살펴볼까?`,
    },
    reflectionHint: roundIndex <= 1
      ? "방금 선택할 때 제일 먼저 뭐가 떠올랐어?"
      : roundIndex === 2
        ? "이번에는 저번이랑 다른 기준으로 골랐나?"
        : roundIndex === 3
          ? "이 선택이 너에 대해 뭘 말해주는 것 같아?"
          : "실제 생활에서도 비슷한 고민을 한 적 있어?",
    emotionOptions: [
      { id: `e${roundNumber}-calm`, emoji: "😌", label: "차분하게", valueTags: ["logic", "community"] },
      { id: `e${roundNumber}-bold`, emoji: "🔥", label: "단호하게", valueTags: ["independence", "efficiency"] },
      { id: `e${roundNumber}-warm`, emoji: "💛", label: "다정하게", valueTags: ["empathy", "emotion"] },
    ],
    methodOptions: [
      { id: `m${roundNumber}-talk`, emoji: "🗣️", label: "직접 말해", valueTags: ["community", "logic"] },
      { id: `m${roundNumber}-show`, emoji: "📊", label: "근거 보여", valueTags: ["logic", "efficiency"] },
      { id: `m${roundNumber}-team`, emoji: "🤝", label: "같이 풀어", valueTags: ["community", "fairness"] },
    ],
    thinkingTools: [
      { type: "broaden", label: "만약에...", emoji: "🔭" },
      { type: "reframe", label: "그 사람은...", emoji: "🔄" },
      { type: "subvert", label: "전혀 다르게", emoji: "🌀" },
    ],
  };
}

export async function generateScenarioRound(
  mission: Mission,
  session: MissionSession,
  roundIndex: number,
  previousRounds: GeneratedScenarioRound[],
  previousReactions: SessionReaction[],
): Promise<GeneratedScenarioRound> {
  if (env.TAM_AI_MODE === "mock") {
    return buildMockRound(mission, roundIndex, session);
  }

  const { systemPrompt, userPrompt } = buildScenarioRoundPrompts(
    mission, session, roundIndex, previousRounds, previousReactions,
  );

  const parsed = await callOpenRouter({
    schema: scenarioRoundSchema,
    schemaName: "scenario_round",
    systemPrompt,
    userPrompt,
  });

  return {
    id: `${session.id}:${roundIndex}`,
    roundIndex,
    consequence: parsed.consequence,
    reflectionHint: parsed.reflectionHint ?? "",
    emotionOptions: parsed.emotionOptions.map((option) => ({
      ...option,
      valueTags: option.valueTags as ValueTag[],
    })),
    methodOptions: parsed.methodOptions.map((option) => ({
      ...option,
      valueTags: option.valueTags as ValueTag[],
    })),
    thinkingTools: parsed.thinkingTools,
  };
}

export function generateSessionRoundStream(
  mission: Mission,
  session: MissionSession,
  roundIndex: number,
  previousRounds: GeneratedScenarioRound[],
  previousReactions: SessionReaction[],
): ReadableStream<Uint8Array> {
  if (env.TAM_AI_MODE === "mock") {
    const encoder = new TextEncoder();
    const mockRound = buildMockRound(mission, roundIndex, session);
    const narrative = mockRound.consequence.narrative;

    return new ReadableStream({
      async start(controller) {
        const words = narrative.split("");
        for (let i = 0; i < words.length; i++) {
          controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ t: words[i] })}\n\n`));
          await new Promise((r) => setTimeout(r, 20));
        }
        controller.enqueue(encoder.encode(`event: complete\ndata: ${JSON.stringify(mockRound)}\n\n`));
        controller.close();
      },
    });
  }

  const { systemPrompt, userPrompt } = buildScenarioRoundPrompts(
    mission, session, roundIndex, previousRounds, previousReactions,
  );

  return callOpenRouterStream({
    schema: scenarioRoundSchema,
    schemaName: "scenario_round",
    systemPrompt,
    userPrompt,
  });
}

export async function generateThinkingToolCard(
  mission: Mission,
  session: MissionSession,
  roundIndex: number,
  toolType: ExpansionToolType,
  currentRound: GeneratedScenarioRound,
  previousReactions: SessionReaction[],
): Promise<ThinkingToolCard> {
  const toolMeta =
    mission.aiContext.expansionTools.find((tool) => tool.type === toolType) ??
    mission.aiContext.expansionTools[0];

  if (env.TAM_AI_MODE === "mock") {
    return {
      type: toolType,
      label: toolMeta?.label ?? toolType,
      emoji: toolType === "broaden" ? "🔭" : toolType === "reframe" ? "🔄" : "🌀",
      card: {
        narrative:
          `${toolMeta?.label ?? toolType} 관점에서 보면 ${mission.title}의 ${roundIndex + 1}번째 장면은 다르게 보여.\n` +
          `${toolMeta?.prompts[roundIndex % toolMeta.prompts.length] ?? "다른 가능성을 열어보자."}`,
      },
    };
  }

  const { systemPrompt, userPrompt } = buildThinkingToolPrompts(
    mission, session, roundIndex, toolType, currentRound, previousReactions,
  );

  const parsed = await callOpenRouter({
    schema: thinkingToolSchema,
    schemaName: "thinking_tool",
    systemPrompt,
    userPrompt,
  });

  return {
    type: toolType,
    label: toolMeta?.label ?? toolType,
    emoji: toolType === "broaden" ? "🔭" : toolType === "reframe" ? "🔄" : "🌀",
    card: {
      narrative: parsed.narrative,
    },
  };
}

export function generateThinkingToolStream(
  mission: Mission,
  session: MissionSession,
  roundIndex: number,
  toolType: ExpansionToolType,
  currentRound: GeneratedScenarioRound,
  previousReactions: SessionReaction[],
): ReadableStream<Uint8Array> {
  const toolMeta =
    mission.aiContext.expansionTools.find((tool) => tool.type === toolType) ??
    mission.aiContext.expansionTools[0];

  if (env.TAM_AI_MODE === "mock") {
    const encoder = new TextEncoder();
    const narrative =
      `${toolMeta?.label ?? toolType} 관점에서 보면 ${mission.title}의 ${roundIndex + 1}번째 장면은 다르게 보여.\n` +
      `${toolMeta?.prompts[roundIndex % toolMeta.prompts.length] ?? "다른 가능성을 열어보자."}`;

    return new ReadableStream({
      async start(controller) {
        const chars = narrative.split("");
        for (let i = 0; i < chars.length; i++) {
          controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ t: chars[i] })}\n\n`));
          await new Promise((r) => setTimeout(r, 20));
        }
        controller.enqueue(encoder.encode(`event: complete\ndata: ${JSON.stringify({ narrative })}\n\n`));
        controller.close();
      },
    });
  }

  const { systemPrompt, userPrompt } = buildThinkingToolPrompts(
    mission, session, roundIndex, toolType, currentRound, previousReactions,
  );

  return callOpenRouterStream({
    schema: thinkingToolSchema,
    schemaName: "thinking_tool",
    systemPrompt,
    userPrompt,
  });
}

export async function generateEpilogue(
  mission: Mission,
  session: MissionSession,
  allRounds: GeneratedScenarioRound[],
  allReactions: SessionReaction[],
  closingResponse: string | null,
): Promise<GeneratedEpilogue> {
  if (env.TAM_AI_MODE === "mock") {
    return {
      id: generateId("epilogue"),
      title: `네가 만든 ${mission.worldSetting.location}의 하루`,
      scenes: [
        { text: `${mission.role}로서 첫 결정이 실제 사람들의 표정에 바로 드러났어.`, mood: "positive" },
        { text: "모두가 만족하진 않았지만, 네가 무엇을 중요하게 보는지는 분명해졌어.", mood: "bittersweet" },
        { text: "반대하던 사람도 네가 설명하는 방식을 보며 조금씩 움직이기 시작했어.", mood: "hopeful" },
        { text: `완벽하진 않았지만, ${mission.worldSetting.location}의 내일을 조금 더 상상하게 된 하루였어.`, mood: "hopeful" },
      ],
      closingLine: "이건 네가 만든 이야기야. 다른 선택을 했다면 완전히 다른 하루가 됐을 거야.",
    };
  }

  const { systemPrompt, userPrompt } = buildEpiloguePrompts(
    mission, session, allRounds, allReactions, closingResponse,
  );

  const parsed = await callOpenRouter({
    schema: epilogueSchema,
    schemaName: "epilogue",
    systemPrompt,
    userPrompt,
  });

  return {
    id: generateId("epilogue"),
    ...parsed,
  };
}

export async function generateMirrorResult({
  mission,
  session,
  allRounds,
  reactions,
  toolsUsed,
  previousMirrors,
}: {
  mission: Mission;
  session: MissionSession;
  allRounds: GeneratedScenarioRound[];
  reactions: SessionReaction[];
  toolsUsed: SessionToolUsage[];
  previousMirrors: MirrorResult[];
}): Promise<Omit<MirrorResult, "id" | "sessionId" | "childId" | "missionId" | "createdAt">> {
  const dominantTags = topValueTags(reactions, mission, session);
  const tagA = dominantTags[0] ?? "empathy";
  const tagB = dominantTags[1] ?? "logic";
  const previousToolCount = previousMirrors.length;
  const reframeCount = toolsUsed.filter((tool) => tool.toolType === "reframe").length;

  if (env.TAM_AI_MODE === "mock") {
    return {
      observations: [
        {
          text: `${session.initialChoiceLabel ?? "처음 선택"}에서 ${tagA} 쪽 마음이 먼저 보였어. 눈앞의 상황을 그냥 지나치지 않았네.`,
          valueTags: [tagA as ValueTag],
          tone: "neutral",
        },
        {
          text: `${mission.role}로 움직일 때 ${tagB}를 같이 챙기려는 편이었어. 기준이 흔들리기보다 점점 또렷해졌어.`,
          valueTags: [tagB as ValueTag],
          tone: "encouraging",
        },
      ],
      patternNote:
        previousToolCount > 0
          ? `이전 탐험들에 비해 이번에는 생각 도구를 ${toolsUsed.length}번 써봤어. 특히 다른 시각 도구는 ${reframeCount}번 눌렀네.`
          : null,
      nextSuggestion: {
        reason: "다음에는 다른 사람의 시선으로 같은 장면을 더 오래 바라보는 미션을 이어가면 좋아 보여",
        categoryHint: "perspective",
      },
    };
  }

  const { systemPrompt, userPrompt } = buildMirrorPrompts(
    mission, session, allRounds, reactions, toolsUsed,
    session.closingResponse, previousMirrors,
  );

  const parsed = await callOpenRouter({
    schema: mirrorSchema,
    schemaName: "mirror",
    systemPrompt,
    userPrompt,
  });

  return {
    observations: parsed.observations.map((observation) => ({
      ...observation,
      valueTags: observation.valueTags as ValueTag[],
    })),
    patternNote: parsed.patternNote,
    nextSuggestion: parsed.nextSuggestion,
  };
}

export async function generateGuideComment(report: WeeklyReport, profile: UserProfileSnapshot) {
  if (env.TAM_AI_MODE === "mock") {
    return (
      `${profile.name}이는 이번 주에 ${report.summary.worldsExplored.slice(0, 2).join(", ")} 같은 세계를 탐험했습니다. ` +
      `특히 ${report.patterns[0]?.title ?? "자기 기준을 세우는 장면"}이 반복해서 관찰됐습니다. ` +
      "다음 주에는 관점 전환 미션을 조금 더 섞어보면 새로운 패턴이 더 선명해질 수 있습니다."
    );
  }

  const { systemPrompt, userPrompt } = buildGuideCommentPrompts(report, profile);

  return await callOpenRouter({
    schema: z.object({ guideComment: z.string() }),
    schemaName: "guide_comment",
    systemPrompt,
    userPrompt,
  }).then((payload) => payload.guideComment);
}
