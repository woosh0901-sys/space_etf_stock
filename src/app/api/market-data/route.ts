import { NextRequest, NextResponse } from 'next/server';

const YAHOO_FINANCE_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

async function getQuotes(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols');

    if (!symbols) {
        return NextResponse.json({ error: 'No symbols provided' }, { status: 400 });
    }

    const tickers = symbols.split(',').slice(0, 50);
    const quotes: Record<string, unknown> = {};

    const promises = tickers.map(async (ticker) => {
        try {
            const response = await fetch(
                `${YAHOO_FINANCE_BASE}/${ticker}?interval=1d&range=1d`,
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    next: { revalidate: 60 }
                }
            );

            if (!response.ok) {
                quotes[ticker] = null;
                return;
            }

            const data = await response.json();
            const result = data.chart?.result?.[0];

            if (!result) {
                quotes[ticker] = null;
                return;
            }

            const meta = result.meta;
            const marketState = meta.marketState || 'CLOSED';

            console.log(`[DEBUG] ${ticker} State: ${marketState}, Reg: ${meta.regularMarketPrice}, Pre: ${meta.preMarketPrice}, Post: ${meta.postMarketPrice}`);

            let price = meta.regularMarketPrice ?? 0;

            // Price Selection Logic:
            // 1. Pre-Market: Show Pre-Market Price
            if (marketState === 'PRE' && meta.preMarketPrice) {
                price = meta.preMarketPrice;
            }
            // 2. After-Market or Closed: Show Post-Market Price if available
            // (Even if CLOSED, users often want to see the last after-hours price)
            else if (['POST', 'POSTPOST', 'CLOSED'].includes(marketState) && meta.postMarketPrice) {
                price = meta.postMarketPrice;
            }
            // 3. Regular Market: Default to regularMarketPrice (already set)

            const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
            const change = price - previousClose;
            const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

            quotes[ticker] = {
                ticker,
                price,
                change,
                changePercent,
                marketState
            };
        } catch (error) {
            console.error(`Failed to fetch ${ticker}:`, error);
            quotes[ticker] = null;
        }
    });

    await Promise.all(promises);

    return NextResponse.json({ quotes });
}

export async function GET(request: NextRequest) {
    try {
        return await getQuotes(request);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
