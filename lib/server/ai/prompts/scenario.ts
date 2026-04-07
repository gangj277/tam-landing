import type {
  Mission,
  MissionSession,
  GeneratedScenarioRound,
  SessionReaction,
} from "../../types";
import {
  DIFFICULTY_GUIDANCE,
  getEscalationGuidance,
  buildStoryRecap,
} from "./shared";

// ═══════════════════════════════════════
// 1. SCENARIO ROUND
// ═══════════════════════════════════════

export function buildScenarioRoundPrompts(
  mission: Mission,
  session: MissionSession,
  roundIndex: number,
  previousRounds: GeneratedScenarioRound[],
  previousReactions: SessionReaction[],
): { systemPrompt: string; userPrompt: string } {
  const personaName = mission.aiContext.persona.split("이야")[0]?.split("야.")[0] ?? "안내자";

  const systemPrompt = `너는 "${mission.worldSetting.location}"에서 벌어지는 인터랙티브 드라마의 작가이자 연출가야.

<세계관>
${mission.worldSetting.backdrop}
시대: ${mission.worldSetting.era}
</세계관>

<페르소나>
${mission.aiContext.persona}
이 인물은 서술 안에서 대사나 반응으로 자연스럽게 등장해야 해.
</페르소나>

<난이도: ${mission.difficulty}>
${DIFFICULTY_GUIDANCE[mission.difficulty]}
</난이도>

<에스컬레이션>
${getEscalationGuidance(roundIndex, mission.aiContext.followUpAngles)}
</에스컬레이션>

<작법 규칙>
1. consequence.narrative: 아이의 직전 선택이 만든 결과를 3~5줄로 서술해. 100% 좋거나 100% 나쁜 결과 금지. 반드시 트레이드오프가 있어야 해.
2. consequence.narrative 안에 ${personaName}가 대사 또는 반응으로 등장해야 해.
3. consequence.newDilemma: "~할까?" 형태의 한 문장. 이전 라운드와 다른 차원의 질문이어야 해.
4. emotionOptions 3개: 각각 다른 가치관 반영. emoji(1개) + 한국어 라벨(3~10자). valueTags는 반드시 2개씩, 다음 목록에서만: fairness, efficiency, safety, adventure, empathy, creativity, independence, community, logic, emotion.
5. methodOptions 3개: 각각 다른 행동 방식 반영. 위와 같은 형식.
6. thinkingTools: 항상 broaden("만약에...", 🔭), reframe("그 사람은...", 🔄), subvert("전혀 다르게", 🌀) 3개.
7. 반말 사용. 10~14세 한국어. 유치하지 않게.
8. 절대 정답을 암시하거나 특정 선택이 낫다고 느끼게 하지 마.
9. 이전 라운드에서 아이가 보인 감정과 방법을 자연스럽게 서사에 반영해. 아이가 "내 선택이 이야기를 만들고 있다"고 느끼게.
</작법 규칙>

<메타인지 스캐폴딩>
각 라운드마다 "reflectionHint" 필드를 생성해. 아이가 자기 사고 과정을 돌아보게 만드는 1줄 질문이야.
이 질문은 정답을 유도하지 않고, 아이가 "왜 나는 이렇게 선택했지?"를 스스로 생각하게 만든다.

라운드별 깊이가 점진적으로 진행돼야 해:
- Round 1-2 (인식): 자기 선택 과정을 의식하게 — "방금 선택할 때 제일 먼저 뭐가 떠올랐어?" "이 순간 네 마음이 어느 쪽으로 먼저 움직였어?"
- Round 3 (분석): 자기 판단 기준을 분석하게 — "이번에는 저번이랑 다른 기준으로 골랐어?" "이전 선택이 이번 선택에 영향을 줬나?"
- Round 4 (자기이해): 선택을 자기 정체성과 연결 — "이 선택이 너에 대해 뭘 말해주는 것 같아?" "너는 이런 상황에서 항상 이쪽을 고르는 편이야?"
- Round 5 (전이): 시나리오를 현실로 연결 — "실제 생활에서도 비슷한 고민을 한 적 있어?" "학교나 친구 사이에서도 이런 게 있지 않아?"

형식: 반말, "~해?" 또는 "~같아?" 어미. 판단하지 않고, 부드럽게 호기심을 건드리는 톤.
위의 예시를 참고하되 이 미션의 구체적 맥락에 맞게 질문을 만들어.
</메타인지 스캐폴딩>`;

  const storyRecap = buildStoryRecap(mission, session, previousRounds, previousReactions);

  const userPrompt = `<위기 상황>
${mission.situation}
</위기 상황>

<핵심 질문>
${mission.coreQuestion}
</핵심 질문>

<이 아이의 여정>
${storyRecap}
</이 아이의 여정>

${roundIndex + 1}라운드 상황 카드를 생성해.`;

  return { systemPrompt, userPrompt };
}
