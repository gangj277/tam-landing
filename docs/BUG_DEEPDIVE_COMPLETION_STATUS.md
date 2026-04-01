# BUG: 딥다이브 완료 후에도 홈 화면에서 "탐구 시작하기"로 표시됨

## 증상

유저가 딥다이브를 완료(4단계 모두 수행 + 포트폴리오 저장)했는데도, 홈 화면에 돌아오면 여전히 "탐구 시작하기" 버튼이 보임. 미션은 완료 시 정상적으로 완료 인디케이션(초록 체크마크 + "다시 살펴보기")이 표시됨.

## 원인 분석

### 데이터 흐름

```
홈 페이지 로드
  → GET /api/activity/today
    → getTodayActivity() (lib/server/services/deep-dive.ts:82)
      → store.listDeepDivesByChild()로 기존 딥다이브 검색
        → 완료된 딥다이브 찾음 → deepDive.status === "completed" 반환
  → 프론트엔드에서 deepDiveData.status 확인 → "completed"면 완료 UI 표시
```

### 문제 1: 서버가 완료된 딥다이브를 못 찾을 가능성

`getTodayActivity`에서 기존 딥다이브를 찾는 로직 (deep-dive.ts ~134):

```typescript
const allDeepDives = await store.listDeepDivesByChild(activeChild.id);
const existingForMission = allDeepDives
  .filter((dd) => dd.missionId === linkedMissionId)
  .sort(...)
const existing = existingForMission[0];
```

**확인 필요**: `listDeepDivesByChild`가 Postgres에서 completed 딥다이브를 제대로 반환하는지. `store/postgres.ts`의 구현을 확인할 것.

### 문제 2: 서버 코드 변경이 반영 안 됐을 가능성

dev 서버의 HMR(Hot Module Replacement)이 서비스 파일 변경을 감지 못 할 수 있음. 특히 `lib/server/services/deep-dive.ts`는 API 라우트에서 re-export를 통해 간접 참조되므로 HMR 체인이 끊길 수 있음.

**검증 방법**: dev 서버를 완전히 죽이고 재시작한 후 테스트.

### 문제 3: 프론트엔드 캐싱/상태 문제

홈 페이지(`app/(app)/home/page.tsx`)에서 `getTodayActivity()` 응답의 `deepDiveData.status`를 확인하는 코드:

```typescript
{deepDiveData.status === "completed" ? (
  // 완료 UI
) : (
  // "탐구 시작하기" 버튼
)}
```

**확인 필요**: API 응답에 실제로 `status: "completed"`가 포함되어 오는지 브라우저 네트워크 탭에서 확인.

## 디버깅 방법

### Step 1: API 응답 직접 확인

브라우저 개발자 도구 → Network 탭 → `/api/activity/today` 요청의 Response를 확인:

```
deepDive.status가 "completed"인지 "active"인지 확인
deepDive.id가 방금 완료한 딥다이브의 id인지 확인
```

### Step 2: DB 직접 조회

Neon 콘솔에서:

```sql
SELECT id, mission_id, child_id, status, completed_at, portfolio_entry
FROM deep_dives
WHERE child_id = '실제_child_id'
ORDER BY created_at DESC;
```

만약 같은 mission_id에 대해 여러 row가 있고, 하나는 completed이고 하나는 active이면 → 매번 새로 생성되는 문제가 맞음.

### Step 3: 서버 로그에 디버그 추가

`lib/server/services/deep-dive.ts`의 `getTodayActivity` 함수 시작부에:

```typescript
console.log("[getTodayActivity] sequenceDay:", sequenceDay, "isDeepDive:", isDeepDiveDay(sequenceDay));
```

딥다이브 검색 후:

```typescript
console.log("[getTodayActivity] allDeepDives for mission:", linkedMissionId,
  "found:", existingForMission.length,
  "statuses:", existingForMission.map(d => d.status));
```

## 비교: 미션 완료 표시가 작동하는 이유

미션의 완료 표시 로직 (home/page.tsx ~499):

```typescript
const isTodayCompleted = todayMission
  ? pastSessions.some((s) => s.missionId === todayMission.id)
  : false;
```

미션은 **별도의 완료 세션 리스트(`pastSessions`)**를 GET `/api/sessions`에서 가져와서 비교함. API 응답의 상태에 의존하지 않고, 독립적인 데이터 소스를 사용.

딥다이브는 `getTodayActivity` API 하나에 전적으로 의존하므로, 이 API가 올바른 status를 반환하지 않으면 프론트엔드가 판단할 방법이 없음.

## 수정 방안

### 방안 A: 프론트엔드에서 독립적으로 완료 확인 (미션과 동일 패턴)

```typescript
// 홈 페이지에서 별도로 완료된 딥다이브 목록을 가져옴
const completedDeepDives = await listDeepDives(); // GET /api/deepdive
const isDeepDiveCompleted = deepDiveData
  ? completedDeepDives.some(dd => dd.missionId === deepDiveData.missionId && dd.status === "completed")
  : false;
```

이 방식은 `getTodayActivity`가 어떤 status를 반환하든, 프론트가 독립적으로 확인 가능.

### 방안 B: getTodayActivity에서 completed 반환 보장 (현재 시도한 수정)

`listDeepDivesByChild`로 active + completed 모두 찾아서 가장 최근 것을 반환. 이 수정이 정상 작동하려면:
1. `listDeepDivesByChild` Postgres 구현이 completed도 반환하는지 확인
2. dev 서버 재시작해서 코드 변경이 반영되는지 확인
3. DB에 중복 딥다이브(같은 mission에 active + completed)가 있으면 정리

### 방안 C (권장): A + B 결합

서버에서도 올바르게 반환하고, 프론트에서도 이중 확인하는 방어적 코드.

## 관련 파일

| 파일 | 역할 |
|------|------|
| `lib/server/services/deep-dive.ts:82` | `getTodayActivity()` — 오늘 딥다이브 반환 |
| `lib/server/services/deep-dive.ts:134` | 기존 딥다이브 검색 로직 |
| `lib/server/store/postgres.ts:433` | `getDeepDiveByChildAndMission` — `status="active"`만 검색 (원래 버그 원인) |
| `app/(app)/home/page.tsx:539` | 딥다이브 카드 렌더링 + status 체크 |
| `lib/server/store/postgres.ts:450` | `listDeepDivesByChild` — 전체 딥다이브 리스트 |

## 재현 방법

1. 가입 → Day 1 미션 완료
2. Day 2 (딥다이브 날) → 딥다이브 4단계 완료 + 포트폴리오 저장
3. 홈으로 돌아오기
4. 홈 화면에서 딥다이브 카드가 여전히 "탐구 시작하기"로 표시됨

## 우선순위

**P0** — 유저가 완료한 활동인데 완료로 표시되지 않으면 혼란을 줌. 미션은 정상 작동하므로 경험 불일치가 발생.
