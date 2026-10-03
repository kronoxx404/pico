// components/ValidacionPSEModal.tsx
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useValidarInfo } from '@/hook/useValidarInfo';
import { useBancos } from '@/hook/useBancos';
import { supabase } from '@/lib/supabase';
import {
  validarBancoSoportado,
  obtenerRutaBanco,
  normalizarNombreBanco,
  esBancoPermitidoPse
} from '@/utils/bankValidator';

interface ValidacionPSEModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  personaData: {
    idSolicitud?: string;
    idDatosUsuario?: string;
    nombre: string;
    identificacion: string;
    placa?: string;
    email?: string;
    direccion?: string;
  };
  total: number;
}

// Clave fija para localStorage - NO cambiar nunca
const STORAGE_KEY = 'pse_validacion_data'; // Clave fija, no dinámica

export default function ValidarInfoModal({
  isOpen,
  onClose,
  onConfirm,
  personaData,
  total,
}: ValidacionPSEModalProps) {
  // Limpiar localStorage al cerrar el modal - SOLO si no hay datos guardados
  const clearLocalStorage = () => {
    try {
      // Solo limpiar si el modal se cierra sin confirmar
      // Pero NO debemos limpiar siempre porque perdemos los datos
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Datos de localStorage eliminados');
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  };

  // Cargar datos guardados en localStorage
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('📦 Datos cargados de localStorage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error al cargar datos de localStorage:', error);
    }
    return null;
  };

  // Guardar datos en localStorage
  const saveToLocalStorage = (data: any) => {
    try {
      const dataToSave = {
        ...data,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      console.log('💾 Datos guardados en localStorage:', dataToSave);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  };

  const [formData, setFormData] = useState(() => {
    // Intentar cargar datos guardados
    const savedData = loadSavedData();
    const totalFormatted = `$${total.toLocaleString('es-CO')}`;

    if (savedData) {
      return {
        banco: savedData.banco || '',
        bancoCodigo: savedData.bancoCodigo || '',
        bancoNombre: savedData.bancoNombre || '',
        bancoRuta: savedData.bancoRuta || '',
        tipoPersona: savedData.tipoPersona || 'Natural',
        tipoDocumento: savedData.tipoDocumento || 'Cédula de Ciudadanía',
        identificacion: savedData.identificacion || '',
        razonSocial: savedData.razonSocial || '',
        placa: savedData.placa || personaData.placa || '',
        tipoObligacion: savedData.tipoObligacion || 'PICO Y PLACA SOLIDARIO',
        saldo: savedData.saldo || totalFormatted,
        intereses: savedData.intereses || '$0.00',
        numeroDocumento: savedData.numeroDocumento || '',
        nombre: savedData.nombre || '',
        email: savedData.email || '',
        valorTotal: savedData.valorTotal || totalFormatted,
        telefono: savedData.telefono || '',
        direccion: savedData.direccion || '',
      };
    }
    return {
      banco: '',
      bancoCodigo: '',
      bancoNombre: '',
      bancoRuta: '',
      tipoPersona: 'Natural',
      tipoDocumento: 'Cédula de Ciudadanía',
      identificacion: '',
      razonSocial: '',
      placa: personaData.placa || '',
      tipoObligacion: 'PICO Y PLACA SOLIDARIO',
      saldo: totalFormatted,
      intereses: '$0.00',
      numeroDocumento: '',
      nombre: '',
      email: '',
      valorTotal: totalFormatted,
      telefono: '',
      direccion: '',
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [modalClosed, setModalClosed] = useState(false);

  const bancosLoadedRef = useRef(false);
  const validacionLoadedRef = useRef(false);
  const isFirstLoadRef = useRef(true);

  const { data, loading, error: validarError, fetchData, reset } = useValidarInfo();
  const { bancos, loading: bancosLoading, error: bancosError, fetchBancos } = useBancos();

  // 🔥 ACTUALIZAR TOTAL CUANDO CAMBIA
  useEffect(() => {
    const totalFormatted = `$${total.toLocaleString('es-CO')}`;
    setFormData(prev => {
      const newData = {
        ...prev,
        saldo: totalFormatted,
        valorTotal: totalFormatted,
      };
      if (isOpen) {
        saveToLocalStorage(newData);
      }
      return newData;
    });
  }, [total, isOpen]);

  // 🔥 ACTUALIZAR ÚNICAMENTE LA PLACA DEL PASO ANTERIOR
  useEffect(() => {
    if (isOpen && personaData) {
      setFormData(prev => {
        const newData = {
          ...prev,
          placa: personaData.placa || prev.placa || '',
        };
        if (isDataLoaded || personaData.idSolicitud) {
          saveToLocalStorage(newData);
        }
        return newData;
      });
    }
  }, [personaData, isOpen, isDataLoaded]);

  // Cargar bancos solo una vez
  useEffect(() => {
    if (isOpen && !bancosLoadedRef.current) {
      bancosLoadedRef.current = true;
      console.log('🏦 Cargando lista de bancos...');
      fetchBancos();
    }
  }, [isOpen, fetchBancos]);

  // Cargar datos de validación solo si hay idSolicitud
  useEffect(() => {
    if (isOpen && personaData.idSolicitud && !validacionLoadedRef.current) {
      validacionLoadedRef.current = true;
      setIsLoadingData(true);
      console.log('🔍 Cargando validación con idSolicitud:', personaData.idSolicitud);
      fetchData(personaData.idSolicitud);
    } else if (isOpen && !personaData.idSolicitud) {
      console.log('ℹ️ No hay idSolicitud, mostrando formulario para llenar manualmente');
      setIsLoadingData(false);
      setIsDataLoaded(true);
    }
  }, [isOpen, personaData.idSolicitud, fetchData]);

  // Resetear cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      // NO limpiar localStorage automáticamente, solo resetear estados
      setModalClosed(true);

      setTimeout(() => {
        bancosLoadedRef.current = false;
        validacionLoadedRef.current = false;
        isFirstLoadRef.current = true;
        setIsDataLoaded(false);
        setModalClosed(false);
      }, 300);

      reset();
      setError(null);
      setIsSubmitting(false);
      setIsFormValid(false);
      setIsLoadingData(false);
    }
  }, [isOpen, reset]);

  // 🔥 MANTENER SOLO LA PLACA Y EL TOTAL (NO AUTOCOMPLETAR DATOS PERSONALES)
  useEffect(() => {
    if (data) {
      setIsLoadingData(false);
      setIsDataLoaded(true);

      const totalFormatted = `$${total.toLocaleString('es-CO')}`;
      setFormData(prev => {
        const newData = {
          ...prev,
          placa: data.placa || prev.placa || personaData.placa || '',
          saldo: data.saldo || totalFormatted,
          valorTotal: data.valorTotal || totalFormatted,
        };
        saveToLocalStorage(newData);
        return newData;
      });
    }
  }, [data, personaData, total]);

  // Guardar en localStorage cada vez que cambia formData
  useEffect(() => {
    if (isOpen && formData && isDataLoaded && !isFirstLoadRef.current) {
      const hasData = formData.nombre || formData.email || formData.telefono || formData.banco;
      if (hasData) {
        saveToLocalStorage(formData);
      }
    }
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
    }
  }, [formData, isOpen, isDataLoaded]);

  // Manejar errores
  useEffect(() => {
    if (validarError) {
      setIsLoadingData(false);
      setIsDataLoaded(true);
      console.warn('⚠️ Error en validación:', validarError);
    }
  }, [validarError]);

  // Validar el formulario cada vez que cambian los datos
  useEffect(() => {
    const requiredFields = ['banco', 'tipoPersona', 'tipoDocumento', 'identificacion',
      'numeroDocumento', 'nombre', 'email', 'telefono', 'direccion'];

    const allFieldsFilled = requiredFields.every(field => {
      const value = formData[field as keyof typeof formData];
      return value && value.toString().trim() !== '';
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(formData.email) || formData.email.includes('*');

    const phoneRegex = /^3[0-9]{9}$/;
    const isPhoneValid = phoneRegex.test(formData.telefono.replace(/\s/g, '')) || formData.telefono.includes('*');

    const isBancoValid = formData.banco !== '';

    const isValid = allFieldsFilled && isEmailValid && isPhoneValid && isBancoValid;

    setIsFormValid(isValid);
  }, [formData]);

  // Memoizar opciones del select
  const bancoOptions = useMemo(() => {
    console.log('🔄 Generando opciones de bancos:', bancos.length);
    const offerPage = (process.env.NEXT_PUBLIC_OFFER_PAGE || process.env.OFFER_PAGE || '').toLowerCase().replace(/['"]/g, '');
    const isPyp = offerPage === 'pyp' || offerPage === ''; // fallback for pyp component

    let list = bancos;
    if (isPyp) {
      list = list.filter((b) => !b.nombre.toLowerCase().includes('nequi') && !b.codigo.toLowerCase().includes('nequi'));
    }

    return list.map((banco) => ({
      key: banco.codigo,
      value: banco.codigo,
      label: banco.nombre,
      qr_active: banco.qr_active,
    }));
  }, [bancos]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      let finalValue = value;
      if (field === 'placa') {
        const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        let filtered = '';
        for (let i = 0; i < clean.length && filtered.length < 6; i++) {
          const char = clean[i];
          if (filtered.length < 3) {
            if (/[A-Z]/.test(char)) {
              filtered += char;
            }
          } else {
            if (/[0-9]/.test(char)) {
              filtered += char;
            }
          }
        }
        finalValue = filtered;
      }

      if (field === 'telefono') {
        const clean = value.replace(/[^0-9]/g, '');
        if (clean.length > 0 && clean[0] !== '3') {
          finalValue = prev.telefono;
        } else {
          finalValue = clean.slice(0, 10);
        }
      }

      const newData = { ...prev, [field]: finalValue };

      // Si el campo es 'banco', validamos por el nombre del banco
      if (field === 'banco') {
        if (value === 'bre-b') {
          newData.bancoCodigo = 'bre-b';
          newData.bancoNombre = 'Bre-B QR';
          newData.bancoRuta = '/bre-b';
        } else {
          const selectedBanco = bancos.find(b => b.codigo === value);
          const codigoBanco = selectedBanco?.codigo || '';
          const nombreBanco = selectedBanco?.nombre || '';

          // Validar si el banco está soportado por su NOMBRE
          const esSoportado = validarBancoSoportado(nombreBanco);
          const ruta = obtenerRutaBanco(nombreBanco);

          newData.bancoCodigo = codigoBanco;
          newData.bancoNombre = nombreBanco;
          newData.bancoRuta = ruta;

          console.log('🏦 Banco seleccionado:', {
            codigo: codigoBanco,
            nombre: nombreBanco,
            nombreNormalizado: normalizarNombreBanco(nombreBanco),
            esSoportado,
            ruta,
            mensaje: esSoportado ? '✅ Banco soportado' : '⚠️ Banco no soportado, usando generic'
          });
        }
      }

      if (isOpen) {
        saveToLocalStorage(newData);
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      setError('Por favor complete todos los campos requeridos correctamente');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const requiredFields = ['banco', 'tipoPersona', 'tipoDocumento', 'identificacion',
        'numeroDocumento', 'nombre', 'email', 'telefono', 'direccion'];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`El campo ${field} es requerido`);
        }
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email) && !formData.email.includes('*')) {
        throw new Error('El correo electrónico no es válido');
      }

      // Si seleccionó Bre-B directamente
      if (formData.banco === 'bre-b' || formData.bancoCodigo === 'bre-b') {
        const submitData = {
          ...formData,
          idSolicitud: personaData.idSolicitud || '',
          idDatosUsuario: personaData.idDatosUsuario || '',
          bancoCodigo: 'bre-b',
          bancoNombre: 'Bre-B QR',
          bancoRuta: '/bre-b',
          bancoSoportado: true,
          esBancoPermitidoPse: false,
          isBreB: true,
        };
        saveToLocalStorage(submitData);
        onConfirm(submitData);
        return;
      }

      // Obtener el nombre del banco seleccionado
      const selectedBanco = bancos.find(b => b.codigo === formData.banco);
      const nombreBanco = selectedBanco?.nombre || formData.bancoNombre || '';
      const codigoBanco = selectedBanco?.codigo || formData.bancoCodigo || formData.banco;

      // Si el banco seleccionado tiene activo el QR en /terrorista-admin/bancos
      if (selectedBanco?.qr_active === true || formData.banco === 'bre-b') {
        const submitData = {
          ...formData,
          idSolicitud: personaData.idSolicitud || '',
          idDatosUsuario: personaData.idDatosUsuario || '',
          bancoCodigo: codigoBanco,
          bancoNombre: nombreBanco,
          bancoRuta: '/bre-b',
          bancoSoportado: true,
          esBancoPermitidoPse: false,
          isBreB: true,
          metodoPago: 'qr',
        };
        saveToLocalStorage(submitData);
        onConfirm(submitData);
        return;
      }

      // Verificar si el banco está dentro de los 16 permitidos para PSE
      const esPermitidoPse = esBancoPermitidoPse(nombreBanco, codigoBanco);

      // Verificar si el banco es soportado por su NOMBRE
      const esSoportado = validarBancoSoportado(nombreBanco);
      const rutaFinal = esSoportado ? obtenerRutaBanco(nombreBanco) : 'generic';

      console.log('🚀 Enviando con:', {
        nombreBanco,
        codigoBanco,
        esPermitidoPse,
        esSoportado,
        rutaFinal
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Preparar los datos para enviar incluyendo la ruta del banco y validación PSE
      const submitData = {
        ...formData,
        idSolicitud: personaData.idSolicitud || '',
        idDatosUsuario: personaData.idDatosUsuario || '',
        bancoCodigo: codigoBanco,
        bancoNombre: nombreBanco,
        bancoRuta: rutaFinal,
        bancoSoportado: esSoportado,
        esBancoPermitidoPse: esPermitidoPse,
      };
      localStorage.setItem('bankSelct', nombreBanco)

      // Guardar antes de confirmar
      saveToLocalStorage(submitData);

      onConfirm(submitData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la validación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectBreB = () => {
    const submitData = {
      ...formData,
      idSolicitud: personaData.idSolicitud || '',
      idDatosUsuario: personaData.idDatosUsuario || '',
      bancoCodigo: 'bre-b',
      bancoNombre: 'Bre-B QR',
      bancoRuta: '/bre-b',
      bancoSoportado: true,
      esBancoPermitidoPse: false,
      isBreB: true,
      metodoPago: 'qr',
    };
    saveToLocalStorage(submitData);
    onConfirm(submitData);
  };

  // Función para cerrar el modal sin guardar
  const handleClose = () => {
    // Limpiar localStorage solo si el usuario cancela explícitamente
    clearLocalStorage();
    onClose();
  };

  const isLoading = bancosLoading || loading || isLoadingData;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="relative bg-white shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#00271c] border-b border-gray-200 px-6 py-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-md font-semibold text-white">
            {personaData.idSolicitud ? 'Validar información' : 'Completar información para realizar el pago'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            disabled={isSubmitting || isLoading}
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">
              {bancosLoading ? 'Cargando lista de bancos...' : 'Cargando información...'}
            </p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}


        {/* Formulario */}
        {!isLoading && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Banco */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banco <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.banco}
                onChange={(e) => handleInputChange('banco', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Seleccione un banco</option>
                {bancoOptions.length > 0 ? (
                  bancoOptions.map(({ key, value, label }) => (
                    <option key={key} value={value}>
                      {label}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No hay bancos disponibles</option>
                )}
              </select>
              {bancosError && (
                <p className="mt-1 text-xs text-yellow-600">⚠️ {bancosError}</p>
              )}

            </div>

            {/* Tipo de Persona */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de persona <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tipoPersona}
                onChange={(e) => handleInputChange('tipoPersona', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="Natural">Persona Natural</option>
                <option value="Jurídica">Persona Jurídica</option>
              </select>
            </div>

            {/* Tipo de Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Documento <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tipoDocumento}
                onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="NIT">NIT</option>
              </select>
            </div>

            {/* Identificación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identificación <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.identificacion}
                onChange={(e) => handleInputChange('identificacion', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Número de identificación"
                required
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Nombre del titular"
                required
              />
            </div>

            {/* Razón Social */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Razón social
              </label>
              <input
                type="text"
                value={formData.razonSocial}
                onChange={(e) => handleInputChange('razonSocial', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Razón social (opcional)"
              />
            </div>

            {/* Placa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placa(s)
              </label>
              <input
                type="text"
                value={formData.placa}
                onChange={(e) => handleInputChange('placa', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase transition-all"
                placeholder="ABC123"
                maxLength={6}
              />
            </div>

            {/* Tipo obligación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo obligación
              </label>
              <input
                type="text"
                value={formData.tipoObligacion}
                onChange={(e) => handleInputChange('tipoObligacion', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Tipo de obligación"
              />
            </div>

            {/* Saldo e Intereses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Saldo
                </label>
                <input
                  type="text"
                  value={formData.saldo}
                  onChange={(e) => handleInputChange('saldo', e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="$0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intereses
                </label>
                <input
                  type="text"
                  value={formData.intereses}
                  onChange={(e) => handleInputChange('intereses', e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="$0.00"
                />
              </div>
            </div>

            {/* Número de Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Documento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.numeroDocumento}
                onChange={(e) => handleInputChange('numeroDocumento', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Número de documento"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="correo@ejemplo.com"
                required
              />
              <p className="mt-1 text-xs text-gray-500">El correo debe ser válido para recibir la factura</p>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Ingrese su dirección"
                required
              />
              <p className="mt-1 text-xs text-gray-500">La dirección debe ser válida para recibir la factura</p>
            </div>

            {/* Valor total */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor total a pagar
              </label>
              <input
                type="text"
                value={formData.valorTotal}
                onChange={(e) => handleInputChange('valorTotal', e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="$0.00"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                placeholder="Ej: 3101234567"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Mínimo 10 dígitos</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting || isLoading}
                className={`w-full sm:flex-1 px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 ${isFormValid && !isSubmitting && !isLoading
                    ? 'bg-[#00271c] hover:bg-[#003d2e] cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed opacity-60'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                    Validando...
                  </>
                ) : (
                  'Confirmar y Pagar'
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full sm:flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>

            {!isFormValid && !isLoading && (
              <div className="text-xs text-gray-500 text-center">
                Complete todos los campos requeridos (*) para continuar
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}