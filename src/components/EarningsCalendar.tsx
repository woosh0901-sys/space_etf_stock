'use client';

// 주요 종목 실적발표 일정 (2026년 Q1 예상)
const EARNINGS_DATA = [
    { ticker: 'AAPL', name: '애플', date: '2026-01-30', quarter: 'Q1 FY26' },
    { ticker: 'AMZN', name: '아마존', date: '2026-02-06', quarter: 'Q4 FY25' },
    { ticker: 'GOOGL', name: '구글', date: '2026-02-04', quarter: 'Q4 FY25' },
    { ticker: 'MSFT', name: '마이크로소프트', date: '2026-01-28', quarter: 'Q2 FY26' },
    { ticker: 'TSLA', name: '테슬라', date: '2026-01-29', quarter: 'Q4 FY25' },
    { ticker: 'LMT', name: '록히드마틴', date: '2026-01-21', quarter: 'Q4 FY25' },
    { ticker: 'NOC', name: '노스롭그루먼', date: '2026-01-30', quarter: 'Q4 FY25' },
    { ticker: 'BA', name: '보잉', date: '2026-01-29', quarter: 'Q4 FY25' },
    { ticker: 'RTX', name: '레이시온', date: '2026-01-28', quarter: 'Q4 FY25' },
];

export default function EarningsCalendar() {
    const today = new Date();

    const upcomingEarnings = EARNINGS_DATA
        .filter(e => new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    const pastEarnings = EARNINGS_DATA
        .filter(e => new Date(e.date) < today)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        return `${month}/${day} (${dayNames[date.getDay()]})`;
    };

    const getDaysUntil = (dateStr: string) => {
        const date = new Date(dateStr);
        const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 0) return '오늘';
        if (diff === 1) return '내일';
        return `${diff}일 후`;
    };

    return (
        <div className="earnings-calendar">
            <h3 className="earnings-title">🔔 실적발표 캘린더</h3>

            {upcomingEarnings.length > 0 && (
                <div className="earnings-section upcoming">
                    <h4>예정된 발표</h4>
                    <div className="earnings-list">
                        {upcomingEarnings.map(e => (
                            <div key={e.ticker} className="earnings-item">
                                <div className="earnings-info">
                                    <span className="earnings-ticker">{e.ticker}</span>
                                    <span className="earnings-name">{e.name}</span>
                                </div>
                                <div className="earnings-date">
                                    <span className="date-text">{formatDate(e.date)}</span>
                                    <span className="days-until">{getDaysUntil(e.date)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {pastEarnings.length > 0 && (
                <div className="earnings-section past">
                    <h4>최근 발표</h4>
                    <div className="earnings-list">
                        {pastEarnings.map(e => (
                            <div key={e.ticker} className="earnings-item past">
                                <div className="earnings-info">
                                    <span className="earnings-ticker">{e.ticker}</span>
                                    <span className="earnings-name">{e.name}</span>
                                </div>
                                <div className="earnings-date">
                                    <span className="date-text">{formatDate(e.date)}</span>
                                    <span className="quarter">{e.quarter}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
