import React from "react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* BlackStrike Logo - Top Left */}
      <div className="absolute top-8 left-8 z-10">
        <Image
          src="/assets/blackstrike-logo.png"
          alt="BlackStrike"
          width={200}
          height={80}
          className="h-12 w-auto"
        />
      </div>

      {/* 404 Content - Centered */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="text-center space-y-8">
          <div className="flex flex-col items-center justify-center gap-10">
            <picture className="w-1/4 aspect-square grayscale opacity-50">
              <Image
                src="/assets/bot_greenprint.gif"
                alt="Security Status"
                width={1000}
                height={1000}
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="size-full object-contain"
              />
            </picture>

            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-xl font-bold uppercase text-muted-foreground">
                Not found, yet
              </h1>
              <p className="text-sm max-w-sm text-center text-muted-foreground text-balance">
                The page you're looking for doesn't exist in the BlackStrike universe. 
                Navigate back to your trading dashboard or contact support if you believe this is an error.
              </p>
              <a 
                href="/"
                className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
