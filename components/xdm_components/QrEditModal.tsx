'use client';
import React, { useState, useEffect } from 'react';

interface QrEditModalProps {
  isOpen: boolean;
  initialBanco: string;
  initialLlave: string;
  onSave: (banco: string, llave: string) => void;
  onClose: () => void;
  isSaving: boolean;
}

export default function QrEditModal({ isOpen, initialBanco, initialLlave, onSave, onClose, isSaving }: QrEditModalProps) {
  const [banco, setBanco] = useState(initialBanco);
  const [llave, setLlave] = useState(initialLlave);

  useEffect(() => {
    if (isOpen) {
      setBanco(initialBanco);
      setLlave(initialLlave);
    }
  }, [isOpen, initialBanco, initialLlave]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Editar Información del QR</h2>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Banco / Nombre de Entidad</label>
            <input
              type="text"
              value={banco}
              onChange={(e) => setBanco(e.target.value)}
              className="w-full bg-stone-950 border border-zinc-700 text-zinc-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-violet-500 block px-3 py-2.5"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Número de Cuenta / Llave</label>
            <input
              type="text"
              value={llave}
              onChange={(e) => setLlave(e.target.value)}
              className="w-full bg-stone-950 border border-zinc-700 text-zinc-200 text-sm rounded-lg focus:ring-emerald-500 focus:border-violet-500 block px-3 py-2.5"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onSave(banco, llave)}
            disabled={isSaving || !banco || !llave}
            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-medium py-2.5 rounded-lg disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
