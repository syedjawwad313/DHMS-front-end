'use client';

import React, { useState } from 'react';
import api from '../../lib/api';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Shield,
  HelpCircle,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import Toast from '../../components/Toast';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How does DHMS calculate domain expiration status?',
      a: 'DHMS dynamically computes status based on UTC dates: domains with >30 days remaining are Active, ≤30 days are flagged as Expiring Soon with automated renewal warnings, and <0 days are marked Expired.',
    },
    {
      q: 'How do I attach a cloud hosting package to my domain?',
      a: 'Domain hosting packages can be linked by contacting your Platform Administrator or through the SuperAdmin dashboard console.',
    },
    {
      q: 'Can administrators manage domains for any user?',
      a: 'Yes, SuperAdministrators have global authority via the Admin Control Center to provision, edit DNS/expiry configurations, and manage platform hosting tiers.',
    },
    {
      q: 'What database architecture is powering DHMS?',
      a: 'DHMS operates on a high-availability PostgreSQL schema (Neon / Supabase) utilizing pgcrypto UUID primary keys, composite indices, and Row-Level Security isolation.',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/contact', form);
      if (res.data?.success) {
        setSuccess(true);
        setToast({ type: 'success', message: 'Inquiry submitted successfully! Our engineering team will respond shortly.' });
        setForm({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12 animate-fade-in radial-glow transition-colors duration-200">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
          Support &amp; Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Have questions about custom infrastructure, domain zone clustering, or billing? Submit a ticket directly to our engineers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Submit a Ticket</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-500">Encrypted Dispatch</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Inquiry dispatched! Check your email for support updates.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subject / Category</label>
              <input
                type="text"
                required
                placeholder="e.g. Domain Transfer, NVMe Cluster Configuration"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Message Details</label>
              <textarea
                rows={4}
                required
                placeholder="Provide specific information regarding your domain portfolio, server latency, or DNS requirements..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#080c14] border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
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
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Support Ticket</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: FAQ Accordions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quick answers to common questions about domain lifecycle policies, hosting packages, and RBAC security.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] overflow-hidden shadow-sm dark:shadow-md transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
