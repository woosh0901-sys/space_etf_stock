// 서버 API를 통한 실시간 주가 조회 (CORS 우회)

export interface StockQuote {
    ticker: string;
    price: number;
    change: number;
    changePercent: number;
    marketState: 'PRE' | 'REGULAR' | 'POST' | 'CLOSED';
    preMarketPrice?: number;
    postMarketPrice?: number;
}

export interface StockQuoteMap {
    [ticker: string]: StockQuote | null;
}

// 주가 데이터 가져오기 (API Route를 통해 호출)
export async function fetchStockQuotes(tickers: string[]): Promise<StockQuoteMap> {
    try {
        const symbols = tickers.join(',');
        const response = await fetch(`/api/quotes?symbols=${encodeURIComponent(symbols)}`);

        if (!response.ok) {
            console.error('Failed to fetch quotes:', response.status);
            return {};
        }

        const data = await response.json();
        return data.quotes || {};
    } catch (error) {
        console.error('Failed to fetch quotes:', error);
        return {};
    }
}

// 마켓 상태 한글 표시
export function getMarketStateLabel(state: string): string {
    switch (state) {
        case 'PRE': return '프리마켓';
        case 'REGULAR': return '거래중';
        case 'POST': return '애프터마켓';
        case 'CLOSED': return '마감';
        default: return state;
    }
}
