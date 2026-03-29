import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { MISSIONS as DUMMY_MISSIONS } from "@/lib/dummy-data";
import {
  buildScenarioRoundPrompts,
  buildThinkingToolPrompts,
  buildEpiloguePrompts,
  buildMirrorPrompts,
  buildGuideCommentPrompts,
  buildMissionGenerationPrompts,
} from "./ai/prompts";
import {
  AUTH_COOKIE_NAME,
  createAuthToken,
  createReportDownloadToken,
  createResetPinToken,
  verifyAuthToken,
  verifyReportDownloadToken,
  verifyResetPinToken,
} from "@/lib/server/auth/tokens";
import { parseCookieHeader, serializeCookie } from "@/lib/server/auth/cookies";
import { createDb } from "@/lib/server/db/client";
import {
  children,
  families,
  familyDevices,
  missionAssignments,
  missions,
  mirrors,
  profiles,
  sessionEpilogues,
  sessionGeneratedRounds,
  sessionReactions,
  sessions,
  sessionThinkingToolCards,
  sessionToolUsages,
  weeklyReports,
} from "@/lib/server/db/schema";
import { env } from "@/lib/server/env";
import {
  FIRST_SEVEN_DAY_CATEGORY_SEQUENCE,
  getAssignedCategoryForSequenceDay,
} from "@/lib/server/missions/assignment";
import { buildWeeklyReportPdf } from "@/lib/server/reports/pdf";
import type {
  AuthTokenPayload,
  ChildProfile,
  ConfidenceLevel,
  DifficultyType,
  ExpansionToolType,
  FamilyAccount,
  FamilyDevice,
  GeneratedEpilogue,
  GeneratedScenarioRound,
  MirrorResult,
  Mission,
  MissionAssignment,
  MissionCategory,
  MissionSession,
  PatternObservation,
  PublicChild,
  SessionDetail,
  SessionReaction,
  SessionToolUsage,
  ThinkingToolCard,
  UserProfileSnapshot,
  ValueTag,
  WeeklyReport,
} from "@/lib/server/types";
import {
  addHours,
  diffDays,
  endOfKstWeek,
  isWeekendKst,
  nowIso,
  previousKstDate,
  startOfKstWeek,
  toKstDateKey,
} from "@/lib/server/utils/date";
import { ApiError } from "@/lib/server/utils/http";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const PARENT_VERIFIED_TTL_SECONDS = 60 * 5;
const RESET_PIN_TTL_SECONDS = 60 * 15;
const REPORT_DOWNLOAD_TTL_SECONDS = 60 * 15;
const SYSTEM_CREATED_AT = "2026-03-29T00:00:00.000Z";

const seededMissions: Mission[] = DUMMY_MISSIONS.map((mission) => ({
  ...mission,
  isActive: true,
  createdAt: SYSTEM_CREATED_AT,
}));

type Store = {
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
};

type MemoryState = {
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
};

declare global {
  var __tamMemoryState__: MemoryState | undefined;
}

function generateId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function getMemoryState(): MemoryState {
  if (!globalThis.__tamMemoryState__) {
    globalThis.__tamMemoryState__ = {
      seeded: false,
      families: new Map(),
      devices: new Map(),
      children: new Map(),
      missions: new Map(),
      assignments: new Map(),
      sessions: new Map(),
      reactions: new Map(),
      tools: new Map(),
      rounds: new Map(),
      thinkingCards: new Map(),
      epilogues: new Map(),
      mirrors: new Map(),
      profiles: new Map(),
      reports: new Map(),
    };
  }

  return globalThis.__tamMemoryState__;
}

function createMemoryStore(): Store {
  const state = getMemoryState();

  return {
    async ensureMissionsSeeded() {
      if (state.seeded) {
        return;
      }

      for (const mission of seededMissions) {
        state.missions.set(mission.id, mission);
      }
      state.seeded = true;
    },
    async listMissions() {
      return [...state.missions.values()].filter((mission) => mission.isActive);
    },
    async getMission(missionId) {
      return state.missions.get(missionId) ?? null;
    },
    async upsertMission(mission) {
      state.missions.set(mission.id, mission);
    },
    async findFamilyByPhone(ownerPhone) {
      return [...state.families.values()].find((family) => family.ownerPhone === ownerPhone) ?? null;
    },
    async getFamily(familyId) {
      return state.families.get(familyId) ?? null;
    },
    async upsertFamily(family) {
      state.families.set(family.id, family);
    },
    async upsertFamilyDevice(device) {
      state.devices.set(device.id, device);
    },
    async listChildrenByFamily(familyId) {
      return [...state.children.values()].filter((child) => child.familyId === familyId);
    },
    async getChild(childId) {
      return state.children.get(childId) ?? null;
    },
    async upsertChild(child) {
      state.children.set(child.id, child);
    },
    async getAssignment(childId, assignmentDate) {
      return [...state.assignments.values()].find(
        (assignment) => assignment.childId === childId && assignment.assignmentDate === assignmentDate,
      ) ?? null;
    },
    async listAssignmentsByChild(childId) {
      return [...state.assignments.values()].filter((assignment) => assignment.childId === childId);
    },
    async upsertAssignment(assignment) {
      state.assignments.set(assignment.id, assignment);
    },
    async getSession(sessionId) {
      return state.sessions.get(sessionId) ?? null;
    },
    async listSessionsByChild(childId) {
      return [...state.sessions.values()].filter((session) => session.childId === childId);
    },
    async upsertSession(session) {
      state.sessions.set(session.id, session);
    },
    async listReactionsBySession(sessionId) {
      return [...state.reactions.values()].filter((reaction) => reaction.sessionId === sessionId);
    },
    async upsertReaction(reaction) {
      state.reactions.set(reaction.id, reaction);
    },
    async listToolsBySession(sessionId) {
      return [...state.tools.values()].filter((tool) => tool.sessionId === sessionId);
    },
    async addTool(tool) {
      state.tools.set(tool.id, tool);
    },
    async listGeneratedRoundsBySession(sessionId) {
      return [...state.rounds.values()].filter((round) => round.id.startsWith(`${sessionId}:`));
    },
    async getGeneratedRound(sessionId, roundIndex) {
      return state.rounds.get(`${sessionId}:${roundIndex}`) ?? null;
    },
    async upsertGeneratedRound(sessionId, round) {
      state.rounds.set(`${sessionId}:${round.roundIndex}`, round);
    },
    async listThinkingCardsBySession(sessionId) {
      return [...state.thinkingCards.entries()]
        .filter(([key]) => key.startsWith(`${sessionId}:`))
        .map(([, card]) => card);
    },
    async getThinkingToolCard(sessionId, roundIndex, toolType) {
      return state.thinkingCards.get(`${sessionId}:${roundIndex}:${toolType}`) ?? null;
    },
    async upsertThinkingToolCard(sessionId, roundIndex, toolType, card) {
      state.thinkingCards.set(`${sessionId}:${roundIndex}:${toolType}`, card);
    },
    async getEpilogue(sessionId) {
      return state.epilogues.get(sessionId) ?? null;
    },
    async upsertEpilogue(sessionId, epilogue) {
      state.epilogues.set(sessionId, epilogue);
    },
    async getMirrorById(mirrorId) {
      return state.mirrors.get(mirrorId) ?? null;
    },
    async getMirrorBySession(sessionId) {
      return [...state.mirrors.values()].find((mirror) => mirror.sessionId === sessionId) ?? null;
    },
    async listMirrorsByChild(childId) {
      return [...state.mirrors.values()].filter((mirror) => mirror.childId === childId);
    },
    async upsertMirror(mirror) {
      state.mirrors.set(mirror.id, mirror);
    },
    async getProfile(childId) {
      return state.profiles.get(childId) ?? null;
    },
    async upsertProfile(profile) {
      state.profiles.set(profile.childId, profile);
    },
    async getWeeklyReport(childId, weekStart) {
      return [...state.reports.values()].find(
        (report) => report.childId === childId && report.weekStart === weekStart,
      ) ?? null;
    },
    async getWeeklyReportById(reportId) {
      return state.reports.get(reportId) ?? null;
    },
    async listWeeklyReports(childId) {
      return [...state.reports.values()].filter((report) => report.childId === childId);
    },
    async upsertWeeklyReport(report) {
      state.reports.set(report.id, report);
    },
  };
}

function createPostgresStore(): Store {
  const db = createDb();

  return {
    async ensureMissionsSeeded() {
      const existing = await db.select().from(missions);
      if (existing.length > 0) {
        return;
      }

      for (const mission of seededMissions) {
        await db.insert(missions).values({
          id: mission.id,
          category: mission.category,
          difficulty: mission.difficulty,
          isActive: mission.isActive,
          payload: mission,
          createdAt: mission.createdAt,
        });
      }
    },
    async listMissions() {
      const rows = await db.select().from(missions);
      return rows.filter((row) => row.isActive).map((row) => row.payload as Mission);
    },
    async getMission(missionId) {
      const row = await db.query.missions.findFirst({
        where: eq(missions.id, missionId),
      });
      return row ? (row.payload as Mission) : null;
    },
    async upsertMission(mission) {
      await db
        .insert(missions)
        .values({
          id: mission.id,
          category: mission.category,
          difficulty: mission.difficulty,
          isActive: mission.isActive,
          payload: mission,
          createdAt: mission.createdAt,
        })
        .onConflictDoUpdate({
          target: missions.id,
          set: { payload: mission, isActive: mission.isActive },
        });
    },
    async findFamilyByPhone(ownerPhone) {
      const row = await db.query.families.findFirst({
        where: eq(families.ownerPhone, ownerPhone),
      });
      return row ?? null;
    },
    async getFamily(familyId) {
      const row = await db.query.families.findFirst({
        where: eq(families.id, familyId),
      });
      return row ?? null;
    },
    async upsertFamily(family) {
      await db.insert(families).values(family).onConflictDoUpdate({
        target: families.id,
        set: family,
      });
    },
    async upsertFamilyDevice(device) {
      await db.insert(familyDevices).values(device).onConflictDoUpdate({
        target: familyDevices.id,
        set: device,
      });
    },
    async listChildrenByFamily(familyId) {
      return (await db.select().from(children).where(eq(children.familyId, familyId))) as ChildProfile[];
    },
    async getChild(childId) {
      return ((await db.query.children.findFirst({
        where: eq(children.id, childId),
      })) as ChildProfile | undefined) ?? null;
    },
    async upsertChild(child) {
      await db.insert(children).values(child).onConflictDoUpdate({
        target: children.id,
        set: child,
      });
    },
    async getAssignment(childId, assignmentDate) {
      return ((await db.query.missionAssignments.findFirst({
        where: and(
          eq(missionAssignments.childId, childId),
          eq(missionAssignments.assignmentDate, assignmentDate),
        ),
      })) as MissionAssignment | undefined) ?? null;
    },
    async listAssignmentsByChild(childId) {
      return (
        await db.select().from(missionAssignments).where(eq(missionAssignments.childId, childId))
      ) as MissionAssignment[];
    },
    async upsertAssignment(assignment) {
      await db.insert(missionAssignments).values(assignment).onConflictDoUpdate({
        target: missionAssignments.id,
        set: assignment,
      });
    },
    async getSession(sessionId) {
      return ((await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
      })) as MissionSession | undefined) ?? null;
    },
    async listSessionsByChild(childId) {
      return (await db.select().from(sessions).where(eq(sessions.childId, childId))) as MissionSession[];
    },
    async upsertSession(session) {
      await db.insert(sessions).values(session).onConflictDoUpdate({
        target: sessions.id,
        set: session,
      });
    },
    async listReactionsBySession(sessionId) {
      const rows = await db.select().from(sessionReactions).where(eq(sessionReactions.sessionId, sessionId));
      return rows.map((row) => ({
        ...row,
        valueTags: row.valueTags as ValueTag[],
      })) as SessionReaction[];
    },
    async upsertReaction(reaction) {
      await db.insert(sessionReactions).values({
        ...reaction,
        valueTags: reaction.valueTags,
      }).onConflictDoUpdate({
        target: sessionReactions.id,
        set: {
          ...reaction,
          valueTags: reaction.valueTags,
        },
      });
    },
    async listToolsBySession(sessionId) {
      return (await db.select().from(sessionToolUsages).where(eq(sessionToolUsages.sessionId, sessionId))).map(
        (row) => ({
          ...row,
          toolType: row.toolType as ExpansionToolType,
        }),
      );
    },
    async addTool(tool) {
      await db.insert(sessionToolUsages).values(tool);
    },
    async listGeneratedRoundsBySession(sessionId) {
      const rows = await db.select().from(sessionGeneratedRounds).where(eq(sessionGeneratedRounds.sessionId, sessionId));
      return rows.map((row) => row.payload as GeneratedScenarioRound);
    },
    async getGeneratedRound(sessionId, roundIndex) {
      const row = await db.query.sessionGeneratedRounds.findFirst({
        where: and(
          eq(sessionGeneratedRounds.sessionId, sessionId),
          eq(sessionGeneratedRounds.roundIndex, roundIndex),
        ),
      });
      return row ? (row.payload as GeneratedScenarioRound) : null;
    },
    async upsertGeneratedRound(sessionId, round) {
      const rowId = `${sessionId}:${round.roundIndex}`;
      await db.insert(sessionGeneratedRounds).values({
        id: rowId,
        sessionId,
        roundIndex: round.roundIndex,
        payload: round,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      }).onConflictDoUpdate({
        target: sessionGeneratedRounds.id,
        set: {
          payload: round,
          updatedAt: nowIso(),
        },
      });
    },
    async listThinkingCardsBySession(sessionId) {
      const rows = await db.select().from(sessionThinkingToolCards).where(eq(sessionThinkingToolCards.sessionId, sessionId));
      return rows.map((row) => row.payload as ThinkingToolCard);
    },
    async getThinkingToolCard(sessionId, roundIndex, toolType) {
      const row = await db.query.sessionThinkingToolCards.findFirst({
        where: and(
          eq(sessionThinkingToolCards.sessionId, sessionId),
          eq(sessionThinkingToolCards.roundIndex, roundIndex),
          eq(sessionThinkingToolCards.toolType, toolType),
        ),
      });
      return row ? (row.payload as ThinkingToolCard) : null;
    },
    async upsertThinkingToolCard(sessionId, roundIndex, toolType, card) {
      await db.insert(sessionThinkingToolCards).values({
        id: `${sessionId}:${roundIndex}:${toolType}`,
        sessionId,
        roundIndex,
        toolType,
        payload: card,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      }).onConflictDoUpdate({
        target: sessionThinkingToolCards.id,
        set: {
          payload: card,
          updatedAt: nowIso(),
        },
      });
    },
    async getEpilogue(sessionId) {
      const row = await db.query.sessionEpilogues.findFirst({
        where: eq(sessionEpilogues.sessionId, sessionId),
      });
      return row ? (row.payload as GeneratedEpilogue) : null;
    },
    async upsertEpilogue(sessionId, epilogue) {
      await db.insert(sessionEpilogues).values({
        id: sessionId,
        sessionId,
        payload: epilogue,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      }).onConflictDoUpdate({
        target: sessionEpilogues.id,
        set: {
          payload: epilogue,
          updatedAt: nowIso(),
        },
      });
    },
    async getMirrorById(mirrorId) {
      const row = await db.query.mirrors.findFirst({
        where: eq(mirrors.id, mirrorId),
      });
      return row ? (row.payload as MirrorResult) : null;
    },
    async getMirrorBySession(sessionId) {
      const row = await db.query.mirrors.findFirst({
        where: eq(mirrors.sessionId, sessionId),
      });
      return row ? (row.payload as MirrorResult) : null;
    },
    async listMirrorsByChild(childId) {
      const rows = await db.select().from(mirrors).where(eq(mirrors.childId, childId));
      return rows.map((row) => row.payload as MirrorResult);
    },
    async upsertMirror(mirror) {
      await db.insert(mirrors).values({
        id: mirror.id,
        sessionId: mirror.sessionId,
        childId: mirror.childId,
        missionId: mirror.missionId,
        payload: mirror,
        createdAt: mirror.createdAt,
      }).onConflictDoUpdate({
        target: mirrors.id,
        set: {
          payload: mirror,
          createdAt: mirror.createdAt,
        },
      });
    },
    async getProfile(childId) {
      const row = await db.query.profiles.findFirst({
        where: eq(profiles.childId, childId),
      });
      return row ? (row.payload as UserProfileSnapshot) : null;
    },
    async upsertProfile(profile) {
      await db.insert(profiles).values({
        id: profile.childId,
        childId: profile.childId,
        payload: profile,
        recalculatedAt: profile.updatedAt,
        updatedAt: profile.updatedAt,
      }).onConflictDoUpdate({
        target: profiles.id,
        set: {
          payload: profile,
          recalculatedAt: profile.updatedAt,
          updatedAt: profile.updatedAt,
        },
      });
    },
    async getWeeklyReport(childId, weekStart) {
      const row = await db.query.weeklyReports.findFirst({
        where: and(eq(weeklyReports.childId, childId), eq(weeklyReports.weekStart, weekStart)),
      });
      return row ? ({ ...(row.payload as WeeklyReport), guideComment: row.guideComment }) : null;
    },
    async getWeeklyReportById(reportId) {
      const row = await db.query.weeklyReports.findFirst({
        where: eq(weeklyReports.id, reportId),
      });
      return row ? ({ ...(row.payload as WeeklyReport), guideComment: row.guideComment }) : null;
    },
    async listWeeklyReports(childId) {
      const rows = await db.select().from(weeklyReports).where(eq(weeklyReports.childId, childId));
      return rows.map((row) => ({ ...(row.payload as WeeklyReport), guideComment: row.guideComment }));
    },
    async upsertWeeklyReport(report) {
      await db.insert(weeklyReports).values({
        id: report.id,
        childId: report.childId,
        weekStart: report.weekStart,
        weekEnd: report.weekEnd,
        payload: report,
        guideComment: report.guideComment,
        createdAt: report.generatedAt,
        updatedAt: report.generatedAt,
      }).onConflictDoUpdate({
        target: weeklyReports.id,
        set: {
          payload: report,
          guideComment: report.guideComment,
          updatedAt: report.generatedAt,
        },
      });
    },
  };
}

let cachedStore: Store | null = null;

function getStore() {
  if (env.TAM_DATA_BACKEND === "memory") {
    return createMemoryStore();
  }

  if (!cachedStore) {
    cachedStore = createPostgresStore();
  }
  return cachedStore;
}

async function withSeededStore() {
  const store = getStore();
  await store.ensureMissionsSeeded();
  return store;
}

function toPublicChild(child: ChildProfile): PublicChild {
  return {
    id: child.id,
    name: child.name,
    age: child.age,
    avatarSeed: child.avatarSeed,
    isDefault: child.isDefault,
  };
}

function deriveAvatarSeed(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "") || "child";
}

function parentIsFresh(payload: AuthTokenPayload) {
  if (!payload.parentVerified || !payload.parentVerifiedAt) {
    return false;
  }

  return Date.now() - new Date(payload.parentVerifiedAt).getTime() <= PARENT_VERIFIED_TTL_SECONDS * 1000;
}

function isSessionExpired(session: MissionSession) {
  return session.status === "active" && new Date(session.expiresAt).getTime() <= Date.now();
}

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

function ensureSessionIsActive(session: MissionSession) {
  if (session.status !== "active") {
    throw new ApiError(409, "SESSION_NOT_ACTIVE", "Only active sessions can be updated");
  }
  if (isSessionExpired(session)) {
    throw new ApiError(409, "SESSION_EXPIRED", "This session has expired and can no longer be updated");
  }
}

export async function requireAuth(request: Request, options?: { requireParent?: boolean }) {
  const cookieMap = parseCookieHeader(request.headers.get("cookie"));
  const token = cookieMap.get(AUTH_COOKIE_NAME);
  if (!token) {
    throw new ApiError(401, "UNAUTHORIZED", "Authentication cookie is missing");
  }

  const payload = await verifyAuthToken(token);
  if (options?.requireParent && !parentIsFresh(payload)) {
    throw new ApiError(403, "PARENT_VERIFICATION_REQUIRED", "Parent verification is required");
  }

  return payload;
}

function authCookie(token: string) {
  return serializeCookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

async function issueToken(payload: AuthTokenPayload) {
  const token = await createAuthToken(payload);
  return {
    token,
    cookie: authCookie(token),
  };
}

async function deliverResetPinSms(ownerPhone: string, resetToken: string) {
  if (!env.RESEND_API_KEY) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [ownerPhone],
      subject: "탐 부모 PIN 재설정 링크",
      html:
        "<p>탐 부모 PIN 재설정 요청이 접수되었습니다.</p>" +
        `<p>앱에서 아래 토큰을 사용해 새 PIN을 설정하세요.</p><pre>${resetToken}</pre>` +
        "<p>이 토큰은 15분 동안만 유효합니다.</p>",
    }),
  });

  if (!response.ok) {
    throw new ApiError(502, "RESET_PIN_EMAIL_FAILED", await response.text());
  }

  return true;
}

async function getFamilyContextFromPayload(payload: AuthTokenPayload) {
  const store = await withSeededStore();
  const family = await store.getFamily(payload.familyId);
  if (!family) {
    throw new ApiError(401, "INVALID_TOKEN", "Family was not found");
  }
  const activeChild = await store.getChild(payload.activeChildId);
  if (!activeChild || activeChild.familyId !== family.id) {
    throw new ApiError(401, "INVALID_TOKEN", "Active child was not found");
  }

  return {
    store,
    family,
    activeChild,
  };
}

function createChoiceLabel(mission: Mission, choiceId: string) {
  return mission.choices.find((choice) => choice.id === choiceId)?.label ?? choiceId;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function confidenceFor(dataPoints: number): ConfidenceLevel {
  if (dataPoints >= 10) return "high";
  if (dataPoints >= 5) return "medium";
  return "low";
}

function topValueTags(reactions: SessionReaction[], mission: Mission, session: MissionSession): ValueTag[] {
  const counts = new Map<ValueTag, number>();
  const initialChoice = mission.choices.find((choice) => choice.id === session.initialChoiceId);
  for (const tag of initialChoice?.valueTags ?? []) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  for (const reaction of reactions) {
    for (const tag of reaction.valueTags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([tag]) => tag);
}

function roleBucket(role: string) {
  if (role.includes("리더") || role.includes("시장") || role.includes("책임자")) return "리더십";
  if (role.includes("디자이너") || role.includes("크리에이티브")) return "창작";
  if (role.includes("중재") || role.includes("공감") || role.includes("조율")) return "조율";
  return "관찰";
}

function trendFromScores(current: number, previous: number, dataPoints: number): "up" | "stable" | "exploring" {
  if (dataPoints < 3) return "exploring";
  const delta = current - previous;
  if (delta > 5) return "up";
  return "stable";
}

function initialChoiceReason(category: MissionCategory) {
  switch (category) {
    case "world":
      return "몰입감 높은 세계 탐험을 먼저 배정했어요";
    case "value":
      return "가치 딜레마 경험을 넓혀보려고 했어요";
    case "perspective":
      return "다른 시각으로 생각해보는 연습을 이어가요";
    case "real":
      return "현실과 연결되는 관찰 미션을 넣었어요";
    case "synthesis":
      return "표현과 종합 미션으로 주간 루프를 마무리해요";
  }
}

function categoryForLowConfidenceAxis(profile: UserProfileSnapshot | null): MissionCategory | null {
  if (!profile) return null;
  const discoveries = profile.discoveries;
  if (discoveries.worldPreference.confidence === "low") return "world";
  if (discoveries.valueOrientation.confidence === "low") return "value";
  if (discoveries.roleEnergy.confidence === "low") return "world";
  if (discoveries.decisionStyle.confidence === "low") return "perspective";
  if (discoveries.tonePreference.confidence === "low") return "synthesis";
  return null;
}

function chooseMissionByCategory(
  missionsList: Mission[],
  category: MissionCategory,
  previousAssignments: MissionAssignment[],
): Mission | null {
  const assignedMissionIds = new Set(previousAssignments.map((assignment) => assignment.missionId));
  const categoryMissions = missionsList.filter((mission) => mission.category === category);
  // Return unassigned mission, or null if all used (triggers AI generation)
  return categoryMissions.find((mission) => !assignedMissionIds.has(mission.id)) ?? null;
}

const scenarioRoundSchema = z.object({
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

const thinkingToolSchema = z.object({
  narrative: z.string(),
});

const epilogueSchema = z.object({
  title: z.string(),
  scenes: z.array(
    z.object({
      text: z.string(),
      mood: z.enum(["positive", "bittersweet", "hopeful", "tense"]),
    }),
  ),
  closingLine: z.string(),
});

const mirrorSchema = z.object({
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

const generatedMissionSchema = z.object({
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

function extractJsonPayload(content: string) {
  const trimmed = content.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error("No JSON object found in model response");
}

async function callOpenRouter<T>({
  schema,
  schemaName,
  systemPrompt,
  userPrompt,
}: {
  schema: z.ZodSchema<T>;
  schemaName: string;
  systemPrompt: string;
  userPrompt: string;
}): Promise<T> {
  let lastError: unknown = null;
  const jsonSchema = z.toJSONSchema(schema);

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: env.OPENROUTER_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: schemaName,
              strict: true,
              schema: jsonSchema,
            },
          },
          temperature: 1.0,
        }),
        signal: AbortSignal.timeout(30_000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status >= 500 && attempt < 3) {
          lastError = new ApiError(response.status, "OPENROUTER_ERROR", errorText);
          continue;
        }
        throw new ApiError(response.status, "OPENROUTER_ERROR", errorText);
      }

      const payload = (await response.json()) as {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
      };
      const content = payload.choices?.[0]?.message?.content;
      if (!content) {
        throw new ApiError(502, "OPENROUTER_EMPTY_RESPONSE", "OpenRouter returned an empty response");
      }

      const parsedJson = JSON.parse(extractJsonPayload(content));
      return schema.parse(parsedJson);
    } catch (error) {
      lastError = error;

      if (error instanceof ApiError && error.code === "OPENROUTER_ERROR" && error.status < 500) {
        throw error;
      }

      if (error instanceof ApiError && error.code === "OPENROUTER_EMPTY_RESPONSE" && attempt >= 3) {
        throw error;
      }

      if (
        error instanceof Error &&
        (error.name === "TimeoutError" || error.name === "AbortError") &&
        attempt >= 3
      ) {
        throw new ApiError(504, "OPENROUTER_TIMEOUT", "OpenRouter request timed out");
      }

      if (attempt >= 3) {
        throw new ApiError(
          502,
          "OPENROUTER_INVALID_RESPONSE",
          error instanceof Error ? error.message : "OpenRouter returned invalid JSON",
        );
      }
    }
  }

  throw new ApiError(
    502,
    "OPENROUTER_INVALID_RESPONSE",
    lastError instanceof Error ? lastError.message : "OpenRouter failed to return valid JSON",
  );
}

// ─── Streaming OpenRouter call ───
// Returns a ReadableStream of SSE events: "token" events with JSON chunks, "complete" event with parsed result

function callOpenRouterStream({
  schema,
  schemaName,
  systemPrompt,
  userPrompt,
}: {
  schema: z.ZodSchema;
  schemaName: string;
  systemPrompt: string;
  userPrompt: string;
}): ReadableStream<Uint8Array> {
  const jsonSchema = z.toJSONSchema(schema);
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: env.OPENROUTER_MODEL,
            stream: true,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            response_format: {
              type: "json_schema",
              json_schema: { name: schemaName, strict: true, schema: jsonSchema },
            },
            temperature: 1.0,
          }),
          signal: AbortSignal.timeout(60_000),
        });

        if (!response.ok || !response.body) {
          const errorText = await response.text();
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: errorText })}\n\n`));
          controller.close();
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const chunk = JSON.parse(data);
              const delta = chunk.choices?.[0]?.delta?.content;
              if (delta) {
                accumulated += delta;
                // Send raw token to client
                controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify({ t: delta })}\n\n`));
              }
            } catch {
              // Skip malformed SSE lines
            }
          }
        }

        // Parse the complete accumulated JSON
        try {
          const parsed = JSON.parse(extractJsonPayload(accumulated));
          const validated = schema.parse(parsed);
          controller.enqueue(encoder.encode(`event: complete\ndata: ${JSON.stringify(validated)}\n\n`));
        } catch (e) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: e instanceof Error ? e.message : "Parse error" })}\n\n`));
        }
      } catch (e) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: e instanceof Error ? e.message : "Stream error" })}\n\n`));
      }

      controller.close();
    },
  });
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

// Wrapper that does auth + validation, returns stream + save function
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
    // Already generated — return as instant stream
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

  // Wrap the stream to auto-save the round when complete
  const encoder = new TextEncoder();
  const savedStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = stream.getReader();
      let savedRound = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Check if this chunk contains a complete event — save before forwarding
          const text = new TextDecoder().decode(value);
          if (text.includes("event: complete\n")) {
            // Extract the round data and save it
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

function buildMockRound(mission: Mission, roundIndex: number, session: MissionSession): GeneratedScenarioRound {
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

async function generateScenarioRound(
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

async function generateThinkingToolCard(
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

async function generateEpilogue(
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

async function generateMirrorResult({
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

async function generateGuideComment(report: WeeklyReport, profile: UserProfileSnapshot) {
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

// ─── AI Mission Generation (Day 8+) ───

async function generateNewMission(
  store: Store,
  childId: string,
  category: MissionCategory,
  difficulty: DifficultyType,
): Promise<Mission> {
  // Gather child context
  const profile = await store.getProfile(childId);
  if (!profile) {
    throw new ApiError(404, "PROFILE_NOT_FOUND", "Child profile is required for mission generation");
  }

  const mirrors = await store.listMirrorsByChild(childId);
  const sessions = await store.listSessionsByChild(childId);
  const allMissions = await store.listMissions();

  // Past mission titles and locations for dedup
  const completedMissionIds = new Set(
    sessions.filter((s) => s.status === "completed").map((s) => s.missionId),
  );
  const pastMissions = allMissions.filter((m) => completedMissionIds.has(m.id));
  const pastTitles = pastMissions.map((m) => m.title);
  const pastLocations = pastMissions.map((m) => m.worldSetting.location);

  const { systemPrompt, userPrompt } = buildMissionGenerationPrompts(
    category,
    difficulty,
    profile,
    mirrors,
    pastTitles,
    pastLocations,
  );

  // Generate with retry
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const parsed = await callOpenRouter({
        schema: generatedMissionSchema,
        schemaName: "mission",
        systemPrompt,
        userPrompt,
      });

      // Validate structure
      if (parsed.choices.length !== 3) continue;
      if (parsed.aiContext.expansionTools.length !== 3) continue;
      if (parsed.aiContext.followUpAngles.length !== 4) continue;

      const validTags = new Set(["fairness", "efficiency", "safety", "adventure", "empathy", "creativity", "independence", "community", "logic", "emotion"]);
      const tagsValid = parsed.choices.every(
        (c) => c.valueTags.length === 2 && c.valueTags.every((t) => validTags.has(t)),
      );
      if (!tagsValid) continue;

      // Build Mission object
      const mission: Mission = {
        id: generateId("mission"),
        title: parsed.title,
        role: parsed.role,
        category,
        difficulty,
        worldSetting: parsed.worldSetting,
        situation: parsed.situation,
        coreQuestion: parsed.coreQuestion,
        choices: parsed.choices.map((c) => ({
          ...c,
          valueTags: c.valueTags as ValueTag[],
        })),
        aiContext: {
          persona: parsed.aiContext.persona,
          followUpAngles: parsed.aiContext.followUpAngles,
          expansionTools: parsed.aiContext.expansionTools.map((t) => ({
            ...t,
            type: t.type as ExpansionToolType,
          })),
        },
        tags: parsed.tags,
        estimatedMinutes: Math.max(5, Math.min(10, parsed.estimatedMinutes)),
        ageRange: parsed.ageRange as [number, number],
        isActive: true,
        createdAt: nowIso(),
      };

      await store.upsertMission(mission);
      return mission;
    } catch {
      // Retry on parse/validation failure
      if (attempt >= 1) break;
    }
  }

  // Fallback: reuse any mission in the category
  const fallback = allMissions.find((m) => m.category === category) ?? allMissions[0];
  if (!fallback) {
    throw new ApiError(500, "NO_MISSIONS_AVAILABLE", "No missions available for fallback");
  }
  return fallback;
}

export async function signupFamily(input: {
  ownerPhone: string;
  ownerName: string;
  password: string;
  parentPIN: string;
  firstChild: {
    name: string;
    age: number;
  };
}) {
  const store = await withSeededStore();
  const existingFamily = await store.findFamilyByPhone(input.ownerPhone);
  if (existingFamily) {
    throw new ApiError(409, "PHONE_ALREADY_EXISTS", "A family account already exists for this phone number");
  }

  const timestamp = nowIso();
  const familyId = generateId("family");
  const childId = generateId("child");
  const deviceId = generateId("device");
  const family: FamilyAccount = {
    id: familyId,
    ownerPhone: input.ownerPhone,
    ownerName: input.ownerName,
    passwordHash: await bcrypt.hash(input.password, 10),
    parentPinHash: await bcrypt.hash(input.parentPIN, 10),
    activeChildId: childId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const child: ChildProfile = {
    id: childId,
    familyId,
    name: input.firstChild.name,
    age: input.firstChild.age,
    avatarSeed: deriveAvatarSeed(input.firstChild.name),
    isDefault: true,
    onboardedAt: null,
    createdAt: timestamp,
  };

  await store.upsertFamily(family);
  await store.upsertChild(child);
  await store.upsertFamilyDevice({
    id: generateId("family-device"),
    familyId,
    deviceId,
    createdAt: timestamp,
    lastSeenAt: timestamp,
  });

  const auth = await issueToken({
    familyId,
    activeChildId: childId,
    deviceId,
    parentVerified: false,
  });

  return {
    familyId,
    activeChild: toPublicChild(child),
    children: [toPublicChild(child)],
    auth,
  };
}

export async function loginFamily(input: { phone: string; password: string }) {
  const store = await withSeededStore();
  const family = await store.findFamilyByPhone(input.phone);
  if (!family) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid phone number or password");
  }
  const isValid = await bcrypt.compare(input.password, family.passwordHash);
  if (!isValid) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid phone number or password");
  }

  const childrenList = await store.listChildrenByFamily(family.id);
  const activeChild = childrenList.find((child) => child.id === family.activeChildId) ?? childrenList[0];
  if (!activeChild) {
    throw new ApiError(500, "NO_CHILD_PROFILE", "No child profile exists for the family account");
  }

  const timestamp = nowIso();
  const deviceId = generateId("device");
  await store.upsertFamilyDevice({
    id: generateId("family-device"),
    familyId: family.id,
    deviceId,
    createdAt: timestamp,
    lastSeenAt: timestamp,
  });

  const auth = await issueToken({
    familyId: family.id,
    activeChildId: activeChild.id,
    deviceId,
    parentVerified: false,
  });

  return {
    familyId: family.id,
    activeChildId: activeChild.id,
    children: childrenList.map(toPublicChild),
    auth,
  };
}

export async function verifyParentPin(payload: AuthTokenPayload, input: { pin: string }) {
  const { store, family } = await getFamilyContextFromPayload(payload);
  const isValid = await bcrypt.compare(input.pin, family.parentPinHash);
  if (!isValid) {
    throw new ApiError(401, "INVALID_PARENT_PIN", "Parent PIN is incorrect");
  }

  const auth = await issueToken({
    ...payload,
    parentVerified: true,
    parentVerifiedAt: nowIso(),
  });

  return {
    verified: true,
    expiresIn: PARENT_VERIFIED_TTL_SECONDS,
    auth,
    store,
  };
}

export async function requestParentPinReset(input: { ownerPhone: string }) {
  const store = await withSeededStore();
  const family = await store.findFamilyByPhone(input.ownerPhone);
  if (!family) {
    return {
      requested: true,
      expiresIn: RESET_PIN_TTL_SECONDS,
      delivery: env.NODE_ENV === "production" ? "sms" : "preview",
    };
  }

  const resetToken = await createResetPinToken({
    familyId: family.id,
    ownerPhone: family.ownerPhone,
  });
  const delivered = await deliverResetPinSms(family.ownerPhone, resetToken);

  return {
    requested: true,
    expiresIn: RESET_PIN_TTL_SECONDS,
    delivery: delivered ? "sms" : "preview",
    resetTokenPreview: delivered || env.NODE_ENV === "production" ? undefined : resetToken,
  };
}

export async function confirmParentPinReset(input: { resetToken: string; newPIN: string }) {
  let tokenPayload;
  try {
    tokenPayload = await verifyResetPinToken(input.resetToken);
  } catch (error) {
    throw new ApiError(
      401,
      "INVALID_RESET_PIN_TOKEN",
      error instanceof Error ? error.message : "Reset PIN token is invalid",
    );
  }

  const store = await withSeededStore();
  const family = await store.getFamily(tokenPayload.familyId);
  if (!family || family.ownerPhone !== tokenPayload.ownerPhone) {
    throw new ApiError(404, "FAMILY_NOT_FOUND", "Family account was not found");
  }

  await store.upsertFamily({
    ...family,
    parentPinHash: await bcrypt.hash(input.newPIN, 10),
    updatedAt: nowIso(),
  });

  return {
    updated: true,
  };
}

export async function getFamilyMe(payload: AuthTokenPayload) {
  const { store, family, activeChild } = await getFamilyContextFromPayload(payload);
  const childrenList = await store.listChildrenByFamily(family.id);

  return {
    familyId: family.id,
    ownerName: family.ownerName,
    ownerPhone: family.ownerPhone,
    activeChildId: family.activeChildId,
    activeChild: toPublicChild(activeChild),
    children: childrenList.map(toPublicChild),
    parentVerified: parentIsFresh(payload),
  };
}

export async function addChildProfile(payload: AuthTokenPayload, input: { name: string; age: number }) {
  if (!parentIsFresh(payload)) {
    throw new ApiError(403, "PARENT_VERIFICATION_REQUIRED", "Parent verification is required");
  }

  const { store, family } = await getFamilyContextFromPayload(payload);
  const child: ChildProfile = {
    id: generateId("child"),
    familyId: family.id,
    name: input.name,
    age: input.age,
    avatarSeed: deriveAvatarSeed(input.name),
    isDefault: false,
    onboardedAt: null,
    createdAt: nowIso(),
  };
  await store.upsertChild(child);
  return { child: toPublicChild(child) };
}

export async function switchActiveChild(payload: AuthTokenPayload, input: { childId: string }) {
  const { store, family } = await getFamilyContextFromPayload(payload);
  const child = await store.getChild(input.childId);
  if (!child || child.familyId !== family.id) {
    throw new ApiError(404, "CHILD_NOT_FOUND", "Child profile was not found");
  }

  const updatedFamily: FamilyAccount = {
    ...family,
    activeChildId: child.id,
    updatedAt: nowIso(),
  };
  await store.upsertFamily(updatedFamily);
  const auth = await issueToken({
    ...payload,
    activeChildId: child.id,
  });

  return {
    activeChildId: child.id,
    name: child.name,
    auth,
  };
}

export async function updateParentPin(
  payload: AuthTokenPayload,
  input: { currentPIN: string; newPIN: string },
) {
  if (!parentIsFresh(payload)) {
    throw new ApiError(403, "PARENT_VERIFICATION_REQUIRED", "Parent verification is required");
  }

  const { store, family } = await getFamilyContextFromPayload(payload);
  const isValid = await bcrypt.compare(input.currentPIN, family.parentPinHash);
  if (!isValid) {
    throw new ApiError(401, "INVALID_PARENT_PIN", "Current PIN is incorrect");
  }

  await store.upsertFamily({
    ...family,
    parentPinHash: await bcrypt.hash(input.newPIN, 10),
    updatedAt: nowIso(),
  });

  return { updated: true };
}

export async function listAllMissions() {
  const store = await withSeededStore();
  return await store.listMissions();
}

export async function getMissionById(missionId: string) {
  const store = await withSeededStore();
  const mission = await store.getMission(missionId);
  if (!mission) {
    throw new ApiError(404, "MISSION_NOT_FOUND", "Mission was not found");
  }
  return mission;
}

async function getTodayOrTomorrowMission(payload: AuthTokenPayload, dayOffset: number) {
  const { store, activeChild } = await getFamilyContextFromPayload(payload);
  const missionsList = await store.listMissions();
  const targetDate = previousKstDate(toKstDateKey(new Date(Date.now() + dayOffset * 24 * 60 * 60 * 1000)), 0);
  const existing = await store.getAssignment(activeChild.id, targetDate);
  if (existing) {
    const mission = await store.getMission(existing.missionId);
    if (!mission) {
      throw new ApiError(500, "ASSIGNED_MISSION_MISSING", "Assigned mission was not found");
    }
    return { mission, reason: existing.reason };
  }

  const previousAssignments = await store.listAssignmentsByChild(activeChild.id);
  const sequenceDay = diffDays(targetDate, toKstDateKey(activeChild.createdAt)) + 1;
  let category: MissionCategory | null = null;
  let reason = "";

  if (sequenceDay >= 1 && sequenceDay <= FIRST_SEVEN_DAY_CATEGORY_SEQUENCE.length) {
    category = getAssignedCategoryForSequenceDay(sequenceDay);
    reason = initialChoiceReason(category!);
  } else {
    const seenCategories = new Set(
      previousAssignments
        .map((assignment) => missionsList.find((mission) => mission.id === assignment.missionId)?.category)
        .filter(Boolean),
    );
    category = (["world", "value", "perspective", "real", "synthesis"] as MissionCategory[]).find(
      (candidate) => !seenCategories.has(candidate),
    ) ?? categoryForLowConfidenceAxis(await store.getProfile(activeChild.id));

    const recentAssignments = previousAssignments
      .slice()
      .sort((a, b) => b.assignmentDate.localeCompare(a.assignmentDate))
      .slice(0, 3);
    const recentCategories = new Set(
      recentAssignments
        .map((assignment) => missionsList.find((mission) => mission.id === assignment.missionId)?.category)
        .filter(Boolean),
    );

    if (!category || recentCategories.has(category)) {
      category =
        (["world", "value", "perspective", "real", "synthesis"] as MissionCategory[]).find(
          (candidate) => !recentCategories.has(candidate),
        ) ?? "world";
    }

    reason = isWeekendKst(new Date())
      ? "주말이라 조금 더 자유롭게 새로운 카테고리를 열어뒀어요"
      : "최근 패턴과 아직 적게 본 카테고리를 함께 고려했어요";
  }

  let mission = chooseMissionByCategory(missionsList, category!, previousAssignments);

  // If no unassigned mission in this category, generate one with AI (day 8+)
  if (!mission) {
    if (env.TAM_AI_MODE === "openrouter" && sequenceDay > FIRST_SEVEN_DAY_CATEGORY_SEQUENCE.length) {
      // Pick a difficulty that fits the category
      const difficultyMap: Record<MissionCategory, DifficultyType> = {
        world: "value-conflict",
        value: "dilemma",
        perspective: "perspective-shift",
        real: "observation",
        synthesis: "expression",
      };
      mission = await generateNewMission(store, activeChild.id, category!, difficultyMap[category!]);
      reason = "네 탐험 기록을 바탕으로 새로운 세계를 만들었어요";
    } else {
      // Fallback: reuse any mission in the category
      const categoryMissions = missionsList.filter((m) => m.category === category);
      mission = categoryMissions[0] ?? missionsList[0];
    }
  }

  const assignment: MissionAssignment = {
    id: generateId("assignment"),
    childId: activeChild.id,
    assignmentDate: targetDate,
    missionId: mission.id,
    reason,
    createdAt: nowIso(),
  };
  await store.upsertAssignment(assignment);

  return { mission, reason };
}

export async function getTodayMission(payload: AuthTokenPayload) {
  return await getTodayOrTomorrowMission(payload, 0);
}

export async function getTomorrowMission(payload: AuthTokenPayload) {
  return await getTodayOrTomorrowMission(payload, 1);
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

export async function recordInitialChoice(
  payload: AuthTokenPayload,
  sessionId: string,
  input: { choiceId: string; reflectionNote?: string },
) {
  const { store, session } = await getOwnedSession(payload, sessionId);
  ensureSessionIsActive(session);
  if (session.initialChoiceId) {
    // Choice already recorded — return session as-is (idempotent)
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
  const round = await generateScenarioRound(mission, session, input.roundIndex, previousRounds, previousReactions);
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
  const card = await generateThinkingToolCard(mission, session, input.roundIndex, input.toolType, generatedRound, reactions);
  await store.upsertThinkingToolCard(session.id, input.roundIndex, input.toolType, card);
  return card;
}

export async function generateSessionEpilogue(payload: AuthTokenPayload, input: { sessionId: string }) {
  const { store, session } = await getOwnedSession(payload, input.sessionId);
  ensureSessionIsActive(session);
  const existing = await store.getEpilogue(session.id);
  if (existing) {
    return existing;
  }

  const reactions = await store.listReactionsBySession(session.id);
  if (reactions.length < 3) {
    throw new ApiError(409, "REACTIONS_INCOMPLETE", "Three reactions are required before generating an epilogue");
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

function buildInterestMap(
  completedSessions: MissionSession[],
  completedMissions: Mission[],
  reactions: SessionReaction[],
  tools: SessionToolUsage[],
  previousProfile: UserProfileSnapshot | null,
) {
  const config = [
    {
      category: "디자인 & 창작",
      missionTags: ["디자인", "브랜딩", "카피라이팅"],
      valueTags: ["creativity", "emotion"] as ValueTag[],
    },
    {
      category: "리더십 & 관리",
      missionTags: ["리더십", "자원관리", "위기대응"],
      valueTags: ["logic", "efficiency", "independence"] as ValueTag[],
    },
    {
      category: "감정 & 관계",
      missionTags: ["공감", "다중관점", "감정"],
      valueTags: ["empathy", "emotion", "community"] as ValueTag[],
    },
    {
      category: "과학 & 탐구",
      missionTags: ["우주", "관찰력", "분석"],
      valueTags: ["logic", "adventure"] as ValueTag[],
    },
  ];

  return config.map((item) => {
    const missionMatchCount = completedMissions.filter((mission) =>
      mission.tags.some((tag) => item.missionTags.includes(tag)),
    ).length;
    const valueMatchCount = reactions.flatMap((reaction) => reaction.valueTags).filter((tag) =>
      item.valueTags.includes(tag),
    ).length;
    const toolWeight = tools.length * 5;
    const currentScore = clampScore(missionMatchCount * 20 + valueMatchCount * 6 + toolWeight);
    const previousScore =
      previousProfile?.interestMap.find((entry) => entry.category === item.category)?.score ?? 0;
    const dataPoints = missionMatchCount + valueMatchCount;

    return {
      category: item.category,
      score: currentScore,
      trend: trendFromScores(currentScore, previousScore, dataPoints),
    };
  });
}

export async function recalculateProfileByChildId(childId: string) {
  const store = await withSeededStore();
  const child = await store.getChild(childId);
  if (!child) {
    throw new ApiError(404, "CHILD_NOT_FOUND", "Child profile was not found");
  }

  const previousProfile = await store.getProfile(child.id);
  const allSessions = await store.listSessionsByChild(child.id);
  const completedSessions = allSessions
    .filter((session) => session.status === "completed")
    .sort((a, b) => (a.completedAt ?? "").localeCompare(b.completedAt ?? ""));
  const missionMap = new Map((await store.listMissions()).map((mission) => [mission.id, mission]));
  const completedMissions = completedSessions
    .map((session) => missionMap.get(session.missionId))
    .filter(Boolean) as Mission[];

  const reactions = (
    await Promise.all(completedSessions.map((session) => store.listReactionsBySession(session.id)))
  ).flat();
  const tools = (
    await Promise.all(completedSessions.map((session) => store.listToolsBySession(session.id)))
  ).flat();

  const completedDateKeys = [...new Set(completedSessions.map((session) => toKstDateKey(session.completedAt!)))].sort();
  const todayKey = toKstDateKey(nowIso());
  const yesterdayKey = previousKstDate(todayKey);
  let currentStreak = 0;
  const streakStart = completedDateKeys.includes(todayKey)
    ? todayKey
    : completedDateKeys.includes(yesterdayKey)
      ? yesterdayKey
      : null;
  if (streakStart) {
    let cursor = streakStart;
    while (completedDateKeys.includes(cursor)) {
      currentStreak += 1;
      cursor = previousKstDate(cursor);
    }
  }

  let longestStreak = 0;
  let running = 0;
  let previousDate: string | null = null;
  for (const dateKey of completedDateKeys) {
    if (previousDate && diffDays(dateKey, previousDate) === 1) {
      running += 1;
    } else {
      running = 1;
    }
    longestStreak = Math.max(longestStreak, running);
    previousDate = dateKey;
  }

  const valueTags = topValueTags(
    reactions,
    completedMissions[0] ?? seededMissions[0],
    completedSessions[0] ?? {
      id: "",
      childId,
      missionId: "",
      status: "completed",
      startedAt: nowIso(),
      completedAt: nowIso(),
      initialChoiceId: null,
      initialChoiceLabel: null,
      reflectionNote: null,
      closingResponse: null,
      mirrorId: null,
      expiresAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  );

  const roleCounts = new Map<string, number>();
  for (const mission of completedMissions) {
    const bucket = roleBucket(mission.role);
    roleCounts.set(bucket, (roleCounts.get(bucket) ?? 0) + 1);
  }
  const topRole = [...roleCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "관찰";

  const emotionCounts = new Map<string, number>();
  for (const reaction of reactions) {
    emotionCounts.set(reaction.emotionLabel, (emotionCounts.get(reaction.emotionLabel) ?? 0) + 1);
  }
  const topEmotion = [...emotionCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "차분하게";

  const profile: UserProfileSnapshot = {
    id: child.id,
    childId: child.id,
    name: child.name,
    age: child.age,
    createdAt: child.createdAt,
    stats: {
      totalMissions: completedSessions.length,
      currentStreak,
      longestStreak,
      totalMinutes: completedMissions.reduce((sum, mission) => sum + mission.estimatedMinutes, 0),
    },
    discoveries: {
      worldPreference: {
        label: "끌리는 세계",
        summary:
          completedMissions.length > 0
            ? `${completedMissions[0].worldSetting.location}처럼 세계관이 분명한 장면에서 더 오래 머무는 편이야.`
            : "아직 어떤 세계에 끌리는지 탐색 중이야.",
        dataPoints: completedMissions.length,
        confidence: confidenceFor(completedMissions.length),
        icon: "🌍",
      },
      valueOrientation: {
        label: "중요하게 여기는 것",
        summary:
          valueTags.length > 0
            ? `${valueTags[0]} 쪽 기준이 먼저 보이고, ${valueTags[1] ?? valueTags[0]}도 같이 챙기려는 편이야.`
            : "아직 가치 기준을 모으는 중이야.",
        dataPoints: reactions.length + completedSessions.length,
        confidence: confidenceFor(reactions.length + completedSessions.length),
        icon: "⚖️",
      },
      roleEnergy: {
        label: "에너지가 생기는 역할",
        summary: `${topRole} 쪽 역할에서 특히 몰입도가 높게 쌓이고 있어.`,
        dataPoints: completedMissions.length,
        confidence: confidenceFor(completedMissions.length),
        icon: "⚡",
      },
      decisionStyle: {
        label: "결정하는 방식",
        summary:
          tools.length > 0
            ? `직감으로 고른 뒤에도 생각 도구로 한 번 더 비교해보는 편이야.`
            : `처음 고른 선택을 비교적 곧게 밀고 가는 편이야.`,
        dataPoints: completedSessions.length,
        confidence: confidenceFor(completedSessions.length),
        icon: "🎯",
      },
      tonePreference: {
        label: "선호하는 분위기",
        summary: `${topEmotion} 같은 톤을 자주 택하는 편이야.`,
        dataPoints: reactions.length,
        confidence: confidenceFor(reactions.length),
        icon: "🎭",
      },
    },
    interestMap: buildInterestMap(completedSessions, completedMissions, reactions, tools, previousProfile),
    updatedAt: nowIso(),
  };

  await store.upsertProfile(profile);
  return profile;
}

export async function getProfileByChildId(payload: AuthTokenPayload, childId: string) {
  const { store, family } = await getFamilyContextFromPayload(payload);
  const child = await store.getChild(childId);
  if (!child || child.familyId !== family.id) {
    throw new ApiError(404, "CHILD_NOT_FOUND", "Child profile was not found");
  }

  return (await store.getProfile(childId)) ?? (await recalculateProfileByChildId(childId));
}

export async function getWeeklyReportByChildId(
  payload: AuthTokenPayload,
  childId: string,
  weekStart?: string,
) {
  if (!parentIsFresh(payload)) {
    throw new ApiError(403, "PARENT_VERIFICATION_REQUIRED", "Parent verification is required");
  }

  const { store, family } = await getFamilyContextFromPayload(payload);
  const child = await store.getChild(childId);
  if (!child || child.familyId !== family.id) {
    throw new ApiError(404, "CHILD_NOT_FOUND", "Child profile was not found");
  }

  const resolvedWeekStart = weekStart ?? startOfKstWeek(nowIso());
  const existing = await store.getWeeklyReport(child.id, resolvedWeekStart);
  if (existing) {
    return existing;
  }

  const weekEnd = endOfKstWeek(resolvedWeekStart);
  const completedSessions = (await store.listSessionsByChild(child.id)).filter(
    (session) =>
      session.status === "completed" &&
      session.completedAt &&
      toKstDateKey(session.completedAt) >= resolvedWeekStart &&
      toKstDateKey(session.completedAt) <= weekEnd,
  );

  const missionMap = new Map((await store.listMissions()).map((mission) => [mission.id, mission]));
  const profile = await recalculateProfileByChildId(child.id);
  const previousWeekStart = previousKstDate(resolvedWeekStart, 7);
  const previousProfile = await store.getWeeklyReport(child.id, previousWeekStart);

  const report: WeeklyReport = {
    id: generateId("report"),
    childId: child.id,
    weekStart: resolvedWeekStart,
    weekEnd,
    generatedAt: nowIso(),
    summary: {
      missionsCompleted: completedSessions.length,
      totalMinutes: completedSessions.reduce(
        (sum, session) => sum + (missionMap.get(session.missionId)?.estimatedMinutes ?? 0),
        0,
      ),
      streak: profile.stats.currentStreak,
      worldsExplored: [
        ...new Set(
          completedSessions.map((session) => missionMap.get(session.missionId)?.worldSetting.location).filter(Boolean),
        ),
      ] as string[],
    },
    patterns: buildPatternsFromSessions(completedSessions, missionMap),
    interestChanges: profile.interestMap.map((current) => {
      const previousScore =
        previousProfile?.interestChanges.find((entry) => entry.category === current.category)?.currentScore ?? 0;
      return {
        category: current.category,
        currentScore: current.score,
        previousScore,
        delta: current.score - previousScore,
        trend: current.trend,
      };
    }),
    guideComment: "",
  };

  report.guideComment = await generateGuideComment(report, profile);
  await store.upsertWeeklyReport(report);
  return report;
}

function buildPatternsFromSessions(completedSessions: MissionSession[], missionMap: Map<string, Mission>): PatternObservation[] {
  if (completedSessions.length === 0) {
    return [
      {
        title: "아직 이번 주 탐험이 시작되지 않았어요",
        detail: "첫 번째 미션이 완료되면 패턴 카드가 쌓이기 시작합니다.",
      },
    ];
  }

  const missions = completedSessions
    .map((session) => missionMap.get(session.missionId))
    .filter(Boolean) as Mission[];
  const categoryCounts = new Map<MissionCategory, number>();
  for (const mission of missions) {
    categoryCounts.set(mission.category, (categoryCounts.get(mission.category) ?? 0) + 1);
  }
  const topCategory = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "world";

  return [
    {
      title: `${topCategory} 카테고리에서 반복 탐험이 보였어요`,
      detail: `${missions.length}개의 미션 중 가장 많이 고른 축은 ${topCategory}였어요.`,
      stat: `${missions.length}회 중 ${categoryCounts.get(topCategory)}회`,
    },
    {
      title: "자기 기준을 설명하는 문장이 남기기 시작했어요",
      detail: "초기 선택과 클로징 응답을 남긴 세션이 늘수록 판단 기준이 더 또렷하게 보입니다.",
      stat: `${completedSessions.filter((session) => session.closingResponse || session.reflectionNote).length}개 세션`,
    },
    {
      title: "완료 루프를 끝까지 마치는 힘이 생기고 있어요",
      detail: "에필로그와 거울까지 도달한 세션이 쌓일수록 자기 이해 신호가 더 선명해집니다.",
      stat: `${completedSessions.length}개 완료`,
    },
  ];
}

export async function listWeeklyReportsByChildId(payload: AuthTokenPayload, childId: string) {
  if (!parentIsFresh(payload)) {
    throw new ApiError(403, "PARENT_VERIFICATION_REQUIRED", "Parent verification is required");
  }

  const { store, family } = await getFamilyContextFromPayload(payload);
  const child = await store.getChild(childId);
  if (!child || child.familyId !== family.id) {
    throw new ApiError(404, "CHILD_NOT_FOUND", "Child profile was not found");
  }

  return (await store.listWeeklyReports(child.id))
    .sort((a, b) => b.weekStart.localeCompare(a.weekStart))
    .map((report) => ({
      id: report.id,
      weekStart: report.weekStart,
      missionsCompleted: report.summary.missionsCompleted,
    }));
}

export async function generateReportPdf(payload: AuthTokenPayload, reportId: string, origin: string) {
  if (!parentIsFresh(payload)) {
    throw new ApiError(403, "PARENT_VERIFICATION_REQUIRED", "Parent verification is required");
  }

  const { store, family } = await getFamilyContextFromPayload(payload);
  const report = await store.getWeeklyReportById(reportId);
  if (!report) {
    throw new ApiError(404, "REPORT_NOT_FOUND", "Weekly report was not found");
  }

  const child = await store.getChild(report.childId);
  if (!child || child.familyId !== family.id) {
    throw new ApiError(403, "REPORT_FORBIDDEN", "The requested report does not belong to the authenticated family");
  }

  const token = await createReportDownloadToken(
    {
      familyId: family.id,
      reportId: report.id,
    },
    `${REPORT_DOWNLOAD_TTL_SECONDS}s`,
  );
  const expiresAt = new Date(Date.now() + REPORT_DOWNLOAD_TTL_SECONDS * 1000).toISOString();

  return {
    downloadUrl: `${origin}/api/reports/${report.id}/pdf?token=${encodeURIComponent(token)}`,
    expiresAt,
  };
}

export async function resolveReportPdfDownload(reportId: string, token: string) {
  let tokenPayload;
  try {
    tokenPayload = await verifyReportDownloadToken(token);
  } catch (error) {
    throw new ApiError(
      401,
      "INVALID_REPORT_DOWNLOAD_TOKEN",
      error instanceof Error ? error.message : "Report download token is invalid",
    );
  }

  if (tokenPayload.reportId !== reportId) {
    throw new ApiError(403, "REPORT_DOWNLOAD_FORBIDDEN", "This download token does not match the requested report");
  }

  const store = await withSeededStore();
  const report = await store.getWeeklyReportById(reportId);
  if (!report) {
    throw new ApiError(404, "REPORT_NOT_FOUND", "Weekly report was not found");
  }

  const child = await store.getChild(report.childId);
  if (!child || child.familyId !== tokenPayload.familyId) {
    throw new ApiError(403, "REPORT_DOWNLOAD_FORBIDDEN", "This download token does not authorize the report");
  }

  const pdfBytes = await buildWeeklyReportPdf(report, child);
  return {
    child,
    pdfBytes,
    report,
  };
}
