// hook/useBancos.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Banco {
  codigo: string;
  nombre: string;
  active?: boolean;
  qr_active?: boolean;
}

export function useBancos() {
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  const fetchBancos = useCallback(async (forceRefresh: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bancos', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const dataBancos: Banco[] = result.data;
        setBancos(dataBancos);
        setLoaded(true);
        return dataBancos;
      } else {
        const fallbackBancos = getFallbackBancos();
        setBancos(fallbackBancos);
        setLoaded(true);
        return fallbackBancos;
      }
    } catch (err) {
      let errorMessage = 'Error al cargar bancos';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('Error en useBancos:', err);
      
      const fallbackBancos = getFallbackBancos();
      setBancos(fallbackBancos);
      setLoaded(true);
      return fallbackBancos;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBancos(true);

    const channel1 = supabase.channel('realtime-bancos-pse-auth')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pyp_bancos_autorizados' },
        () => {
          fetchBancos(true);
        }
      )
      .subscribe();

    const channel2 = supabase.channel('realtime-bancos-pse-configs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pyp_configuraciones_globales' },
        () => {
          fetchBancos(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, [fetchBancos]);

  const getFallbackBancos = (): Banco[] => {
    return [
      { codigo: '1007', nombre: 'BANCOLOMBIA' },
      { codigo: '1051', nombre: 'BANCO DAVIVIENDA' },
      { codigo: '1001', nombre: 'BANCO DE BOGOTA' },
      { codigo: '1013', nombre: 'BANCO BBVA COLOMBIA' },
      { codigo: '1052', nombre: 'BANCO AV VILLAS' },
      { codigo: '1032', nombre: 'BANCO CAJA SOCIAL' },
      { codigo: '1019', nombre: 'SCOTIABANK COLPATRIA' },
      { codigo: '1062', nombre: 'BANCO FALABELLA' },
      { codigo: '1023', nombre: 'BANCO DE OCCIDENTE' },
      { codigo: '1002', nombre: 'BANCO POPULAR' },
      { codigo: '1507', nombre: 'NEQUI' },
      { codigo: '1086', nombre: 'TUYA / ÉXITO' },
      { codigo: 'generic', nombre: 'OTROS BANCOS (GENÉRICO)' }
    ];
  };

  const reset = () => {
    setBancos([]);
    setLoading(false);
    setError(null);
    setLoaded(false);
  };

  return {
    bancos,
    loading,
    error,
    loaded,
    fetchBancos,
    reset,
  };
}