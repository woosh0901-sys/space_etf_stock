# 🚀 Space ETF Dashboard

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TradingView](https://img.shields.io/badge/TradingView-Charts-131722?style=for-the-badge&logo=tradingview)

**UFO ETF & ARKX ETF 보유 종목을 한눈에 볼 수 있는 대시보드**

[데모 보기](#) · [버그 리포트](https://github.com/woosh0901-sys/space_etf_stock/issues)

</div>

---

## ✨ Features

| 기능 | 설명 |
|------|------|
| 📊 **통합 대시보드** | UFO, ARKX 두 ETF의 모든 보유 종목을 한 화면에서 확인 |
| 💰 **ETF 실시간 가격** | UFO/ARKX ETF 현재가 및 등락률 표시 |
| 📈 **TradingView 차트** | 종목/ETF 클릭 시 차트 모달로 표시 |
| 🔗 **중복 종목 탐지** | 두 ETF에 공통으로 포함된 종목 자동 하이라이트 |
| 🇰🇷 **한국어 지원** | 회사명 한글(영문) 형식으로 표시 |
| 🔍 **실시간 검색** | 티커, 회사명, 섹터로 빠른 검색 |
| 📱 **반응형** | 데스크톱, 태블릿, 모바일 모두 지원 |

---

## 📸 사용법

### ETF 차트 보기
UFO 또는 ARKX 카드를 클릭하면 해당 ETF의 TradingView 차트가 모달로 표시됩니다.

### 개별 종목 차트 보기
테이블에서 원하는 종목 행을 클릭하면 해당 종목의 차트가 표시됩니다.

---

## 🛠️ Tech Stack

```
Frontend     → Next.js 15 + React 18 + TypeScript
Styling      → Tailwind CSS 4 + CSS Variables
Charts       → TradingView Widget
Stock Data   → Yahoo Finance API
Analytics    → Firebase Analytics
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
├── app/
│   ├── api/quotes/       # 주가 API Route
│   ├── page.tsx          # 메인 페이지
│   └── globals.css       # 스타일
├── components/
│   ├── Dashboard.tsx     # 메인 대시보드
│   ├── ETFCard.tsx       # ETF 카드 (가격 표시)
│   ├── HoldingsTable.tsx # 종목 테이블
│   ├── ChartModal.tsx    # TradingView 차트 모달
│   └── SearchFilter.tsx  # 검색 & 필터
├── data/                 # ETF 보유 종목 JSON
└── lib/                  # 유틸리티
```

---

## 🚢 Deployment

### Vercel (권장)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/woosh0901-sys/space_etf_stock)

---

## ⚠️ Disclaimer

> 이 대시보드는 정보 제공 목적으로만 사용됩니다.  
> **투자 조언이 아닙니다.** 투자 결정 전 전문가와 상담하세요.

---

<div align="center">
  
**⭐ Star를 눌러주세요! ⭐**

</div>
