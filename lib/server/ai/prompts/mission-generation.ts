import type {
  MissionCategory,
  DifficultyType,
  UserProfileSnapshot,
  MirrorResult,
  MissionPreview,
} from "../../types";
import { DIFFICULTY_GUIDANCE } from "./shared";

// ═══════════════════════════════════════
// 6. MISSION GENERATION (8일차~)
// ═══════════════════════════════════════

export const CATEGORY_DESIGN_GUIDE: Record<MissionCategory, string> = {
  world:
    `몰입형 세계 탐험. 아이가 직접 그 세계의 구성원이 되어 결정을 내리는 경험.
목적: "나는 어떤 문제에 끌리는가", "낯선 상황에서 나는 어떻게 판단하는가"를 발견.
세팅이 판타지여도 괜찮지만, 의사결정 과정은 반드시 현실적이어야 해 — 마법이나 초능력으로 문제를 해결하면 안 돼.
역할은 실존하거나 실존 가능한 직업/역할에서 출발해 (해양생물학자, 도시 설계사, 탐험대장 등). 아이가 "이런 일을 하는 사람이 실제로 있구나"를 느끼게.`,
  value:
    `가치 충돌 딜레마. 두 개의 "옳은 것"이 정면으로 부딪히는 상황.
목적: "나는 무엇을 더 중요하게 여기는가"를 발견. 공정 vs 효율, 안전 vs 모험, 개인 vs 공동체.
어느 쪽도 명백히 옳지 않아야 해. 아이가 선택 후 "반대쪽도 일리가 있었는데..."라고 느껴야 성공.
추상적 가치 대결이 아니라, 구체적 사람이 구체적으로 영향받는 상황으로 설계해.`,
  perspective:
    `다중 시점 경험. 같은 사건이 다른 사람에게는 완전히 다르게 느껴진다는 발견.
목적: "내 시각이 전부가 아니구나", "같은 상황인데 이 사람은 이렇게 느끼는구나"를 체감.
선생님/학생/부모, 가해자/피해자/방관자, 또는 기업/소비자/규제자 같은 다중 시점.
아이가 직접 각 입장에 서보면서 이전 판단이 흔들리는 경험이 핵심.`,
  real:
    `일상 관찰과 재설계. 학교, 동네, 가게 같은 친숙한 공간에서 "당연한 것을 낯설게" 보는 경험.
목적: "나는 세상을 어떤 눈으로 보는가", "문제를 발견하는 것 자체가 능력이구나"를 발견.
풀 수 있는 문제를 주는 게 아니라, "진짜 문제가 뭔지" 발견하는 과정을 설계해.
아이의 실제 생활과 가장 가까운 카테고리 — 전이가 가장 자연스러움.`,
  synthesis:
    `창작과 자기표현. 느낌이나 생각을 형태로 바꾸는 도전.
목적: "나는 어떻게 표현하는 사람인가", "왜 이렇게 만들었는지"를 스스로 발견.
카피라이팅, 전시 기획, 캐릭터 디자인, 프레젠테이션 등 창작 과제.
결과물의 퀄리티가 아니라 "선택의 이유"가 중요. 왜 이 색을, 이 단어를, 이 순서를 골랐는지.`,
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
7. 모든 딜레마는 두 차원을 반드시 포함해:
   - 정의(Justice): "무엇이 공정한가? 규칙은 어떻게 되어야 하는가?"
   - 돌봄(Care): "누가 상처받는가? 관계는 어떻게 되는가?"
   이 두 차원이 서로 충돌할 때 가장 깊은 학습이 일어나. 하나만 있으면 얕은 딜레마야.
8. backdrop은 환경뿐 아니라 반드시 "관계"를 포함해:
   - 이 세계에서 아이가 신뢰하는 사람 1명 (이름 + 관계 + 표정이나 제스처)
   - 이 세계에서 아이와 갈등하거나 다른 입장인 사람 1명 (이름 + 동기)
   - situation에 이 두 사람이 등장해야 해. 관계가 있어야 선택에 감정적 무게가 실려.
</미션 설계 원칙>

<카테고리: ${category}>
${CATEGORY_DESIGN_GUIDE[category]}
</카테고리>

<난이도: ${difficulty}>
${DIFFICULTY_GUIDANCE[difficulty]}
</난이도>

<도덕적 복잡도 캘리브레이션>
이 아이의 나이(${profile.age}세)를 참고해 딜레마의 도덕적 복잡도를 조절해:

10-11세(초4-5): "나에게 어떤 이득이 있는가" 수준에서 판단하는 경향.
→ 한 단계 위로 끌어올려: "다른 사람도 같은 상황이라면 어떻게 느낄까?"
→ 상호성(reciprocity)과 교환의 공정성을 자연스럽게 딜레마에 삽입.
→ 예: 자원을 나눌 때 "나한테 유리한 것"을 넘어 "상대방 입장에서도 받아들일 수 있는 것"으로 확장.

12-13세(초6-중1): "주변 사람들이 어떻게 볼까" 수준에서 판단하는 경향.
→ 한 단계 위로 끌어올려: "이 규칙이나 시스템은 왜 이렇게 만들어졌을까?"
→ 개인 관계를 넘어 제도와 구조에 대한 사고를 자극.
→ 예: 친구 관계의 갈등을 넘어 "학교 규칙 자체가 이 상황을 만든 건 아닐까?"로 확장.

13-14세(중2): 사회 질서와 규칙의 의미를 이해하기 시작.
→ 한 단계 위로 끌어올려: "규칙 자체가 불공정하다면 어떻게 해야 할까?"
→ 보편적 원칙과 개인 양심 사이의 긴장을 자극.
→ 예: "법을 따르는 것"과 "옳은 일을 하는 것"이 충돌하는 상황.

핵심 원칙: 아이의 현재 수준보다 딱 한 단계 위의 추론이 선택지나 상황 안에 자연스럽게 녹아 있어야 해. 강의하듯 설명하지 말고, 상황 자체가 그 수준의 사고를 요구하게 설계해.
</도덕적 복잡도 캘리브레이션>

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

<탐험 단계>
${(() => {
  const n = profile.stats.totalMissions;
  if (n <= 3) return `초기 (${n}회차): 아이의 일상과 가까운 세계에서 시작해. 학교, 동네, 가족, 친구 관계 안에서 벌어지는 상황. 아이가 "이건 내 이야기 같다"고 느끼게. 한 번에 한 가지만 낯설게 — 역할만 새롭거나, 상황만 새롭거나. 모든 걸 동시에 낯설게 하지 마.`;
  if (n <= 7) return `확장기 (${n}회차): 일상을 조금 벗어나는 세계로. 지역 사회, 다른 직업의 현장, 뉴스에서 볼 법한 상황. 역할은 실제 존재하는 직업에서 따와. 아이가 "이런 일을 하는 사람도 있구나"를 느끼게. 성별/지위 고정관념을 깨는 역할을 의도적으로 섞어 (여성 엔지니어, 남성 간호사 등 — 설교하지 말고 자연스럽게).`;
  if (n <= 15) return `심화기 (${n}회차): 더 넓은 세계와 더 복잡한 딜레마. 다른 나라, 다른 시대, SF적 미래도 가능하지만 의사결정은 현실적이어야 해. 이전 미션에서 보인 아이의 가치 경향을 의도적으로 도전하는 상황을 만들어.`;
  return `숙련기 (${n}회차): 여러 관점과 가치가 동시에 충돌하는 복합적 상황. 이전 경험에서 쌓인 자기이해를 활용해야 하는 미션. 아이가 "나는 이런 상황에서 이렇게 판단하는 사람이구나"를 확인하거나 재발견하게.`;
})()}
</탐험 단계>

<설계 방향>
${weakAxes.length > 0 ? `아직 탐색 중인 축: ${weakAxes.join(", ")}. 이 방향을 자연스럽게 자극하되,` : ""}
${strongAxes.length > 0 ? `이미 보이는 경향:\n${strongAxes.map((s) => `  - ${s}`).join("\n")}\n이 경향에서 시작해서 새로운 방향으로 연결해.` : ""}
이전에 가보지 않은 세계와 역할을 만들어줘.

핵심 질문 — 이 미션을 마친 후 아이가 스스로에 대해 새롭게 알게 되는 것이 뭐야?
그 발견이 명확하지 않으면 미션의 의미가 없어. "재밌었다"가 아니라 "나에 대해 이런 걸 알게 됐다"가 남아야 해.
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
