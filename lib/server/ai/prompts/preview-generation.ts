import type {
  UserProfileSnapshot,
  MirrorResult,
  DailyChoiceSet,
  MissionCategory,
} from "../../types";

// ═══════════════════════════════════════
// 7. PREVIEW GENERATION (3개 프리뷰 — Step 1)
// ═══════════════════════════════════════

export function buildPreviewGenerationPrompts(
  profile: UserProfileSnapshot,
  recentMirrors: MirrorResult[],
  pastMissionTitles: string[],
  pastWorldLocations: string[],
  recentChoiceSets: DailyChoiceSet[],
): { systemPrompt: string; userPrompt: string } {
  const sortedInterests = [...profile.interestMap].sort((a, b) => b.score - a.score);
  const topInterest = sortedInterests[0];
  const bottomInterest = sortedInterests[sortedInterests.length - 1];

  const recentChosenCategories = recentChoiceSets
    .filter((cs) => cs.chosenIndex != null)
    .slice(-5)
    .map((cs) => cs.previews[cs.chosenIndex!].category);

  const mirrorSuggestions = recentMirrors
    .slice(-3)
    .map((m) => m.nextSuggestion)
    .filter(Boolean)
    .map((s) => `${s!.categoryHint} 방향: ${s!.reason}`);

  const allCategories: MissionCategory[] = ["world", "value", "perspective", "real", "synthesis"];

  const systemPrompt = `너는 10~14세 아동이 "오늘 어떤 세계에 들어갈까?" 고르는 순간을 설계하는 미션 큐레이터야.

<역할>
3개의 미션 프리뷰를 만들어. 각각 완전히 다른 세계, 다른 역할, 다른 분위기여야 해.
아이가 세 개를 훑어보고 하나에 손이 가게 만드는 게 목표야.
</역할>

<슬롯 설계 원칙>
1번 프리뷰 (맞춤):
  이 아이가 이미 끌리는 방향의 세계와 역할.
  관심이 높은 영역에서 출발하되, 이전에 해본 적 없는 세계를 만들어.
  선택 확률이 높아야 해 — 진입 모멘트를 확보하는 카드야.

2번 프리뷰 (확장):
  아직 적게 가본 방향의 세계.
  하지만 완전히 낯선 게 아니라, 이 아이가 좋아하는 톤이나 역할 스타일로 감싸줘.
  "익숙한 느낌이지만 새로운 세계" 효과를 노려.

3번 프리뷰 (발견):
  1번, 2번과 카테고리가 겹치면 안 돼.
  의외의 역할 + 예상 못한 세계 조합.
  숨은 관심을 발견하는 야생 카드야.
</슬롯 설계 원칙>

<다양성 규칙>
- 3개의 category 중 최소 2개는 달라야 해 (3개 다 다르면 가장 좋아)
- 3개의 era(시대)가 모두 달라야 해 (예: 미래/현대/고대, 판타지/근현대/SF 등)
- 3개의 role이 서로 다른 성격이어야 해 (리더십형/창작형/조율형/관찰형 중 다른 버킷)
</다양성 규칙>

<출력 규칙>
- title: 한국어, 15자 이내. 세계관이 한눈에 보이는 구체적 제목. "~의 ~" 패턴 권장.
- role: 한국어, 구체적 역할명. "선장", "우주 정비사", "벽화 복원사" 등.
- category: world / value / perspective / real / synthesis 중 하나
- difficulty: value-conflict / dilemma / creative-judgment / perspective-shift / emotional-immersion / observation / problem-discovery / expression / comprehensive 중 하나
- worldLocation: 구체적 장소명
- era: 시대/배경
- pitch: 한 줄 유혹 문장, 15자 이내. 호기심 자극. "?" 활용 가능.
</출력 규칙>`;

  const userPrompt = `<이 아이에 대해>
이름: ${profile.name}, ${profile.age}세
총 ${profile.stats.totalMissions}개 미션 완료

끌리는 세계: ${profile.discoveries.worldPreference.summary}
중요하게 여기는 것: ${profile.discoveries.valueOrientation.summary}
에너지 역할: ${profile.discoveries.roleEnergy.summary}
의사결정: ${profile.discoveries.decisionStyle.summary}
선호 분위기: ${profile.discoveries.tonePreference.summary}
</이 아이에 대해>

<관심 영역 점수>
${sortedInterests.map((i) => `${i.category}: ${i.score}% (${i.trend})`).join("\n")}
</관심 영역 점수>
${mirrorSuggestions.length > 0 ? `\n<최근 미러 제안>\n${mirrorSuggestions.join("\n")}\n</최근 미러 제안>` : ""}${recentChosenCategories.length > 0 ? `\n\n<최근 선택 패턴>\n최근 5일 선택: ${recentChosenCategories.join(" → ")}\n(같은 방향이 연속되지 않게 주의)\n</최근 선택 패턴>` : ""}

<슬롯별 방향 지시>
1번 (맞춤): ${topInterest ? `"${topInterest.category}" 관심 영역에서 출발` : "가장 넓은 세계 탐험 방향으로"}
2번 (확장): ${bottomInterest ? `"${bottomInterest.category}" 영역을 아이 스타일로 포장해서 제시` : "아직 안 가본 카테고리로"}
3번 (발견): 1, 2번과 다른 카테고리. ${allCategories.filter((c) => c !== topInterest?.category && c !== bottomInterest?.category).slice(0, 2).join(" 또는 ")} 방향.
</슬롯별 방향 지시>

<이미 경험한 미션 (중복 방지)>
세계: ${pastWorldLocations.join(", ") || "없음"}
미션: ${pastMissionTitles.join(", ") || "없음"}
</이미 경험한 미션>

3개의 미션 프리뷰를 설계해줘.`;

  return { systemPrompt, userPrompt };
}
