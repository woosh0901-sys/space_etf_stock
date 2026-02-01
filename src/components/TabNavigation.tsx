'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
    id: string;
    label: string;
    icon: string;
    href: string;
}

const TABS: Tab[] = [
    { id: 'dashboard', label: '대시보드', icon: '🚀', href: '/' },
    { id: 'tools', label: '도구', icon: '🔧', href: '/tools' },
    { id: 'news', label: '뉴스', icon: '📰', href: '/news' },
];

export default function TabNavigation() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className="tab-navigation">
            <div className="tab-nav-container">
                <div className="tab-logo">
                    <span>🛸</span>
                    <span className="tab-logo-text">Space ETF</span>
                </div>
                <div className="tab-list">
                    {TABS.map((tab) => (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className={`tab-item ${isActive(tab.href) ? 'active' : ''}`}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
