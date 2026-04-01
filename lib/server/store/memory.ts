import { seededMissions } from "@/lib/server/constants";
import type { DeepDive } from "@/lib/server/types";
import type { MemoryState, Store } from "./types";

declare global {
  var __tamMemoryState__: MemoryState | undefined;
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
      choiceSets: new Map(),
      deepDives: new Map(),
      deepDiveTurns: new Map(),
    };
  }

  return globalThis.__tamMemoryState__;
}

export function createMemoryStore(): Store {
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
    async getChoiceSet(childId, choiceDate) {
      return [...state.choiceSets.values()].find(
        (cs) => cs.childId === childId && cs.choiceDate === choiceDate,
      ) ?? null;
    },
    async listChoiceSetsByChild(childId) {
      return [...state.choiceSets.values()].filter((cs) => cs.childId === childId);
    },
    async upsertChoiceSet(choiceSet) {
      state.choiceSets.set(choiceSet.id, choiceSet);
    },
    // Deep-dive v2
    async getDeepDive(deepDiveId) {
      const dd = state.deepDives.get(deepDiveId);
      if (!dd) return null;
      const turns = [...state.deepDiveTurns.values()]
        .filter((t) => t.deepDiveId === deepDiveId)
        .sort((a, b) => a.turnIndex - b.turnIndex);
      return { ...dd, turns } as DeepDive;
    },
    async listDeepDivesByChild(childId) {
      const dds = [...state.deepDives.values()].filter((dd) => dd.childId === childId);
      return dds.map((dd) => {
        const turns = [...state.deepDiveTurns.values()]
          .filter((t) => t.deepDiveId === dd.id)
          .sort((a, b) => a.turnIndex - b.turnIndex);
        return { ...dd, turns } as DeepDive;
      });
    },
    async upsertDeepDive(deepDive) {
      state.deepDives.set(deepDive.id, deepDive);
    },
    async getDeepDiveTurn(deepDiveId, turnIndex) {
      return state.deepDiveTurns.get(`${deepDiveId}:${turnIndex}`) ?? null;
    },
    async listDeepDiveTurns(deepDiveId) {
      return [...state.deepDiveTurns.values()]
        .filter((t) => t.deepDiveId === deepDiveId)
        .sort((a, b) => a.turnIndex - b.turnIndex);
    },
    async upsertDeepDiveTurn(turn) {
      state.deepDiveTurns.set(`${turn.deepDiveId}:${turn.turnIndex}`, turn);
    },
  };
}
