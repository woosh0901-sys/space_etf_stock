'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html>
            <body className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-4 text-red-500">Critical Error</h2>
                    <p className="mb-6 text-gray-300">
                        Something went wrong properly. Please try again later.
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mb-6 text-left bg-gray-900 p-4 rounded overflow-auto max-h-40 text-xs text-red-400 font-mono">
                            {error.message}
                            {error.stack}
                        </div>
                    )}
                    <button
                        onClick={() => reset()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
