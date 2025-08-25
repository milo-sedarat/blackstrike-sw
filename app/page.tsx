'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
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

        {/* Loading Content - Centered */}
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
                  Loading
                </h1>
                <p className="text-sm max-w-sm text-center text-muted-foreground text-balance">
                  Initializing BlackStrike...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return null; // Will redirect to login
  }

  // Show dashboard content for authenticated users
  return (
    <div className="min-h-screen bg-black">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to BlackStrike</h1>
        <p className="text-gray-400 text-lg">Your crypto trading dashboard</p>
      </div>
    </div>
  );
}
