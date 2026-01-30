'use client';

interface SearchFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    activeFilter: 'all' | 'ufo' | 'arkx' | 'overlap';
    onFilterChange: (filter: 'all' | 'ufo' | 'arkx' | 'overlap') => void;
    overlapCount: number;
}

export default function SearchFilter({
    searchTerm,
    onSearchChange,
    activeFilter,
    onFilterChange,
    overlapCount
}: SearchFilterProps) {
    return (
        <div className="search-filter-container">
            <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="티커, 회사명, 섹터로 검색..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="search-input"
                />
                {searchTerm && (
                    <button
                        className="clear-btn"
                        onClick={() => onSearchChange('')}
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="filter-buttons">
                <button
                    className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => onFilterChange('all')}
                >
                    전체
                </button>
                <button
                    className={`filter-btn filter-ufo ${activeFilter === 'ufo' ? 'active' : ''}`}
                    onClick={() => onFilterChange('ufo')}
                >
                    UFO
                </button>
                <button
                    className={`filter-btn filter-arkx ${activeFilter === 'arkx' ? 'active' : ''}`}
                    onClick={() => onFilterChange('arkx')}
                >
                    ARKX
                </button>
                <button
                    className={`filter-btn filter-overlap ${activeFilter === 'overlap' ? 'active' : ''}`}
                    onClick={() => onFilterChange('overlap')}
                >
                    🔗 중복 ({overlapCount})
                </button>
            </div>
        </div>
    );
}
