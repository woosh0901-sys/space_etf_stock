# Space ETF Dashboard - 프로젝트 가이드

## 프로젝트 개요

우주 산업 ETF (UFO, ARKX) 보유 종목 비교 및 분석 대시보드

### 기술 스택
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (globals.css)
- **Data**: Yahoo Finance API, Google News RSS

### 주요 기능
| 기능 | 설명 |
|------|------|
| ETF 비교 | UFO/ARKX 보유 종목, 중복 종목 표시 |
| 실시간 주가 | Yahoo Finance에서 1분마다 갱신 |
| 차트 모달 | TradingView 위젯 연동 |
| 뉴스 페이지 | 우주 뉴스 한국어 번역 |
| ETF 분석 | 가격 변동 원인 (기여 종목) 표시 |

### 폴더 구조
```
src/
├── app/
│   ├── api/
│   │   ├── quotes/        # 주가 데이터 API
│   │   ├── news/          # 종목별 뉴스 API
│   │   ├── space-news/    # 우주 뉴스 (한국어 번역)
│   │   └── etf-analysis/  # ETF 변동 분석 API
│   ├── news/              # 뉴스 페이지 (/news)
│   └── globals.css
├── components/
│   ├── Dashboard.tsx      # 메인 대시보드
│   ├── TabNavigation.tsx  # 상단 탭 (대시보드/뉴스)
│   ├── ETFCard.tsx        # ETF 카드
│   ├── ETFAnalysis.tsx    # ETF 변동 분석
│   ├── HoldingsTable.tsx  # 종목 테이블
│   └── ChartModal.tsx     # 차트 모달
├── lib/
│   ├── etf-data.ts        # ETF 데이터 처리
│   └── stock-api.ts       # 주가 API 호출
└── data/
    ├── ufo-holdings.json  # UFO 보유 종목
    └── arkx-holdings.json # ARKX 보유 종목
```

---

## 디자인 시스템 (Design Pattern)

> **7가지 원칙으로 일관된 UI 유지**

### 디자인 토큰 (CSS Variables)

| 카테고리 | 토큰 | 값 |
|---------|------|-----|
| **8px 그리드** | `--space-1` ~ `--space-10` | 8px ~ 80px (8px 단위) |
| **Radius** | `--radius-sm/md/lg` | 8px / 12px / 16px |
| **그림자** | `--shadow-sm/md/lg` | 3단계 box-shadow |
| **컬러** | `--color-primary` | #4f8cff (파랑) |
| | `--color-accent` | #06b6d4 (청록) |
| | `--color-success` | #22c55e (초록) |
| | `--color-danger` | #ef4444 (빨강) |
| **타이포** | `--text-xs` ~ `--text-3xl` | 12px ~ 40px |
| **애니메이션** | `--transition-fast/normal/slow` | 200ms / 250ms / 300ms |

### 코딩 규칙

```css
/* ✅ DO: 토큰 사용 */
padding: var(--space-4);
border-radius: var(--radius-lg);
transition: all var(--transition-slow);

/* ❌ DON'T: 하드코딩 */
padding: 32px;
border-radius: 20px;
transition: all 0.3s ease;
```

### 금지 항목
- ❌ 보라색 (`#a855f7`) 사용 금지
- ❌ 네온/그라데이션 효과 금지
- ❌ 5개 초과 색상 사용 금지

---

## 앱 기능 (Features)

| 기능 | 컴포넌트 | 설명 |
|------|---------|------|
| ETF 비교 | `Dashboard.tsx` | UFO/ARKX 보유 종목, 중복 표시 |
| 실시간 주가 | `HoldingsTable.tsx` | 1분마다 갱신 |
| 차트 모달 | `ChartModal.tsx` | TradingView 연동 |
| ETF 분석 | `ETFAnalysis.tsx` | 변동 원인 (기여 종목) |
| ⭐ 관심종목 | `Watchlist.tsx` | localStorage 저장 |
| 💰 포트폴리오 시뮬레이터 | `PortfolioSimulator.tsx` | UFO/ARKX 비율 조절 |
| 🏆 Top Movers | `TopMovers.tsx` | 상승/하락 Top 5 |
| 🔔 실적발표 캘린더 | `EarningsCalendar.tsx` | 예정 일정 표시 |
| 🌙 다크모드 토글 | `ThemeToggle.tsx` | 테마 전환 |

---

# Security Protocol (보안 프로토콜)

> **⚠️ 이 규칙은 모든 코드 작업에 필수로 적용됩니다.**

## 필수 보안 체크리스트

### 네트워크 보안
- [ ] **CORS/Preflight** - 허용된 Origin만 접근, Preflight 요청 처리
- [ ] **HTTPS/HSTS** - 보안 연결 강제, 보안 헤더 설정

### 인증/인가
- [ ] **AuthN/AuthZ** - 인증/인가 분리, 토큰 검증
- [ ] **RBAC/ABAC + 테넌트 격리** - 역할 기반 접근 제어, 멀티테넌트 격리
- [ ] **최소 권한 원칙** - 필요한 권한만 부여

### 입력/출력 보안
- [ ] **Validation + SQLi 방어** - 입력값 검증, Parameterized Query 사용
- [ ] **XSS + CSP** - 출력 이스케이프, Content-Security-Policy 헤더
- [ ] **CSRF** - Anti-CSRF 토큰 적용
- [ ] **SSRF** - 서버 사이드 요청 검증, 화이트리스트 적용

### 세션/쿠키 보안
- [ ] **쿠키 설정** - `HttpOnly`, `Secure`, `SameSite` 필수
- [ ] **세션 보안** - 세션 타임아웃, 재생성

### 운영 보안
- [ ] **Secret 관리 + Rotation** - 환경변수 사용, 주기적 교체
- [ ] **RateLimit/Bruteforce 방어** - 요청 제한, 로그인 시도 제한
- [ ] **AuditLog** - 중요 작업 감사 로그
- [ ] **의존성 취약점 점검** - npm audit, 취약 패키지 업데이트

---

## Mandatory Error Handling Rules (절대 규칙)

### AppError 구조
```typescript
class AppError extends Error {
  constructor(
    public code: string,        // validation|auth|forbidden|notfound|conflict|rate-limit|internal
    public status: number,
    public details?: unknown
  ) {
    super(code);
  }
}
```

### 전역 에러 핸들러 필수
- **RequestID** 포함
- **운영 응답**: 스택/내부정보/SQL/키 **노출 금지**
- **로그 필수 포함**: `requestId`, `user/tenant`, `path`, `code`, `stack`

### 에러 코드 분리
| Code | Status | 용도 |
|------|--------|-----|
| `validation` | 400 | 입력값 검증 실패 |
| `auth` | 401 | 인증 실패 |
| `forbidden` | 403 | 권한 없음 |
| `notfound` | 404 | 리소스 없음 |
| `conflict` | 409 | 충돌 (중복 등) |
| `rate-limit` | 429 | 요청 제한 초과 |
| `internal` | 500 | 서버 내부 오류 |

---

## 테스트 요구사항

**⚠️ 위 모든 보안 항목이 반영되고, 테스트까지 통과한 결과만 제출할 것!**

---

## 자동 배포 규칙

> 모든 작업 완료 후 보안 체크 및 테스트 통과 시 자동으로 GitHub에 푸시

### 작업 완료 후 자동 실행 절차
```bash
# 1. 빌드 검증
npm run build

# 2. 보안 검사 (의존성 취약점)
npm audit

# 3. Git 커밋 & 푸시
git add .
git commit -m "feat: [기능명] 구현 완료"
git push origin main
```

### 커밋 메시지 규칙
- `feat:` - 새 기능 추가
- `fix:` - 버그 수정
- `refactor:` - 코드 리팩토링
- `style:` - CSS/스타일 변경
- `docs:` - 문서 수정
- `chore:` - 설정/환경 변경
