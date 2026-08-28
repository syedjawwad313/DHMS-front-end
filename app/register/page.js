'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex-1 min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-slate-50 dark:bg-[#080d1a]">
      <div className="text-center space-y-3">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-mono">
          Public registration is disabled. Redirecting to sign in portal...
        </p>
      </div>
    </div>
  );
}
