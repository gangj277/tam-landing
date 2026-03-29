# 탐 (TAM) — CTO 핸드오프 문서

> 작성일: 2026-03-29
> 현재 상태: **더미 데이터 기반 프론트엔드 완성 → 백엔드 구현 착수 단계**

---

## 1. 프로젝트 개요

**탐**은 초등~중학생(10~14세)이 매일 5~10분간 AI 기반 인터랙티브 시나리오를 체험하며, 가치관과 의사결정 패턴을 발견하는 교육 플랫폼입니다.

### 핵심 루프

```
매일 1개 미션 배정
→ 세계 진입 (Encounter): 역할 + 상황 몰입
→ 초기 선택 (Choice): 3개 선택지 중 택 1
→ 시나리오 체인 (Act): 3라운드 × 감정+방식 리액션 카드
→ 에필로그: AI가 선택 기반으로 생성한 결과 장면
→ 거울 (Mirror): AI가 선택 패턴 관찰 피드백
→ 프로필 업데이트: 5축 발견 + 관심 영역 맵 누적
```

### 차별점

- **타이핑 제로**: 채팅이 아님. 감정 카드 × 방식 카드 탭으로 반응 (7번 탭으로 미션 완료)
- **AI-native**: 매 플레이마다 시나리오 결과/에필로그/미러가 다르게 생성
- **평가 아닌 거울**: 점수/등급 없음. 선택 패턴을 관찰형으로 비춰줄 뿐

---

## 2. 현재 상태

### 완성된 것 (프론트엔드)

| 화면 | 경로 | 상태 | 설명 |
|------|------|------|------|
| 랜딩페이지 | `/` | ✅ 완성 | 부모 대상 마케팅 페이지 (기존) |
| 홈 | `/home` | ✅ 더미 완성 | 오늘의 미션 + 스트릭 + 히스토리 |
| 미션 인트로 | `/mission/[id]` | ✅ 더미 완성 | 시네마틱 세계 진입 (화성 돔 SVG) |
| 미션 플레이 | `/mission/[id]/play` | ✅ 더미 완성 | 선택 → 시나리오 체인 → 에필로그 → 클로징 |
| 거울 | `/mission/[id]/mirror` | ✅ 더미 완성 | 성찰 피드백 + 관찰 카드 |
| 내 기록 | `/profile` | ✅ 더미 완성 | 5축 발견 + 관심 영역 맵 + 탐험 기록 |
| 부모 대시보드 | `/parent` | ✅ 더미 완성 | 주간 리포트 + 패턴 + 가이드 코멘트 |

### 안 된 것 (백엔드)

- DB 스키마 & 마이그레이션
- API 라우트 (세션 CRUD, 프로필 조회 등)
- AI 연동 (시나리오/에필로그/미러 생성)
- 인증 (가족 계정, PIN)
- 프로필 집계 엔진

---

## 3. 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 16.2.1 |
| 언어 | TypeScript | 5.x |
| 스타일링 | Tailwind CSS | 4.x |
| React | React | 19.2.4 |
| DB | Neon Postgres | — |
| AI | OpenRouter API | — |
| 배포 | Vercel | — |
| 폰트 | Pretendard Variable | — |

### 아직 설치 안 된 패키지 (백엔드 구현 시 필요)

```bash
# DB
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit

# AI
npm install ai @ai-sdk/openai
# 또는 OpenRouter 직접 호출 시:
npm install openai  # OpenRouter는 OpenAI 호환 API

# 인증
npm install jose  # JWT 토큰 생성/검증
npm install bcryptjs  # 비밀번호 해싱
```

---

## 4. 환경변수

`.env.local` 설정 완료:

| 변수명 | 용도 | 설정 상태 |
|--------|------|----------|
| `DATABASE_URL` | Neon Postgres 연결 | ✅ 설정됨 |
| `OPENROUTER_API_KEY` | AI 모델 호출 | ✅ 설정됨 |

### 추후 추가 예정

| 변수명 | 용도 | 시점 |
|--------|------|------|
| `JWT_SECRET` | 토큰 서명 | 인증 구현 시 |
| `UPSTASH_REDIS_REST_URL` | 세션 캐시 | 성능 최적화 시 |
| `RESEND_API_KEY` | 이메일 발송 | 부모 알림 구현 시 |

---

## 5. 프로젝트 구조

```
ai-native-student-app/
├── app/
│   ├── (landing)/page.tsx          ← 랜딩페이지
│   ├── (app)/
│   │   ├── layout.tsx              ← 앱 공통 레이아웃 (하단 네비, 430px 컨테이너)
│   │   ├── home/page.tsx           ← 홈
│   │   ├── mission/[id]/
│   │   │   ├── page.tsx            ← 미션 인트로
│   │   │   ├── play/page.tsx       ← 미션 플레이 (핵심)
│   │   │   └── mirror/page.tsx     ← 거울
│   │   ├── profile/page.tsx        ← 내 기록
│   │   └── parent/page.tsx         ← 부모 대시보드
│   ├── layout.tsx                  ← 루트 레이아웃
│   ├── globals.css                 ← 전역 스타일 + 애니메이션
│   └── icon.svg                    ← 파비콘
├── lib/
│   ├── types.ts                    ← 전체 TypeScript 인터페이스
│   ├── dummy-data.ts               ← 더미 데이터 (백엔드 대체 예정)
│   └── useInView.ts                ← Intersection Observer 훅
├── components/
│   └── landing/                    ← 랜딩페이지 컴포넌트 14개
├── docs/
│   ├── APP_SPEC.md                 ← 전체 앱 기획서 v0.1
│   ├── LANDING_PAGE_SPEC.md        ← 랜딩페이지 기획서
│   ├── HANDOFF.md                  ← 이 문서
│   └── features/                   ← 백엔드 기능 명세서
│       ├── README.md               ← 명세서 인덱스 + 더미 데이터 매핑
│       ├── 01-auth-and-users.md    ← 가족 계정, PIN, 아이 프로필
│       ├── 02-missions.md          ← 미션 CRUD, 배정 알고리즘
│       ├── 03-sessions.md          ← 세션 생명주기, 리액션 기록
│       ├── 04-ai-generation.md     ← 시나리오/에필로그/미러 AI 생성
│       ├── 05-profile-insights.md  ← 5축 발견 + 관심 영역 계산
│       └── 06-parent-reports.md    ← 부모 리포트, 가이드 코멘트
└── .env.local                      ← 환경변수 (git 제외)
```

---

## 6. 더미 데이터 → API 전환 가이드

현재 모든 페이지는 `lib/dummy-data.ts`에서 데이터를 가져옵니다. 백엔드 구현 시 이 파일의 각 export를 API 호출로 교체하면 됩니다.

| 더미 export | 사용하는 페이지 | 대체할 API | 명세서 |
|---|---|---|---|
| `getTodayMission()` | `/home` | `GET /api/missions/today` | 02 |
| `getMissionById(id)` | `/mission/[id]`, `/play`, `/mirror` | `GET /api/missions/:id` | 02 |
| `getScenarioChain(id)` | `/play` | `POST /api/ai/scenario-round` (실시간 생성) | 04 |
| `MARS_SCENARIO_CHAIN` | `/play` | `POST /api/ai/scenario-round` (실시간 생성) | 04 |
| `SEOYEON_SESSION` | `/mirror` | `GET /api/sessions/:id` | 03 |
| `SEOYEON_PROFILE` | `/home`, `/profile`, `/parent` | `GET /api/profiles/:childId` | 05 |
| `PAST_SESSIONS` | `/home`, `/profile` | `GET /api/sessions?childId=...&status=completed` | 03 |

### 전환 전략

더미 데이터를 한 번에 교체하지 말고, **페이지 단위로 순차 전환**을 권장합니다:

```
Phase 1: DB 스키마 + 미션 시드 → GET /api/missions 교체
Phase 2: 세션 CRUD → POST/PATCH /api/sessions 교체
Phase 3: AI 연동 → POST /api/ai/* 교체 (getScenarioChain 제거)
Phase 4: 프로필 집계 → GET /api/profiles 교체
Phase 5: 인증 → 가족 계정 + PIN
Phase 6: 부모 리포트 → GET /api/reports 교체
```

---

## 7. 핵심 데이터 모델 요약

상세 인터페이스는 `lib/types.ts`에 전부 정의되어 있습니다. 핵심만:

```
FamilyAccount (01)
  └── ChildProfile[] (01)
        └── MissionSession[] (03)
              ├── initialChoice (03)
              ├── ReactionRecord[] (03) — 감정 × 방식 × 3라운드
              ├── ToolUsageRecord[] (03)
              ├── closingResponse (03)
              └── MirrorResult (04) — AI 생성
        └── UserProfile (05)
              ├── stats (스트릭, 총 미션 수)
              ├── discoveries (5축)
              └── interestMap (4카테고리)

Mission (02) — 정적 콘텐츠
  ├── choices[]
  ├── aiContext (persona, followUpAngles, expansionTools)
  └── worldSetting

ScenarioChain (04) — AI가 실시간 생성
  ├── ScenarioRound[] × 3
  │     ├── consequence (narrative + newDilemma)
  │     ├── emotionOptions[3]
  │     ├── methodOptions[3]
  │     └── thinkingTools[3]
  └── EpilogueScene (4 scenes + closingLine)

WeeklyReport (06) — 크론잡으로 생성
  ├── patterns[3]
  ├── interestChanges[4]
  └── guideComment (AI 생성)
```

---

## 8. AI 프롬프트 설계

`04-ai-generation.md`에 4개 AI 호출 지점의 시스템 프롬프트 초안이 포함되어 있습니다:

1. **시나리오 결과 생성** — 아이의 리액션 → 다음 상황 카드 + 새 선택지
2. **생각 도구 응답** — 만약에.../그 사람은.../전혀 다르게
3. **에필로그 생성** — 4개 결과 장면 (mood 태깅)
4. **미러 피드백** — 2개 관찰 + 패턴 비교 + 다음 제안

모델 추천: `anthropic/claude-sonnet-4.6` (OpenRouter 경유). 한국어 품질 + 지시 따르기가 가장 좋습니다.

---

## 9. 구현 우선순위 제안

| 순서 | 작업 | 의존성 | 예상 기간 |
|------|------|--------|----------|
| **1** | DB 스키마 + 미션 7개 시드 | Neon 연결 | — |
| **2** | `GET /api/missions/:id` + `GET /api/missions/today` | #1 | — |
| **3** | 세션 CRUD API (`POST/PATCH/GET /api/sessions`) | #1 | — |
| **4** | AI 시나리오 생성 (`POST /api/ai/scenario-round`) | OpenRouter | — |
| **5** | AI 에필로그 + 미러 생성 | #4 | — |
| **6** | 프론트 연동 (더미 → API 교체) | #2~5 | — |
| **7** | 프로필 집계 엔진 | #3 | — |
| **8** | 가족 계정 + PIN 인증 | — | — |
| **9** | 부모 리포트 + 가이드 코멘트 | #7~8 | — |

**#1~6이 MVP입니다.** 인증(#8)은 나중에 붙여도 동작합니다.

---

## 10. 로컬 개발 시작

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 확인
cat .env.local   # DATABASE_URL, OPENROUTER_API_KEY 확인

# 3. 개발 서버
npm run dev

# 4. 더미 데이터로 동작 확인
# http://localhost:3000/home          ← 홈
# http://localhost:3000/mission/mission-mars-mayor       ← 미션 인트로
# http://localhost:3000/mission/mission-mars-mayor/play   ← 플레이
# http://localhost:3000/mission/mission-mars-mayor/mirror ← 거울
# http://localhost:3000/profile       ← 내 기록
# http://localhost:3000/parent        ← 부모 대시보드
```

---

## 11. 명세서 읽는 순서

1. **`docs/APP_SPEC.md`** — 전체 제품 기획 (데이터 모델 + 화면별 설계 + 더미 데이터)
2. **`docs/features/README.md`** — 6개 백엔드 도메인 인덱스 + 더미 매핑 표
3. **`docs/features/04-ai-generation.md`** — 가장 복잡한 부분. AI 프롬프트 설계 포함.
4. **`docs/features/03-sessions.md`** — 세션 생명주기 플로우차트 포함.
5. **`docs/features/01-auth-and-users.md`** — 가족 계정 구조 + 온보딩 플로우.
6. 나머지 (`02`, `05`, `06`)는 필요 시 참조.

---

## 12. 질문이 있을 때

- **데이터 구조**: `lib/types.ts` 참조
- **더미 데이터 예시**: `lib/dummy-data.ts` 참조
- **화면 동작**: 로컬 서버 띄워서 직접 클릭해보기
- **AI 프롬프트**: `docs/features/04-ai-generation.md`의 시스템 프롬프트 섹션
- **디자인 의도**: `docs/APP_SPEC.md`의 설계 원칙 섹션
