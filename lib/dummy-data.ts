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
// DEEP-DIVE v2: Hardcoded Expert Conversations
// ═══════════════════════════════════════

import type {
  ExpertPersona,
  DeepDiveRealWorldCase,
  DeepDiveTurnType,
  DeepDiveInteractionType,
} from "./server/types";

export interface HardcodedDeepDiveTurnTemplate {
  type: DeepDiveTurnType;
  interactionType: DeepDiveInteractionType;
  hint: string;
}

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
  interactionOptions: {
    turn0: { id: string; label: string }[];
    turn1: { id: string; label: string; valueTags: string[] }[];
    turn3: { id: string; label: string; valueTags: string[] }[];
  };
}

export const HARDCODED_DEEP_DIVES: HardcodedDeepDive[] = [
  // ─── 1. 화성 도시 시장 → 민재 (유니세프 케냐) ───
  {
    missionId: "mission-mars-mayor",
    expert: {
      name: "민재",
      role: "인도주의 구호 코디네이터",
      organization: "유니세프 케냐",
      personality: "밝고 에너지 넘치는 반말체. '아 진짜?', 'ㅋㅋ 나도 그랬어' 같은 리액션을 잘 함. 현장 이야기를 생생하게 들려주는 스타일.",
      connectionToMission: "화성 도시에서 물 배분 문제를 다뤘듯이, 현실에서도 한정된 자원을 어떻게 나눌지 매일 고민한다.",
      personalAnecdote: "케냐 투르카나 지역에서 우물 하나를 두고 세 마을이 싸우는 걸 중재한 적이 있어. 결국 세 마을이 번갈아 쓰는 시간표를 만들었는데, 그게 지금까지 잘 되고 있거든.",
    },
    realWorldCase: {
      headline: "케냐 투르카나: 세 마을, 하나의 우물",
      context: "케냐 북부 투르카나 지역은 극심한 가뭄으로 물이 부족해요. 유니세프가 설치한 우물 하나를 세 마을 800명이 함께 써야 하는 상황이 벌어졌어요.",
      keyQuestion: "한정된 물을 공정하게 나누려면 어떤 원칙이 필요할까?",
      source: "UNICEF Kenya Field Report 2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + 화성 미션에서의 선택에 대한 공감 리액션. '물 배분 결정 진짜 어려웠지? 나도 비슷한 일을 매일 해 ㅋㅋ'" },
      case: { angle: "투르카나 우물 분쟁의 구체적 에피소드", personalStory: "새벽 4시에 마을 어르신들이 모여서 회의하는 장면" },
      question: { theme: "자원 분배의 공정성", bridgeToMission: "화성에서 물 배분을 결정한 것처럼, 여기서도 누가 먼저인지 정해야 해" },
      insight: { coreMessage: "정답은 없지만, 모두가 납득하는 과정이 있으면 결과도 받아들일 수 있어" },
    },
    interactionOptions: {
      turn0: [
        { id: "excited", label: "와 진짜요? 대박!" },
        { id: "curious", label: "어떻게 그런 일을 하게 됐어요?" },
        { id: "surprised", label: "케냐에서요? 멀다..." },
      ],
      turn1: [
        { id: "fair-share", label: "인구 비례로 나눠야지!", valueTags: ["fairness", "logic"] },
        { id: "need-based", label: "더 급한 곳이 먼저!", valueTags: ["empathy", "safety"] },
        { id: "rotate", label: "돌아가면서 쓰는 게 낫지 않아?", valueTags: ["community", "fairness"] },
      ],
      turn3: [
        { id: "process-matters", label: "과정이 중요한 거구나", valueTags: ["fairness", "community"] },
        { id: "no-perfect", label: "완벽한 답은 없는 거네", valueTags: ["logic", "empathy"] },
        { id: "listen-first", label: "일단 들어보는 게 먼저구나", valueTags: ["empathy", "community"] },
      ],
    },
  },
  // ─── 2. 동물구조센터 → 수진 (유니세프 한국위원회) ───
  {
    missionId: "mission-animal-rescue",
    expert: {
      name: "수진",
      role: "NGO 캠페인 기획자",
      organization: "유니세프 한국위원회",
      personality: "따뜻하고 감성적이면서도 전략적. '음... 그거 되게 좋은 생각인데?' 하면서 진심으로 칭찬함. 이모티콘을 말로 표현하는 스타일 ㅎㅎ",
      connectionToMission: "동물구조센터 브랜딩처럼, 사람들의 마음을 움직이는 캠페인을 만드는 게 내 일이야.",
      personalAnecdote: "아프리카 식수 캠페인에서 '물 한 모금의 무게' 포스터를 만들었는데, SNS에서 100만 뷰를 넘겼어. 비결은 '귀여움'이 아니라 '진짜 이야기'였어.",
    },
    realWorldCase: {
      headline: "'물 한 모금의 무게' 캠페인이 100만 뷰를 넘기까지",
      context: "유니세프 한국위원회의 식수 캠페인은 처음에 아이들의 귀여운 사진을 썼지만 반응이 없었어요. 전략을 바꿔서 현지 아이가 직접 찍은 짧은 영상을 올렸더니 폭발적으로 퍼졌어요.",
      keyQuestion: "사람들의 마음을 진짜로 움직이는 건 무엇일까?",
      source: "유니세프 한국위원회 연례보고서 2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + 동물구조센터 포스터 결정에 대한 공감. '어떤 방향으로 갔어? 나도 매번 고민이야 ㅎㅎ'" },
      case: { angle: "캠페인 전략 실패 → 성공 전환 에피소드", personalStory: "첫 번째 포스터가 완전 망해서 회의실에서 울 뻔한 이야기" },
      question: { theme: "메시지 전달의 진정성", bridgeToMission: "동물구조센터 포스터에서 고민한 것처럼, 진짜 효과적인 메시지는 뭘까" },
      insight: { coreMessage: "가장 강력한 메시지는 만드는 게 아니라 발견하는 거야. 현장에 답이 있어." },
    },
    interactionOptions: {
      turn0: [
        { id: "wow", label: "100만 뷰? 어떻게요?!" },
        { id: "relate", label: "저도 비슷하게 고민했어요" },
        { id: "curious", label: "어떤 캠페인이었어요?" },
      ],
      turn1: [
        { id: "emotion-wins", label: "감정이 이기는 거구나!", valueTags: ["emotion", "empathy"] },
        { id: "real-story", label: "진짜 이야기가 힘이 있네", valueTags: ["logic", "community"] },
        { id: "surprise-element", label: "예상 못한 게 사람을 멈추게 하나봐", valueTags: ["creativity", "adventure"] },
      ],
      turn3: [
        { id: "authenticity", label: "진짜여야 통하는 거구나", valueTags: ["empathy", "community"] },
        { id: "perspective", label: "받는 사람 입장에서 봐야 하는구나", valueTags: ["empathy", "logic"] },
        { id: "try-fail", label: "실패해봐야 알 수 있는 거네", valueTags: ["adventure", "creativity"] },
      ],
    },
  },
  // ─── 3. 급식 공정성 → 하나 (학교 영양사) ───
  {
    missionId: "mission-fairness",
    expert: {
      name: "하나",
      role: "학교 영양사",
      organization: "서울시교육청",
      personality: "편안하고 현실적인 언니 같은 느낌. '아 그거 맞아 맞아~' '근데 진짜 문제는 말이야...' 하면서 이야기 나누는 스타일. 급식실 에피소드를 재밌게 들려줌.",
      connectionToMission: "급식 배분의 공정성 문제를 매일 현장에서 다루고 있어. 누구에게 먼저 줄지, 양을 어떻게 할지.",
      personalAnecdote: "알레르기가 있는 학생 때문에 특별식을 만들었는데, 다른 학생들이 '불공평하다'고 항의한 적이 있어. 공정하다는 게 같은 걸 주는 게 아니라는 걸 그때 배웠어.",
    },
    realWorldCase: {
      headline: "알레르기 특별식 논쟁: 같은 걸 주는 게 공정할까?",
      context: "서울의 한 초등학교에서 심한 알레르기가 있는 학생을 위해 매일 특별식을 만들었어요. 그런데 다른 학생들이 '왜 걔만 다른 걸 먹어?'라고 불만을 제기했어요.",
      keyQuestion: "모두에게 같은 걸 주는 것과 각자 필요한 걸 주는 것, 어느 쪽이 진짜 공정할까?",
      source: "서울시교육청 영양교사 사례집 2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + 미션에서의 공정성 고민에 공감. '공정하다는 게 뭔지, 나도 매일 고민해 ㅎㅎ'" },
      case: { angle: "알레르기 특별식을 둘러싼 학생들의 반응", personalStory: "급식실에서 학생이 울면서 '왜 나만 이거야'라고 했을 때의 경험" },
      question: { theme: "평등 vs 형평성", bridgeToMission: "미션에서 고민한 공정한 배분이 현실에서는 이렇게 나타나" },
      insight: { coreMessage: "공정함은 하나의 답이 아니라 계속 질문하는 과정이야" },
    },
    interactionOptions: {
      turn0: [
        { id: "oh-no", label: "그 학생 진짜 속상했겠다..." },
        { id: "both-right", label: "둘 다 맞는 말인데..." },
        { id: "hard-job", label: "영양사 선생님도 힘들겠다" },
      ],
      turn1: [
        { id: "same-for-all", label: "같은 걸 주는 게 맞지!", valueTags: ["fairness", "logic"] },
        { id: "different-needs", label: "필요한 게 다르니까 다르게!", valueTags: ["empathy", "fairness"] },
        { id: "explain-why", label: "이유를 설명하면 되지 않을까?", valueTags: ["community", "logic"] },
      ],
      turn3: [
        { id: "equity-insight", label: "평등이랑 형평성은 다른 거구나", valueTags: ["fairness", "logic"] },
        { id: "context-matters", label: "상황에 따라 다를 수 있네", valueTags: ["empathy", "logic"] },
        { id: "ask-involved", label: "당사자한테 물어봐야 하는 거구나", valueTags: ["empathy", "community"] },
      ],
    },
  },
  // ─── 4. 세 관점 미션 → 지우 (Wee 센터 상담교사) ───
  {
    missionId: "mission-three-perspectives",
    expert: {
      name: "지우",
      role: "학교 상담 교사",
      organization: "서울 Wee 센터",
      personality: "조용하지만 따뜻한 느낌. 잘 들어주고 '그랬구나...' 하면서 공감을 먼저 함. 질문을 잘 던지는 스타일. '그때 기분이 어땠어?'",
      connectionToMission: "여러 관점에서 상황을 봐야 하는 건 상담에서도 매일 하는 일이야. 가해자, 피해자, 방관자 모두의 이야기를 들어.",
      personalAnecdote: "학교폭력 사건에서 가해 학생을 상담했는데, 그 학생도 집에서 힘든 일이 있었어. 나쁜 행동에는 이유가 있더라고.",
    },
    realWorldCase: {
      headline: "세 명의 이야기: 같은 사건, 세 개의 진실",
      context: "한 중학교에서 따돌림 사건이 발생했어요. Wee 센터에서 피해 학생, 가해 학생, 방관 학생 모두를 만나 이야기를 들었는데, 세 명이 말하는 '사실'이 완전히 달랐어요.",
      keyQuestion: "같은 사건을 다르게 기억하는 사람들의 이야기를 어떻게 이해할 수 있을까?",
      source: "교육부 Wee 센터 상담 사례집 2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + 여러 관점에서 보는 것의 중요성에 공감. '미션에서 관점 전환 해봤지? 실제로도 그게 정말 중요해'" },
      case: { angle: "따돌림 사건에서 세 학생의 완전히 다른 진술", personalStory: "가해 학생의 눈물을 처음 본 순간" },
      question: { theme: "관점 차이와 공감", bridgeToMission: "미션에서 여러 입장을 봤던 것처럼, 현실에서도 한쪽만 들으면 절대 전체 그림이 안 보여" },
      insight: { coreMessage: "모든 사람에게는 그렇게 행동한 이유가 있어. 이해한다는 건 동의한다는 뜻이 아니야." },
    },
    interactionOptions: {
      turn0: [
        { id: "sad", label: "그 학생들 다 힘들었겠다..." },
        { id: "interesting", label: "같은 사건인데 다르게 기억해요?" },
        { id: "hard-to-judge", label: "누가 맞는지 판단하기 어렵네" },
      ],
      turn1: [
        { id: "victim-first", label: "피해자 이야기가 가장 중요하지!", valueTags: ["empathy", "safety"] },
        { id: "all-sides", label: "모두 들어봐야 해", valueTags: ["fairness", "logic"] },
        { id: "why-bully", label: "가해자도 이유가 있었을까?", valueTags: ["empathy", "logic"] },
      ],
      turn3: [
        { id: "understand-not-agree", label: "이해해도 동의는 아닌 거구나", valueTags: ["logic", "empathy"] },
        { id: "everyone-has-story", label: "모든 사람에겐 이유가 있구나", valueTags: ["empathy", "community"] },
        { id: "listen-more", label: "더 들어야 보이는 게 있네", valueTags: ["empathy", "fairness"] },
      ],
    },
  },
  // ─── 5. 숨은 디자인 → 도윤 (서울교통공사 UX) ───
  {
    missionId: "mission-hidden-design",
    expert: {
      name: "도윤",
      role: "UX 디자이너",
      organization: "서울교통공사",
      personality: "호기심 넘치고 장난기 있는 형/오빠 느낌. '오 그거 눈치챘어? 대박인데 ㅋㅋ' 하면서 디자인 이야기를 신나게 함. 일상 속 디자인을 발견하는 재미를 전달.",
      connectionToMission: "숨은 디자인을 발견하는 미션처럼, 나도 매일 사람들이 '안 불편하면 모르는' 디자인을 만들어.",
      personalAnecdote: "지하철 노선도 색상을 바꾸는 프로젝트를 했는데, 색각이상 분들도 구분할 수 있는 색 조합을 찾느라 6개월이 걸렸어. 대부분 사람들은 바뀐 줄도 모르더라 ㅋㅋ",
    },
    realWorldCase: {
      headline: "지하철 노선도의 비밀: 색각이상자를 위한 6개월",
      context: "서울 지하철 노선도는 9개 호선을 색으로 구분해요. 하지만 인구의 약 5%인 색각이상자에게는 몇몇 호선이 같은 색으로 보여요. 이 문제를 해결하기 위해 노선도를 재설계했어요.",
      keyQuestion: "모두를 위한 디자인은 어떻게 만들 수 있을까?",
      source: "서울교통공사 유니버설디자인 리포트 2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + 숨은 디자인 발견에 대한 리액션. '일상에서 디자인 발견한 거 진짜 좋은 눈이야 ㅋㅋ'" },
      case: { angle: "노선도 재설계 프로젝트의 구체적 과정", personalStory: "색각이상인 동료와 함께 테스트하면서 '아 이게 이렇게 보이는구나' 충격받은 순간" },
      question: { theme: "보편적 디자인(유니버설 디자인)", bridgeToMission: "미션에서 숨은 디자인을 찾은 것처럼, 좋은 디자인은 눈에 안 보여도 모두를 위해 작동하고 있어" },
      insight: { coreMessage: "최고의 디자인은 아무도 불편해하지 않아서 아무도 모르는 디자인이야" },
    },
    interactionOptions: {
      turn0: [
        { id: "cool", label: "지하철 디자인 하는 거 멋있다!" },
        { id: "never-noticed", label: "그런 거 한 번도 몰랐어요" },
        { id: "how", label: "어떻게 고쳤어요?" },
      ],
      turn1: [
        { id: "change-color", label: "색 바꾸면 되지 않아?", valueTags: ["efficiency", "logic"] },
        { id: "add-pattern", label: "패턴이나 숫자를 추가!", valueTags: ["creativity", "empathy"] },
        { id: "ask-users", label: "그 분들한테 직접 물어봐야지", valueTags: ["empathy", "community"] },
      ],
      turn3: [
        { id: "invisible-design", label: "안 보이는 디자인이 최고구나", valueTags: ["logic", "empathy"] },
        { id: "test-with-people", label: "쓰는 사람과 같이 만들어야 하는구나", valueTags: ["community", "empathy"] },
        { id: "small-details", label: "작은 차이가 큰 변화를 만드네", valueTags: ["creativity", "logic"] },
      ],
    },
  },
  // ─── 6. 재미 vs 안전 → 서현 (에버랜드 안전 엔지니어) ───
  {
    missionId: "mission-fun-vs-safety",
    expert: {
      name: "서현",
      role: "놀이공원 안전 엔지니어",
      organization: "에버랜드",
      personality: "쾌활하고 열정적. '아 이거 진짜 재밌는 이야기야!' 하면서 놀이기구 이야기를 흥분해서 함. 안전이라는 주제를 무겁지 않게 전달하는 능력자.",
      connectionToMission: "재미와 안전 사이에서 고민한 미션처럼, 나도 매일 그 균형을 찾아야 해.",
      personalAnecdote: "T-익스프레스 점검할 때 밤새 기구에 직접 100번 이상 탔어. 안전한 줄 알아도 직접 타봐야 확신이 생기거든. 그날 밤 토했지만 ㅋㅋ",
    },
    realWorldCase: {
      headline: "T-익스프레스의 비밀: 100번 타본 엔지니어",
      context: "한국에서 가장 빠른 목재 롤러코스터 T-익스프레스는 개장 전 안전팀이 수백 번 시험 탑승을 했어요. 스릴을 유지하면서도 안전 기준을 통과하기 위해 각도를 0.5도씩 조정하는 작업을 반복했어요.",
      keyQuestion: "재미를 줄이지 않으면서 안전을 지킬 수 있을까?",
      source: "에버랜드 안전관리보고서 2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + 놀이공원 설계 미션에서의 안전-재미 고민 공감. '그 딜레마 진짜 어렵지? 나도 매일 그걸 고민해 ㅋㅋ'" },
      case: { angle: "T-익스프레스 각도 조정 에피소드", personalStory: "0.5도 바꿨더니 스릴은 그대로인데 안전 점수가 확 올라간 순간" },
      question: { theme: "안전과 즐거움의 균형", bridgeToMission: "미션에서 안전이냐 재미냐 골랐듯이, 현실에서는 둘 다 잡을 방법을 찾아야 해" },
      insight: { coreMessage: "안전과 재미는 반대가 아니야. 안전하니까 더 마음껏 즐길 수 있는 거야." },
    },
    interactionOptions: {
      turn0: [
        { id: "awesome", label: "100번 탔어요?! 대박 ㅋㅋ" },
        { id: "scary", label: "무섭지 않았어요?" },
        { id: "jealous", label: "부럽다... 저도 타보고 싶어" },
      ],
      turn1: [
        { id: "safety-always", label: "안전이 무조건 1순위!", valueTags: ["safety", "logic"] },
        { id: "both-possible", label: "둘 다 잡을 수 있지 않을까?", valueTags: ["creativity", "efficiency"] },
        { id: "ask-riders", label: "타는 사람한테 물어보면?", valueTags: ["community", "empathy"] },
      ],
      turn3: [
        { id: "not-opposite", label: "안전이랑 재미는 반대가 아니구나", valueTags: ["logic", "creativity"] },
        { id: "small-change-big", label: "0.5도 차이가 이렇게 크다니", valueTags: ["logic", "efficiency"] },
        { id: "trust-safety", label: "안전해야 더 재밌는 거구나", valueTags: ["safety", "adventure"] },
      ],
    },
  },
  // ─── 7. 한 줄 미션 → 태민 (제일기획 카피라이터) ───
  {
    missionId: "mission-one-line",
    expert: {
      name: "태민",
      role: "카피라이터",
      organization: "제일기획",
      personality: "유머러스하고 말장난을 좋아하는 스타일. '오 그 표현 센스 있는데? ㅋㅋ' 하면서 언어에 대한 열정이 넘침. 일상의 말에서 영감을 찾는 이야기를 잘함.",
      connectionToMission: "한 줄로 마음을 움직이는 미션처럼, 나도 매일 한 줄짜리 카피를 쓰느라 밤을 새.",
      personalAnecdote: "삼성 갤럭시 광고 카피를 쓸 때 300개를 쓰고 결국 채택된 건 집에 가다가 버스에서 떠오른 한 줄이었어. 그날 제일 아무 생각 없을 때 나온 거 ㅋㅋ",
    },
    realWorldCase: {
      headline: "300개를 쓰고 버스에서 떠오른 한 줄",
      context: "광고 카피라이터는 하나의 문장을 위해 수백 개의 시안을 쓰고 버려요. 제일기획의 카피라이터 팀은 대형 캠페인 하나에 평균 200~500개의 카피를 검토한다고 해요.",
      keyQuestion: "왜 어떤 한 줄은 사람의 마음에 꽂히고, 어떤 한 줄은 스쳐 지나갈까?",
      source: "제일기획 크리에이티브 리뷰 2024",
    },
    turnTemplates: {
      arrival: { hint: "자기소개 + 한 줄 표현 미션에 대한 공감. '한 줄 쓰는 거 진짜 어렵지? ㅋㅋ 나도 매일 고통받아'" },
      case: { angle: "300개 카피를 쓰고 버린 과정", personalStory: "밤새 쓴 카피가 다 탈락하고, 버스에서 멍 때리다가 떠오른 순간" },
      question: { theme: "표현의 힘과 과정", bridgeToMission: "미션에서 한 줄을 고민한 것처럼, 프로도 수백 번 시도하고 버려" },
      insight: { coreMessage: "좋은 한 줄은 재능이 아니라 수백 번의 시도와 관찰에서 나와" },
    },
    interactionOptions: {
      turn0: [
        { id: "no-way", label: "300개요?! 미쳤다 ㅋㅋ" },
        { id: "relate-hard", label: "저도 한 줄 쓰는 거 진짜 어려웠어요" },
        { id: "want-to-know", label: "어떤 카피가 뽑혔어요?" },
      ],
      turn1: [
        { id: "feeling-words", label: "마음이 담긴 말이 힘 있지!", valueTags: ["emotion", "empathy"] },
        { id: "short-strong", label: "짧을수록 강한 것 같아", valueTags: ["efficiency", "logic"] },
        { id: "unexpected", label: "예상 못한 말이 기억에 남지!", valueTags: ["creativity", "adventure"] },
      ],
      turn3: [
        { id: "effort-behind", label: "쉬워 보여도 엄청 노력한 거구나", valueTags: ["logic", "efficiency"] },
        { id: "observe-life", label: "일상을 관찰하는 게 중요하네", valueTags: ["creativity", "empathy"] },
        { id: "fail-to-find", label: "많이 실패해야 좋은 게 나오는구나", valueTags: ["adventure", "creativity"] },
      ],
    },
  },
];

