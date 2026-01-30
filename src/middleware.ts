import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting용 간단한 메모리 저장소 (프로덕션에서는 Redis 사용 권장)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1분
const RATE_LIMIT_MAX = 100; // 분당 최대 100 요청

function getRateLimitKey(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    return ip;
}

function checkRateLimit(key: string): boolean {
    const now = Date.now();
    const record = rateLimit.get(key);

    if (!record || now > record.resetTime) {
        rateLimit.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return false;
    }

    record.count++;
    return true;
}

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Security Headers
    // Content Security Policy
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://s3.tradingview.com https://www.tradingview.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' https://*.firebase.com https://*.firebaseio.com https://www.google-analytics.com https://*.tradingview.com",
            "frame-src 'self' https://www.tradingview.com https://s.tradingview.com",
            "frame-ancestors 'none'",
        ].join('; ')
    );

    // HTTP Strict Transport Security
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains'
    );

    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');

    // XSS Protection
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // Referrer Policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Rate Limiting (API 라우트만)
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const key = getRateLimitKey(request);
        if (!checkRateLimit(key)) {
            return new NextResponse(
                JSON.stringify({ error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    return response;
}

export const config = {
    matcher: [
        // Match all paths except static files
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
