'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

export default function LoginPageComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [showVerificationResend, setShowVerificationResend] = useState(false);
  const { signIn, signInWithGoogle, resendVerificationEmail } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setWarning('');
    setShowVerificationResend(false);
    
    try {
      const result = await signIn(email, password);
      if (result.success) {
        // Check if there's a warning about email verification
        if (result.warning) {
          setWarning(result.warning);
          setShowVerificationResend(true);
          // Still redirect to dashboard but show warning
          router.push('/');
        } else {
          router.push('/');
        }
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

  const handleResendVerification = async () => {
    try {
      const result = await resendVerificationEmail();
      if (result.success) {
        setWarning('Verification email sent! Please check your inbox.');
        setShowVerificationResend(false);
      } else {
        const errorMessage = result.error instanceof Error ? result.error.message : 'Failed to send verification email';
        setError(errorMessage);
      }
    } catch (error) {
      setError('Failed to send verification email');
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
      {/* Animated Background - Same as 404 page */}
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

      {/* Login Content - Centered */}
      <div className="flex flex-col items-center justify-center flex-1 px-4 relative z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-white">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your BlackStrike account
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-900/50 border border-red-700">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {warning && (
            <div className="p-3 rounded-lg bg-yellow-900/50 border border-yellow-700">
              <p className="text-yellow-300 text-sm">{warning}</p>
              {showVerificationResend && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm underline"
                >
                  Resend verification email
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="/auth/forgot-password" className="text-blue-500 hover:text-blue-400">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg border border-gray-700 transition-colors"
            >
              Continue with Google
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <a href="/auth/signup" className="text-blue-500 hover:text-blue-400">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 