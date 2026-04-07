import { z } from "zod";

export const scenarioRoundSchema = z.object({
  consequence: z.object({
    narrative: z.string(),
    newDilemma: z.string(),
  }),
  reflectionHint: z.string().describe("메타인지 자극 질문 1줄 — 아이가 자기 사고 과정을 돌아보게 만드는 부드러운 질문"),
  emotionOptions: z.array(
    z.object({
      id: z.string(),
      emoji: z.string(),
      label: z.string(),
      valueTags: z.array(z.string()),
    }),
  ),
  methodOptions: z.array(
    z.object({
      id: z.string(),
      emoji: z.string(),
      label: z.string(),
      valueTags: z.array(z.string()),
    }),
  ),
  thinkingTools: z.array(
    z.object({
      type: z.enum(["broaden", "reframe", "subvert"]),
      label: z.string(),
      emoji: z.string(),
    }),
  ),
});

export const thinkingToolSchema = z.object({
  narrative: z.string(),
});

export const epilogueSchema = z.object({
  title: z.string(),
  scenes: z.array(
    z.object({
      text: z.string(),
      mood: z.enum(["positive", "bittersweet", "hopeful", "tense"]),
    }),
  ),
  closingLine: z.string(),
});

export const mirrorSchema = z.object({
  observations: z.array(
    z.object({
      text: z.string(),
      valueTags: z.array(z.string()),
      tone: z.enum(["neutral", "encouraging", "curious"]),
    }),
  ),
  patternNote: z.string().nullable(),
  nextSuggestion: z
    .object({
      reason: z.string(),
      categoryHint: z.enum(["world", "value", "perspective", "real", "synthesis"]),
    })
    .nullable(),
});

export const previewSetSchema = z.object({
  previews: z.array(
    z.object({
      title: z.string(),
      role: z.string(),
      category: z.enum(["world", "value", "perspective", "real", "synthesis"]),
      difficulty: z.enum([
        "value-conflict", "dilemma", "creative-judgment", "perspective-shift",
        "emotional-immersion", "observation", "problem-discovery", "expression", "comprehensive",
      ]),
      worldLocation: z.string(),
      era: z.string(),
      pitch: z.string(),
    }),
  ),
});

export const generatedMissionSchema = z.object({
  title: z.string(),
  role: z.string(),
  worldSetting: z.object({
    location: z.string(),
    era: z.string(),
    backdrop: z.string(),
  }),
  situation: z.string(),
  coreQuestion: z.string(),
  choices: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      shortLabel: z.string(),
      reasoning: z.string(),
      valueTags: z.array(z.string()),
    }),
  ),
  aiContext: z.object({
    persona: z.string(),
    followUpAngles: z.array(z.string()),
    expansionTools: z.array(
      z.object({
        type: z.enum(["broaden", "reframe", "subvert"]),
        label: z.string(),
        icon: z.string(),
        prompts: z.array(z.string()),
      }),
    ),
  }),
  tags: z.array(z.string()),
  estimatedMinutes: z.number(),
  ageRange: z.tuple([z.number(), z.number()]),
});

// Deep-dive: agent response with optional tool calls
export const agentResponseSchema = z.object({
  message: z.string(),
  toolCalls: z
    .array(
      z.object({
        name: z.enum([
          "present_real_case",
          "probe_deeper",
          "offer_perspective",
          "save_insight",
          "end_conversation",
        ]),
        arguments: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .optional(),
});
