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
export type ConfidenceLevel = "low" | "medium" | "high";
export type Trend = "up" | "stable" | "exploring";

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
  isActive: boolean;
  createdAt: string;
}

export interface ChildProfile {
  id: string;
  familyId: string;
  name: string;
  age: number;
  avatarSeed: string;
  isDefault: boolean;
  onboardedAt: string | null;
  createdAt: string;
}

export interface FamilyAccount {
  id: string;
  ownerPhone: string;
  ownerName: string;
  passwordHash: string;
  parentPinHash: string;
  activeChildId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyDevice {
  id: string;
  familyId: string;
  deviceId: string;
  createdAt: string;
  lastSeenAt: string;
}

export interface PublicChild {
  id: string;
  name: string;
  age: number;
  avatarSeed: string;
  isDefault: boolean;
}

export interface SessionReaction {
  id: string;
  sessionId: string;
  roundIndex: number;
  emotionId: string;
  emotionLabel: string;
  methodId: string;
  methodLabel: string;
  valueTags: ValueTag[];
  createdAt: string;
  updatedAt: string;
}

export interface SessionToolUsage {
  id: string;
  sessionId: string;
  roundIndex: number;
  toolType: ExpansionToolType;
  createdAt: string;
}

export interface EmotionOption {
  id: string;
  emoji: string;
  label: string;
  valueTags: ValueTag[];
}

export interface MethodOption {
  id: string;
  emoji: string;
  label: string;
  valueTags: ValueTag[];
}

export interface GeneratedScenarioRound {
  id: string;
  roundIndex: number;
  consequence: {
    narrative: string;
    newDilemma: string;
  };
  emotionOptions: EmotionOption[];
  methodOptions: MethodOption[];
  thinkingTools: {
    type: ExpansionToolType;
    label: string;
    emoji: string;
  }[];
}

export interface ThinkingToolCard {
  type: ExpansionToolType;
  label: string;
  emoji: string;
  card: {
    narrative: string;
  };
}

export interface GeneratedEpilogue {
  id: string;
  title: string;
  scenes: Array<{
    text: string;
    mood: "positive" | "bittersweet" | "hopeful" | "tense";
  }>;
  closingLine: string;
}

export interface MirrorObservation {
  text: string;
  valueTags: ValueTag[];
  tone: "neutral" | "encouraging" | "curious";
}

export interface MirrorResult {
  id: string;
  sessionId: string;
  childId: string;
  missionId: string;
  observations: MirrorObservation[];
  patternNote: string | null;
  nextSuggestion: {
    reason: string;
    categoryHint: MissionCategory;
  } | null;
  createdAt: string;
}

export interface MissionSession {
  id: string;
  childId: string;
  missionId: string;
  status: "active" | "completed" | "expired";
  startedAt: string;
  completedAt: string | null;
  initialChoiceId: string | null;
  initialChoiceLabel: string | null;
  reflectionNote: string | null;
  closingResponse: string | null;
  mirrorId: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MissionAssignment {
  id: string;
  childId: string;
  assignmentDate: string;
  missionId: string;
  reason: string;
  createdAt: string;
}

export interface MissionPreview {
  index: number;
  title: string;
  role: string;
  category: MissionCategory;
  difficulty: DifficultyType;
  worldLocation: string;
  era: string;
  pitch: string;
  slot: "fit" | "stretch" | "reveal";
}

export interface DailyChoiceSet {
  id: string;
  childId: string;
  choiceDate: string;
  previews: MissionPreview[];
  chosenIndex: number | null;
  chosenMissionId: string | null;
  strategy: { fit: number; stretch: number; reveal: number };
  createdAt: string;
  chosenAt: string | null;
}

export interface DiscoveryInsight {
  label: string;
  summary: string;
  dataPoints: number;
  confidence: ConfidenceLevel;
  icon: string;
}

export interface UserProfileSnapshot {
  id: string;
  childId: string;
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
  interestMap: Array<{
    category: string;
    score: number;
    trend: Trend;
  }>;
  updatedAt: string;
}

export interface PatternObservation {
  title: string;
  detail: string;
  stat?: string;
}

export interface WeeklyReport {
  id: string;
  childId: string;
  weekStart: string;
  weekEnd: string;
  generatedAt: string;
  summary: {
    missionsCompleted: number;
    totalMinutes: number;
    streak: number;
    worldsExplored: string[];
  };
  patterns: PatternObservation[];
  interestChanges: Array<{
    category: string;
    currentScore: number;
    previousScore: number;
    delta: number;
    trend: Trend;
  }>;
  guideComment: string;
}

export interface SessionDetail {
  session: MissionSession;
  mission: Mission;
  reactions: SessionReaction[];
  toolsUsed: SessionToolUsage[];
  generatedRounds: GeneratedScenarioRound[];
  thinkingToolCards: ThinkingToolCard[];
  epilogue: GeneratedEpilogue | null;
  mirror: MirrorResult | null;
}

export interface AuthTokenPayload extends Record<string, unknown> {
  familyId: string;
  activeChildId: string;
  deviceId: string;
  parentVerified: boolean;
  parentVerifiedAt?: string;
}

// ─── Deep-Dive Types (v2 — shared) ───

export interface DeepDiveRealWorldCase {
  headline: string;
  context: string;
  keyQuestion: string;
  source?: string;
}

export interface ExpertPersona {
  name: string;
  role: string;
  organization: string;
  personality: string;
  connectionToMission: string;
  personalAnecdote: string;
}

export type DeepDiveTurnType = "arrival" | "case" | "question" | "insight" | "portfolio";
export type DeepDiveInteractionType = "reaction" | "comparison" | "text" | "reflection" | "portfolio";

export interface DeepDiveTurnOption {
  id: string;
  label: string;
  valueTags?: string[];
}

export interface DeepDiveTurn {
  id: string;
  deepDiveId: string;
  turnIndex: number;
  type: DeepDiveTurnType;
  expertMessage: string | null;
  interactionType: DeepDiveInteractionType;
  options?: DeepDiveTurnOption[];
  selectedOptionId?: string;
  textResponse?: string;
  createdAt: string;
}

export interface DeepDive {
  id: string;
  missionId: string;
  sessionId: string | null;
  childId: string;
  expert: ExpertPersona;
  realWorldCase: DeepDiveRealWorldCase;
  turns: DeepDiveTurn[];
  portfolioEntry: string | null;
  status: "active" | "completed" | "expired";
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
}
