import TabNavigation from '@/components/TabNavigation';
import NewsContent from './NewsContent';

export default function NewsPage() {
    return (
        <>
            <TabNavigation />
            <main className="news-page">
                <header className="news-page-header">
                    <h1>🛸 우주 산업 뉴스</h1>
                    <p>전 세계 우주 산업 소식을 한국어로 확인하세요</p>
                </header>
                <NewsContent />
            </main>
        </>
    );
}
