'use client';

import { ETFData } from '@/lib/etf-data';

interface ETFCardProps {
    etf: ETFData;
    overlapCount?: number;
    color: 'blue' | 'purple';
}

export default function ETFCard({ etf, overlapCount, color }: ETFCardProps) {
    const totalWeight = etf.holdings.reduce((sum, h) => sum + h.weight, 0);

    return (
        <div className={`etf-card etf-card-${color}`}>
            <div className="etf-card-header">
                <span className="etf-ticker">{etf.etf.ticker}</span>
                {overlapCount !== undefined && overlapCount > 0 && (
                    <span className="overlap-count">{overlapCount} 중복</span>
                )}
            </div>
            <h3 className="etf-name">{etf.etf.name}</h3>
            <p className="etf-description">{etf.etf.description}</p>
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
            </div>
        </div>
    );
}
