'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import ModernAuthForm from '@/components/ui/modern-auth-form';
import Image from 'next/image';

export default function ForgotPasswordPageComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const { resetPassword } = useAuth();

  const handleResetPassword = async (data: any) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await resetPassword(data.email);
      if (result.success) {
        setEmail(data.email);
        setIsSuccess(true);
      } else {
        const errorMessage = result.error instanceof Error ? result.error.message : 'Failed to send reset email';
        setError(errorMessage);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
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

        {/* Success Content */}
        <div className="flex flex-col items-center justify-center flex-1 px-4 relative z-10">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-4">
              <div className="text-green-500 text-6xl">✓</div>
              <h1 className="text-2xl font-bold text-white">
                Check your email
              </h1>
              <p className="text-gray-300">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-gray-400 text-sm">
                Click the link in your email to reset your password and regain access to your account.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/auth/login'}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Back to Sign In
              </button>
              
              <button
                onClick={() => setIsSuccess(false)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg border border-gray-700 transition-colors"
              >
                Try another email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          type="forgot-password"
          onSubmit={handleResetPassword}
          error={error}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
} 