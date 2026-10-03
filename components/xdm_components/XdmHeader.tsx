// components/xdm_components/AdminHeader.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface AdminHeaderProps {
  isActive: boolean;
  onRefresh: () => void;
  isLoading: boolean;
  missingEnvVars?: string[];
}

export default function AdminHeader({
  isActive,
  onRefresh,
  isLoading,
  missingEnvVars,
}: AdminHeaderProps) {
  const hasMissingVars = missingEnvVars && missingEnvVars.length > 0;

  return (
    <header className="w-full border-b border-stone-800 bg-stone-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500/20 to-violet-700/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-mono text-sm font-bold shadow-xs">
            QR
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-semibold text-zinc-100 tracking-tight flex items-center gap-2">
              Gestor de Código QR
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                Admin
              </span>
            </h1>
            <p className="text-xs text-zinc-500 hidden sm:block">
              Terrorista • Pasarela Segura
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                hasMissingVars
                  ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse'
                  : isActive
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse'
                  : 'bg-zinc-500'
              }`}
            />
            <span className="text-zinc-300 font-medium">
              {hasMissingVars
                ? 'Credenciales Pendientes'
                : isActive
                ? 'Pasarela Operativa'
                : 'QR Pausado'}
            </span>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-zinc-400 hover:text-zinc-100 bg-stone-900 hover:bg-zinc-800 border border-stone-800 rounded-lg transition-colors disabled:opacity-50"
            title="Recargar configuración"
          >
            <svg
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg border border-stone-800 hover:border-zinc-700 bg-stone-900 transition-colors"
          >
            Ver Portal →
          </Link>
        </div>
      </div>
    </header>
  );
}
