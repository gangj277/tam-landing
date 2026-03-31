// ─── Hidden World Quiz: "엄마(아빠)는 모르는 우리 아이의 숨겨진 세계" ───
//
// Core mechanic: Each question is answered TWICE.
//   1) "아이라면 뭐라고 답할까?" (parent predicts child's answer)
//   2) "부모인 나는 뭘 바라는가?" (parent's own wish/expectation)
//
// The GAP between these two answers produces the result.
// Each question maps to one of 3 dimensions:
//   - interest  (관심 세계)
//   - emotion   (감정 패턴)
//   - selfview  (자기 인식)

// ─── Types ───

export type HWDimension = "interest" | "emotion" | "selfview";

export interface HWOption {
  id: string;
  icon: string;
  label: string;
}

export interface HWQuestion {
  id: string;
  dimension: HWDimension;
  /** The neutral question stem shown above both answer rounds */
  question: string;
  /** Prompt for round 1: predicting child */
  childPrompt: string;
  /** Prompt for round 2: parent's wish */
  parentPrompt: string;
  /** Shared options for both rounds (same set, different selection) */
  options: HWOption[];
}

export type ZoneLevel = "green" | "yellow" | "red";

export interface HWDimensionResult {
  dimension: HWDimension;
  dimensionLabel: string;
  zone: ZoneLevel;
  zoneLabel: string;
  gapScore: number; // 0-3 (0 = perfect match, 3 = max gap)
  insight: string;
}

export interface HWResult {
  /** 0-100 understanding percentage */
  understandingScore: number;
  /** Per-dimension breakdown */
  dimensions: HWDimensionResult[];
  /** Overall headline copy */
  headline: string;
  /** Overall description */
  description: string;
  /** Shareable one-liner */
  shareText: string;
  /** CTA copy */
  cta: string;
}

// ─── Dimension Labels ───

export const DIMENSION_LABELS: Record<HWDimension, string> = {
  interest: "관심 세계",
  emotion: "감정 패턴",
  selfview: "자기 인식",
};

export const ZONE_LABELS: Record<ZoneLevel, string> = {
  green: "잘 아는 영역",
  yellow: "흐릿한 영역",
  red: "미지의 영역",
};

export const ZONE_EMOJI: Record<ZoneLevel, string> = {
  green: "green",
  yellow: "yellow",
  red: "red",
};

// ─── Questions (9 total: 3 per dimension) ───
// Progression: Q1-Q3 easy (high confidence), Q4-Q6 medium, Q7-Q9 hard (low confidence)

export const HW_QUESTIONS: HWQuestion[] = [
  // ═══ EASY ZONE (Q1-Q3): Things parents feel confident about ═══

  // Q1 — Interest (easy): Free time activity
  {
    id: "hw-q1",
    dimension: "interest",
    question: "학교 끝나고 자유시간이 2시간 생겼을 때, 아이는 뭘 할까요?",
    childPrompt: "아이라면 뭘 하고 있을 것 같나요?",
    parentPrompt: "부모인 나는 아이가 뭘 했으면 좋겠나요?",
    options: [
      { id: "hw-q1-a", icon: "documentary", label: "유튜브나 영상 보기" },
      { id: "hw-q1-b", icon: "reading", label: "책 읽기 / 글쓰기" },
      { id: "hw-q1-c", icon: "social", label: "친구와 놀기 / 채팅" },
      { id: "hw-q1-d", icon: "coding", label: "게임 / 코딩 / 만들기" },
      { id: "hw-q1-e", icon: "nature", label: "운동 / 바깥 활동" },
    ],
  },

  // Q2 — Emotion (easy): Stress response
  {
    id: "hw-q2",
    dimension: "emotion",
    question: "시험이나 발표가 다가올 때, 아이는 어떻게 반응하나요?",
    childPrompt: "아이가 실제로 보이는 모습은?",
    parentPrompt: "나는 아이가 어떻게 대처하길 바라나요?",
    options: [
      { id: "hw-q2-a", icon: "quiet", label: "조용히 혼자 준비한다" },
      { id: "hw-q2-b", icon: "chat", label: "불안하다고 주변에 말한다" },
      { id: "hw-q2-c", icon: "tryit", label: "벼락치기로 집중한다" },
      { id: "hw-q2-d", icon: "express", label: "걱정하면서 미루게 된다" },
      { id: "hw-q2-e", icon: "different", label: "계획을 세워 차근차근 한다" },
    ],
  },

  // Q3 — Self-perception (easy): Self-described strength
  {
    id: "hw-q3",
    dimension: "selfview",
    question: "\"나는 이건 잘한다\"고 아이가 생각하는 것은 뭘까요?",
    childPrompt: "아이 스스로 자신 있어 하는 것은?",
    parentPrompt: "내가 보기에 아이가 진짜 잘하는 것은?",
    options: [
      { id: "hw-q3-a", icon: "debate", label: "말로 설득하기 / 대화" },
      { id: "hw-q3-b", icon: "drawing", label: "그림, 음악 등 예술적 표현" },
      { id: "hw-q3-c", icon: "puzzle", label: "문제 풀기 / 논리적 사고" },
      { id: "hw-q3-d", icon: "people", label: "친구 사귀기 / 분위기 만들기" },
      { id: "hw-q3-e", icon: "building", label: "뭔가를 만들고 완성하기" },
    ],
  },

  // ═══ MEDIUM ZONE (Q4-Q5): Things parents think they know ═══

  // Q4 — Interest (medium): Dream topic
  {
    id: "hw-q4",
    dimension: "interest",
    question: "일주일 동안 뭐든 하나를 배울 수 있다면, 아이는 뭘 고를까요?",
    childPrompt: "아이가 정말 배우고 싶어할 것은?",
    parentPrompt: "내가 아이에게 배우게 하고 싶은 것은?",
    options: [
      { id: "hw-q4-a", icon: "coding", label: "게임·앱 만들기 / 코딩" },
      { id: "hw-q4-b", icon: "story", label: "영상 편집 / 크리에이터 활동" },
      { id: "hw-q4-c", icon: "nature", label: "요리 / 야외 서바이벌" },
      { id: "hw-q4-d", icon: "thought", label: "심리학 / 과학 실험" },
      { id: "hw-q4-e", icon: "perform", label: "악기 / 댄스 / 연기" },
    ],
  },

  // Q5 — Emotion (medium): What worries the child most
  {
    id: "hw-q5",
    dimension: "emotion",
    question: "요즘 아이가 가장 걱정하는 것은 뭘까요?",
    childPrompt: "아이 마음속에 가장 큰 걱정은?",
    parentPrompt: "부모인 내가 생각하는, 아이가 걱정해야 할 것은?",
    options: [
      { id: "hw-q5-a", icon: "social", label: "친구 관계 / 외모" },
      { id: "hw-q5-b", icon: "chart", label: "성적 / 학교 생활" },
      { id: "hw-q5-c", icon: "question", label: "미래에 뭘 해야 할지 모르겠다" },
      { id: "hw-q5-d", icon: "heart", label: "가족 사이의 관계" },
      { id: "hw-q5-e", icon: "quiet", label: "특별히 걱정하는 게 없어 보인다" },
    ],
  },

  // ═══ MID-QUIZ REVEAL (after Q5) ═══
  // This is handled in the UI component, not as a question entry.
  // The reveal is injected between Q5 and Q6 in the page component.

  // ═══ HARD ZONE (Q6-Q9): Things parents often get wrong ═══

  // Q6 — Self-perception (hard): What the child thinks they're bad at
  {
    id: "hw-q6",
    dimension: "selfview",
    question: "\"나는 이건 못한다\"고 아이가 속으로 생각하는 것은 뭘까요?",
    childPrompt: "아이가 자신 없어하거나 피하는 것은?",
    parentPrompt: "내가 보기에 아이의 약점은?",
    options: [
      { id: "hw-q6-a", icon: "debate", label: "여러 사람 앞에서 말하기" },
      { id: "hw-q6-b", icon: "puzzle", label: "수학 / 논리적인 문제" },
      { id: "hw-q6-c", icon: "people", label: "새로운 사람과 어울리기" },
      { id: "hw-q6-d", icon: "organizing", label: "계획 세우고 실천하기" },
      { id: "hw-q6-e", icon: "drawing", label: "자기 생각을 표현하기" },
    ],
  },

  // Q7 — Interest (hard): Secret fascination
  {
    id: "hw-q7",
    dimension: "interest",
    question: "아이가 부모 몰래 가장 많이 검색하거나 빠져드는 주제는?",
    childPrompt: "아이가 혼자 있을 때 몰래 빠져드는 것은?",
    parentPrompt: "나는 아이가 어떤 주제에 관심 가지면 좋겠나요?",
    options: [
      { id: "hw-q7-a", icon: "star", label: "아이돌 / 연예인 / 팬 활동" },
      { id: "hw-q7-b", icon: "documentary", label: "게임 공략 / 게임 영상" },
      { id: "hw-q7-c", icon: "story", label: "웹툰 / 소설 / 2차 창작" },
      { id: "hw-q7-d", icon: "eye", label: "과학 / 우주 / 역사 같은 지식" },
      { id: "hw-q7-e", icon: "heart", label: "연애 / 관계 / 심리 콘텐츠" },
    ],
  },

  // Q8 — Emotion (hard): When truly hurt
  {
    id: "hw-q8",
    dimension: "emotion",
    question: "친구에게 마음이 상했을 때, 아이는 어떻게 할까요?",
    childPrompt: "아이가 실제로 하는 행동은?",
    parentPrompt: "나는 아이가 어떻게 하길 바라나요?",
    options: [
      { id: "hw-q8-a", icon: "quiet", label: "아무한테도 말 안 하고 삭인다" },
      { id: "hw-q8-b", icon: "chat", label: "다른 친구에게 하소연한다" },
      { id: "hw-q8-c", icon: "express", label: "바로 그 자리에서 표현한다" },
      { id: "hw-q8-d", icon: "person", label: "부모(나)에게 이야기한다" },
      { id: "hw-q8-e", icon: "different", label: "그냥 그 친구를 멀리한다" },
    ],
  },

  // Q9 — Self-perception (hard): Who they want to be
  {
    id: "hw-q9",
    dimension: "selfview",
    question: "아이가 \"나중에 이런 사람이 되고 싶다\"고 속으로 생각하는 모습은?",
    childPrompt: "아이가 진짜 동경하는 사람의 모습은?",
    parentPrompt: "내가 아이에게 기대하는 미래 모습은?",
    options: [
      { id: "hw-q9-a", icon: "star", label: "많은 사람에게 인정받는 사람" },
      { id: "hw-q9-b", icon: "wrench", label: "좋아하는 것을 직업으로 하는 사람" },
      { id: "hw-q9-c", icon: "globe", label: "자유롭게 여행하며 사는 사람" },
      { id: "hw-q9-d", icon: "hug", label: "주변 사람들에게 좋은 영향을 주는 사람" },
      { id: "hw-q9-e", icon: "bulb", label: "남들이 못하는 걸 해내는 사람" },
    ],
  },
];

// ─── Answer Storage ───

export interface HWAnswerPair {
  childPrediction: string; // selected option id
  parentWish: string; // selected option id
}

// ─── Mid-Quiz Reveal Logic ───

export interface MidRevealData {
  gapsDetected: number;
  totalAnswered: number;
  message: string;
  subMessage: string;
}

export function calculateMidReveal(
  answers: Record<string, HWAnswerPair>
): MidRevealData {
  // Count questions answered so far (Q1-Q5)
  const midQuestionIds = ["hw-q1", "hw-q2", "hw-q3", "hw-q4", "hw-q5"];
  let totalAnswered = 0;
  let gapsDetected = 0;

  for (const qId of midQuestionIds) {
    const pair = answers[qId];
    if (pair) {
      totalAnswered++;
      if (pair.childPrediction !== pair.parentWish) {
        gapsDetected++;
      }
    }
  }

  let message: string;
  let subMessage: string;

  if (gapsDetected === 0) {
    message = "지금까지 예측과 바람이 모두 일치했어요.";
    subMessage =
      "정말 아이를 잘 알고 계신 것 같습니다. 하지만 뒤의 질문들은 조금 더 어려워집니다.";
  } else if (gapsDetected <= 2) {
    message = `${totalAnswered}개 질문 중 ${gapsDetected}개에서 차이가 감지되었습니다.`;
    subMessage =
      "대부분 잘 맞추셨지만, 약간의 간극이 보입니다. 다음 질문들에서 더 깊은 차이가 드러날 수 있어요.";
  } else {
    message = `${totalAnswered}개 질문 중 ${gapsDetected}개에서 기대와 예측이 달랐습니다.`;
    subMessage =
      "생각보다 차이가 있죠? 이것은 자연스러운 일이에요. 남은 질문에서 더 정확한 이해도 지도를 그려볼게요.";
  }

  return { gapsDetected, totalAnswered, message, subMessage };
}

// ─── Result Calculator ───

/**
 * Gap scoring per question:
 * - Same option selected for child & parent → 0 (perfect alignment)
 * - Different option → base gap of 2
 * - Options that are "semantically far" apart → 3 (max gap)
 *
 * We use a simple approach: same = 0, different = 2.
 * This keeps it implementable without needing a full semantic distance matrix.
 * The per-dimension gap is averaged across that dimension's questions (3 each).
 */

function questionGap(pair: HWAnswerPair | undefined): number {
  if (!pair) return 1; // unanswered counts as moderate gap
  if (pair.childPrediction === pair.parentWish) return 0;
  return 2;
}

/**
 * Calculate the full result from all 9 answer pairs.
 */
export function calculateHWResult(
  answers: Record<string, HWAnswerPair>
): HWResult {
  // Group questions by dimension
  const dimensionQuestions: Record<HWDimension, string[]> = {
    interest: ["hw-q1", "hw-q4", "hw-q7"],
    emotion: ["hw-q2", "hw-q5", "hw-q8"],
    selfview: ["hw-q3", "hw-q6", "hw-q9"],
  };

  const dimensionResults: HWDimensionResult[] = [];
  let totalGap = 0;
  let totalQuestions = 0;

  for (const dim of ["interest", "emotion", "selfview"] as HWDimension[]) {
    const qIds = dimensionQuestions[dim];
    let dimGap = 0;

    for (const qId of qIds) {
      const gap = questionGap(answers[qId]);
      dimGap += gap;
      totalGap += gap;
      totalQuestions++;
    }

    // dimGap ranges 0-6 (3 questions * max 2 gap each)
    // Normalize to 0-3 scale for zone thresholds
    const normalizedGap = dimGap / 2; // 0-3

    let zone: ZoneLevel;
    if (normalizedGap <= 0.5) {
      zone = "green";
    } else if (normalizedGap <= 1.5) {
      zone = "yellow";
    } else {
      zone = "red";
    }

    const insight = generateDimensionInsight(dim, zone, answers);

    dimensionResults.push({
      dimension: dim,
      dimensionLabel: DIMENSION_LABELS[dim],
      zone,
      zoneLabel: ZONE_LABELS[zone],
      gapScore: Math.round(normalizedGap * 10) / 10,
      insight,
    });
  }

  // Understanding score: 0-100%
  // totalGap ranges 0-18 (9 questions * 2 max gap)
  // Perfect alignment = 100%, max gap = 0%
  const maxPossibleGap = totalQuestions * 2;
  const rawScore = Math.round(
    ((maxPossibleGap - totalGap) / maxPossibleGap) * 100
  );
  // Apply gentle curve: don't let it go below 20% (even worst case isn't 0)
  const understandingScore = Math.max(20, Math.min(100, rawScore));

  // Generate overall copy based on score
  const { headline, description, shareText, cta } =
    generateOverallCopy(understandingScore, dimensionResults);

  return {
    understandingScore,
    dimensions: dimensionResults,
    headline,
    description,
    shareText,
    cta,
  };
}

// ─── Dimension-level Insights ───

function generateDimensionInsight(
  dim: HWDimension,
  zone: ZoneLevel,
  answers: Record<string, HWAnswerPair>
): string {
  if (dim === "interest") {
    if (zone === "green") {
      return "아이가 어디에 끌리는지 잘 파악하고 계세요. 이 연결을 유지하는 것이 중요합니다.";
    } else if (zone === "yellow") {
      return "아이의 관심사를 대략 알고 있지만, 아이가 '진짜' 빠져드는 것과 약간의 차이가 있어요.";
    } else {
      return "아이가 몰래 빠져드는 세계가 있을 수 있어요. 판단 없이 \"요즘 뭐가 재밌어?\"라고 물어보는 것부터 시작해보세요.";
    }
  } else if (dim === "emotion") {
    if (zone === "green") {
      return "아이의 감정 패턴을 꽤 정확하게 읽고 계세요. 이 공감력이 아이에게 큰 안전감을 줍니다.";
    } else if (zone === "yellow") {
      return "아이가 감정을 처리하는 방식이 부모의 기대와 살짝 다릅니다. 아이만의 대처법을 존중해주세요.";
    } else {
      return "아이는 부모가 모르는 방식으로 감정을 처리하고 있을 가능성이 높아요. 감정에 대해 열린 대화가 필요한 시점입니다.";
    }
  } else {
    // selfview
    if (zone === "green") {
      return "아이가 자기 자신을 보는 눈과 부모의 시선이 잘 맞아요. 이 일치감이 아이의 자존감을 단단하게 합니다.";
    } else if (zone === "yellow") {
      return "아이가 스스로 생각하는 강점과 약점이 부모의 판단과 약간 다릅니다. 아이의 자기 평가에 귀 기울여보세요.";
    } else {
      return "아이가 자기 자신에 대해 부모와 상당히 다른 그림을 그리고 있을 수 있어요. \"너는 어떤 사람인 것 같아?\"라고 진지하게 물어본 적이 있나요?";
    }
  }
}

// ─── Overall Copy Generation ───

interface OverallCopy {
  headline: string;
  description: string;
  shareText: string;
  cta: string;
}

function generateOverallCopy(
  score: number,
  dims: HWDimensionResult[]
): OverallCopy {
  const redCount = dims.filter((d) => d.zone === "red").length;
  const greenCount = dims.filter((d) => d.zone === "green").length;

  // Tier 1: 80-100% — Strong understanding
  if (score >= 80) {
    return {
      headline: "아이를 꽤 잘 알고 계시네요",
      description:
        "부모님의 예측과 바람이 상당히 일치합니다. 아이와의 소통이 잘 되고 있다는 신호예요. 다만, '잘 안다'는 확신이 오히려 새로운 변화를 놓치게 할 수도 있어요. 10대는 매 학기 다른 사람이 되어가는 시기니까요.",
      shareText: `우리 아이 이해도 ${score}% — 꽤 잘 알고 있었어! 그래도 미지의 영역이 있다니...`,
      cta: "아이가 스스로 자신을 발견하는 경험을 선물해주세요",
    };
  }

  // Tier 2: 60-79% — Moderate understanding
  if (score >= 60) {
    const blurryDim = dims.find((d) => d.zone === "yellow");
    const blurryLabel = blurryDim
      ? blurryDim.dimensionLabel
      : "일부 영역";
    return {
      headline: "알고 있는 것과 모르는 것 사이",
      description: `대체로 아이를 잘 파악하고 계시지만, '${blurryLabel}' 쪽에서 약간의 간극이 보입니다. 이 정도의 차이는 매우 자연스러운 거예요. 중요한 건 이 차이를 인식하는 것 자체입니다. 아이에게 직접 물어보면 놀라운 답을 들을 수도 있어요.`,
      shareText: `우리 아이 이해도 ${score}%래. 나는 잘 안다고 생각했는데... 😅`,
      cta: "아이의 '흐릿한 영역'을 함께 탐험해보세요",
    };
  }

  // Tier 3: 40-59% — Significant gaps
  if (score >= 40) {
    return {
      headline: "아이에게 아직 못 들은 이야기가 많아요",
      description:
        "부모님의 바람과 아이의 실제 사이에 꽤 의미 있는 차이가 있어요. 하지만 이건 부모님 잘못이 아닙니다. 10-14세는 아이가 급격하게 자기만의 세계를 구축하는 시기이고, 부모에게 보여주는 모습이 전부가 아닐 수 있어요. 오히려 이 결과가 새로운 대화의 시작점이 될 수 있습니다.",
      shareText: `우리 아이 이해도 ${score}%... 나만 모르고 있었던 아이의 세계가 있을지도`,
      cta: "아이가 자기만의 세계를 보여줄 수 있는 공간을 만들어주세요",
    };
  }

  // Tier 4: 20-39% — Large gaps
  return {
    headline: "아이에게는 부모가 모르는 넓은 세계가 있어요",
    description: `부모님이 아이에게 바라는 것과 아이의 실제 모습 사이에 상당한 거리가 있어요. 이건 충격적일 수 있지만, 사실 많은 부모가 비슷한 결과를 받습니다. ${
      redCount >= 2
        ? "특히 여러 영역에서 차이가 크게 나타났는데,"
        : "차이가 큰 영역이 있는데,"
    } 이것은 아이가 성장하고 있다는 증거이기도 해요. 지금이 아이의 진짜 모습을 알아가기 가장 좋은 타이밍입니다.`,
    shareText: `우리 아이 이해도 ${score}%... 충격이지만 솔직한 결과. 다른 엄마들도 해봐`,
    cta: "아이가 진짜 자기 자신을 보여줄 수 있는 환경, 탐이 만들어줍니다",
  };
}

// ─── Zone-level Result Copy ───

export const ZONE_COPY: Record<
  ZoneLevel,
  { title: string; description: string; action: string }
> = {
  green: {
    title: "잘 아는 영역",
    description:
      "이 영역에서 부모님의 눈과 아이의 현실이 잘 맞닿아 있어요. 이 연결을 유지하면서 아이에게 더 넓은 경험을 제안해보세요.",
    action: "강점을 확장하는 새로운 경험 탐색하기",
  },
  yellow: {
    title: "흐릿한 영역",
    description:
      "대략은 알고 있지만, 디테일에서 차이가 있어요. 아이도 이 영역에서 부모에게 완전히 마음을 열지 않았을 수 있어요. 작은 대화가 큰 발견이 됩니다.",
    action: "판단 없이 물어보는 대화 시도하기",
  },
  red: {
    title: "미지의 영역",
    description:
      "이 영역에서 부모님이 기대하는 것과 아이의 실제가 상당히 다릅니다. 놀랍지만, 이건 아이가 성장하고 있다는 자연스러운 신호예요. 아이가 스스로 자기를 발견할 수 있는 공간이 필요합니다.",
    action: "아이가 직접 경험하고 발견할 기회 만들기",
  },
};
