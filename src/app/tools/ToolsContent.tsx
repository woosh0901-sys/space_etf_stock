'use client';

import TabNavigation from '@/components/TabNavigation';
import Watchlist from '@/components/Watchlist';
import PortfolioSimulator from '@/components/PortfolioSimulator';
import TopMovers from '@/components/TopMovers';
import EarningsCalendar from '@/components/EarningsCalendar';
import ThemeToggle from '@/components/ThemeToggle';
import ChartModal from '@/components/ChartModal';
import { useState, useEffect } from 'react';
import { fetchStockQuotes, StockQuoteMap } from '@/lib/stock-api';
import { getAllTickers } from '@/lib/etf-data';

interface ChartData {
    ticker: string;
    name: string;
    nameKr: string;
}

export default function ToolsContent() {
    const [quotes, setQuotes] = useState<StockQuoteMap>({});
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState<ChartData | null>(null);

    useEffect(() => {
        loadQuotes();
        const interval = setInterval(loadQuotes, 60000);
        return () => clearInterval(interval);
    }, []);

    const loadQuotes = async () => {
        setIsLoading(true);
        try {
            const tickers = [...getAllTickers(), 'UFO', 'ARKX'];
            const fetchedQuotes = await fetchStockQuotes(tickers);
            setQuotes(fetchedQuotes);
        } catch (error) {
            console.error('Failed to load quotes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <TabNavigation />
            <div className="tools-page">
                <header className="tools-header">
                    <h1>🔧 투자 도구</h1>
                    <p>관심종목 관리, 포트폴리오 시뮬레이션, 시장 분석 도구</p>
                </header>

                {/* Top Movers */}
                <section className="tools-section">
                    <h2 className="section-title">🏆 오늘의 Top Movers</h2>
                    <TopMovers
                        quotes={quotes}
                        onStockClick={(ticker) => setChartData({ ticker, name: ticker, nameKr: ticker })}
                    />
                </section>

                {/* Tools Grid */}
                <section className="tools-grid">
                    <div className="tools-grid-item">
                        <PortfolioSimulator quotes={quotes} />
                    </div>
                    <div className="tools-grid-item">
                        <Watchlist
                            quotes={quotes}
                            onStockClick={(ticker) => setChartData({ ticker, name: ticker, nameKr: ticker })}
                        />
                    </div>
                </section>

                {/* Earnings Calendar */}
                <section className="tools-section">
                    <EarningsCalendar />
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
            </div>
        </>
    );
}
