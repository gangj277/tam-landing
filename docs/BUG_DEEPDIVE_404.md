# BUG: 딥다이브 채팅 404 에러

> 작성일: 2026-04-01
> 심각도: 높음 (딥다이브 기능 전체 사용 불가)
> 상태: 미해결

---

## 증상

1. `/admin/test`에서 딥다이브 선택 → `createDeepDive(missionId)` 호출 → `deepDiveId` 정상 반환
2. `/deepdive/[id]` 페이지로 리다이렉트
3. 페이지에서 `POST /api/deepdive/[id]/chat` 호출 시 **404 "Deep dive not found"**
4. UI에 "메시지를 불러올 수 없었어요..." 표시

```
POST /api/deepdive/dd-3bc238d7-8327-49b1-be91-d31c79a448bb/chat 404
```

---

## 원인 분석

### 핵심: Postgres 스토어의 딥다이브 데이터가 인메모리로만 저장됨

딥다이브 v3(에이전트 기반)로 리팩토링하면서 DB 마이그레이션 없이 **인메모리 Map**을 임시로 사용 중:

```typescript
// lib/server/store/postgres.ts (line 45-65)
const deepDiveState = globalThis.__tamDeepDiveState__; // Map 기반 인메모리
```

이 데이터는:
- **Postgres DB에 저장되지 않음** — `upsertDeepDive()`가 Map에만 write
- **서버 재시작 시 소실**
- **Turbopack 모듈 재평가 시 소실될 가능성** (globalThis 패치 적용했으나 여전히 불안정)

### 데이터 흐름

```
[생성] POST /api/deepdive
  → createDeepDiveSession()
  → store.upsertDeepDive()
  → deepDiveState.deepDives.set(id, data)  ← 인메모리 Map에 저장
  → return { deepDiveId }  ← 성공

[조회] POST /api/deepdive/[id]/chat
  → streamAgentResponse()
  → store.getDeepDive(id)
  → deepDiveState.deepDives.get(id)  ← Map에서 조회... null!
  → throw 404
```

### 왜 null이 반환되는가 — 가능한 원인 3가지

**1. Turbopack 모듈 격리 (가장 유력)**
- Next.js dev 모드에서 각 API 라우트가 별도 청크로 컴파일됨
- `/api/deepdive/route.ts`와 `/api/deepdive/[id]/chat/route.ts`가 다른 모듈 인스턴스를 가질 수 있음
- `globalThis.__tamDeepDiveState__`가 라우트 간에 공유되지 않을 가능성
- memory.ts는 `globalThis.__tamMemoryState__`로 동일한 패턴이지만, postgres.ts는 나중에 추가된 것이라 Turbopack이 다르게 처리할 수 있음

**2. Store 인스턴스 다중 생성**
```typescript
// lib/server/store/index.ts
let cachedStore: Store | null = null;
export function getStore(): Store {
  if (!cachedStore) {
    cachedStore = env.TAM_DATA_BACKEND === "memory"
      ? createMemoryStore()
      : createPostgresStore();
  }
  return cachedStore;
}
```
- `cachedStore`도 모듈 레벨 변수 → Turbopack 재평가 시 null로 리셋
- 새로운 `createPostgresStore()` 호출마다 같은 `globalThis.__tamDeepDiveState__`를 참조하긴 하지만...
- `cachedStore` 자체가 리셋되면 store 연결 등에 영향 가능

**3. 타이밍 이슈**
- `createDeepDive` 응답 후 리다이렉트되는 사이에 Turbopack HMR이 발생할 수 있음
- 특히 파일 변경 감지가 활성화된 dev 모드에서

---

## 시도된 해결 방법 (모두 실패)

1. ✅ `globalThis.__tamDeepDiveState__` 패턴 적용 (`postgres.ts` line 47-65) — 실패
2. ✅ Dev 서버 재시작 — 실패
3. ✅ `.next` 캐시 삭제 + 서버 재시작 — 실패
4. ✅ 재로그인 — 실패

---

## 해결 방안

### 옵션 A: memory 백엔드로 전환 (즉시 우회)
```bash
# .env.local에 추가
TAM_DATA_BACKEND=memory
```
- memory.ts는 `globalThis.__tamMemoryState__`로 동작이 검증됨
- 모든 데이터가 인메모리지만 dev 테스트에는 충분
- **딥다이브 + 미션 + 프로필 등 전부 인메모리가 됨**

### 옵션 B: Postgres에 실제 테이블 생성 (근본 해결)
`lib/server/db/schema.ts`에 새 테이블 추가 + Drizzle 마이그레이션:

```sql
CREATE TABLE deep_dive_v3 (
  id TEXT PRIMARY KEY,
  mission_id TEXT NOT NULL,
  session_id TEXT,
  child_id TEXT NOT NULL,
  expert JSONB NOT NULL,
  real_world_case JSONB NOT NULL,
  portfolio_entry TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  agent_state JSONB NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE deep_dive_messages (
  id TEXT PRIMARY KEY,
  deep_dive_id TEXT NOT NULL REFERENCES deep_dive_v3(id),
  message_index INTEGER NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  tool_calls JSONB,
  created_at TEXT NOT NULL
);

CREATE TABLE deep_dive_insights (
  id TEXT PRIMARY KEY,
  deep_dive_id TEXT NOT NULL REFERENCES deep_dive_v3(id),
  text TEXT NOT NULL,
  source_message_index INTEGER NOT NULL,
  value_tags JSONB NOT NULL,
  created_at TEXT NOT NULL
);
```

그리고 `postgres.ts`의 인메모리 Map을 실제 DB 쿼리로 교체.

### 옵션 C: globalThis 디버깅 (원인 정확히 파악)
`upsertDeepDive`와 `getDeepDive`에 console.log 추가:

```typescript
async upsertDeepDive(dd) {
  console.log("[DD STORE] upsert", dd.id, "map size:", deepDiveState.deepDives.size);
  console.log("[DD STORE] globalThis ref:", globalThis.__tamDeepDiveState__ === deepDiveState);
  deepDiveState.deepDives.set(dd.id, dd);
  console.log("[DD STORE] after set, map size:", deepDiveState.deepDives.size);
},

async getDeepDive(deepDiveId) {
  console.log("[DD STORE] get", deepDiveId, "map size:", deepDiveState.deepDives.size);
  console.log("[DD STORE] keys:", [...deepDiveState.deepDives.keys()]);
  const dd = deepDiveState.deepDives.get(deepDiveId);
  console.log("[DD STORE] found:", !!dd);
  return dd ? { ...dd, messages: await this.listDeepDiveMessages(deepDiveId), insights: await this.listDeepDiveInsights(deepDiveId) } as DeepDive : null;
},
```

이 로그를 보면:
- `upsert` 시점에 Map에 저장되는지
- `get` 시점에 같은 Map을 보고 있는지
- Map의 reference가 globalThis와 동일한지

를 확인할 수 있음.

---

## 관련 파일

| 파일 | 역할 |
|------|------|
| `lib/server/store/postgres.ts` (line 45-65, 440-490) | 인메모리 딥다이브 스토어 (버그 위치) |
| `lib/server/store/memory.ts` (line 6-11) | globalThis 패턴 참고 (정상 동작) |
| `lib/server/store/index.ts` (line 8-19) | Store 인스턴스 생성/캐싱 |
| `lib/server/services/deep-dive.ts` (line 26-81, 291-340) | createDeepDiveSession, streamAgentResponse |
| `app/api/deepdive/route.ts` | POST 딥다이브 생성 |
| `app/api/deepdive/[id]/chat/route.ts` | POST 채팅 (404 발생 지점) |
| `app/(app)/deepdive/[id]/page.tsx` | 딥다이브 UI 페이지 |
| `lib/api-client.ts` (line 597-610, 618-700) | 클라이언트 API 함수 |

---

## 추천 순서

1. **옵션 C** 로그 추가해서 정확한 원인 파악
2. **옵션 A** memory 백엔드로 우회하여 기능 테스트 진행
3. **옵션 B** Postgres 테이블 생성으로 근본 해결
