import { z } from "zod";

export const scenarioRoundSchema = z.object({
  consequence: z.object({
    narrative: z.string(),
    newDilemma: z.string(),
  }),
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

// Deep-dive: expert message is plain text wrapped in JSON for streaming compatibility
export const deepDiveExpertMessageSchema = z.object({
  expertMessage: z.string(),
});

export const deepDivePortfolioSchema = z.object({
  portfolioEntry: z.string(),
});
