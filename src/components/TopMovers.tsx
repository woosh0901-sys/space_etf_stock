'use client';

import { useMemo } from 'react';
import { StockQuoteMap } from '@/lib/stock-api';
import { getCombinedHoldings } from '@/lib/etf-data';

interface TopMoversProps {
    quotes: StockQuoteMap;
    onStockClick: (ticker: string) => void;
}

export default function TopMovers({ quotes, onStockClick }: TopMoversProps) {
    const holdings = getCombinedHoldings();

    const { gainers, losers } = useMemo(() => {
        const withQuotes = holdings
            .filter(h => {
                const quote = quotes[h.ticker];
                return quote && typeof quote.changePercent === 'number';
            })
            .map(h => {
                const quote = quotes[h.ticker];
                return {
                    ...h,
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
        <div className="top-movers">
            <div className="movers-section gainers">
                <h4 className="movers-title">🚀 오늘 상승 Top 5</h4>
                <div className="movers-list">
                    {gainers.map((stock, idx) => (
                        <div
                            key={stock.ticker}
                            className="mover-item"
                            onClick={() => onStockClick(stock.ticker)}
                        >
                            <span className="mover-rank">{idx + 1}</span>
                            <span className="mover-ticker">{stock.ticker}</span>
                            <span className="mover-name">{stock.nameKr}</span>
                            <span className="mover-change positive">
                                +{stock.change.toFixed(2)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="movers-section losers">
                <h4 className="movers-title">📉 오늘 하락 Top 5</h4>
                <div className="movers-list">
                    {losers.map((stock, idx) => (
                        <div
                            key={stock.ticker}
                            className="mover-item"
                            onClick={() => onStockClick(stock.ticker)}
                        >
                            <span className="mover-rank">{idx + 1}</span>
                            <span className="mover-ticker">{stock.ticker}</span>
                            <span className="mover-name">{stock.nameKr}</span>
                            <span className="mover-change negative">
                                {stock.change.toFixed(2)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
