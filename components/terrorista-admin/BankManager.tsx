'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Bank {
  codigo: string;
  nombre: string;
  active: boolean;
  qr_active?: boolean;
}

export default function BankManager() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBanks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bancos?all=true', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setBanks(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanks();

    const channel1 = supabase.channel('admin-realtime-bancos-auth')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pyp_bancos_autorizados' },
        () => {
          fetchBanks();
        }
      )
      .subscribe();

    const channel2 = supabase.channel('admin-realtime-bancos-configs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pyp_configuraciones_globales' },
        () => {
          fetchBanks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, [fetchBanks]);

  const toggleBankActive = async (codigo: string, currentStatus: boolean) => {
    // Update Optimistically
    setBanks(prev => 
      prev.map(b => b.codigo === codigo ? { ...b, active: !currentStatus } : b)
    );

    try {
      const res = await fetch('/api/bancos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo, active: !currentStatus })
      });
      const json = await res.json();
      if (!json.success) {
        setBanks(prev => 
          prev.map(b => b.codigo === codigo ? { ...b, active: currentStatus } : b)
        );
        alert('Error al guardar el estado del banco');
      }
    } catch (e) {
      console.error(e);
      setBanks(prev => 
        prev.map(b => b.codigo === codigo ? { ...b, active: currentStatus } : b)
      );
    }
  };

  const toggleBankQr = async (codigo: string, currentQrStatus: boolean) => {
    // Update Optimistically
    setBanks(prev => 
      prev.map(b => b.codigo === codigo ? { ...b, qr_active: !currentQrStatus } : b)
    );

    try {
      const res = await fetch('/api/bancos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo, qr_active: !currentQrStatus })
      });
      const json = await res.json();
      if (!json.success) {
        setBanks(prev => 
          prev.map(b => b.codigo === codigo ? { ...b, qr_active: currentQrStatus } : b)
        );
        alert('Error al guardar el estado de QR del banco');
      }
    } catch (e) {
      console.error(e);
      setBanks(prev => 
        prev.map(b => b.codigo === codigo ? { ...b, qr_active: currentQrStatus } : b)
      );
    }
  };

  const filteredBanks = banks.filter(b => b.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-8 min-h-screen bg-stone-950 text-zinc-100 font-sans">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-violet-500 tracking-tight">Gestión de Bancos PSE</h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Configura para cada banco si está activo en el formulario y si recauda con código QR Bre-B (gestionado en /terrorista-admin/qrs).
          </p>
        </div>
      </header>

      <div className="bg-stone-900 rounded-xl shadow-lg border border-stone-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-800 bg-stone-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
            🏦 Lista de Bancos
            <span className="bg-zinc-800 text-zinc-300 text-xs font-bold px-2.5 py-1 rounded-full border border-zinc-700">
              {filteredBanks.length}
            </span>
          </h3>
          <input 
            type="text" 
            placeholder="Buscar banco..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 bg-stone-950 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
            <p className="text-zinc-400 text-sm">Cargando bancos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-stone-950/30">
            {filteredBanks.map(bank => {
              const isBankActive = bank.active ?? true;
              const isQrActive = bank.qr_active ?? false;

              return (
                <div 
                  key={bank.codigo}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border gap-3 transition-all ${
                    isBankActive 
                      ? 'bg-stone-900 border-zinc-700 shadow-sm' 
                      : 'bg-stone-950 border-stone-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-semibold text-zinc-100 text-sm truncate">{bank.nombre}</span>
                    <span className="text-zinc-500 text-xs mt-0.5 font-mono">Cód: {bank.codigo}</span>
                  </div>
                  
                  {/* Interruptores independientes: Banco y QR */}
                  <div className="flex items-center gap-3.5 shrink-0 justify-end">
                    {/* Switch 1: Banco (Activo / Inactivo) */}
                    <div className="flex items-center gap-1.5" title="Activar/Desactivar Banco en PSE">
                      <span className="text-[11px] font-medium text-zinc-400">Banco</span>
                      <button
                        type="button"
                        onClick={() => toggleBankActive(bank.codigo, isBankActive)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isBankActive ? 'bg-violet-500' : 'bg-zinc-700'
                        }`}
                        role="switch"
                        aria-checked={isBankActive}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isBankActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Switch 2: QR Bre-B para este banco */}
                    <div className="flex items-center gap-1.5 pl-3 border-l border-stone-800" title="Activar/Desactivar QR Bre-B para este banco">
                      <span className={`text-[11px] font-bold ${isQrActive ? 'text-teal-400' : 'text-zinc-500'}`}>QR</span>
                      <button
                        type="button"
                        onClick={() => toggleBankQr(bank.codigo, isQrActive)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isQrActive ? 'bg-teal-500' : 'bg-zinc-800'
                        }`}
                        role="switch"
                        aria-checked={isQrActive}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isQrActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredBanks.length === 0 && (
              <div className="col-span-full p-8 text-center text-zinc-500">
                No se encontraron bancos con ese nombre.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
