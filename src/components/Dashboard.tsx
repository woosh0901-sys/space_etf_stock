'use client';

import { useState, useEffect } from 'react';
import { getUFOData, getARKXData, getCombinedHoldings, getOverlapCount, getAllTickers, CombinedHolding } from '@/lib/etf-data';
import { fetchStockQuotes, StockQuoteMap } from '@/lib/stock-api';
import { initAnalytics } from '@/lib/firebase';
import TabNavigation from '@/components/TabNavigation';
import ETFCard from '@/components/ETFCard';
import SearchFilter from '@/components/SearchFilter';
import HoldingsTable from '@/components/HoldingsTable';
import ChartModal from '@/components/ChartModal';
import ETFAnalysis from '@/components/ETFAnalysis';
import ThemeToggle from '@/components/ThemeToggle';

interface ChartData {
    ticker: string;
    name: string;
    nameKr: string;
}

export default function Dashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'ufo' | 'arkx' | 'overlap'>('all');
    const [quotes, setQuotes] = useState<StockQuoteMap>({});
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [chartData, setChartData] = useState<ChartData | null>(null);

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
            // ETF 티커도 포함
            const tickers = [...getAllTickers(), 'UFO', 'ARKX'];
            const fetchedQuotes = await fetchStockQuotes(tickers);
            setQuotes(fetchedQuotes);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to load quotes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStockClick = (holding: CombinedHolding) => {
        setChartData({
            ticker: holding.ticker,
            name: holding.name,
            nameKr: holding.nameKr
        });
    };

    const handleETFClick = (ticker: 'UFO' | 'ARKX') => {
        const etf = ticker === 'UFO' ? ufoData : arkxData;
        setChartData({
            ticker,
            name: etf.etf.name,
            nameKr: ticker === 'UFO' ? 'UFO 우주 ETF' : 'ARKX 우주 ETF'
        });
    };

    return (
        <>
            <TabNavigation />
            <div className="dashboard">
                {/* Hero Section (Simplified) */}
                <header className="hero-simple">
                    <div className="hero-content-simple">
                        <h1>Space ETF Dashboard</h1>
                        {lastUpdated && (
                            <span className="last-refresh-simple">
                                {lastUpdated.toLocaleTimeString('ko-KR')} 기준
                                <button onClick={loadQuotes} className="refresh-btn-simple" disabled={isLoading}>
                                    🔄
                                </button>
                            </span>
                        )}
                    </div>
                </header>

                {/* ETF Cards */}
                <section className="etf-cards-section">
                    <ETFCard
                        etf={ufoData}
                        overlapCount={overlapCount}
                        quote={quotes['UFO']}
                        onClick={() => handleETFClick('UFO')}
                    />
                    <ETFCard
                        etf={arkxData}
                        overlapCount={overlapCount}
                        quote={quotes['ARKX']}
                        onClick={() => handleETFClick('ARKX')}
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
                        onStockClick={handleStockClick}
                    />
                </section>

                {/* ETF 분석 섹션 */}
                <section className="analysis-section">
                    <h2 className="section-title">📊 ETF 변동 분석 & Top Movers</h2>

                    <div className="analysis-grid">
                        <div className="analysis-card">
                            <ETFAnalysis
                                etfTicker="UFO"
                                quotes={quotes}
                                onStockClick={(ticker) => setChartData({ ticker, name: ticker, nameKr: ticker })}
                            />
                        </div>

                        <div className="analysis-card">
                            <ETFAnalysis
                                etfTicker="ARKX"
                                quotes={quotes}
                                onStockClick={(ticker) => setChartData({ ticker, name: ticker, nameKr: ticker })}
                            />
                        </div>
                    </div>
                </section>

                {/* Chart Modal */}
                {chartData && (
                    <ChartModal
                        ticker={chartData.ticker}
                        name={chartData.name}
                        nameKr={chartData.nameKr}
                        isOpen={true}
                        onClose={() => setChartData(null)}
                    />
                )}

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Footer */}
                <footer className="dashboard-footer">
                    <p>데이터 출처: Procure ETFs, ARK Invest, Yahoo Finance, TradingView</p>
                    <p className="disclaimer">
                        ⚠️ 투자 조언이 아닙니다. 투자 결정 전 전문가와 상담하세요.
                    </p>
                </footer>
            </div>
        </>
    );
}
