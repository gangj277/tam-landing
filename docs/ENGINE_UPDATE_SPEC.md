# 엔진 업데이트 스펙: 딥다이브 세션 + 미션/딥다이브 교차 구조

## 1. 변경 배경

현재 엔진은 **미션(판타지 역할 놀이)**만 지원한다. 새로운 구조는 미션과 **딥다이브(현실 사례 탐구)**가 하루 단위로 교차하며, 딥다이브 기록이 **진로 탐색 포트폴리오**로 누적된다.

```
현재: Day 1-7 미션 → Day 8+ AI 미션
변경: Day 1 미션 → Day 2 딥다이브 → ... → Day 14 딥다이브 → Day 15+ AI 미션/딥다이브 교차
```

---

## 2. 현재 엔진 구조 요약

### 핵심 파일

| 파일 | 역할 | 줄 수 |
|------|------|-------|
| `lib/server/backend.ts` | 모든 비즈니스 로직 | ~6,500 |
| `lib/server/ai/prompts.ts` | AI 프롬프트 7개 빌더 | ~635 |
| `lib/server/types.ts` | 서버 타입 정의 | ~400 |
| `lib/types.ts` | 클라이언트 타입 정의 | ~250 |
| `lib/server/missions/assignment.ts` | Day 1-7 시퀀스 | ~20 |
| `app/(app)/mission/[id]/play/page.tsx` | 미션 플레이 UI | ~975 |
| `lib/dummy-data.ts` | 하드코딩 7개 미션 | ~1,100 |

### 현재 미션 플로우

```
1. getTodayMission() → Day 1-7 하드코딩 / Day 8+ AI 생성
2. createMissionSession() → 세션 생성 (24시간 만료)
3. recordInitialChoice() → 3개 중 1개 선택
4. 5턴 루프:
   - prepareSessionRoundStream() → 시나리오 스트리밍
   - recordSessionReaction() → 감정+방식 기록
   - (선택) prepareSessionThinkingToolStream() → 사고 도구
5. generateSessionEpilogue() → 4장면 에필로그
6. generateSessionMirror() → 2개 관찰 + 패턴 노트
7. completeMissionSession() → 완료 + 프로필 재계산
```

### 현재 일일 스케줄 (`assignment.ts`)

```typescript
const FIRST_SEVEN_DAY_CATEGORY_SEQUENCE: MissionCategory[] = [
  "world", "world", "value", "perspective", "real", "value", "synthesis"
];
```

Day 8+: `getDailyChoices()` → 3개 프리뷰 생성 → 아이 선택 → 미션 생성

---

## 3. 변경 사항

### 3.1 새로운 일일 스케줄

```
Day 1:  미션 1 (하드코딩, world)
Day 2:  딥다이브 1 (미션 1의 현실 연결, 하드코딩)
Day 3:  미션 2 (하드코딩, world)
Day 4:  딥다이브 2 (미션 2의 현실 연결, 하드코딩)
Day 5:  미션 3 (하드코딩, value)
Day 6:  딥다이브 3 (미션 3의 현실 연결, 하드코딩)
Day 7:  미션 4 (하드코딩, perspective)
Day 8:  딥다이브 4 (미션 4의 현실 연결, 하드코딩)
Day 9:  미션 5 (하드코딩, real)
Day 10: 딥다이브 5 (미션 5의 현실 연결, 하드코딩)
Day 11: 미션 6 (하드코딩, value)
Day 12: 딥다이브 6 (미션 6의 현실 연결, 하드코딩)
Day 13: 미션 7 (하드코딩, synthesis)
Day 14: 딥다이브 7 (미션 7의 현실 연결, 하드코딩) + 첫 번째 거울
─────────────────────────────────────────
Day 15: AI 생성 미션
Day 16: AI 생성 딥다이브 (Day 15 미션 기반)
Day 17: AI 생성 미션
...
```

**변경 파일**: `lib/server/missions/assignment.ts`

```typescript
// 현재
const FIRST_SEVEN_DAY_CATEGORY_SEQUENCE = ["world", "world", "value", ...];

// 변경
type DayType = "mission" | "deepdive";

interface DaySchedule {
  day: number;        // 1-14
  type: DayType;
  missionIndex?: number;    // 미션일: 0-6 (7개 미션 중 몇 번째)
  linkedMissionDay?: number; // 딥다이브일: 연결된 미션의 day 번호
}

const FIRST_14_DAY_SCHEDULE: DaySchedule[] = [
  { day: 1,  type: "mission",  missionIndex: 0 },
  { day: 2,  type: "deepdive", linkedMissionDay: 1 },
  { day: 3,  type: "mission",  missionIndex: 1 },
  { day: 4,  type: "deepdive", linkedMissionDay: 3 },
  // ... Day 13-14
];
```

### 3.2 딥다이브 데이터 구조

**새로운 타입 (`lib/server/types.ts`에 추가)**:

```typescript
interface DeepDive {
  id: string;
  missionId: string;           // 연결된 미션
  sessionId: string | null;    // 연결된 미션 세션 (완료된 것)
  childId: string;
  title: string;               // "실제 가뭄 지역의 자원 배분"
  realWorldCase: {
    headline: string;          // 사례 제목
    context: string;           // 배경 설명 (3-5줄)
    keyQuestion: string;       // 핵심 탐구 질문
    source?: string;           // 출처 (선택)
  };
  steps: DeepDiveStep[];
  portfolioEntry: string | null;  // 완료 시 자동 생성되는 포트폴리오 문장
  status: "active" | "completed" | "expired";
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
}

interface DeepDiveStep {
  id: string;
  deepDiveId: string;
  stepIndex: number;           // 0-3 (4단계)
  type: "case" | "question" | "opinion" | "portfolio";
  prompt: string;              // AI가 보여주는 질문/자료
  response: string | null;     // 아이의 답변 (선택형 or 텍스트)
  options?: { id: string; label: string }[];  // 선택형일 때
  selectedOptionId?: string;
  createdAt: string;
}
```

### 3.3 딥다이브 4단계 구조

```
Step 1 — 현실 사례 소개 (case)
  AI가 전날 미션 주제와 연결된 실제 사례를 소개.
  "어제 화성에서 물 배분을 결정했지? 실제로 2024년 케냐에서..."

Step 2 — 핵심 질문 (question)
  사례에 대한 탐구 질문 2-3개.
  "실제 상황에서는 어떤 점이 달랐을까?"
  아이가 선택형 or 짧은 텍스트로 답변.

Step 3 — 자기 의견 정리 (opinion)
  "이 상황에서 가장 중요한 건 ___라고 생각한다. 왜냐하면 ___"
  템플릿 기반 + 자유 텍스트 조합.

Step 4 — 포트폴리오 기록 (portfolio)
  AI가 Step 1-3을 요약해서 포트폴리오 1문장 생성.
  아이가 수정하거나 확인.
  → deepDive.portfolioEntry에 저장
```

### 3.4 하드코딩 딥다이브 데이터 (Day 2, 4, 6, 8, 10, 12, 14)

**`lib/dummy-data.ts`에 추가**:

```typescript
export const HARDCODED_DEEP_DIVES: Omit<DeepDive, "id" | "sessionId" | "childId" | "status" | "startedAt" | "completedAt" | "createdAt" | "portfolioEntry" | "steps">[] = [
  {
    missionId: "mission-mars-mayor",
    title: "실제 가뭄 지역의 자원 배분",
    realWorldCase: {
      headline: "2024년 케냐 투르카나 지역 물 부족 위기",
      context: "케냐 북부 투르카나 지역에서 3년 연속 가뭄이 이어졌어. 물이 부족해지자, 지역 정부는 농업용수와 식수 중 어디에 먼저 보낼지 결정해야 했어. 농업을 살리면 내년 식량이 확보되지만, 당장 마실 물이 없는 가정이 수천 곳이었어.",
      keyQuestion: "네가 어제 화성에서 내린 결정과 이 실제 상황은 뭐가 같고 뭐가 달라?",
    },
  },
  {
    missionId: "mission-animal-rescue",
    title: "실제 NGO의 관심 끌기 전략",
    realWorldCase: {
      headline: "유니세프의 '좋아요 말고 백신을' 캠페인",
      context: "유니세프 스웨덴 지부가 SNS에서 '좋아요'만 누르고 후원하지 않는 사람들을 향해 도발적인 캠페인을 진행했어. '좋아요가 생명을 구하지 않습니다'라는 카피로 큰 반향을 일으켰어.",
      keyQuestion: "어제 네가 동물구조센터에서 선택한 접근 방식과 비교하면 어떤 차이가 있어?",
    },
  },
  // ... 5개 더 (미션 3-7 각각에 연결)
];
```

### 3.5 AI 딥다이브 생성 (Day 16+)

**`lib/server/ai/prompts.ts`에 추가할 프롬프트 빌더 2개**:

#### `buildDeepDiveGenerationPrompts()`
- Input: 전날 완료된 미션 정보, 아이 프로필, 이전 딥다이브 기록
- Output: DeepDive 구조 (realWorldCase + 4 step prompts)
- 규칙:
  - 실제 사례여야 함 (가상 금지)
  - 전날 미션 주제와 명확히 연결
  - 아이 연령(10-14세)에 적합한 난이도
  - 한국 사례 우선, 글로벌 사례 보조

#### `buildDeepDivePortfolioPrompts()`
- Input: 딥다이브 4단계 답변 전체, 연결된 미션 정보
- Output: 포트폴리오 1문장 (진로 탐색 기록으로 활용 가능한 형태)
- 규칙:
  - "~를 경험하며 ~에 대해 ~라는 입장을 정리함" 형태
  - 자유학기제/고교학점제 생기부 활동란에 쓸 수 있는 톤

---

## 4. 변경 파일 목록

### 신규 파일

| 파일 | 역할 |
|------|------|
| `app/(app)/deepdive/[id]/page.tsx` | 딥다이브 플레이 UI |
| `app/api/deepdive/route.ts` | 딥다이브 세션 생성/목록 |
| `app/api/deepdive/[id]/step/route.ts` | 딥다이브 스텝 답변 기록 |
| `app/api/deepdive/[id]/complete/route.ts` | 딥다이브 완료 |
| `app/api/ai/deepdive-generate/route.ts` | AI 딥다이브 생성 |
| `app/api/ai/deepdive-portfolio/route.ts` | 포트폴리오 문장 생성 |
| `app/api/portfolio/route.ts` | 포트폴리오 조회 |

### 수정 파일

| 파일 | 변경 내용 |
|------|----------|
| `lib/server/types.ts` | DeepDive, DeepDiveStep 타입 추가 |
| `lib/types.ts` | 클라이언트용 딥다이브 타입 추가 |
| `lib/server/backend.ts` | 딥다이브 CRUD 함수들 추가, getTodayMission → getTodayActivity로 확장 |
| `lib/server/ai/prompts.ts` | buildDeepDiveGenerationPrompts, buildDeepDivePortfolioPrompts 추가 |
| `lib/server/missions/assignment.ts` | 7일 시퀀스 → 14일 교차 스케줄 |
| `lib/dummy-data.ts` | HARDCODED_DEEP_DIVES 7개 추가 |
| `lib/api-client.ts` | 딥다이브 API 호출 함수 추가 |
| `app/(app)/home/page.tsx` | 홈 화면에서 미션/딥다이브 구분 표시 |
| `app/(app)/profile/page.tsx` | 포트폴리오 탭 추가 |
| `lib/server/backend.ts` (프로필) | recalculateProfile에 딥다이브 데이터 반영 |

### DB 스키마 추가 (Drizzle)

```
deep_dives 테이블:
  id, mission_id, session_id, child_id, title,
  real_world_case (jsonb), portfolio_entry,
  status, started_at, completed_at, created_at

deep_dive_steps 테이블:
  id, deep_dive_id, step_index, type,
  prompt, response, options (jsonb), selected_option_id,
  created_at
```

---

## 5. 핵심 로직 변경 상세

### 5.1 `getTodayActivity()` — 기존 `getTodayMission()` 확장

```typescript
// 현재
getTodayMission(payload) → { mission, reason }

// 변경
getTodayActivity(payload) →
  | { type: "mission", mission, reason }        // 홀수일
  | { type: "deepdive", deepDive, linkedMission, reason }  // 짝수일
```

**로직**:
1. 아이의 현재 Day 번호 계산 (가입일 기준)
2. Day 1-14: `FIRST_14_DAY_SCHEDULE`에서 조회
   - 홀수일(1,3,5...): 미션 반환 (기존 로직)
   - 짝수일(2,4,6...): 전날 미션의 딥다이브 반환
3. Day 15+:
   - 홀수일: AI 미션 생성 (기존 getDailyChoices 로직)
   - 짝수일: 전날 미션 기반 AI 딥다이브 생성

### 5.2 딥다이브 세션 관리

```typescript
// 신규 함수
createDeepDiveSession(payload, { missionId, deepDiveData })
  → { deepDiveId, startedAt }

recordDeepDiveStepResponse(payload, deepDiveId, { stepIndex, response?, selectedOptionId? })
  → DeepDiveStep

generateDeepDivePortfolio(payload, deepDiveId)
  → { portfolioEntry: string }

completeDeepDive(payload, deepDiveId)
  → { deepDive, portfolioEntry }
```

### 5.3 프로필 재계산 확장

```typescript
// 현재 recalculateProfileByChildId에 추가
// 딥다이브 완료 기록도 interestMap 점수에 반영
// 딥다이브의 연결된 미션 카테고리에 +5 점수 (심화 탐구 보너스)
// 포트폴리오 entry 수를 프로필 stats에 추가
```

### 5.4 포트폴리오 조회

```typescript
getPortfolio(payload, childId) → {
  missionRecords: { mission, session, mirror }[],
  deepDiveRecords: { deepDive, linkedMission, portfolioEntry }[],
  interestMap: InterestMapEntry[],
  recommendations: {
    gogyoHakjeomje: string[],    // 고교학점제 추천 과목
    jayuHakgije: string[],        // 자유학기제 활동 소재
  }
}
```

---

## 6. 딥다이브 플레이 UI 구조

### `app/(app)/deepdive/[id]/page.tsx`

미션 play와 다른 UI:
- 스트리밍 서사 없음 (딥다이브는 정적 텍스트)
- 4단계 순차 진행
- Step 2: 선택형 + 짧은 텍스트 혼합
- Step 3: 템플릿 기반 의견 정리
- Step 4: AI 생성 포트폴리오 문장 → 아이가 확인/수정

```
Phase: intro → case → question → opinion → portfolio → complete
```

미션 play(975줄)보다 훨씬 간단 — 스트리밍 없이 단계별 폼 + AI 호출 1회(포트폴리오).

---

## 7. 홈 화면 변경

### `app/(app)/home/page.tsx`

현재: "오늘의 미션" 카드 1개
변경: "오늘의 활동" — 미션일이면 미션 카드, 딥다이브일이면 딥다이브 카드

딥다이브 카드 UI:
```
┌──────────────────────────────┐
│  📖 오늘의 딥다이브              │
│                              │
│  어제의 미션: 화성 첫 도시의 시장  │
│  ────────────────────────────│
│  실제 가뭄 지역의 자원 배분       │
│  2024년 케냐 투르카나 지역...    │
│                              │
│  [ 탐구 시작하기 ]              │
└──────────────────────────────┘
```

---

## 8. 구현 우선순위

### P0 — 핵심 (딥다이브 없으면 교차 구조 불가)

1. 타입 정의 (`lib/server/types.ts`, `lib/types.ts`)
2. 일일 스케줄 변경 (`assignment.ts`: 7일 → 14일 교차)
3. 하드코딩 딥다이브 7개 (`dummy-data.ts`)
4. 백엔드 딥다이브 CRUD (`backend.ts`)
5. `getTodayActivity()` — 미션/딥다이브 교차 반환
6. 딥다이브 플레이 UI (`deepdive/[id]/page.tsx`)
7. 딥다이브 API 라우트 3개
8. 홈 화면 분기 (`home/page.tsx`)

### P1 — AI 생성 (Day 15+)

9. `buildDeepDiveGenerationPrompts()` 프롬프트 빌더
10. AI 딥다이브 생성 라우트
11. Day 15+ 교차 스케줄 로직

### P2 — 포트폴리오

12. `buildDeepDivePortfolioPrompts()` 프롬프트 빌더
13. 포트폴리오 조회 API
14. 프로필 페이지 포트폴리오 탭
15. 프로필 재계산에 딥다이브 반영

### P3 — 진로 연결

16. 고교학점제 과목 추천 로직
17. 자유학기제 활동 소재 포맷팅
18. 월간 리포트에 딥다이브 + 포트폴리오 포함

---

## 9. 변경하지 않는 것

- 미션 5턴 구조 (TOTAL_ROUNDS=5) — 그대로 유지
- 미션 에필로그/미러 — 그대로 유지
- 10개 value tag 시스템 — 그대로 유지
- 7개 관심 영역 맵 — 유지 (딥다이브가 점수를 보강)
- 프리뷰 3개 선택 시스템 (Day 15+) — 미션에만 적용, 딥다이브는 자동
- 탐 가이드 세션 — 미션+딥다이브 모두 다룸
- 기존 API 라우트 — 하위 호환 유지
