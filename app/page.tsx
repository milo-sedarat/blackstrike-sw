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

        {/* Animated Background - Same as 404 page */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
          </div>
        </div>

        {/* Loading Content - Centered */}
        <div className="flex flex-col items-center justify-center flex-1 px-4 relative z-10">
          <div className="text-center space-y-6">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">BlackStrike</h1>
              <p className="text-muted-foreground">Loading...</p>
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
