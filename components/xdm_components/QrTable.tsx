'use client';

import React from 'react';
import Image from 'next/image';
import { ActiveQrData } from '@/hook/useActiveQr';

interface QrTableProps {
  qrs: ActiveQrData[];
  isLoading: boolean;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onDelete: (id: string, url: string) => void;
  onPreview: (url: string) => void;
  onEdit?: (qr: ActiveQrData) => void;
}

export default function QrTable({
  qrs,
  isLoading,
  onToggleStatus,
  onDelete,
  onPreview,
  onEdit,
}: QrTableProps) {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!qrs || qrs.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 bg-stone-900/50 rounded-2xl border border-stone-800/50">
        No hay códigos QR subidos. Utiliza el panel superior para subir uno.
      </div>
    );
  }

  return (
    <div className="mt-12 bg-stone-900/40 border border-stone-800/60 rounded-2xl overflow-hidden backdrop-blur-xl">
      <div className="px-6 py-5 border-b border-stone-800/60 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
          <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Listado de QRs de Recaudo
        </h3>
        <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-full border border-zinc-700/50">
          Total: {qrs.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-stone-900/60 border-b border-stone-800/60 text-zinc-400">
              <th className="px-6 py-4 font-medium">Miniatura</th>
              <th className="px-6 py-4 font-medium">Entidad / Banco</th>
              <th className="px-6 py-4 font-medium">Llave / Monto</th>
              <th className="px-6 py-4 font-medium">Fecha</th>
              <th className="px-6 py-4 font-medium text-center">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {qrs.map((qr) => (
              <tr key={qr.id} className="hover:bg-zinc-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div 
                    className="w-12 h-12 rounded-lg border border-zinc-700/50 overflow-hidden bg-white cursor-pointer relative group"
                    onClick={() => onPreview(qr.url)}
                  >
                    <Image 
                      src={qr.url} 
                      alt={qr.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform" 
                      unoptimized 
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-zinc-200 font-medium block">{qr.name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-violet-400 font-mono text-xs">{qr.llave}</span>
                    {qr.monto ? (
                      <span className="text-zinc-400 text-xs mt-1">
                        $ {qr.monto.toLocaleString('es-CO')}
                      </span>
                    ) : (
                      <span className="text-zinc-500 text-xs mt-1">
                        Monto abierto
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  {new Date(qr.updatedAt).toLocaleDateString('es-CO', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onToggleStatus(qr.id, !qr.isActive)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                        qr.isActive ? 'bg-violet-500' : 'bg-zinc-700'
                      }`}
                      aria-label="Activar/Desactivar QR"
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-300 ${
                          qr.isActive ? 'translate-x-4.5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => onEdit && onEdit(qr)}
                    className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                    title="Editar QR"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(qr.id, qr.url)}
                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Eliminar QR"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
