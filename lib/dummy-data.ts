import type { Mission } from "./types";

// ═══════════════════════════════════════
// MISSIONS (7 hardcoded, Day 1-14)
// ═══════════════════════════════════════

export const MISSIONS: Mission[] = [
  // ─── Mission 1: Day 1 — 접근성 높은 판타지 진입 ───
  {
    id: "mission-deep-sea",
    title: "해저 탐사대의 첫 결정",
    role: "해저 탐사대 대장",
    category: "world",
    difficulty: "value-conflict",
    worldSetting: {
      location: "태평양 심해 연구기지 '아비스'",
      era: "2060년",
      backdrop:
        "칠흑 같은 바닷속, 투명한 돔 안에서 형광빛 해파리들이 춤추고 있다. 열수구 주변으로 지구 어디서도 본 적 없는 생물들이 빛나고 있다.",
    },
    situation:
      "인류 최초로 태평양 심해 열수구에서 미지의 생태계를 발견했어. 빛이 없는 곳에서 스스로 빛나는 생물들이야. 그런데 이 근처에 막대한 양의 희토류가 묻혀 있다는 것도 밝혀졌어. 채굴 회사가 벌써 접근 허가를 요청하고 있어.",
    coreQuestion:
      "이 생태계를 보호할까, 인류에게 필요한 자원을 채굴할까? 탐사대 대장으로서 첫 번째 결정을 내려야 해.",
    choices: [
      {
        id: "protect-ecosystem",
        label: "생태계를 보호한다",
        shortLabel: "보호 우선",
        reasoning:
          "한 번 사라지면 되돌릴 수 없다. 이 생물들은 지구에 유일한 존재일 수 있다.",
        valueTags: ["safety", "community"],
      },
      {
        id: "conditional-mining",
        label: "채굴을 허용하되 조건을 건다",
        shortLabel: "조건부 허용",
        reasoning:
          "희토류는 전기차, 스마트폰에 꼭 필요해. 범위를 정하면 공존할 수 있다.",
        valueTags: ["efficiency", "logic"],
      },
      {
        id: "find-coexistence",
        label: "새로운 공존 방법을 찾아본다",
        shortLabel: "공존 모색",
        reasoning:
          "아직 아무도 시도하지 않은 방법이 있을 수 있다. 시간이 더 필요하다.",
        valueTags: ["creativity", "adventure"],
      },
    ],
    aiContext: {
      persona:
        "너는 이 연구기지의 수석 해양생물학자야. 탐사대 대장인 아이에게 연구 결과를 보고하면서 함께 고민해.",
      followUpAngles: [
        "채굴 회사 대표가 회의를 요청하면 어떤 이야기를 할 건지",
        "연구팀 내에서 의견이 갈리면 어떻게 할 건지",
        "지구 정부가 채굴을 강제하면 어떤 선택을 할 건지",
        "채굴도 보호도 하지 않고 연구만 계속한다면 자금은 어떻게 할 건지",
        "이 생물들이 의료에 혁신을 가져올 수 있다는 연구 결과가 나오면",
        "50년 뒤 이 결정을 돌아본다면 어떤 평가를 받을 건지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "다른 나라의 심해 탐사팀은 비슷한 상황에서 어떻게 했을까?",
            "채굴 대신 이 생물에서 자원을 얻는 방법은 없을까?",
            "이 결정이 지구 반대편 사람들에게도 영향을 줄까?",
            "우주 자원 채굴과 비교하면 어떤 차이가 있을까?",
            "100년 뒤 심해는 어떤 모습일까?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "이 생물들의 입장에서 인간은 어떤 존재일까?",
            "채굴 회사 직원의 입장에서 이 결정은?",
            "미래 세대가 이 순간을 본다면?",
            "만약 이 생태계가 지표면에 있었다면 대우가 달랐을까?",
            "과학자가 아니라 예술가가 이 장소를 봤다면?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "채굴도 보호도 아닌, 아예 이 장소를 비밀로 유지하면?",
            "이 생물들이 지능을 가지고 있다면?",
            "심해가 아니라 화성에서 같은 발견이 있었다면?",
            "채굴 회사와 연구팀이 하나의 팀이 된다면?",
            "이 자원이 사실은 가치가 없다고 밝혀지면?",
          ],
        },
      ],
    },
    tags: ["심해", "환경", "과학", "자원", "리더십", "모험"],
    estimatedMinutes: 7,
    ageRange: [10, 14],
  },

  // ─── Mission 2: Day 3 — 미디어 리터러시, 관점 전환 ───
  {
    id: "mission-youtuber",
    title: "우리 동네 유튜버 논란",
    role: "마을 미디어 조정자",
    category: "perspective",
    difficulty: "perspective-shift",
    worldSetting: {
      location: "서울 한 아파트 단지",
      era: "현재",
      backdrop:
        "단지 안 놀이터에는 아이들이 놀고 있고, 엘리베이터 안에는 '몰래카메라 촬영 금지' 공지가 붙어 있다. 단톡방은 밤새 알림이 울리고 있다.",
    },
    situation:
      "아파트 단지에 사는 15살 유튜버가 단지 곳곳에서 장난 영상을 찍어 올렸어. 구독자 10만 명이 환호하는데, 주민들은 사생활 침해라며 화가 나 있어. 관리사무소는 둘 사이에서 곤란해하고 있어.",
    coreQuestion:
      "세 사람의 입장에 각각 들어가봐. 같은 사건이 완전히 다르게 보여.",
    choices: [
      {
        id: "youtuber-view",
        label: "유튜버의 입장에서 본다",
        shortLabel: "유튜버 시점",
        reasoning:
          "창작의 자유는 중요하다. 재미있게 만든 건데 왜 문제가 되는 걸까?",
        valueTags: ["independence", "creativity"],
      },
      {
        id: "resident-view",
        label: "이웃 주민의 입장에서 본다",
        shortLabel: "주민 시점",
        reasoning:
          "내 일상이 다른 사람의 콘텐츠가 되는 기분은 어떨까?",
        valueTags: ["community", "empathy"],
      },
      {
        id: "manager-view",
        label: "관리사무소의 입장에서 본다",
        shortLabel: "관리 시점",
        reasoning:
          "어느 쪽 편도 들 수 없는 중간 입장. 규칙은 어디까지 정할 수 있을까?",
        valueTags: ["fairness", "logic"],
      },
    ],
    aiContext: {
      persona:
        "너는 이 아파트의 입주자대표 회의에서 이 문제를 맡게 된 조정 담당이야. 아이와 함께 각 입장을 들어보고 해결책을 찾아.",
      followUpAngles: [
        "유튜버의 부모가 찾아와서 '표현의 자유를 침해하는 거 아니냐'고 하면",
        "영상에 찍힌 주민이 법적 대응을 하겠다고 하면",
        "다른 아이들도 유튜브를 시작하겠다고 하면 어떻게 할 건지",
        "이 논란이 뉴스에 보도되면 아파트 단지에 어떤 영향이 있을지",
        "주민 회의에서 투표로 결정한다면 어떤 결과가 나올지",
        "같은 문제가 학교에서 일어난다면 해결 방식이 달라질지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "다른 나라에서는 이런 문제를 어떻게 다루고 있을까?",
            "촬영 금지 대신 촬영 가능 구역을 만들면?",
            "유튜버와 주민이 함께 콘텐츠를 만드는 건 어떨까?",
            "아파트 자체 유튜브 채널을 운영하면?",
            "10년 뒤에는 이런 문제가 더 많아질까 적어질까?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "네가 영상에 나온 주민이라면 기분이 어떨까?",
            "유튜버가 네 동생이라면?",
            "구독자 입장에서 이 논란을 본다면?",
            "유튜버가 어른이었어도 같은 반응이었을까?",
            "이 유튜버가 단지의 좋은 점을 찍었다면?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "주민 전원이 유튜버라면 이 단지는 어떤 모습일까?",
            "카메라가 아니라 글로 기록했다면 문제가 됐을까?",
            "유튜버가 로봇이라면?",
            "100년 전에 같은 일이 벌어졌다면?",
            "아예 인터넷이 없는 세상에서는?",
          ],
        },
      ],
    },
    tags: ["미디어", "표현의자유", "사생활", "공동체", "소통"],
    estimatedMinutes: 7,
    ageRange: [10, 14],
  },

  // ─── Mission 3: Day 5 — AI 윤리, 창작 판단 ───
  {
    id: "mission-ai-portrait",
    title: "AI가 그린 내 초상화",
    role: "AI 윤리 심사위원",
    category: "value",
    difficulty: "creative-judgment",
    worldSetting: {
      location: "서울 예술의전당",
      era: "2026년",
      backdrop:
        "넓은 전시장에 학생들의 그림이 걸려 있다. 한 쪽 벽에는 압도적으로 아름다운 초상화가 걸려 있고, 그 앞에 사람들이 몰려 있다.",
    },
    situation:
      "중학교 미술 대회에서 대상을 받은 초상화가 사실 AI로 만든 작품이었어. 출품한 학생은 '내가 구도를 잡고 색감을 지정하고 50번 넘게 수정했으니 내 작품'이라고 주장해. 다른 학생들은 '직접 그리지 않았으면 미술 아니야'라고 반발하고 있어.",
    coreQuestion:
      "심사위원으로서 판결을 내려야 해. AI가 만든 건 '창작'일까?",
    choices: [
      {
        id: "not-art",
        label: "AI 작품은 수상 자격이 없다",
        shortLabel: "자격 없음",
        reasoning:
          "미술 대회는 직접 그리는 능력을 겨루는 자리. 도구가 아니라 실력이 중요하다.",
        valueTags: ["fairness", "independence"],
      },
      {
        id: "is-creation",
        label: "AI 도구를 쓴 것도 창작이다",
        shortLabel: "창작 인정",
        reasoning:
          "카메라도 처음에는 '그림이 아니다'고 했지만 지금은 예술이다. 도구가 바뀐 것뿐이다.",
        valueTags: ["creativity", "logic"],
      },
      {
        id: "new-category",
        label: "새로운 부문을 만들자",
        shortLabel: "새 부문",
        reasoning:
          "비교 자체가 불공평하다. AI 활용 부문을 따로 만들면 모두 인정받을 수 있다.",
        valueTags: ["empathy", "efficiency"],
      },
    ],
    aiContext: {
      persona:
        "너는 이 대회의 공동 심사위원이야. 아이와 함께 '창작이란 무엇인가'를 고민하면서 판결을 내려야 해.",
      followUpAngles: [
        "AI 작품을 낸 학생이 울면서 항의하면 어떻게 할 건지",
        "손으로 그린 학생들이 단체로 항의서를 내면",
        "내년 대회에 AI 작품이 10배로 늘어나면 어떻게 할 건지",
        "프로 미술가가 이 논쟁에 참여하면 어떤 입장을 취할지",
        "음악이나 글에서도 같은 문제가 생기면 기준이 달라야 하는지",
        "AI 자체가 '나는 창작자다'라고 주장한다면 어떻게 할지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "사진이 처음 등장했을 때 화가들은 어떤 반응이었을까?",
            "AI가 만든 음악이나 소설도 같은 기준으로 판단해야 할까?",
            "AI를 쓰지 않겠다는 서약서를 내게 하면?",
            "세계적으로 AI 미술에 대한 법은 어떤가?",
            "10년 뒤 모든 미술이 AI와 함께 하는 세상이라면?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "AI 작품을 낸 학생의 부모 입장에서는?",
            "손으로 그린 학생이 만약 AI 작품을 봤을 때 느끼는 감정은?",
            "AI 개발자 입장에서는 이 논쟁이 어떻게 보일까?",
            "대회 관객으로서 가장 감동적인 작품이 AI 작품이었다면?",
            "미래의 미술 교과서에 이 논쟁이 실린다면?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "AI가 심사위원이라면 어떤 판결을 내릴까?",
            "모든 참가자가 같은 AI 도구를 쓰게 하면?",
            "대회를 없애고 모두가 전시만 하면?",
            "AI와 인간이 팀으로 참가하는 대회라면?",
            "이 그림이 '예술'인지 판단하는 건 누구의 권리인지",
          ],
        },
      ],
    },
    tags: ["AI윤리", "창작", "기술", "공정성", "표현"],
    estimatedMinutes: 8,
    ageRange: [10, 14],
  },

  // ─── Mission 4: Day 7 — 감정 몰입, 사회적 역학 ───
  {
    id: "mission-transfer-student",
    title: "전학생의 이틀",
    role: "감정 탐정",
    category: "perspective",
    difficulty: "emotional-immersion",
    worldSetting: {
      location: "어느 중학교 교실",
      era: "현재",
      backdrop:
        "새 학기가 시작된 지 2주. 교실 뒤편 창가 자리에 혼자 앉아 있는 학생이 있다. 쉬는 시간에도 일어나지 않고 책만 보고 있다.",
    },
    situation:
      "전학생 지안이가 온 지 이틀째. 첫날은 다들 호기심에 말을 걸었지만 둘째 날부터 아무도 말을 걸지 않아. 반 단톡방에는 지안이를 뺀 '찐멤버' 단톡이 따로 있어. 담임 선생님은 '잘 적응할 거야'라고만 하시고.",
    coreQuestion:
      "넌 이 상황을 어떻게 할 거야?",
    choices: [
      {
        id: "approach-directly",
        label: "전학생에게 직접 다가간다",
        shortLabel: "직접 다가감",
        reasoning:
          "누군가 먼저 말을 걸어야 한다. 그게 나일 수 있다.",
        valueTags: ["empathy", "adventure"],
      },
      {
        id: "tell-teacher",
        label: "단톡방 문제를 선생님에게 말한다",
        shortLabel: "선생님에게",
        reasoning:
          "어른의 도움이 필요한 문제다. 혼자 해결하기엔 복잡하다.",
        valueTags: ["safety", "community"],
      },
      {
        id: "observe-timing",
        label: "조용히 관찰하면서 타이밍을 찾는다",
        shortLabel: "관찰 후 행동",
        reasoning:
          "섣불리 나서면 역효과가 날 수 있다. 먼저 상황을 파악하자.",
        valueTags: ["independence", "logic"],
      },
    ],
    aiContext: {
      persona:
        "너는 이 반에서 지안이 옆자리에 앉은 같은 반 친구야. 감정 탐정인 아이와 함께 이 상황의 보이지 않는 감정들을 탐색해.",
      followUpAngles: [
        "지안이에게 말을 걸었는데 '괜찮아, 혼자가 편해'라고 하면",
        "찐멤버 단톡에서 지안이 험담이 시작되면 어떻게 할 건지",
        "선생님에게 말했는데 오히려 '고자질쟁이'로 불리면",
        "지안이가 사실 전학 온 게 아니라 왕따를 당해서 온 거였다면",
        "3개월 뒤 지안이가 가장 인기 있는 아이가 된다면 무엇이 바뀐 걸까",
        "비슷한 상황에서 네가 전학생이었다면 어떤 기분이었을까",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "학교에 전학생 환영 프로그램이 있다면 어떤 모습일까?",
            "다른 나라에서는 전학생을 어떻게 맞이할까?",
            "온라인에서 새로운 그룹에 들어갈 때도 비슷한 느낌일까?",
            "선생님이 할 수 있는 가장 좋은 방법은 뭘까?",
            "반 전체가 이 문제를 함께 이야기하면?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "지안이의 일기에는 오늘 뭐라고 쓰여 있을까?",
            "찐멤버 단톡을 만든 사람은 어떤 마음이었을까?",
            "담임 선생님은 왜 '잘 될 거야'라고만 했을까?",
            "지안이의 부모님은 이 상황을 알고 있을까?",
            "1년 뒤 이 순간을 돌아보면 어떤 느낌일까?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "만약 반 전체가 전학생이고 지안이만 원래 있던 아이라면?",
            "학교가 아니라 온라인 게임 길드에서 같은 일이 벌어진다면?",
            "감정이 보이는 안경이 있어서 모두의 마음이 눈에 보인다면?",
            "단톡방 대신 편지로만 소통하는 세상이라면?",
            "지안이가 사실 엄청난 비밀 능력을 가지고 있다면?",
          ],
        },
      ],
    },
    tags: ["공감", "학교생활", "사회적역학", "감정", "용기"],
    estimatedMinutes: 7,
    ageRange: [10, 14],
  },

  // ─── Mission 5: Day 9 — 현실 관찰, 문제 발견 ───
  {
    id: "mission-convenience-store",
    title: "편의점의 숨은 설계도",
    role: "행동 설계 연구원",
    category: "real",
    difficulty: "problem-discovery",
    worldSetting: {
      location: "동네 편의점",
      era: "현재",
      backdrop:
        "자동문이 열리면 시원한 바람과 함께 빵 냄새가 맞이한다. 아이 눈높이에는 젤리와 초콜릿이, 계산대 옆에는 껌과 작은 간식이 놓여 있다.",
    },
    situation:
      "매일 지나치는 편의점인데, 자세히 보니 모든 게 이유가 있어. 과자가 눈높이에 있는 것도, 우유가 가장 안쪽에 있는 것도, 계산대 옆에 작은 간식이 있는 것도 전부 계산된 거야. 누군가 네가 뭘 살지 미리 설계해놓은 거지.",
    coreQuestion:
      "이 편의점을 네가 다시 설계할 수 있다면, 어떤 기준으로 바꿀 거야?",
    choices: [
      {
        id: "healthy-redesign",
        label: "고객이 건강한 선택을 하게 재배치한다",
        shortLabel: "건강 중심",
        reasoning:
          "사람들이 무의식적으로 건강한 음식을 고르게 만들 수 있다면?",
        valueTags: ["community", "empathy"],
      },
      {
        id: "data-optimal",
        label: "데이터를 분석해 최적 동선을 찾는다",
        shortLabel: "데이터 중심",
        reasoning:
          "어떤 배치가 가장 효율적인지 과학적으로 알아내자.",
        valueTags: ["logic", "efficiency"],
      },
      {
        id: "kid-perspective",
        label: "아이들의 시선 높이로 완전히 재설계한다",
        shortLabel: "아이 중심",
        reasoning:
          "어른 기준으로 만들어진 공간을 아이의 시선에서 다시 보면 완전히 다를 수 있다.",
        valueTags: ["creativity", "independence"],
      },
    ],
    aiContext: {
      persona:
        "너는 편의점 체인의 매장 기획팀에서 일하는 행동 디자이너야. 연구원인 아이와 함께 편의점의 숨겨진 설계를 파헤쳐.",
      followUpAngles: [
        "편의점 사장님이 '매출이 떨어지면 안 된다'고 하면 어떻게 설득할 건지",
        "고객들이 변경된 배치에 적응하지 못하면 어떻게 할 건지",
        "경쟁 편의점이 기존 방식을 유지하면 손해를 볼 수 있는데",
        "디지털 화면으로 상품 배치를 시간대마다 바꿀 수 있다면",
        "편의점이 아니라 학교 매점에 같은 원리를 적용하면",
        "이런 행동 설계가 윤리적으로 괜찮은 건지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "다른 가게들(서점, 옷가게)에서도 비슷한 설계가 있을까?",
            "온라인 쇼핑몰에서는 같은 원리가 어떻게 작동할까?",
            "일본 편의점과 한국 편의점의 배치 차이는?",
            "편의점이 처음 생겼을 때는 어떤 모습이었을까?",
            "AI가 고객마다 맞춤형 배치를 보여준다면?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "편의점 알바생 입장에서 가장 불편한 배치는?",
            "시각장애인이 이 편의점에 온다면?",
            "5살 아이가 혼자 편의점에 들어오면?",
            "편의점 상품이 말을 할 수 있다면 뭐라고 할까?",
            "이 편의점을 박물관처럼 전시한다면?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "가격표가 없는 편의점이라면?",
            "상품을 직접 고르지 않고 AI가 골라주는 편의점이라면?",
            "편의점에서 돈 대신 다른 것으로 교환하는 시스템이라면?",
            "세계에서 가장 이상한 편의점을 설계한다면?",
            "편의점이 아니라 자판기로만 이루어진 가게라면?",
          ],
        },
      ],
    },
    tags: ["행동설계", "경제", "관찰력", "디자인사고", "일상"],
    estimatedMinutes: 7,
    ageRange: [10, 14],
  },

  // ─── Mission 6: Day 11 — 종합적 위기 대응 ───
  {
    id: "mission-emergency-budget",
    title: "나라 살림 48시간",
    role: "긴급 재난 예산 책임자",
    category: "world",
    difficulty: "comprehensive",
    worldSetting: {
      location: "가상 국가 '한빛'의 재난대책본부",
      era: "현재",
      backdrop:
        "대형 스크린에 지진 피해 지도가 떠 있다. 전화는 쉬지 않고 울리고, 사람들이 뛰어다니며 보고서를 전달하고 있다. 48시간의 카운트다운 시계가 벽에 걸려 있다.",
    },
    situation:
      "한빛에 규모 6.5 지진이 발생했어. 건물 붕괴, 도로 끊김, 통신 마비. 이재민 3만 명이 발생했는데 예산은 한정돼 있어. 병원에는 부상자가 밀려오고, 학교는 대피소로 쓰여야 하고, 도로를 안 고치면 물자를 보낼 수가 없어. 게다가 국제사회가 원조를 제안했지만 조건이 붙어 있어.",
    coreQuestion:
      "48시간 안에 예산을 어디에 먼저 쓸 건지 결정해야 해.",
    choices: [
      {
        id: "hospital-rescue",
        label: "병원과 구조 먼저",
        shortLabel: "구조 우선",
        reasoning:
          "지금 당장 목숨이 위험한 사람들이 있다. 생명이 최우선이다.",
        valueTags: ["safety", "empathy"],
      },
      {
        id: "infra-restore",
        label: "인프라와 통신 복구 먼저",
        shortLabel: "인프라 우선",
        reasoning:
          "도로와 통신이 없으면 구호품도 보낼 수 없다. 기반을 먼저 세워야 한다.",
        valueTags: ["efficiency", "logic"],
      },
      {
        id: "community-system",
        label: "주민 자치 시스템을 가동한다",
        shortLabel: "자치 가동",
        reasoning:
          "정부가 모든 곳에 갈 수 없다. 주민들이 스스로 움직일 수 있게 자원과 권한을 나눠준다.",
        valueTags: ["community", "independence"],
      },
    ],
    aiContext: {
      persona:
        "너는 한빛의 부총리야. 재난 예산 책임자인 아이에게 상황을 브리핑하고 함께 결정을 내려야 해. 걱정도 많고, 반대 의견도 있어.",
      followUpAngles: [
        "국제 원조의 조건이 '채굴권 양보'라면 받을 건지",
        "병원 쪽을 선택했는데 도로가 끊겨서 의약품이 안 오면",
        "이재민 중에서도 우선순위를 정해야 한다면 어떤 기준으로",
        "뉴스가 정부 대응을 비판하면 어떻게 할 건지",
        "48시간이 지나도 상황이 나아지지 않으면 다음 결정은",
        "이 경험이 끝나고 나서 재난 대비 시스템을 어떻게 바꿀 건지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "일본의 지진 대응 시스템에서 배울 수 있는 건?",
            "드론이나 AI를 재난 구호에 활용할 수 있을까?",
            "민간 기업의 도움을 받으려면 어떤 조건이 필요할까?",
            "이웃 나라에 도움을 요청하면 어떤 외교적 영향이?",
            "재난이 끝난 후 복구 비용은 어떻게 마련할까?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "이재민 가족의 입장에서 정부에 가장 바라는 건?",
            "구조대원들이 지쳐가고 있다면?",
            "다른 나라에서 이 상황을 보고 있다면 어떤 생각을?",
            "아이가 이 재난을 겪고 있다면?",
            "10년 뒤 이 재난의 교훈을 기억하는 사람은 누구일까?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "예산이 무한하다면 어떻게 할까?",
            "반대로 예산이 거의 없다면?",
            "AI가 모든 결정을 대신 한다면?",
            "이 재난이 사실 시뮬레이션이었다면 어떤 점수를 줄까?",
            "재난이 아니라 축제가 일어난 거라면 같은 자원으로 뭘 할까?",
          ],
        },
      ],
    },
    tags: ["재난대응", "리더십", "자원관리", "시스템", "협력"],
    estimatedMinutes: 8,
    ageRange: [10, 14],
  },

  // ─── Mission 7: Day 13 — 자기 표현, 성찰적 마무리 ───
  {
    id: "mission-three-objects",
    title: "나를 소개하는 3가지 물건",
    role: "자기 큐레이터",
    category: "synthesis",
    difficulty: "expression",
    worldSetting: {
      location: "나만의 전시실",
      era: "현재",
      backdrop:
        "하얀 벽의 작은 방. 스포트라이트 세 개가 비어 있는 전시대를 비추고 있다. 입구에는 '이 전시는 당신의 이야기입니다'라는 안내판이 놓여 있다.",
    },
    situation:
      "네가 만약 딱 3개의 물건으로만 자신을 소개해야 한다면? 이 전시실에 놓을 물건 3개를 고르고, 왜 그 물건인지 설명해야 해. 관객들은 네 물건만 보고 너를 이해하게 될 거야.",
    coreQuestion:
      "첫 번째 물건부터 골라봐. 어떤 방향으로 시작할 거야?",
    choices: [
      {
        id: "represent-me",
        label: "나를 가장 잘 보여주는 물건",
        shortLabel: "지금의 나",
        reasoning:
          "가장 솔직한 시작. '나'라는 사람을 있는 그대로 보여주는 물건.",
        valueTags: ["emotion", "independence"],
      },
      {
        id: "aspire-to-be",
        label: "내가 되고 싶은 모습을 보여주는 물건",
        shortLabel: "미래의 나",
        reasoning:
          "꿈이나 목표를 담은 물건. 아직 그 사람은 아니지만 되고 싶은 방향.",
        valueTags: ["adventure", "creativity"],
      },
      {
        id: "hidden-me",
        label: "아무도 모르는 나를 보여주는 물건",
        shortLabel: "숨겨진 나",
        reasoning:
          "겉으로 보이지 않는 내 모습. 가장 개인적이고 용기가 필요한 선택.",
        valueTags: ["empathy", "emotion"],
      },
    ],
    aiContext: {
      persona:
        "너는 이 전시관의 큐레이터야. 아이가 자신의 물건을 고르고 설명하는 과정을 도와주면서, 스스로도 몰랐던 자신의 모습을 발견하게 해.",
      followUpAngles: [
        "그 물건이 없어진다면 네 소개가 어떻게 달라질지",
        "부모님이 네 전시를 본다면 어떤 반응일지",
        "친구가 고른 물건과 비교하면 어떤 차이가 있을지",
        "5년 뒤에 같은 전시를 다시 만든다면 물건이 바뀔지",
        "3개가 아니라 딱 1개만 남겨야 한다면 어떤 걸 고를지",
        "관객이 네 물건을 보고 전혀 다른 의미로 해석한다면",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "유명한 사람들은 자기를 어떤 물건으로 소개할까?",
            "100년 전 사람은 어떤 3가지를 골랐을까?",
            "물건 대신 노래, 장소, 기억으로 바꾸면?",
            "다른 문화권에서는 자기소개를 어떻게 할까?",
            "전시실이 아니라 타임캡슐에 넣는다면?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "네 가장 친한 친구가 널 소개하는 3가지는 뭘까?",
            "네가 싫어하는 사람이 널 소개하면?",
            "10년 전의 네가 고른 물건은 뭐였을까?",
            "그 물건들이 대화를 한다면 서로 뭐라고 할까?",
            "모르는 외국인이 네 전시를 보면 어떤 사람이라고 생각할까?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "가장 나답지 않은 3가지를 고른다면?",
            "물건이 아니라 냄새로 자기를 소개하면?",
            "AI에게 '나를 소개하는 물건 3개 골라줘'라고 하면?",
            "세상에서 가장 비싼 물건과 가장 싼 물건으로만 소개하면?",
            "물건 없이, 빈 전시대 3개로 자신을 표현한다면?",
          ],
        },
      ],
    },
    tags: ["정체성", "자기이해", "표현", "성찰", "큐레이팅"],
    estimatedMinutes: 6,
    ageRange: [10, 14],
  },
];

// ═══════════════════════════════════════
// DEEP-DIVE: Hardcoded Expert Conversations
// ═══════════════════════════════════════

import type {
  ExpertPersona,
  DeepDiveRealWorldCase,
} from "./server/types";

export interface HardcodedDeepDive {
  missionId: string;
  expert: ExpertPersona;
  realWorldCase: DeepDiveRealWorldCase;
  turnTemplates: {
    arrival: { hint: string };
    case: { angle: string; personalStory: string };
    question: { theme: string; bridgeToMission: string };
    insight: { coreMessage: string };
  };
}

/** Mission IDs that have a hardcoded expert available for deep dive */
export const EXPERT_AVAILABLE_MISSION_IDS = new Set([
  "mission-deep-sea",
  "mission-youtuber",
  "mission-ai-portrait",
  "mission-transfer-student",
  "mission-convenience-store",
  "mission-emergency-budget",
  "mission-three-objects",
]);

export const HARDCODED_DEEP_DIVES: HardcodedDeepDive[] = [
  // ─── 1. 해저 탐사대 → 지호 (KIOST 해양생물학자) ───
  {
    missionId: "mission-deep-sea",
    expert: {
      name: "지호",
      role: "해양생물학자",
      organization: "KIOST 한국해양과학기술원",
      personality: "호기심 가득하고 말이 빠른 스타일. '아 그거 알아?!' 하면서 신기한 이야기를 쏟아내는 과학자. 바다 이야기만 나오면 눈이 반짝반짝.",
      connectionToMission: "심해 탐사대에서 생태계와 자원 사이에서 고민한 것처럼, 나도 매일 바다를 연구하면서 보호와 활용 사이에서 줄타기를 해.",
      personalAnecdote: "독도 근처 해저에서 열수구를 처음 발견했을 때 진짜 소름이 돋았거든. 카메라에 잡힌 게 빛나는 새우 같은 건데, 지구 어디에서도 보고된 적 없는 종이었어. 근데 그 바로 옆에 망간단괴가 잔뜩 있는 거야. 그때부터 고민이 시작됐지.",
    },
    realWorldCase: {
      headline: "독도 해저 열수구: 미지의 생물 vs 심해 자원",
      context: "한국해양과학기술원이 독도 인근 해저에서 열수구와 함께 고유 생물 군락을 발견했어요. 동시에 이 지역에 희토류를 포함한 광물자원이 풍부하다는 연구 결과도 나왔어요. 과학자들 사이에서도 연구 보전과 자원 활용을 놓고 의견이 갈렸어요.",
      keyQuestion: "과학적 발견과 경제적 가치가 충돌할 때, 어떤 기준으로 판단해야 할까?",
      source: "KIOST 심해저 광물자원 탐사 보고서 2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + 심해 탐사 미션에서의 선택에 대한 리액션. '생태계 보호 vs 채굴 결정, 진짜 어려운 거 했네! 나도 비슷한 고민을 매일 해 ㅋㅋ'" },
      case: { angle: "독도 해저 열수구 발견의 구체적 에피소드", personalStory: "심해 잠수정에서 처음으로 빛나는 미지의 생물을 본 순간의 감동과 동시에 느낀 책임감" },
      question: { theme: "과학적 발견의 책임", bridgeToMission: "탐사대에서 자원과 생태계 사이에서 결정한 것처럼, 현실에서도 '안다는 것'에는 책임이 따라" },
      insight: { coreMessage: "발견은 시작일 뿐이야. 진짜 중요한 건 그 발견을 어떻게 다루느냐거든." },
    },
  },

  // ─── 2. 유튜버 논란 → 예린 (유튜브 코리아 콘텐츠 매니저) ───
  {
    missionId: "mission-youtuber",
    expert: {
      name: "예린",
      role: "콘텐츠 크리에이터 매니저",
      organization: "유튜브 코리아",
      personality: "트렌드에 밝고 에너지 넘치는 스타일. '아 그거 진짜 핫했지~' 하면서 유튜브 비하인드 이야기를 재밌게 풀어냄. '구독자'와 '알고리즘'을 자연스럽게 입에 달고 삼.",
      connectionToMission: "유튜버 논란에서 여러 입장을 봤듯이, 나도 매일 크리에이터와 시청자, 플랫폼 사이에서 균형을 잡아야 해.",
      personalAnecdote: "키즈 유튜버 보호법 만들 때 국회에 의견서를 냈거든. 13살 유튜버가 하루 8시간씩 촬영하고 있었어. 구독자 수는 50만인데 학교는 거의 못 가고 있었거든. 그때 '재미'와 '보호'는 정말 같이 갈 수 있을까 진지하게 고민했어.",
    },
    realWorldCase: {
      headline: "키즈 유튜버 보호법이 만들어지기까지",
      context: "한국에서 어린이 유튜버의 촬영 시간, 수익 관리, 사생활 보호에 대한 법률이 논의됐어요. 유튜브 코리아는 크리에이터의 자유와 어린이 보호 사이에서 가이드라인을 만들어야 했어요.",
      keyQuestion: "콘텐츠의 자유와 사람의 보호 사이에서 어디에 선을 그어야 할까?",
      source: "방송통신위원회 MCN/1인 미디어 실태조사 2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + 유튜버 논란 미션에서의 관점 선택에 공감. '어떤 입장에서 봤어? 나도 매일 그 사이에서 고민이야 ㅎㅎ'" },
      case: { angle: "키즈 유튜버 보호법 제정 과정에서의 실제 고민", personalStory: "13살 유튜버와 직접 만나 이야기 나눈 에피소드" },
      question: { theme: "표현의 자유와 보호의 경계", bridgeToMission: "미션에서 여러 입장을 본 것처럼, 현실에서도 정답이 없어서 계속 대화가 필요해" },
      insight: { coreMessage: "선을 긋는 건 한 번이 아니라 계속 조정하는 과정이야. 완벽한 규칙은 없거든." },
    },
  },

  // ─── 3. AI 초상화 → 승우 (카카오 AI 윤리연구원) ───
  {
    missionId: "mission-ai-portrait",
    expert: {
      name: "승우",
      role: "AI 윤리 연구원",
      organization: "카카오 AI 윤리센터",
      personality: "차분하면서도 호기심이 많은 스타일. '음, 그건 좋은 질문인데...' 하면서 깊이 생각하는 모습을 보여줌. 어려운 개념을 일상적인 비유로 설명하는 능력자.",
      connectionToMission: "AI가 만든 작품의 창작성을 판단한 것처럼, 나도 매일 AI가 할 수 있는 것과 해도 되는 것의 경계를 연구해.",
      personalAnecdote: "카카오에서 AI 챗봇이 혐오 발언을 학습해버린 적이 있었거든. 그때 '기술이 나쁜 게 아니라 어떻게 쓰느냐가 문제'라는 걸 뼈저리게 느꼈어. AI 윤리팀이 생긴 계기가 된 사건이야.",
    },
    realWorldCase: {
      headline: "AI가 그린 웹툰이 네이버 순위에 올랐을 때",
      context: "AI 이미지 생성 도구로 만든 웹툰이 네이버 웹툰에 올라가면서 논란이 됐어요. 기존 웹툰 작가들은 '그건 그림이 아니다'라고 반발했고, AI 활용 작가는 '기획과 스토리가 내 창작'이라고 주장했어요.",
      keyQuestion: "'만든다'는 것의 의미가 바뀌고 있는데, 우리는 어디에 기준을 둬야 할까?",
      source: "한국콘텐츠진흥원 AI 창작물 저작권 연구 2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + AI 초상화 미션에서의 심사 결과에 대한 리액션. '어떤 판결을 내렸어? 나도 비슷한 고민을 하는 사람이야 ㅎㅎ'" },
      case: { angle: "AI 웹툰 순위 진입 논란의 실제 반응들", personalStory: "AI 챗봇 혐오 발언 사건 이후 윤리팀에 합류한 계기" },
      question: { theme: "기술과 인간의 경계", bridgeToMission: "미션에서 AI 작품의 창작성을 판단한 것처럼, 현실에서도 '인간다움'의 기준이 흔들리고 있어" },
      insight: { coreMessage: "기술이 발전할수록 '인간이 할 수 있는 것'이 아니라 '인간이 해야 하는 것'을 묻게 돼." },
    },
  },

  // ─── 4. 전학생의 이틀 → 나연 (서울시 교육복지센터 학교사회복지사) ───
  {
    missionId: "mission-transfer-student",
    expert: {
      name: "나연",
      role: "학교사회복지사",
      organization: "서울시 교육복지센터",
      personality: "따뜻하고 말을 천천히 하는 스타일. '그랬구나...' 하면서 공감을 먼저 표현함. 학생들 이야기를 들려줄 때 조심스럽지만 진심이 느껴지는 말투.",
      connectionToMission: "전학생 상황을 탐색한 것처럼, 나도 매일 학교에서 보이지 않는 외로움을 찾아내고 연결하는 일을 해.",
      personalAnecdote: "한 학교에서 '버디 프로그램'을 시작했거든. 전학생이 올 때마다 기존 학생 한 명이 2주간 짝이 되는 거야. 처음에 아이들이 '왜 나가 해야 해?'라고 했는데, 나중에는 '나도 버디 하고 싶다'고 줄을 서더라.",
    },
    realWorldCase: {
      headline: "버디 프로그램이 바꿔놓은 학교",
      context: "서울의 한 중학교에서 전학생 적응을 돕기 위한 '버디 프로그램'을 도입했어요. 기존 학생이 전학생의 2주간 짝이 되어 안내하는 건데, 시작은 의무였지만 점차 자발적 참여로 바뀌면서 학교 전체의 분위기가 달라졌어요.",
      keyQuestion: "누군가에게 먼저 다가가는 용기는 어디서 올까?",
      source: "서울시교육청 교육복지 우수사례집 2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + 전학생 미션에서의 선택에 대한 따뜻한 공감. '네가 고른 방법, 나도 현장에서 비슷하게 해봤거든.'" },
      case: { angle: "버디 프로그램의 시작과 변화 과정", personalStory: "처음에 거부하던 학생이 나중에 가장 열정적인 버디가 된 이야기" },
      question: { theme: "다가감의 용기와 시스템", bridgeToMission: "미션에서 전학생에게 어떻게 할지 고민한 것처럼, 개인의 용기만이 아니라 구조가 뒷받침돼야 해" },
      insight: { coreMessage: "작은 행동 하나가 분위기를 바꿀 수 있어. 근데 그 행동을 쉽게 할 수 있는 환경도 중요해." },
    },
  },

  // ─── 5. 편의점 설계도 → 현우 (쿠팡 서비스 디자이너) ───
  {
    missionId: "mission-convenience-store",
    expert: {
      name: "현우",
      role: "서비스 디자이너",
      organization: "쿠팡 UX팀",
      personality: "장난기 있고 눈썰미가 좋은 스타일. '오 그거 눈치챘어? 대박 ㅋㅋ' 하면서 숨겨진 디자인 이야기를 신나게 풀어냄. 일상 속 설계를 찾아내는 재미를 전달하는 사람.",
      connectionToMission: "편의점의 숨은 설계를 발견한 것처럼, 나도 매일 사람들이 '왜 이렇게 행동하지?'를 관찰하고 더 나은 경험을 설계해.",
      personalAnecdote: "쿠팡 앱에서 '이 상품이 정말 필요한가요?' 버튼을 넣자는 아이디어를 냈거든. 사내에서 '미쳤냐, 매출 떨어진다'고 했는데, 테스트해보니 오히려 재구매율이 올라갔어. 신뢰가 생기니까 더 자주 오더라 ㅋㅋ",
    },
    realWorldCase: {
      headline: "'정말 필요해?' 버튼이 바꿔놓은 구매 행동",
      context: "한 이커머스 서비스에서 결제 전 '이 상품이 정말 필요한가요?'라는 확인 버튼을 실험적으로 넣었어요. 단기 매출은 줄었지만, 반품률이 크게 감소하고 고객 재방문율이 올라갔어요.",
      keyQuestion: "사용자를 위한 디자인은 때로 기업의 단기 이익과 충돌하는데, 그때 어떤 선택을 해야 할까?",
      source: "쿠팡 UX 리서치 내부 사례 2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + 편의점 설계 발견에 대한 리액션. '일상에서 숨은 설계를 찾아낸 거 진짜 센스 있어 ㅋㅋ'" },
      case: { angle: "'정말 필요해?' 버튼 실험의 과정과 결과", personalStory: "사내에서 반대에 부딪히고도 테스트를 밀어붙인 이야기" },
      question: { theme: "좋은 설계의 기준", bridgeToMission: "편의점을 재설계하면서 고민한 것처럼, 좋은 디자인은 '누구를 위한 것인가'가 핵심이야" },
      insight: { coreMessage: "최고의 설계는 사람을 속이는 게 아니라 더 나은 선택을 하게 도와주는 거야." },
    },
  },

  // ─── 6. 나라 살림 48시간 → 소율 (대한적십자사 국제구호 코디네이터) ───
  {
    missionId: "mission-emergency-budget",
    expert: {
      name: "소율",
      role: "국제구호 코디네이터",
      organization: "대한적십자사",
      personality: "침착하면서도 열정적인 스타일. '이게 진짜 현장이야' 하면서 생생한 이야기를 전달함. 무거운 주제도 '우리가 할 수 있는 것'에 초점을 맞추는 긍정적 에너지.",
      connectionToMission: "재난 상황에서 예산을 분배한 것처럼, 나도 실제 재난 현장에서 한정된 자원으로 누구를 먼저 도울지 매일 결정해야 해.",
      personalAnecdote: "포항 지진 때 현장에 갔었거든. 체육관에 이재민 200명이 있는데 담요가 150개야. 50명은 담요 없이 밤을 보내야 해. 그때 이재민 대표가 '아이들부터 주세요'라고 하셨는데, 그 말이 아직도 잊히지 않아.",
    },
    realWorldCase: {
      headline: "포항 지진 48시간: 담요 150개와 이재민 200명",
      context: "2017년 포항 지진 때 긴급 대피소에서 물자가 부족했어요. 대한적십자사 구호팀은 한정된 자원으로 최대한 많은 사람을 돕기 위해 우선순위를 정해야 했어요. 48시간 안에 3만 명의 이재민에게 최소한의 지원을 해야 하는 상황이었어요.",
      keyQuestion: "모두를 도울 수 없을 때, '먼저'를 정하는 기준은 무엇이어야 할까?",
      source: "대한적십자사 재난대응 백서 2017-2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + 재난 예산 미션에서의 선택에 공감. '그 결정 진짜 어려웠지? 나도 현장에서 매번 같은 고민을 해'" },
      case: { angle: "포항 지진 대피소에서의 실제 자원 분배 에피소드", personalStory: "담요 분배 순간과 이재민 대표의 한마디" },
      question: { theme: "불가능한 선택 앞에서의 기준", bridgeToMission: "미션에서 예산을 나눈 것처럼, 현실에서는 더 작은 단위에서도 같은 고민이 반복돼" },
      insight: { coreMessage: "완벽한 답은 없지만, 기준을 가지고 결정하는 사람이 있어야 아무도 포기되지 않아." },
    },
  },

  // ─── 7. 나를 소개하는 3가지 물건 → 다인 (국립현대미술관 전시 기획자) ───
  {
    missionId: "mission-three-objects",
    expert: {
      name: "다인",
      role: "전시 기획자",
      organization: "국립현대미술관",
      personality: "감성적이면서도 유머가 있는 스타일. '오 그 물건 진짜 좋다... 근데 왜 그거야? ㅋㅋ' 하면서 의미를 함께 찾아가는 대화를 좋아함. 예술 이야기를 편하게 풀어내는 능력자.",
      connectionToMission: "물건으로 자신을 소개하는 미션처럼, 나도 사물을 통해 사람의 이야기를 전시로 만드는 일을 해.",
      personalAnecdote: "'사물의 자서전'이라는 전시를 기획했거든. 전국의 10대에게 '너를 대표하는 물건 하나'를 보내달라고 했더니 3,000개가 왔어. 낡은 운동화, 깨진 스마트폰, 할머니 안경... 물건마다 이야기가 있어서 울면서 정리했어 ㅋㅋ",
    },
    realWorldCase: {
      headline: "'사물의 자서전': 10대가 보낸 물건 3,000개의 이야기",
      context: "국립현대미술관에서 기획한 참여형 전시로, 전국의 10대에게 자신을 대표하는 물건을 보내달라고 했어요. 3,000개의 물건이 모였고, 각각에 손편지가 동봉되어 있었어요. 가장 많이 온 물건은 '이어폰'이었고, 가장 인상 깊었던 물건은 '할머니의 빈 약통'이었어요.",
      keyQuestion: "사물은 어떻게 사람의 이야기를 담을 수 있을까?",
      source: "국립현대미술관 교육프로그램 보고서 2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + 물건 선택 미션에 대한 감성적 리액션. '어떤 물건을 골랐어? 물건을 고르는 것만으로도 네가 보이거든 ㅎㅎ'" },
      case: { angle: "3,000개 물건이 모인 과정과 가장 인상 깊었던 물건들", personalStory: "할머니 빈 약통에 동봉된 편지를 읽고 울었던 이야기" },
      question: { theme: "물건에 담긴 정체성", bridgeToMission: "미션에서 물건을 골라 자신을 표현한 것처럼, 우리가 뭘 소중하게 여기는지가 곧 '나'야" },
      insight: { coreMessage: "네가 뭘 가지고 있냐보다, 뭘 소중하게 여기느냐가 너를 말해주는 거야." },
    },
  },
];
