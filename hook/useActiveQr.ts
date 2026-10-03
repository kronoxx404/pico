// hook/useActiveQr.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ActiveQrData {
  id: string;
  url: string;
  isActive: boolean;
  name: string;
  monto?: number;
  llave?: string;
  sizeBytes: number;
  originalSizeBytes?: number;
  mimeType?: string;
  dimensions?: { width: number; height: number };
  updatedAt: string;
  source: string;
  missingEnvVars?: string[];
}

const DEFAULT_QR_URL = '/QR.jpeg';

export function useActiveQr() {
  const [qrData, setQrData] = useState<ActiveQrData | null>(null);
  const [qrUrl, setQrUrl] = useState<string>(DEFAULT_QR_URL);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveQr = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Hit the local Next.js API that reads from SQLite
      const res = await fetch('/api/qrs', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      if (json.success && json.qrs && json.qrs.length > 0) {
        // Pick a random QR from the active ones
        const randomQr = json.qrs[Math.floor(Math.random() * json.qrs.length)];
        
        setQrData(randomQr);
        if (randomQr.url) {
          setQrUrl(randomQr.url);
        }
        setIsActive(randomQr.isActive !== false);
      } else {
        // Fallback if no active QRs are found
        setQrUrl(DEFAULT_QR_URL);
        setIsActive(true);
      }
    } catch (err) {
      console.warn('[useActiveQr] Error obteniendo QR activo, usando fallback:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar QR');
      setQrUrl(DEFAULT_QR_URL);
      setIsActive(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveQr();
  }, [fetchActiveQr]);

  return {
    qrData,
    qrUrl,
    isActive,
    isLoading,
    error,
    refreshQr: fetchActiveQr,
  };
}
