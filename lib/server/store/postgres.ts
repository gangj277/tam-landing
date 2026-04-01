import { and, eq } from "drizzle-orm";

import { seededMissions } from "@/lib/server/constants";
import { createDb } from "@/lib/server/db/client";
import {
  children,
  deepDives,
  deepDiveTurns,
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
} from "@/lib/server/db/schema";
import type {
  ChildProfile,
  DailyChoiceSet,
  DeepDive,
  DeepDiveTurn,
  DeepDiveTurnOption,
  ExpertPersona,
  DeepDiveRealWorldCase,
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
    // Deep-dive v2
    async getDeepDive(deepDiveId) {
      const row = await db.query.deepDives.findFirst({
        where: eq(deepDives.id, deepDiveId),
      });
      if (!row) return null;
      const turnRows = await db.select().from(deepDiveTurns).where(eq(deepDiveTurns.deepDiveId, deepDiveId));
      const turns: DeepDiveTurn[] = turnRows
        .map((t) => ({
          id: t.id,
          deepDiveId: t.deepDiveId,
          turnIndex: t.turnIndex,
          type: t.type as DeepDiveTurn["type"],
          expertMessage: t.expertMessage,
          interactionType: t.interactionType as DeepDiveTurn["interactionType"],
          options: t.options as DeepDiveTurnOption[] | undefined,
          selectedOptionId: t.selectedOptionId ?? undefined,
          textResponse: t.textResponse ?? undefined,
          createdAt: t.createdAt,
        }))
        .sort((a, b) => a.turnIndex - b.turnIndex);
      return {
        id: row.id,
        missionId: row.missionId,
        sessionId: row.sessionId,
        childId: row.childId,
        expert: row.expert as ExpertPersona,
        realWorldCase: row.realWorldCase as DeepDiveRealWorldCase,
        turns,
        portfolioEntry: row.portfolioEntry,
        status: row.status as DeepDive["status"],
        startedAt: row.startedAt,
        completedAt: row.completedAt,
        createdAt: row.createdAt,
      };
    },
    async listDeepDivesByChild(childId) {
      const rows = await db.select().from(deepDives).where(eq(deepDives.childId, childId));
      const result: DeepDive[] = [];
      for (const row of rows) {
        const turnRows = await db.select().from(deepDiveTurns).where(eq(deepDiveTurns.deepDiveId, row.id));
        const turns: DeepDiveTurn[] = turnRows
          .map((t) => ({
            id: t.id,
            deepDiveId: t.deepDiveId,
            turnIndex: t.turnIndex,
            type: t.type as DeepDiveTurn["type"],
            expertMessage: t.expertMessage,
            interactionType: t.interactionType as DeepDiveTurn["interactionType"],
            options: t.options as DeepDiveTurnOption[] | undefined,
            selectedOptionId: t.selectedOptionId ?? undefined,
            textResponse: t.textResponse ?? undefined,
            createdAt: t.createdAt,
          }))
          .sort((a, b) => a.turnIndex - b.turnIndex);
        result.push({
          id: row.id,
          missionId: row.missionId,
          sessionId: row.sessionId,
          childId: row.childId,
          expert: row.expert as ExpertPersona,
          realWorldCase: row.realWorldCase as DeepDiveRealWorldCase,
          turns,
          portfolioEntry: row.portfolioEntry,
          status: row.status as DeepDive["status"],
          startedAt: row.startedAt,
          completedAt: row.completedAt,
          createdAt: row.createdAt,
        });
      }
      return result;
    },
    async upsertDeepDive(deepDive) {
      await db.insert(deepDives).values({
        id: deepDive.id,
        missionId: deepDive.missionId,
        sessionId: deepDive.sessionId,
        childId: deepDive.childId,
        expert: deepDive.expert,
        realWorldCase: deepDive.realWorldCase,
        portfolioEntry: deepDive.portfolioEntry,
        status: deepDive.status,
        startedAt: deepDive.startedAt,
        completedAt: deepDive.completedAt,
        createdAt: deepDive.createdAt,
      }).onConflictDoUpdate({
        target: deepDives.id,
        set: {
          portfolioEntry: deepDive.portfolioEntry,
          status: deepDive.status,
          completedAt: deepDive.completedAt,
        },
      });
    },
    async getDeepDiveTurn(deepDiveId, turnIndex) {
      const row = await db.query.deepDiveTurns.findFirst({
        where: and(
          eq(deepDiveTurns.deepDiveId, deepDiveId),
          eq(deepDiveTurns.turnIndex, turnIndex),
        ),
      });
      if (!row) return null;
      return {
        id: row.id,
        deepDiveId: row.deepDiveId,
        turnIndex: row.turnIndex,
        type: row.type as DeepDiveTurn["type"],
        expertMessage: row.expertMessage,
        interactionType: row.interactionType as DeepDiveTurn["interactionType"],
        options: row.options as DeepDiveTurnOption[] | undefined,
        selectedOptionId: row.selectedOptionId ?? undefined,
        textResponse: row.textResponse ?? undefined,
        createdAt: row.createdAt,
      };
    },
    async listDeepDiveTurns(deepDiveId) {
      const rows = await db.select().from(deepDiveTurns).where(eq(deepDiveTurns.deepDiveId, deepDiveId));
      return rows
        .map((t) => ({
          id: t.id,
          deepDiveId: t.deepDiveId,
          turnIndex: t.turnIndex,
          type: t.type as DeepDiveTurn["type"],
          expertMessage: t.expertMessage,
          interactionType: t.interactionType as DeepDiveTurn["interactionType"],
          options: t.options as DeepDiveTurnOption[] | undefined,
          selectedOptionId: t.selectedOptionId ?? undefined,
          textResponse: t.textResponse ?? undefined,
          createdAt: t.createdAt,
        }))
        .sort((a, b) => a.turnIndex - b.turnIndex);
    },
    async upsertDeepDiveTurn(turn) {
      await db.insert(deepDiveTurns).values({
        id: turn.id,
        deepDiveId: turn.deepDiveId,
        turnIndex: turn.turnIndex,
        type: turn.type,
        expertMessage: turn.expertMessage,
        interactionType: turn.interactionType,
        options: turn.options ?? null,
        selectedOptionId: turn.selectedOptionId ?? null,
        textResponse: turn.textResponse ?? null,
        createdAt: turn.createdAt,
      }).onConflictDoUpdate({
        target: deepDiveTurns.id,
        set: {
          expertMessage: turn.expertMessage,
          selectedOptionId: turn.selectedOptionId ?? null,
          textResponse: turn.textResponse ?? null,
        },
      });
    },
  };
}
