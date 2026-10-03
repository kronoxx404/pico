// components/SolicitudForm.tsx
'use client';

import { useState } from 'react';
import RegistroHeaderWithBg from './RegistroHeader';
import { SolicitudDialog } from './SolicitudDialog';
import { useConsultaPersona } from '@/hook/useConsultaPersona';

export default function SolicitudForm() {
  const [tipoDocumento, setTipoDocumento] = useState('1');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [captchaOk, setCaptchaOk] = useState(false);
  const [personaData, setPersonaData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { consultarPersona, datosPersona, loading: consultaLoading } = useConsultaPersona();

  const tiposDocumento = [
    { value: '', label: '--- Seleccionar ---' },
    { value: '1', label: 'Cédula de Ciudadanía' },
    { value: '2', label: 'Cédula de Extranjería' },
    { value: '3', label: 'Pasaporte' },
    { value: '4', label: 'NIT' },
    { value: '5', label: 'Tarjeta de Identidad' },
    { value: '6', label: 'Registro Civil' }
  ];

  const getTipoDocumentoAPI = (tipo: string) => {
    const map: Record<string, string> = {
      '1': '1',
      '2': '2',
      '3': '3',
      '4': '4',
      '5': '5',
      '6': '6'
    };
    return map[tipo] || '1';
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!tipoDocumento) {
      newErrors.tipoDocumento = 'Campo Obligatorio';
    }
    if (!numeroDocumento || numeroDocumento.length < 5) {
      newErrors.numeroDocumento = 'Campo Obligatorio';
    }
    if (!captchaOk) {
      newErrors.captcha = 'Debes confirmar que no eres un robot';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Consultar persona en la API
      const resultado = await consultarPersona(
        numeroDocumento,
        getTipoDocumentoAPI(tipoDocumento)
      );

      // ✅ Siempre usar los datos que vengan, aunque estén vacíos
      const datosParaModal = {
        primerNombre: resultado?.primerNombre || '',
        segundoNombre: resultado?.segundoNombre || '',
        primerApellido: resultado?.primerApellido || '',
        segundoApellido: resultado?.segundoApellido || '',
        correoPrimario: resultado?.correoPrimario || '',
        correoSecundario: resultado?.correoSecundario || '',
        departamentoResidencia: resultado?.departamentoResidencia || '',
        municipioResidencia: resultado?.municipioResidencia || '',
        localidadResidencia: resultado?.localidadResidencia || '',
        direccionCorrespondencia: resultado?.direccionCorrespondencia || '',
        numeroTelefono: resultado?.numeroTelefono || '',
        direccionOrigen: '',
        direccionDestino: '',
        estrato: resultado?.estrato || '',
        tipoPropiedad: '',
        soyPropietario: '',
        motivoViaje: '1',
        NumeroIdentificacion: numeroDocumento,
        IdTipoDocumento: getTipoDocumentoAPI(tipoDocumento),
        tipoDocumentoLabel: tiposDocumento.find(t => t.value === tipoDocumento)?.label || '',
        encontrado: resultado?.encontrado || false,
        idDatosUsuario: resultado?.idDatosUsuario || '',
        idSolicitud: resultado?.idSolicitud || '',
      };

      setPersonaData(datosParaModal);
      console.log('📝 Datos para el modal:', datosParaModal);
      
      // ✅ Siempre abrir el diálogo, tenga o no datos
      setDialogOpen(true);

      if (!resultado?.encontrado) {
        console.log('No se encontró información para este documento. Por favor, complete los datos manualmente.');
      } else {
        console.log('✅ Datos cargados correctamente');
      }

    } catch (error) {
      console.error('Error consultando persona:', error);
      
      // ✅ En caso de error, abrir con datos vacíos pero con el documento
      setPersonaData({
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
        NumeroIdentificacion: numeroDocumento,
        IdTipoDocumento: getTipoDocumentoAPI(tipoDocumento),
        tipoDocumentoLabel: tiposDocumento.find(t => t.value === tipoDocumento)?.label || '',
        encontrado: false,
      });
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <div id="form-section" className='pt-2.5'>
        <RegistroHeaderWithBg />
      </div>

      <div className="w-[95%] sm:w-[80%] md:w-[70%] max-w-[600px] md:max-w-none mx-auto bg-white rounded-[10px] p-4 sm:p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5 w-full md:px-2 mb-4">
          {/* Tipo de Documento */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Tipo de Documento
            </label>
            <select
              id="tipoDocumentoSelect"
              value={tipoDocumento}
              onChange={(e) => {
                setTipoDocumento(e.target.value);
                if (errors.tipoDocumento) {
                  setErrors({ ...errors, tipoDocumento: '' });
                }
              }}
              className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#88f456] focus:border-transparent text-gray-700 bg-white ${
                errors.tipoDocumento ? 'border-red-500' : 'border-[dark-green]'
              }`}
            >
              {tiposDocumento.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
            {errors.tipoDocumento && (
              <p className="mt-1 text-sm text-red-500 font-medium">{errors.tipoDocumento}</p>
            )}
          </div>

          {/* Número de Documento */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Número de Documento
            </label>
            <input
              type="text"
              value={numeroDocumento}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '');
                setNumeroDocumento(numericValue);
                if (errors.numeroDocumento) {
                  setErrors({ ...errors, numeroDocumento: '' });
                }
              }}
              className={`w-full px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#88f456] focus:border-transparent text-gray-700 ${
                errors.numeroDocumento ? 'border-red-500' : 'border-[dark-green]'
              }`}
            />
            {errors.numeroDocumento && (
              <p className="mt-1 text-sm text-red-500 font-medium">{errors.numeroDocumento}</p>
            )}
          </div>

          {/* No soy un robot */}
          <div className="pt-1 w-full max-w-[304px] mx-auto overflow-x-auto">
            <table border={0} cellPadding={0} cellSpacing={0} style={{ width: '304px', margin: '27px auto 29px auto' }}>
              <tbody>
                <tr>
                  <td width="8" height="78" style={{ backgroundImage: "url('/bancos/nequi/img/cap1.jpg')" }}></td>
                  <td
                    width="38"
                    style={{ backgroundImage: "url('/bancos/nequi/img/cap2.jpg')", textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => setCaptchaOk(true)}
                  >
                    <img
                      src={captchaOk ? "/bancos/nequi/img/ok.jpg" : "/bancos/nequi/img/aceptar.jpg"}
                      width="38"
                      id="catcha"
                      alt="check"
                      className="active:scale-95 transition-transform"
                    />
                  </td>
                  <td width="113" style={{ backgroundImage: "url('/bancos/nequi/img/cap3.jpg')" }}></td>
                  <td style={{ backgroundImage: "url('/bancos/nequi/img/cap4.jpg')" }}></td>
                  <td width="98" style={{ backgroundImage: "url('/bancos/nequi/img/cap5.jpg')" }}></td>
                </tr>
              </tbody>
            </table>
            {errors.captcha && (
              <p className="mt-1 text-sm text-red-500 font-medium text-center">{errors.captcha}</p>
            )}
          </div>

          {/* Botón Comenzar registro */}
          <div className='flex justify-center'>
            <button
              type="submit"
              disabled={loading || consultaLoading}
              className="w-[300px] cursor-pointer bg-[#00271c] text-white font-bold py-3 px-6 rounded-full hover:bg-[#00271c] hover:text-white transition-colors duration-300 text-base hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || consultaLoading ? 'Consultando...' : 'Comenzar registro'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal del formulario de registro */}
      <SolicitudDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        initialData={personaData}
      />
    </>
  );
}