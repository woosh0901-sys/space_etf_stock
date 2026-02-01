import { NextResponse } from 'next/server';

interface NewsItem {
    title: string;
    titleKr: string;
    link: string;
    pubDate: string;
    source: string;
}

// 무료 번역 API (Google Translate 비공식)
async function translateToKorean(text: string): Promise<string> {
    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&q=${encodeURIComponent(text)}`,
            { next: { revalidate: 3600 } } // 1시간 캐시
        );

        if (!response.ok) return text;

        const data = await response.json();
        // 번역 결과 추출
        const translated = data[0]?.map((item: [string]) => item[0]).join('') || text;
        return translated;
    } catch {
        return text; // 번역 실패 시 원문 반환
    }
}

// 우주 관련 키워드 목록
const SPACE_KEYWORDS = [
    'space', 'SpaceX', 'NASA', 'rocket', 'satellite', 'Starlink',
    'Mars', 'Moon', 'lunar', 'orbit', 'astronaut', 'ISS',
    'Blue Origin', 'Rocket Lab', 'launch', 'spacecraft',
    'asteroid', 'cosmos', 'galaxy', 'telescope', 'Artemis',
    'starship', 'falcon', 'SLS', 'JWST', 'Webb'
];

export async function GET() {
    const allNews: NewsItem[] = [];

    try {
        // Google News RSS - 우주 관련 뉴스
        const rssUrls = [
            'https://news.google.com/rss/search?q=space+exploration&hl=en-US&gl=US&ceid=US:en',
            'https://news.google.com/rss/search?q=SpaceX+OR+NASA+rocket&hl=en-US&gl=US&ceid=US:en',
            'https://news.google.com/rss/search?q=satellite+launch&hl=en-US&gl=US&ceid=US:en',
        ];

        for (const rssUrl of rssUrls) {
            try {
                const response = await fetch(rssUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    next: { revalidate: 300 } // 5분 캐시
                });

                if (!response.ok) continue;

                const text = await response.text();
                const itemMatches = text.match(/<item>([\s\S]*?)<\/item>/g) || [];

                for (const item of itemMatches.slice(0, 10)) {
                    const title = item.match(/<title>([\s\S]*?)<\/title>/)?.[1]
                        ?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
                        ?.replace(/&amp;/g, '&')
                        ?.replace(/&lt;/g, '<')
                        ?.replace(/&gt;/g, '>')
                        ?.replace(/&quot;/g, '"')
                        ?.replace(/&#39;/g, "'")
                        || '';

                    const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
                    const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
                    const source = item.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]
                        ?.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
                        || 'Google News';

                    // 우주 관련 뉴스만 필터링
                    const isSpaceNews = SPACE_KEYWORDS.some(kw =>
                        title.toLowerCase().includes(kw.toLowerCase())
                    );

                    if (title && link && isSpaceNews) {
                        allNews.push({
                            title: title.trim(),
                            titleKr: '', // 나중에 번역
                            link: link.trim(),
                            pubDate: pubDate.trim(),
                            source: source.trim()
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch RSS:', error);
            }
        }

        // 중복 제거
        const uniqueNews = allNews.filter((item, index, self) =>
            index === self.findIndex((t) => t.title === item.title)
        );

        // 최신순 정렬
        uniqueNews.sort((a, b) => {
            try {
                return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
            } catch {
                return 0;
            }
        });

        // 상위 30개만 번역
        const topNews = uniqueNews.slice(0, 30);

        // 병렬 번역 (5개씩 배치)
        for (let i = 0; i < topNews.length; i += 5) {
            const batch = topNews.slice(i, i + 5);
            const translations = await Promise.all(
                batch.map(item => translateToKorean(item.title))
            );
            translations.forEach((tr, idx) => {
                topNews[i + idx].titleKr = tr;
            });
        }

        return NextResponse.json({ news: topNews });
    } catch (error) {
        console.error('Failed to fetch space news:', error);
        return NextResponse.json({ news: [] });
    }
}
