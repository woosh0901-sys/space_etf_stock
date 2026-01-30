'use client';

import { ETFData } from '@/lib/etf-data';
import { StockQuote } from '@/lib/stock-api';

interface ETFCardProps {
    etf: ETFData;
    overlapCount?: number;
    color: 'blue' | 'purple';
    quote?: StockQuote | null;
    onClick?: () => void;
}

export default function ETFCard({ etf, overlapCount, color, quote, onClick }: ETFCardProps) {
    const totalWeight = etf.holdings.reduce((sum, h) => sum + h.weight, 0);

    return (
        <div
            className={`etf-card etf-card-${color} ${onClick ? 'clickable' : ''}`}
            onClick={onClick}
        >
            <div className="etf-card-header">
                <span className="etf-ticker">{etf.etf.ticker}</span>
                {overlapCount !== undefined && overlapCount > 0 && (
                    <span className="overlap-count">{overlapCount} 중복</span>
                )}
            </div>
            <h3 className="etf-name">{etf.etf.name}</h3>
            <p className="etf-description">{etf.etf.description}</p>

            {/* ETF 가격 정보 */}
            {quote && (
                <div className="etf-price-section">
                    <span className="etf-price">${quote.price.toFixed(2)}</span>
                    <span className={`etf-change ${quote.changePercent >= 0 ? 'positive' : 'negative'}`}>
                        {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                    </span>
                </div>
            )}

            <div className="etf-stats">
                <div className="stat">
                    <span className="stat-value">{etf.holdings.length}</span>
                    <span className="stat-label">종목 수</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{totalWeight.toFixed(1)}%</span>
                    <span className="stat-label">총 비중</span>
                </div>
            </div>
            <div className="etf-footer">
                <span className="last-updated">업데이트: {etf.etf.lastUpdated}</span>
                {onClick && <span className="click-hint">클릭하여 차트 보기 →</span>}
            </div>
        </div>
    );
}
