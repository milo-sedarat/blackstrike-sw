'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Chrome, Twitter, Gamepad2 } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (email: string, password: string, remember: boolean) => void;
  onGoogleSignIn?: () => void;
  mode?: 'login' | 'signup' | 'forgot';
  onModeChange?: (mode: 'login' | 'signup' | 'forgot') => void;
}

interface VideoBackgroundProps {
  videoUrl: string;
}

interface FormInputProps {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

interface SocialButtonProps {
  icon: React.ReactNode;
  name: string;
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  id: string;
}

// FormInput Component
const FormInput: React.FC<FormInputProps> = ({ icon, type, placeholder, value, onChange, required }) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        {icon}
      </div>
                          <input
                      type={type}
                      placeholder={placeholder}
                      value={value}
                      onChange={onChange}
                      required={required}
                      className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
    </div>
  );
};

// SocialButton Component
const SocialButton: React.FC<SocialButtonProps> = ({ icon }) => {
  return (
    <button className="flex items-center justify-center p-2 bg-white/5 border border-white/10 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors">
      {icon}
    </button>
  );
};

// ToggleSwitch Component
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, id }) => {
  return (
    <div className="relative inline-block w-10 h-5 cursor-pointer">
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
                        <div className={`absolute inset-0 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-blue-600' : 'bg-white/20'}`}>
        <div className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${checked ? 'transform translate-x-5' : ''}`} />
      </div>
    </div>
  );
};

// VideoBackground Component
const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-black/30 z-10" />
      <video
        ref={videoRef}
        className="absolute inset-0 min-w-full min-h-full object-cover w-auto h-auto"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

// Main LoginForm Component
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onGoogleSignIn, mode = 'login', onModeChange }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSuccess(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit(email, password, remember);
    setIsSubmitting(false);
    setIsSuccess(false);
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup':
        return 'BlackStrike';
      case 'forgot':
        return 'Reset Password';
      default:
        return 'BlackStrike';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signup':
        return 'Join the crypto revolution';
      case 'forgot':
        return 'Recover your account';
      default:
        return 'Automated crypto trading platform';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'signup':
        return 'Create Account';
      case 'forgot':
        return 'Send Reset Link';
      default:
        return 'Enter BlackStrike';
    }
  };

  const getModeSwitchText = () => {
    switch (mode) {
      case 'signup':
        return "Already have an account?";
      case 'forgot':
        return "Remember your password?";
      default:
        return "Don't have an account?";
    }
  };

  const getModeSwitchLink = () => {
    switch (mode) {
      case 'signup':
        return "Sign In";
      case 'forgot':
        return "Back to Login";
      default:
        return "Create Account";
    }
  };

  const handleModeSwitch = () => {
    if (onModeChange) {
      switch (mode) {
        case 'signup':
          onModeChange('login');
          break;
        case 'forgot':
          onModeChange('login');
          break;
        default:
          onModeChange('signup');
          break;
      }
    }
  };

  return (
                    <div className="p-10 rounded-2xl backdrop-blur-sm bg-black/50 border border-white/10 w-full max-w-lg">
                        <div className="mb-10 text-center">
                    <div className="flex justify-center mb-4">
                                          <img 
                      src="/assets/blackstrike-logo.png" 
                      alt="BlackStrike" 
                      className="h-16 w-auto"
                    />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 relative group">
                      <span className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse"></span>
                      <span className="relative inline-block text-4xl font-bold mb-2 text-white">
                        {getTitle()}
                      </span>
                      <span className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                    </h2>
                            <p className="text-white/80 flex flex-col items-center space-y-1">
                      <span className="relative group cursor-default">
                        <span className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                        <span className="relative inline-block animate-pulse">{getSubtitle()}</span>
                      </span>
                      <span className="text-xs text-white/50 animate-pulse">
                        [Press Enter to continue]
                      </span>
                    </p>
      </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                    {mode === 'signup' && (
                      <FormInput
                        icon={<Mail className="text-white/60" size={18} />}
                        type="text"
                        placeholder="Full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    )}
                    <FormInput
                      icon={<Mail className="text-white/60" size={18} />}
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />

        {mode !== 'forgot' && (
          <div className="relative">
            <FormInput
              icon={<Lock className="text-white/60" size={18} />}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white focus:outline-none transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}

        {mode === 'signup' && (
          <div className="relative">
            <FormInput
              icon={<Lock className="text-white/60" size={18} />}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white focus:outline-none transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )}

        {mode === 'login' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div onClick={() => setRemember(!remember)} className="cursor-pointer">
                <ToggleSwitch
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  id="remember-me"
                />
              </div>
              <label
                htmlFor="remember-me"
                className="text-sm text-white/80 cursor-pointer hover:text-white transition-colors"
                onClick={() => setRemember(!remember)}
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={() => onModeChange?.('forgot')}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-lg ${
            isSuccess ? 'animate-success' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
          } text-white font-medium transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40`}
        >
          {isSubmitting ? 'Processing...' : getButtonText()}
        </button>
      </form>

      {(mode === 'login' || mode === 'signup') && (
        <div className="mt-8">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 absolute w-full"></div>
            <div className="bg-transparent px-4 relative text-white/60 text-sm">
              or continue with
            </div>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={onGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 border border-white/10 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-white/60">
        {getModeSwitchText()}{' '}
        <button
          type="button"
          onClick={handleModeSwitch}
          className="font-medium text-white hover:text-blue-300 transition-colors"
        >
          {getModeSwitchLink()}
        </button>
      </p>
    </div>
  );
};

// Export as default components
const LoginPage = {
  LoginForm,
  VideoBackground
};

export default LoginPage; 