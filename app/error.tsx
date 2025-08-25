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
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* BlackStrike Logo - Top Left */}
      <div className="absolute top-8 left-8 z-10">
        <img
          src="/assets/blackstrike-logo.png"
          alt="BlackStrike"
          className="h-12 w-auto"
        />
      </div>

      {/* Error Content - Centered */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="text-center space-y-8">
          <div className="flex flex-col items-center justify-center gap-10">
            <picture className="w-1/4 aspect-square grayscale opacity-50">
              <img
                src="/assets/bot_greenprint.gif"
                alt="Security Status"
                className="size-full object-contain"
              />
            </picture>

            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-xl font-bold uppercase text-muted-foreground">
                Something went wrong!
              </h1>
              <p className="text-sm max-w-sm text-center text-muted-foreground text-balance">
                An unexpected error occurred.
              </p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={reset}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all"
                >
                  Try again
                </button>
                <a 
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 