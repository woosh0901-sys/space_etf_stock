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

import { useState } from 'react';

// Keyword Mapping for Semantic Search
const KEYWORD_MAP: Record<string, string[]> = {
    '방산': ['defense', 'aerospace', 'military'],
    '군사': ['defense', 'military'],
    '위성': ['satellite'],
    '초소형위성': ['nano', 'microsatellite', 'satellite'],
    '로켓': ['rocket', 'launch', 'space'],
    '우주탐사': ['exploration', 'space'],
    '민간우주': ['space', 'commercial'],
    '통신': ['communication', 'telecom'],
    '반도체': ['semiconductor', 'chip', 'materials']
};

export default function HoldingsTable({ holdings, filter, searchTerm, quotes, isLoading, onStockClick }: HoldingsTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: 'rank' | 'price' | 'change', dir: 'asc' | 'desc' }>({ key: 'rank', dir: 'asc' });

    const handleSort = (key: 'price' | 'change') => {
        setSortConfig(current => ({
            key,
            dir: current.key === key && current.dir === 'desc' ? 'asc' : 'desc'
        }));
    };

    const filtered = holdings.filter(h => {
        // 검색 필터
        if (searchTerm === '') return true;

        const lowerTerm = searchTerm.toLowerCase();
        const matchesDirect =
            h.ticker.toLowerCase().includes(lowerTerm) ||
            h.name.toLowerCase().includes(lowerTerm) ||
            h.nameKr.toLowerCase().includes(lowerTerm) ||
            h.sector.toLowerCase().includes(lowerTerm);

        // Semantic Check
        const relatedTerms = KEYWORD_MAP[searchTerm] || [];
        const matchesSemantic = relatedTerms.some(term =>
            h.sector.toLowerCase().includes(term) ||
            h.name.toLowerCase().includes(term)
        );

        const matchesSearch = matchesDirect || matchesSemantic;

        // ETF 필터
        let matchesFilter = true;
        switch (filter) {
            case 'ufo': matchesFilter = h.ufoWeight !== null; break;
            case 'arkx': matchesFilter = h.arkxWeight !== null; break;
            case 'overlap': matchesFilter = h.isOverlap; break;
        }

        return matchesSearch && matchesFilter;
    });

    // Sorting Logic
    const sortedHoldings = [...filtered].sort((a, b) => {
        if (sortConfig.key === 'rank') return 0; // Maintain original order (filtered list structure)

        const quoteA = quotes[a.ticker];
        const quoteB = quotes[b.ticker];

        // Handle missing quotes (push to bottom)
        if (!quoteA) return 1;
        if (!quoteB) return -1;

        const valA = sortConfig.key === 'price' ? quoteA.price : quoteA.changePercent;
        const valB = sortConfig.key === 'price' ? quoteB.price : quoteB.changePercent;

        return sortConfig.dir === 'asc' ? valA - valB : valB - valA;
    });

    const formatChange = (change: number, percent: number) => {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${percent.toFixed(2)}%`;
    };

    return (
        <div className="holdings-container">
            <h2 className="section-title">📊 보유 종목 현황</h2>

            <div className="holdings-tabs-modern">
                <span className="result-count" style={{ marginBottom: '10px', display: 'block', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    총 {filtered.length}개 종목
                </span>
            </div>

            <div className="holdings-list-modern">
                {/* Header Row */}
                <div className="list-header-row">
                    <span>종목 (티커/명)</span>
                    <div className="text-right sort-controls">
                        <button
                            className={`sort-btn ${sortConfig.key === 'price' ? 'active' : ''}`}
                            onClick={() => handleSort('price')}
                        >
                            가격 {sortConfig.key === 'price' && (sortConfig.dir === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            className={`sort-btn ${sortConfig.key === 'change' ? 'active' : ''}`}
                            onClick={() => handleSort('change')}
                        >
                            등락률 {sortConfig.key === 'change' && (sortConfig.dir === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>
                </div>

                {sortedHoldings.map((h, index) => {
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
