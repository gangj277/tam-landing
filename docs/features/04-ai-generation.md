# 04. AI 생성

> AI를 사용하여 실시간으로 콘텐츠를 생성하는 모든 기능을 다룹니다.

## 범위

- 시나리오 결과 카드 생성 (라운드별)
- 에필로그 장면 생성
- 미러 피드백 생성
- 생각 도구 응답 생성

이 문서는 **AI 호출과 프롬프트 설계**만 다룹니다. 생성된 데이터의 저장은 `03-sessions`에서, 분석은 `05-profile-insights`에서 다룹니다.

---

## AI 호출 지점 (4가지)

```
미션 플레이 중:
  ① 시나리오 결과 생성 — 선택/리액션 후 다음 상황 카드
  ② 생각 도구 응답 — "만약에..." / "그 사람은..." / "전혀 다르게"

미션 완료 시:
  ③ 에필로그 생성 — 4개 결과 장면 + 클로징
  ④ 미러 피드백 생성 — 2개 관찰 + 패턴 노트 + 다음 제안
```

---

## ① 시나리오 결과 생성

### POST /ai/scenario-round

아이의 선택/리액션을 받아 다음 상황 카드를 생성.

```
Request:
{
  "sessionId": "session-abc123",
  "missionId": "mission-mars-mayor",
  "roundIndex": 0,
  "previousChoice": {
    "choiceId": "hospital-first",
    "label": "병원에 먼저 물을 보낸다"
  },
  "reaction": {
    "emotion": { "id": "e1-calm", "label": "차분하게" },
    "method": { "id": "m1-private", "label": "대표만 만나서" }
  },
  "missionContext": {
    "persona": "너는 이 도시의 부시장이야...",
    "worldSetting": { "location": "화성 도시 아레스", "era": "2147년" },
    "followUpAngles": ["주민들에게 어떻게 설명할 건지", ...]
  },
  "previousRounds": []  // 이전 라운드 히스토리
}

Response (streamed):
{
  "consequence": {
    "narrative": "농장 팀장과 만났어. 처음엔 화가 나 있었지만...",
    "newDilemma": "약속을 할 수 있을까?"
  },
  "emotionOptions": [
    { "id": "e2-promise", "emoji": "🤝", "label": "약속한다", "valueTags": ["community", "empathy"] },
    { "id": "e2-honest", "emoji": "🤷", "label": "모르겠다고 솔직하게", "valueTags": ["independence", "logic"] },
    { "id": "e2-idea", "emoji": "💡", "label": "다른 방법을 제안", "valueTags": ["creativity", "adventure"] }
  ],
  "methodOptions": [
    { "id": "m2-eye", "emoji": "👀", "label": "눈을 보면서", "valueTags": ["empathy", "emotion"] },
    { "id": "m2-data", "emoji": "📊", "label": "데이터를 보여주며", "valueTags": ["logic", "efficiency"] },
    { "id": "m2-together", "emoji": "🙌", "label": "같이 해결하자며", "valueTags": ["community", "fairness"] }
  ],
  "thinkingTools": [
    { "type": "broaden", "label": "만약에...", "emoji": "🔭" },
    { "type": "reframe", "label": "그 사람은...", "emoji": "🔄" },
    { "type": "subvert", "label": "전혀 다르게", "emoji": "🌀" }
  ]
}
```

### 시스템 프롬프트 (시나리오 생성용)

```
[역할]
너는 인터랙티브 시나리오 작가야.
{mission.worldSetting.location}에서 {mission.role}인 10~14세 아이와 상황극을 하고 있어.

[규칙]
1. 아이의 선택에 대한 결과를 3~4줄로 서술해. 단, 결과가 100% 좋거나 100% 나쁘면 안 돼. 항상 트레이드오프가 있어야 해.
2. 새로운 딜레마를 한 문장으로 제시해. "~할까?" 형태.
3. 감정 선택지 3개를 만들어. 각각 다른 가치관을 반영해야 해. emoji + 2~4글자 라벨.
4. 방법 선택지 3개를 만들어. 각각 다른 행동 방식을 반영해야 해.
5. 아이의 이전 선택 패턴을 고려해서 자연스러운 서사 흐름을 만들어.
6. 반말 사용. 친구처럼. 유치하지 않게.
7. 절대 정답을 암시하지 마. 모든 선택이 유의미해야 해.

[상황]
{mission.situation}

[아이의 선택]
초기: {choice.label}
감정: {reaction.emotion.label}
방법: {reaction.method.label}

[이전 라운드]
{previousRounds 요약}

[생성할 것]
1. consequence.narrative (3~4줄, 선택의 결과)
2. consequence.newDilemma (한 문장, 새로운 질문)
3. emotionOptions[3] (emoji + label + valueTags)
4. methodOptions[3] (emoji + label + valueTags)
```

---

## ② 생각 도구 응답

### POST /ai/thinking-tool

아이가 "만약에..." 등을 눌렀을 때 대안 시나리오 카드 생성.

```
Request:
{
  "sessionId": "session-abc123",
  "toolType": "reframe",      // "broaden" | "reframe" | "subvert"
  "roundIndex": 1,
  "currentSituation": "농장 팀장이 약속을 요구하고 있음",
  "missionContext": { ... }
}

Response:
{
  "card": {
    "narrative": "병원 원장의 시선으로 보면:\n\"시장이 우리한테 물을 보내준 건 고맙지만...\""
  }
}
```

### 도구별 프롬프트 전략

| 도구 | 프롬프트 방향 | 예시 |
|------|-------------|------|
| 🔭 만약에... (broaden) | 안 고른 선택의 결과를 보여줌 | "만약 약속을 했는데 못 지키면?" |
| 🔄 그 사람은... (reframe) | 다른 캐릭터의 시점으로 전환 | "농장 팀장 민호의 시선으로 보면:" |
| 🌀 전혀 다르게 (subvert) | 예상 못한 와일드카드 이벤트 | "갑자기 지하수 탐지 드론이 새로운 수원을 발견!" |

---

## ③ 에필로그 생성

### POST /ai/epilogue

모든 라운드 완료 후, 아이의 선택 히스토리 기반으로 결과 장면 생성.

```
Request:
{
  "sessionId": "session-abc123",
  "missionId": "mission-mars-mayor",
  "initialChoice": { "choiceId": "hospital-first", "label": "병원에 먼저 물을 보낸다" },
  "reactions": [
    { "roundIndex": 0, "emotion": "차분하게", "method": "대표만 만나서" },
    { "roundIndex": 1, "emotion": "다른 방법을 제안", "method": "같이 해결하자며" },
    { "roundIndex": 2, "emotion": "솔직하게 말한다", "method": "다가가서 가까이" }
  ],
  "missionContext": { ... }
}

Response:
{
  "epilogue": {
    "title": "네가 만든 화성 도시의 하루",
    "scenes": [
      { "text": "병원에 물이 먼저 도착했어...", "mood": "positive" },
      { "text": "농장 팀장은 처음엔 화가 났지만...", "mood": "bittersweet" },
      { "text": "주민 회의에서는 처음으로...", "mood": "hopeful" },
      { "text": "아레스의 첫날이 저물고 있어...", "mood": "hopeful" }
    ],
    "closingLine": "이건 네가 만든 이야기야. 다른 선택을 했다면 완전히 다른 하루가 됐을 거야."
  }
}
```

### 시스템 프롬프트 (에필로그용)

```
[역할]
너는 인터랙티브 시나리오의 에필로그 작가야.

[규칙]
1. 정확히 4개의 장면을 만들어. 각 장면은 아이의 선택이 가져온 구체적 결과야.
2. 각 장면에 mood를 태깅해: "positive" | "bittersweet" | "hopeful" | "tense"
3. 4개 장면이 자연스러운 시간 순서를 따라야 해.
4. 결과가 100% 좋으면 안 돼. 항상 아쉬운 부분이나 다음 과제가 남아야 해.
5. 마지막 장면은 하루를 마무리하는 감성적 묘사로 끝내.
6. closingLine은 "다른 선택을 했다면 달랐을 거야"를 변형한 한 줄.
7. 반말, 친구처럼, 유치하지 않게.

[아이의 선택 히스토리]
{전체 선택 + 리액션 요약}
```

---

## ④ 미러 피드백 생성

### POST /ai/mirror

세션 완료 후, 아이의 전체 선택 패턴을 분석하여 성찰 피드백 생성.

```
Request:
{
  "sessionId": "session-abc123",
  "childId": "child-seoyeon",
  "missionId": "mission-mars-mayor",
  "initialChoice": { ... },
  "reactions": [ ... ],
  "toolsUsed": [ ... ],
  "closingResponse": "농장 팀장한테 솔직하게 말하는 게 제일 어려웠어",
  "previousMirrors": [ ... ]   // 과거 미러 결과 (패턴 비교용)
}

Response:
{
  "mirror": {
    "observations": [
      {
        "text": "지금 눈앞의 사람을 먼저 생각했어. \"당장 아픈 사람이 있는데\"라고 했을 때, 너한테는 지금 이 순간이 가장 중요한 거였어.",
        "valueTags": ["empathy", "safety"],
        "tone": "neutral"
      },
      {
        "text": "결정을 끝까지 밀고 나갔어. 반대 의견을 들었는데도 처음 생각을 바꾸지 않았어. 자기 기준이 분명한 편이야.",
        "valueTags": ["independence"],
        "tone": "encouraging"
      }
    ],
    "patternNote": "지난주보다 '다른 시각' 도구를 2번 더 써봤어. 다른 사람 입장도 궁금해하는 중인 것 같아!",
    "nextSuggestion": {
      "reason": "내일은 다른 사람의 시각에서 생각해보는 미션이 기다리고 있어",
      "categoryHint": "perspective"
    }
  }
}
```

### 시스템 프롬프트 (미러용)

```
[역할]
너는 아이의 선택 패턴을 관찰하는 거울이야. 판단하지 않고, 비추어줄 뿐이야.

[절대 규칙]
1. "잘했다", "못했다" 표현 금지.
2. 점수, 등급, 순위 없음.
3. "~했네", "~인 것 같아", "~하는 중이야" 관찰형 어미만 사용.
4. 아이가 한 말이나 선택을 직접 인용해서 근거를 보여줘.

[생성할 것]
1. observations (정확히 2개)
   - 각각: 선택에서 드러난 가치 패턴을 관찰형으로 서술
   - valueTags: 해당 관찰과 관련된 가치 태그
   - tone: "neutral" (사실 관찰) | "encouraging" (긍정 발견) | "curious" (호기심 유발)
2. patternNote (이전 미러와 비교, 없으면 null)
3. nextSuggestion (다음 미션 카테고리 힌트)

[분석 대상]
- 초기 선택: {choice}
- 3라운드 리액션: {reactions}
- 생각 도구 사용: {toolsUsed}
- 클로징 응답: {closingResponse}
- 과거 미러: {previousMirrors}
```

---

## 더미 데이터 연결

| 더미 데이터 | 위치 | 대체할 AI 기능 |
|---|---|---|
| `MARS_SCENARIO_CHAIN.rounds[]` | `lib/dummy-data.ts` | `POST /ai/scenario-round` |
| `MARS_SCENARIO_CHAIN.rounds[].thinkingTools[].card` | `lib/dummy-data.ts` | `POST /ai/thinking-tool` |
| `MARS_SCENARIO_CHAIN.epilogue` | `lib/dummy-data.ts` | `POST /ai/epilogue` |
| `SEOYEON_SESSION.mirror` | `lib/dummy-data.ts` | `POST /ai/mirror` |

---

## 프론트엔드 사용처

| 화면 | AI 호출 | 시점 |
|---|---|---|
| `/mission/[id]/play` 시나리오 | `POST /ai/scenario-round` | 매 리액션 확정 후 (×3) |
| `/mission/[id]/play` 생각 도구 | `POST /ai/thinking-tool` | 도구 버튼 클릭 시 |
| `/mission/[id]/play` 에필로그 | `POST /ai/epilogue` | 마지막 라운드 완료 후 |
| `/mission/[id]/mirror` | `POST /ai/mirror` | 에필로그 → 거울 전환 시 |

---

## 기술 스택

- **AI Provider**: AI Gateway (`anthropic/claude-sonnet-4.6`)
- **Streaming**: `streamText` + SSE로 narrative를 실시간 노출
- **Latency 목표**: 시나리오 카드 1장 생성 < 3초
- **비용 추정**: 세션 1회당 ~4회 AI 호출 × ~500 토큰 = ~2,000 토큰/세션
