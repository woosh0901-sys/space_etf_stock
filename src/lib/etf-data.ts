import ufoData from '@/data/ufo-holdings.json';
import arkxData from '@/data/arkx-holdings.json';

export interface Holding {
    ticker: string;
    name: string;
    weight: number;
    sector: string;
}

export interface ETFData {
    etf: {
        ticker: string;
        name: string;
        description: string;
        lastUpdated: string;
    };
    holdings: Holding[];
}

export interface CombinedHolding extends Holding {
    ufoWeight: number | null;
    arkxWeight: number | null;
    isOverlap: boolean;
}

export function getUFOData(): ETFData {
    return ufoData as ETFData;
}

export function getARKXData(): ETFData {
    return arkxData as ETFData;
}

export function getCombinedHoldings(): CombinedHolding[] {
    const ufo = getUFOData();
    const arkx = getARKXData();

    const holdingsMap = new Map<string, CombinedHolding>();

    // UFO 종목 추가
    ufo.holdings.forEach(h => {
        holdingsMap.set(h.ticker, {
            ...h,
            ufoWeight: h.weight,
            arkxWeight: null,
            isOverlap: false
        });
    });

    // ARKX 종목 추가 또는 병합
    arkx.holdings.forEach(h => {
        const existing = holdingsMap.get(h.ticker);
        if (existing) {
            existing.arkxWeight = h.weight;
            existing.isOverlap = true;
        } else {
            holdingsMap.set(h.ticker, {
                ...h,
                ufoWeight: null,
                arkxWeight: h.weight,
                isOverlap: false
            });
        }
    });

    // 비중 합계로 정렬 (중복 종목 우선)
    return Array.from(holdingsMap.values()).sort((a, b) => {
        // 먼저 중복 종목 우선
        if (a.isOverlap !== b.isOverlap) return a.isOverlap ? -1 : 1;
        // 같은 그룹 내에서는 총 비중으로 정렬
        const aTotal = (a.ufoWeight || 0) + (a.arkxWeight || 0);
        const bTotal = (b.ufoWeight || 0) + (b.arkxWeight || 0);
        return bTotal - aTotal;
    });
}

export function getOverlapCount(): number {
    return getCombinedHoldings().filter(h => h.isOverlap).length;
}
