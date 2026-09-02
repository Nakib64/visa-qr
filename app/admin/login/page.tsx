'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  Clock,
  KeyRound,
} from 'lucide-react';
import Link from 'next/link';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState<number>(0);

  // Countdown timer for IP lockout
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (retryCountdown > 0) {
      timer = setInterval(() => {
        setRetryCountdown((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setErrorMessage(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [retryCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked && retryCountdown > 0) return;

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.isBlocked || res.status === 429) {
          setIsBlocked(true);
          const seconds = data.retryAfterSeconds || 300;
          setRetryCountdown(seconds);
        }
        setErrorMessage(data.error || 'Invalid credentials or access denied.');
        return;
      }

      // Login success -> redirect
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setErrorMessage('Network communication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full max-w-md">
      {/* Top Mongolian Immigration Agency Badge Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 shadow-md mb-2">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 font-serif uppercase">
          MONGOLIA
        </h1>
        <div className="text-xs font-bold text-slate-700 tracking-wide">
          Immigration Agency Administrative Portal
        </div>
        <p className="text-[11px] text-slate-500">
          Иргэний Харьяалал, Шилжилт Хөдөлгөөний Ерөнхий Газар
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            Official Staff Authentication
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter your authorized immigration credentials to access records.
          </p>
        </div>

        {/* Security Warning / IP Block Banner */}
        {isBlocked && retryCountdown > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2 animate-pulse">
            <div className="font-bold flex items-center gap-2 text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              IP Address Temporarily Locked
            </div>
            <p className="leading-relaxed text-rose-700">
              5 consecutive failed password attempts detected. Access from your IP is paused for security.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-100/80 font-mono font-bold text-rose-800 text-[11.5px]">
              <Clock className="w-3.5 h-3.5" />
              Cooldown: {formatCountdown(retryCountdown)}
            </div>
          </div>
        )}

        {/* General Error Message */}
        {errorMessage && !isBlocked && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                required
                disabled={isBlocked && retryCountdown > 0}
                placeholder="officer@immigration.gov.mn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition disabled:opacity-50 disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isBlocked && retryCountdown > 0}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition disabled:opacity-50 disabled:bg-slate-100"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition p-0.5 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (isBlocked && retryCountdown > 0)}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Authenticating...
              </>
            ) : (
              <>
                Sign In to Admin Portal
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

      </div>

      {/* Return to Public Portal */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition inline-flex items-center gap-1.5"
        >
          ← Return to Public Verification Portal
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/20 to-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      <Suspense fallback={<div className="text-xs text-slate-500">Loading authentication interface...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
