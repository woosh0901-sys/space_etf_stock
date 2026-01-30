'use client';

import { useState, useEffect } from 'react';
import { getUFOData, getARKXData, getCombinedHoldings, getOverlapCount, getAllTickers } from '@/lib/etf-data';
import { fetchStockQuotes, StockQuoteMap } from '@/lib/stock-api';
import { initAnalytics } from '@/lib/firebase';
import ETFCard from '@/components/ETFCard';
import SearchFilter from '@/components/SearchFilter';
import HoldingsTable from '@/components/HoldingsTable';

export default function Dashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'ufo' | 'arkx' | 'overlap'>('all');
    const [quotes, setQuotes] = useState<StockQuoteMap>({});
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const ufoData = getUFOData();
    const arkxData = getARKXData();
    const combinedHoldings = getCombinedHoldings();
    const overlapCount = getOverlapCount();

    // 주가 데이터 로드
    useEffect(() => {
        initAnalytics();
        loadQuotes();

        // 1분마다 자동 업데이트
        const interval = setInterval(loadQuotes, 60000);
        return () => clearInterval(interval);
    }, []);

    const loadQuotes = async () => {
        setIsLoading(true);
        try {
            const tickers = getAllTickers();
            const fetchedQuotes = await fetchStockQuotes(tickers);
            setQuotes(fetchedQuotes);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to load quotes:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                    {lastUpdated && (
                        <p className="last-refresh">
                            마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
                            <button onClick={loadQuotes} className="refresh-btn" disabled={isLoading}>
                                🔄 새로고침
                            </button>
                        </p>
                    )}
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
                    quotes={quotes}
                    isLoading={isLoading}
                />
            </section>

            {/* Footer */}
            <footer className="dashboard-footer">
                <p>데이터 출처: Procure ETFs, ARK Invest, Yahoo Finance</p>
                <p className="disclaimer">
                    ⚠️ 투자 조언이 아닙니다. 투자 결정 전 전문가와 상담하세요.
                </p>
            </footer>
        </div>
    );
}
