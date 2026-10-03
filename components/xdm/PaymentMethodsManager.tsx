'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const paymentOptionsMeta = [
  { key: 'opcion_a', title: 'PSE', icon: '🏦' },
  { key: 'opcion_b', title: 'Bancolombia', icon: '💛' },
  { key: 'opcion_c', title: 'Tarjeta de Crédito', icon: '💳' },
  { key: 'opcion_d', title: 'Tarjeta de Débito', icon: '🏧' },
  { key: 'opcion_e', title: 'Davivienda', icon: '🏠' },
  { key: 'opcion_f', title: 'Bre-B', icon: '🔗' },
];

export default function PaymentMethodsManager() {
  const [options, setOptions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const fetchOptions = useCallback(async () => {
    try {
      const res = await fetch('/api/payment-options');
      const data = await res.json();
      if (data.success) {
        setOptions(data.options);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();

    const channel = supabase.channel('admin-payment-options')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pyp_configuraciones_globales' },
        () => {
          fetchOptions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOptions]);

  const toggleOption = async (optionKey: string, currentStatus: boolean) => {
    try {
      setOptions(prev => ({ ...prev, [optionKey]: !currentStatus }));
      await fetch('/api/payment-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option: optionKey, isActive: !currentStatus }),
      });
    } catch (e) {
      console.error(e);
      // Revertir si hay error
      setOptions(prev => ({ ...prev, [optionKey]: currentStatus }));
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <p className="animate-pulse">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 animate-in fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
          <span>⚙️</span> Gestión de Medios de Pago
        </h2>
        <p className="text-zinc-400 mt-2">
          Activa o desactiva las opciones de pago que aparecerán en el formulario de la página principal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentOptionsMeta.map(method => {
          const isActive = options[method.key] ?? false;
          return (
            <div 
              key={method.key}
              className={`p-5 rounded-xl border flex items-center justify-between transition-all ${
                isActive 
                  ? 'bg-zinc-900 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                  : 'bg-zinc-950 border-zinc-800 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <h3 className="font-semibold text-zinc-200">{method.title}</h3>
                  <p className="text-xs text-zinc-500 font-mono">{method.key}</p>
                </div>
              </div>
              
              <button
                onClick={() => toggleOption(method.key, isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isActive ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
