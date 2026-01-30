// Yahoo Finance API를 통한 실시간 주가 조회
const YAHOO_FINANCE_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

export interface StockQuote {
    ticker: string;
    price: number;
    change: number;
    changePercent: number;
    marketState: 'PRE' | 'REGULAR' | 'POST' | 'CLOSED';
}

export interface StockQuoteMap {
    [ticker: string]: StockQuote | null;
}

// 주가 데이터 가져오기 (클라이언트에서 직접 호출)
export async function fetchStockQuotes(tickers: string[]): Promise<StockQuoteMap> {
    const quotes: StockQuoteMap = {};

    // 병렬로 요청하되, rate limit 고려해서 5개씩 배치
    const batchSize = 5;
    for (let i = 0; i < tickers.length; i += batchSize) {
        const batch = tickers.slice(i, i + batchSize);
        const promises = batch.map(ticker => fetchSingleQuote(ticker));
        const results = await Promise.all(promises);

        batch.forEach((ticker, index) => {
            quotes[ticker] = results[index];
        });

        // Rate limit 방지를 위한 딜레이
        if (i + batchSize < tickers.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    return quotes;
}

async function fetchSingleQuote(ticker: string): Promise<StockQuote | null> {
    try {
        const response = await fetch(
            `${YAHOO_FINANCE_BASE}/${ticker}?interval=1d&range=1d`,
            {
                next: { revalidate: 60 }, // 1분마다 리프레시
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            }
        );

        if (!response.ok) return null;

        const data = await response.json();
        const result = data.chart?.result?.[0];

        if (!result) return null;

        const meta = result.meta;
        const price = meta.regularMarketPrice ?? 0;
        const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
        const change = price - previousClose;
        const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

        return {
            ticker,
            price,
            change,
            changePercent,
            marketState: meta.marketState || 'CLOSED'
        };
    } catch (error) {
        console.error(`Failed to fetch quote for ${ticker}:`, error);
        return null;
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
