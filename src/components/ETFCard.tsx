'use client';

import { ETFData } from '@/lib/etf-data';
import { StockQuote } from '@/lib/stock-api';

interface ETFCardProps {
    etf: ETFData;
    overlapCount?: number;
    quote?: StockQuote | null;
    onClick?: () => void;
    rank?: number | string;
}

export default function ETFCard({ etf, overlapCount, quote, onClick, rank }: ETFCardProps) {

    return (
        <div
            className={`etf-card-new ${onClick ? 'clickable' : ''}`}
            onClick={onClick}
        >
            <div className="card-header-row">
                {rank && <span className="rank-badge">{rank}</span>}
                <span className="etf-ticker-new">{etf.etf.ticker}</span>
            </div>

            <h3 className="etf-name-new">{etf.etf.name}</h3>

            {/* Price & Change (Big) */}
            {quote && (
                <div className="big-stats-row">
                    <span className="big-price">${quote.price.toFixed(2)}</span>
                    <span className={`big-change ${quote.changePercent >= 0 ? 'positive' : 'negative'}`}>
                        {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                    </span>
                </div>
            )}

            {/* Info Footer */}
            <div className="card-info-row">
                <div className="info-item">
                    <span className="info-label">보유종목</span>
                    <span className="info-val">{etf.holdings.length}개</span>
                </div>
                <div className="info-item">
                    <span className="info-label">업데이트</span>
                    <span className="info-val">{etf.etf.lastUpdated.split(' ')[0]}</span>
                </div>
                {overlapCount !== undefined && overlapCount > 0 && (
                    <div className="info-item">
                        <span className="info-label">중복</span>
                        <span className="info-val" style={{ color: 'var(--color-primary)' }}>{overlapCount}개</span>
                    </div>
                )}
            </div>
        </div>
    );
}
