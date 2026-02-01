export type ErrorCode =
    | 'validation'
    | 'auth'
    | 'forbidden'
    | 'notfound'
    | 'conflict'
    | 'rate-limit'
    | 'internal';

export class AppError extends Error {
    constructor(
        public code: ErrorCode,
        public status: number,
        public message: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'AppError';
        Object.setPrototypeOf(this, AppError.prototype);
    }

    static isAppError(error: unknown): error is AppError {
        return error instanceof AppError;
    }
}

export function handleApiError(error: unknown) {
    console.error('API Error:', error);

    if (AppError.isAppError(error)) {
        return Response.json(
            {
                error: error.message,
                code: error.code,
                details: process.env.NODE_ENV === 'development' ? error.details : undefined
            },
            { status: error.status }
        );
    }

    // Fallback for unexpected errors
    return Response.json(
        {
            error: 'Internal Server Error',
            code: 'internal'
        },
        { status: 500 }
    );
}
