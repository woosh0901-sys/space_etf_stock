'use client';

import { useEffect, useRef, useState } from 'react';

interface ChartModalProps {
    ticker: string;
    name: string;
    nameKr: string;
    isOpen: boolean;
    onClose: () => void;
}

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
}

export default function ChartModal({ ticker, name, nameKr, isOpen, onClose }: ChartModalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'chart' | 'news'>('chart');
    const [news, setNews] = useState<NewsItem[]>([]);
    const [newsLoading, setNewsLoading] = useState(false);

    // 차트 로드
    useEffect(() => {
        if (!isOpen || !containerRef.current || activeTab !== 'chart') return;

        const container = containerRef.current;
        container.innerHTML = '';

        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'tradingview-widget-container';
        widgetContainer.style.height = '100%';
        widgetContainer.style.width = '100%';

        const widgetDiv = document.createElement('div');
        widgetDiv.className = 'tradingview-widget-container__widget';
        widgetDiv.style.height = 'calc(100% - 32px)';
        widgetDiv.style.width = '100%';

        widgetContainer.appendChild(widgetDiv);
        container.appendChild(widgetContainer);

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol: ticker,
            interval: 'D',
            timezone: 'Asia/Seoul',
            theme: 'dark',
            style: '1',
            locale: 'kr',
            backgroundColor: 'rgba(18, 18, 42, 1)',
            gridColor: 'rgba(100, 100, 150, 0.1)',
            enable_publishing: false,
            allow_symbol_change: true,
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: false,
            calendar: false,
            hide_volume: false,
            support_host: 'https://www.tradingview.com'
        });

        widgetContainer.appendChild(script);
    }, [isOpen, ticker, activeTab]);

    // 뉴스 로드
    useEffect(() => {
        if (!isOpen || activeTab !== 'news') return;

        const loadNews = async () => {
            setNewsLoading(true);
            try {
                const response = await fetch(`/api/news?ticker=${ticker}`);
                const data = await response.json();
                setNews(data.news || []);
            } catch (error) {
                console.error('Failed to load news:', error);
                setNews([]);
            } finally {
                setNewsLoading(false);
            }
        };

        loadNews();
    }, [isOpen, ticker, activeTab]);

    // ESC 키로 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // 탭 변경 시 상태 리셋
    useEffect(() => {
        setActiveTab('chart');
        setNews([]);
    }, [ticker]);

    if (!isOpen) return null;

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <span className="modal-ticker">{ticker}</span>
                        <span className="modal-name">{nameKr} ({name})</span>
                    </div>
                    <div className="modal-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'chart' ? 'active' : ''}`}
                            onClick={() => setActiveTab('chart')}
                        >
                            📈 차트
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
                            onClick={() => setActiveTab('news')}
                        >
                            📰 뉴스
                        </button>
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {activeTab === 'chart' ? (
                    <div className="chart-container" ref={containerRef}>
                        <div className="chart-loading">
                            <span>📊</span>
                            <p>차트 로딩 중...</p>
                        </div>
                    </div>
                ) : (
                    <div className="news-container">
                        {newsLoading ? (
                            <div className="news-loading">
                                <span>📡</span>
                                <p>뉴스 로딩 중...</p>
                            </div>
                        ) : news.length > 0 ? (
                            <div className="news-list">
                                {news.map((item, i) => (
                                    <a
                                        key={i}
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="news-item"
                                    >
                                        <span className="news-title">{item.title}</span>
                                        <div className="news-meta">
                                            <span className="news-source">{item.source}</span>
                                            <span className="news-date">{formatDate(item.pubDate)}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="no-news">
                                <span>📭</span>
                                <p>관련 뉴스가 없습니다</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
