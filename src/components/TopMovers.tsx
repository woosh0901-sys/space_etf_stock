'use client';

import { useMemo } from 'react';
import { StockQuoteMap } from '@/lib/stock-api';
import { getUFOData, getARKXData } from '@/lib/etf-data';

interface TopMoversProps {
    quotes: StockQuoteMap;
    etf: 'UFO' | 'ARKX';
    onStockClick: (ticker: string) => void;
}

export default function TopMovers({ quotes, etf, onStockClick }: TopMoversProps) {
    const holdings = etf === 'UFO' ? getUFOData().holdings : getARKXData().holdings;

    const { gainers, losers } = useMemo(() => {
        const withQuotes = holdings
            .filter(h => {
                const quote = quotes[h.ticker];
                return quote && typeof quote.changePercent === 'number';
            })
            .map(h => {
                const quote = quotes[h.ticker];
                return {
                    ticker: h.ticker,
                    nameKr: h.nameKr,
                    change: quote?.changePercent ?? 0
                };
            })
            .sort((a, b) => b.change - a.change);

        return {
            gainers: withQuotes.slice(0, 5),
            losers: withQuotes.slice(-5).reverse()
        };
    }, [holdings, quotes]);

    if (gainers.length === 0) {
        return (
            <div className="top-movers-loading">
                <span>📊</span>
                <p>데이터 로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="top-movers-etf">
            <div className="movers-header">
                <span className="etf-badge">{etf}</span>
            </div>
            <div className="movers-columns">
                <div className="movers-column gainers">
                    <h4>🚀 상승 Top 5</h4>
                    <div className="movers-list">
                        {gainers.map((stock, idx) => (
                            <div
                                key={stock.ticker}
                                className="mover-item"
                                onClick={() => onStockClick(stock.ticker)}
                            >
                                <span className="mover-rank">{idx + 1}</span>
                                <span className="mover-ticker">{stock.ticker}</span>
                                <span className="mover-change positive">
                                    +{stock.change.toFixed(2)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="movers-column losers">
                    <h4>📉 하락 Top 5</h4>
                    <div className="movers-list">
                        {losers.map((stock, idx) => (
                            <div
                                key={stock.ticker}
                                className="mover-item"
                                onClick={() => onStockClick(stock.ticker)}
                            >
                                <span className="mover-rank">{idx + 1}</span>
                                <span className="mover-ticker">{stock.ticker}</span>
                                <span className="mover-change negative">
                                    {stock.change.toFixed(2)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
