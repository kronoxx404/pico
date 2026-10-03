// hooks/useConsultaPersona.ts
import { useState } from 'react';

interface DatosPersona {
  NumeroIdentificacion: string;
  IdTipoDocumento: string;
}

export function useConsultaPersona() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const consultarPersona = async (datos: DatosPersona) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/consultar-persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al consultar la persona');
      }

      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { consultarPersona, loading, error, data };
}