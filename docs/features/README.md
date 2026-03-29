# 탐 (TAM) 백엔드 기능 명세서

> 각 문서는 하나의 독립적인 백엔드 도메인을 다루며, MECE 원칙에 따라 기능 간 중복 없이 전체를 커버합니다.

## 구조

```
docs/features/
├── 01-auth-and-users.md      ← 가족 계정, 아이 프로필 전환, 부모 PIN
├── 02-missions.md             ← 미션 데이터 관리, 배정 로직
├── 03-sessions.md             ← 세션 생명주기, 선택/리액션 기록
├── 04-ai-generation.md        ← 시나리오 생성, 에필로그, 미러 피드백
├── 05-profile-insights.md     ← 프로필 집계, 발견 패턴, 관심 영역
└── 06-parent-reports.md       ← 부모 대시보드, 주간 리포트
```

## 도메인 간 데이터 흐름

```
[01 Auth] → userId 발급
    ↓
[02 Missions] → 오늘의 미션 배정
    ↓
[03 Sessions] → 세션 생성 → 선택/리액션 기록
    ↓
[04 AI Generation] → 시나리오 결과 생성 → 에필로그 → 미러 피드백
    ↓
[05 Profile Insights] → 누적 패턴 분석 → 발견 업데이트
    ↓
[06 Parent Reports] → 주간 리포트 생성
```

## 더미 데이터 → 백엔드 매핑

| 더미 데이터 | 파일 위치 | 대체할 백엔드 기능 | 명세서 |
|---|---|---|---|
| `MISSIONS[]` | `lib/dummy-data.ts` | DB에서 미션 조회 | 02-missions |
| `getTodayMission()` | `lib/dummy-data.ts` | 미션 배정 알고리즘 | 02-missions |
| `getScenarioChain()` | `lib/dummy-data.ts` | AI 실시간 시나리오 생성 | 04-ai-generation |
| `MARS_SCENARIO_CHAIN` | `lib/dummy-data.ts` | AI 실시간 시나리오 생성 | 04-ai-generation |
| `SEOYEON_SESSION` | `lib/dummy-data.ts` | 세션 CRUD API | 03-sessions |
| `SEOYEON_PROFILE` | `lib/dummy-data.ts` | 프로필 집계 엔진 | 05-profile-insights |
| `PAST_SESSIONS[]` | `lib/dummy-data.ts` | 세션 히스토리 조회 | 03-sessions |
