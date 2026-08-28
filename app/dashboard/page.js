'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '../../components/RouteGuards';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import {
  Globe,
  Server,
  Search,
  CheckCircle2,
  Zap,
  Layers,
  Loader2,
  RefreshCw,
  Clock,
  HardDrive,
  Cpu,
  Eye,
  Shield,
} from 'lucide-react';
import { StatusBadge } from '../../components/Badge';
import Toast from '../../components/Toast';

export default function UserDashboard() {
  const { user } = useAuth();

  // Active view tab: 'domains' | 'hosting'
  const [activeTab, setActiveTab] = useState('domains');
  const [domains, setDomains] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, active: 0, expiring_soon: 0, expired: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Fetch user portfolio data (100% Viewer Access)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [domainsRes, subsRes, plansRes] = await Promise.all([
        api.get('/domains'),
        api.get('/subscriptions'),
        api.get('/plans'),
      ]);

      if (domainsRes.data?.domains) {
        setDomains(domainsRes.data.domains);
        if (domainsRes.data.metrics) {
          setMetrics(domainsRes.data.metrics);
        }
      }

      if (subsRes.data?.subscriptions) {
        setSubscriptions(subsRes.data.subscriptions);
      }

      if (plansRes.data?.plans) {
        setPlans(plansRes.data.plans);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setToast({
        type: 'error',
        message: 'Could not load data from API server. Please check backend connection.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered domains list
  const filteredDomains = domains.filter((d) => {
    const matchesStatus =
      statusFilter === 'ALL' || d.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      d.domain_name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      d.registrar.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <ProtectedRoute>
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in radial-glow">
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        {/* Dashboard Top Header - Dedicated Read-Only Viewer Console */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5 font-sans">
              Domain &amp; Hosting Console
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800 font-mono flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Read-Only Viewer
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Welcome back, <strong className="text-slate-900 dark:text-slate-200 font-mono">{user?.email}</strong>. View your assigned domain records, renewal dates, and hosting packages.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-blue-500/40 transition-colors shadow-sm"
              title="Refresh Portfolio"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 1. TOP METRIC ROW (4 CARDS) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Domains */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-lg space-y-3 hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Domains</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                {loading ? <span className="inline-block w-8 h-8 rounded skeleton-shimmer" /> : metrics.total}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">In your personal portfolio</p>
            </div>
          </div>

          {/* Card 2: Active Domains */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-lg space-y-3 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Active Domains</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-300 font-mono tracking-tight">
                {loading ? <span className="inline-block w-8 h-8 rounded skeleton-shimmer" /> : metrics.active}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Healthy &amp; operational</p>
            </div>
          </div>

          {/* Card 3: Expiring Soon */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 border border-amber-200 dark:border-amber-500/30 shadow-sm dark:shadow-lg space-y-3 hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Expiring Soon</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-300 font-mono tracking-tight">
                {loading ? <span className="inline-block w-8 h-8 rounded skeleton-shimmer" /> : metrics.expiring_soon}
              </p>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80">Renewal within 30 days</p>
            </div>
          </div>

          {/* Card 4: Active Hosting */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-lg space-y-3 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">Active Hosting</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-inner">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-300 font-mono tracking-tight">
                {loading ? <span className="inline-block w-8 h-8 rounded skeleton-shimmer" /> : subscriptions.length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Attached hosting packages</p>
            </div>
          </div>
        </div>

        {/* 2. TAB NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 transition-colors">
          <button
            onClick={() => setActiveTab('domains')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'domains'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            Domain Portfolio ({domains.length})
          </button>
          <button
            onClick={() => setActiveTab('hosting')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'hosting'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Server className="w-4 h-4" />
            Hosting &amp; Subscriptions ({subscriptions.length})
          </button>
        </div>

        {/* 3. TAB CONTENT: DOMAIN PORTFOLIO (100% READ-ONLY VIEWER) */}
        {activeTab === 'domains' ? (
          <div className="space-y-4">
            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search domains by name or registrar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors font-mono shadow-sm"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['ALL', 'Active', 'Expiring Soon', 'Expired'].map((filterVal) => {
                  const isSelected = statusFilter === filterVal;
                  return (
                    <button
                      key={filterVal}
                      onClick={() => setStatusFilter(filterVal)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white font-medium shadow-sm shadow-blue-500/25'
                          : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {filterVal}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Read-Only Portfolio Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]/90 overflow-hidden shadow-sm dark:shadow-xl transition-colors">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">DOMAIN NAME</th>
                      <th className="px-6 py-4">REGISTRAR</th>
                      <th className="px-6 py-4">PURCHASE DATE</th>
                      <th className="px-6 py-4">EXPIRY DATE</th>
                      <th className="px-6 py-4">STATUS</th>
                      <th className="px-6 py-4">ATTACHED HOSTING</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                          Loading domain portfolio...
                        </td>
                      </tr>
                    ) : filteredDomains.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-slate-400 space-y-2">
                          <Globe className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No domains assigned yet</p>
                          <p className="text-xs text-slate-500">
                            Domains are provisioned and assigned by your Platform Administrator.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredDomains.map((domain) => {
                        const daysLeft = domain.days_remaining;

                        return (
                          <tr
                            key={domain.id}
                            className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white align-middle">
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                                <span className="font-mono text-xs text-slate-900 dark:text-slate-100">{domain.domain_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300 align-middle">{domain.registrar}</td>
                            <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400 align-middle">
                              {domain.purchase_date
                                ? new Date(domain.purchase_date).toLocaleDateString()
                                : '—'}
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="space-y-0.5">
                                <span className="font-mono text-slate-800 dark:text-slate-200">
                                  {domain.expiry_date
                                    ? new Date(domain.expiry_date).toLocaleDateString()
                                    : '—'}
                                </span>
                                <div className="text-[10px]">
                                  {daysLeft !== undefined && (
                                    <span
                                      className={
                                        daysLeft < 0
                                          ? 'text-rose-600 dark:text-rose-400 font-semibold'
                                          : daysLeft <= 30
                                          ? 'text-amber-600 dark:text-amber-400 font-semibold'
                                          : 'text-slate-500 dark:text-slate-400'
                                      }
                                    >
                                      {daysLeft < 0
                                        ? `${Math.abs(daysLeft)}d overdue`
                                        : `${daysLeft} days remaining`}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <StatusBadge status={domain.status} />
                            </td>
                            <td className="px-6 py-4 align-middle">
                              {domain.plan_name ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                                  <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                  {domain.plan_name} (${domain.price_monthly}/mo)
                                </span>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">No Hosting Attached</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Hosting & Subscriptions Tab (Read-Only Viewer) */
          <div className="space-y-8">
            {/* Active Subscriptions */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Active Linked Subscriptions
              </h2>

              {subscriptions.length === 0 ? (
                <div className="p-8 rounded-2xl text-center space-y-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]">
                  <Server className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No active subscriptions</p>
                  <p className="text-xs text-slate-500">
                    Hosting packages are assigned and configured by the Platform Administrator.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            Linked Domain
                          </span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                            {sub.domain_name}
                          </h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                          {sub.status}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080c14] border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 dark:text-white">{sub.plan_name} Tier</span>
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                            ${parseFloat(sub.price_monthly).toFixed(2)}/mo
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                          <div>
                            <span>Storage:</span> <strong className="text-slate-800 dark:text-slate-200">{sub.storage_gb} GB</strong>
                          </div>
                          <div>
                            <span>Bandwidth:</span> <strong className="text-slate-800 dark:text-slate-200">{sub.bandwidth_gb} GB</strong>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        <span>
                          Next Billing Date: <strong className="text-slate-800 dark:text-slate-200">{sub.next_billing_date || 'N/A'}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Plans Catalog (Read-Only Specifications) */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Platform Cloud Hosting Packages</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hosting specifications provisioned by the Platform Administrator.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl space-y-5 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white">{plan.plan_name}</h4>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Active Plan</span>
                        </div>
                        <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                          ${parseFloat(plan.price_monthly).toFixed(2)}
                          <span className="text-xs text-slate-400 font-normal">/mo</span>
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080c14] border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <HardDrive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Storage:
                          </span>
                          <strong className="text-slate-900 dark:text-white font-mono">{plan.storage_gb} GB NVMe</strong>
                        </div>
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                            Bandwidth:
                          </span>
                          <strong className="text-slate-900 dark:text-white font-mono">{plan.bandwidth_gb} GB</strong>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
                      Managed by Platform Administrator
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
