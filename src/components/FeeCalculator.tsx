'use client';

import { useState } from 'react';

interface FeeResult {
    investment: number;
    tradingFee: number;
    taxOnProfit: number;
    netProfit: number;
    totalReturn: number;
}

export default function FeeCalculator() {
    const [investment, setInvestment] = useState<number>(1000000);
    const [profitPercent, setProfitPercent] = useState<number>(10);
    const [broker, setBroker] = useState<'korea' | 'overseas'>('overseas');

    const calculateFees = (): FeeResult => {
        const profit = investment * (profitPercent / 100);

        // 해외주식 수수료 (일반적으로 0.25%)
        const tradingFeeRate = broker === 'overseas' ? 0.0025 : 0.015;
        const tradingFee = investment * tradingFeeRate * 2; // 매수 + 매도

        // 해외주식 양도소득세 (250만원 공제 후 22%)
        let taxOnProfit = 0;
        if (broker === 'overseas' && profit > 2500000) {
            taxOnProfit = (profit - 2500000) * 0.22;
        }

        const netProfit = profit - tradingFee - taxOnProfit;
        const totalReturn = investment + netProfit;

        return {
            investment,
            tradingFee,
            taxOnProfit,
            netProfit,
            totalReturn
        };
    };

    const result = calculateFees();

    const formatKRW = (value: number) => {
        return new Intl.NumberFormat('ko-KR').format(Math.round(value));
    };

    return (
        <div className="fee-calculator">
            <h3 className="tool-title">🧮 수수료 계산기</h3>

            <div className="calc-inputs">
                <div className="input-row">
                    <label>투자 금액</label>
                    <input
                        type="number"
                        value={investment}
                        onChange={(e) => setInvestment(Number(e.target.value))}
                        min={0}
                        step={100000}
                    />
                </div>

                <div className="input-row">
                    <label>예상 수익률 (%)</label>
                    <input
                        type="number"
                        value={profitPercent}
                        onChange={(e) => setProfitPercent(Number(e.target.value))}
                        min={-100}
                        max={1000}
                        step={1}
                    />
                </div>

                <div className="input-row">
                    <label>투자 유형</label>
                    <div className="broker-toggle">
                        <button
                            className={broker === 'overseas' ? 'active' : ''}
                            onClick={() => setBroker('overseas')}
                        >
                            해외주식
                        </button>
                        <button
                            className={broker === 'korea' ? 'active' : ''}
                            onClick={() => setBroker('korea')}
                        >
                            국내주식
                        </button>
                    </div>
                </div>
            </div>

            <div className="calc-results">
                <div className="result-row">
                    <span>투자 원금</span>
                    <span>₩{formatKRW(result.investment)}</span>
                </div>
                <div className="result-row">
                    <span>거래 수수료</span>
                    <span className="negative">-₩{formatKRW(result.tradingFee)}</span>
                </div>
                {result.taxOnProfit > 0 && (
                    <div className="result-row">
                        <span>양도소득세 (22%)</span>
                        <span className="negative">-₩{formatKRW(result.taxOnProfit)}</span>
                    </div>
                )}
                <div className="result-row total">
                    <span>순 수익</span>
                    <span className={result.netProfit >= 0 ? 'positive' : 'negative'}>
                        {result.netProfit >= 0 ? '+' : ''}₩{formatKRW(result.netProfit)}
                    </span>
                </div>
                <div className="result-row final">
                    <span>최종 금액</span>
                    <span>₩{formatKRW(result.totalReturn)}</span>
                </div>
            </div>

            <p className="calc-note">
                * 해외주식: 수수료 0.25%, 양도세 22% (250만원 공제)
            </p>
        </div>
    );
}
