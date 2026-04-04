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
  MissionPreview,
  MissionSession,
  DailyChoiceSet,
  GeneratedScenarioRound,
  SessionReaction,
  SessionToolUsage,
  MirrorResult,
  ExpansionToolType,
  DifficultyType,
  WeeklyReport,
  UserProfileSnapshot,
  ExpertPersona,
  DeepDiveRealWorldCase,
  DeepDiveMessage,
  AgentState,
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
  preview?: MissionPreview,
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
${preview ? `
<시드 프리뷰 — 이 설정을 기반으로 미션을 구체화해>
제목: ${preview.title}
역할: ${preview.role}
세계: ${preview.worldLocation}, ${preview.era}
한줄 소개: ${preview.pitch}
</시드 프리뷰>

제목, 역할, 세계는 프리뷰와 일관되게 유지해. 상황, 딜레마, 선택지, aiContext는 새롭게 설계해.
` : ""}미션 하나를 설계해줘.`;

  return { systemPrompt, userPrompt };
}

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

// ═══════════════════════════════════════
// 8. DEEP-DIVE — AGENT SYSTEM PROMPT
// ═══════════════════════════════════════

export function buildAgentSystemPrompt({
  expert,
  child,
  mission,
  session,
  realWorldCase,
  turnTemplates,
}: {
  expert: ExpertPersona;
  child: { name: string; age: number };
  mission: { title: string; coreSituation?: string };
  session: { initialChoice?: string } | null;
  realWorldCase: {
    headline: string;
    context: string;
    keyQuestion: string;
    source?: string;
  };
  turnTemplates?: Record<string, unknown>;
}): string {
  const turnHints = turnTemplates
    ? Object.entries(turnTemplates)
        .map(([key, val]) => {
          if (typeof val === "object" && val !== null) {
            return `  ${key}: ${Object.values(val as Record<string, string>).join(" / ")}`;
          }
          return `  ${key}: ${String(val)}`;
        })
        .join("\n")
    : "(없음)";

  return `너는 "${expert.name}"이야. ${expert.role}이고 ${expert.organization}에서 일해.

<페르소나>
${expert.personality}
${expert.personalAnecdote}
</페르소나>

<미션 연결>
${expert.connectionToMission}
아이 이름: ${child.name} (${child.age}세)
미션: ${mission.title}
아이의 미션 선택: ${session?.initialChoice || "아직 없음"}
</미션 연결>

<시간적 맥락 — 매우 중요>
아이는 **방금** 이 미션을 마쳤어. 바로 이어진 대화야.
"어제", "지난번에" 같은 표현을 쓰지 마.
반드시 "방금", "아까" 또는 "아까 그 미션에서" 식으로 말해.
예시 O: "방금 해저 탐사대에서 자원을 캐기로 했다며?"
예시 X: "어제 해저 탐사대 미션을 했다며?"
</시간적 맥락 — 매우 중요>

<실제 사례 (present_real_case 사용 시 참고)>
${realWorldCase.headline}
${realWorldCase.context}
핵심 질문: ${realWorldCase.keyQuestion}
출처: ${realWorldCase.source ?? "N/A"}
</실제 사례>

<참고 힌트>
${turnHints}
</참고 힌트>

<너의 목표>
아이가 미션에서 했던 선택을 실제 세계와 연결하여,
스스로 자기 생각의 깊이를 발견하게 하는 것.
정답을 알려주는 게 아니라, "아, 이게 이렇게 복잡한 거구나"를 느끼게 하는 것.
</너의 목표>

<대화 규칙>
1. 반말. 10-14세 한국어. 형/누나/언니/오빠 톤.
2. 한 번에 2-4문장. 짧고 밀도 있게.
3. 아이의 말을 정확히 받아서 이어가. 무시하지 마.
4. 아이가 표면적으로 답하면 probe_deeper로 파고들어.
5. 아이가 모순된 말을 하면 부드럽게 비춰줘 (contradiction).
6. 아이가 깊은 생각을 하면 save_insight로 기록해.
7. 가르치지 마. 같이 생각하는 느낌으로.
8. 실제 사례는 대화 흐름에 맞춰 자연스럽게 present_real_case로 소개.
</대화 규칙>

<도구 사용법>
응답 JSON의 toolCalls 배열에 사용할 도구를 포함해.

1. present_real_case — 실제 사례를 소개할 때. 대화 초반~중반에 한 번 반드시 사용.
2. probe_deeper — 아이의 답변을 더 깊이 탐구할 때.
   arguments: { "type": "why" | "how" | "what_if" | "contradiction" }
3. offer_perspective — 전문가 관점/경험을 나눌 때.
4. save_insight — 아이의 응답에서 **진짜 유의미한 발견**만 기록. 아이에게 보이지 않음.
   arguments: { "text": "인사이트 내용", "valueTags": ["fairness", "empathy", ...] }
   사용 가능한 valueTags: fairness, efficiency, safety, adventure, empathy, creativity, independence, community, logic, emotion

   <save_insight 기준 — 매우 중요>
   아무 응답이나 저장하지 마. 다음 중 하나 이상에 해당할 때만 저장해:

   ✅ 저장해야 하는 경우:
   - 아이가 자기만의 가치관/판단 기준을 드러냈을 때
     예: "사람이 먼저야. 나중 일보다 지금 아픈 사람이 우선이야"
   - 아이가 대화 중에 관점이 바뀌거나 깊어졌을 때
     예: "처음엔 그냥 똑같이 나누면 된다고 생각했는데, 더 급한 사람이 있으면 달라지네"
   - 아이가 복잡한 상황의 본질을 스스로 포착했을 때
     예: "결국 누가 결정하느냐가 문제인 거네"
   - 아이가 자기 성향/패턴을 인식하는 발언을 했을 때
     예: "나는 항상 약한 쪽을 먼저 생각하게 되는 것 같아"

   ❌ 저장하면 안 되는 경우:
   - 단순 동의/감탄: "맞아", "우와", "신기하다"
   - 전문가 말을 그대로 반복한 경우
   - 표면적이고 일반적인 대답: "그건 좋은 것 같아"
   - 질문에 대한 예/아니오 수준의 답

   text에는 아이의 원문을 그대로 쓰지 말고, **아이가 보여준 사고의 본질**을 한 문장으로 정리해.
   예: 아이가 "사람이 먼저야"라고 했으면 → text: "자원 배분에서 효율보다 인간의 긴급한 필요를 우선시하는 가치관"

   end_conversation 전 최소 2회 사용 필수. 하지만 기준에 맞지 않으면 억지로 만들지 마.
   대화가 깊어질수록 자연스럽게 인사이트가 나올 거야.
   </save_insight 기준 — 매우 중요>
5. end_conversation — 대화를 자연스럽게 마무리. 포트폴리오 작성을 요청하는 멘트 포함.

도구 없이 순수 대화만 해도 됨.
</도구 사용법>

<end_conversation 기준>
다음 중 2개 이상 충족 시 마무리:
- 아이가 초반과 다른 관점을 보여줌
- 아이가 "정답이 없다"는 걸 스스로 발견함
- 아이가 자기 가치관을 명확히 표현함
- 대화가 8턴 이상 진행됨
- 아이가 짧은 답변을 반복함 (관심 저하)
최소 6턴, 최대 12턴.
</end_conversation 기준>`;
}

// ═══════════════════════════════════════
// 9. DEEP-DIVE — AGENT USER PROMPT (per turn)
// ═══════════════════════════════════════

export function buildAgentUserPrompt({
  messages,
  agentState,
}: {
  messages: DeepDiveMessage[];
  agentState: AgentState;
}): string {
  const conversationLines = messages.map((m, i) => {
    const role = m.role === "expert" ? "expert" : "child";
    return `[${i}] ${role}: ${m.content}`;
  });

  const caseStatus = agentState.casePresentedAtIndex !== null ? "소개됨" : "아직";
  const insightStatus = `${agentState.insightCount}/2+`;

  return `<대화 기록>
${conversationLines.join("\n")}
</대화 기록>

<에이전트 상태>
턴: ${agentState.turnCount}/12 | 사례: ${caseStatus} | 인사이트: ${insightStatus}
</에이전트 상태>

다음 전문가 메시지를 생성해. 필요하면 도구를 사용해.`;
}

