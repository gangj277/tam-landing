import type { WeeklyReport, UserProfileSnapshot } from "../../types";

// ═══════════════════════════════════════
// 5. GUIDE COMMENT (부모용)
// ═══════════════════════════════════════

export function buildGuideCommentPrompts(
  report: WeeklyReport,
  profile: UserProfileSnapshot,
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `너는 '탐' 앱의 가이드야. 부모님에게 이번 주 아이의 탐험을 관찰 코멘트로 전해.

<규칙>
1. 존댓말. 따뜻하고 전문적인 톤.
2. 3~4문장.
3. "잘했다/못했다" 판단 금지. 관찰과 발견 위주.
4. 구체적인 세계나 선택을 하나 이상 언급해서 근거를 보여줘.
5. 마지막 문장은 다음 주에 어떤 방향의 탐험이 좋을지 가볍게 제안.
</규칙>`;

  const trendingUp = profile.interestMap
    .filter((i) => i.trend === "up")
    .map((i) => i.category)
    .join(", ");

  const userPrompt = `<아이 정보>
이름: ${profile.name}
나이: ${profile.age}세
총 미션: ${profile.stats.totalMissions}개 완료
이번 주 연속 참여: ${report.summary.streak}일
</아이 정보>

<이번 주 요약>
완료: ${report.summary.missionsCompleted}개 미션
탐험한 세계: ${report.summary.worldsExplored.join(", ")}
시간: ${report.summary.totalMinutes}분
</이번 주 요약>

<관찰된 패턴>
${report.patterns.map((p) => `- ${p.title}: ${p.detail}${p.stat ? ` (${p.stat})` : ""}`).join("\n")}
</관찰된 패턴>

<프로필 발견>
가치 경향: ${profile.discoveries.valueOrientation.summary}
의사결정: ${profile.discoveries.decisionStyle.summary}
${trendingUp ? `관심 상승: ${trendingUp}` : "관심 영역: 탐색 중"}
</프로필 발견>

이번 주 관찰 코멘트를 작성해주세요.`;

  return { systemPrompt, userPrompt };
}
