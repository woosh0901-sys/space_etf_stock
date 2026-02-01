'use client';

import { useState } from 'react';
import TabNavigation from '@/components/TabNavigation';
import ThemeToggle from '@/components/ThemeToggle';

interface EarningsEvent {
    ticker: string;
    name: string;
    nameKr: string;
    date: string;
    quarter: string;
    estimate?: string;
}

// 주요 우주/방산 기업 실적발표 일정 (2026년 기준)
const EARNINGS_DATA: EarningsEvent[] = [
    { ticker: 'LMT', name: 'Lockheed Martin', nameKr: '록히드마틴', date: '2026-01-28', quarter: 'Q4 FY25', estimate: '$7.23' },
    { ticker: 'NOC', name: 'Northrop Grumman', nameKr: '노스롭그루먼', date: '2026-01-30', quarter: 'Q4 FY25', estimate: '$6.89' },
    { ticker: 'RTX', name: 'Raytheon', nameKr: '레이시온', date: '2026-01-28', quarter: 'Q4 FY25', estimate: '$1.38' },
    { ticker: 'BA', name: 'Boeing', nameKr: '보잉', date: '2026-01-29', quarter: 'Q4 FY25', estimate: '-$1.75' },
    { ticker: 'GD', name: 'General Dynamics', nameKr: '제너럴다이나믹스', date: '2026-01-29', quarter: 'Q4 FY25', estimate: '$3.85' },
    { ticker: 'AAPL', name: 'Apple', nameKr: '애플', date: '2026-01-30', quarter: 'Q1 FY26', estimate: '$2.35' },
    { ticker: 'MSFT', name: 'Microsoft', nameKr: '마이크로소프트', date: '2026-01-28', quarter: 'Q2 FY26', estimate: '$3.12' },
    { ticker: 'GOOGL', name: 'Alphabet', nameKr: '알파벳', date: '2026-02-04', quarter: 'Q4 FY25', estimate: '$2.01' },
    { ticker: 'AMZN', name: 'Amazon', nameKr: '아마존', date: '2026-02-06', quarter: 'Q4 FY25', estimate: '$1.47' },
    { ticker: 'NVDA', name: 'NVIDIA', nameKr: '엔비디아', date: '2026-02-26', quarter: 'Q4 FY26', estimate: '$0.89' },
    { ticker: 'TSLA', name: 'Tesla', nameKr: '테슬라', date: '2026-01-29', quarter: 'Q4 FY25', estimate: '$0.73' },
    { ticker: 'RKLB', name: 'Rocket Lab', nameKr: '로켓랩', date: '2026-02-25', quarter: 'Q4 FY25', estimate: '-$0.08' },
];

export default function CalendarPage() {
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedEvents = [...EARNINGS_DATA].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const filteredEvents = sortedEvents.filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        if (filter === 'upcoming') return eventDate >= today;
        if (filter === 'past') return eventDate < today;
        return true;
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const weekday = weekdays[date.getDay()];
        return `${month}/${day} (${weekday})`;
    };

    const getDaysUntil = (dateStr: string) => {
        const eventDate = new Date(dateStr);
        eventDate.setHours(0, 0, 0, 0);
        const diff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diff === 0) return '오늘';
        if (diff === 1) return '내일';
        if (diff > 0) return `D-${diff}`;
        return `${Math.abs(diff)}일 전`;
    };

    return (
        <>
            <TabNavigation />
            <div className="calendar-page">
                <header className="calendar-header">
                    <h1>📅 실적발표 캘린더</h1>
                    <p>주요 기업 실적발표 일정 및 예상 EPS</p>
                </header>

                <div className="calendar-filters">
                    <button
                        className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setFilter('upcoming')}
                    >
                        📆 예정
                    </button>
                    <button
                        className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
                        onClick={() => setFilter('past')}
                    >
                        ✅ 완료
                    </button>
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        📋 전체
                    </button>
                </div>

                <div className="calendar-list">
                    {filteredEvents.length === 0 ? (
                        <div className="calendar-empty">
                            <span>📭</span>
                            <p>해당하는 일정이 없습니다</p>
                        </div>
                    ) : (
                        filteredEvents.map((event, idx) => {
                            const eventDate = new Date(event.date);
                            eventDate.setHours(0, 0, 0, 0);
                            const isPast = eventDate < today;
                            const isToday = eventDate.getTime() === today.getTime();

                            return (
                                <div
                                    key={`${event.ticker}-${idx}`}
                                    className={`calendar-item ${isPast ? 'past' : ''} ${isToday ? 'today' : ''}`}
                                >
                                    <div className="calendar-date">
                                        <span className="date-main">{formatDate(event.date)}</span>
                                        <span className={`date-badge ${isPast ? 'past' : ''}`}>
                                            {getDaysUntil(event.date)}
                                        </span>
                                    </div>
                                    <div className="calendar-info">
                                        <div className="company-row">
                                            <span className="ticker">{event.ticker}</span>
                                            <span className="name">{event.nameKr}</span>
                                        </div>
                                        <div className="details-row">
                                            <span className="quarter">{event.quarter}</span>
                                            {event.estimate && (
                                                <span className="estimate">예상 EPS: {event.estimate}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <ThemeToggle />
            </div>
        </>
    );
}
