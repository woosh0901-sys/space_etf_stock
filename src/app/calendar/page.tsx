'use client';

import { useState, useMemo } from 'react';
import TabNavigation from '@/components/TabNavigation';
import ThemeToggle from '@/components/ThemeToggle';

interface EarningsEvent {
    ticker: string;
    name: string;
    nameKr: string;
    date: string;
    quarter: string;
    estimate?: string;
    sector?: string;
}

// 주요 우주/방산 기업 실적발표 일정 (2026년 기준)
const EARNINGS_DATA: EarningsEvent[] = [
    { ticker: 'LMT', name: 'Lockheed Martin', nameKr: '록히드마틴', date: '2026-01-28', quarter: 'Q4 FY25', estimate: '$7.23', sector: '방산' },
    { ticker: 'NOC', name: 'Northrop Grumman', nameKr: '노스롭그루먼', date: '2026-01-30', quarter: 'Q4 FY25', estimate: '$6.89', sector: '방산' },
    { ticker: 'RTX', name: 'Raytheon', nameKr: '레이시온', date: '2026-01-28', quarter: 'Q4 FY25', estimate: '$1.38', sector: '방산' },
    { ticker: 'BA', name: 'Boeing', nameKr: '보잉', date: '2026-01-29', quarter: 'Q4 FY25', estimate: '-$1.75', sector: '항공' },
    { ticker: 'GD', name: 'General Dynamics', nameKr: '제너럴다이나믹스', date: '2026-01-29', quarter: 'Q4 FY25', estimate: '$3.85', sector: '방산' },
    { ticker: 'AAPL', name: 'Apple', nameKr: '애플', date: '2026-01-30', quarter: 'Q1 FY26', estimate: '$2.35', sector: '기술' },
    { ticker: 'MSFT', name: 'Microsoft', nameKr: '마이크로소프트', date: '2026-01-28', quarter: 'Q2 FY26', estimate: '$3.12', sector: '기술' },
    { ticker: 'GOOGL', name: 'Alphabet', nameKr: '알파벳', date: '2026-02-04', quarter: 'Q4 FY25', estimate: '$2.01', sector: '기술' },
    { ticker: 'AMZN', name: 'Amazon', nameKr: '아마존', date: '2026-02-06', quarter: 'Q4 FY25', estimate: '$1.47', sector: '기술' },
    { ticker: 'NVDA', name: 'NVIDIA', nameKr: '엔비디아', date: '2026-02-26', quarter: 'Q4 FY26', estimate: '$0.89', sector: 'AI/반도체' },
    { ticker: 'TSLA', name: 'Tesla', nameKr: '테슬라', date: '2026-01-29', quarter: 'Q4 FY25', estimate: '$0.73', sector: '전기차' },
    { ticker: 'RKLB', name: 'Rocket Lab', nameKr: '로켓랩', date: '2026-02-25', quarter: 'Q4 FY25', estimate: '-$0.08', sector: '우주' },
];

export default function CalendarPage() {
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const { filteredEvents, stats } = useMemo(() => {
        const sorted = [...EARNINGS_DATA].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const upcoming = sorted.filter(e => new Date(e.date) >= today);
        const past = sorted.filter(e => new Date(e.date) < today);

        let filtered: EarningsEvent[];
        if (filter === 'upcoming') filtered = upcoming;
        else if (filter === 'past') filtered = past;
        else filtered = sorted;

        return {
            filteredEvents: filtered,
            stats: {
                upcoming: upcoming.length,
                past: past.length,
                thisWeek: upcoming.filter(e => {
                    const d = new Date(e.date);
                    const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
                    return diff <= 7;
                }).length
            }
        };
    }, [filter, today]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        return {
            display: `${month}/${day}`,
            weekday: weekdays[date.getDay()]
        };
    };

    const getDaysInfo = (dateStr: string) => {
        const eventDate = new Date(dateStr);
        eventDate.setHours(0, 0, 0, 0);
        const diff = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diff === 0) return { text: '오늘', className: 'today', urgent: true };
        if (diff === 1) return { text: '내일', className: 'tomorrow', urgent: true };
        if (diff > 0 && diff <= 3) return { text: `D-${diff}`, className: 'soon', urgent: true };
        if (diff > 0) return { text: `D-${diff}`, className: 'upcoming', urgent: false };
        return { text: `${Math.abs(diff)}일 전`, className: 'past', urgent: false };
    };

    const getSectorColor = (sector?: string) => {
        const colors: Record<string, string> = {
            '방산': '#ef4444',
            '항공': '#f97316',
            '기술': '#3b82f6',
            'AI/반도체': '#8b5cf6',
            '전기차': '#22c55e',
            '우주': '#06b6d4',
        };
        return colors[sector || ''] || '#6b7280';
    };

    return (
        <>
            <TabNavigation />
            <div className="calendar-page-new">
                {/* Hero Header */}
                <header className="cal-hero">
                    <div className="cal-hero-content">
                        <h1>📅 실적발표 캘린더</h1>
                        <p>주요 기업 실적발표 일정 및 예상 EPS</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="cal-stats">
                        <div className="cal-stat-card">
                            <span className="stat-value">{stats.thisWeek}</span>
                            <span className="stat-label">이번 주</span>
                        </div>
                        <div className="cal-stat-card">
                            <span className="stat-value">{stats.upcoming}</span>
                            <span className="stat-label">예정</span>
                        </div>
                        <div className="cal-stat-card">
                            <span className="stat-value">{stats.past}</span>
                            <span className="stat-label">완료</span>
                        </div>
                    </div>
                </header>

                {/* Filter Tabs */}
                <div className="cal-filter-tabs">
                    <button
                        className={`cal-tab ${filter === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setFilter('upcoming')}
                    >
                        <span className="tab-icon">📆</span>
                        <span>예정</span>
                        <span className="tab-count">{stats.upcoming}</span>
                    </button>
                    <button
                        className={`cal-tab ${filter === 'past' ? 'active' : ''}`}
                        onClick={() => setFilter('past')}
                    >
                        <span className="tab-icon">✅</span>
                        <span>완료</span>
                        <span className="tab-count">{stats.past}</span>
                    </button>
                    <button
                        className={`cal-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        <span className="tab-icon">📋</span>
                        <span>전체</span>
                    </button>
                </div>

                {/* Events List */}
                <div className="cal-events">
                    {filteredEvents.length === 0 ? (
                        <div className="cal-empty">
                            <span className="empty-icon">📭</span>
                            <p>해당하는 일정이 없습니다</p>
                        </div>
                    ) : (
                        filteredEvents.map((event, idx) => {
                            const dateInfo = formatDate(event.date);
                            const daysInfo = getDaysInfo(event.date);
                            const sectorColor = getSectorColor(event.sector);

                            return (
                                <div
                                    key={`${event.ticker}-${idx}`}
                                    className={`cal-event-card ${daysInfo.className} ${daysInfo.urgent ? 'urgent' : ''}`}
                                >
                                    {/* Date Column */}
                                    <div className="event-date-col">
                                        <span className="event-day">{dateInfo.display}</span>
                                        <span className="event-weekday">({dateInfo.weekday})</span>
                                        <span className={`event-dday ${daysInfo.className}`}>
                                            {daysInfo.text}
                                        </span>
                                    </div>

                                    {/* Info Column */}
                                    <div className="event-info-col">
                                        <div className="event-header">
                                            <span className="event-ticker">{event.ticker}</span>
                                            <span
                                                className="event-sector"
                                                style={{ backgroundColor: `${sectorColor}20`, color: sectorColor }}
                                            >
                                                {event.sector}
                                            </span>
                                        </div>
                                        <span className="event-name">{event.nameKr}</span>
                                        <div className="event-details">
                                            <span className="event-quarter">{event.quarter}</span>
                                            {event.estimate && (
                                                <span className={`event-eps ${event.estimate.startsWith('-') ? 'negative' : 'positive'}`}>
                                                    예상 EPS: {event.estimate}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="event-arrow">›</div>
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
