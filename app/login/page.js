'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  Globe,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Loader2,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      if (redirectPath) {
        router.push(redirectPath);
      } else if (result.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
          Welcome back
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Enter your credentials to access your domain console and cloud telemetry.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Sign In to DHMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Need an account? Contact your Platform Administrator to get provisioned.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-[#080d1a] transition-colors duration-200">
      {/* Left Column: Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <Suspense fallback={<div className="text-xs text-slate-500 font-mono">Loading authentication portal...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Right Column: Visual Graphic Banner */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-100 dark:bg-[#080c14] border-l border-slate-200 dark:border-slate-800 relative overflow-hidden radial-glow">
        <div className="space-y-4 max-w-md">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            High-Performance Domain &amp; Hosting Platform
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Gain full lifecycle transparency over your digital assets with automated expiration calculations, instant cloud tier attachments, and isolated multi-tenant architecture.
          </p>
        </div>

        {/* Live Metrics Showcase Card */}
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 max-w-md">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Platform Telemetry
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">99.99% Uptime</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">PostgreSQL</span>
              <p className="font-mono font-bold text-slate-900 dark:text-white">SSL Encrypted</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">RBAC Guard</span>
              <p className="font-mono font-bold text-blue-600 dark:text-blue-300">Enforced</p>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          DHMS Cloud V2 • Secured with JWT Authentication &amp; Argon2/Bcrypt Hashes
        </div>
      </div>
    </div>
  );
}
