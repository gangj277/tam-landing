# 02. 미션 데이터 관리

> 미션 콘텐츠의 저장, 조회, 배정 로직을 다룹니다.

## 범위

- 미션 정의 및 저장 (정적 콘텐츠)
- 오늘의 미션 배정 알고리즘
- 미션 메타데이터 (카테고리, 난이도, 태그)
- 미션 라이브러리 확장

이 문서는 **미션 콘텐츠 자체**만 다룹니다. 미션 플레이 중 발생하는 세션은 `03-sessions`에서, AI 시나리오 생성은 `04-ai-generation`에서 다룹니다.

---

## 데이터 모델

### Mission

```typescript
interface Mission {
  id: string;                    // "mission-mars-mayor"
  title: string;                 // "화성 첫 도시의 시장"
  role: string;                  // "도시 리더"
  category: MissionCategory;     // "world" | "value" | "perspective" | "real" | "synthesis"
  difficulty: DifficultyType;    // "value-conflict" | "dilemma" | ...

  worldSetting: {
    location: string;            // "화성 도시 아레스"
    era: string;                 // "2147년"
    backdrop: string;            // 분위기 묘사
  };

  situation: string;             // 상황 설명 (3~4줄)
  coreQuestion: string;          // 핵심 질문

  choices: Choice[];             // 초기 선택지 (2~3개)

  aiContext: {
    persona: string;             // AI 역할 ("이 도시의 부시장")
    followUpAngles: string[];    // AI가 파고들 방향
    expansionTools: ExpansionTool[];  // 생각 도구 3개
  };

  tags: string[];                // ["우주", "리더십", "자원관리"]
  estimatedMinutes: number;      // 5~10
  ageRange: [number, number];    // [10, 14]
  isActive: boolean;             // 서비스 중인지
  createdAt: string;
}
```

### Choice

```typescript
interface Choice {
  id: string;
  label: string;            // "농장에 먼저 물을 보낸다"
  shortLabel: string;       // "농장 우선"
  reasoning: string;        // 선택의 논리 힌트
  valueTags: ValueTag[];    // ["efficiency", "logic"]
}
```

---

## API 엔드포인트

### GET /missions

전체 미션 목록 조회.

```
Response:
{
  "missions": [
    { "id": "mission-mars-mayor", "title": "화성 첫 도시의 시장", "category": "world", ... },
    ...
  ]
}
```

### GET /missions/:id

개별 미션 상세 조회 (choices, aiContext 포함).

### GET /missions/today?userId={userId}

오늘의 미션 배정. 배정 알고리즘 적용.

```
Response:
{
  "mission": { ... },
  "reason": "아직 '관점 전환' 카테고리를 경험하지 않았어요"
}
```

---

## 미션 배정 알고리즘

### 첫 7일: 고정 순서

| Day | 카테고리 | 이유 |
|-----|---------|------|
| 1 | world | 몰입감 높은 세계 탐험으로 시작 |
| 2 | world | 창작 판단형으로 다른 느낌 |
| 3 | value | 가치 딜레마 첫 경험 |
| 4 | perspective | 관점 전환 첫 경험 |
| 5 | real | 현실과 연결되는 관찰 미션 |
| 6 | value | 두 번째 가치 딜레마 |
| 7 | synthesis | 표현/종합 미션으로 마무리 |

### 8일차 이후: 적응형 배정

```
1. 아이가 아직 경험하지 않은 카테고리 우선
2. confidence가 "low"인 발견 축과 관련된 미션 우선
3. 최근 3일간 같은 카테고리 반복 방지
4. 주말에는 자유 선택 1개 추가 제공
```

---

## 더미 데이터 연결

| 더미 데이터 | 위치 | 대체할 기능 |
|---|---|---|
| `MISSIONS[]` (7개) | `lib/dummy-data.ts` | `GET /missions` |
| `getMissionById(id)` | `lib/dummy-data.ts` | `GET /missions/:id` |
| `getTodayMission()` | `lib/dummy-data.ts` | `GET /missions/today` + 배정 알고리즘 |
| `MISSIONS[1]` (내일 미션) | home 화면 하드코딩 | `GET /missions/tomorrow` |

---

## 프론트엔드 사용처

| 화면 | API 호출 | 사용하는 필드 |
|---|---|---|
| `/home` 오늘의 미션 카드 | `GET /missions/today` | title, role, worldSetting, situation, tags, estimatedMinutes |
| `/home` 내일 미션 예고 | `GET /missions/tomorrow` | title, role, category |
| `/mission/[id]` 인트로 | `GET /missions/:id` | 전체 (worldSetting, situation, coreQuestion, choices, tags, difficulty) |
| `/mission/[id]/play` 선택 | `GET /missions/:id` | choices[], aiContext |

---

## 콘텐츠 확장 전략

- **v1**: 7개 미션 (현재 더미 데이터)을 DB에 시드
- **v2**: 어드민 패널에서 미션 추가/편집
- **v3**: AI를 활용한 미션 자동 생성 파이프라인
  - 카테고리 + 난이도 + 테마 입력 → AI가 situation, coreQuestion, choices, aiContext 생성
  - 사람이 검수 후 배포
