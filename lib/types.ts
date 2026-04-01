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

// ─── Deep-Dive Types ───

export type DeepDiveStepType = "case" | "question" | "opinion" | "portfolio";

export interface DeepDiveStepOption {
  id: string;
  label: string;
}

export const DEEP_DIVE_STEP_META: Record<
  DeepDiveStepType,
  { label: string; description: string }
> = {
  case: { label: "현실 사례", description: "실제 세상에서 일어난 이야기" },
  question: { label: "핵심 질문", description: "한 걸음 더 깊이 생각해보기" },
  opinion: { label: "내 의견", description: "내 생각을 정리해보기" },
  portfolio: { label: "기록", description: "오늘의 탐구를 한 문장으로" },
};

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
