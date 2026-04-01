import { getFamilyContextFromPayload } from "./auth";
import { recalculateProfileByChildId } from "./profile";
import { generateGuideComment } from "@/lib/server/ai/generators";
import { REPORT_DOWNLOAD_TTL_SECONDS } from "@/lib/server/constants";
import { withSeededStore } from "@/lib/server/store";
import {
  createReportDownloadToken,
  verifyReportDownloadToken,
} from "@/lib/server/auth/tokens";
import { buildWeeklyReportPdf } from "@/lib/server/reports/pdf";
import { generateId, parentIsFresh } from "@/lib/server/helpers";
import {
  endOfKstWeek,
  nowIso,
  previousKstDate,
  startOfKstWeek,
  toKstDateKey,
} from "@/lib/server/utils/date";
import { ApiError } from "@/lib/server/utils/http";
import type {
  AuthTokenPayload,
  Mission,
  MissionCategory,
  MissionSession,
  PatternObservation,
  WeeklyReport,
} from "@/lib/server/types";

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
