# 06. 부모 대시보드 & 리포트

> 부모가 아이의 성장 패턴을 이해하기 위한 주간 리포트 생성 및 관리.

## 범위

- 주간 리포트 자동 생성
- 부모 대시보드 데이터 조회
- 가이드 코멘트 (AI 생성)
- PDF 내보내기
- 알림 (주간 리포트 발송)

이 문서는 **부모 관점의 데이터 가공과 전달**만 다룹니다. 원본 프로필 데이터는 `05-profile-insights`에서, 인증은 `01-auth-and-users`에서 다룹니다.

---

## 데이터 모델

### WeeklyReport

```typescript
interface WeeklyReport {
  id: string;
  childId: string;             // 아이 프로필 ID
  weekStart: string;           // "2024-03-25" (월요일)
  weekEnd: string;             // "2024-03-31" (일요일)
  generatedAt: string;

  summary: {
    missionsCompleted: number;
    totalMinutes: number;
    streak: number;
    worldsExplored: string[];  // ["화성 도시", "동물구조센터", ...]
  };

  patterns: PatternObservation[];   // 2~3개
  interestChanges: InterestDelta[];
  guideComment: string;            // AI 생성 종합 관찰
}
```

### PatternObservation

```typescript
interface PatternObservation {
  title: string;             // "완성도보다 독특함을 자주 선택했어요"
  detail: string;            // "5번 중 4번, 정돈된 결과보다 새로운 시도를 골랐습니다."
  stat?: string;             // "5번 중 4번"
}
```

### InterestDelta

```typescript
interface InterestDelta {
  category: string;          // "디자인 & 창작"
  currentScore: number;      // 82
  previousScore: number;     // 75
  delta: number;             // +7
  trend: "up" | "stable" | "exploring";
}
```

---

## API 엔드포인트

### GET /reports/:childId/weekly?week={weekStart}

특정 주차 리포트 조회. 없으면 자동 생성.

```
Response:
{
  "report": {
    "id": "report-abc123",
    "weekStart": "2024-03-25",
    "summary": {
      "missionsCompleted": 7,
      "totalMinutes": 52,
      "streak": 7,
      "worldsExplored": ["화성 도시", "동물구조센터", "초등학교 급식실", "중학교 교실", "우리 집", "놀이공원", "광고 회사"]
    },
    "patterns": [
      {
        "title": "완성도보다 독특함을 자주 선택했어요",
        "detail": "선택의 순간에서 '안전한 정답'보다 '특이한 시도'를 택한 비율이 높았습니다.",
        "stat": "5번 중 4번"
      },
      {
        "title": "다른 사람을 돕는 역할에서 몰입도가 높았어요",
        "detail": "리더, 디자이너 등 역할 중 '타인을 위해 일하는' 미션에서 대화량이 가장 많았습니다.",
        "stat": "시장, 중재자"
      },
      {
        "title": "AI 도구를 적극적으로 활용하기 시작했어요",
        "detail": "초반에는 기본 선택만 했지만, 4일차부터 '더 넓혀보기'와 '다른 시각' 도구를 사용하기 시작했습니다.",
        "stat": "지난주 대비 2배"
      }
    ],
    "interestChanges": [
      { "category": "디자인 & 창작", "currentScore": 82, "previousScore": 75, "delta": 7, "trend": "up" },
      { "category": "리더십 & 관리", "currentScore": 70, "previousScore": 70, "delta": 0, "trend": "stable" },
      { "category": "감정 & 관계", "currentScore": 58, "previousScore": 51, "delta": 7, "trend": "up" },
      { "category": "과학 & 탐구", "currentScore": 45, "previousScore": 42, "delta": 3, "trend": "exploring" }
    ],
    "guideComment": "서연이는 '지금 눈앞의 사람'을 먼저 생각하는 경향이 있습니다. 효율보다 공감을 선택하는 순간이 많았고, 한번 내린 결정은 끝까지 밀고 나가는 모습을 보여주었습니다. 아직 탐험 초반이지만, 자기 기준이 서서히 만들어지고 있는 모습이 인상적입니다."
  }
}
```

### GET /reports/:childId/list

전체 주간 리포트 목록 (아카이브).

```
Response:
{
  "reports": [
    { "id": "report-abc", "weekStart": "2024-03-25", "missionsCompleted": 7 },
    { "id": "report-def", "weekStart": "2024-03-18", "missionsCompleted": 5 },
    ...
  ]
}
```

### POST /reports/:reportId/pdf

PDF 다운로드 생성.

```
Response:
{
  "downloadUrl": "https://blob.vercel-storage.com/reports/report-abc.pdf",
  "expiresAt": "2024-04-01T00:00:00Z"
}
```

---

## 가이드 코멘트 생성 (AI)

주간 리포트의 `guideComment`는 AI가 생성합니다.

### 시스템 프롬프트

```
[역할]
너는 '탐 가이드'야. 아이의 탐험 데이터를 보고 부모님에게 관찰 소감을 전달해.

[규칙]
1. 존댓말 사용 (부모님 대상).
2. 3~4문장으로 간결하게.
3. 구체적 미션 이름이나 선택을 언급해서 근거를 보여줘.
4. "잘했다/못했다" 표현 금지. 관찰과 발견만.
5. 마지막 문장은 앞으로의 방향 제안.

[입력]
- 이번 주 미션 목록 + 선택 요약
- 5축 발견 현재 상태
- 관심 영역 변화
- 생각 도구 사용 통계
```

---

## 리포트 생성 트리거

```
매주 일요일 자정 (KST) → 크론잡
    ↓
해당 주 완료 세션 수 > 0 인 아이 전체 대상
    ↓
POST /ai/guide-comment (가이드 코멘트 생성)
    ↓
WeeklyReport 저장
    ↓
부모에게 알림 발송 (이메일 / 앱 푸시)
```

---

## 부모 대시보드 vs 아이 프로필 차이

| 항목 | 아이 (`/profile`) | 부모 (`/parent`) |
|---|---|---|
| 말투 | 반말 ("~했네", "~인 것 같아") | 존댓말 ("~했습니다", "~보입니다") |
| 데이터 깊이 | 감정적 인사이트 (자기 발견) | 구체적 수치 + 추세 + 통계 |
| 관심 영역 | 점수만 | 지난주 대비 변화량 (delta) |
| 가이드 코멘트 | 없음 | AI 생성 종합 관찰 |
| 주간 요약 | 없음 | 탐험한 세계 목록 + 미션 수 + 시간 |
| 과거 열람 | 최근 탐험 타임라인 | 주차별 아카이브 |
| PDF 내보내기 | 없음 | 가능 |

---

## 더미 데이터 연결

| 더미 데이터 | 위치 | 대체할 기능 |
|---|---|---|
| `/parent` 페이지 하드코딩된 패턴 3개 | `app/(app)/parent/page.tsx` | `GET /reports/:childId/weekly` → patterns[] |
| `/parent` 관심 영역 변화 (+7, 유지, 탐색 중) | `app/(app)/parent/page.tsx` | `GET /reports/:childId/weekly` → interestChanges[] |
| `/parent` 가이드 코멘트 텍스트 | `app/(app)/parent/page.tsx` | `POST /ai/guide-comment` |
| `SEOYEON_PROFILE` 일부 | `lib/dummy-data.ts` | `GET /profiles/:childId` (부모 권한으로 조회) |

---

## 프론트엔드 사용처

| 화면 | API 호출 | 표시하는 데이터 |
|---|---|---|
| `/parent` 주간 요약 | `GET /reports/:childId/weekly` | summary (미션 수, 시간, 세계 목록) |
| `/parent` 발견된 패턴 | `GET /reports/:childId/weekly` | patterns[] (3개 카드) |
| `/parent` 관심 영역 변화 | `GET /reports/:childId/weekly` | interestChanges[] (바 차트 + delta) |
| `/parent` 가이드 코멘트 | `GET /reports/:childId/weekly` | guideComment (AI 텍스트) |
| `/parent` 이전 주 보기 | `GET /reports/:childId/list` | 아카이브 리스트 |
| `/parent` PDF 다운로드 | `POST /reports/:reportId/pdf` | downloadUrl |
