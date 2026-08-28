'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import {
  Globe,
  Server,
  Shield,
  Zap,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HardDrive,
  Cpu,
  Layers,
  Lock,
  RefreshCw,
  TrendingUp,
  Clock,
  ExternalLink,
  ChevronRight,
  Activity,
  Check,
  Star,
  Users,
  Smartphone,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Domain search state
  const [searchDomain, setSearchDomain] = useState('');
  const [selectedTld, setSelectedTld] = useState('.com');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const tlds = ['.com', '.net', '.org', '.io', '.pk', '.cloud'];

  // Fetch active plans from backend
  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await api.get('/plans');
        if (res.data?.plans) {
          setPlans(res.data.plans);
        }
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoadingPlans(false);
      }
    }
    loadPlans();
  }, []);

  const handleDomainSearch = (e) => {
    e.preventDefault();
    if (!searchDomain.trim()) return;

    setSearching(true);
    const cleanDomain = searchDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const finalDomain = cleanDomain.includes('.') ? cleanDomain : `${cleanDomain}${selectedTld}`;

    setTimeout(() => {
      setSearchResult({
        domain: finalDomain,
        available: true,
        price: selectedTld === '.io' ? '$39.00' : selectedTld === '.pk' ? '$18.00' : '$12.99',
      });
      setSearching(false);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 overflow-x-hidden font-sans transition-colors duration-200">
      
      {/* ============================================================ */}
      {/* 1. HERO SECTION WITH GRADIENT MESH CANVAS & FLOATING CARDS    */}
      {/* ============================================================ */}
      <section className="relative pt-12 pb-24 lg:pt-16 lg:pb-32 overflow-hidden">
        
        {/* Fluid gradient mesh backdrop */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-gradient-to-br from-cyan-400/25 dark:from-cyan-500/15 via-blue-500/20 dark:via-blue-600/15 to-transparent blur-3xl" />
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-bl from-purple-500/20 dark:from-purple-600/15 via-indigo-400/15 dark:via-indigo-500/10 to-transparent blur-3xl" />
          <div className="absolute top-[35%] left-[20%] w-[45%] h-[45%] rounded-full bg-gradient-to-tr from-sky-300/20 dark:from-sky-500/10 via-blue-400/15 dark:via-blue-600/10 to-transparent blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Copy & CTA */}
            <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
              
              {/* Bold High-Contrast Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Manage Domains. <br />
                <span className="text-emerald-500">Deploy Hosting.</span> <br />
                <span className="text-blue-600 dark:text-blue-400">Scale Seamlessly.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Enterprise-grade domain registrar and high-speed NVMe cloud hosting platform. Real-time DNS controls, automated SSL provisioning, and transparent billing.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href={isAuthenticated ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#plans"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-bold text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Hosting Plans</span>
                </a>
              </div>

              {/* Central Domain Search Box */}
              <div className="pt-4 max-w-xl mx-auto lg:mx-0">
                <form
                  onSubmit={handleDomainSearch}
                  className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-black/40 space-y-2"
                >
                  <div className="flex items-center gap-2 px-3 py-1">
                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Find your perfect domain (e.g. startup-cloud)"
                      value={searchDomain}
                      onChange={(e) => setSearchDomain(e.target.value)}
                      className="w-full py-2 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-mono font-medium"
                    />
                    <button
                      type="submit"
                      disabled={searching}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shrink-0 transition-colors shadow-sm"
                    >
                      {searching ? 'Checking...' : 'Search'}
                    </button>
                  </div>

                  {/* TLD Extension Selector Tags */}
                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 px-2 overflow-x-auto">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase pr-1">TLD:</span>
                    {tlds.map((tld) => (
                      <button
                        key={tld}
                        type="button"
                        onClick={() => setSelectedTld(tld)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          selectedTld === tld
                            ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {tld}
                      </button>
                    ))}
                  </div>
                </form>

                {/* Instant Availability Search Result Banner */}
                {searchResult && (
                  <div className="mt-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 animate-fade-in shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-mono text-xs font-bold text-emerald-950 dark:text-emerald-200">
                          {searchResult.domain} is available!
                        </p>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                          First year renewal starting at <strong className="font-mono">{searchResult.price}/yr</strong>
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/login"
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shrink-0 shadow-sm"
                    >
                      Deploy Now
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Hero Device Showcase & Floating Glassmorphism Cards */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              
              {/* Outer Glow Halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 dark:from-blue-600/20 via-indigo-500/20 to-purple-400/20 rounded-full blur-3xl -z-10" />

              {/* Main Realistic App Mockup Frame */}
              <div className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/60 p-6 space-y-5 transition-colors">
                
                {/* Mockup Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Cloud Console Hub</h4>
                      <p className="text-[10px] text-slate-400">Real-time Telemetry</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    99.99% Uptime
                  </div>
                </div>

                {/* Internal Mockup Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#080d1a] border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Domain Health</span>
                    <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">100% Valid</p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">● DNS Verified</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#080d1a] border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Active NVMe</span>
                    <p className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">85.4 TB</p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Tier 4 Datacenter</span>
                  </div>
                </div>

                {/* Internal Mockup Table Snippet */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
                    <span>ASSET NAME</span>
                    <span>STATUS</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">production-cluster.io</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Active
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#080d1a] border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">Business Pro NVMe (100GB)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      Linked
                    </span>
                  </div>
                </div>
              </div>

              {/* FLOATING CARD 1: Monthly Value / Wallet Card (Top Right) */}
              <div className="absolute -top-6 -right-4 sm:-right-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/60 space-y-1 z-20">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Monthly Value</span>
                </div>
                <p className="font-mono text-xl font-black text-slate-900 dark:text-white">$1,245.00</p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">↑ +14.2% Growth</span>
              </div>

              {/* FLOATING CARD 2: Active Domain Lead Card (Bottom Left) */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/10 dark:shadow-black/60 flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">Domain #2409</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">SSL Auto-Provisioned</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* 2. ABOUT US & ARCHITECTURE SHOWCASE SECTION                  */}
      {/* ============================================================ */}
      <section id="about" className="py-20 bg-white dark:bg-[#080d1a] border-t border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase">
              ABOUT US &amp; ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built for Serious Cloud Administrators &amp; Developers
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              DHMS provides an all-in-one unified control plane for multi-registrar domain portfolios and NVMe hosting clusters, ensuring zero downtime and complete lifecycle transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual Column: Architecture Showcase */}
            <div className="p-8 rounded-3xl bg-slate-900 dark:bg-[#0f172a] text-white shadow-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-blue-400 font-bold">dhms://architecture-matrix</span>
                <span className="text-xs font-mono text-emerald-400">● REST API v1.0</span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">RBAC Security Guard</span>
                  <span className="text-emerald-400 font-bold">JWT + SHA256 Hashes</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Database Pool Engine</span>
                  <span className="text-cyan-400 font-bold">Neon PostgreSQL SSL</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Automated Expiry Alerts</span>
                  <span className="text-amber-400 font-bold">Cron &le; 30 Days</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Multi-Tenant Architecture</span>
                <span className="text-white font-bold">100% Dedicated</span>
              </div>
            </div>

            {/* Content Column: Feature Bullet Points */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Unified Multi-Registrar Management</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Aggregate domains across Namecheap, GoDaddy, Cloudflare, and Route53 into one singular command dashboard with unified renewal alerts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Server className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">High-Speed NVMe Storage Tiers</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Instantly pair domain assets with NVMe cloud storage packages featuring unmetered bandwidth, automated backups, and 99.99% SLA.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Enterprise SuperAdmin Controls</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Comprehensive oversight for system administrators to manage global user accounts, provision domains, configure hosting plans, and resolve support tickets.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ============================================================ */}
      {/* 3. HOSTING PLANS PRICING GRID (SERVICES)                     */}
      {/* ============================================================ */}
      <section id="plans" className="py-20 bg-slate-50 dark:bg-[#080d1a] border-t border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase">
              SERVICES &amp; HOSTING TIERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Transparent, Scalable Cloud Hosting Plans
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Provision high-performance hosting packages instantly attached to your registered domain assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingPlans ? (
              <div className="col-span-3 py-12 text-center text-slate-400 font-mono text-xs">
                Loading hosting plans from database...
              </div>
            ) : (
              plans.map((plan) => {
                const isPopular = plan.plan_name?.toLowerCase().includes('business') || plan.plan_name?.toLowerCase().includes('pro');

                return (
                  <div
                    key={plan.id}
                    className={`bg-white dark:bg-[#0f172a] rounded-3xl p-8 border transition-all flex flex-col justify-between relative shadow-sm hover:shadow-xl ${
                      isPopular
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-blue-500/10'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                        Most Popular Choice
                      </span>
                    )}

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">{plan.plan_name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          High-throughput NVMe cloud hosting with dedicated DNS caching.
                        </p>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">
                          ${parseFloat(plan.price_monthly).toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">/ month</span>
                      </div>

                      {/* Resource Meters */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#080d1a] border border-slate-100 dark:border-slate-800 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                            <HardDrive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            NVMe Storage:
                          </span>
                          <strong className="text-slate-900 dark:text-white font-mono">{plan.storage_gb} GB</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                            <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            Monthly Bandwidth:
                          </span>
                          <strong className="text-slate-900 dark:text-white font-mono">{plan.bandwidth_gb} GB</strong>
                        </div>
                      </div>

                      <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Automated SSL Certificate</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>99.99% SLA Uptime Guarantee</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Daily Automated Snapshot Backups</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-8">
                      <Link
                        href={isAuthenticated ? "/dashboard" : "/login"}
                        className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          isPopular
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25'
                            : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                        }`}
                      >
                        <span>Choose {plan.plan_name}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
