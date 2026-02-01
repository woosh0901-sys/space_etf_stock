'use client';

import { useState, useCallback } from 'react';
import { StockQuoteMap } from '@/lib/stock-api';

interface WatchlistProps {
    quotes: StockQuoteMap;
    onStockClick: (ticker: string) => void;
}

const WATCHLIST_KEY = 'space-etf-watchlist';

function getInitialWatchlist(): string[] {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(WATCHLIST_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return [];
            }
        }
    }
    return [];
}

export function useWatchlist() {
    // useState 초기화 함수로 클라이언트 사이드에서만 localStorage 읽기
    const [watchlist, setWatchlist] = useState<string[]>(() => getInitialWatchlist());

    const addToWatchlist = useCallback((ticker: string) => {
        setWatchlist(prev => {
            const updated = [...prev, ticker];
            localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const removeFromWatchlist = useCallback((ticker: string) => {
        setWatchlist(prev => {
            const updated = prev.filter(t => t !== ticker);
            localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const isInWatchlist = useCallback((ticker: string) => watchlist.includes(ticker), [watchlist]);

    const toggleWatchlist = useCallback((ticker: string) => {
        if (watchlist.includes(ticker)) {
            removeFromWatchlist(ticker);
        } else {
            addToWatchlist(ticker);
        }
    }, [watchlist, addToWatchlist, removeFromWatchlist]);

    return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, toggleWatchlist };
}

export default function Watchlist({ quotes, onStockClick }: WatchlistProps) {
    const { watchlist, removeFromWatchlist } = useWatchlist();

    if (watchlist.length === 0) {
        return (
            <div className="watchlist-empty">
                <span>⭐</span>
                <p>관심종목이 없습니다</p>
                <p className="hint">종목 옆 ⭐ 버튼을 눌러 추가하세요</p>
            </div>
        );
    }

    return (
        <div className="watchlist">
            <h3 className="watchlist-title">⭐ 관심종목</h3>
            <div className="watchlist-items">
                {watchlist.map(ticker => {
                    const quote = quotes[ticker];
                    return (
                        <div key={ticker} className="watchlist-item" onClick={() => onStockClick(ticker)}>
                            <div className="watchlist-ticker">{ticker}</div>
                            {quote ? (
                                <>
                                    <div className="watchlist-price">${quote.price.toFixed(2)}</div>
                                    <div className={`watchlist-change ${quote.changePercent >= 0 ? 'positive' : 'negative'}`}>
                                        {quote.changePercent >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                                    </div>
                                </>
                            ) : (
                                <div className="watchlist-loading">로딩...</div>
                            )}
                            <button
                                className="watchlist-remove"
                                onClick={(e) => { e.stopPropagation(); removeFromWatchlist(ticker); }}
                            >
                                ✕
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
