'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    ticker?: string;
}

// 우주 관련 주요 키워드
const SPACE_KEYWORDS = ['SpaceX', 'NASA', 'rocket', 'satellite', 'space', 'lunar', 'moon', 'Mars', 'orbit'];
const MAJOR_TICKERS = ['RKLB', 'ASTS', 'IRDM', 'LUNR', 'ARKX', 'UFO', 'SPCE', 'BA', 'LMT', 'NOC'];

async function fetchAllNews(): Promise<NewsItem[]> {
    const allNews: NewsItem[] = [];
    const tickersToFetch = MAJOR_TICKERS.slice(0, 5);

    for (const ticker of tickersToFetch) {
        try {
            const response = await fetch(`/api/news?ticker=${ticker}`);
            const data = await response.json();
            const newsWithTicker = (data.news || []).map((n: NewsItem) => ({ ...n, ticker }));
            allNews.push(...newsWithTicker);
        } catch (error) {
            console.error(`Failed to load news for ${ticker}:`, error);
        }
    }

    // 중복 제거 및 정렬
    const uniqueNews = allNews.filter((item, index, self) =>
        index === self.findIndex((t) => t.title === item.title)
    );

    uniqueNews.sort((a, b) => {
        try {
            return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        } catch {
            return 0;
        }
    });

    return uniqueNews.slice(0, 20);
}

export default function NewsSection() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'space' | 'etf'>('all');

    useEffect(() => {
        let mounted = true;

        fetchAllNews().then(newsData => {
            if (mounted) {
                setNews(newsData);
                setLoading(false);
            }
        });

        return () => { mounted = false; };
    }, []);

    const handleRefresh = () => {
        setLoading(true);
        fetchAllNews().then(newsData => {
            setNews(newsData);
            setLoading(false);
        });
    };

    const filteredNews = news.filter(item => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'space') {
            return SPACE_KEYWORDS.some(kw =>
                item.title.toLowerCase().includes(kw.toLowerCase())
            );
        }
        if (activeFilter === 'etf') {
            return item.ticker === 'UFO' || item.ticker === 'ARKX';
        }
        return true;
    });

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

            if (diffHours < 1) return '방금 전';
            if (diffHours < 24) return `${diffHours}시간 전`;

            const diffDays = Math.floor(diffHours / 24);
            if (diffDays < 7) return `${diffDays}일 전`;

            return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <section className="news-section">
            <div className="news-header">
                <h2 className="news-title">📰 우주 산업 뉴스</h2>
                <div className="news-filters">
                    <button
                        className={`news-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        전체
                    </button>
                    <button
                        className={`news-filter-btn ${activeFilter === 'space' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('space')}
                    >
                        🚀 우주
                    </button>
                    <button
                        className={`news-filter-btn ${activeFilter === 'etf' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('etf')}
                    >
                        📊 ETF
                    </button>
                </div>
                <button className="news-refresh-btn" onClick={handleRefresh} disabled={loading}>
                    🔄 {loading ? '로딩...' : '새로고침'}
                </button>
            </div>

            {loading ? (
                <div className="news-loading-section">
                    <span>📡</span>
                    <p>뉴스 로딩 중...</p>
                </div>
            ) : filteredNews.length > 0 ? (
                <div className="news-grid">
                    {filteredNews.map((item, i) => (
                        <a
                            key={i}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-card"
                        >
                            {item.ticker && (
                                <span className="news-ticker-badge">{item.ticker}</span>
                            )}
                            <h3 className="news-card-title">{item.title}</h3>
                            <div className="news-card-meta">
                                <span className="news-card-source">{item.source}</span>
                                <span className="news-card-date">{formatDate(item.pubDate)}</span>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="no-news-section">
                    <span>📭</span>
                    <p>관련 뉴스가 없습니다</p>
                </div>
            )}
        </section>
    );
}
