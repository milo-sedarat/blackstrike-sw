'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import ModernAuthForm from '@/components/ui/modern-auth-form';
import Image from 'next/image';

export default function LoginPageComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async (data: any) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await signIn(data.email, data.password);
      if (result.success) {
        router.push('/');
      } else {
        const errorMessage = result.error instanceof Error ? result.error.message : 'Login failed. Please try again.';
        setError(errorMessage);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        router.push('/');
      } else {
        const errorMessage = result.error instanceof Error ? result.error.message : 'Google sign-in failed';
        setError(errorMessage);
      }
    } catch (error) {
      setError('Google sign-in error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-20">
          <picture className="w-full h-full grayscale opacity-50">
            <Image
              src="/assets/bot_greenprint.gif"
              alt="Security Status"
              fill
              quality={90}
              sizes="100vw"
              className="object-cover"
            />
          </picture>
        </div>
      </div>

      {/* BlackStrike Logo */}
      <div className="absolute top-8 left-8 z-10">
        <Image
          src="/assets/blackstrike-logo.png"
          alt="BlackStrike"
          width={200}
          height={80}
          className="h-12 w-auto"
        />
      </div>

      {/* Modern Auth Form */}
      <div className="flex flex-col items-center justify-center flex-1 px-4 relative z-10">
        <ModernAuthForm
          type="login"
          onSubmit={handleLogin}
          onGoogleSignIn={handleGoogleSignIn}
          error={error}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
} 