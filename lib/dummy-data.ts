import type { Mission } from "./types";

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
        "다른 돔 도시들이 이 소식을 들으면 어떤 요구를 할지",
        "3주 뒤에 상황이 악화되면 다음 결정은 뭘 할 건지",
        "지구에서 보급품이 올 때까지 버틸 계획",
        "이 위기가 끝나도 같은 구조적 문제가 반복되지 않을지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "물을 아끼는 기술을 개발하는 건 어떨까?",
            "주민들이 직접 투표하게 하는 방법도 있지 않을까?",
            "다른 돔 도시와 물을 교환하는 건?",
            "다른 도시에 도움을 요청하는 건?",
            "물 문제가 해결된 뒤에도 이 시스템을 유지할까?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "만약 네가 농장에서 일하는 사람이라면 어떻게 느꼈을까?",
            "병원에 입원해 있는 사람의 가족이라면?",
            "다른 돔 도시의 시장이 이 소식을 듣는다면?",
            "10년 뒤 역사책에는 이 결정을 어떻게 쓸까?",
            "만약 이 도시의 아이가 이 이야기를 듣는다면?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "물 대신 다른 걸로 해결할 수는 없을까?",
            "아예 돔을 버리고 새로운 곳으로 이동하면?",
            "주민들이 시장을 뽑아내겠다고 하면?",
            "AI가 시장을 대신하겠다고 하면 맡길 거야?",
            "화성이 아니라 지구에서 같은 일이 벌어진다면?",
          ],
        },
      ],
    },
    tags: ["우주", "리더십", "자원관리", "위기대응", "모험"],
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
        "경쟁 센터가 더 자극적인 캠페인을 시작하면",
        "동물의 입장에서 이 포스터를 본다면 어떨지",
        "이 캠페인이 성공했을 때 센터가 감당할 수 있는지",
        "동물구조라는 시스템 자체를 바꿔야 하는 건 아닌지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "포스터 대신 참여형 캠페인은 어떨까?",
            "동물이 직접 말하는 1인칭 시점은?",
            "SNS에서 바이럴 되려면 어떤 요소가 필요할까?",
            "입양 전/후 사진을 나란히 놓는 건?",
            "포스터 하나가 아니라 시리즈로 만든다면?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "만약 동물의 입장에서 본다면?",
            "5살 아이에게 보여줄 포스터라면?",
            "후원금을 내는 기업 대표의 시선이라면?",
            "동물을 싫어하는 사람도 멈추게 하려면?",
            "10년 뒤 이 센터의 역사를 쓰는 사람이라면?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "동물이 사람을 구조하는 반전 포스터?",
            "100년 뒤 동물이 멸종 위기인 세상의 포스터?",
            "포스터를 아예 안 만들고 다른 방법으로 알린다면?",
            "동물구조센터가 아니라 '인간구조센터'라면?",
            "사람이 아니라 다른 동물에게 보여주는 포스터라면?",
          ],
        },
      ],
    },
    tags: ["디자인", "브랜딩", "소통", "가치전달", "창작", "공동체"],
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
        "다른 학교에서는 이 문제를 어떻게 해결하는지",
        "학부모가 항의를 하면 어떻게 대응할 건지",
        "규칙이 공정한 건지, 결과가 공정한 건지",
        "공정함이란 결국 누구의 기준인지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "내일은 이런 일이 안 일어나게 하려면?",
            "아이들한테 직접 물어보는 건 어떨까?",
            "다른 학교의 급식 시스템을 참고한다면?",
            "인기 메뉴를 더 만들 수는 없을까?",
            "급식이 아니라 다른 방식으로 식사를 제공하면?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "줄 맨 뒤에 선 아이의 기분은?",
            "요리사의 입장에서는?",
            "학교 교장이 이 상황을 본다면?",
            "10년 뒤 이 아이들이 기억할 건 뭘까?",
            "이 규칙을 만든 사람의 의도는 뭐였을까?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "아예 급식 순서를 없애면?",
            "아이들이 직접 만들어 먹는다면?",
            "인기 메뉴를 비밀로 하고 모두 같은 걸 먹으면?",
            "인기 메뉴 대신 새로운 메뉴를 만들면?",
            "아이들이 급식 규칙을 직접 정하는 회의를 열면?",
          ],
        },
      ],
    },
    tags: ["공정성", "효율", "공동체", "윤리", "책임"],
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
        "이 상황에서 누가 먼저 말을 걸어야 할까",
        "비슷한 일이 어제도 있었다면 어떻게 달라질까",
        "네가 그 자리에 있었다면 어떻게 했을까",
        "학교라는 시스템이 이런 상황을 만드는 건 아닌지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "교장 선생님이 이 장면을 본다면?",
            "자고 있는 아이의 부모님은 어떤 마음일까?",
            "학교 상담실에 이런 이야기가 얼마나 올까?",
            "다른 반 친구가 이 얘기를 들으면?",
            "이 학교에 이런 아이가 한 명만 있을까?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "만약 이게 드라마 한 장면이라면 제목은?",
            "1년 뒤에 이 순간을 돌아보면 어떤 느낌일까?",
            "자고 있는 아이가 깨어나서 이 대화를 듣는다면?",
            "이 세 사람이 서로의 마음을 알게 되면?",
            "만약 이 학교에 '마음 알림 시스템'이 있다면?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "만약 교실이 아니라 우주선 안이라면?",
            "선생님이 학생이고, 학생이 선생님이라면?",
            "세 사람이 서로 역할을 바꿔 하루를 살면?",
            "이 장면을 동물의 세계로 바꾸면?",
            "이 학교에 '감정이 보이는 안경'이 있다면?",
          ],
        },
      ],
    },
    tags: ["공감", "다중관점", "이해", "감정", "환경"],
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
        "이 물건을 쓰는 다른 가족은 어떻게 느낄까",
        "이 물건이 안 팔려서 단종된다면 뭘 바꿔야 할까",
        "10년 뒤에는 이 물건이 어떻게 변해 있을까",
        "좋은 디자인이란 결국 누구를 위한 것인지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "다른 나라에서는 이 물건이 다르게 생겼을까?",
            "이 물건이 100년 전에는 어떤 모습이었을까?",
            "같은 문제를 해결하는 완전히 다른 물건은?",
            "이 물건이 없으면 생활이 어떻게 달라질까?",
            "AI가 이 물건을 설계한다면 어떻게 만들까?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "시각장애인이 이 물건을 쓴다면?",
            "어린아이가 처음 이 물건을 보면?",
            "이 물건을 만든 디자이너에게 인터뷰한다면?",
            "이 물건이 생명이 있다면 뭐라고 할까?",
            "100년 뒤 박물관에 이 물건이 전시된다면?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "이 물건을 완전히 반대로 디자인하면?",
            "먹을 수 있는 버전으로 만든다면?",
            "이 물건의 단점이 오히려 장점이 되는 상황은?",
            "우주에서 쓸 수 있게 바꾼다면?",
            "이 물건을 쓰지 않고 문제를 해결하는 방법은?",
          ],
        },
      ],
    },
    tags: ["관찰력", "디자인사고", "일상", "분석", "문제해결"],
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
        "뉴스에 이 사건이 보도되면 어떻게 될지",
        "경쟁 놀이공원이 이 소식을 알면",
        "직원들 사이에서 의견이 갈린다면",
        "안전과 재미의 균형은 누가 정하는 건지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "전혀 새로운 기구를 만드는 건 어떨까?",
            "안전 교육을 재미있게 하는 방법은?",
            "놀이공원이 아니라 체험형 테마파크로 전환하면?",
            "다른 놀이공원은 이런 문제를 어떻게 해결했을까?",
            "안전 기준 자체를 놀이공원이 새로 만들 수는 없을까?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "네가 놀러 온 아이라면 어떤 게 좋을까?",
            "부모님 입장에서는?",
            "이 기구를 설계한 엔지니어의 마음은?",
            "사고가 난 뒤에 후회하는 미래의 너라면?",
            "안전 검사관이 이 놀이공원을 본다면?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "무서운 게 아니라 신비로운 기구로 바꾸면?",
            "가상현실로 스릴을 더하는 건?",
            "아이들이 직접 기구를 설계하게 하면?",
            "안전한 게 오히려 더 무서울 수 있지 않을까?",
            "놀이공원 전체를 안전 테마로 리브랜딩하면?",
          ],
        },
      ],
    },
    tags: ["안전", "재미", "책임", "트레이드오프", "윤리"],
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
        "이 카피가 실제 광고판에 걸렸을 때 사람들의 반응은",
        "경쟁 브랜드가 더 강한 문장으로 응수한다면",
        "이 장소를 한 번도 못 가본 사람이 가장 궁금해할 건",
        "좋은 문장이란 결국 무엇인지",
      ],
      expansionTools: [
        {
          type: "broaden",
          label: "더 넓혀보기",
          icon: "🔭",
          prompts: [
            "같은 장소를 전혀 다른 감정으로 표현하면?",
            "유명한 광고 카피처럼 써보면?",
            "문장이 아니라 질문으로 바꾸면?",
            "5글자 이내로 줄여보면?",
            "시리즈 광고로 만든다면 다음 문장은?",
          ],
        },
        {
          type: "reframe",
          label: "다른 시각으로 보기",
          icon: "🔄",
          prompts: [
            "할머니에게 설명한다면?",
            "외국인에게 설명한다면?",
            "이 장소를 싫어하는 사람에게 보여준다면?",
            "그 장소가 사라진 미래에서 회상한다면?",
            "AI에게 이 장소를 설명해달라고 하면 뭐라고 할까?",
          ],
        },
        {
          type: "subvert",
          label: "이상하게 바꾸기",
          icon: "🌀",
          prompts: [
            "일부러 나쁘게 묘사하면 오히려 끌리지 않을까?",
            "소리나 냄새로만 표현한다면?",
            "문장이 아니라 침묵으로 표현한다면?",
            "그 장소가 사람이라면 자기소개를 뭐라고 할까?",
            "이 문장을 읽고 절대 가고 싶지 않게 만든다면?",
          ],
        },
      ],
    },
    tags: ["표현력", "설득", "카피라이팅", "언어", "창작"],
    estimatedMinutes: 6,
    ageRange: [10, 14],
  },
];

// ═══════════════════════════════════════
// HARDCODED DEEP-DIVES (7개, 각 미션에 연결)
// ═══════════════════════════════════════

export interface HardcodedDeepDiveQuestion {
  prompt: string;
  options: { id: string; label: string }[];
  followUpPrompt?: string;
}

export interface HardcodedDeepDive {
  missionId: string;
  title: string;
  realWorldCase: {
    headline: string;
    context: string;
    keyQuestion: string;
    source?: string;
  };
  stepTemplates: {
    caseIntro: string;
    questions: HardcodedDeepDiveQuestion[];
    opinionTemplate: string;
    opinionScaffolds: string[];
  };
}

export const HARDCODED_DEEP_DIVES: HardcodedDeepDive[] = [
  // DD1: mission-mars-mayor → 케냐 물 부족
  {
    missionId: "mission-mars-mayor",
    title: "실제 가뭄 지역의 자원 배분",
    realWorldCase: {
      headline: "2024년 케냐 투르카나 지역 물 부족 위기",
      context: "케냐 북부 투르카나 지역에서 3년 연속 가뭄이 이어졌어. 물이 부족해지자, 지역 정부는 농업용수와 식수 중 어디에 먼저 보낼지 결정해야 했어. 농업을 살리면 내년 식량이 확보되지만, 당장 마실 물이 없는 가정이 수천 곳이었어.",
      keyQuestion: "네가 어제 화성에서 내린 결정과 이 실제 상황은 뭐가 같고 뭐가 달라?",
      source: "UNICEF Kenya, 2024",
    },
    stepTemplates: {
      caseIntro: "어제 화성 아레스에서 물 배분을 결정했잖아? 실제로 지구에서도 비슷한 일이 일어나고 있어.",
      questions: [
        {
          prompt: "화성과 케냐, 두 상황에서 가장 비슷한 점은 뭘까?",
          options: [
            { id: "q1-resource", label: "자원이 부족하다는 점" },
            { id: "q1-leader", label: "누군가가 결정해야 한다는 점" },
            { id: "q1-anxiety", label: "사람들이 불안해한다는 점" },
            { id: "q1-time", label: "시간이 촉박하다는 점" },
          ],
        },
        {
          prompt: "가장 다른 점은 뭘까?",
          options: [
            { id: "q2-real", label: "케냐는 실제 사람들의 이야기라는 점" },
            { id: "q2-scale", label: "케냐는 훨씬 많은 사람이 영향받는 점" },
            { id: "q2-help", label: "지구에는 다른 나라가 도울 수 있다는 점" },
            { id: "q2-result", label: "실제로 결과가 남는다는 점" },
          ],
        },
        {
          prompt: "네가 케냐 지역 관리자라면 어떻게 했을까?",
          options: [],
          followUpPrompt: "자유롭게 적어봐",
        },
      ],
      opinionTemplate: "자원이 부족할 때 가장 중요한 건 ___라고 생각해. 왜냐하면 ___",
      opinionScaffolds: [
        "모두에게 공평하게 나누는 것",
        "가장 급한 곳에 먼저 보내는 것",
        "함께 해결 방법을 찾는 것",
        "전문가의 판단을 따르는 것",
      ],
    },
  },

  // DD2: mission-animal-rescue → 유니세프 캠페인
  {
    missionId: "mission-animal-rescue",
    title: "실제 NGO의 관심 끌기 전략",
    realWorldCase: {
      headline: "유니세프의 '좋아요 말고 백신을' 캠페인",
      context: "유니세프 스웨덴 지부가 SNS에서 '좋아요'만 누르고 후원하지 않는 사람들을 향해 도발적인 캠페인을 만들었어. '좋아요가 생명을 구하지 않습니다'라는 메시지로 전 세계적인 반향을 일으켰어. 이 캠페인 후 실제 후원금이 크게 늘었어.",
      keyQuestion: "어제 네가 동물구조센터에서 선택한 접근 방식과 비교하면 어떤 차이가 있어?",
      source: "UNICEF Sweden, 2013",
    },
    stepTemplates: {
      caseIntro: "어제 동물구조센터에서 사람들의 관심을 끄는 방법을 고민했잖아? 실제로 비영리단체들은 이 문제를 매일 고민하고 있어.",
      questions: [
        {
          prompt: "유니세프 캠페인이 성공한 이유는 뭘까?",
          options: [
            { id: "q1-shock", label: "사람들을 놀라게 했으니까" },
            { id: "q1-guilty", label: "양심을 자극했으니까" },
            { id: "q1-honest", label: "솔직한 메시지였으니까" },
            { id: "q1-simple", label: "한 문장으로 핵심을 찔렀으니까" },
          ],
        },
        {
          prompt: "귀여운 동물 사진으로 관심을 끄는 것과, 도발적인 메시지로 끄는 것. 어떤 게 더 효과적일까?",
          options: [
            { id: "q2-cute", label: "귀여운 사진이 더 많은 사람을 끌어" },
            { id: "q2-provoke", label: "도발적인 메시지가 더 오래 기억에 남아" },
            { id: "q2-both", label: "상황에 따라 다를 것 같아" },
            { id: "q2-neither", label: "진짜 이야기를 들려주는 게 제일 나아" },
          ],
        },
      ],
      opinionTemplate: "사람들의 관심을 끌 때 가장 중요한 건 ___라고 생각해. 왜냐하면 ___",
      opinionScaffolds: [
        "진짜 문제를 솔직하게 보여주는 것",
        "감정을 움직이는 이미지를 쓰는 것",
        "한 문장으로 핵심을 전달하는 것",
        "행동으로 연결되는 메시지를 만드는 것",
      ],
    },
  },

  // DD3: mission-fairness → 핀란드 급식
  {
    missionId: "mission-fairness",
    title: "모든 학생에게 같은 급식을?",
    realWorldCase: {
      headline: "핀란드의 무료 학교 급식 시스템",
      context: "핀란드에서는 모든 학생에게 무료 급식을 제공해. 메뉴 선택권이 없는 대신 모두가 똑같이 먹어. 한국에서는 선택급식이 늘고 있지만, 인기 메뉴는 항상 부족하고 불만이 나와.",
      keyQuestion: "모두에게 똑같이 주는 것과, 선택할 수 있게 하는 것. 어느 쪽이 더 공정할까?",
      source: "Finnish National Agency for Education",
    },
    stepTemplates: {
      caseIntro: "어제 급식실에서 '공정한 나눔'을 고민했잖아? 실제로 여러 나라에서 이 문제를 다르게 풀고 있어.",
      questions: [
        {
          prompt: "핀란드식(모두 같은 급식)과 한국식(선택급식). 각각의 장점은?",
          options: [
            { id: "q1-equal", label: "같은 급식은 비교할 필요가 없어서 편해" },
            { id: "q1-choice", label: "선택급식은 내가 원하는 걸 먹을 수 있어" },
            { id: "q1-fair", label: "같은 급식이 더 공평한 것 같아" },
            { id: "q1-happy", label: "선택할 수 있으면 더 행복해" },
          ],
        },
        {
          prompt: "만약 네 학교에서 새 급식 방식을 정한다면?",
          options: [
            { id: "q2-same", label: "모두 같은 걸 먹자" },
            { id: "q2-choose", label: "각자 고르게 하자" },
            { id: "q2-mix", label: "기본 메뉴 + 추가 선택" },
            { id: "q2-vote", label: "학생 투표로 정하자" },
          ],
        },
      ],
      opinionTemplate: "공정한 나눔에서 가장 중요한 건 ___라고 생각해. 왜냐하면 ___",
      opinionScaffolds: [
        "모두가 똑같이 받는 것",
        "각자 필요한 만큼 받는 것",
        "스스로 선택할 수 있는 것",
        "과정이 투명한 것",
      ],
    },
  },

  // DD4: mission-three-perspectives → 학교 상담실
  {
    missionId: "mission-three-perspectives",
    title: "실제 학교 상담실에서 일어나는 일",
    realWorldCase: {
      headline: "서울 중학교 Wee 클래스 상담 이야기",
      context: "서울의 한 중학교 상담실에는 한 달에 평균 47건의 상담 요청이 들어와. 가장 많은 이유는 '친구 관계'야. 하지만 상담 선생님은 이야기를 들어보면, 겉으로 보이는 것과 속사정이 항상 달라.",
      keyQuestion: "같은 상황이라도 사람마다 느끼는 게 다르다는 걸, 어제 경험으로 어떻게 느꼈어?",
      source: "서울시교육청 Wee 프로젝트 현황, 2023",
    },
    stepTemplates: {
      caseIntro: "어제 교실에서 세 사람의 시선으로 같은 장면을 봤잖아? 실제 학교에서도 매일 이런 일이 일어나고 있어.",
      questions: [
        {
          prompt: "상담 선생님이 '겉으로 보이는 것과 속사정이 다르다'고 했어. 왜 그럴까?",
          options: [
            { id: "q1-hide", label: "사람들은 속마음을 잘 안 보여주니까" },
            { id: "q1-different", label: "같은 일도 사람마다 다르게 느끼니까" },
            { id: "q1-complex", label: "문제가 보이는 것보다 복잡하니까" },
            { id: "q1-afraid", label: "진짜 이유를 말하기 무서우니까" },
          ],
        },
        {
          prompt: "친구가 기분이 안 좋아 보일 때, 가장 먼저 할 수 있는 건?",
          options: [
            { id: "q2-ask", label: "괜찮냐고 물어보기" },
            { id: "q2-wait", label: "말할 때까지 옆에 있어주기" },
            { id: "q2-space", label: "혼자 있고 싶을 수 있으니 기다리기" },
            { id: "q2-share", label: "내 이야기를 먼저 해서 편하게 해주기" },
          ],
        },
      ],
      opinionTemplate: "다른 사람을 이해하려면 가장 중요한 건 ___라고 생각해. 왜냐하면 ___",
      opinionScaffolds: [
        "먼저 들어보는 것",
        "내 기준으로 판단하지 않는 것",
        "그 사람 입장에서 생각해보는 것",
        "겉모습만으로 결론 내리지 않는 것",
      ],
    },
  },

  // DD5: mission-hidden-design → 지하철 스크린도어
  {
    missionId: "mission-hidden-design",
    title: "디자인이 사람을 바꾼 순간",
    realWorldCase: {
      headline: "서울 지하철 스크린도어, 사고 97% 감소",
      context: "서울 지하철에 스크린도어가 설치된 후 선로 추락 사고가 97% 줄었어. '조심하세요'라고 말한 게 아니라, 환경 자체를 바꿔서 행동을 바꾼 거야. 이런 걸 '넛지 디자인'이라고 해.",
      keyQuestion: "'말'로 바꾸는 것과 '디자인'으로 바꾸는 것, 어느 쪽이 더 효과적일까?",
      source: "서울교통공사, 2023",
    },
    stepTemplates: {
      caseIntro: "어제 집에서 숨은 디자인을 찾아봤잖아? 실제로 디자인 하나가 수만 명의 행동을 바꾸기도 해.",
      questions: [
        {
          prompt: "스크린도어가 사고를 97% 줄인 이유는?",
          options: [
            { id: "q1-block", label: "물리적으로 위험한 곳에 갈 수 없게 했으니까" },
            { id: "q1-think", label: "사람들이 위험을 더 잘 인식하게 됐으니까" },
            { id: "q1-habit", label: "안전한 행동이 자연스럽게 됐으니까" },
            { id: "q1-care", label: "지하철이 승객을 더 신경 쓴다는 느낌이 들어서" },
          ],
        },
        {
          prompt: "학교에서 '복도에서 뛰지 마세요' 대신 디자인으로 해결한다면?",
          options: [
            { id: "q2-floor", label: "바닥에 걷는 속도 가이드라인 그리기" },
            { id: "q2-narrow", label: "복도를 좀 더 좁게 만들기" },
            { id: "q2-art", label: "벽에 천천히 보고 싶은 그림 붙이기" },
            { id: "q2-plant", label: "화분을 복도에 놓아서 자연스럽게 우회하게 하기" },
          ],
        },
      ],
      opinionTemplate: "사람의 행동을 바꾸려면 가장 효과적인 건 ___라고 생각해. 왜냐하면 ___",
      opinionScaffolds: [
        "환경을 바꾸는 것",
        "규칙을 정하는 것",
        "왜 그래야 하는지 설명하는 것",
        "좋은 행동을 쉽게 만드는 것",
      ],
    },
  },

  // DD6: mission-fun-vs-safety → 에버랜드 T-Express
  {
    missionId: "mission-fun-vs-safety",
    title: "실제 놀이공원의 안전 결정",
    realWorldCase: {
      headline: "에버랜드 T-Express 안전 점검 운행 중단",
      context: "에버랜드의 T-Express는 한때 세계에서 가장 가파른 목재 롤러코스터였어. 안전 점검에서 지적사항이 나왔을 때, 한 달간 운행을 중단하고 보수했어. 그 기간 동안 방문객 불만이 쏟아졌지만, 에버랜드는 안전을 선택했어.",
      keyQuestion: "재미를 포기하고 안전을 선택한 에버랜드의 결정을 어떻게 생각해?",
      source: "국토교통부 유기시설 안전관리 현황, 2019",
    },
    stepTemplates: {
      caseIntro: "어제 놀이공원에서 재미와 안전 사이에서 고민했잖아? 실제 놀이공원에서도 이런 선택을 해.",
      questions: [
        {
          prompt: "에버랜드가 한 달이나 운행을 멈춘 건 좋은 결정이었을까?",
          options: [
            { id: "q1-right", label: "당연히 맞아, 사고가 나면 더 큰일이니까" },
            { id: "q1-too-long", label: "맞지만 한 달은 너무 길어" },
            { id: "q1-both", label: "일부만 운행하면서 수리하면 좋았을 텐데" },
            { id: "q1-hard", label: "어려운 결정이지만 안전이 먼저야" },
          ],
        },
        {
          prompt: "놀이기구 설계자가 된다면, 재미와 안전 중 어디에 더 신경 쓸 거야?",
          options: [
            { id: "q2-safety", label: "안전 60%, 재미 40%" },
            { id: "q2-fun", label: "재미 60%, 안전 40%" },
            { id: "q2-equal", label: "정확히 반반" },
            { id: "q2-creative", label: "안전한데 재미있는 새로운 방법을 찾을 거야" },
          ],
        },
      ],
      opinionTemplate: "재미와 안전 사이에서 가장 중요한 건 ___라고 생각해. 왜냐하면 ___",
      opinionScaffolds: [
        "안전이 보장되어야 진짜 재미가 있다는 것",
        "위험을 완전히 없앨 수는 없다는 것",
        "재미를 포기하지 않으면서 안전할 수 있다는 것",
        "결정하는 사람이 책임져야 한다는 것",
      ],
    },
  },

  // DD7: mission-one-line → 나이키 Just Do It
  {
    missionId: "mission-one-line",
    title: "한 줄이 세상을 바꾼 순간",
    realWorldCase: {
      headline: "나이키 'Just Do It' 탄생 비화",
      context: "1988년, 광고인 댄 위든은 사형수의 마지막 말 'Let's do it'에서 영감을 받아 'Just Do It'을 만들었어. 이 세 단어가 운동화 회사를 세계 최대 스포츠 브랜드로 만들었어. 한 줄의 말이 수십억 달러의 가치를 만든 거야.",
      keyQuestion: "왜 이 세 단어가 그렇게 강력했을까?",
      source: "Wieden+Kennedy",
    },
    stepTemplates: {
      caseIntro: "어제 광고 회사에서 한 줄로 사람을 설득하는 연습을 했잖아? 실제로 역사를 바꾼 한 줄들이 있어.",
      questions: [
        {
          prompt: "'Just Do It'이 성공한 가장 큰 이유는?",
          options: [
            { id: "q1-short", label: "짧아서 기억하기 쉬우니까" },
            { id: "q1-feeling", label: "듣는 사람의 감정을 움직이니까" },
            { id: "q1-anyone", label: "누구에게나 적용되니까" },
            { id: "q1-action", label: "행동하게 만드니까" },
          ],
        },
        {
          prompt: "네가 한 줄로 세상을 바꿀 수 있다면, 어떤 메시지를 전할 거야?",
          options: [],
          followUpPrompt: "네만의 한 줄을 적어봐",
        },
      ],
      opinionTemplate: "사람의 마음을 움직이는 말에서 가장 중요한 건 ___라고 생각해. 왜냐하면 ___",
      opinionScaffolds: [
        "짧고 강렬한 것",
        "듣는 사람이 자기 이야기라고 느끼게 하는 것",
        "행동으로 이어지게 하는 것",
        "진심이 담겨 있는 것",
      ],
    },
  },
];

