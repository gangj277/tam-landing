# TAM Backend Frontend Handoff

## 범위

- 이 문서는 프론트엔드 팀이 TAM 백엔드와 붙을 때 필요한 서버 계약만 정리한다.
- 현재 구현 범위는 인증, 가족/아이 프로필, 미션 조회/배정, 세션 기록, AI 생성, 프로필 집계, 부모 리포트 조회다.
- UI 구현 책임은 포함하지 않는다.

## 런타임 전제

- 기본 OpenRouter 모델: `google/gemini-3-flash-preview`
- 프로덕션 저장소: `TAM_DATA_BACKEND=postgres`
- 테스트 저장소: `TAM_DATA_BACKEND=memory`
- 테스트/개발 mock AI: `TAM_AI_MODE=mock`
- 실제 AI: `TAM_AI_MODE=openrouter`

## 필수 환경변수

- `DATABASE_URL`
- `OPENROUTER_API_KEY`
- `JWT_SECRET`

## 인증 방식

- 서버는 HttpOnly 쿠키 `tam_auth`를 기준으로 인증한다.
- 프론트는 별도 토큰 저장 없이 `credentials: "include"`로 API를 호출하면 된다.
- 부모 권한이 필요한 API는 `POST /api/auth/verify-pin` 이후 5분 동안만 유효하다.

## 주요 엔드포인트

### Auth / Family

- `POST /api/auth/signup`
  - body: `{ ownerPhone, ownerName, password, parentPIN, firstChild: { name, age } }`
  - response: `{ familyId, activeChild, children }`
  - side effect: `tam_auth` 쿠키 설정
- `POST /api/auth/login`
  - body: `{ phone, password }`
- `POST /api/auth/verify-pin`
  - body: `{ pin }`
  - side effect: 부모 검증이 포함된 새 `tam_auth` 쿠키 발급
- `POST /api/auth/reset-pin`
  - request mode body: `{ ownerPhone }`
  - confirm mode body: `{ resetToken, newPIN }`
  - request response: `{ requested, expiresIn, delivery, resetTokenPreview? }`
  - confirm response: `{ updated: true }`
  - 개발/테스트에서는 SMS 인프라가 없을 때 `resetTokenPreview`가 응답에 포함될 수 있음
- `GET /api/family/me`
  - response: `{ familyId, ownerName, ownerPhone, activeChildId, activeChild, children, parentVerified }`
- `POST /api/family/children`
  - parent verify 필요
  - body: `{ name, age }`
- `PATCH /api/family/active-child`
  - body: `{ childId }`
  - 새 `tam_auth` 쿠키 발급
- `PATCH /api/family/pin`
  - parent verify 필요
  - body: `{ currentPIN, newPIN }`

### Missions

- `GET /api/missions`
- `GET /api/missions/:id`
- `GET /api/missions/today`
  - response: `{ mission, reason }`
- `GET /api/missions/tomorrow`
  - response: `{ mission, reason }`

### Sessions

- `POST /api/sessions`
  - body: `{ missionId }`
  - response: `{ sessionId, startedAt, reused }`
- `GET /api/sessions?childId=...&status=completed&limit=10`
  - response: `{ sessions: [{ sessionId, missionId, missionTitle, category, completedAt, choiceSummary }] }`
- `GET /api/sessions/:sessionId`
  - response: `SessionDetail`
- `PATCH /api/sessions/:sessionId/choice`
  - body: `{ choiceId, reflectionNote? }`
  - invariant: initial choice는 1회만 기록 가능
- `PATCH /api/sessions/:sessionId/reaction`
  - body: `{ roundIndex, emotionId, emotionLabel, methodId, methodLabel, valueTags }`
  - invariant: 해당 round가 먼저 생성돼 있어야 함
- `PATCH /api/sessions/:sessionId/tool`
  - body: `{ roundIndex, toolType }`
- `PATCH /api/sessions/:sessionId/closing`
  - body: `{ closingResponse }`
- `PATCH /api/sessions/:sessionId/complete`
  - body: `{ mirrorId? }`

### AI

- `POST /api/ai/scenario-round`
  - body: `{ sessionId, roundIndex }`
  - response: `{ round }`
- `POST /api/ai/thinking-tool`
  - body: `{ sessionId, roundIndex, toolType }`
  - response: `{ card }`
- `POST /api/ai/epilogue`
  - body: `{ sessionId }`
  - response: `{ epilogue }`
- `POST /api/ai/mirror`
  - body: `{ sessionId }`
  - response: `{ mirror }`
  - invariant: epilogue가 먼저 생성돼 있어야 함

### Profiles / Reports

- `GET /api/profiles/:childId`
  - response: `{ profile }`
- `POST /api/profiles/:childId/recalculate`
  - response: `{ profile, updated: true }`
- `GET /api/reports/:childId/weekly?week=YYYY-MM-DD`
  - parent verify 필요
  - response: `{ report }`
- `GET /api/reports/:childId/list`
  - parent verify 필요
  - response: `{ reports }`
- `POST /api/reports/:reportId/pdf`
  - parent verify 필요
  - response: `{ downloadUrl, expiresAt }`
  - `downloadUrl`는 15분짜리 signed same-origin URL
  - 프론트는 이 URL을 그대로 열거나 다운로드 링크로 사용하면 됨

## 권장 프론트 플로우

### 아이 플로우

1. `GET /api/family/me`
2. `GET /api/missions/today`
3. `POST /api/sessions`
4. `PATCH /api/sessions/:id/choice`
5. `POST /api/ai/scenario-round` for round 0
6. `PATCH /api/sessions/:id/reaction`
7. 필요 시 `PATCH /api/sessions/:id/tool` + `POST /api/ai/thinking-tool`
8. round 1, round 2 반복
9. `POST /api/ai/epilogue`
10. `PATCH /api/sessions/:id/closing`
11. `POST /api/ai/mirror`
12. `PATCH /api/sessions/:id/complete`
13. `GET /api/profiles/:childId`

### 부모 플로우

1. `POST /api/auth/verify-pin`
2. `GET /api/reports/:childId/weekly`
3. 필요 시 `GET /api/reports/:childId/list`

## 오류 semantics

- 인증 누락: `401`
- 부모 검증 필요: `403` with code `PARENT_VERIFICATION_REQUIRED`
- 리소스 없음: `404`
- 세션 상태 위반: `409`
- 잘못된 reset/download 토큰: `401`

에러 포맷은 공통으로 아래를 따른다.

```json
{
  "error": {
    "code": "SOME_CODE",
    "message": "Human readable message"
  }
}
```

## 구현 메모

- 세션 상세 응답은 프론트가 더미 `ScenarioChain` 전체를 한 번에 들고 있지 않아도 되게 구성돼 있다.
- 생성된 round, thinking tool, epilogue, mirror는 모두 서버에 저장되므로 재진입 시 다시 요청 가능하다.
- 첫 7일 미션 배정은 spec 순서를 따른다.
- 8일차 이후는 미경험 카테고리, low-confidence discovery 축, 최근 3일 중복 회피를 반영한다.
- `db:seed`, `db:generate`, `db:migrate`, `test`, `build` 기준으로 백엔드 경로는 검증돼 있다.
- PDF export는 내부 signed download URL 방식으로 동작하므로 blob storage를 프론트가 신경 쓸 필요는 없다.
