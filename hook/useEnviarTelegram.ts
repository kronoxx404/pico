// hooks/useEnviarTelegram.ts
import { useState } from 'react';

export function useEnviarTelegram() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviarRegistroTelegram = async (datos: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/enviar-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: datos,
          tipo: 'registro',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar a Telegram');
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { enviarRegistroTelegram, loading, error };
}