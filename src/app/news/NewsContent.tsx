'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
    title: string;
    titleKr: string;
    link: string;
    pubDate: string;
    source: string;
    category?: string;
}

const CATEGORIES = [
    { id: 'all', label: '전체', icon: '🌌' },
    { id: 'spacex', label: 'SpaceX', icon: '🚀' },
    { id: 'nasa', label: 'NASA', icon: '🛰️' },
    { id: 'rocket', label: '로켓', icon: '🔥' },
    { id: 'satellite', label: '위성', icon: '📡' },
    { id: 'mars', label: '화성', icon: '🔴' },
    { id: 'moon', label: '달', icon: '🌙' },
];

export default function NewsContent() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/space-news');
            const data = await response.json();
            if (data.news) {
                setNews(data.news);
            }
        } catch (err) {
            console.error('Failed to load news:', err);
            setError('뉴스를 불러오는데 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    const filteredNews = news.filter(item => {
        if (activeCategory === 'all') return true;
        const searchText = (item.title + item.titleKr).toLowerCase();
        const categoryKeywords: Record<string, string[]> = {
            spacex: ['spacex', '스페이스엑스'],
            nasa: ['nasa', '나사'],
            rocket: ['rocket', 'launch', '로켓', '발사'],
            satellite: ['satellite', 'starlink', '위성', '스타링크'],
            mars: ['mars', '화성'],
            moon: ['moon', 'lunar', 'artemis', '달', '아르테미스'],
        };
        return categoryKeywords[activeCategory]?.some(kw => searchText.includes(kw)) || false;
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
        <div className="news-content">
            {/* Category Filter */}
            <div className="news-category-filter">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        <span className="category-icon">{cat.icon}</span>
                        <span className="category-label">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Refresh Button */}
            <div className="news-actions">
                <button className="news-refresh-btn" onClick={loadNews} disabled={loading}>
                    {loading ? '🔄 로딩 중...' : '🔄 새로고침'}
                </button>
                <span className="news-count">
                    {filteredNews.length}개의 뉴스
                </span>
            </div>

            {/* News Grid */}
            {loading ? (
                <div className="news-loading">
                    <div className="loading-spinner">🛸</div>
                    <p>우주 뉴스를 수집하는 중...</p>
                </div>
            ) : error ? (
                <div className="news-error">
                    <span>⚠️</span>
                    <p>{error}</p>
                    <button onClick={loadNews}>다시 시도</button>
                </div>
            ) : filteredNews.length > 0 ? (
                <div className="news-page-grid">
                    {filteredNews.map((item, i) => (
                        <a
                            key={i}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-page-card"
                        >
                            <div className="news-card-content">
                                <h3 className="news-card-title-kr">{item.titleKr}</h3>
                                <p className="news-card-title-en">{item.title}</p>
                                <div className="news-card-footer">
                                    <span className="news-source">{item.source}</span>
                                    <span className="news-date">{formatDate(item.pubDate)}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="no-news">
                    <span>📭</span>
                    <p>해당 카테고리의 뉴스가 없습니다</p>
                </div>
            )}
        </div>
    );
}
