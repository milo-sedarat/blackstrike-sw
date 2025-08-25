'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '@/components/ui/gaming-login';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPageComponent() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async (email: string, password: string, remember: boolean) => {
    try {
      const result = await signIn(email, password);
      if (result.success) {
        router.push('/');
      } else {
        console.error('Login failed:', result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleModeChange = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    if (newMode === 'signup') {
      router.push('/auth/signup');
    } else if (newMode === 'forgot') {
      router.push('/auth/forgot-password');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        router.push('/');
      } else {
        console.error('Google sign-in failed:', result.error);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
      <LoginPage.VideoBackground videoUrl="https://videos.pexels.com/video-files/8128311/8128311-uhd_2560_1440_25fps.mp4" />
                        <div className="relative z-20 w-full max-w-lg animate-fadeIn">
        <LoginPage.LoginForm
          onSubmit={handleLogin}
          onGoogleSignIn={handleGoogleSignIn}
          mode={mode}
          onModeChange={handleModeChange}
        />
      </div>
      <footer className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-sm z-20">
        © 2025 BlackStrike. All rights reserved.
      </footer>
    </div>
  );
} 