'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { StockQuoteMap, fetchStockQuotes, StockQuote } from '@/lib/stock-api';
import { CombinedHolding } from '@/lib/etf-data';
import { useWatchlist } from '@/components/Watchlist';
import { SortKey } from '@/lib/types'; // Assuming SortKey is defined here or locally

interface HoldingsTableProps {
    holdings: CombinedHolding[];
    quotes: StockQuoteMap;
    onStockClick: (holding: CombinedHolding) => void;
    searchTerm: string;
    filter: 'all' | 'ufo' | 'arkx' | 'overlap';
    isLoading?: boolean;
}

// Keyword Mapping for Semantic Search
const KEYWORD_MAP: Record<string, string[]> = {
    '방산': ['defense', 'military', 'weapon', 'aerospace'],
    '위성': ['satellite', 'sat', 'telecom', 'comm'],
    '로켓': ['rocket', 'launch', 'propulsion', 'space'],
    '우주탐사': ['exploration', 'lunar', 'tourism', 'moon'],
    '통신': ['communication', 'network', 'connect', 'telecom'],
    '반도체': ['semiconductor', 'chip', 'electronic', 'circuit'],
    '초소형위성': ['nano', 'small', 'cube', 'satellite'],
    '군사': ['defense', 'military', 'security'],
    '민간우주': ['tourism', 'service', 'commercial', 'virgin'],
};

export default function HoldingsTable({ holdings, quotes: initialQuotes, onStockClick, searchTerm, filter, isLoading: _isLoading }: HoldingsTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: 'rank' | 'price' | 'change', dir: 'asc' | 'desc' }>({ key: 'rank', dir: 'asc' });
    const { isInWatchlist, toggleWatchlist } = useWatchlist();
    const [stockQuotes, setStockQuotes] = useState<StockQuoteMap>(initialQuotes);

    // Initial quotes sync
    useEffect(() => {
        setStockQuotes(initialQuotes);
    }, [initialQuotes]);

    const formatChange = (change: number, percent: number) => {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
    };

    const handleSort = (key: 'price' | 'change') => {
        setSortConfig(current => ({
            key,
            dir: current.key === key && current.dir === 'desc' ? 'asc' : 'desc'
        }));
    };

    const filtered = useMemo(() => {
        const lowerTerm = searchTerm.toLowerCase().trim();

        return holdings.filter(h => {
            // 0. ETF Filter
            let matchesFilter = true;
            switch (filter) {
                case 'ufo': matchesFilter = h.ufoWeight !== null; break;
                case 'arkx': matchesFilter = h.arkxWeight !== null; break;
                case 'overlap': matchesFilter = h.isOverlap; break;
            }
            if (!matchesFilter) return false;

            if (!lowerTerm) return true;

            // 1. Direct Match (Ticker, Name, Sector)
            const matchesDirect =
                h.ticker.toLowerCase().includes(lowerTerm) ||
                h.name.toLowerCase().includes(lowerTerm) ||
                h.nameKr.includes(lowerTerm) ||
                (h.sector && h.sector.toLowerCase().includes(lowerTerm));

            // 2. Semantic Match (Keyword Map)
            const relatedTerms = KEYWORD_MAP[lowerTerm] || [];
            const matchesSemantic = relatedTerms.some(term =>
                (h.sector && h.sector.toLowerCase().includes(term)) ||
                h.name.toLowerCase().includes(term)
            );

            return matchesDirect || matchesSemantic;
        });
    }, [holdings, searchTerm, filter]);

    // Real-time polling
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                // _isLoading removed to prevent flicker
                const quotes = await fetchStockQuotes(holdings.map(h => h.ticker));
                setStockQuotes(prev => {
                    return quotes;
                });
            } catch (error) {
                console.error('Error fetching stock quotes:', error);
            }
        };

        fetchPrices();
        const interval = setInterval(fetchPrices, 5000); // 5 seconds polling

        return () => clearInterval(interval);
    }, [holdings]);

    const handleSort = (key: SortKey) => {
        setSortConfig(current => ({
            key,
            dir: current.key === key && current.dir === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedHoldings = useMemo(() => {
        const sorted = [...filtered];
        if (sortConfig.key === 'price') {
            sorted.sort((a, b) => {
                const quoteA = stockQuotes[a.ticker];
                const quoteB = stockQuotes[b.ticker];
                const priceA = quoteA?.price || 0;
                const priceB = quoteB?.price || 0;
                return sortConfig.dir === 'asc' ? priceA - priceB : priceB - priceA;
            });
        } else if (sortConfig.key === 'change') {
            sorted.sort((a, b) => {
                const quoteA = stockQuotes[a.ticker];
                const quoteB = stockQuotes[b.ticker];
                const changeA = quoteA?.changePercent || 0;
                const changeB = quoteB?.changePercent || 0;
                return sortConfig.dir === 'asc' ? changeA - changeB : changeB - changeA;
            });
        }
        return sorted;
    }, [filtered, stockQuotes, sortConfig]);

    return (
        <div className="holdings-container">
            <div className="holdings-tabs-modern">
                <span className="modern-tab active">
                    보유 종목 ({filtered.length})
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

                {sortedHoldings.map((h, index) => (
                    <HoldingItem
                        key={h.ticker}
                        item={h}
                        index={index}
                        quote={stockQuotes[h.ticker]}
                        isWatched={isInWatchlist(h.ticker)}
                        onToggleWatchlist={toggleWatchlist}
                        onClick={() => onStockClick(h)}
                    />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="no-results" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>검색 결과가 없습니다.</p>
                </div>
            )}
        </div>
    );
}

// Separate component for flash animation logic
function HoldingItem({ item, index, quote, isWatched, onToggleWatchlist, onClick }: any) {
    const [flashClass, setFlashClass] = useState('');
    const prevPriceRef = useRef<number | null>(null);

    const price = quote?.price || 0;
    const change = quote?.changePercent || 0;

    useEffect(() => {
        if (prevPriceRef.current !== null && quote) {
            if (price > prevPriceRef.current) {
                setFlashClass('flash-up');
                setTimeout(() => setFlashClass(''), 1000);
            } else if (price < prevPriceRef.current) {
                setFlashClass('flash-down');
                setTimeout(() => setFlashClass(''), 1000);
            }
        }
        if (quote) {
            prevPriceRef.current = price;
        }
    }, [price, quote]);

    const formatChange = (val: number, changeAmount: number) => {
        const sign = val >= 0 ? '+' : '';
        return `${sign}${val.toFixed(2)}% (${changeAmount >= 0 ? '+' : ''}${changeAmount.toFixed(2)})`;
    };

    return (
        <div className={`list-item-modern ${flashClass}`} onClick={onClick}>
            <div className="item-rank">{index + 1}</div>

            <div className="item-info">
                <div className="item-top">
                    <span className="item-ticker">{item.ticker}</span>
                    {item.isOverlap && <span className="item-etf-badge" style={{ color: 'var(--color-primary)' }}>중복</span>}
                    <button
                        className="star-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(item.ticker);
                        }}
                        title={isWatched ? "관심종목 제거" : "관심종목 추가"}
                    >
                        {isWatched ? '⭐' : '☆'}
                    </button>
                </div>
                <span className="item-name">
                    {item.nameKr} <span style={{ opacity: 0.7 }}>({item.name})</span>
                </span>
            </div>

            <div className="item-price-col">
                {quote ? (
                    <>
                        <span className="item-price">${price.toFixed(2)}</span>
                        <span className={`item-change ${change >= 0 ? 'positive' : 'negative'}`}>
                            {formatChange(change, quote.change)}
                        </span>
                    </>
                ) : (
                    <span className="price-loading">...</span>
                )}
            </div>
        </div>
    );
}
