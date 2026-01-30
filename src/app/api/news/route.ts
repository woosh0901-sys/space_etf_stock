import { NextRequest, NextResponse } from 'next/server';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    if (!ticker) {
        return NextResponse.json({ error: 'No ticker provided' }, { status: 400 });
    }

    try {
        // Yahoo Finance 뉴스 RSS 피드 사용
        const response = await fetch(
            `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${ticker}&region=US&lang=en-US`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                next: { revalidate: 300 } // 5분 캐시
            }
        );

        if (!response.ok) {
            return NextResponse.json({ news: [] });
        }

        const text = await response.text();
        const news: NewsItem[] = [];

        // 간단한 XML 파싱 (RSS)
        const itemMatches = text.match(/<item>([\s\S]*?)<\/item>/g) || [];

        for (const item of itemMatches.slice(0, 10)) { // 최대 10개
            const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') || '';
            const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
            const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';

            if (title && link) {
                news.push({
                    title: title.trim(),
                    link: link.trim(),
                    pubDate: pubDate.trim(),
                    source: 'Yahoo Finance'
                });
            }
        }

        return NextResponse.json({ news });
    } catch (error) {
        console.error('Failed to fetch news:', error);
        return NextResponse.json({ news: [] });
    }
}
