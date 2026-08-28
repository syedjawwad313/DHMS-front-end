'use client';

import React from 'react';
import { Shield, User } from 'lucide-react';

/**
 * StatusBadge Component
 * Light and Dark adaptive status indicator pill
 */
export const StatusBadge = ({ status }) => {
  const normalized = (status || 'Active').toLowerCase();

  if (normalized === 'active' || normalized === 'healthy') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Active
      </span>
    );
  }

  if (normalized === 'expiring soon' || normalized === 'expiring' || normalized === 'pending') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
        Expiring Soon
      </span>
    );
  }

  if (normalized === 'expired' || normalized === 'inactive' || normalized === 'closed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        {normalized === 'closed' ? 'Closed' : 'Expired'}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      {status}
    </span>
  );
};

/**
 * RoleBadge Component
 * ADMIN vs USER Role Chip
 */
export const RoleBadge = ({ role }) => {
  const isAdmin = (role || 'user').toLowerCase() === 'admin';

  if (isAdmin) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
        <Shield className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
        ADMIN
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
      <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
      CLIENT
    </span>
  );
};
