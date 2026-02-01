'use client';

import { CombinedHolding } from '@/lib/etf-data';
import { StockQuoteMap } from '@/lib/stock-api';

interface HoldingsTableProps {
    holdings: CombinedHolding[];
    filter: 'all' | 'ufo' | 'arkx' | 'overlap';
    searchTerm: string;
    quotes: StockQuoteMap;
    isLoading: boolean;
    onStockClick: (holding: CombinedHolding) => void;
}

export default function HoldingsTable({ holdings, filter, searchTerm, quotes, isLoading, onStockClick }: HoldingsTableProps) {
    const filtered = holdings.filter(h => {
        // 검색 필터
        const matchesSearch = searchTerm === '' ||
            h.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.nameKr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.sector.toLowerCase().includes(searchTerm.toLowerCase());

        // ETF 필터
        let matchesFilter = true;
        switch (filter) {
            case 'ufo':
                matchesFilter = h.ufoWeight !== null;
                break;
            case 'arkx':
                matchesFilter = h.arkxWeight !== null;
                break;
            case 'overlap':
                matchesFilter = h.isOverlap;
                break;
        }

        return matchesSearch && matchesFilter;
    });

    const formatChange = (change: number, percent: number) => {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${percent.toFixed(2)}%`;
    };

    return (
        <div className="holdings-container">
            <h2 className="section-title">📊 보유 종목 현황</h2>

            <div className="holdings-tabs-modern">
                <button
                    className={`modern-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => {/* Parent handles filter logic via props, but tabs here for UI consistency */ }}
                    style={{ display: 'none' }}
                >
                    {/* Tabs are handled by SearchFilter in parent, hiding here or we need to lift state up properly if we want tabs here. 
                       Currently Filter is passed as prop. Let's keep title only for now or re-implement tabs if user wants them here.
                       Based on design, tabs might be up top. Let's stick to list view.
                   */}
                </button>
                <span className="result-count" style={{ marginBottom: '10px', display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    총 {filtered.length}개 종목
                </span>
            </div>

            <div className="holdings-list-modern">
                {/* Header Row */}
                <div className="list-header-row">
                    <span>종목 (티커/명)</span>
                    <span className="text-right">현재가 / 등락률</span>
                </div>

                {filtered.map((h, index) => {
                    const quote = quotes[h.ticker];
                    const change = quote ? quote.changePercent : 0;
                    const price = quote ? quote.price : 0;

                    return (
                        <div
                            key={`${h.ticker}-${index}`}
                            className="list-item-modern"
                            onClick={() => onStockClick(h)}
                        >
                            <div className="item-rank">{index + 1}</div>

                            <div className="item-info">
                                <div className="item-top">
                                    <span className="item-ticker">{h.ticker}</span>
                                    {h.isOverlap && <span className="item-etf-badge" style={{ color: 'var(--color-primary)' }}>중복</span>}
                                </div>
                                <span className="item-name">
                                    {h.nameKr} <span style={{ opacity: 0.7 }}>({h.name})</span>
                                </span>
                            </div>

                            <div className="item-price-col">
                                {quote ? (
                                    <>
                                        <span className="item-price">${price.toFixed(2)}</span>
                                        <span className={`item-change ${change >= 0 ? 'positive' : 'negative'}`}>
                                            {formatChange(quote.change, change)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="price-loading">...</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="no-results" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>검색 결과가 없습니다.</p>
                </div>
            )}
        </div>
    );
}
