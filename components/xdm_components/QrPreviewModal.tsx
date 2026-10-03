// components/xdm_components/QrPreviewModal.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface QrPreviewModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function QrPreviewModal({
  isOpen,
  imageUrl,
  onClose,
}: QrPreviewModalProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-stone-900 border border-zinc-700/80 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">
              Vista Previa del Código QR
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-700/60 shadow-inner flex items-center justify-center">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80">
            <Image
              src={imageUrl}
              alt="Vista previa código QR"
              fill
              unoptimized
              className="object-contain rounded-lg"
              priority
            />
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-zinc-400">
            Renderizado tal como lo verán los usuarios en el modal de pago de Pico y Placa.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl border border-zinc-700 transition-colors"
          >
            Cerrar Vista Previa
          </button>
        </div>
      </div>
    </div>
  );
}
