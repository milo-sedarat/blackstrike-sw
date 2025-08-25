'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

export default function SignupPageComponent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [error, setError] = useState('');
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter both first name and last name');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const result = await signUp(email, password, firstName.trim(), lastName.trim());
      if (result.success) {
        setShowVerificationMessage(true);
      } else {
        const errorMessage = result.error instanceof Error ? result.error.message : 'Signup failed. Please try again.';
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

  if (showVerificationMessage) {
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

        {/* Verification Message */}
        <div className="flex flex-col items-center justify-center flex-1 px-4 relative z-10">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-4">
              <div className="text-green-500 text-6xl">✓</div>
              <h1 className="text-2xl font-bold text-white">
                Check your email
              </h1>
              <p className="text-gray-300">
                We've sent a verification link to <strong>{email}</strong>
              </p>
              <p className="text-gray-400 text-sm">
                Click the link in your email to verify your account and start trading.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Go to Sign In
              </button>
              
              <button
                onClick={() => setShowVerificationMessage(false)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg border border-gray-700 transition-colors"
              >
                Back to Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Signup Content - Centered */}
      <div className="flex flex-col items-center justify-center flex-1 px-4 relative z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-white">
              Create account
            </h1>
            <p className="text-muted-foreground">
              Join BlackStrike and start trading
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-900/50 border border-red-700">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="First name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Last name"
                />
              </div>
            </div>

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
                minLength={6}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Create a password (min 6 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
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
              Already have an account?{' '}
              <a href="/auth/login" className="text-blue-500 hover:text-blue-400">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 