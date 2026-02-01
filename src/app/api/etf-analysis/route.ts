import { NextRequest, NextResponse } from 'next/server';
import { getUFOData, getARKXData } from '@/lib/etf-data';

interface ContributorStock {
    ticker: string;
    name: string;
    nameKr: string;
    weight: number;
    priceChange: number;
    changePercent: number;
    contribution: number; // ETF에 대한 기여도
}

interface ETFAnalysis {
    etfTicker: string;
    etfChange: number;
    etfChangePercent: number;
    topGainers: ContributorStock[];
    topLosers: ContributorStock[];
    explanation: string;
}

const YAHOO_FINANCE_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

async function fetchQuote(ticker: string): Promise<{ price: number; change: number; changePercent: number } | null> {
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

        if (!response.ok) return null;

        const data = await response.json();
        const result = data.chart?.result?.[0];
        if (!result) return null;

        const meta = result.meta;
        const price = meta.regularMarketPrice ?? 0;
        const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
        const change = price - previousClose;
        const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

        return { price, change, changePercent };
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const etfTicker = searchParams.get('etf') || 'UFO';

    try {
        const etfData = etfTicker === 'ARKX' ? getARKXData() : getUFOData();
        const holdings = etfData.holdings;

        // ETF 자체 가격 조회
        const etfQuote = await fetchQuote(etfTicker);
        if (!etfQuote) {
            return NextResponse.json({ error: 'Failed to fetch ETF data' }, { status: 500 });
        }

        // 상위 15개 종목만 분석 (비중 높은 순)
        const topHoldings = holdings.slice(0, 15);

        // 병렬로 주가 데이터 조회
        const quotePromises = topHoldings.map(async (holding) => {
            const quote = await fetchQuote(holding.ticker);
            if (!quote) return null;

            // ETF 기여도 계산: (종목 비중 / 100) * 종목 변동률
            const contribution = (holding.weight / 100) * quote.changePercent;

            return {
                ticker: holding.ticker,
                name: holding.name,
                nameKr: holding.nameKr,
                weight: holding.weight,
                priceChange: quote.change,
                changePercent: quote.changePercent,
                contribution
            };
        });

        const stockResults = await Promise.all(quotePromises);
        const validStocks = stockResults.filter((s): s is ContributorStock => s !== null);

        // 기여도 기준 정렬
        const sortedByContribution = [...validStocks].sort((a, b) => b.contribution - a.contribution);

        // 상승 기여 종목 (양수 기여도)
        const topGainers = sortedByContribution
            .filter(s => s.contribution > 0)
            .slice(0, 5);

        // 하락 기여 종목 (음수 기여도)
        const topLosers = sortedByContribution
            .filter(s => s.contribution < 0)
            .sort((a, b) => a.contribution - b.contribution)
            .slice(0, 5);

        // 설명 생성
        let explanation = '';
        if (etfQuote.changePercent >= 0.5) {
            const mainGainer = topGainers[0];
            explanation = mainGainer
                ? `${etfTicker}가 ${etfQuote.changePercent.toFixed(2)}% 상승했습니다. 주요 상승 요인은 ${mainGainer.nameKr}(${mainGainer.ticker})이 ${mainGainer.changePercent.toFixed(2)}% 올랐기 때문입니다.`
                : `${etfTicker}가 ${etfQuote.changePercent.toFixed(2)}% 상승했습니다.`;
        } else if (etfQuote.changePercent <= -0.5) {
            const mainLoser = topLosers[0];
            explanation = mainLoser
                ? `${etfTicker}가 ${Math.abs(etfQuote.changePercent).toFixed(2)}% 하락했습니다. 주요 하락 요인은 ${mainLoser.nameKr}(${mainLoser.ticker})이 ${Math.abs(mainLoser.changePercent).toFixed(2)}% 내렸기 때문입니다.`
                : `${etfTicker}가 ${Math.abs(etfQuote.changePercent).toFixed(2)}% 하락했습니다.`;
        } else {
            explanation = `${etfTicker}가 ${etfQuote.changePercent >= 0 ? '+' : ''}${etfQuote.changePercent.toFixed(2)}%로 보합세를 유지하고 있습니다.`;
        }

        const analysis: ETFAnalysis = {
            etfTicker,
            etfChange: etfQuote.change,
            etfChangePercent: etfQuote.changePercent,
            topGainers,
            topLosers,
            explanation
        };

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('Failed to analyze ETF:', error);
        return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
    }
}
