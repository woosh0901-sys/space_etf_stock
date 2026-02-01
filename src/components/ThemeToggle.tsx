'use client';

import { useRef, useEffect } from 'react';

const THEME_KEY = 'space-etf-theme';

export default function ThemeToggle() {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // 초기 테마 로드 및 버튼 텍스트 업데이트
        const saved = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null;
        const currentTheme = saved || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (buttonRef.current) {
            buttonRef.current.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
            buttonRef.current.title = currentTheme === 'dark' ? '라이트 모드' : '다크 모드';
        }
    }, []);

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        localStorage.setItem(THEME_KEY, newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);

        if (buttonRef.current) {
            buttonRef.current.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            buttonRef.current.title = newTheme === 'dark' ? '라이트 모드' : '다크 모드';
        }
    };

    return (
        <button ref={buttonRef} className="theme-toggle" onClick={toggleTheme} title="테마 변경">
            🌙
        </button>
    );
}
