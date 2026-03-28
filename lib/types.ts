// ─── Core Types ───

export type MissionCategory =
  | "world"
  | "value"
  | "perspective"
  | "real"
  | "synthesis";

export type DifficultyType =
  | "value-conflict"
  | "dilemma"
  | "creative-judgment"
  | "perspective-shift"
  | "emotional-immersion"
  | "observation"
  | "problem-discovery"
  | "expression"
  | "comprehensive";

export type ValueTag =
  | "fairness"
  | "efficiency"
  | "safety"
  | "adventure"
  | "empathy"
  | "creativity"
  | "independence"
  | "community"
  | "logic"
  | "emotion";

export type ExpansionToolType = "broaden" | "reframe" | "subvert";

// ─── Scenario Chain (Interactive Story Board) ───

export interface EmotionCard {
  id: string;
  emoji: string;
  label: string;
  valueTags: ValueTag[];
}

export interface MethodCard {
  id: string;
  emoji: string;
  label: string;
  valueTags: ValueTag[];
}

export interface ScenarioCard {
  narrative: string;
  newDilemma?: string;
}

export interface ThinkingToolCard {
  type: ExpansionToolType;
  label: string;
  emoji: string;
  card: ScenarioCard;
}

export interface ScenarioRound {
  id: string;
  consequence: ScenarioCard;
  emotionOptions: EmotionCard[];
  methodOptions: MethodCard[];
  thinkingTools: ThinkingToolCard[];
  closingPrompt?: string;
}

export interface EpilogueScene {
  title: string;
  scenes: {
    text: string;
    mood: "positive" | "bittersweet" | "hopeful" | "tense";
  }[];
  closingLine: string;
}

export interface ScenarioChain {
  missionId: string;
  initialChoiceId: string;
  rounds: ScenarioRound[];
  epilogue: EpilogueScene;
  finalCard: ScenarioCard;
}

// ─── Data Models ───

export interface Choice {
  id: string;
  label: string;
  shortLabel: string;
  reasoning: string;
  valueTags: ValueTag[];
}

export interface ExpansionTool {
  type: ExpansionToolType;
  label: string;
  icon: string;
  prompts: string[];
}

export interface Mission {
  id: string;
  title: string;
  role: string;
  category: MissionCategory;
  difficulty: DifficultyType;
  worldSetting: {
    location: string;
    era: string;
    backdrop: string;
  };
  situation: string;
  coreQuestion: string;
  choices: Choice[];
  aiContext: {
    persona: string;
    followUpAngles: string[];
    expansionTools: ExpansionTool[];
  };
  tags: string[];
  estimatedMinutes: number;
  ageRange: [number, number];
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface MirrorObservation {
  text: string;
  valueTags: ValueTag[];
  tone: "neutral" | "encouraging" | "curious";
}

export interface MirrorResult {
  observations: MirrorObservation[];
  patternNote: string | null;
  nextSuggestion: {
    reason: string;
    categoryHint: MissionCategory;
  } | null;
}

export interface MissionSession {
  id: string;
  missionId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  choicesMade: {
    choiceId: string;
    timestamp: string;
    reflectionNote?: string;
  }[];
  conversation: ConversationMessage[];
  toolsUsed: {
    toolType: ExpansionToolType;
    count: number;
  }[];
  mirror?: MirrorResult;
}

export interface DiscoveryInsight {
  label: string;
  summary: string;
  dataPoints: number;
  confidence: "low" | "medium" | "high";
  icon: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  createdAt: string;
  stats: {
    totalMissions: number;
    currentStreak: number;
    longestStreak: number;
    totalMinutes: number;
  };
  discoveries: {
    worldPreference: DiscoveryInsight;
    valueOrientation: DiscoveryInsight;
    roleEnergy: DiscoveryInsight;
    decisionStyle: DiscoveryInsight;
    tonePreference: DiscoveryInsight;
  };
  interestMap: {
    category: string;
    score: number;
    trend: "up" | "stable" | "exploring";
  }[];
}

// ─── Helpers ───

export const CATEGORY_META: Record<
  MissionCategory,
  { label: string; color: string; lightBg: string; icon: string }
> = {
  world: { label: "세계 탐험", color: "#4A5FC1", lightBg: "#EEF0F9", icon: "🌍" },
  value: { label: "가치 선택", color: "#E8614D", lightBg: "#FEF0EE", icon: "⚖️" },
  perspective: { label: "관점 전환", color: "#D4A853", lightBg: "#FBF5E8", icon: "🔄" },
  real: { label: "현실 연결", color: "#4A5FC1", lightBg: "#EEF0F9", icon: "🔍" },
  synthesis: { label: "표현", color: "#E8614D", lightBg: "#FEF0EE", icon: "✨" },
};

export const DIFFICULTY_LABELS: Record<DifficultyType, string> = {
  "value-conflict": "가치 충돌형",
  dilemma: "딜레마형",
  "creative-judgment": "창작 판단형",
  "perspective-shift": "관점 전환형",
  "emotional-immersion": "감정 몰입형",
  observation: "관찰 분석형",
  "problem-discovery": "문제 발견형",
  expression: "표현 도전형",
  comprehensive: "종합 창작형",
};

export const VALUE_TAG_LABELS: Record<ValueTag, string> = {
  fairness: "공정성",
  efficiency: "효율",
  safety: "안전",
  adventure: "모험",
  empathy: "공감",
  creativity: "창의성",
  independence: "독립성",
  community: "공동체",
  logic: "논리",
  emotion: "감정",
};
