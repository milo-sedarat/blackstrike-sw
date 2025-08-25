'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

export default function ForgotPasswordPageComponent() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await resetPassword(email);
      if (result.success) {
        setIsSuccess(true);
      } else {
        console.error('Password reset failed:', result.error);
      }
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Forgot Password Content - Centered */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-white">
              Reset password
            </h1>
            <p className="text-muted-foreground">
              Enter your email to receive a password reset link
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <p className="text-green-400">
                  Password reset link sent! Check your email for instructions.
                </p>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-gray-400">
            Remember your password?{' '}
            <a
              href="/auth/login"
              className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
            >
              Back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 