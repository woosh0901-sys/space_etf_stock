'use client';

import TabNavigation from '@/components/TabNavigation';
import Watchlist from '@/components/Watchlist';
import PortfolioSimulator from '@/components/PortfolioSimulator';
import CurrencyConverter from '@/components/CurrencyConverter';
import FeeCalculator from '@/components/FeeCalculator';
import ReturnCalculator from '@/components/ReturnCalculator';
import SectorAllocation from '@/components/SectorAllocation';
import ChartModal from '@/components/ChartModal';
import ThemeToggle from '@/components/ThemeToggle';
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
    const [chartData, setChartData] = useState<ChartData | null>(null);

    useEffect(() => {
        const loadQuotes = async () => {
            try {
                const tickers = [...getAllTickers(), 'UFO', 'ARKX'];
                const fetchedQuotes = await fetchStockQuotes(tickers);
                setQuotes(fetchedQuotes);
            } catch (error) {
                console.error('Failed to load quotes:', error);
            }
        };

        loadQuotes();
        const interval = setInterval(loadQuotes, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <TabNavigation />
            <div className="dashboard">
                <header className="hero-simple">
                    <div className="hero-content-simple">
                        <h1>투자 도구</h1>
                        <span className="last-refresh-simple" style={{ fontSize: '14px' }}>
                            포트폴리오 시뮬레이션 및 종목 분석
                        </span>
                    </div>
                </header>

                {/* 메인 도구: 시뮬레이터 + 관심종목 */}
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

                {/* 계산기 도구 */}
                <section className="tools-grid">
                    <div className="tools-grid-item">
                        <CurrencyConverter />
                    </div>
                    <div className="tools-grid-item">
                        <FeeCalculator />
                    </div>
                </section>

                {/* 수익률 & 섹터 분석 */}
                <section className="tools-grid">
                    <div className="tools-grid-item">
                        <ReturnCalculator />
                    </div>
                    <div className="tools-grid-item">
                        <SectorAllocation />
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

                <ThemeToggle />
            </div>
        </>
    );
}
