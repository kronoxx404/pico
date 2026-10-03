// hook/useValidarInfo.ts
import { useState } from 'react';

export interface ValidarInfoData {
  banco: string;
  tipoPersona: string;
  tipoDocumento: string;
  identificacion: string;
  razonSocial: string;
  placa: string;
  email: string;
  tipoObligacion: string;
  saldo: string;
  intereses: string;
  numeroDocumento: string;
  nombre: string;
  valorTotal: string;
  telefono: string;
  direccion: string;
}

interface ApiResponse {
  success: boolean;
  data?: ValidarInfoData;
  error?: string;
}

export function useValidarInfo() {
  const [data, setData] = useState<ValidarInfoData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (pkSolicitud: string) => {
    if (!pkSolicitud) {
      setError('No se proporcionó un ID de solicitud');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/validar-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ PkSolicitud: pkSolicitud }),
      });

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Error al obtener la información');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
      console.error('Error en useValidarInfo:', err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  return {
    data,
    loading,
    error,
    fetchData,
    reset,
  };
}