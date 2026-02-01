'use client';

import { useState } from 'react';
import { StockQuoteMap } from '@/lib/stock-api';

interface PortfolioSimulatorProps {
    quotes: StockQuoteMap;
}

export default function PortfolioSimulator({ quotes }: PortfolioSimulatorProps) {
    const [investment, setInvestment] = useState(1000000); // 100만원
    const [ufoRatio, setUfoRatio] = useState(50); // UFO 비율

    const arkxRatio = 100 - ufoRatio;

    const ufoChange = quotes['UFO']?.changePercent || 0;
    const arkxChange = quotes['ARKX']?.changePercent || 0;

    const ufoInvestment = investment * (ufoRatio / 100);
    const arkxInvestment = investment * (arkxRatio / 100);

    // 오늘 기준 수익률 계산
    const ufoReturn = ufoInvestment * (ufoChange / 100);
    const arkxReturn = arkxInvestment * (arkxChange / 100);
    const totalReturn = ufoReturn + arkxReturn;
    const totalReturnPercent = (totalReturn / investment) * 100;

    const formatKRW = (value: number) => {
        return new Intl.NumberFormat('ko-KR').format(Math.round(value));
    };

    return (
        <div className="portfolio-simulator">
            <h3 className="simulator-title">💰 포트폴리오 시뮬레이터</h3>

            <div className="simulator-input">
                <label>투자 금액 (원)</label>
                <input
                    type="number"
                    value={investment}
                    onChange={(e) => setInvestment(Number(e.target.value))}
                    min={0}
                    step={100000}
                />
            </div>

            <div className="simulator-slider">
                <div className="slider-labels">
                    <span className="ufo-label">UFO {ufoRatio}%</span>
                    <span className="arkx-label">ARKX {arkxRatio}%</span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={ufoRatio}
                    onChange={(e) => setUfoRatio(Number(e.target.value))}
                    className="ratio-slider"
                />
            </div>

            <div className="simulator-breakdown">
                <div className="breakdown-item">
                    <span className="breakdown-label">UFO 투자</span>
                    <span className="breakdown-value">₩{formatKRW(ufoInvestment)}</span>
                    <span className={`breakdown-return ${ufoReturn >= 0 ? 'positive' : 'negative'}`}>
                        {ufoReturn >= 0 ? '+' : ''}₩{formatKRW(ufoReturn)}
                    </span>
                </div>
                <div className="breakdown-item">
                    <span className="breakdown-label">ARKX 투자</span>
                    <span className="breakdown-value">₩{formatKRW(arkxInvestment)}</span>
                    <span className={`breakdown-return ${arkxReturn >= 0 ? 'positive' : 'negative'}`}>
                        {arkxReturn >= 0 ? '+' : ''}₩{formatKRW(arkxReturn)}
                    </span>
                </div>
            </div>

            <div className="simulator-result">
                <div className="result-label">오늘 예상 수익</div>
                <div className={`result-value ${totalReturn >= 0 ? 'positive' : 'negative'}`}>
                    {totalReturn >= 0 ? '+' : ''}₩{formatKRW(totalReturn)}
                    <span className="result-percent">
                        ({totalReturnPercent >= 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%)
                    </span>
                </div>
            </div>

            <p className="simulator-disclaimer">
                * 오늘 ETF 변동률 기준 예상치입니다
            </p>
        </div>
    );
}
