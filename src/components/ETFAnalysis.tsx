'use client';

import { useState, useEffect, useCallback } from 'react';

interface ContributorStock {
    ticker: string;
    name: string;
    nameKr: string;
    weight: number;
    priceChange: number;
    changePercent: number;
    contribution: number;
}

interface ETFAnalysisData {
    etfTicker: string;
    etfChange: number;
    etfChangePercent: number;
    topGainers: ContributorStock[];
    topLosers: ContributorStock[];
    explanation: string;
}

interface ETFAnalysisProps {
    etfTicker: 'UFO' | 'ARKX';
}

export default function ETFAnalysis({ etfTicker }: ETFAnalysisProps) {
    const [analysis, setAnalysis] = useState<ETFAnalysisData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    const loadAnalysis = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/etf-analysis?etf=${etfTicker}`);
            const data = await response.json();
            if (!data.error) {
                setAnalysis(data);
            }
        } catch (error) {
            console.error('Failed to load ETF analysis:', error);
        } finally {
            setLoading(false);
        }
    }, [etfTicker]);

    useEffect(() => {
        loadAnalysis();
    }, [loadAnalysis]);

    if (loading) {
        return (
            <div className="etf-analysis-card loading">
                <span className="loading-icon">📊</span>
                <span>분석 중...</span>
            </div>
        );
    }

    if (!analysis) {
        return null;
    }

    const isPositive = analysis.etfChangePercent >= 0;

    return (
        <div className={`etf-analysis-card ${isPositive ? 'positive' : 'negative'}`}>
            <div className="analysis-header" onClick={() => setShowDetails(!showDetails)}>
                <div className="analysis-main">
                    <span className="analysis-icon">{isPositive ? '📈' : '📉'}</span>
                    <p className="analysis-explanation">{analysis.explanation}</p>
                </div>
                <button className="analysis-toggle">
                    {showDetails ? '▲ 접기' : '▼ 상세보기'}
                </button>
            </div>

            {showDetails && (
                <div className="analysis-details">
                    {analysis.topGainers.length > 0 && (
                        <div className="contributors-section gainers">
                            <h4>🟢 상승 기여 종목</h4>
                            <ul className="contributors-list">
                                {analysis.topGainers.map((stock) => (
                                    <li key={stock.ticker} className="contributor-item">
                                        <div className="contributor-info">
                                            <span className="contributor-ticker">{stock.ticker}</span>
                                            <span className="contributor-name">{stock.nameKr}</span>
                                        </div>
                                        <div className="contributor-stats">
                                            <span className="contributor-change positive">
                                                +{stock.changePercent.toFixed(2)}%
                                            </span>
                                            <span className="contributor-weight">
                                                비중 {stock.weight.toFixed(1)}%
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {analysis.topLosers.length > 0 && (
                        <div className="contributors-section losers">
                            <h4>🔴 하락 기여 종목</h4>
                            <ul className="contributors-list">
                                {analysis.topLosers.map((stock) => (
                                    <li key={stock.ticker} className="contributor-item">
                                        <div className="contributor-info">
                                            <span className="contributor-ticker">{stock.ticker}</span>
                                            <span className="contributor-name">{stock.nameKr}</span>
                                        </div>
                                        <div className="contributor-stats">
                                            <span className="contributor-change negative">
                                                {stock.changePercent.toFixed(2)}%
                                            </span>
                                            <span className="contributor-weight">
                                                비중 {stock.weight.toFixed(1)}%
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
