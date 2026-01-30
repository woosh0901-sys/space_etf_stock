'use client';

import { useState, useEffect } from 'react';
import { getUFOData, getARKXData, getCombinedHoldings, getOverlapCount } from '@/lib/etf-data';
import { initAnalytics } from '@/lib/firebase';
import ETFCard from '@/components/ETFCard';
import SearchFilter from '@/components/SearchFilter';
import HoldingsTable from '@/components/HoldingsTable';

export default function Dashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'ufo' | 'arkx' | 'overlap'>('all');

    const ufoData = getUFOData();
    const arkxData = getARKXData();
    const combinedHoldings = getCombinedHoldings();
    const overlapCount = getOverlapCount();

    useEffect(() => {
        initAnalytics();
    }, []);

    return (
        <div className="dashboard">
            {/* Hero Section */}
            <header className="hero">
                <div className="hero-bg"></div>
                <div className="hero-content">
                    <span className="hero-icon">🚀</span>
                    <h1>Space ETF Dashboard</h1>
                    <p className="hero-subtitle">
                        UFO & ARKX 보유 종목을 한눈에
                    </p>
                </div>
            </header>

            {/* ETF Cards */}
            <section className="etf-cards-section">
                <ETFCard
                    etf={ufoData}
                    overlapCount={overlapCount}
                    color="blue"
                />
                <ETFCard
                    etf={arkxData}
                    overlapCount={overlapCount}
                    color="purple"
                />
            </section>

            {/* Stats Banner */}
            <section className="stats-banner">
                <div className="stat-item">
                    <span className="stat-number">{combinedHoldings.length}</span>
                    <span className="stat-text">전체 종목</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item highlight">
                    <span className="stat-number">{overlapCount}</span>
                    <span className="stat-text">중복 종목</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <span className="stat-number">{ufoData.holdings.length}</span>
                    <span className="stat-text">UFO 전용</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <span className="stat-number">{arkxData.holdings.length}</span>
                    <span className="stat-text">ARKX 전용</span>
                </div>
            </section>

            {/* Search & Filter */}
            <section className="search-section">
                <SearchFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    activeFilter={filter}
                    onFilterChange={setFilter}
                    overlapCount={overlapCount}
                />
            </section>

            {/* Holdings Table */}
            <section className="table-section">
                <HoldingsTable
                    holdings={combinedHoldings}
                    filter={filter}
                    searchTerm={searchTerm}
                />
            </section>

            {/* Footer */}
            <footer className="dashboard-footer">
                <p>데이터 출처: Procure ETFs, ARK Invest | 마지막 업데이트: 2026-01-29</p>
                <p className="disclaimer">
                    ⚠️ 투자 조언이 아닙니다. 투자 결정 전 전문가와 상담하세요.
                </p>
            </footer>
        </div>
    );
}
