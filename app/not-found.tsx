import React from "react";
import Image from "next/image";
import DashboardPageLayout from "@/components/dashboard/layout";
import CuteRobotIcon from "@/components/icons/cute-robot";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-8">
        {/* BlackStrike Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/assets/blackstrike-logo.png"
            alt="BlackStrike"
            width={200}
            height={80}
            className="h-20 w-auto"
          />
        </div>

        {/* 404 Content - Same as before */}
        <div className="flex flex-col items-center justify-center gap-10 flex-1">
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
              Fork on v0 and start promoting your way to new pages.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <a
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-1"
          >
            Go Home
          </a>
          <a
            href="/auth/login"
            className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium rounded-lg transition-all duration-200"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
