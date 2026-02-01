'use client';

import { useState, useMemo } from 'react';

export default function CurrencyConverter() {
    const [usd, setUsd] = useState<number>(100);
    const [rate] = useState<number>(1450); // 기본 환율

    // 계산된 값으로 krw를 처리
    const krw = useMemo(() => Math.round(usd * rate), [usd, rate]);

    const handleUsdChange = (value: number) => {
        setUsd(value);
    };

    const handleKrwChange = (value: number) => {
        // KRW 입력 시 USD로 역산
        setUsd(Math.round((value / rate) * 100) / 100);
    };

    const formatKRW = (value: number) => {
        return new Intl.NumberFormat('ko-KR').format(value);
    };

    return (
        <div className="currency-converter">
            <h3 className="tool-title">💱 환율 계산기</h3>

            <div className="rate-display">
                <span>현재 환율: </span>
                <strong>$1 = ₩{formatKRW(rate)}</strong>
            </div>

            <div className="converter-inputs">
                <div className="input-group">
                    <label>USD ($)</label>
                    <input
                        type="number"
                        value={usd}
                        onChange={(e) => handleUsdChange(Number(e.target.value))}
                        min={0}
                        step={1}
                    />
                </div>

                <div className="converter-arrow">⇄</div>

                <div className="input-group">
                    <label>KRW (₩)</label>
                    <input
                        type="number"
                        value={krw}
                        onChange={(e) => handleKrwChange(Number(e.target.value))}
                        min={0}
                        step={1000}
                    />
                </div>
            </div>

            <div className="converter-result">
                <p>${usd.toLocaleString()} = ₩{formatKRW(krw)}</p>
            </div>
        </div>
    );
}
