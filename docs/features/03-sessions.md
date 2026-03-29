# 03. 세션 관리

> 미션 플레이의 전체 생명주기를 다룹니다. 생성 → 선택 기록 → 리액션 기록 → 완료.

## 범위

- 세션 생성/조회/업데이트/완료
- 초기 선택 기록
- 리액션 카드 (감정 × 방식) 기록
- 생각 도구 사용 기록
- 클로징 응답 기록
- 과거 세션 히스토리

이 문서는 **데이터 기록**만 다룹니다. AI 응답 생성은 `04-ai-generation`에서, 데이터 분석은 `05-profile-insights`에서 다룹니다.

---

## 데이터 모델

### MissionSession

```typescript
interface MissionSession {
  id: string;                  // UUID
  childId: string;
  missionId: string;
  startedAt: string;           // ISO timestamp
  completedAt?: string;        // 미션 완료 시점

  // Phase 1: 초기 선택
  initialChoice: {
    choiceId: string;          // "hospital-first"
    timestamp: string;
  } | null;

  // Phase 2: 시나리오 라운드별 리액션
  reactions: ReactionRecord[];

  // Phase 3: 생각 도구 사용 기록
  toolsUsed: ToolUsageRecord[];

  // Phase 4: 클로징 응답
  closingResponse?: string;    // 아이가 자유롭게 적은 텍스트

  // Phase 5: 미러 결과 (04-ai-generation에서 생성)
  mirrorId?: string;           // MirrorResult 참조
}
```

### ReactionRecord

```typescript
interface ReactionRecord {
  roundIndex: number;          // 0, 1, 2
  emotionId: string;           // "e1-calm"
  emotionLabel: string;        // "차분하게"
  methodId: string;            // "m1-private"
  methodLabel: string;         // "대표만 만나서"
  valueTags: ValueTag[];       // 합산된 가치 태그
  timestamp: string;
}
```

### ToolUsageRecord

```typescript
interface ToolUsageRecord {
  roundIndex: number;
  toolType: "broaden" | "reframe" | "subvert";
  timestamp: string;
}
```

---

## API 엔드포인트

### POST /sessions

세션 생성. 아이가 "미션 시작하기"를 누를 때 호출.

```
Request:
{
  "childId": "child-seoyeon",
  "missionId": "mission-mars-mayor"
}

Response:
{
  "sessionId": "session-abc123",
  "startedAt": "2024-03-28T16:30:00Z"
}
```

### PATCH /sessions/:sessionId/choice

초기 선택 기록.

```
Request:
{
  "choiceId": "hospital-first",
  "timestamp": "2024-03-28T16:32:00Z"
}
```

### PATCH /sessions/:sessionId/reaction

라운드별 리액션 기록. 아이가 "이렇게 결정할게" 누를 때마다 호출.

```
Request:
{
  "roundIndex": 0,
  "emotionId": "e1-calm",
  "emotionLabel": "차분하게",
  "methodId": "m1-private",
  "methodLabel": "대표만 만나서",
  "valueTags": ["logic", "community", "empathy"],
  "timestamp": "2024-03-28T16:34:00Z"
}
```

### PATCH /sessions/:sessionId/tool

생각 도구 사용 기록.

```
Request:
{
  "roundIndex": 1,
  "toolType": "reframe",
  "timestamp": "2024-03-28T16:35:30Z"
}
```

### PATCH /sessions/:sessionId/closing

클로징 응답 기록 (선택적).

```
Request:
{
  "closingResponse": "농장 팀장한테 솔직하게 말하는 게 제일 어려웠어"
}
```

### PATCH /sessions/:sessionId/complete

세션 완료 처리.

```
Request:
{
  "completedAt": "2024-03-28T16:40:00Z",
  "mirrorId": "mirror-xyz789"
}
```

### GET /sessions/:sessionId

세션 상세 조회 (미러 화면에서 사용).

### GET /sessions?childId={childId}&status=completed&limit=10

과거 세션 목록 조회 (홈 화면, 프로필 화면에서 사용).

```
Response:
{
  "sessions": [
    {
      "sessionId": "session-abc123",
      "missionId": "mission-mars-mayor",
      "missionTitle": "화성 첫 도시의 시장",
      "category": "world",
      "completedAt": "2024-03-28",
      "choiceSummary": "병원 우선 → 차분하게 대표만 만남"
    },
    ...
  ]
}
```

---

## 세션 생명주기

```
┌─ 생성 ──────────────────────────────────────┐
│ POST /sessions                               │
│ → sessionId 발급, startedAt 기록              │
└──────────────────────────────────────────────┘
    ↓
┌─ 초기 선택 ─────────────────────────────────┐
│ PATCH /sessions/:id/choice                   │
│ → choiceId + timestamp 기록                  │
│ → AI 시나리오 생성 트리거 (04-ai-generation)  │
└──────────────────────────────────────────────┘
    ↓
┌─ 라운드 반복 (×3) ──────────────────────────┐
│ PATCH /sessions/:id/reaction (매 라운드)      │
│ PATCH /sessions/:id/tool (선택적, 0~N회)     │
│ → AI 다음 라운드 생성 트리거                   │
└──────────────────────────────────────────────┘
    ↓
┌─ 에필로그 ──────────────────────────────────┐
│ (AI가 생성한 결과 화면 표시)                   │
│ → 별도 API 호출 없음, 04-ai-generation 결과   │
└──────────────────────────────────────────────┘
    ↓
┌─ 클로징 ────────────────────────────────────┐
│ PATCH /sessions/:id/closing (선택적)         │
│ → closingResponse 텍스트 저장                │
└──────────────────────────────────────────────┘
    ↓
┌─ 완료 ──────────────────────────────────────┐
│ PATCH /sessions/:id/complete                 │
│ → completedAt 기록, mirrorId 연결            │
│ → 프로필 업데이트 트리거 (05-profile-insights) │
└──────────────────────────────────────────────┘
```

---

## 더미 데이터 연결

| 더미 데이터 | 위치 | 대체할 API |
|---|---|---|
| `SEOYEON_SESSION` | `lib/dummy-data.ts` | `GET /sessions/:sessionId` |
| `SEOYEON_SESSION.choicesMade[]` | `lib/dummy-data.ts` | `PATCH /sessions/:id/choice` |
| `SEOYEON_SESSION.conversation[]` | `lib/dummy-data.ts` | 세션 내 AI 대화 기록 (→ `04-ai-generation`) |
| `SEOYEON_SESSION.toolsUsed[]` | `lib/dummy-data.ts` | `PATCH /sessions/:id/tool` |
| `SEOYEON_SESSION.mirror` | `lib/dummy-data.ts` | `PATCH /sessions/:id/complete` + mirrorId |
| `PAST_SESSIONS[]` | `lib/dummy-data.ts` | `GET /sessions?userId=...&status=completed` |

---

## 프론트엔드 사용처

| 화면 | API 호출 | 시점 |
|---|---|---|
| `/mission/[id]` 인트로 | `POST /sessions` | "미션 시작하기" 클릭 |
| `/mission/[id]/play` 초기 선택 | `PATCH /sessions/:id/choice` | 선택 카드 클릭 |
| `/mission/[id]/play` 리액션 | `PATCH /sessions/:id/reaction` | "이렇게 결정할게" 클릭 |
| `/mission/[id]/play` 생각 도구 | `PATCH /sessions/:id/tool` | 만약에.../그 사람은.../전혀 다르게 클릭 |
| `/mission/[id]/play` 클로징 | `PATCH /sessions/:id/closing` | 텍스트 입력 후 "다음으로" |
| `/mission/[id]/mirror` | `GET /sessions/:id` | 페이지 로드 |
| `/home` 완료 목록 | `GET /sessions?status=completed` | 페이지 로드 |
| `/profile` 최근 탐험 | `GET /sessions?status=completed` | 페이지 로드 |

---

## 데이터 보존 정책

- 세션 데이터는 **영구 보존** (삭제 없음)
- 미완료 세션 (`completedAt = null`)은 24시간 후 자동 만료 (재시도 가능)
- 같은 미션 재플레이 시 새 세션 생성 (이전 세션 유지)
