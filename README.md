# 🚀 Space ETF Dashboard

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)

**UFO ETF & ARKX ETF 보유 종목을 한눈에 볼 수 있는 대시보드**

[데모 보기](#) · [버그 리포트](https://github.com/woosh0901-sys/space_etf_stock/issues) · [기능 요청](https://github.com/woosh0901-sys/space_etf_stock/issues)

</div>

---

## ✨ Features

| 기능 | 설명 |
|------|------|
| 📊 **통합 대시보드** | UFO, ARKX 두 ETF의 모든 보유 종목을 한 화면에서 확인 |
| 🔗 **중복 종목 탐지** | 두 ETF에 공통으로 포함된 종목 자동 하이라이트 |
| 🔍 **실시간 검색** | 티커, 회사명, 섹터로 빠른 검색 |
| 🎛️ **필터링** | 전체 / UFO만 / ARKX만 / 중복 종목 필터 |
| 🌙 **우주 테마** | 다크 모드 기반 글래스모피즘 디자인 |
| 📱 **반응형** | 데스크톱, 태블릿, 모바일 모두 지원 |
| 🔒 **보안** | CSP, HSTS, Rate Limiting 적용 |

---

## 🛠️ Tech Stack

```
Frontend     → Next.js 15 + React 18 + TypeScript
Styling      → Tailwind CSS 4 + CSS Variables
Analytics    → Firebase Analytics
Security     → CSP, HSTS, XSS Protection, Rate Limiting
Deployment   → Vercel (권장)
```

---

## 🚀 Quick Start

```bash
# 1. 저장소 클론
git clone https://github.com/woosh0901-sys/space_etf_stock.git
cd space_etf_stock

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 열기
# http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/                   # Next.js App Router
│   ├── page.tsx          # 메인 페이지
│   ├── layout.tsx        # 레이아웃 + SEO
│   └── globals.css       # 글로벌 스타일
├── components/           # React 컴포넌트
│   ├── Dashboard.tsx     # 메인 대시보드
│   ├── ETFCard.tsx       # ETF 정보 카드
│   ├── HoldingsTable.tsx # 보유 종목 테이블
│   └── SearchFilter.tsx  # 검색 & 필터
├── data/                 # ETF 데이터
│   ├── ufo-holdings.json
│   └── arkx-holdings.json
├── lib/                  # 유틸리티
│   ├── firebase.ts       # Firebase 설정
│   └── etf-data.ts       # 데이터 처리
└── middleware.ts         # 보안 미들웨어
```

---

## 📊 ETF 정보

### UFO - Procure Space ETF
- **추종 지수**: S-Network Space Index
- **운용사**: Procure ETFs
- **테마**: 우주 산업 전반 (위성, 발사체, 지구관측 등)

### ARKX - ARK Space Exploration & Innovation ETF
- **운용사**: ARK Invest
- **테마**: 우주 탐사 및 혁신 기업
- **특징**: 캐시 우드의 액티브 운용

---

## 🔄 데이터 업데이트

`src/data/` 폴더의 JSON 파일을 수정하여 최신 보유 종목을 반영할 수 있습니다:

```json
{
  "ticker": "RKLB",
  "name": "Rocket Lab USA Inc",
  "weight": 5.21,
  "sector": "Launch Services"
}
```

---

## 🚢 Deployment

### Vercel (권장)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/woosh0901-sys/space_etf_stock)

1. 위 버튼 클릭 또는 [vercel.com](https://vercel.com)에서 저장소 연결
2. 자동 배포 완료!

---

## ⚠️ Disclaimer

> 이 대시보드는 정보 제공 목적으로만 사용됩니다.  
> **투자 조언이 아닙니다.** 투자 결정 전 전문가와 상담하세요.

---

## 📄 License

MIT © 2026

---

<div align="center">
  
**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요! ⭐**

</div>
