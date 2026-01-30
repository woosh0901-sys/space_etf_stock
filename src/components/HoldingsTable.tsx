'use client';

import { CombinedHolding } from '@/lib/etf-data';

interface HoldingsTableProps {
    holdings: CombinedHolding[];
    filter: 'all' | 'ufo' | 'arkx' | 'overlap';
    searchTerm: string;
}

export default function HoldingsTable({ holdings, filter, searchTerm }: HoldingsTableProps) {
    const filtered = holdings.filter(h => {
        // 검색 필터
        const matchesSearch = searchTerm === '' ||
            h.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.sector.toLowerCase().includes(searchTerm.toLowerCase());

        // ETF 필터
        let matchesFilter = true;
        switch (filter) {
            case 'ufo':
                matchesFilter = h.ufoWeight !== null;
                break;
            case 'arkx':
                matchesFilter = h.arkxWeight !== null;
                break;
            case 'overlap':
                matchesFilter = h.isOverlap;
                break;
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="holdings-table-container">
            <div className="table-header">
                <span className="result-count">{filtered.length}개 종목</span>
            </div>
            <table className="holdings-table">
                <thead>
                    <tr>
                        <th>티커</th>
                        <th>회사명</th>
                        <th>섹터</th>
                        <th className="weight-col">UFO %</th>
                        <th className="weight-col">ARKX %</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(h => (
                        <tr key={h.ticker} className={h.isOverlap ? 'overlap-row' : ''}>
                            <td className="ticker-cell">
                                <span className="ticker">{h.ticker}</span>
                            </td>
                            <td className="name-cell">{h.name}</td>
                            <td className="sector-cell">
                                <span className="sector-badge">{h.sector}</span>
                            </td>
                            <td className="weight-col">
                                {h.ufoWeight !== null ? (
                                    <span className="weight ufo-weight">{h.ufoWeight.toFixed(2)}%</span>
                                ) : (
                                    <span className="weight-empty">-</span>
                                )}
                            </td>
                            <td className="weight-col">
                                {h.arkxWeight !== null ? (
                                    <span className="weight arkx-weight">{h.arkxWeight.toFixed(2)}%</span>
                                ) : (
                                    <span className="weight-empty">-</span>
                                )}
                            </td>
                            <td>
                                {h.isOverlap ? (
                                    <span className="overlap-badge">🔗 중복</span>
                                ) : h.ufoWeight !== null ? (
                                    <span className="ufo-only-badge">UFO</span>
                                ) : (
                                    <span className="arkx-only-badge">ARKX</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {filtered.length === 0 && (
                <div className="no-results">
                    <span>🔍</span>
                    <p>검색 결과가 없습니다</p>
                </div>
            )}
        </div>
    );
}
