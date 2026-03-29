# 01. 인증 & 사용자 관리

> 가족 계정, 아이 프로필, 부모 모드 전환을 다룹니다.

## 범위

- 가족 계정 생성 (부모가 가입)
- 아이 프로필 생성/전환 (멀티 차일드)
- 부모 모드 PIN 보호
- 기기 기반 세션 유지
- 온보딩 플로우

이 문서는 **계정 구조와 인증**만 다룹니다. 아이의 학습 데이터는 `05-profile-insights`에서 다룹니다.

---

## 핵심 설계: 가족 계정 + 모드 전환

```
┌─────────────────────────────────────┐
│  FamilyAccount (하나의 계정)          │
│  owner: 부모 휴대폰 번호로 가입            │
│  parentPIN: 4자리 (부모 모드 잠금)    │
│                                      │
│  children: [                         │
│    { id: "child-1", name: "서연", age: 12, isDefault: true },
│    { id: "child-2", name: "민준", age: 10 },
│  ]                                   │
│                                      │
│  activeChildId: "child-1" (현재 사용자)│
└─────────────────────────────────────┘
```

**왜 이 구조인가:**
- 부모가 앱스토어에서 다운 → 가입 → 아이 프로필 만들어서 건넴 (가장 자연스러운 흐름)
- 아이는 로그인 개념 없이 앱 열면 바로 자기 화면
- 형제가 같은 기기 공유 시 프로필 전환만으로 해결
- 부모 대시보드는 PIN 하나로 보호 (무겁지 않게)

---

## 데이터 모델

### FamilyAccount

```typescript
interface FamilyAccount {
  id: string;                // UUID
  ownerPhone: string;        // 부모 휴대폰 번호 (로그인용)
  ownerName: string;         // "김지영"
  passwordHash: string;
  parentPIN: string;         // 4자리 숫자 ("1234")
  children: ChildProfile[];
  activeChildId: string;     // 현재 활성 아이 프로필
  createdAt: string;
  deviceTokens: string[];    // 기기 기반 세션 유지용
}
```

### ChildProfile

```typescript
interface ChildProfile {
  id: string;                // "child-seoyeon"
  familyId: string;          // 소속 가족 계정
  name: string;              // "서연"
  age: number;               // 12
  avatarSeed?: string;       // 프로필 아바타 시드 (자동 생성)
  isDefault: boolean;        // 앱 열면 기본으로 진입하는 프로필
  onboardedAt?: string;      // 첫 미션 완료 시점
  createdAt: string;
}
```

---

## 사용자 플로우

### 1. 온보딩 (첫 설치)

```
앱 설치 → 첫 실행
    ↓
┌─────────────────────────────────┐
│  "탐에 오신 걸 환영합니다"          │
│                                  │
│  먼저 부모님 정보를 입력해주세요     │
│                                  │
│  휴대폰: [            ]           │
│  비밀번호: [          ]           │
│                                  │
│  [다음]                           │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  아이 프로필을 만들어주세요          │
│                                  │
│  이름: [서연    ]                 │
│  나이: [12      ]                │
│                                  │
│  (나중에 더 추가할 수 있어요)       │
│                                  │
│  [시작하기]                       │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  부모님 비밀번호를 설정해주세요      │
│  (아이가 부모 화면을 보지 않도록)    │
│                                  │
│  4자리 PIN: [●●●●]              │
│                                  │
│  [완료]                           │
└─────────────────────────────────┘
    ↓
아이 프로필로 자동 진입 → /home
```

**총 3단계, 30초 이내 완료 목표.**

### 2. 평소 사용 (아이)

```
앱 열기
    ↓
activeChildId의 프로필로 자동 진입
    ↓
/home ("안녕, 서연") → 미션 시작
```

- 로그인 화면 없음
- 기기 토큰으로 세션 자동 유지
- 앱 열면 바로 홈 화면

### 3. 프로필 전환 (형제)

```
/home 헤더의 프로필 아이콘 탭
    ↓
┌─────────────────────────────────┐
│  누가 탐험할 차례야?              │
│                                  │
│  ┌──────┐  ┌──────┐             │
│  │  🌸  │  │  🌊  │             │
│  │ 서연  │  │ 민준  │             │
│  │ 12세  │  │ 10세  │             │
│  └──────┘  └──────┘             │
│                                  │
│  + 아이 추가 (부모 PIN 필요)       │
└─────────────────────────────────┘
    ↓
탭하면 즉시 전환 (PIN 불필요)
```

- 아이 간 전환은 자유 (서로의 기록을 보는 건 아니므로 문제 없음)
- 각 아이는 자기 `/home`, `/profile`만 보임
- 아이 추가는 부모 PIN 필요

### 4. 부모 모드 전환

```
하단 네비 "부모님" 탭 클릭
    ↓
┌─────────────────────────────────┐
│                                  │
│         🔒                       │
│                                  │
│  부모님 비밀번호를 입력해주세요      │
│                                  │
│  [  ●  ●  ○  ○  ]              │
│                                  │
│  잊었어요? → 휴대폰 재설정         │
└─────────────────────────────────┘
    ↓
PIN 일치 → /parent (부모 대시보드)
    ↓
아이 전환 드롭다운으로 다른 자녀 리포트 열람
    ↓
뒤로가기 or 홈 탭 → 자동으로 아이 모드 복귀
```

- PIN은 세션 내 캐시 (앱 완전 종료 전까지 재입력 불필요)
- 5분 비활성 시 자동 잠금

### 5. 다른 기기에서 로그인

```
새 기기에서 앱 설치
    ↓
"이미 계정이 있어요" → 휴대폰 번호 + 비밀번호 로그인
    ↓
기존 가족 계정 + 모든 아이 프로필 동기화
    ↓
activeChildId 선택 → 사용 시작
```

- 부모 폰 + 아이 태블릿에서 동시 사용 가능
- 아이 데이터는 실시간 동기화

---

## API 엔드포인트

### POST /auth/signup

가족 계정 생성 (온보딩).

```
Request:
{
  "ownerPhone": "01012345678",
  "ownerName": "김지영",
  "password": "...",
  "parentPIN": "1234",
  "firstChild": {
    "name": "서연",
    "age": 12
  }
}

Response:
{
  "familyId": "family-abc123",
  "token": "jwt-token-here",
  "activeChild": {
    "id": "child-seoyeon",
    "name": "서연",
    "age": 12
  }
}
```

### POST /auth/login

휴대폰 번호 + 비밀번호 로그인 (다른 기기 or 재로그인).

```
Request:
{
  "phone": "01012345678",
  "password": "..."
}

Response:
{
  "familyId": "family-abc123",
  "token": "jwt-token-here",
  "children": [
    { "id": "child-seoyeon", "name": "서연", "age": 12, "isDefault": true },
    { "id": "child-minjun", "name": "민준", "age": 10, "isDefault": false }
  ],
  "activeChildId": "child-seoyeon"
}
```

### POST /auth/verify-pin

부모 모드 전환 시 PIN 검증.

```
Request:
{
  "familyId": "family-abc123",
  "pin": "1234"
}

Response:
{
  "verified": true,
  "expiresIn": 300    // 5분 후 자동 잠금
}
```

### POST /family/children

아이 프로필 추가 (부모 PIN 인증 후).

```
Request:
{
  "familyId": "family-abc123",
  "name": "민준",
  "age": 10
}

Response:
{
  "child": {
    "id": "child-minjun",
    "name": "민준",
    "age": 10,
    "isDefault": false
  }
}
```

### PATCH /family/active-child

활성 아이 프로필 전환.

```
Request:
{
  "familyId": "family-abc123",
  "childId": "child-minjun"
}

Response:
{
  "activeChildId": "child-minjun",
  "name": "민준"
}
```

### GET /family/me

현재 가족 계정 정보 + 모든 아이 프로필 조회.

```
Response:
{
  "familyId": "family-abc123",
  "ownerName": "김지영",
  "ownerPhone": "01012345678",
  "children": [
    { "id": "child-seoyeon", "name": "서연", "age": 12, "isDefault": true },
    { "id": "child-minjun", "name": "민준", "age": 10, "isDefault": false }
  ],
  "activeChildId": "child-seoyeon"
}
```

### PATCH /family/pin

부모 PIN 변경.

```
Request:
{
  "currentPIN": "1234",
  "newPIN": "5678"
}
```

### POST /auth/reset-pin

PIN 분실 시 휴대폰으로 재설정.

---

## 인증 토큰 구조

```typescript
// JWT payload
interface AuthToken {
  familyId: string;          // 가족 계정 ID
  activeChildId: string;     // 현재 활성 아이
  deviceId: string;          // 기기 식별자
  parentVerified: boolean;   // PIN 인증 여부 (부모 모드)
  parentVerifiedAt?: string; // PIN 인증 시점 (5분 후 만료)
  iat: number;
  exp: number;
}
```

- 아이 모드: `parentVerified = false` → `/parent` 접근 시 PIN 요구
- 부모 모드: `parentVerified = true` + 5분 TTL → 만료 시 자동 잠금
- 아이 전환: `activeChildId` 변경 → 새 토큰 발급

---

## 더미 데이터 연결

| 더미 데이터 | 대체할 기능 |
|---|---|
| `SEOYEON_PROFILE.id = "user-seoyeon"` | `ChildProfile.id` (= `child-seoyeon`) |
| `SEOYEON_PROFILE.name = "서연"` | `ChildProfile.name` |
| `SEOYEON_PROFILE.age = 12` | `ChildProfile.age` |
| `/home` 헤더 "안녕, 서연" | `GET /family/me` → `activeChild.name` |
| `/parent` 전체 | `POST /auth/verify-pin` → `GET /profiles/:childId` |

---

## 프론트엔드 사용처

| 화면 | 사용하는 API | 시점 |
|---|---|---|
| 온보딩 (미구현) | `POST /auth/signup` | 앱 첫 실행 |
| `/home` 헤더 | `GET /family/me` → `activeChild.name` | 페이지 로드 |
| `/home` 프로필 전환 | `PATCH /family/active-child` | 프로필 아이콘 탭 |
| `/parent` 진입 | `POST /auth/verify-pin` | "부모님" 탭 클릭 |
| `/parent` 자녀 전환 | `PATCH /family/active-child` | 드롭다운 선택 |
| 설정 (미구현) | `POST /family/children` | "아이 추가" |
| 설정 (미구현) | `PATCH /family/pin` | "PIN 변경" |

---

## 다른 명세서에 미치는 영향

### 03-sessions.md

```
변경: userId → childId
- 세션은 아이 프로필 단위로 생성
- POST /sessions { childId, missionId } (userId 대신 childId)
```

### 05-profile-insights.md

```
변경: userId → childId
- 프로필/인사이트는 아이 단위
- GET /profiles/:childId
```

### 06-parent-reports.md

```
변경: 부모 인증 방식
- GET /reports/:childId/weekly → PIN 인증 필요
- 부모 대시보드에서 자녀 드롭다운으로 전환
```

---

## 설계 원칙

1. **부모가 먼저 가입, 아이에게 건넴**: 앱스토어 → 가입 → 아이 프로필 → 건넴이 가장 자연스러운 흐름.
2. **아이는 로그인 없음**: 앱 열면 바로 홈. 기기 토큰으로 자동 유지.
3. **형제 전환은 자유, 부모 모드는 잠금**: 아이끼리는 서로 데이터가 섞이지 않으므로 자유 전환. 부모 리포트는 PIN으로 보호.
4. **PIN은 가볍게**: 4자리 숫자. 생체인증 같은 무거운 방법 아님. 아이에게 "부모님 비밀번호야"라고 한마디면 충분.
5. **멀티 디바이스**: 부모 폰 + 아이 태블릿 동시 사용. 데이터 실시간 동기화.
