'use client';

import { useState, useMemo } from 'react';

type CalculatorMode = 'cagr' | 'future' | 'period';

export default function ReturnCalculator() {
    const [mode, setMode] = useState<CalculatorMode>('cagr');

    // CAGR 계산용
    const [initialValue, setInitialValue] = useState<number>(1000000);
    const [finalValue, setFinalValue] = useState<number>(1500000);
    const [years, setYears] = useState<number>(3);

    // 미래 가치 계산용
    const [targetReturn, setTargetReturn] = useState<number>(10);

    const results = useMemo(() => {
        // CAGR 계산: ((최종값/초기값)^(1/년수) - 1) * 100
        const cagr = ((Math.pow(finalValue / initialValue, 1 / years) - 1) * 100);

        // 미래 가치: 초기값 * (1 + 수익률)^년수
        const futureValue = initialValue * Math.pow(1 + targetReturn / 100, years);

        // 목표 달성 기간: log(최종값/초기값) / log(1 + 수익률)
        const periodNeeded = targetReturn > 0
            ? Math.log(finalValue / initialValue) / Math.log(1 + targetReturn / 100)
            : 0;

        // 일일/월별 수익률 환산
        const dailyReturn = Math.pow(1 + cagr / 100, 1 / 252) - 1; // 연 252거래일 기준
        const monthlyReturn = Math.pow(1 + cagr / 100, 1 / 12) - 1;

        return {
            cagr: isNaN(cagr) || !isFinite(cagr) ? 0 : cagr,
            futureValue: isNaN(futureValue) || !isFinite(futureValue) ? 0 : futureValue,
            periodNeeded: isNaN(periodNeeded) || !isFinite(periodNeeded) ? 0 : periodNeeded,
            dailyReturn: isNaN(dailyReturn) || !isFinite(dailyReturn) ? 0 : dailyReturn * 100,
            monthlyReturn: isNaN(monthlyReturn) || !isFinite(monthlyReturn) ? 0 : monthlyReturn * 100
        };
    }, [initialValue, finalValue, years, targetReturn]);

    const formatKRW = (value: number) => {
        return new Intl.NumberFormat('ko-KR').format(Math.round(value));
    };

    return (
        <div className="return-calculator">
            <h3 className="tool-title">📈 수익률 계산기</h3>

            <div className="calc-mode-tabs">
                <button
                    className={mode === 'cagr' ? 'active' : ''}
                    onClick={() => setMode('cagr')}
                >
                    CAGR
                </button>
                <button
                    className={mode === 'future' ? 'active' : ''}
                    onClick={() => setMode('future')}
                >
                    미래가치
                </button>
                <button
                    className={mode === 'period' ? 'active' : ''}
                    onClick={() => setMode('period')}
                >
                    목표기간
                </button>
            </div>

            <div className="calc-inputs">
                <div className="input-row">
                    <label>초기 투자금 (원)</label>
                    <input
                        type="number"
                        value={initialValue}
                        onChange={(e) => setInitialValue(Number(e.target.value))}
                        min={0}
                        step={100000}
                    />
                </div>

                {mode === 'cagr' && (
                    <>
                        <div className="input-row">
                            <label>최종 금액 (원)</label>
                            <input
                                type="number"
                                value={finalValue}
                                onChange={(e) => setFinalValue(Number(e.target.value))}
                                min={0}
                                step={100000}
                            />
                        </div>
                        <div className="input-row">
                            <label>투자 기간 (년)</label>
                            <input
                                type="number"
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                min={1}
                                max={50}
                                step={1}
                            />
                        </div>
                    </>
                )}

                {mode === 'future' && (
                    <>
                        <div className="input-row">
                            <label>연 수익률 (%)</label>
                            <input
                                type="number"
                                value={targetReturn}
                                onChange={(e) => setTargetReturn(Number(e.target.value))}
                                min={-50}
                                max={100}
                                step={1}
                            />
                        </div>
                        <div className="input-row">
                            <label>투자 기간 (년)</label>
                            <input
                                type="number"
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                min={1}
                                max={50}
                                step={1}
                            />
                        </div>
                    </>
                )}

                {mode === 'period' && (
                    <>
                        <div className="input-row">
                            <label>목표 금액 (원)</label>
                            <input
                                type="number"
                                value={finalValue}
                                onChange={(e) => setFinalValue(Number(e.target.value))}
                                min={0}
                                step={100000}
                            />
                        </div>
                        <div className="input-row">
                            <label>예상 연 수익률 (%)</label>
                            <input
                                type="number"
                                value={targetReturn}
                                onChange={(e) => setTargetReturn(Number(e.target.value))}
                                min={1}
                                max={100}
                                step={1}
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="calc-results">
                {mode === 'cagr' && (
                    <>
                        <div className="result-row highlight">
                            <span>연평균 성장률 (CAGR)</span>
                            <span className={results.cagr >= 0 ? 'positive' : 'negative'}>
                                {results.cagr >= 0 ? '+' : ''}{results.cagr.toFixed(2)}%
                            </span>
                        </div>
                        <div className="result-row">
                            <span>월 평균 수익률</span>
                            <span>{results.monthlyReturn.toFixed(3)}%</span>
                        </div>
                        <div className="result-row">
                            <span>일 평균 수익률</span>
                            <span>{results.dailyReturn.toFixed(4)}%</span>
                        </div>
                    </>
                )}

                {mode === 'future' && (
                    <div className="result-row highlight">
                        <span>{years}년 후 예상 금액</span>
                        <span>₩{formatKRW(results.futureValue)}</span>
                    </div>
                )}

                {mode === 'period' && (
                    <div className="result-row highlight">
                        <span>목표 달성 예상 기간</span>
                        <span>{results.periodNeeded.toFixed(1)}년</span>
                    </div>
                )}
            </div>

            <p className="calc-note">
                * 복리 기준 계산, 세금/수수료 미포함
            </p>
        </div>
    );
}
