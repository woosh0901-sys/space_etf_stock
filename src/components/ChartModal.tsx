'use client';

import { useEffect, useRef } from 'react';

interface ChartModalProps {
    ticker: string;
    name: string;
    nameKr: string;
    exchange?: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ChartModal({ ticker, name, nameKr, exchange, isOpen, onClose }: ChartModalProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Map Yahoo Finance exchange to TradingView exchange
    const getTradingViewSymbol = (ticker: string, exchange?: string) => {
        if (!exchange) return ticker;

        // Exchange Mapping Logic
        const ex = exchange.toUpperCase();
        if (ex.includes('NASDAQ')) return `NASDAQ:${ticker}`;
        if (ex.includes('NYSE') || ex.includes('NYQ')) return `NYSE:${ticker}`;
        if (ex.includes('BATS') || ex.includes('CBOE')) return `AMEX:${ticker}`; // ARKX often maps to AMEX/CBOE in TV
        if (ex.includes('AMEX') || ex.includes('ASE')) return `AMEX:${ticker}`;
        if (ex.includes('OTC') || ex.includes('PNK')) return `OTC:${ticker}`;

        return ticker; // Default fallback
    };

    // 차트 로드
    useEffect(() => {
        if (!isOpen || !containerRef.current) return;

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

        const tvSymbol = getTradingViewSymbol(ticker, exchange);

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol: tvSymbol,
            interval: '15',
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
            support_host: 'https://www.tradingview.com',
            overrides: {
                "mainSeriesProperties.sessionId": "extended"
            }
        });

        widgetContainer.appendChild(script);
    }, [isOpen, ticker, exchange]);

    // ESC 키로 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

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
