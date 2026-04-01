import { and, eq } from "drizzle-orm";

import { seededMissions } from "@/lib/server/constants";
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
  dailyChoiceSets,
  deepDives as deepDivesTable,
  deepDiveSteps as deepDiveStepsTable,
} from "@/lib/server/db/schema";
import type {
  ChildProfile,
  DailyChoiceSet,
  DeepDive,
  DeepDiveStep,
  ExpansionToolType,
  GeneratedEpilogue,
  GeneratedScenarioRound,
  MirrorResult,
  Mission,
  MissionAssignment,
  MissionSession,
  SessionReaction,
  ThinkingToolCard,
  UserProfileSnapshot,
  ValueTag,
  WeeklyReport,
} from "@/lib/server/types";
import { nowIso } from "@/lib/server/utils/date";
import type { Store } from "./types";

export function createPostgresStore(): Store {
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
    async getChoiceSet(childId, choiceDate) {
      const row = await db.query.dailyChoiceSets.findFirst({
        where: and(
          eq(dailyChoiceSets.childId, childId),
          eq(dailyChoiceSets.choiceDate, choiceDate),
        ),
      });
      if (!row) return null;
      return {
        id: row.id,
        childId: row.childId,
        choiceDate: row.choiceDate,
        previews: row.previews as DailyChoiceSet["previews"],
        chosenIndex: row.chosenIndex,
        chosenMissionId: row.chosenMissionId,
        strategy: row.strategy as DailyChoiceSet["strategy"],
        createdAt: row.createdAt,
        chosenAt: row.chosenAt,
      };
    },
    async listChoiceSetsByChild(childId) {
      const rows = await db.select().from(dailyChoiceSets).where(eq(dailyChoiceSets.childId, childId));
      return rows.map((row) => ({
        id: row.id,
        childId: row.childId,
        choiceDate: row.choiceDate,
        previews: row.previews as DailyChoiceSet["previews"],
        chosenIndex: row.chosenIndex,
        chosenMissionId: row.chosenMissionId,
        strategy: row.strategy as DailyChoiceSet["strategy"],
        createdAt: row.createdAt,
        chosenAt: row.chosenAt,
      }));
    },
    async upsertChoiceSet(choiceSet) {
      await db.insert(dailyChoiceSets).values({
        id: choiceSet.id,
        childId: choiceSet.childId,
        choiceDate: choiceSet.choiceDate,
        previews: choiceSet.previews,
        chosenIndex: choiceSet.chosenIndex,
        chosenMissionId: choiceSet.chosenMissionId,
        strategy: choiceSet.strategy,
        createdAt: choiceSet.createdAt,
        chosenAt: choiceSet.chosenAt,
      }).onConflictDoUpdate({
        target: dailyChoiceSets.id,
        set: {
          chosenIndex: choiceSet.chosenIndex,
          chosenMissionId: choiceSet.chosenMissionId,
          chosenAt: choiceSet.chosenAt,
        },
      });
    },
    // Deep-dive (postgres)
    async getDeepDive(deepDiveId) {
      const row = await db.query.deepDives.findFirst({
        where: eq(deepDivesTable.id, deepDiveId),
      });
      if (!row) return null;
      const steps = await db.select().from(deepDiveStepsTable).where(eq(deepDiveStepsTable.deepDiveId, deepDiveId));
      return {
        ...row,
        realWorldCase: row.realWorldCase as DeepDive["realWorldCase"],
        steps: steps
          .map((s) => ({ ...s, options: s.options as DeepDiveStep["options"] }))
          .sort((a, b) => a.stepIndex - b.stepIndex),
      } as DeepDive;
    },
    async getDeepDiveByChildAndMission(childId, missionId) {
      const row = await db.query.deepDives.findFirst({
        where: and(
          eq(deepDivesTable.childId, childId),
          eq(deepDivesTable.missionId, missionId),
          eq(deepDivesTable.status, "active"),
        ),
      });
      if (!row) return null;
      const steps = await db.select().from(deepDiveStepsTable).where(eq(deepDiveStepsTable.deepDiveId, row.id));
      return {
        ...row,
        realWorldCase: row.realWorldCase as DeepDive["realWorldCase"],
        steps: steps
          .map((s) => ({ ...s, options: s.options as DeepDiveStep["options"] }))
          .sort((a, b) => a.stepIndex - b.stepIndex),
      } as DeepDive;
    },
    async listDeepDivesByChild(childId) {
      const rows = await db.select().from(deepDivesTable).where(eq(deepDivesTable.childId, childId));
      const allSteps = await Promise.all(
        rows.map((r) => db.select().from(deepDiveStepsTable).where(eq(deepDiveStepsTable.deepDiveId, r.id))),
      );
      return rows.map((row, i) => ({
        ...row,
        realWorldCase: row.realWorldCase as DeepDive["realWorldCase"],
        steps: allSteps[i]
          .map((s) => ({ ...s, options: s.options as DeepDiveStep["options"] }))
          .sort((a, b) => a.stepIndex - b.stepIndex),
      })) as DeepDive[];
    },
    async upsertDeepDive(deepDive) {
      await db.insert(deepDivesTable).values({
        id: deepDive.id,
        missionId: deepDive.missionId,
        sessionId: deepDive.sessionId,
        childId: deepDive.childId,
        title: deepDive.title,
        realWorldCase: deepDive.realWorldCase,
        portfolioEntry: deepDive.portfolioEntry,
        status: deepDive.status,
        startedAt: deepDive.startedAt,
        completedAt: deepDive.completedAt,
        createdAt: deepDive.createdAt,
      }).onConflictDoUpdate({
        target: deepDivesTable.id,
        set: {
          portfolioEntry: deepDive.portfolioEntry,
          status: deepDive.status,
          completedAt: deepDive.completedAt,
        },
      });
    },
    async getDeepDiveStep(deepDiveId, stepIndex) {
      const row = await db.query.deepDiveSteps.findFirst({
        where: and(
          eq(deepDiveStepsTable.deepDiveId, deepDiveId),
          eq(deepDiveStepsTable.stepIndex, stepIndex),
        ),
      });
      return row ? { ...row, options: row.options as DeepDiveStep["options"] } as DeepDiveStep : null;
    },
    async listDeepDiveSteps(deepDiveId) {
      const rows = await db.select().from(deepDiveStepsTable).where(eq(deepDiveStepsTable.deepDiveId, deepDiveId));
      return rows
        .map((s) => ({ ...s, options: s.options as DeepDiveStep["options"] }) as DeepDiveStep)
        .sort((a, b) => a.stepIndex - b.stepIndex);
    },
    async upsertDeepDiveStep(step) {
      await db.insert(deepDiveStepsTable).values({
        id: step.id,
        deepDiveId: step.deepDiveId,
        stepIndex: step.stepIndex,
        type: step.type,
        prompt: step.prompt,
        response: step.response,
        options: step.options ?? null,
        selectedOptionId: step.selectedOptionId ?? null,
        createdAt: step.createdAt,
      }).onConflictDoUpdate({
        target: deepDiveStepsTable.id,
        set: {
          response: step.response,
          selectedOptionId: step.selectedOptionId ?? null,
        },
      });
    },
  };
}
