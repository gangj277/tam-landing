# Survey Creation Workflow: Google Forms via Apps Script

> 이 문서는 가설 기반 설문을 설계하고, Google Apps Script를 통해 Google Forms로 자동 생성하는 전체 워크플로우를 기록한다.

---

## Phase 1: 설문 목적 및 대상 정의

### 입력
- 제품/서비스에 대한 설명
- 타겟 고객군
- 설문의 목적 (가설 검증, 시장 조사, 베타 모객 등)

### 수행
1. 제품이 해결하려는 핵심 문제를 한 문장으로 정의한다.
2. 설문 대상(타겟 응답자)의 인구통계적 특성을 명확히 한다.
3. 설문 결과로 얻고자 하는 의사결정 포인트를 나열한다.

### 출력 예시
```
- 제품: AI가 아이와 대화하며 흥미/강점을 발견해주는 초등교육 앱
- 타겟: 초등학생 자녀를 둔 학부모
- 목적: (1) 제품 가설 4개 간접 검증 (2) 베타 유저 모객
- 의사결정: 가설 통과 시 MVP 런칭, 실패 시 피봇 방향 결정
```

---

## Phase 2: 검증 가설 설정

### 입력
- Phase 1에서 정의한 제품과 목적

### 수행
1. 검증해야 할 가설을 3~5개 설정한다.
2. 각 가설에 대해 **측정 방법**과 **검증 기준(수치)**을 사전 정의한다.
3. 가설은 깔때기 구조로 배치한다: 문제 인식 → 니즈 강도 → 대안 부재 → 솔루션 수용도

### 가설 설계 원칙
- 가설은 반증 가능해야 한다 — "검증 기준"을 미리 정해두고, 그 수치를 넘지 못하면 가설이 기각된다.
- 가설 간 종속 관계를 명시한다 — H1이 기각되면 H2~H4는 의미가 없을 수 있다.
- 검증 기준은 보수적으로 잡는다 — 설문 응답은 실제 행동보다 항상 긍정적이다.

### 출력 예시
```
| ID | 가설 | 측정 방법 | 검증 기준 |
|----|------|----------|----------|
| H1 | 부모는 "자기이해/흥미발견"을 교육 우선순위로 본다 | 강제 순위 매기기 | 6개 항목 중 평균 3위 이내 |
| H2 | 부모는 아이가 자기 흥미를 충분히 파악하지 못한다고 느낀다 | 행동 기반 질문 | "잘 모르겠다" 30%↑ |
| H3 | 현재 마땅한 해결 수단이 없다 | 현재 수단 + 불만 | "특별히 없음" 30%↑ |
| H4 | AI 기반 솔루션에 수용도가 있다 | 3인칭 프레이밍 + WTP | 유료 의향 30%↑ |
```

---

## Phase 3: 설문 설계 Best Practice 조사

### 핵심 원칙 (리서치 기반)

#### 3-1. 편향 제거

| 편향 유형 | 설명 | 대응 방법 |
|-----------|------|----------|
| **사회적 바람직성 편향** | 응답자가 "좋은 부모"로 보이는 답을 선택 | 행동 기반 질문, 3인칭 프레이밍 |
| **동의 편향 (Acquiescence)** | 리커트 척도에서 무조건 4~5점 체크 | 강제 순위 매기기, MaxDiff, 포인트 배분 |
| **순서 효과** | 먼저 나온 선택지를 더 많이 선택 | 선택지 순서 랜덤화 |
| **유도 질문** | 질문 자체가 답을 암시 | 중립적 프레이밍, 부정 선택지 포함 |
| **후광 효과** | 솔루션 설명 후 앞 답변을 수정 | 섹션 간 뒤로가기 차단 |

#### 3-2. 간접 측정 기법

직접 질문 ("X가 중요합니까?")은 무조건 높게 나온다. 대신:

1. **강제 순위 매기기**: 6개 항목 중 1~6위를 매기게 한다. "다 중요하다"가 불가능하므로 진짜 우선순위가 드러난다.
2. **포인트 배분 (100점)**: "교육비 100을 나눠 적으시오" → 말(태도)과 돈(행동)의 괴리를 측정.
3. **3인칭 프레이밍**: "당신이 쓸 건가요?" 대신 "주변에 관심 가질 사람이 몇 명?" → 체면 압박을 우회하면서 자기 투사(projection)를 유도.
4. **가격 앵커 내장**: 사용 의향 질문에 무료/유료 가격대를 선택지로 포함 → WTP(지불의향)를 동시 측정.
5. **2개 제한 체크박스**: "가장 아쉬운 점 2개만" → 진짜 페인포인트만 필터링.

#### 3-3. 깔때기 구조 (Funnel Structure)

설문의 순서가 응답 품질을 결정한다:

```
[스크리닝] → [행동 기반 넓은 질문] → [문제 탐색] → [구체적 페인포인트] → [솔루션 노출]
```

- **앞 섹션에서 제품을 절대 언급하지 않는다.** 솔루션 노출은 마지막 섹션에서만.
- **뒤로가기를 차단한다.** 솔루션을 본 후 앞 답변을 바꾸면 데이터가 오염된다.
- **배포 문구에도 제품 키워드를 넣지 않는다.** "AI 교육 앱 설문"이 아니라 "아이 교육에 대한 의견 조사"로 모객.

#### 3-4. 한국 학부모 특화 고려사항

- 사회적 바람직성 편향이 특히 높다 — "아이 자율성 존중하시나요?" 같은 질문은 무조건 "네".
- 동의 편향이 15~25% — 리커트 5점 척도의 4~5점 비율이 실제보다 부풀려진다.
- 교육비/학원 관련 질문은 방어적 응답을 유발할 수 있다 — 중립적 프레이밍 사용.
- 온라인 익명 설문이 대면/전화보다 솔직한 답을 끌어낸다.

---

## Phase 4: 설문 기획서 작성

### 입력
- Phase 2의 가설 목록
- Phase 3의 설계 원칙

### 수행

각 질문에 대해 다음을 명시하는 기획서를 작성한다:

```markdown
### Q{N}. {질문 텍스트}
- **유형**: 객관식 / 체크박스 / 드롭다운 / 그리드 / 단답형 / 선형 배율
- **필수**: O / X
- **선택지**: [목록]
- **의도**: 이 질문이 어떤 가설을 어떻게 검증하는지
- **검증**: 구체적 수치 기준
- **설정**: 랜덤화, 최대 선택 수 제한, 뒤로가기 차단 등
```

### 기획서 구조

```
1. 폼 메타 설정 (제목, 설명, 진행률, 뒤로가기 차단 등)
2. 가설 ↔ 질문 매핑 테이블
3. 섹션별 질문 상세 (위 포맷)
4. 분석 프레임워크 (가설별 판정표, 크로스탭 분석 계획)
5. 배포 가이드 (채널, 문구, 최소 표본 수)
6. 인턴/실행자용 체크리스트
```

### 출력
- `docs/survey/PARENT_SURVEY_SPEC.md` 파일로 저장

---

## Phase 5: Google Forms 자동 생성 (Playwright + Apps Script)

### 왜 Apps Script인가

Google Forms UI를 Playwright로 직접 조작하면 다음 문제가 발생한다:
- 모든 질문의 옵션 텍스트박스가 동일한 `role="textbox" name="옵션 값"`을 공유 → 질문 간 옵션이 꼬임
- 섹션, 그리드, 체크박스 유효성 검사 등 복잡한 UI 조작이 불안정
- 10개 이상의 질문을 만들려면 수백 번의 개별 클릭/타이핑 필요

**해결**: Google Forms의 bound Apps Script를 통해 `FormApp` API로 폼을 코드 한 번에 생성한다.

### 단계별 실행

#### Step 1: Google Forms 빈 폼 생성

```
Playwright: navigate to https://docs.google.com/forms/create
→ 빈 폼이 생성되고, 고유 Form ID가 URL에 포함됨
→ 예: https://docs.google.com/forms/d/{FORM_ID}/edit
```

**주의**: 구글 로그인이 필요하다. Playwright 브라우저에서 이미 로그인되어 있지 않으면, 사용자에게 먼저 로그인을 요청해야 한다.

#### Step 2: Apps Script 편집기 열기

```
Playwright: 폼 편집 화면에서 "더보기" 메뉴 클릭 → "Apps Script" 클릭
→ 새 탭에서 Apps Script 편집기가 열림
→ Code.gs 파일이 기본 생성되어 있음 (function myFunction() {})
```

#### Step 3: 설문 생성 스크립트 작성 및 붙여넣기

Apps Script 편집기는 Monaco Editor를 사용한다. 직접 텍스트박스 클릭이 안 되므로:

```javascript
// Playwright에서 Monaco Editor에 코드 붙여넣기
await page.evaluate((code) => {
  navigator.clipboard.writeText(code);
}, scriptCode);

const editor = page.locator('.monaco-editor .view-line').first();
await editor.click({ force: true });
await page.keyboard.press('Meta+A');  // 전체 선택
await page.keyboard.press('Meta+V');  // 붙여넣기
```

#### Step 4: Apps Script 코드 구조

```javascript
function buildSurvey() {
  var form = FormApp.getActiveForm();
  
  // 1. 기존 항목 전부 삭제 (멱등성 보장)
  var items = form.getItems();
  for (var i = items.length - 1; i >= 0; i--) {
    form.deleteItem(i);
  }
  
  // 2. 폼 메타 설정
  form.setTitle('설문 제목');
  form.setDescription('설문 설명');
  form.setProgressBar(true);
  form.setAllowResponseEdits(false);       // 제출 후 수정 불가
  form.setShowLinkToRespondAgain(false);    // 재응답 링크 숨김
  
  // 3. 섹션 1 질문 추가
  // --- 드롭다운 (ListItem) ---
  var q = form.addListItem();
  q.setTitle('질문 텍스트');
  q.setChoiceValues(['선택지1', '선택지2', '선택지3']);
  q.setRequired(true);
  
  // --- 섹션 구분 (PageBreakItem) ---
  form.addPageBreakItem()
    .setTitle('섹션 제목')
    .setHelpText('섹션 설명');
  
  // --- 객관식 (MultipleChoiceItem) ---
  var mc = form.addMultipleChoiceItem();
  mc.setTitle('질문 텍스트');
  mc.setChoiceValues(['옵션1', '옵션2', '옵션3']);
  mc.showOtherOption(true);  // "기타" 옵션 추가
  mc.setRequired(true);
  
  // --- 체크박스 (CheckboxItem) ---
  var cb = form.addCheckboxItem();
  cb.setTitle('질문 텍스트');
  cb.setChoiceValues(['옵션1', '옵션2', '옵션3']);
  cb.showOtherOption(true);
  cb.setRequired(true);
  // 최대 N개 선택 제한
  cb.setValidation(
    FormApp.createCheckboxValidation()
      .requireSelectAtMost(2)
      .build()
  );
  
  // --- 그리드 (GridItem) — 순위 매기기용 ---
  var grid = form.addGridItem();
  grid.setTitle('순위를 매겨주세요');
  grid.setRows(['항목A', '항목B', '항목C']);
  grid.setColumns(['1위', '2위', '3위']);
  grid.setRequired(true);
  
  // --- 단답형 (TextItem) — 숫자 입력용 ---
  var txt = form.addTextItem();
  txt.setTitle('숫자를 입력하세요');
  txt.setRequired(true);
  txt.setValidation(
    FormApp.createTextValidation()
      .setHelpText('숫자만 입력해주세요')
      .requireNumber()
      .build()
  );
  
  // --- 설명 텍스트 (SectionHeaderItem) ---
  var header = form.addSectionHeaderItem();
  header.setTitle('소제목');
  header.setHelpText('긴 설명 텍스트...');
  
  // 4. 결과 로깅
  Logger.log('생성 완료! 응답 URL: ' + form.getPublishedUrl());
}
```

#### Step 5: 스크립트 저장 및 실행

```
Playwright:
1. Cmd+S로 저장 → "프로젝트 저장 중..." 메시지 확인
2. 실행 버튼 클릭 (함수 선택 드롭다운에 "buildSurvey"가 표시됨)
3. 첫 실행 시 권한 승인 필요:
   - "승인 필요" 다이얼로그 → "권한 검토" 클릭
   - Google OAuth 동의 화면이 팝업/같은 탭에서 열림
   - 계정 선택 → 권한 허용
4. 스크립트 실행 완료 대기 (실행 로그에서 "실행이 완료됨" 확인)
5. 로그에서 응답 URL 추출
```

**실행 로그 확인 방법**:
- Apps Script 편집기 하단의 "실행 로그" 패널에 표시됨
- `Logger.log()`로 출력한 URL이 여기에 나타남

#### Step 6: 폼 게시

```
Playwright:
1. Google Forms 편집 탭으로 전환
2. 페이지 새로고침 (스크립트가 변경한 내용 반영)
3. "게시" 버튼 클릭
4. 게시 다이얼로그에서 "링크가 있는 모든 사용자에게 공개" 확인
5. "게시" 확인 버튼 클릭
```

### 최종 산출물

| 항목 | URL 패턴 |
|------|---------|
| 편집 URL | `https://docs.google.com/forms/d/{FORM_ID}/edit` |
| 응답 URL | `https://docs.google.com/forms/d/e/{PUBLISHED_ID}/viewform` |
| Apps Script | `https://script.google.com/home/projects/{SCRIPT_ID}/edit` |

---

## 전체 프로세스 요약

```
[Phase 1] 목적·대상 정의
    ↓
[Phase 2] 가설 설정 (3~5개, 깔때기 구조)
    ↓
[Phase 3] Best Practice 리서치
    │  - 편향 제거 (사회적 바람직성, 동의, 순서)
    │  - 간접 측정 (강제 순위, 포인트 배분, 3인칭)
    │  - 깔때기 구조 (넓은→좁은→솔루션)
    │  - 문화권 특화 고려
    ↓
[Phase 4] 설문 기획서 작성
    │  - 질문별: 유형, 선택지, 의도, 검증 기준
    │  - 분석 프레임워크, 배포 가이드
    ↓
[Phase 5] Google Forms 자동 생성
    │  Step 1: Playwright → forms/create (빈 폼)
    │  Step 2: 더보기 → Apps Script 편집기 열기
    │  Step 3: Monaco Editor에 스크립트 붙여넣기
    │  Step 4: 저장 (Cmd+S)
    │  Step 5: 실행 → 권한 승인 → 완료 대기
    │  Step 6: Forms 탭 → 새로고침 → 게시
    ↓
[완료] 응답 URL 배포
```

---

## 트러블슈팅

### Google Forms UI 직접 조작 실패
- **증상**: Playwright로 옵션 텍스트박스를 채울 때, 다른 질문의 옵션이 수정됨
- **원인**: 모든 옵션이 `role="textbox" name="옵션 값"`이라는 동일한 셀렉터를 공유
- **해결**: UI 조작 대신 Apps Script 사용

### Monaco Editor 클릭 불가
- **증상**: `ref`로 텍스트박스를 클릭하면 타임아웃 발생
- **원인**: `.view-line` div가 textarea를 가리고 있음
- **해결**: `.locator('.monaco-editor .view-line').first().click({ force: true })`로 강제 클릭 후 Cmd+A, Cmd+V

### 권한 승인 팝업
- **증상**: 첫 실행 시 "승인 필요" 다이얼로그 표시
- **해결**: "권한 검토" 클릭 → OAuth 동의 화면 처리. 팝업이 별도 탭에서 열릴 수 있으므로 `browser_tabs` 확인.

### 게시 전 응답 URL 접근 불가
- **증상**: `getPublishedUrl()`로 얻은 URL에 접속하면 "오류" 페이지
- **원인**: 스크립트 실행만으로는 폼이 게시되지 않음
- **해결**: Forms 편집기에서 명시적으로 "게시" 버튼을 클릭해야 함

### 폼 편집기 로딩 오류
- **증상**: Apps Script 실행 직후 Forms 편집기에서 "Google Docs에 오류가 발생했습니다" 표시
- **원인**: 서버 측에서 폼 구조 변경이 반영되는 데 지연
- **해결**: 2~3초 대기 후 페이지 새로고침
