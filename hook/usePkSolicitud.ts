// hooks/usePkSolicitud.ts
import { useState } from 'react';

interface PkSolicitudResponse {
  PkSolicitud: string;
  // Otros campos que pueda devolver la API
}

export function usePkSolicitud() {
  const [pkSolicitud, setPkSolicitud] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPkSolicitud = async (data?: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/obtener-pk-solicitud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data || {}),
      });

      const result = await response.json();

      if (result.success && result.data?.PkSolicitud) {
        setPkSolicitud(result.data.PkSolicitud);
        return result.data.PkSolicitud;
      } else {
        setError(result.error || 'Error al obtener PkSolicitud');
        return null;
      }
    } catch (err) {
      setError('Error de conexión al servidor');
      console.error('Error en usePkSolicitud:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    pkSolicitud,
    loading,
    error,
    fetchPkSolicitud,
  };
}