// components/xdm_components/CurrentQrCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { ActiveQrData } from '@/hook/useActiveQr';

interface CurrentQrCardProps {
  activeQr: ActiveQrData | null;
  isLoading: boolean;
  onPreview: (url: string) => void;
  onToggleStatus: () => void;
}

export default function CurrentQrCard({
  activeQr,
  isLoading,
  onPreview,
  onToggleStatus,
}: CurrentQrCardProps) {
  if (isLoading) {
    return (
      <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 animate-pulse">
        <div className="h-5 w-44 bg-zinc-800 rounded-md mb-6" />
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-52 h-52 bg-zinc-800 rounded-xl" />
          <div className="flex-1 space-y-3 w-full">
            <div className="h-4 bg-zinc-800 rounded-sm w-3/4" />
            <div className="h-4 bg-zinc-800 rounded-sm w-1/2" />
            <div className="h-4 bg-zinc-800 rounded-sm w-2/3" />
            <div className="h-9 bg-zinc-800 rounded-lg w-32 mt-4" />
          </div>
        </div>
      </div>
    );
  }

  const qrUrl = activeQr?.url || '/QR.jpeg';
  const isActive = activeQr?.isActive !== false;
  const formattedSize = activeQr?.sizeBytes
    ? `${(activeQr.sizeBytes / 1024).toFixed(1)} KB`
    : '154 KB';
  const formattedDate = activeQr?.updatedAt
    ? new Date(activeQr.updatedAt).toLocaleString('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Inicializado';

  return (
    <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xs relative overflow-hidden">
      {/* Glow decorativo sutil */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <h2 className="text-sm font-semibold text-zinc-200">
            Código QR Activo en Producción
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              isActive
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
            }`}
          >
            {isActive ? '● En Funcionamiento' : '○ Pausado'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Contenedor del QR */}
        <div className="sm:col-span-5 flex flex-col items-center">
          <div
            onClick={() => onPreview(qrUrl)}
            className="group relative bg-white p-3.5 rounded-xl border border-zinc-700 shadow-md cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:border-violet-500/50"
            title="Click para ampliar"
          >
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 overflow-hidden rounded-lg">
              <Image
                src={qrUrl}
                alt="Código QR Activo"
                fill
                unoptimized
                className="object-contain"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-medium gap-1.5 backdrop-blur-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Ampliar
            </div>
          </div>
          <span className="text-[11px] text-zinc-500 mt-2">
            Click sobre la imagen para ampliar
          </span>
        </div>

        {/* Metadatos y Acciones */}
        <div className="sm:col-span-7 space-y-4">
          <div className="space-y-2.5 text-xs text-zinc-400">
            <div className="flex justify-between py-1.5 border-b border-stone-800/60">
              <span className="text-zinc-500">Nombre archivo:</span>
              <span className="font-mono text-zinc-200 truncate max-w-[200px]">
                {activeQr?.name || 'QR.jpeg'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-800/60">
              <span className="text-zinc-500">Peso optimizado:</span>
              <span className="font-mono text-violet-400 font-medium">
                {formattedSize}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-800/60">
              <span className="text-zinc-500">Última actualización:</span>
              <span className="text-zinc-300">{formattedDate}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-stone-800/60">
              <span className="text-zinc-500">Origen de datos:</span>
              <span className="text-zinc-300 capitalize">
                {activeQr?.source === 'supabase_storage'
                  ? 'Supabase Storage'
                  : activeQr?.source === 'supabase_db'
                  ? 'Supabase DB'
                  : 'Local Cache'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              type="button"
              onClick={onToggleStatus}
              className={`flex-1 min-w-[130px] px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-xs'
              }`}
            >
              {isActive ? (
                <>
                  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pausar QR
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Activar QR
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onPreview(qrUrl)}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-medium transition-colors"
            >
              Ver Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
