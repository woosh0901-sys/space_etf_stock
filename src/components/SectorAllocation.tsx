'use client';

import { useState, useMemo } from 'react';
import { getUFOData, getARKXData } from '@/lib/etf-data';

interface SectorData {
    name: string;
    nameKr: string;
    ufoWeight: number;
    arkxWeight: number;
}

// ETF 보유종목을 섹터별로 분류
const SECTOR_MAPPING: Record<string, { name: string; nameKr: string }> = {
    // 방산/항공우주
    'LMT': { name: 'Defense', nameKr: '방산' },
    'NOC': { name: 'Defense', nameKr: '방산' },
    'RTX': { name: 'Defense', nameKr: '방산' },
    'BA': { name: 'Aerospace', nameKr: '항공우주' },
    'GD': { name: 'Defense', nameKr: '방산' },
    'LHX': { name: 'Defense', nameKr: '방산' },

    // 위성통신
    'IRDM': { name: 'Satellite', nameKr: '위성통신' },
    'GSAT': { name: 'Satellite', nameKr: '위성통신' },
    'VSAT': { name: 'Satellite', nameKr: '위성통신' },

    // 우주탐사/발사
    'RKLB': { name: 'Space Launch', nameKr: '우주발사' },
    'SPCE': { name: 'Space Tourism', nameKr: '우주관광' },
    'RDW': { name: 'Space Launch', nameKr: '우주발사' },

    // 기술/AI
    'NVDA': { name: 'Technology', nameKr: '기술' },
    'GOOG': { name: 'Technology', nameKr: '기술' },
    'GOOGL': { name: 'Technology', nameKr: '기술' },
    'MSFT': { name: 'Technology', nameKr: '기술' },

    // 전기차/에너지
    'TSLA': { name: 'EV/Energy', nameKr: '전기차/에너지' },

    // 3D 프린팅/제조
    'DDD': { name: 'Manufacturing', nameKr: '제조' },
    'SSYS': { name: 'Manufacturing', nameKr: '제조' },

    // 드론/UAV
    'AVAV': { name: 'Drones', nameKr: '드론' },
    'KTOS': { name: 'Drones', nameKr: '드론' },
};

export default function SectorAllocation() {
    const [compareMode, setCompareMode] = useState<'side-by-side' | 'stacked'>('side-by-side');

    const ufoHoldings = getUFOData().holdings;
    const arkxHoldings = getARKXData().holdings;

    const sectorData = useMemo(() => {
        const sectorMap = new Map<string, SectorData>();

        // UFO 종목 분석
        ufoHoldings.forEach(h => {
            const sector = SECTOR_MAPPING[h.ticker] || { name: 'Other', nameKr: '기타' };
            const existing = sectorMap.get(sector.nameKr) || {
                name: sector.name,
                nameKr: sector.nameKr,
                ufoWeight: 0,
                arkxWeight: 0
            };
            existing.ufoWeight += h.weight;
            sectorMap.set(sector.nameKr, existing);
        });

        // ARKX 종목 분석
        arkxHoldings.forEach(h => {
            const sector = SECTOR_MAPPING[h.ticker] || { name: 'Other', nameKr: '기타' };
            const existing = sectorMap.get(sector.nameKr) || {
                name: sector.name,
                nameKr: sector.nameKr,
                ufoWeight: 0,
                arkxWeight: 0
            };
            existing.arkxWeight += h.weight;
            sectorMap.set(sector.nameKr, existing);
        });

        // 비중 순으로 정렬
        return Array.from(sectorMap.values()).sort((a, b) =>
            (b.ufoWeight + b.arkxWeight) - (a.ufoWeight + a.arkxWeight)
        );
    }, [ufoHoldings, arkxHoldings]);

    const maxWeight = Math.max(
        ...sectorData.map(s => Math.max(s.ufoWeight, s.arkxWeight))
    );

    return (
        <div className="sector-allocation">
            <h3 className="tool-title">🎯 섹터 배분</h3>

            <div className="sector-controls">
                <button
                    className={compareMode === 'side-by-side' ? 'active' : ''}
                    onClick={() => setCompareMode('side-by-side')}
                >
                    비교
                </button>
                <button
                    className={compareMode === 'stacked' ? 'active' : ''}
                    onClick={() => setCompareMode('stacked')}
                >
                    합계
                </button>
            </div>

            <div className="sector-legend">
                <span className="legend-ufo">● UFO</span>
                <span className="legend-arkx">● ARKX</span>
            </div>

            <div className="sector-bars">
                {sectorData.map(sector => (
                    <div key={sector.nameKr} className="sector-row">
                        <div className="sector-name">
                            <span className="name-kr">{sector.nameKr}</span>
                        </div>

                        {compareMode === 'side-by-side' ? (
                            <div className="sector-bar-container">
                                <div className="bar-row">
                                    <div
                                        className="sector-bar ufo"
                                        style={{ width: `${(sector.ufoWeight / maxWeight) * 100}%` }}
                                    >
                                        {sector.ufoWeight > 2 && (
                                            <span className="bar-label">{sector.ufoWeight.toFixed(1)}%</span>
                                        )}
                                    </div>
                                </div>
                                <div className="bar-row">
                                    <div
                                        className="sector-bar arkx"
                                        style={{ width: `${(sector.arkxWeight / maxWeight) * 100}%` }}
                                    >
                                        {sector.arkxWeight > 2 && (
                                            <span className="bar-label">{sector.arkxWeight.toFixed(1)}%</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="sector-bar-container stacked">
                                <div className="bar-row">
                                    <div
                                        className="sector-bar ufo"
                                        style={{ width: `${(sector.ufoWeight / (maxWeight * 2)) * 100}%` }}
                                    />
                                    <div
                                        className="sector-bar arkx"
                                        style={{ width: `${(sector.arkxWeight / (maxWeight * 2)) * 100}%` }}
                                    />
                                    <span className="bar-total">
                                        {(sector.ufoWeight + sector.arkxWeight).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <p className="sector-note">
                * 보유 종목 기준 산업별 분류
            </p>
        </div>
    );
}
