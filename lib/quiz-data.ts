// ─── Quiz Types ───

export interface QuizMeta {
  slug: string;
  title: string;
  subtitle: string;
  emoji: string;
  duration: string;
  questionCount: number;
  description: string;
  available: boolean;
}

export interface QuizOption {
  id: string;
  emoji?: string;
  label: string;
  weights: Partial<Record<string, number>>;
}

export interface QuizQuestion {
  id: string;
  type: "single" | "multi-select" | "reveal";
  question: string;
  subtitle?: string;
  options: QuizOption[];
  maxSelect?: number;
}

export interface QuizResultType {
  id: string;
  emoji: string;
  name: string;
  tagline: string;
  description: string;
  coreDriver: string;
  flowTrigger: string;
  strengths: string[];
  color: string;
}

export interface Quiz {
  meta: QuizMeta;
  questions: QuizQuestion[];
  resultTypes: QuizResultType[];
}

// ─── All Quiz Metas (for hub page) ───

export const ALL_QUIZZES: QuizMeta[] = [
  {
    slug: "immersion-dna",
    title: "우리 아이 몰입 DNA 분석",
    subtitle: "아이가 시간을 잊고 빠져드는 순간의 비밀",
    emoji: "🧬",
    duration: "2분 30초",
    questionCount: 7,
    description:
      "아이가 어떤 활동에서 가장 깊이 몰입하는지, 그 몰입의 패턴은 어떤 형태인지를 분석합니다. 결과로 나오는 5가지 몰입 DNA는 아이의 숨겨진 잠재력을 새로운 언어로 보여줍니다.",
    available: true,
  },
  {
    slug: "ai-survival-type",
    title: "AI 시대 생존 유형 테스트",
    subtitle: "변화하는 세상에서 아이의 강점은?",
    emoji: "🔮",
    duration: "3분",
    questionCount: 8,
    description:
      "AI가 바꾸는 세상에서 아이가 어떤 유형의 강점을 갖고 있는지 진단합니다.",
    available: false,
  },
  {
    slug: "child-world",
    title: "우리 아이는 어떤 세계에 살고 있을까?",
    subtitle: "아이의 내면 세계를 지도로 그려봅니다",
    emoji: "🎯",
    duration: "2분 30초",
    questionCount: 7,
    description:
      "이야기 속 시나리오를 통해 아이의 내면 세계를 4개 영역으로 매핑합니다.",
    available: false,
  },
  {
    slug: "hidden-world",
    title: "엄마(아빠)는 모르는 숨겨진 세계",
    subtitle: "나는 우리 아이를 얼마나 알고 있을까?",
    emoji: "👁️",
    duration: "3분",
    questionCount: 9,
    description:
      "부모의 예측과 아이의 실제 사이의 간극을 이해도 지도로 보여줍니다.",
    available: false,
  },
  {
    slug: "2030-readiness",
    title: "2030년, 우리 아이 준비도 체크",
    subtitle: "4년 뒤, 아이는 준비되어 있을까?",
    emoji: "⏰",
    duration: "3분",
    questionCount: 8,
    description:
      "다른 부모님들의 응답과 비교하며, 아이의 미래 준비도를 4사분면으로 진단합니다.",
    available: false,
  },
  {
    slug: "ai-portrait",
    title: "AI에게 물어봤습니다: 당신의 아이는?",
    subtitle: "AI가 보는 아이 vs 부모가 보는 아이",
    emoji: "💬",
    duration: "3분",
    questionCount: 8,
    description:
      "AI의 시선과 부모의 시선을 나란히 놓아 그 차이를 보여주는 이중 초상화.",
    available: false,
  },
  {
    slug: "academy-vs-experience",
    title: "학원 5개 vs 경험 1개",
    subtitle: "우리 아이에게 진짜 필요한 건?",
    emoji: "📊",
    duration: "3분",
    questionCount: 8,
    description:
      "아이의 현재 스케줄을 돌아보고, 경험의 균형을 진단합니다.",
    available: false,
  },
];

// ─── Immersion DNA Quiz ───

const DNA_TYPES = {
  inquiry: "inquiry",
  expression: "expression",
  builder: "builder",
  connector: "connector",
  solver: "solver",
} as const;

type DnaType = (typeof DNA_TYPES)[keyof typeof DNA_TYPES];

const w = (type: DnaType, score = 1): Partial<Record<string, number>> => ({
  [type]: score,
});

const w2 = (
  a: DnaType,
  b: DnaType,
  sa = 1,
  sb = 0.5
): Partial<Record<string, number>> => ({
  [a]: sa,
  [b]: sb,
});

export const IMMERSION_DNA_QUIZ: Quiz = {
  meta: ALL_QUIZZES[0],
  questions: [
    {
      id: "q1",
      type: "multi-select",
      question: "아이가 시간 가는 줄 모르고 빠져드는 활동을 3개 골라주세요.",
      subtitle: "평소 관찰한 것을 기준으로 골라주세요.",
      maxSelect: 3,
      options: [
        { id: "q1-coding", emoji: "💻", label: "코딩 / 프로그래밍", weights: w2("builder", "solver") },
        { id: "q1-drawing", emoji: "🎨", label: "그림 / 만들기", weights: w2("expression", "builder") },
        { id: "q1-reading", emoji: "📚", label: "독서 / 글쓰기", weights: w2("inquiry", "expression") },
        { id: "q1-building", emoji: "🧱", label: "레고 / 조립", weights: w2("builder", "solver") },
        { id: "q1-debate", emoji: "🗣️", label: "토론 / 대화", weights: w2("connector", "inquiry") },
        { id: "q1-organizing", emoji: "📋", label: "정리 / 계획 세우기", weights: w2("solver", "builder") },
        { id: "q1-nature", emoji: "🌿", label: "자연 탐험", weights: w2("inquiry", "connector") },
        { id: "q1-documentary", emoji: "🎬", label: "다큐 / 지식 영상", weights: w2("inquiry", "expression") },
        { id: "q1-story", emoji: "✍️", label: "이야기 만들기", weights: w2("expression", "inquiry") },
        { id: "q1-puzzle", emoji: "🧩", label: "퍼즐 / 수수께끼", weights: w2("solver", "inquiry") },
        { id: "q1-social", emoji: "👥", label: "친구 모임 기획", weights: w2("connector", "expression") },
        { id: "q1-perform", emoji: "🎤", label: "공연 / 발표", weights: w2("expression", "connector") },
      ],
    },
    {
      id: "q2",
      type: "single",
      question: "아이가 무언가에 깊이 빠져들 때, 어떤 모습인가요?",
      options: [
        { id: "q2-quiet", emoji: "🤫", label: "혼자 조용히 집중한다", weights: w2("inquiry", "builder") },
        { id: "q2-talk", emoji: "💬", label: "주변에 계속 이야기한다", weights: w2("expression", "connector") },
        { id: "q2-try", emoji: "🔨", label: "직접 이것저것 해본다", weights: w2("builder", "solver") },
        { id: "q2-people", emoji: "🤝", label: "다른 사람을 끌어들인다", weights: w2("connector", "expression") },
        { id: "q2-question", emoji: "❓", label: "끊임없이 질문을 던진다", weights: w2("inquiry", "solver") },
      ],
    },
    {
      id: "q3",
      type: "single",
      question: "아이의 호기심은 보통 어디서 시작되나요?",
      options: [
        { id: "q3-question", emoji: "💭", label: "왜?라는 질문에서", weights: w("inquiry", 2) },
        { id: "q3-feeling", emoji: "💗", label: "어떤 감정이 생겼을 때", weights: w2("expression", "connector") },
        { id: "q3-saw", emoji: "👀", label: "신기한 걸 봤을 때", weights: w2("inquiry", "expression") },
        { id: "q3-person", emoji: "🧑", label: "누군가를 만났을 때", weights: w2("connector", "inquiry") },
        { id: "q3-problem", emoji: "⚠️", label: "문제를 발견했을 때", weights: w2("solver", "builder") },
      ],
    },
    {
      id: "q4",
      type: "single",
      question: "아이가 좋아하는 활동에서 어려움을 만나면?",
      options: [
        { id: "q4-dig", emoji: "🔍", label: "더 깊이 파고든다", weights: w2("inquiry", "solver") },
        { id: "q4-different", emoji: "🔄", label: "다른 방법을 시도한다", weights: w2("builder", "solver") },
        { id: "q4-ask", emoji: "🙋", label: "주변에 도움을 구한다", weights: w2("connector", "expression") },
        { id: "q4-express", emoji: "😤", label: "감정을 먼저 표현한다", weights: w2("expression", "connector") },
        { id: "q4-analyze", emoji: "📊", label: "문제를 분석하고 쪼갠다", weights: w2("solver", "inquiry") },
      ],
    },
    {
      id: "q5",
      type: "single",
      question: "아이의 에너지가 올라가는 순간은?",
      subtitle: "가장 가까운 것 하나를 골라주세요.",
      options: [
        { id: "q5-new-info", emoji: "🌟", label: "새로운 사실을 알게 됐을 때", weights: w("inquiry", 2) },
        { id: "q5-made", emoji: "✨", label: "뭔가를 직접 만들었을 때", weights: w2("builder", "expression") },
        { id: "q5-audience", emoji: "👏", label: "누군가에게 보여줬을 때", weights: w2("expression", "connector") },
        { id: "q5-together", emoji: "🤗", label: "여러 사람과 함께할 때", weights: w("connector", 2) },
        { id: "q5-solved", emoji: "💡", label: "문제를 해결했을 때", weights: w("solver", 2) },
      ],
    },
    {
      id: "q6",
      type: "reveal",
      question: "여기까지의 답변을 분석해봤어요.",
      subtitle: "아이의 몰입 패턴이 보이기 시작합니다. 마지막 질문으로 더 정확한 결과를 찾아볼게요.",
      options: [],
    },
    {
      id: "q7",
      type: "single",
      question:
        "모든 판단을 내려놓고, 아이에게 하루를 온전히 준다면 뭘 할 것 같나요?",
      subtitle: "학원도, 숙제도, 잔소리도 없는 하루.",
      options: [
        { id: "q7-explore", emoji: "🗺️", label: "가본 적 없는 곳을 탐험한다", weights: w2("inquiry", "connector") },
        { id: "q7-create", emoji: "🎭", label: "뭔가를 만들거나 표현한다", weights: w2("expression", "builder") },
        { id: "q7-build", emoji: "🏗️", label: "머릿속 아이디어를 실체로 만든다", weights: w("builder", 2) },
        { id: "q7-people", emoji: "🎉", label: "좋아하는 사람들과 시간을 보낸다", weights: w("connector", 2) },
        { id: "q7-fix", emoji: "🔧", label: "불편했던 것을 직접 고쳐본다", weights: w("solver", 2) },
      ],
    },
  ],
  resultTypes: [
    {
      id: "inquiry",
      emoji: "🔬",
      name: "탐구형 DNA",
      tagline: "\"왜?\"를 이해하고 싶은 아이",
      description:
        "새로운 사실을 발견하고, 깊이 파고들고, 세상의 작동 원리를 이해하는 데서 에너지를 얻는 유형입니다. 질문이 멈추지 않고, 혼자 조용히 집중하는 시간에 가장 깊이 몰입합니다.",
      coreDriver: "이해하고 싶다는 욕구",
      flowTrigger: "새로운 정보 + 자율적 탐색 시간",
      strengths: [
        "깊은 집중력과 끈기",
        "본질적인 질문을 던지는 능력",
        "복잡한 정보를 정리하는 힘",
      ],
      color: "#7C6FAF",
    },
    {
      id: "expression",
      emoji: "🎭",
      name: "표현형 DNA",
      tagline: "보여주고, 들려주고 싶은 아이",
      description:
        "자신의 생각과 감정을 다양한 형태로 표현하는 데서 에너지를 얻는 유형입니다. 그림, 글, 말, 행동 — 형태는 다양하지만, 핵심은 '나의 것'을 세상에 내놓는 것입니다.",
      coreDriver: "표현하고 공유하고 싶다는 욕구",
      flowTrigger: "자유로운 표현 환경 + 반응해주는 관객",
      strengths: [
        "풍부한 감수성과 상상력",
        "자기만의 시각으로 해석하는 힘",
        "감정을 언어로 바꾸는 능력",
      ],
      color: "#E8614D",
    },
    {
      id: "builder",
      emoji: "🏗️",
      name: "구축형 DNA",
      tagline: "머릿속을 현실로 만드는 아이",
      description:
        "아이디어를 실체로 만들어내는 데서 에너지를 얻는 유형입니다. 생각만 하는 것에 만족하지 않고, 직접 만들고, 고치고, 반복하면서 완성도를 높여갑니다.",
      coreDriver: "실체를 만들고 싶다는 욕구",
      flowTrigger: "만들 수 있는 재료 + 반복 개선할 시간",
      strengths: [
        "아이디어를 실행으로 옮기는 추진력",
        "시행착오에서 배우는 회복력",
        "끝까지 완성하려는 집요함",
      ],
      color: "#E09145",
    },
    {
      id: "connector",
      emoji: "🌐",
      name: "연결형 DNA",
      tagline: "사람과 아이디어를 잇는 아이",
      description:
        "사람들 사이에서 에너지를 얻고, 서로 다른 것들을 연결하는 데서 몰입하는 유형입니다. 혼자 하는 것보다 함께 할 때 더 빛나고, 다양성 속에서 가능성을 찾습니다.",
      coreDriver: "연결하고 함께하고 싶다는 욕구",
      flowTrigger: "다양한 사람들 + 협력할 수 있는 맥락",
      strengths: [
        "공감 능력과 사회적 감수성",
        "다양한 관점을 조율하는 힘",
        "팀을 하나로 모으는 리더십",
      ],
      color: "#4A5FC1",
    },
    {
      id: "solver",
      emoji: "⚖️",
      name: "해결형 DNA",
      tagline: "문제를 보면 가만히 못 있는 아이",
      description:
        "불편함이나 문제를 발견하면 해결하지 않고는 못 배기는 유형입니다. 분석하고, 쪼개고, 체계적으로 접근하며, 해결의 쾌감에서 가장 큰 에너지를 얻습니다.",
      coreDriver: "고치고 해결하고 싶다는 욕구",
      flowTrigger: "명확한 문제 + 충분한 자원과 권한",
      strengths: [
        "논리적이고 체계적인 사고",
        "복잡한 문제를 단순화하는 능력",
        "결과를 내는 실행력",
      ],
      color: "#6B8F71",
    },
  ],
};

// ─── Result Calculator ───

export function calculateDnaResult(
  answers: Record<string, string[]>
): string {
  const scores: Record<string, number> = {
    inquiry: 0,
    expression: 0,
    builder: 0,
    connector: 0,
    solver: 0,
  };

  const quiz = IMMERSION_DNA_QUIZ;

  for (const q of quiz.questions) {
    if (q.type === "reveal") continue;

    const selected = answers[q.id] ?? [];
    for (const optionId of selected) {
      const option = q.options.find((o) => o.id === optionId);
      if (!option) continue;
      for (const [type, weight] of Object.entries(option.weights)) {
        scores[type] = (scores[type] ?? 0) + (weight ?? 0);
      }
    }
  }

  let maxType = "inquiry";
  let maxScore = -1;
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type;
    }
  }

  return maxType;
}

// ─── Lookup Helpers ───

export function getQuizBySlug(slug: string): Quiz | null {
  if (slug === "immersion-dna") return IMMERSION_DNA_QUIZ;
  return null;
}

export function getResultType(quiz: Quiz, typeId: string): QuizResultType | null {
  return quiz.resultTypes.find((r) => r.id === typeId) ?? null;
}
