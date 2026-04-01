// ─── Re-export barrel ───
// Backward-compatible: all API route imports continue to resolve from here.

// Auth
export {
  requireAuth,
  signupFamily,
  loginFamily,
  verifyParentPin,
  requestParentPinReset,
  confirmParentPinReset,
} from "./services/auth";

// Family
export {
  getFamilyMe,
  addChildProfile,
  switchActiveChild,
  updateParentPin,
} from "./services/family";

// Missions
export {
  listAllMissions,
  getMissionById,
  getDailyChoices,
  selectDailyMission,
  getTodayMission,
  getTomorrowMission,
} from "./services/missions";

// Sessions
export {
  createMissionSession,
  recordInitialChoice,
  recordSessionReaction,
  recordThinkingToolUsage,
  recordClosingResponse,
  generateSessionRound,
  generateSessionThinkingTool,
  prepareSessionRoundStream,
  prepareSessionThinkingToolStream,
  generateSessionEpilogue,
  generateSessionMirror,
  completeMissionSession,
  getSessionDetail,
  listCompletedSessions,
} from "./services/sessions";

// Profile
export {
  recalculateProfileByChildId,
  getProfileByChildId,
} from "./services/profile";

// Reports
export {
  getWeeklyReportByChildId,
  listWeeklyReportsByChildId,
  generateReportPdf,
  resolveReportPdfDownload,
} from "./services/reports";

// Deep-dive (v2)
export {
  createDeepDiveSession,
  streamDeepDiveTurn,
  recordDeepDiveTurnResponse,
  completeDeepDive,
  getDeepDiveDetail,
  listDeepDivesByChild,
  getPortfolioByChild,
  getTodayActivity,
} from "./services/deep-dive";
