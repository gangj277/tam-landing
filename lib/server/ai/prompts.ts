/**
 * TAM (탐) AI Prompt Builders
 *
 * 5 prompt builders for the interactive scenario pipeline.
 * All functions are pure — no DB access, no side effects.
 * Each returns { systemPrompt, userPrompt } for callOpenRouter.
 */

import type {
  Mission,
  MissionCategory,
  MissionSession,
  GeneratedScenarioRound,
  SessionReaction,
  SessionToolUsage,
  MirrorResult,
  ExpansionToolType,
  DifficultyType,
  WeeklyReport,
  UserProfileSnapshot,
} from "../types";

// ═══════════════════════════════════════
// SHARED HELPERS
// ═══════════════════════════════════════

const DIFFICULTY_GUIDANCE: Record<DifficultyType, string> = {
  "value-conflict":
    "두 선택 모두 진심으로 좋은 이유가 있어야 해. 어느 쪽도 명백히 옳지 않아. 선택할수록 반대편 가치의 무게가 느껴져야 해.",
  dilemma:
    "어떤 선택을 해도 무언가를 잃어. 완벽한 답은 없어. 그 '잃는 것'의 무게를 구체적으로 보여줘.",
  "creative-judgment":
    "정답이 없는 창작 판단이야. 어떤 방향이든 '왜 이게 좋은지' 스스로 발견하게 해.",
  "perspective-shift":
    "같은 사건이 다른 사람에게는 완전히 다르게 느껴진다는 걸 보여줘. 새 시점이 열릴 때마다 이전 판단이 흔들려야 해.",
  "emotional-immersion":
    "머리보다 가슴으로 먼저 느끼게 해. 표정, 목소리, 침묵 같은 감각적 디테일을 넣어.",
  observation:
    "자세히 볼수록 보이는 것이 있어. 당연한 것을 낯설게 바라보는 시선을 유도해.",
  "problem-discovery":
    "문제를 푸는 것보다 '진짜 문제가 뭔지' 발견하는 과정이야. 표면 아래 숨은 원인을 향해 파고들어.",
  expression:
    "느낌을 말이나 형태로 바꾸는 도전이야. '왜 이렇게 표현했는지'를 스스로 발견하게 해.",
  comprehensive:
    "여러 관점, 여러 가치, 여러 방법을 동시에 고려해야 해. 단순한 답이 아니라 복합적인 판단을 이끌어.",
};

function getEscalationGuidance(roundIndex: number, followUpAngles: string[]): string {
  const angle = (i: number) => followUpAngles[i] ?? followUpAngles[followUpAngles.length - 1] ?? "";
  if (roundIndex === 0) {
    return `[1턴: 진입 — 기(起)]\n아이의 선택이 가장 가까운 사람·상황에 즉각 영향을 준다. 눈앞에 보이는 변화를 감각적으로 보여줘.\n서사 방향 힌트: ${angle(0)}`;
  }
  if (roundIndex === 1) {
    return `[2턴: 심화 — 승(承)]\n1턴 선택의 여파가 예상 못한 곳에 번진다. 새로운 이해관계자가 등장하거나 숨어있던 문제가 드러나.\n서사 방향 힌트: ${angle(1)}`;
  }
  if (roundIndex === 2) {
    return `[3턴: 전환점 — 전(轉)]\n가치가 정면 충돌하는 순간. 이전 선택들이 만든 긴장이 최고조에 달해. 가장 어려운 딜레마를 던져.\n서사 방향 힌트: ${angle(2)}`;
  }
  if (roundIndex === 3) {
    return `[4턴: 행동 — 전→결]\n아이의 결정에 세계가 반응한다. 예상 못한 반발이나 부작용이 드러나고, 아이가 직접 수습하거나 새로운 방법을 찾아야 해.\n서사 방향 힌트: ${angle(3)}`;
  }
  return `[5턴: 마무리 — 결(結)]\n개인의 선택을 넘어 '이런 상황이 왜 생기는지' 시스템적 질문으로 확대해. 아이가 '나 하나의 결정'이 아니라 '이 세계의 구조'를 보게 해. 여운이 남는 마무리.\n서사 방향 힌트: ${angle(4)}`;
}

const TOOL_TYPE_GUIDANCE: Record<ExpansionToolType, string> = {
  broaden:
    "아이가 고르지 않은 길, 아직 안 본 가능성을 보여줘. '이런 방법도 있었어'라는 발견. 구체적인 장면으로.",
  reframe:
    "지금 장면을 다른 인물의 시선으로 다시 보여줘. 같은 사건, 다른 감정. 이름을 불러주고 그 사람의 속마음을 들려줘.",
  subvert:
    "예상을 완전히 뒤집는 전개. 불가능해 보이는 것, 놀라운 것. 고정관념을 깨는 순간. 하지만 억지스럽지 않게.",
};

const TOOL_LABELS: Record<ExpansionToolType, string> = {
  broaden: "만약에...",
  reframe: "그 사람은...",
  subvert: "전혀 다르게",
};

const TOOL_EMOJIS: Record<ExpansionToolType, string> = {
  broaden: "🔭",
  reframe: "🔄",
  subvert: "🌀",
};

/**
 * Builds the "story so far" recap block shared across prompts.
 * Provides full narrative continuity so the AI can reference specific past events.
 */
function buildStoryRecap(
  mission: Mission,
  session: MissionSession,
  rounds: GeneratedScenarioRound[],
  reactions: SessionReaction[],
): string {
  const lines: string[] = [];

  // Initial choice
  const initialChoice = mission.choices.find((c) => c.id === session.initialChoiceId);
  lines.push(`초기 선택: "${session.initialChoiceLabel ?? "선택함"}"`);
  if (initialChoice?.reasoning) {
    lines.push(`  이유: ${initialChoice.reasoning}`);
  }

  // Each completed round
  for (const round of rounds) {
    const reaction = reactions.find((r) => r.roundIndex === round.roundIndex);
    lines.push("");
    lines.push(`--- ${round.roundIndex + 1}라운드 ---`);
    lines.push(`상황: ${round.consequence.narrative}`);
    if (round.consequence.newDilemma) {
      lines.push(`딜레마: ${round.consequence.newDilemma}`);
    }
    if (reaction) {
      lines.push(`아이의 반응: 태도 "${reaction.emotionLabel}" + 방법 "${reaction.methodLabel}"`);
      lines.push(`가치 태그: ${reaction.valueTags.join(", ")}`);
    }
  }

  return lines.join("\n");
}

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
</작법 규칙>`;

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
5. reframe일 경우: 반드시 특정 인물의 이름을 넣고, 그 사람의 1인칭 속마음을 "" 안에 적어.
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

// ═══════════════════════════════════════
// 6. MISSION GENERATION (8일차~)
// ═══════════════════════════════════════

const CATEGORY_DESIGN_GUIDE: Record<MissionCategory, string> = {
  world:
    "새로운 세계에 들어가 그 세계의 리더/구성원이 되는 경험. 구체적인 장소(우주, 심해, 미래도시, 역사 속 마을 등)와 시대를 설정하고, 그 세계만의 위기를 만들어.",
  value:
    "두 가치가 정면으로 충돌하는 딜레마. 공정 vs 효율, 안전 vs 모험, 개인 vs 공동체 같은 대립. 어느 쪽도 명백히 옳지 않아야 해.",
  perspective:
    "같은 사건을 여러 시점에서 바라보는 경험. 선생님/학생/부모, 또는 가해자/피해자/방관자 같은 다중 시점 설계.",
  real:
    "일상에서 발견할 수 있는 디자인, 문제, 구조에 대한 관찰과 제안. 학교, 동네, 집 같은 친숙한 공간에서 시작.",
  synthesis:
    "느낌이나 생각을 표현으로 바꾸는 도전. 카피라이팅, 캐릭터 디자인, 프레젠테이션 같은 창작 과제.",
};

export function buildMissionGenerationPrompts(
  category: MissionCategory,
  difficulty: DifficultyType,
  profile: UserProfileSnapshot,
  recentMirrors: MirrorResult[],
  pastMissionTitles: string[],
  pastWorldLocations: string[],
): { systemPrompt: string; userPrompt: string } {
  // Identify weak and strong axes
  const axes = [
    { key: "worldPreference", insight: profile.discoveries.worldPreference },
    { key: "valueOrientation", insight: profile.discoveries.valueOrientation },
    { key: "roleEnergy", insight: profile.discoveries.roleEnergy },
    { key: "decisionStyle", insight: profile.discoveries.decisionStyle },
    { key: "tonePreference", insight: profile.discoveries.tonePreference },
  ];
  const weakAxes = axes.filter((a) => a.insight.confidence === "low").map((a) => a.insight.label);
  const strongAxes = axes.filter((a) => a.insight.confidence !== "low").map((a) => `${a.insight.label}: ${a.insight.summary}`);

  const trendingUp = profile.interestMap
    .filter((i) => i.trend === "up")
    .map((i) => i.category);

  const systemPrompt = `너는 10~14세 아동용 인터랙티브 시나리오 미션 설계자야.

<미션 설계 원칙>
1. 아이가 5~10분 안에 몰입할 수 있는 구체적 세계와 역할을 만들어.
2. 정답이 없는 진짜 딜레마를 설계해. 세 선택지 모두 합리적 이유가 있어야 해.
3. 세계관은 구체적이고 감각적으로. 냄새, 소리, 빛이 느껴지게. backdrop은 2~3줄로 그 장소에 서 있는 느낌을 줘.
4. 역할은 아이가 "내가 정말 이 사람이라면?"이라고 느낄 만큼 구체적이어야 해.
5. AI 가이드 페르소나는 세계 안의 인물이어야 해 (부시장, 동료, 선배 등). "너는 ~이야"로 시작.
6. situation은 위기 상황을 3~4줄로 긴박하게 전달해. 숫자나 구체적 디테일을 포함해.
</미션 설계 원칙>

<카테고리: ${category}>
${CATEGORY_DESIGN_GUIDE[category]}
</카테고리>

<난이도: ${difficulty}>
${DIFFICULTY_GUIDANCE[difficulty]}
</난이도>

<구조 규칙>
1. choices: 정확히 3개. 각 choice의 valueTags는 정확히 2개.
2. valueTags는 이 목록에서만: fairness, efficiency, safety, adventure, empathy, creativity, independence, community, logic, emotion.
3. 3개 선택지에 최소 6개의 서로 다른 태그가 분산되어야 해. 같은 태그 조합 금지.
4. choice.id: 영문 케밥케이스 ("explore-cave", "protect-village" 등)
5. choice.shortLabel: 2~4글자 한국어 요약
6. expansionTools: broaden(🔭, "더 넓혀보기"), reframe(🔄, "다른 시각으로 보기"), subvert(🌀, "이상하게 바꾸기") 정확히 3개. 각각 prompts 5개 (5턴 각각에 대응).
7. followUpAngles: 정확히 6개. 5턴 시나리오에서 AI가 파고들 서사 방향. 기(도입)→승(심화)→전(전환)→전→결(행동)→결(마무리) 순서로 점점 깊어지게.
8. tags: 3~5개 한국어 키워드.
9. estimatedMinutes: 5~10 사이 정수.
10. ageRange: [10, 14].
11. 한국어. 반말. 10~14세가 이해하고 공감할 수 있는 수준.
</구조 규칙>`;

  // Build mirror context
  const mirrorLines = recentMirrors.slice(-3).map((m) => {
    const obs = m.observations.map((o) => o.text).join(" / ");
    const suggestion = m.nextSuggestion?.reason ?? "";
    return `- ${obs}${suggestion ? ` → 제안: ${suggestion}` : ""}`;
  });

  const userPrompt = `<배정 조건>
카테고리: ${category}
난이도: ${difficulty}
</배정 조건>

<이 아이에 대해>
이름: ${profile.name}, ${profile.age}세
총 ${profile.stats.totalMissions}개 미션 완료

가치 경향: ${profile.discoveries.valueOrientation.summary}
끌리는 세계: ${profile.discoveries.worldPreference.summary}
에너지 역할: ${profile.discoveries.roleEnergy.summary}
의사결정: ${profile.discoveries.decisionStyle.summary}
분위기: ${profile.discoveries.tonePreference.summary}
${trendingUp.length > 0 ? `관심 상승 중: ${trendingUp.join(", ")}` : ""}
</이 아이에 대해>

${mirrorLines.length > 0 ? `<최근 미러 관찰>\n${mirrorLines.join("\n")}\n</최근 미러 관찰>\n` : ""}<이미 경험한 미션 (중복 방지)>
세계: ${pastWorldLocations.join(", ") || "없음"}
미션: ${pastMissionTitles.join(", ") || "없음"}
</이미 경험한 미션>

<설계 방향>
${weakAxes.length > 0 ? `아직 탐색 중인 축: ${weakAxes.join(", ")}. 이 방향을 자연스럽게 자극하되,` : ""}
${strongAxes.length > 0 ? `이미 보이는 경향:\n${strongAxes.map((s) => `  - ${s}`).join("\n")}\n이 경향에서 시작해서 새로운 방향으로 연결해.` : ""}
이전에 가보지 않은 세계와 역할을 만들어줘.
</설계 방향>

미션 하나를 설계해줘.`;

  return { systemPrompt, userPrompt };
}
