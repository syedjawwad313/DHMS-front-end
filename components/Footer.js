'use client';

import React from 'react';
import Link from 'next/link';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#080d1a] pt-12 pb-8 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand */}
          <div className="space-y-3 md:col-span-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-black text-sm text-slate-900 dark:text-white tracking-tight font-sans">
                DHMS <span className="text-blue-600 dark:text-blue-400 font-mono">PRO</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Enterprise Domain &amp; Cloud Hosting Management Platform with automated lifecycle notifications, NVMe storage provisioning, and secure PostgreSQL data isolation.
            </p>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-2 md:col-span-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Platform Modules
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Domain Portfolio
                </Link>
              </li>
              <li>
                <Link href="/#plans" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Hosting Plans
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Support &amp; Tickets
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 md:col-span-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Company &amp; Legal
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/#about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About DHMS
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
          <div>© {new Date().getFullYear()} DHMS Inc. All Rights Reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-700 dark:hover:text-slate-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
