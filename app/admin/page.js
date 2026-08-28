'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminRoute } from '../../components/RouteGuards';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import {
  Shield,
  Users,
  Globe,
  Server,
  MessageSquare,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  HardDrive,
  Cpu,
  DollarSign,
  Loader2,
  Mail,
  Calendar,
  Layers,
  Check,
  X,
  Sparkles,
  Search,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';
import { StatusBadge, RoleBadge } from '../../components/Badge';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';

export default function AdminDashboard() {
  const { user } = useAuth();

  // Active Tab: 'overview' | 'domains' | 'users' | 'messages' | 'plans'
  const [activeTab, setActiveTab] = useState('overview');

  // Data states
  const [metrics, setMetrics] = useState({
    total_users: 0,
    total_domains: 0,
    active_subscriptions: 0,
    open_tickets: 0,
    active_plans: 0,
  });
  const [domainsList, setDomainsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [plansList, setPlansList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [domainSearch, setDomainSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');

  // Modals state for Plans CRUD
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    plan_name: '',
    storage_gb: '',
    bandwidth_gb: '',
    price_monthly: '',
    is_active: true,
  });

  // Modals state for Domains Admin CRUD
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [domainForm, setDomainForm] = useState({
    user_id: '',
    domain_name: '',
    registrar: 'Namecheap',
    purchase_date: '',
    expiry_date: '',
  });

  // Modal state for Admin Attach Hosting
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [attachDomain, setAttachDomain] = useState(null);
  const [attachForm, setAttachForm] = useState({
    domain_id: '',
    plan_id: '',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState(null);

  // Fetch admin telemetry
  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [metricsRes, domainsRes, usersRes, msgsRes, plansRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/domains'),
        api.get('/admin/users'),
        api.get('/admin/messages'),
        api.get('/plans'),
      ]);

      if (metricsRes.data?.metrics) setMetrics(metricsRes.data.metrics);
      if (domainsRes.data?.domains) setDomainsList(domainsRes.data.domains);
      if (usersRes.data?.users) setUsersList(usersRes.data.users);
      if (msgsRes.data?.messages) setMessagesList(msgsRes.data.messages);
      if (plansRes.data?.plans) setPlansList(plansRes.data.plans);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setToast({
        type: 'error',
        message: 'Failed to retrieve admin telemetry. Please check server status.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Toggle Contact Message Status
  const handleToggleMessage = async (msgId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'open' ? 'closed' : 'open';
      const res = await api.patch(`/admin/messages/${msgId}`, { status: nextStatus });
      if (res.data?.success) {
        setToast({ type: 'success', message: res.data.message });
        fetchAdminData();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update message status.' });
    }
  };

  // Open Create Plan Modal
  const handleOpenCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm({
      plan_name: '',
      storage_gb: '',
      bandwidth_gb: '',
      price_monthly: '',
      is_active: true,
    });
    setFormError('');
    setIsPlanModalOpen(true);
  };

  // Open Edit Plan Modal
  const handleOpenEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      plan_name: plan.plan_name,
      storage_gb: plan.storage_gb,
      bandwidth_gb: plan.bandwidth_gb,
      price_monthly: plan.price_monthly,
      is_active: plan.is_active,
    });
    setFormError('');
    setIsPlanModalOpen(true);
  };

  // Submit Plan Create/Update
  const handleSavePlan = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!planForm.plan_name || !planForm.storage_gb || !planForm.bandwidth_gb || !planForm.price_monthly) {
      setFormError('Please fill out all plan configuration fields.');
      return;
    }

    setActionLoading(true);

    try {
      if (editingPlan) {
        const res = await api.put(`/admin/plans/${editingPlan.id}`, planForm);
        if (res.data?.success) {
          setToast({ type: 'success', message: 'Plan updated successfully!' });
          setIsPlanModalOpen(false);
          fetchAdminData();
        }
      } else {
        const res = await api.post('/admin/plans', planForm);
        if (res.data?.success) {
          setToast({ type: 'success', message: 'New hosting plan created!' });
          setIsPlanModalOpen(false);
          fetchAdminData();
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save hosting tier.');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Plan Active State
  const handleTogglePlanState = async (planId) => {
    try {
      const res = await api.delete(`/admin/plans/${planId}`);
      if (res.data?.success) {
        setToast({ type: 'success', message: res.data.message });
        fetchAdminData();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update plan status.' });
    }
  };

  // Delete Plan permanently
  const handleDeletePlan = async (planId, planName) => {
    if (!confirm(`Are you sure you want to permanently delete the "${planName}" hosting plan?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.delete(`/admin/plans/${planId}?hardDelete=true`);
      if (res.data?.success) {
        setToast({ type: 'success', message: res.data.message || `Plan "${planName}" deleted successfully.` });
        setIsPlanModalOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete hosting plan.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Open Create Domain Modal
  const handleOpenCreateDomain = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearStr = nextYear.toISOString().split('T')[0];

    setEditingDomain(null);
    setDomainForm({
      user_id: usersList.length > 0 ? usersList[0].id : '',
      domain_name: '',
      registrar: 'Namecheap',
      purchase_date: today,
      expiry_date: nextYearStr,
    });
    setFormError('');
    setIsDomainModalOpen(true);
  };

  // Open Edit Domain Modal
  const handleOpenEditDomain = (domain) => {
    setEditingDomain(domain);
    setDomainForm({
      user_id: domain.user_id,
      domain_name: domain.domain_name,
      registrar: domain.registrar || 'Namecheap',
      purchase_date: domain.purchase_date ? domain.purchase_date.split('T')[0] : '',
      expiry_date: domain.expiry_date ? domain.expiry_date.split('T')[0] : '',
    });
    setFormError('');
    setIsDomainModalOpen(true);
  };

  // Open Attach Hosting Modal for Admin
  const handleOpenAttachDomain = (domain) => {
    setAttachDomain(domain);
    setAttachForm({
      domain_id: domain.id,
      plan_id: domain.plan_id || (plansList.length > 0 ? plansList[0].id : ''),
    });
    setFormError('');
    setIsAttachModalOpen(true);
  };

  // Save Attach Hosting (Admin)
  const handleSaveAttach = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!attachForm.domain_id || !attachForm.plan_id) {
      setFormError('Please select a hosting tier to link.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.post('/subscriptions', attachForm);
      if (res.data?.success) {
        setToast({ type: 'success', message: 'Hosting package attached successfully by Administrator.' });
        setIsAttachModalOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to attach hosting package.');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Admin Domain (Create or Update)
  const handleSaveDomain = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!domainForm.domain_name || !domainForm.registrar || !domainForm.purchase_date || !domainForm.expiry_date) {
      setFormError('Please fill out all domain configuration fields.');
      return;
    }

    setActionLoading(true);
    try {
      if (editingDomain) {
        const res = await api.put(`/admin/domains/${editingDomain.id}`, domainForm);
        if (res.data?.success) {
          setToast({ type: 'success', message: 'Domain updated successfully by Administrator.' });
          setIsDomainModalOpen(false);
          fetchAdminData();
        }
      } else {
        const res = await api.post('/admin/domains', domainForm);
        if (res.data?.success) {
          setToast({ type: 'success', message: 'Domain provisioned and assigned successfully!' });
          setIsDomainModalOpen(false);
          fetchAdminData();
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save domain.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Domain (Admin only)
  const handleDeleteDomain = async (domainId, domainName) => {
    if (!confirm(`Are you sure you want to permanently delete domain "${domainName}"? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.delete(`/admin/domains/${domainId}`);
      if (res.data?.success) {
        setToast({ type: 'success', message: `Domain "${domainName}" deleted successfully.` });
        setIsDomainModalOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete domain.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Search filters
  const filteredAdminDomains = domainsList.filter((d) => {
    if (!domainSearch.trim()) return true;
    const q = domainSearch.toLowerCase();
    return (
      d.domain_name?.toLowerCase().includes(q) ||
      d.user_email?.toLowerCase().includes(q) ||
      d.registrar?.toLowerCase().includes(q)
    );
  });

  const filteredUsers = usersList.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
  });

  const filteredMessages = messagesList.filter((m) => {
    if (!ticketSearch.trim()) return true;
    const q = ticketSearch.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q)
    );
  });

  return (
    <AdminRoute>
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in radial-glow transition-colors duration-200">
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        {/* Executive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5 font-sans">
              <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              Administrator Control Center
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-500/40 font-mono">
                SuperAdmin Authority
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Global cloud telemetry, domain provisioning authority, hosting package assignment, and user governance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-blue-500/40 transition-colors shadow-sm"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleOpenCreateDomain}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              Provision Domain
            </button>
          </div>
        </div>

        {/* 1. TOP METRIC ROW (4 CARDS) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Users */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-xl space-y-3 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Users</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                {loading ? <span className="inline-block w-8 h-8 rounded skeleton-shimmer" /> : metrics.total_users}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Registered platform accounts</p>
            </div>
          </div>

          {/* Card 2: Domains */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-xl space-y-3 hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Total Domains</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-300 font-mono tracking-tight">
                {loading ? <span className="inline-block w-8 h-8 rounded skeleton-shimmer" /> : metrics.total_domains}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Platform-wide domain records</p>
            </div>
          </div>

          {/* Card 3: Active Subscriptions */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-xl space-y-3 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">Active Subscriptions</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-inner">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-300 font-mono tracking-tight">
                {loading ? <span className="inline-block w-8 h-8 rounded skeleton-shimmer" /> : metrics.active_subscriptions}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Attached hosting instances</p>
            </div>
          </div>

          {/* Card 4: Open Inquiries */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 border border-amber-200 dark:border-amber-500/30 shadow-sm dark:shadow-xl space-y-3 hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Open Tickets</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-300 font-mono tracking-tight">
                {loading ? <span className="inline-block w-8 h-8 rounded skeleton-shimmer" /> : metrics.open_tickets}
              </p>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">Pending admin resolution</p>
            </div>
          </div>
        </div>

        {/* 2. VIEW SWITCHER TABS WITH PILL HIGHLIGHTS */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto transition-colors">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('domains')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'domains'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Domain Management</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'domains' ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {domainsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Directory</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'users' ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {usersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'messages'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Support Inquiries</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'messages' ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {messagesList.length}
            </span>
            {metrics.open_tickets > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'plans'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Hosting Plans</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
              activeTab === 'plans' ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {plansList.length}
            </span>
          </button>
        </div>

        {/* 3. TAB CONTENTS */}

        {/* Tab 1: Executive Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Infrastructure & Quick Ops Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Infrastructure & DB Health */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Infrastructure &amp; DB Health
                </h3>
                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#080c14] border border-slate-100 dark:border-slate-800">
                    <span>PostgreSQL Database Pool (Neon / Supabase)</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      CONNECTED (SSL)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#080c14] border border-slate-100 dark:border-slate-800">
                    <span>RBAC &amp; Admin Domain Authority</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                      <Shield className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      ENFORCED (SuperAdmin)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#080c14] border border-slate-100 dark:border-slate-800">
                    <span>Dynamic Expiry Calculator (&le;30d)</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
                      <Activity className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                      OPERATIONAL
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Admin Operations */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0f172a]/90 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  Quick Admin Operations
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveTab('domains')}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#080c14] border border-slate-100 dark:border-slate-800 text-left hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all space-y-2 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Manage Domains</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{domainsList.length} registered records</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#080c14] border border-slate-100 dark:border-slate-800 text-left hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all space-y-2 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Review Tickets</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{metrics.open_tickets} pending inquiries</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Domain Management (Admin Authority) */}
        {activeTab === 'domains' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter by domain name, owner email, or registrar..."
                  value={domainSearch}
                  onChange={(e) => setDomainSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors font-mono shadow-sm"
                />
              </div>

              <button
                onClick={handleOpenCreateDomain}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                Add / Provision Domain
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]/90 overflow-hidden shadow-sm dark:shadow-xl transition-colors">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">DOMAIN NAME</th>
                      <th className="px-6 py-4">OWNER (USER EMAIL)</th>
                      <th className="px-6 py-4">REGISTRAR</th>
                      <th className="px-6 py-4">PURCHASE DATE</th>
                      <th className="px-6 py-4">EXPIRY DATE</th>
                      <th className="px-6 py-4">STATUS</th>
                      <th className="px-6 py-4">ATTACHED HOSTING</th>
                      <th className="px-6 py-4 text-right">ADMIN ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredAdminDomains.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                          No domains found matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAdminDomains.map((d) => (
                        <tr key={d.id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white align-middle">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                              <span className="font-mono text-xs text-slate-900 dark:text-slate-100">{d.domain_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono text-xs">
                              <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              {d.user_email}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-700 dark:text-slate-300 align-middle">{d.registrar}</td>
                          <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400 align-middle">
                            {d.purchase_date ? new Date(d.purchase_date).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400 align-middle">
                            {d.expiry_date ? new Date(d.expiry_date).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <StatusBadge status={d.status} />
                          </td>
                          <td className="px-6 py-4 align-middle">
                            {d.plan_name ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                                <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                {d.plan_name} (${d.price_monthly}/mo)
                              </span>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500 text-[11px]">No Hosting Attached</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right align-middle">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenAttachDomain(d)}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                                title="Attach / Switch Hosting Tier (SuperAdmin)"
                              >
                                <Zap className="w-3.5 h-3.5 text-cyan-300" />
                                <span>Attach Hosting</span>
                              </button>

                              <button
                                onClick={() => handleOpenEditDomain(d)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Edit Domain (Admin Only)"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDomain(d.id, d.domain_name)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                title="Delete Domain (Admin Only)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Users Directory */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search users by email or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors font-mono shadow-sm"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]/90 overflow-hidden shadow-sm dark:shadow-xl transition-colors">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">USER ACCOUNT</th>
                      <th className="px-6 py-4">ROLE</th>
                      <th className="px-6 py-4">DOMAINS OWNED</th>
                      <th className="px-6 py-4">ACTIVE HOSTING SUBS</th>
                      <th className="px-6 py-4">REGISTERED DATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white align-middle">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase font-mono shadow-sm">
                              {u.email?.charAt(0) || 'U'}
                            </div>
                            <span className="font-mono text-slate-900 dark:text-slate-100">{u.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-300 align-middle">
                          {u.domain_count}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-cyan-600 dark:text-cyan-300 align-middle">
                          {u.subscription_count}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400 align-middle">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Support Inquiries Inbox */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tickets by sender, subject, or message..."
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors font-mono shadow-sm"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]/90 overflow-hidden shadow-sm dark:shadow-xl transition-colors">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">SENDER &amp; EMAIL</th>
                      <th className="px-6 py-4">SUBJECT</th>
                      <th className="px-6 py-4">MESSAGE DETAILS</th>
                      <th className="px-6 py-4">RECEIVED DATE</th>
                      <th className="px-6 py-4">STATUS</th>
                      <th className="px-6 py-4 text-right">TOGGLE RESOLUTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredMessages.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                          No support inquiries received matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredMessages.map((msg) => (
                        <tr key={msg.id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 align-middle">
                            <div className="font-semibold text-slate-900 dark:text-white">{msg.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{msg.email}</div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200 align-middle">{msg.subject}</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate align-middle" title={msg.message}>
                            {msg.message}
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400 align-middle">
                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <StatusBadge status={msg.status} />
                          </td>
                          <td className="px-6 py-4 text-right align-middle">
                            <button
                              onClick={() => handleToggleMessage(msg.id, msg.status)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 ${
                                msg.status === 'open'
                                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/60'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                            >
                              {msg.status === 'open' ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Mark Closed</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Reopen</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Hosting Plans Management */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure cloud hosting specifications, pricing, and availability tiers.
              </p>
              <button
                onClick={handleOpenCreatePlan}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-md shadow-blue-500/25"
              >
                <Plus className="w-4 h-4" />
                Add New Tier
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plansList.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-6 rounded-2xl bg-white dark:bg-[#0f172a] border space-y-4 shadow-sm dark:shadow-xl ${
                    plan.is_active ? 'border-slate-200 dark:border-slate-800' : 'border-rose-300 dark:border-rose-500/30 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{plan.plan_name}</h4>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          plan.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {plan.is_active ? '● Active in Catalog' : '○ Inactive'}
                      </span>
                    </div>
                    <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                      ${parseFloat(plan.price_monthly).toFixed(2)}
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/mo</span>
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

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => handleTogglePlanState(plan.id)}
                      className={`font-semibold flex items-center gap-1 ${
                        plan.is_active
                          ? 'text-amber-600 dark:text-amber-400 hover:underline'
                          : 'text-emerald-600 dark:text-emerald-400 hover:underline'
                      }`}
                    >
                      {plan.is_active ? 'Deactivate' : 'Activate Tier'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditPlan(plan)}
                        className="text-slate-700 dark:text-slate-300 hover:text-blue-600 font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeletePlan(plan.id, plan.plan_name)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Create/Edit Plan */}
        <Modal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          title={editingPlan ? 'Edit Hosting Plan' : 'Create New Hosting Plan'}
        >
          <form onSubmit={handleSavePlan} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs">
                {formError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tier Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Developer Pro, Ultimate Cloud"
                value={planForm.plan_name}
                onChange={(e) => setPlanForm({ ...planForm, plan_name: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Storage (GB)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={planForm.storage_gb}
                  onChange={(e) => setPlanForm({ ...planForm, storage_gb: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bandwidth (GB)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={planForm.bandwidth_gb}
                  onChange={(e) => setPlanForm({ ...planForm, bandwidth_gb: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Monthly Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                required
                min={0}
                value={planForm.price_monthly}
                onChange={(e) => setPlanForm({ ...planForm, price_monthly: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              {editingPlan ? (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleDeletePlan(editingPlan.id, editingPlan.plan_name)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-white bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 border border-rose-200 dark:border-rose-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Plan
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 flex items-center gap-1.5"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </div>
          </form>
        </Modal>

        {/* Modal: Admin Create/Edit Domain */}
        <Modal
          isOpen={isDomainModalOpen}
          onClose={() => setIsDomainModalOpen(false)}
          title={editingDomain ? 'Edit Domain Record (SuperAdmin)' : 'Provision / Register Domain for User'}
        >
          <form onSubmit={handleSaveDomain} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs">
                {formError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Assign To User Account</label>
              <select
                required
                value={domainForm.user_id}
                onChange={(e) => setDomainForm({ ...domainForm, user_id: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                {usersList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.email} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Domain Name</label>
              <input
                type="text"
                required
                placeholder="e.g. enterprise-platform.org"
                value={domainForm.domain_name}
                onChange={(e) => setDomainForm({ ...domainForm, domain_name: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-mono"
              />
            </div>

            {/* Domain Registrar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Domain Registrar
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Select or type custom</span>
              </div>

              {/* Quick Registrar Selector Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['Namecheap', 'GoDaddy', 'Cloudflare', 'Google Domains', 'Hostinger', 'Route53', 'Porkbun', 'Dynadot'].map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setDomainForm({ ...domainForm, registrar: reg })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      domainForm.registrar === reg
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>

              <input
                type="text"
                required
                placeholder="Registrar Name (e.g. Namecheap, Cloudflare, Custom)"
                value={domainForm.registrar}
                onChange={(e) => setDomainForm({ ...domainForm, registrar: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Domain Purchase & Expiry Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Domain Purchase Date
                </label>
                <input
                  type="date"
                  required
                  value={domainForm.purchase_date}
                  onChange={(e) => setDomainForm({ ...domainForm, purchase_date: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Domain Expiry Date
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const base = domainForm.purchase_date ? new Date(domainForm.purchase_date) : new Date();
                      base.setFullYear(base.getFullYear() + 1);
                      setDomainForm({ ...domainForm, expiry_date: base.toISOString().split('T')[0] });
                    }}
                    className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    +1 Year
                  </button>
                </div>
                <input
                  type="date"
                  required
                  value={domainForm.expiry_date}
                  onChange={(e) => setDomainForm({ ...domainForm, expiry_date: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              {editingDomain ? (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleDeleteDomain(editingDomain.id, editingDomain.domain_name)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-white bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 border border-rose-200 dark:border-rose-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Domain
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsDomainModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 flex items-center gap-1.5"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingDomain ? 'Update Domain' : 'Provision Domain'}
                </button>
              </div>
            </div>
          </form>
        </Modal>

        {/* Modal: Admin Attach Hosting to Domain */}
        <Modal
          isOpen={isAttachModalOpen}
          onClose={() => setIsAttachModalOpen(false)}
          title={`Attach Cloud Hosting: ${attachDomain?.domain_name}`}
        >
          <form onSubmit={handleSaveAttach} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs">
                {formError}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Target Domain:</span>
              <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">{attachDomain?.domain_name}</p>
              <span className="text-slate-500 text-[11px]">Owner: {attachDomain?.user_email}</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Hosting Package</label>
              <select
                value={attachForm.plan_id}
                onChange={(e) => setAttachForm({ ...attachForm, plan_id: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                {plansList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.plan_name} — ${parseFloat(p.price_monthly).toFixed(2)}/mo ({p.storage_gb}GB NVMe, {p.bandwidth_gb}GB Bandwidth)
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAttachModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 flex items-center gap-1.5"
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm &amp; Attach
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminRoute>
  );
}
