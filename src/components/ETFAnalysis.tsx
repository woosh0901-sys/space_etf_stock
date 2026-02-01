'use client';

import { useState, useEffect, useCallback } from 'react';
import TopMovers from './TopMovers';
import { StockQuoteMap } from '@/lib/stock-api';

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
    quotes: StockQuoteMap;
    onStockClick: (ticker: string) => void;
}

export default function ETFAnalysis({ etfTicker, quotes, onStockClick }: ETFAnalysisProps) {
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
                    <TopMovers
                        quotes={quotes}
                        etf={etfTicker}
                        onStockClick={onStockClick}
                    />
                </div>
            )}
        </div>
    );
}
