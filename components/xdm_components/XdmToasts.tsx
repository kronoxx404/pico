// components/xdm_components/AdminToasts.tsx
'use client';

import React from 'react';
import { ToastNotification } from './useQrAdmin';

interface AdminToastsProps {
  toasts: ToastNotification[];
  onRemove: (id: string) => void;
}

export default function AdminToasts({ toasts, onRemove }: AdminToastsProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-violet-500/30 text-emerald-100'
              : toast.type === 'error'
              ? 'bg-red-950/90 border-red-500/30 text-red-100'
              : 'bg-stone-900/90 border-zinc-700 text-zinc-100'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' && (
              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold leading-tight">{toast.title}</h4>
            <p className="text-xs opacity-90 mt-0.5 leading-snug break-words">{toast.message}</p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(toast.id)}
            className="text-zinc-400 hover:text-white transition-colors p-0.5 rounded-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
