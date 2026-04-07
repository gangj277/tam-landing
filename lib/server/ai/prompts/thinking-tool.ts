import type {
  Mission,
  MissionSession,
  ExpansionToolType,
  GeneratedScenarioRound,
  SessionReaction,
} from "../../types";
import { TOOL_LABELS, TOOL_TYPE_GUIDANCE } from "./shared";

// ═══════════════════════════════════════
// 2. THINKING TOOL
// ═══════════════════════════════════════

export function buildThinkingToolPrompts(
  mission: Mission,
  session: MissionSession,
  roundIndex: number,
  toolType: ExpansionToolType,
  currentRound: GeneratedScenarioRound,
  previousReactions: SessionReaction[],
): { systemPrompt: string; userPrompt: string } {
  const toolMeta = mission.aiContext.expansionTools.find((t) => t.type === toolType);
  const promptHint = toolMeta?.prompts[roundIndex % (toolMeta.prompts.length || 1)] ?? "";

  const systemPrompt = `너는 "잠깐, 이런 것도 있어" 하고 다른 가능성을 열어주는 이야기 안내자야.

<세계관>
${mission.worldSetting.location}, ${mission.worldSetting.era}
${mission.worldSetting.backdrop}
</세계관>

<도구: ${TOOL_LABELS[toolType]}>
${TOOL_TYPE_GUIDANCE[toolType]}
</도구>

<규칙>
1. narrative를 3~5줄로 짧고 생생하게 써.
2. 아이의 선택을 바꾸라는 게 아니야. "이런 것도 있구나"를 느끼게 해.
3. 반말, 이야기체. 아이가 직접 그 장면에 있는 것처럼.
4. 마지막 줄은 "→ "로 시작하는 생각 질문 하나.
5. reframe일 경우: 반드시 특정 인물의 이름을 넣고, 그 사람의 상황과 감정을 구체적으로 설정해.
6. 핵심: 모든 사고 도구는 반드시 열린 질문으로 끝나야 해. 아이가 읽고 "음..." 하고 스스로 생각하게 만드는 것이 목적이야. AI가 대안을 보여주는 게 아니라, 아이의 사고를 자극하는 도구야.
</규칙>`;

  const userPrompt = `<현재 상황>
미션: ${mission.title} (${mission.role})
${mission.situation}
</현재 상황>

<아이의 여정 요약>
초기 선택: "${session.initialChoiceLabel}"
${previousReactions.map((r) => `${r.roundIndex + 1}라운드: ${r.emotionLabel} + ${r.methodLabel}`).join("\n")}
</아이의 여정 요약>

<지금 이 순간>
${currentRound.consequence.narrative}
딜레마: ${currentRound.consequence.newDilemma}
</지금 이 순간>

<참고 방향>
${promptHint}
</참고 방향>

${TOOL_LABELS[toolType]} 카드 한 장을 써줘.`;

  return { systemPrompt, userPrompt };
}
