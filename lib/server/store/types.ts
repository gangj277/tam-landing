import type {
  ChildProfile,
  DailyChoiceSet,
  DeepDive,
  DeepDiveTurn,
  ExpansionToolType,
  FamilyAccount,
  FamilyDevice,
  GeneratedEpilogue,
  GeneratedScenarioRound,
  MirrorResult,
  Mission,
  MissionAssignment,
  MissionSession,
  SessionReaction,
  SessionToolUsage,
  ThinkingToolCard,
  UserProfileSnapshot,
  WeeklyReport,
} from "@/lib/server/types";

export type Store = {
  ensureMissionsSeeded: () => Promise<void>;
  listMissions: () => Promise<Mission[]>;
  getMission: (missionId: string) => Promise<Mission | null>;
  upsertMission: (mission: Mission) => Promise<void>;
  findFamilyByPhone: (ownerPhone: string) => Promise<FamilyAccount | null>;
  getFamily: (familyId: string) => Promise<FamilyAccount | null>;
  upsertFamily: (family: FamilyAccount) => Promise<void>;
  upsertFamilyDevice: (device: FamilyDevice) => Promise<void>;
  listChildrenByFamily: (familyId: string) => Promise<ChildProfile[]>;
  getChild: (childId: string) => Promise<ChildProfile | null>;
  upsertChild: (child: ChildProfile) => Promise<void>;
  getAssignment: (childId: string, assignmentDate: string) => Promise<MissionAssignment | null>;
  listAssignmentsByChild: (childId: string) => Promise<MissionAssignment[]>;
  upsertAssignment: (assignment: MissionAssignment) => Promise<void>;
  getSession: (sessionId: string) => Promise<MissionSession | null>;
  listSessionsByChild: (childId: string) => Promise<MissionSession[]>;
  upsertSession: (session: MissionSession) => Promise<void>;
  listReactionsBySession: (sessionId: string) => Promise<SessionReaction[]>;
  upsertReaction: (reaction: SessionReaction) => Promise<void>;
  listToolsBySession: (sessionId: string) => Promise<SessionToolUsage[]>;
  addTool: (tool: SessionToolUsage) => Promise<void>;
  listGeneratedRoundsBySession: (sessionId: string) => Promise<GeneratedScenarioRound[]>;
  getGeneratedRound: (sessionId: string, roundIndex: number) => Promise<GeneratedScenarioRound | null>;
  upsertGeneratedRound: (sessionId: string, round: GeneratedScenarioRound) => Promise<void>;
  listThinkingCardsBySession: (sessionId: string) => Promise<ThinkingToolCard[]>;
  getThinkingToolCard: (
    sessionId: string,
    roundIndex: number,
    toolType: ExpansionToolType,
  ) => Promise<ThinkingToolCard | null>;
  upsertThinkingToolCard: (
    sessionId: string,
    roundIndex: number,
    toolType: ExpansionToolType,
    card: ThinkingToolCard,
  ) => Promise<void>;
  getEpilogue: (sessionId: string) => Promise<GeneratedEpilogue | null>;
  upsertEpilogue: (sessionId: string, epilogue: GeneratedEpilogue) => Promise<void>;
  getMirrorById: (mirrorId: string) => Promise<MirrorResult | null>;
  getMirrorBySession: (sessionId: string) => Promise<MirrorResult | null>;
  listMirrorsByChild: (childId: string) => Promise<MirrorResult[]>;
  upsertMirror: (mirror: MirrorResult) => Promise<void>;
  getProfile: (childId: string) => Promise<UserProfileSnapshot | null>;
  upsertProfile: (profile: UserProfileSnapshot) => Promise<void>;
  getWeeklyReport: (childId: string, weekStart: string) => Promise<WeeklyReport | null>;
  getWeeklyReportById: (reportId: string) => Promise<WeeklyReport | null>;
  listWeeklyReports: (childId: string) => Promise<WeeklyReport[]>;
  upsertWeeklyReport: (report: WeeklyReport) => Promise<void>;
  getChoiceSet: (childId: string, choiceDate: string) => Promise<DailyChoiceSet | null>;
  listChoiceSetsByChild: (childId: string) => Promise<DailyChoiceSet[]>;
  upsertChoiceSet: (choiceSet: DailyChoiceSet) => Promise<void>;
  // Deep-dive v2
  getDeepDive: (deepDiveId: string) => Promise<DeepDive | null>;
  listDeepDivesByChild: (childId: string) => Promise<DeepDive[]>;
  upsertDeepDive: (deepDive: Omit<DeepDive, "turns">) => Promise<void>;
  getDeepDiveTurn: (deepDiveId: string, turnIndex: number) => Promise<DeepDiveTurn | null>;
  listDeepDiveTurns: (deepDiveId: string) => Promise<DeepDiveTurn[]>;
  upsertDeepDiveTurn: (turn: DeepDiveTurn) => Promise<void>;
};

export type MemoryState = {
  seeded: boolean;
  families: Map<string, FamilyAccount>;
  devices: Map<string, FamilyDevice>;
  children: Map<string, ChildProfile>;
  missions: Map<string, Mission>;
  assignments: Map<string, MissionAssignment>;
  sessions: Map<string, MissionSession>;
  reactions: Map<string, SessionReaction>;
  tools: Map<string, SessionToolUsage>;
  rounds: Map<string, GeneratedScenarioRound>;
  thinkingCards: Map<string, ThinkingToolCard>;
  epilogues: Map<string, GeneratedEpilogue>;
  mirrors: Map<string, MirrorResult>;
  profiles: Map<string, UserProfileSnapshot>;
  reports: Map<string, WeeklyReport>;
  choiceSets: Map<string, DailyChoiceSet>;
  deepDives: Map<string, Omit<DeepDive, "turns">>;
  deepDiveTurns: Map<string, DeepDiveTurn>;
};
