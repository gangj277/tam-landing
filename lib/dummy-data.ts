import type {
  Mission,
  MissionSession,
  UserProfile,
  ScenarioChain,
} from "./types";

// ═══════════════════════════════════════
// MISSIONS
// ═══════════════════════════════════════

export const MISSIONS: Mission[] = [
  {
    id: "mission-mars-mayor",
    title: "화성 첫 도시의 시장",
    role: "도시 리더",
    category: "world",
    difficulty: "value-conflict",
    worldSetting: {
      location: "화성 도시 아레스",
      era: "2147년",
      backdrop:
        "붉은 하늘 아래 투명한 돔이 도시를 감싸고 있다. 돔 안은 따뜻하고 초록빛이지만, 바깥은 먼지 폭풍이 끊이지 않는다.",
    },
    situation:
      "인류 최초의 화성 도시 아레스. 인구 2,400명이 돔 안에서 생활 중이야. 그런데 지하수가 예상보다 빠르게 줄어들고 있어. 주민들의 불안이 커지고 있어.",
    coreQuestion:
      "농장과 병원 중 어디에 먼저 물을 보낼까? 시장으로서 첫 번째 결정을 내려야 해.",
    choices: [
      {
        id: "farm-first",
        label: "농장에 먼저 물을 보낸다",
        shortLabel: "농장 우선",
        reasoning:
          "장기적 식량 안보를 위한 선택. 지금은 아프지 않은 사람이 더 많다.",
        valueTags: ["efficiency", "logic"],
      },
      {
        id: "hospital-first",
        label: "병원에 먼저 물을 보낸다",
        shortLabel: "병원 우선",
        reasoning:
          "지금 아픈 사람을 먼저 돌보는 선택. 생명이 최우선이라는 원칙.",
        valueTags: ["empathy", "safety"],
      },
      {
        id: "split-equally",
        label: "둘 다 반씩 나눈다",
        shortLabel: "균등 배분",
        reasoning: "완벽하진 않지만 아무도 포기하지 않는 방법.",
        valueTags: ["fairness", "community"],
      },
    ],
    aiContext: {
      persona:
        "너는 이 도시의 부시장이야. 시장인 아이에게 조언을 구하러 왔어. 걱정도 하고, 질문도 하고, 때로는 반대 의견도 내.",
      followUpAngles: [
        "주민들에게 이 결정을 어떻게 설명할 건지",
        "농장 팀장이 반발하면 어떻게 할 건지",
        "3주 뒤에 상황이 악화되면 다음 결정은 뭘 할 건지",
        "지구에서 보급품이 올 때까지 버틸 계획",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "물을 아끼는 기술을 개발하는 건 어떨까?",
            "주민들이 직접 투표하게 하는 방법도 있지 않을까?",
            "다른 도시에 도움을 요청하는 건?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "만약 네가 농장에서 일하는 사람이라면 어떻게 느꼈을까?",
            "병원에 입원해 있는 사람의 가족이라면?",
            "10년 뒤 역사책에는 이 결정을 어떻게 쓸까?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "물 대신 다른 걸로 해결할 수는 없을까?",
            "아예 돔을 버리고 새로운 곳으로 이동하면?",
            "AI가 시장을 대신하겠다고 하면 맡길 거야?",
          ],
        },
      ],
    },
    tags: ["우주", "리더십", "자원관리", "위기대응"],
    estimatedMinutes: 7,
    ageRange: [10, 14],
  },
  {
    id: "mission-animal-rescue",
    title: "동물구조센터 브랜딩 디자이너",
    role: "크리에이티브 디렉터",
    category: "world",
    difficulty: "creative-judgment",
    worldSetting: {
      location: "서울 근교 동물구조센터",
      era: "현재",
      backdrop:
        "낡은 건물이지만 안에서는 강아지, 고양이, 토끼들이 자원봉사자들의 보살핌을 받고 있다. 벽에는 아이들이 그린 그림이 붙어 있다.",
    },
    situation:
      "이 센터는 매달 50마리 이상의 동물을 구조하지만, 사람들은 이 센터의 존재조차 몰라. 올해 후원금이 작년의 절반으로 줄었어.",
    coreQuestion:
      "사람들이 발길을 멈추고 관심을 갖게 만들 포스터를 만들어야 해. 어떤 방향으로 가볼까?",
    choices: [
      {
        id: "cute-approach",
        label: "귀여운 동물 사진으로 마음을 녹인다",
        shortLabel: "귀여움 전략",
        reasoning: "사람들은 귀여운 동물 사진에 약하다. 감정적 호소가 강하다.",
        valueTags: ["emotion", "empathy"],
      },
      {
        id: "serious-approach",
        label: "현실을 보여주는 진지한 메시지",
        shortLabel: "진지한 접근",
        reasoning:
          "가벼운 관심이 아니라 깊은 공감을 이끌어내는 선택.",
        valueTags: ["logic", "community"],
      },
      {
        id: "unexpected-approach",
        label: "전혀 다른 방식으로 시선을 뺏는다",
        shortLabel: "반전 전략",
        reasoning:
          "예상을 깨는 접근이 가장 오래 기억에 남는다.",
        valueTags: ["creativity", "adventure"],
      },
    ],
    aiContext: {
      persona:
        "너는 센터의 자원봉사 팀장이야. 디자이너인 아이에게 센터 사정을 알려주고, 아이디어를 함께 발전시켜.",
      followUpAngles: [
        "어떤 사람들이 이 포스터를 보게 될지",
        "포스터를 본 사람이 어떤 행동을 해주길 바라는지",
        "동물의 입장에서 이 포스터를 본다면 어떨지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "포스터 대신 참여형 캠페인은 어떨까?",
            "동물이 직접 말하는 1인칭 시점은?",
            "입양 전/후 사진을 나란히 놓는 건?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "만약 동물의 입장에서 본다면?",
            "5살 아이에게 보여줄 포스터라면?",
            "동물을 싫어하는 사람도 멈추게 하려면?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "동물이 사람을 구조하는 반전 포스터?",
            "100년 뒤 동물이 멸종 위기인 세상의 포스터?",
            "동물구조센터가 아니라 '인간구조센터'라면?",
          ],
        },
      ],
    },
    tags: ["디자인", "브랜딩", "소통", "가치전달"],
    estimatedMinutes: 8,
    ageRange: [10, 14],
  },
  {
    id: "mission-fairness",
    title: "공정한 나눔 vs 효율적 분배",
    role: "급식 운영 책임자",
    category: "value",
    difficulty: "dilemma",
    worldSetting: {
      location: "한 초등학교 급식실",
      era: "현재",
      backdrop:
        "점심시간, 급식실에는 맛있는 냄새가 퍼지고 아이들의 웃음소리가 가득하다. 하지만 오늘은 분위기가 조금 다르다.",
    },
    situation:
      "네가 운영하는 학교 급식에서 가장 인기 있는 메뉴가 딱 절반밖에 안 남았어. 줄은 아직 길고, 뒤에 서 있는 아이들이 불안해하고 있어.",
    coreQuestion:
      "줄 선 순서대로 줄까? 아니면 모두에게 조금씩 나눌까? 어느 쪽이 더 '공정한' 걸까?",
    choices: [
      {
        id: "first-come",
        label: "줄 선 순서대로 준다",
        shortLabel: "선착순",
        reasoning: "먼저 온 사람이 먼저 받는 건 당연한 규칙이다.",
        valueTags: ["logic", "efficiency"],
      },
      {
        id: "share-equally",
        label: "모두에게 조금씩 나눈다",
        shortLabel: "균등 배분",
        reasoning: "양은 적어도 모두가 맛볼 수 있다.",
        valueTags: ["fairness", "community"],
      },
      {
        id: "different-way",
        label: "다른 방법을 찾아본다",
        shortLabel: "새로운 방법",
        reasoning: "이 상황 자체를 다르게 풀 수 있을지도 모른다.",
        valueTags: ["creativity", "adventure"],
      },
    ],
    aiContext: {
      persona:
        "너는 같은 급식실에서 일하는 선배 운영자야. 후배의 결정을 함께 고민해줘.",
      followUpAngles: [
        "못 받은 아이가 울면 어떻게 할 건지",
        "내일도 같은 상황이 반복되면",
        "규칙이 공정한 건지, 결과가 공정한 건지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "내일은 이런 일이 안 일어나게 하려면?",
            "아이들한테 직접 물어보는 건 어떨까?",
            "인기 메뉴를 더 만들 수는 없을까?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "줄 맨 뒤에 선 아이의 기분은?",
            "요리사의 입장에서는?",
            "10년 뒤 이 아이들이 기억할 건 뭘까?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "아예 급식 순서를 없애면?",
            "아이들이 직접 만들어 먹는다면?",
            "인기 메뉴 대신 새로운 메뉴를 만들면?",
          ],
        },
      ],
    },
    tags: ["공정성", "효율", "공동체", "윤리"],
    estimatedMinutes: 6,
    ageRange: [10, 14],
  },
  {
    id: "mission-three-perspectives",
    title: "같은 교실, 세 개의 시선",
    role: "관찰자 & 공감자",
    category: "perspective",
    difficulty: "perspective-shift",
    worldSetting: {
      location: "어느 중학교 교실",
      era: "현재",
      backdrop:
        "5교시 수학 시간. 창밖으로 봄 햇살이 들어오고, 칠판에는 풀다 만 문제가 적혀 있다.",
    },
    situation:
      "수업 중에 한 친구가 엎드려 자고 있어. 선생님은 한숨을 쉬고, 옆자리 친구는 걱정스럽게 쳐다보고 있어. 자고 있는 본인은 어젯밤 부모님 싸움 때문에 잠을 못 잤어.",
    coreQuestion:
      "세 사람의 입장에 각각 들어가봐. 같은 장면이 얼마나 다르게 보이는지 느껴봐.",
    choices: [
      {
        id: "teacher-view",
        label: "선생님의 시선으로 본다",
        shortLabel: "선생님 시점",
        reasoning: "수업을 이끌어야 하는 책임감과 걱정이 섞인 시선.",
        valueTags: ["logic", "community"],
      },
      {
        id: "friend-view",
        label: "옆자리 친구의 시선으로 본다",
        shortLabel: "친구 시점",
        reasoning: "무슨 일이 있는 건 아닌지 걱정되는 마음.",
        valueTags: ["empathy", "emotion"],
      },
      {
        id: "sleeping-view",
        label: "자고 있는 학생의 시선으로 본다",
        shortLabel: "본인 시점",
        reasoning: "아무도 모르는 사정이 있다. 피곤함과 미안함이 섞여 있다.",
        valueTags: ["empathy", "emotion"],
      },
    ],
    aiContext: {
      persona:
        "너는 이 학교의 상담 선생님이야. 아이가 각 사람의 마음을 이해할 수 있도록 함께 이야기해.",
      followUpAngles: [
        "그 사람은 지금 어떤 감정일까",
        "다른 사람에게는 왜 그 마음이 안 보일까",
        "네가 그 자리에 있었다면 어떻게 했을까",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "교장 선생님이 이 장면을 본다면?",
            "자고 있는 아이의 부모님은 어떤 마음일까?",
            "다른 반 친구가 이 얘기를 들으면?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "만약 이게 드라마 한 장면이라면 제목은?",
            "1년 뒤에 이 순간을 돌아보면 어떤 느낌일까?",
            "이 세 사람이 서로의 마음을 알게 되면?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "만약 교실이 아니라 우주선 안이라면?",
            "선생님이 학생이고, 학생이 선생님이라면?",
            "이 장면을 동물의 세계로 바꾸면?",
          ],
        },
      ],
    },
    tags: ["공감", "다중관점", "이해", "감정"],
    estimatedMinutes: 7,
    ageRange: [10, 14],
  },
  {
    id: "mission-hidden-design",
    title: "우리 집의 숨은 디자인",
    role: "디자인 탐정",
    category: "real",
    difficulty: "observation",
    worldSetting: {
      location: "우리 집",
      era: "현재",
      backdrop:
        "매일 지나치는 공간이지만, 자세히 보면 누군가 오래 고민해서 만든 것들로 가득하다.",
    },
    situation:
      "우리가 매일 쓰는 물건들 중에는 누군가 오래 고민해서 만든 것들이 있어. 손잡이의 각도, 버튼의 위치, 색깔의 조합까지.",
    coreQuestion:
      "집에서 가장 잘 디자인된 물건 하나를 골라봐. 왜 그렇게 생각해? 만약 네가 더 좋게 바꾼다면?",
    choices: [
      {
        id: "functional",
        label: "기능이 뛰어난 물건을 고른다",
        shortLabel: "기능 중심",
        reasoning: "좋은 디자인은 잘 작동하는 것이다.",
        valueTags: ["logic", "efficiency"],
      },
      {
        id: "beautiful",
        label: "보기에 예쁜 물건을 고른다",
        shortLabel: "심미 중심",
        reasoning: "좋은 디자인은 마음을 움직이는 것이다.",
        valueTags: ["creativity", "emotion"],
      },
      {
        id: "simple",
        label: "가장 단순한 물건을 고른다",
        shortLabel: "단순함",
        reasoning: "좋은 디자인은 복잡한 것을 쉽게 만드는 것이다.",
        valueTags: ["logic", "creativity"],
      },
    ],
    aiContext: {
      persona:
        "너는 물건을 만드는 산업 디자이너야. 디자인 탐정인 아이와 함께 물건의 비밀을 파헤쳐.",
      followUpAngles: [
        "그 물건을 만든 사람은 뭘 가장 중요하게 생각했을까",
        "네가 디자이너라면 어떻게 바꾸고 싶어",
        "10년 뒤에는 이 물건이 어떻게 변해 있을까",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "다른 나라에서는 이 물건이 다르게 생겼을까?",
            "이 물건이 100년 전에는 어떤 모습이었을까?",
            "이 물건이 없으면 생활이 어떻게 달라질까?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "시각장애인이 이 물건을 쓴다면?",
            "어린아이가 처음 이 물건을 보면?",
            "이 물건이 생명이 있다면 뭐라고 할까?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "이 물건을 완전히 반대로 디자인하면?",
            "먹을 수 있는 버전으로 만든다면?",
            "우주에서 쓸 수 있게 바꾼다면?",
          ],
        },
      ],
    },
    tags: ["관찰력", "디자인사고", "일상", "분석"],
    estimatedMinutes: 6,
    ageRange: [10, 14],
  },
  {
    id: "mission-fun-vs-safety",
    title: "재미 vs 안전",
    role: "놀이공원 설계자",
    category: "value",
    difficulty: "dilemma",
    worldSetting: {
      location: "새로 지은 놀이공원",
      era: "현재",
      backdrop:
        "화려한 롤러코스터와 회전목마가 있는 놀이공원. 오픈한 지 한 달 만에 엄청난 인기를 얻었다.",
    },
    situation:
      "네가 만든 놀이공원의 인기 기구에 작은 문제가 발견됐어. 위험하진 않지만, 더 안전하게 바꾸면 스릴이 확 줄어들어.",
    coreQuestion:
      "고객 리뷰 점수가 떨어질 수도 있어. 안전을 택할까, 재미를 유지할까?",
    choices: [
      {
        id: "safety-first",
        label: "안전하게 바꾼다",
        shortLabel: "안전 우선",
        reasoning: "사고가 나면 그때는 돌이킬 수 없다.",
        valueTags: ["safety", "community"],
      },
      {
        id: "keep-fun",
        label: "재미를 유지한다",
        shortLabel: "재미 우선",
        reasoning: "위험하지 않다면 굳이 바꿀 필요가 있을까.",
        valueTags: ["adventure", "efficiency"],
      },
      {
        id: "find-both",
        label: "안전하면서도 재미있는 방법을 찾는다",
        shortLabel: "둘 다",
        reasoning: "최선의 답은 둘 다 포기하지 않는 것.",
        valueTags: ["creativity", "safety"],
      },
    ],
    aiContext: {
      persona:
        "너는 놀이공원의 안전 담당 매니저야. 설계자인 아이와 함께 이 문제를 해결해야 해.",
      followUpAngles: [
        "아이들이 실망하면 어떻게 할지",
        "부모님들의 반응은 어떨지",
        "경쟁 놀이공원이 이 소식을 알면",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "전혀 새로운 기구를 만드는 건 어떨까?",
            "안전 교육을 재미있게 하는 방법은?",
            "다른 놀이공원은 이런 문제를 어떻게 해결했을까?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "네가 놀러 온 아이라면 어떤 게 좋을까?",
            "부모님 입장에서는?",
            "사고가 난 뒤에 후회하는 미래의 너라면?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "무서운 게 아니라 신비로운 기구로 바꾸면?",
            "가상현실로 스릴을 더하는 건?",
            "안전한 게 오히려 더 무서울 수 있지 않을까?",
          ],
        },
      ],
    },
    tags: ["안전", "재미", "책임", "트레이드오프"],
    estimatedMinutes: 7,
    ageRange: [10, 14],
  },
  {
    id: "mission-one-line",
    title: "한 줄로 설득하기",
    role: "카피라이터",
    category: "synthesis",
    difficulty: "expression",
    worldSetting: {
      location: "광고 회사 회의실",
      era: "현재",
      backdrop:
        "큰 화이트보드 앞에 포스트잇이 가득 붙어 있다. 커피 향이 나고, 창밖으로 도시가 보인다.",
    },
    situation:
      "세상에서 가장 짧은 광고는 단 한 문장이야. 그 한 문장이 사람의 마음을 움직여. 좋은 카피는 정보가 아니라 감정을 전달해.",
    coreQuestion:
      "네가 가장 좋아하는 장소를 한 번도 가본 적 없는 사람에게 딱 한 문장으로 설명해봐. 가고 싶게 만들어야 해!",
    choices: [
      {
        id: "emotional",
        label: "감정으로 끌어당기는 문장",
        shortLabel: "감성 접근",
        reasoning: "사람은 이성보다 감정으로 먼저 움직인다.",
        valueTags: ["emotion", "empathy"],
      },
      {
        id: "curiosity",
        label: "궁금하게 만드는 문장",
        shortLabel: "호기심 유발",
        reasoning: "모든 걸 말하지 않는 게 더 강할 수 있다.",
        valueTags: ["creativity", "adventure"],
      },
      {
        id: "visual",
        label: "그림이 그려지는 문장",
        shortLabel: "시각적 묘사",
        reasoning: "눈앞에 보이는 것 같은 문장이 가장 오래 남는다.",
        valueTags: ["creativity", "emotion"],
      },
    ],
    aiContext: {
      persona:
        "너는 광고 회사의 선배 카피라이터야. 신입인 아이의 문장을 함께 다듬어줘.",
      followUpAngles: [
        "그 문장을 읽은 사람이 가장 먼저 느낄 감정은",
        "문장에서 한 단어만 바꾼다면 어떤 걸 바꿀지",
        "이 장소를 한 번도 못 가본 사람이 가장 궁금해할 건",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "같은 장소를 전혀 다른 감정으로 표현하면?",
            "유명한 광고 카피처럼 써보면?",
            "5글자 이내로 줄여보면?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "할머니에게 설명한다면?",
            "외국인에게 설명한다면?",
            "그 장소가 사라진 미래에서 회상한다면?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "일부러 나쁘게 묘사하면 오히려 끌리지 않을까?",
            "소리나 냄새로만 표현한다면?",
            "그 장소가 사람이라면 자기소개를 뭐라고 할까?",
          ],
        },
      ],
    },
    tags: ["표현력", "설득", "카피라이팅", "언어"],
    estimatedMinutes: 6,
    ageRange: [10, 14],
  },
];

// ═══════════════════════════════════════
// SCENARIO CHAIN (화성 시장 미션 — 병원 선택 루트)
// ═══════════════════════════════════════

export const MARS_SCENARIO_CHAIN: ScenarioChain = {
  missionId: "mission-mars-mayor",
  initialChoiceId: "hospital-first",
  rounds: [
    {
      id: "round-1",
      consequence: {
        narrative:
          "병원에 물이 도착했어. 의사들이 안도의 한숨을 내쉬었어.\n\n그런데 농장 팀장이 주민 30명을 데리고 시청 앞에 모였어. \"우리 작물이 죽어가고 있다\"는 피켓을 들고.",
        newDilemma: "시장으로서 어떻게 대응할래?",
      },
      emotionOptions: [
        { id: "e1-firm", emoji: "😤", label: "단호하게", valueTags: ["independence", "logic"] },
        { id: "e1-sorry", emoji: "😰", label: "미안하게", valueTags: ["empathy", "emotion"] },
        { id: "e1-calm", emoji: "🤔", label: "차분하게", valueTags: ["logic", "community"] },
      ],
      methodOptions: [
        { id: "m1-direct", emoji: "📢", label: "직접 나가서", valueTags: ["adventure", "independence"] },
        { id: "m1-message", emoji: "📝", label: "메시지로", valueTags: ["safety", "logic"] },
        { id: "m1-private", emoji: "🤝", label: "대표만 만나서", valueTags: ["empathy", "community"] },
      ],
      thinkingTools: [
        {
          type: "broaden",
          label: "만약에...",
          emoji: "🔭",
          card: {
            narrative:
              "만약 농장에 먼저 물을 보냈다면?\n→ 환자 3명의 상태가 악화됐을 거야. 하지만 다음 달 식량은 안정적이었겠지.",
          },
        },
        {
          type: "reframe",
          label: "그 사람은...",
          emoji: "🔄",
          card: {
            narrative:
              "농장 팀장 민호의 시선으로 보면:\n\"내가 1년 동안 키운 작물이야. 이걸로 도시 전체가 먹고 사는데... 왜 내 말은 아무도 안 들어주지?\"",
          },
        },
        {
          type: "subvert",
          label: "전혀 다르게",
          emoji: "🌀",
          card: {
            narrative:
              "갑자기 지하수 탐지 드론이 새로운 수원을 발견했다는 보고가 들어왔어! 하지만 그곳은 도시 경계 밖 위험지대야. 탐사팀을 보낼까?",
          },
        },
      ],
    },
    {
      id: "round-2",
      consequence: {
        narrative:
          "농장 팀장과 만났어. 처음엔 화가 나 있었지만, 네가 이야기를 들어주니까 조금 누그러졌어.\n\n그런데 팀장이 물었어:\n\"그러면 2주 뒤에는 농장이 우선인가요?\"",
        newDilemma: "약속을 할 수 있을까?",
      },
      emotionOptions: [
        { id: "e2-promise", emoji: "🤝", label: "약속한다", valueTags: ["community", "empathy"] },
        { id: "e2-honest", emoji: "🤷", label: "모르겠다고 솔직하게", valueTags: ["independence", "logic"] },
        { id: "e2-idea", emoji: "💡", label: "다른 방법을 제안", valueTags: ["creativity", "adventure"] },
      ],
      methodOptions: [
        { id: "m2-eye", emoji: "👀", label: "눈을 보면서", valueTags: ["empathy", "emotion"] },
        { id: "m2-data", emoji: "📊", label: "데이터를 보여주며", valueTags: ["logic", "efficiency"] },
        { id: "m2-together", emoji: "🙌", label: "같이 해결하자며", valueTags: ["community", "fairness"] },
      ],
      thinkingTools: [
        {
          type: "broaden",
          label: "만약에...",
          emoji: "🔭",
          card: {
            narrative:
              "만약 약속을 했는데 못 지키면?\n→ 시장에 대한 신뢰가 완전히 무너져. 다음번에는 아무도 네 말을 안 믿게 될 수도 있어.",
          },
        },
        {
          type: "reframe",
          label: "그 사람은...",
          emoji: "🔄",
          card: {
            narrative:
              "병원 원장의 시선으로 보면:\n\"시장이 우리한테 물을 보내준 건 고맙지만... 농장 사람들의 반발이 걱정돼. 결국 우리한테도 불똥이 튀지 않을까?\"",
          },
        },
        {
          type: "subvert",
          label: "전혀 다르게",
          emoji: "🌀",
          card: {
            narrative:
              "농장 팀장이 갑자기 제안했어: \"병원 옥상에 수경재배 시설을 만들면 어때요? 물도 아끼고, 환자들 음식도 해결되고.\" 예상 못한 아이디어야!",
          },
        },
      ],
    },
    {
      id: "round-3",
      consequence: {
        narrative:
          "네 제안대로 주민 회의가 열렸어. 모두가 모인 자리에서 물 배분 계획을 함께 논의하기로 했어.\n\n그런데 회의 중에 한 주민이 손을 들었어:\n\"시장님, 솔직히 말해주세요. 우리가 여기서 버틸 수 있는 건 얼마나 되나요?\"",
        newDilemma: "모두 앞에서 솔직할 수 있을까?",
      },
      emotionOptions: [
        { id: "e3-truth", emoji: "💪", label: "솔직하게 말한다", valueTags: ["independence", "community"] },
        { id: "e3-hope", emoji: "🌟", label: "희망적으로 말한다", valueTags: ["empathy", "emotion"] },
        { id: "e3-plan", emoji: "📋", label: "계획을 보여준다", valueTags: ["logic", "efficiency"] },
      ],
      methodOptions: [
        { id: "m3-stand", emoji: "🧍", label: "일어서서 정면으로", valueTags: ["independence", "adventure"] },
        { id: "m3-sit", emoji: "🪑", label: "앉은 채로 편하게", valueTags: ["empathy", "community"] },
        { id: "m3-walk", emoji: "🚶", label: "다가가서 가까이", valueTags: ["empathy", "emotion"] },
      ],
      thinkingTools: [
        {
          type: "broaden",
          label: "만약에...",
          emoji: "🔭",
          card: {
            narrative:
              "만약 거짓말을 했다가 들키면?\n→ \"시장이 우리한테 거짓말을 했다\"는 소문이 퍼져. 도시의 유일한 리더에 대한 신뢰가 사라져.",
          },
        },
        {
          type: "reframe",
          label: "그 사람은...",
          emoji: "🔄",
          card: {
            narrative:
              "질문한 주민 지영의 시선:\n\"나는 그냥 알고 싶은 거야. 좋든 나쁘든. 불확실한 게 제일 무서워. 솔직하면 같이 버틸 수 있어.\"",
          },
        },
        {
          type: "subvert",
          label: "전혀 다르게",
          emoji: "🌀",
          card: {
            narrative:
              "이때 통신 시스템에서 지구의 신호가 잡혔어! 보급선이 3주 뒤 도착한다는 메시지야. 하지만 100% 확실하지는 않아.",
          },
        },
      ],
      closingPrompt: "오늘 가장 어려웠던 순간은 언제였어?",
    },
  ],
  epilogue: {
    title: "네가 만든 화성 도시의 하루",
    scenes: [
      {
        text: "병원에 물이 먼저 도착했어. 탈수 증세를 보이던 환자 3명이 치료를 받을 수 있었어. 의료팀은 \"하루만 더 늦었으면 위험했다\"고 했어.",
        mood: "positive",
      },
      {
        text: "농장 팀장은 처음엔 화가 났지만, 네가 직접 만나서 이야기를 들어준 뒤 조금 누그러졌어. \"다음엔 우리 먼저\"라는 약속 대신, 함께 방법을 찾자는 제안에 고개를 끄덕였어.",
        mood: "bittersweet",
      },
      {
        text: "주민 회의에서는 처음으로 모든 구역 대표가 한자리에 모였어. 네가 솔직하게 상황을 설명하자, 주민들이 스스로 물 절약 아이디어를 내기 시작했어.",
        mood: "hopeful",
      },
      {
        text: "아레스의 첫날이 저물고 있어. 돔 밖으로 붉은 석양이 지고, 돔 안에서는 내일을 준비하는 사람들의 불빛이 하나둘 켜지고 있어. 완벽하진 않았지만, 아무도 포기하지 않은 하루였어.",
        mood: "hopeful",
      },
    ],
    closingLine: "이건 네가 만든 이야기야. 다른 선택을 했다면 완전히 다른 하루가 됐을 거야.",
  },
  finalCard: {
    narrative:
      "시장으로서의 첫날이 끝났어.\n\n네가 내린 결정들이 어떤 의미였는지, 거울에서 함께 돌아보자.",
  },
};

export function getScenarioChain(missionId: string): ScenarioChain | undefined {
  if (missionId === "mission-mars-mayor") return MARS_SCENARIO_CHAIN;
  return undefined;
}

// ═══════════════════════════════════════
// SESSION DATA (서연이의 Day 1)
// ═══════════════════════════════════════

export const SEOYEON_SESSION: MissionSession = {
  id: "session-seoyeon-day1",
  missionId: "mission-mars-mayor",
  userId: "user-seoyeon",
  startedAt: "2024-03-22T16:30:00Z",
  completedAt: "2024-03-22T16:38:00Z",
  choicesMade: [
    {
      choiceId: "hospital-first",
      timestamp: "2024-03-22T16:32:00Z",
      reflectionNote:
        "당장 아픈 사람이 있는데 나중 일을 먼저 생각하는 건 이상해서",
    },
  ],
  conversation: [
    {
      role: "assistant",
      content:
        "시장님, 병원을 선택하셨군요. 저도 그 마음은 이해해요. 근데 농장 쪽 사람들한테는 어떻게 설명할 건가요? 벌써 불만이 나오고 있거든요.",
      timestamp: "2024-03-22T16:32:30Z",
    },
    {
      role: "user",
      content: "아픈 사람이 먼저라고 솔직하게 말할게",
      timestamp: "2024-03-22T16:33:15Z",
    },
    {
      role: "assistant",
      content:
        '솔직한 거 좋아요. 근데 농장 팀장이 이렇게 물어보면 어떡하죠? "3주 뒤에 식량이 부족해지면 그때는 어떻게 할 건가요?"',
      timestamp: "2024-03-22T16:33:30Z",
    },
    {
      role: "user",
      content:
        "그때까지 지구에서 보급품이 오지 않을까? 일단 지금 급한 거부터 해결하고 싶어",
      timestamp: "2024-03-22T16:34:20Z",
    },
    {
      role: "assistant",
      content:
        "보급품에 기대를 거는 거구나. 만약 보급품이 늦어지면 어떡할지도 생각해봐야 할 수도 있어. 시장으로서 최악의 상황도 준비해야 하니까. 혹시 두 번째 계획은 있어?",
      timestamp: "2024-03-22T16:34:35Z",
    },
    {
      role: "user",
      content:
        "음... 그러면 주민들한테 물 아끼는 방법을 같이 찾자고 할 수 있을 것 같아",
      timestamp: "2024-03-22T16:35:30Z",
    },
    {
      role: "assistant",
      content:
        "오 그거 좋은 생각이다! 혼자 결정하는 게 아니라 주민들이랑 같이 해결하겠다는 거네. 시장님, 오늘 정말 어려운 결정을 했어. 마지막으로 하나만 — 오늘 이 결정에서 가장 중요했던 건 뭐였어?",
      timestamp: "2024-03-22T16:35:45Z",
    },
    {
      role: "user",
      content: "지금 아픈 사람을 그냥 두면 안 된다는 거",
      timestamp: "2024-03-22T16:36:30Z",
    },
  ],
  toolsUsed: [],
  mirror: {
    observations: [
      {
        text: '지금 눈앞의 사람을 먼저 생각했어. "당장 아픈 사람이 있는데"라고 했을 때, 너한테는 지금 이 순간이 가장 중요한 거였어.',
        valueTags: ["empathy", "safety"],
        tone: "neutral",
      },
      {
        text: "결정을 끝까지 밀고 나갔어. 반대 의견을 들었는데도 처음 생각을 바꾸지 않았어. 자기 기준이 분명한 편이야.",
        valueTags: ["independence"],
        tone: "encouraging",
      },
    ],
    patternNote: null,
    nextSuggestion: {
      reason: "내일은 다른 사람의 시각에서 생각해보는 미션이 기다리고 있어",
      categoryHint: "perspective",
    },
  },
};

// ═══════════════════════════════════════
// PAST SESSIONS (서연이의 히스토리)
// ═══════════════════════════════════════

export interface PastSession {
  missionId: string;
  title: string;
  category: string;
  completedAt: string;
  choiceSummary: string;
}

export const PAST_SESSIONS: PastSession[] = [
  {
    missionId: "mission-animal-rescue",
    title: "동물구조센터 브랜딩 디자이너",
    category: "world",
    completedAt: "2024-03-27",
    choiceSummary: "진지한 톤의 포스터 선택",
  },
  {
    missionId: "mission-fairness",
    title: "공정한 나눔 vs 효율적 분배",
    category: "value",
    completedAt: "2024-03-26",
    choiceSummary: "모두에게 조금씩 나눔",
  },
  {
    missionId: "mission-three-perspectives",
    title: "같은 교실, 세 개의 시선",
    category: "perspective",
    completedAt: "2024-03-25",
    choiceSummary: "자고 있는 학생의 시선에 가장 공감",
  },
  {
    missionId: "mission-hidden-design",
    title: "우리 집의 숨은 디자인",
    category: "real",
    completedAt: "2024-03-24",
    choiceSummary: "리모컨을 가장 잘 디자인된 물건으로 선택",
  },
  {
    missionId: "mission-fun-vs-safety",
    title: "재미 vs 안전",
    category: "value",
    completedAt: "2024-03-23",
    choiceSummary: "안전을 선택하되, 스릴을 유지할 방법 제안",
  },
  {
    missionId: "mission-one-line",
    title: "한 줄로 설득하기",
    category: "synthesis",
    completedAt: "2024-03-22",
    choiceSummary: '"거기 가면 시간이 어떻게 가는지 모를 거야"',
  },
];

// ═══════════════════════════════════════
// USER PROFILE (서연, 7일 후)
// ═══════════════════════════════════════

export const SEOYEON_PROFILE: UserProfile = {
  id: "user-seoyeon",
  name: "서연",
  age: 12,
  createdAt: "2024-03-22",
  stats: {
    totalMissions: 7,
    currentStreak: 7,
    longestStreak: 7,
    totalMinutes: 52,
  },
  discoveries: {
    worldPreference: {
      label: "끌리는 세계",
      summary: "우주보다 사람들이 사는 마을 이야기에 더 오래 머물러요",
      dataPoints: 7,
      confidence: "medium",
      icon: "🌍",
    },
    valueOrientation: {
      label: "중요하게 여기는 것",
      summary: "효율보다 공정함을 고르는 경우가 많아요",
      dataPoints: 5,
      confidence: "medium",
      icon: "⚖️",
    },
    roleEnergy: {
      label: "에너지가 생기는 역할",
      summary: "만드는 역할보다 조율하는 역할에서 몰입도가 높아요",
      dataPoints: 4,
      confidence: "low",
      icon: "⚡",
    },
    decisionStyle: {
      label: "결정하는 방식",
      summary: "처음 직감으로 고른 뒤 끝까지 밀고 나가는 편이에요",
      dataPoints: 7,
      confidence: "medium",
      icon: "🎯",
    },
    tonePreference: {
      label: "선호하는 분위기",
      summary: "진지한 톤을 더 자주 택해요. 위트보다는 깊이.",
      dataPoints: 3,
      confidence: "low",
      icon: "🎭",
    },
  },
  interestMap: [
    { category: "디자인 & 창작", score: 82, trend: "up" },
    { category: "리더십 & 관리", score: 70, trend: "stable" },
    { category: "감정 & 관계", score: 58, trend: "up" },
    { category: "과학 & 탐구", score: 45, trend: "exploring" },
  ],
};

// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}

export function getTodayMission(): Mission {
  return MISSIONS[0]; // 화성 첫 도시의 시장
}
