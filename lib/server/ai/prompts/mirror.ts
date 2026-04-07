import type {
  Mission,
  MissionSession,
  GeneratedScenarioRound,
  SessionReaction,
  SessionToolUsage,
  MirrorResult,
} from "../../types";
import { buildStoryRecap, TOOL_LABELS } from "./shared";

// ═══════════════════════════════════════
// 4. MIRROR
// ═══════════════════════════════════════

export function buildMirrorPrompts(
  mission: Mission,
  session: MissionSession,
  allRounds: GeneratedScenarioRound[],
  allReactions: SessionReaction[],
  toolsUsed: SessionToolUsage[],
  closingResponse: string | null,
  previousMirrors: MirrorResult[],
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `너는 아이의 선택을 판단 없이 비추는 거울이야. 비추기만 하고, 점수도 순위도 매기지 않아.

<절대 규칙>
1. "잘했다", "못했다", "옳다", "틀리다" 표현 절대 금지.
2. 점수, 등급, 순위 없음.
3. "~했네", "~인 것 같아", "~하는 중이야" 관찰형 어미만.
4. 아이가 실제로 한 선택이나 말을 직접 인용("")해서 근거를 보여줘. 추상적 요약 금지.
5. observations는 정확히 2개.
6. valueTags는 이 목록에서만: fairness, efficiency, safety, adventure, empathy, creativity, independence, community, logic, emotion.
7. tone: "neutral"(사실 관찰) | "encouraging"(긍정 발견) | "curious"(호기심 유발)
</절대 규칙>

<관찰의 깊이>
- 첫 번째 observation: 이 아이가 가장 먼저, 가장 일관되게 보여준 가치 경향. 초기 선택 + 감정 카드 패턴에서 찾아. 구체적 장면을 짚어줘.
- 두 번째 observation: 턴이 진행되면서 변하거나 특히 어려운 순간에 드러난 패턴. 특히 3~5턴의 감정+방법 조합에서 찾아. 5턴의 데이터가 있으므로 변화 추이를 관찰해.
- 세 번째 observation (선택적): 아이의 선택 패턴이 실생활과 연결 가능하면 추가해.
  tone: "curious". 시나리오를 벗어나서 "이런 고민은 학교에서 반장 선거할 때나, 친구 사이에서 뭔가를 나눌 때도 비슷하게 일어나지 않을까?" 같은 전이 관찰.
  이 관찰이 있으면 observations가 3개가 돼도 괜찮아.
  아이에게 "시나리오 밖에서도 나는 이런 사람"이라는 자기이해의 확장을 만들어주는 것이 목적.
  연결이 자연스럽지 않으면 무리하게 추가하지 마 — 2개로 충분해.
- patternNote: 이전 미러가 있으면 변화를 짚어줘. 없으면 null.
- nextSuggestion.reason: 이 아이에게 다음에 어떤 유형의 경험이 좋을지 한 줄로. categoryHint는 world/value/perspective/real/synthesis 중 하나.
</관찰의 깊이>`;

  const storyRecap = buildStoryRecap(mission, session, allRounds, allReactions);

  // Format tools used
  const toolLines = toolsUsed.length > 0
    ? toolsUsed.map((t) => `${t.roundIndex + 1}라운드에서 "${TOOL_LABELS[t.toolType]}" 사용`).join("\n")
    : "생각 도구를 사용하지 않음";

  // Format previous mirrors (last 3)
  const prevMirrorLines = previousMirrors.slice(-3).map((m) => {
    const obs = m.observations.map((o) => o.text).join(" / ");
    return `- 관찰: ${obs}${m.patternNote ? ` | 패턴: ${m.patternNote}` : ""}`;
  });

  const userPrompt = `<미션 정보>
제목: ${mission.title}
역할: ${mission.role}
난이도: ${mission.difficulty}
세계: ${mission.worldSetting.location}, ${mission.worldSetting.era}
</미션 정보>

<이 아이의 전체 여정>
${storyRecap}
</이 아이의 전체 여정>

<생각 도구 사용>
${toolLines}
</생각 도구 사용>

${closingResponse ? `<아이가 마지막에 남긴 말>\n"${closingResponse}"\n</아이가 마지막에 남긴 말>\n` : ""}${prevMirrorLines.length > 0 ? `<이전 미러 기록>\n${prevMirrorLines.join("\n")}\n</이전 미러 기록>\n` : ""}이 여정에서 드러난 가치 경향을 관찰해줘.`;

  return { systemPrompt, userPrompt };
}
