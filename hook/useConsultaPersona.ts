// hook/useConsultaPersona.ts
import { useState } from 'react';

export interface DatosPersonaResponse {
  idDatosUsuario?: string;
  idSolicitud?: string;
  primerNombre?: string;
  segundoNombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  nombre?: string;
  apellido?: string;
  correo?: string;
  correoPrimario?: string;
  correoSecundario?: string;
  departamento?: string;
  municipio?: string;
  localidad?: string;
  direccion?: string;
  telefono?: string;
  estrato?: string;
  tipoPropiedad?: string;
  soyPropietario?: string;
  motivoViaje?: string;
  NumeroIdentificacion?: string;
  IdTipoDocumento?: string;
  encontrado?: boolean;
  [key: string]: any;
}

export function useConsultaPersona() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [datosPersona, setDatosPersona] = useState<DatosPersonaResponse | null>(null);

  const consultarPersona = async (numeroIdentificacion: string, idTipoDocumento: string = "1") => {
    if (!numeroIdentificacion) {
      setError('No se proporcionó un número de identificación');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/consulta-persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NumeroIdentificacion: numeroIdentificacion,
          IdTipoDocumento: idTipoDocumento,
        }),
      });

      const result = await response.json();
      console.log('📦 Respuesta del servidor:', result);

      // ✅ Siempre retornar un objeto, incluso si no hay datos
      const data = result.success && result.data ? result.data : {};
      
      // Mapear los datos disponibles (solo los que vienen)
      const datosMapeados: DatosPersonaResponse = {
        // Datos básicos - usar lo que venga o vacío
        primerNombre: data.primerNombre || data.nombre?.split(' ')[0] || '',
        segundoNombre: data.segundoNombre || '',
        primerApellido: data.primerApellido || data.apellido?.split(' ')[0] || '',
        segundoApellido: data.segundoApellido || '',
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        
        // Contacto
        correoPrimario: data.correoPrimario || data.correo || data.email || data.correosElectronicos?.email || '',
        correoSecundario: data.correoSecundario || '',
        correo: data.correo || data.email || data.correosElectronicos?.email || '',
        numeroTelefono: data.numeroTelefono || data.telefono || '',
        telefono: data.telefono || '',
        
        // Ubicación
        departamentoResidencia: data.departamentoResidencia || data.departamento || '',
        municipioResidencia: data.municipioResidencia || data.municipio || '',
        localidadResidencia: data.localidadResidencia || data.localidad || '',
        departamento: data.departamento || '',
        municipio: data.municipio || '',
        localidad: data.localidad || '',
        direccionCorrespondencia: data.direccionCorrespondencia || data.direccion || data.direcciones?.[0]?.direccion || '',
        direccionOrigen: data.direccionOrigen || data.direccion || data.direcciones?.[0]?.direccion || '',
        direccionDestino: data.direccionDestino || data.direccion || data.direcciones?.[0]?.direccion || '',
        direccion: data.direccion || data.direcciones?.[0]?.direccion || '',
        
        // Otros campos
        estrato: data.estrato || '',
        tipoPropiedad: data.tipoPropiedad || '',
        soyPropietario: data.soyPropietario || '',
        motivoViaje: data.motivoViaje || '1',
        
        // IDs - si no vienen, no importa
        idDatosUsuario: data.idDatosUsuario || data.IdDatosUsuario || '',
        idSolicitud: data.idSolicitud || data.IdSolicitud || '',
        
        // Documento
        NumeroIdentificacion: numeroIdentificacion,
        IdTipoDocumento: idTipoDocumento,
        encontrado: result.success && result.data ? true : false,
      };

      setDatosPersona(datosMapeados);
      console.log('✅ Datos mapeados:', datosMapeados);
      
      return datosMapeados;
    } catch (err) {
      console.error('Error en useConsultaPersona:', err);
      setError('Error de conexión al servidor');
      
      // ✅ Retornar un objeto vacío pero con el documento
      const datosVacios: DatosPersonaResponse = {
        NumeroIdentificacion: numeroIdentificacion,
        IdTipoDocumento: idTipoDocumento,
        encontrado: false,
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        correoPrimario: '',
        correoSecundario: '',
        departamentoResidencia: '',
        municipioResidencia: '',
        localidadResidencia: '',
        direccionCorrespondencia: '',
        numeroTelefono: '',
        direccionOrigen: '',
        direccionDestino: '',
        estrato: '',
        tipoPropiedad: '',
        soyPropietario: '',
        motivoViaje: '1',
      };
      
      setDatosPersona(datosVacios);
      return datosVacios;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDatosPersona(null);
    setLoading(false);
    setError(null);
  };

  return {
    datosPersona,
    loading,
    error,
    consultarPersona,
    reset,
  };
}