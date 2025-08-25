'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-white mb-2">BlackStrike</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
