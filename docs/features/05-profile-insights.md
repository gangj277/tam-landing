# 05. 프로필 & 인사이트

> 아이의 누적 선택 데이터를 분석하여 발견 패턴과 관심 영역을 산출합니다.

## 범위

- 5가지 발견 축 (Discovery Insights) 계산
- 관심 영역 맵 (Interest Map) 계산
- 스트릭 및 통계 관리
- 신뢰도 (confidence) 판정

이 문서는 **데이터 집계와 인사이트 산출**만 다룹니다. 원본 세션 데이터는 `03-sessions`에서, AI 분석 텍스트는 `04-ai-generation`에서 다룹니다.

---

## 데이터 모델

### UserProfile

```typescript
interface UserProfile {
  id: string;                  // childId
  name: string;
  age: number;
  createdAt: string;

  stats: {
    totalMissions: number;     // 완료된 세션 수
    currentStreak: number;     // 연속 참여 일수
    longestStreak: number;
    totalMinutes: number;      // 총 체험 시간
  };

  discoveries: {
    worldPreference: DiscoveryInsight;     // 어떤 세계에 끌리는지
    valueOrientation: DiscoveryInsight;    // 무엇을 중요하게 여기는지
    roleEnergy: DiscoveryInsight;          // 어떤 역할에 에너지가 생기는지
    decisionStyle: DiscoveryInsight;       // 어떤 방식으로 결정하는지
    tonePreference: DiscoveryInsight;      // 어떤 분위기를 선호하는지
  };

  interestMap: InterestCategory[];
}
```

### DiscoveryInsight

```typescript
interface DiscoveryInsight {
  label: string;           // "끌리는 세계"
  summary: string;         // AI가 생성한 관찰 요약
  dataPoints: number;      // 이 축의 근거가 된 선택 횟수
  confidence: "low" | "medium" | "high";
  icon: string;
}
```

### InterestCategory

```typescript
interface InterestCategory {
  category: string;        // "디자인 & 창작"
  score: number;           // 0~100
  trend: "up" | "stable" | "exploring";
}
```

---

## API 엔드포인트

### GET /profiles/:childId

프로필 전체 조회.

```
Response:
{
  "profile": {
    "id": "user-seoyeon",
    "name": "서연",
    "age": 12,
    "stats": { "totalMissions": 7, "currentStreak": 7, ... },
    "discoveries": { ... },
    "interestMap": [ ... ]
  }
}
```

### POST /profiles/:childId/recalculate

전체 세션 히스토리를 기반으로 프로필 재계산. 미러 생성 후 자동 트리거.

```
Request:
{
  "triggeredBy": "session-abc123"  // 어떤 세션이 트리거했는지
}

Response:
{
  "updated": true,
  "changes": {
    "discoveries.valueOrientation.confidence": "low → medium",
    "interestMap[0].score": "75 → 82",
    "stats.currentStreak": "6 → 7"
  }
}
```

---

## 5가지 발견 축 계산 로직

### 1. 끌리는 세계 (worldPreference)

**입력 데이터**: 모든 세션의 체류 시간 + 생각 도구 사용 빈도

```
계산:
- 미션 카테고리별 평균 체류 시간 비교
- 생각 도구를 많이 쓴 미션 = 몰입도 높음
- 가장 몰입도 높은 카테고리의 미션 테마를 요약

예시 결과:
  summary: "우주보다 사람들이 사는 마을 이야기에 더 오래 머물러요"
  dataPoints: 7 (전체 미션 수)
  confidence: "medium" (7개면 패턴 보임)
```

### 2. 중요하게 여기는 것 (valueOrientation)

**입력 데이터**: 모든 초기 선택 + 리액션의 valueTags 빈도

```
계산:
- valueTags 빈도 카운트 (empathy: 5, fairness: 4, logic: 3, ...)
- 상위 2개 태그가 핵심 가치
- 가치 간 비교를 자연어로 표현

예시 결과:
  summary: "효율보다 공정함을 고르는 경우가 많아요"
  dataPoints: 5 (value 관련 선택 횟수)
  confidence: "medium"
```

### 3. 에너지가 생기는 역할 (roleEnergy)

**입력 데이터**: 미션별 역할 + 해당 세션의 몰입 지표

```
계산:
- 역할 유형 분류: 리더형 / 창작형 / 조율형 / 관찰형
- 각 유형별 평균 체류 시간 + 도구 사용 횟수
- 가장 몰입도 높은 역할 유형 식별

예시 결과:
  summary: "만드는 역할보다 조율하는 역할에서 몰입도가 높아요"
  dataPoints: 4
  confidence: "low" (4개는 아직 탐색 중)
```

### 4. 결정하는 방식 (decisionStyle)

**입력 데이터**: 리액션 패턴 분석

```
계산:
- 초기 선택 후 반대 의견에 변경 여부 (끝까지 밀고 나감 vs 유연하게 변경)
- 생각 도구 사용 여부 (비교 후 결정 vs 직감으로 결정)
- 결정 속도 (timestamp 간격)

예시 결과:
  summary: "처음 직감으로 고른 뒤 끝까지 밀고 나가는 편이에요"
  dataPoints: 7
  confidence: "medium"
```

### 5. 선호하는 분위기 (tonePreference)

**입력 데이터**: 감정 카드 선택 패턴 + 클로징 응답 톤

```
계산:
- 감정 카드 빈도: 단호 vs 미안 vs 차분 등
- 클로징 응답 텍스트 톤 분석 (AI)
- 진지한 톤 vs 위트 있는 톤 분류

예시 결과:
  summary: "진지한 톤을 더 자주 택해요. 위트보다는 깊이."
  dataPoints: 3
  confidence: "low"
```

---

## 관심 영역 맵 계산 로직

### 카테고리 정의

| 카테고리 | 관련 미션 태그 | 관련 valueTags |
|---------|-------------|--------------|
| 디자인 & 창작 | 디자인, 브랜딩, 카피라이팅 | creativity, emotion |
| 리더십 & 관리 | 리더십, 자원관리, 위기대응 | logic, efficiency, independence |
| 감정 & 관계 | 공감, 다중관점, 감정 | empathy, emotion, community |
| 과학 & 탐구 | 우주, 관찰력, 분석 | logic, adventure |

### 점수 계산

```
score(category) =
  (해당 카테고리 미션 체류 비율) × 40
  + (해당 카테고리 valueTags 빈도 비율) × 40
  + (생각 도구 사용 빈도) × 20

trend 판정:
  - 최근 3일간 점수 변화 > +5 → "up"
  - 최근 3일간 점수 변화 -3 ~ +5 → "stable"
  - dataPoints < 3 → "exploring"
```

---

## 신뢰도 (Confidence) 판정

| dataPoints | confidence | UI 표시 |
|-----------|-----------|---------|
| 0~2 | (미표시) | "아직 탐험 중..." (카드 잠김) |
| 3~4 | "low" | "탐색 중" (흐린 프로그레스 바) |
| 5~9 | "medium" | "윤곽이 보여요" (선명한 프로그레스 바) |
| 10+ | "high" | "뚜렷해요" (풀 프로그레스 바) |

---

## 스트릭 계산

```
매일 자정 (KST) 기준:
  - 어제 completedAt이 있는 세션이 있으면 → currentStreak + 1
  - 없으면 → currentStreak = 0
  - longestStreak = max(longestStreak, currentStreak)
```

---

## 더미 데이터 연결

| 더미 데이터 | 위치 | 대체할 기능 |
|---|---|---|
| `SEOYEON_PROFILE.stats` | `lib/dummy-data.ts` | 스트릭 + 통계 자동 계산 |
| `SEOYEON_PROFILE.discoveries` | `lib/dummy-data.ts` | 5축 분석 엔진 |
| `SEOYEON_PROFILE.interestMap` | `lib/dummy-data.ts` | 관심 영역 점수 계산 |

---

## 프론트엔드 사용처

| 화면 | API 호출 | 표시하는 데이터 |
|---|---|---|
| `/home` 헤더 | `GET /profiles/:childId` | `stats.currentStreak`, `name` |
| `/profile` 전체 | `GET /profiles/:childId` | stats, discoveries (5개), interestMap (4개), 최근 탐험 |
| `/parent` 대시보드 | `GET /profiles/:childId` | stats, discoveries, interestMap + 주간 변화 |

---

## 업데이트 트리거

```
세션 완료 (03-sessions)
    ↓
미러 생성 (04-ai-generation)
    ↓
POST /profiles/:childId/recalculate ← 자동 트리거
    ↓
5축 재계산 + interestMap 재계산 + 스트릭 업데이트
    ↓
프로필 저장
```
