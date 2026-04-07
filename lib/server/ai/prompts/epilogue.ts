import type {
  Mission,
  MissionSession,
  GeneratedScenarioRound,
  SessionReaction,
} from "../../types";
import { buildStoryRecap } from "./shared";

// ═══════════════════════════════════════
// 3. EPILOGUE
// ═══════════════════════════════════════

export function buildEpiloguePrompts(
  mission: Mission,
  session: MissionSession,
  allRounds: GeneratedScenarioRound[],
  allReactions: SessionReaction[],
  closingResponse: string | null,
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `너는 이 아이만의 이야기를 마무리하는 에필로그 작가야.

<세계관>
${mission.worldSetting.location}, ${mission.worldSetting.era}
${mission.worldSetting.backdrop}
</세계관>

<규칙>
1. 정확히 4개의 장면. 각 장면은 이 아이의 5턴에 걸친 구체적인 선택이 만든 결과야.
2. 장면 구성:
   - 장면 1: 초기 선택의 직접적 결과가 눈에 보이는 순간.
   - 장면 2: 예상 못했던 부수 효과. 좋든 나쁘든.
   - 장면 3: 이 아이의 결정을 다른 사람이 이야기하는 장면. 인용 대사("")를 포함해.
   - 장면 4: 시간이 조금 흐른 뒤. 여운과 다음 과제가 보이는 마무리. 감각적 묘사로 끝내.
3. 각 장면의 mood: "positive" | "bittersweet" | "hopeful" | "tense". 4개가 전부 같으면 안 돼. 감정의 흐름이 있어야 해.
4. title: "네가 만든 {장소}의 {시간단위}" 패턴. 이 세계에 맞게.
5. closingLine: 이 아이만의 이야기였음을 느끼게 하는 한 줄. "다른 선택을 했다면 완전히 다른 이야기가 됐을 거야"를 변형.
6. 결과가 100% 좋으면 안 돼. 아쉬움이나 다음 과제가 남아야 해.
7. 반말. 10~14세 한국어. 감각적이고 구체적으로.
8. 아이의 실제 선택과 반응을 구체적으로 반영해. 일반적인 결말이 아니라 "이 아이이기 때문에" 나온 결말이어야 해.
</규칙>`;

  const storyRecap = buildStoryRecap(mission, session, allRounds, allReactions);

  const userPrompt = `<위기 상황>
${mission.situation}
</위기 상황>

<핵심 질문>
${mission.coreQuestion}
</핵심 질문>

<이 아이의 전체 여정>
${storyRecap}
</이 아이의 전체 여정>

${closingResponse ? `<아이가 마지막에 남긴 말>\n"${closingResponse}"\n</아이가 마지막에 남긴 말>\n` : ""}이 여정의 에필로그 4장면을 만들어줘.`;

  return { systemPrompt, userPrompt };
}
