// Server API for real-time stock quotes

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

// Fetch stock data via API Route
export async function fetchStockQuotes(tickers: string[]): Promise<StockQuoteMap> {
    try {
        const symbols = tickers.join(',');
        const response = await fetch(`/api/market-data?symbols=${encodeURIComponent(symbols)}`);

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

// Market state label
export function getMarketStateLabel(state: string): string {
    switch (state) {
        case 'PRE': return 'Pre-Market';
        case 'REGULAR': return 'Regular';
        case 'POST': return 'After-Hours';
        case 'CLOSED': return 'Closed';
        default: return state;
    }
}
