'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  Globe,
  Server,
  Shield,
  Layers,
  LogOut,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Zap,
  CheckCircle2,
  HardDrive,
  Cpu,
  BarChart3,
  HelpCircle,
  Command,
  ArrowLeft,
} from 'lucide-react';
import { RoleBadge } from './Badge';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Check if current route is an Auth page (Login / Register)
  const isAuthPage = pathname === '/login' || pathname === '/register';

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Platform Overview', href: '/', icon: Globe },
    { label: 'Domain Portfolio', href: '/dashboard', icon: Layers },
    { label: 'Cloud Hosting', href: '/#plans', icon: Server },
    { label: 'Support & Tickets', href: '/contact', icon: MessageSquare },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Console', href: '/admin', icon: Shield, badge: 'SuperAdmin' });
  }

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      if (isAuthenticated) {
        router.push(`/dashboard?q=${encodeURIComponent(globalSearch.trim())}`);
      } else {
        router.push(`/?search=${encodeURIComponent(globalSearch.trim())}`);
      }
    }
  };

  // If on Login / Register page, render focused auth layout without sidebar
  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 antialiased font-sans">
        {/* Minimal Auth Header */}
        <header className="h-16 border-b border-[#1F2937] bg-[#0B0F19]/90 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between z-20">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-primary-600 to-violet-600 p-0.5 shadow-lg shadow-indigo-600/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Globe className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <span className="font-black text-sm tracking-tight text-white flex items-center gap-1.5 font-sans">
              DHMS
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
                PRO
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-xl hover:bg-[#111827] border border-transparent hover:border-[#1F2937]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Platform
          </Link>
        </header>

        {/* Auth Content */}
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0B0F19] text-slate-100 antialiased font-sans">
      {/* 1. COLLAPSIBLE DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r border-[#1F2937] bg-[#0E131F]/90 backdrop-blur-xl transition-all duration-300 z-30 sticky top-0 h-screen ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#1F2937]/80">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-primary-600 to-violet-600 p-0.5 shadow-lg shadow-indigo-600/20 shrink-0">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Globe className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-black text-sm tracking-tight text-white flex items-center gap-1.5">
                  DHMS
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
                    PRO
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate">
                  Domain &amp; Hosting
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1F2937] transition-colors shrink-0"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
          {!collapsed && (
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              Management
            </span>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-[#111827]'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                {!collapsed && (
                  <span className="truncate flex-1 flex items-center justify-between">
                    {item.label}
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-950 text-violet-300 font-mono border border-violet-500/40">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer User Profile */}
        <div className="p-3 border-t border-[#1F2937]/80 bg-[#0B0F19]/50">
          {isAuthenticated ? (
            <div className={`space-y-2 ${collapsed ? 'text-center' : ''}`}>
              {!collapsed ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
                      {user?.email?.charAt(0) || 'U'}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate font-mono">{user?.email}</p>
                      <p className="text-[10px] text-indigo-400 font-mono font-semibold uppercase">
                        {user?.role === 'admin' ? 'SuperAdmin' : 'Client Account'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/20 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={logout}
                  className="p-2 w-full text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-950/20 flex items-center justify-center"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className={`space-y-1.5 ${collapsed ? 'text-center' : ''}`}>
              {!collapsed ? (
                <div className="grid grid-cols-2 gap-1.5">
                  <Link
                    href="/login"
                    className="py-2 text-center text-xs font-semibold text-slate-300 hover:text-white bg-[#111827] border border-[#1F2937] rounded-xl transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="py-2 text-center text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow transition-colors"
                  >
                    Join
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="p-2 w-full text-indigo-400 hover:bg-[#111827] rounded-xl flex items-center justify-center"
                  title="Sign In"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Persistent Top Action Header */}
        <header className="sticky top-0 z-20 h-16 border-b border-[#1F2937] bg-[#0B0F19]/85 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Mobile Menu Toggle & Top Nav Items */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl bg-[#111827] border border-[#1F2937] text-slate-400 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Top Navigation Links (Visible on Top Header) */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-[#111827]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Live Health Telemetry Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827] border border-[#1F2937] text-[11px] font-mono text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline">All Systems Operational</span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span className="text-emerald-400 font-semibold">99.99% SLA</span>
            </div>
          </div>

          {/* Central Domain Search / Action bar */}
          <form onSubmit={handleGlobalSearch} className="flex-1 max-w-xs hidden xl:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Lookup domains..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-10 py-1.5 bg-[#111827] border border-[#1F2937] focus:border-indigo-500/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1F2937] text-slate-400 border border-slate-700/60">
                ↵
              </kbd>
            </div>
          </form>

          {/* Top Right Action & Role Pill */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#1F2937]">
                  <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px] uppercase font-mono">
                    {user?.email?.charAt(0)}
                  </div>
                  <span className="text-xs font-mono text-slate-200 hidden md:inline truncate max-w-[130px]">
                    {user?.email}
                  </span>
                  <span className={`text-[10px] font-bold uppercase font-mono px-1.5 py-0.2 rounded ${
                    user?.role === 'admin'
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {user?.role === 'admin' ? 'ADMIN' : 'USER'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-[#111827] hover:bg-rose-950/20 border border-[#1F2937] hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#111827] border border-[#1F2937] rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/30 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-b border-[#1F2937] bg-[#0E131F]/95 backdrop-blur-xl px-4 py-4 space-y-3 z-30">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-xs font-semibold ${
                    isActive(item.href)
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:bg-[#111827]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
