'use client';

import { useEffect, useRef } from 'react';

interface ChartModalProps {
    ticker: string;
    name: string;
    nameKr: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ChartModal({ ticker, name, nameKr, isOpen, onClose }: ChartModalProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen || !containerRef.current) return;

        // TradingView 위젯 스크립트 로드
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
            enable_publishing: false,
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: false,
            calendar: false,
            hide_volume: false,
            support_host: 'https://www.tradingview.com'
        });

        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(script);

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [isOpen, ticker]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">
                        <span className="modal-ticker">{ticker}</span>
                        <span className="modal-name">{nameKr} ({name})</span>
                    </div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="chart-container" ref={containerRef}>
                    <div className="chart-loading">
                        <span>📊</span>
                        <p>차트 로딩 중...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
