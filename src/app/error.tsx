'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[50vh] p-4">
            <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-red-400">Something went wrong!</h2>
                <p className="mb-6 text-gray-400">
                    An unexpected error occurred.
                </p>
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-6 text-left bg-gray-900 p-4 rounded overflow-auto max-h-40 text-xs text-red-400 font-mono">
                        {error.message}
                    </div>
                )}
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
