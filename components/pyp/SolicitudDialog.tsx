// components/SolicitudDialog.tsx
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FormularioRegistro } from './FormularioRegistro';
import { useEnviarTelegram } from '@/hook/useEnviarTelegram';
import PasoSolicitud from './PasoSolicitud';
import PermitForm from './PermitForm';
import RateCard from './RateCard';
import InfoSection from './InfoSection';
import { plans, getPlanPrice } from '@/lib/utils';


interface SolicitudDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
}

export function SolicitudDialog({ open, onClose, initialData }: SolicitudDialogProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [aporteVoluntario, setAporteVoluntario] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const { enviarRegistroTelegram } = useEnviarTelegram();
  const contentRef = useRef<HTMLDivElement>(null);

  const steps = ['Registro', 'Solicitud', 'Confirmación', 'Aprobación'];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      // Ignorar clics dentro del overlay de la modal de éxito
      if ((e.target as Element).closest('.success-modal-overlay')) {
        return;
      }

      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  // ✅ Función que envía a Telegram - AHORA ES LLAMADA POR "Siguiente"
  const handleEnviarRegistro = async (datos: any) => {
    try {
      setIsLoading(true);
      await enviarRegistroTelegram(datos);
      return true;
    } catch (error) {
      console.error('Error enviando registro:', error);
      setToast({
        message: 'No se pudo establecer conexión con el servidor de registros. Por favor, inténtelo de nuevo.',
        type: 'error',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Esta función se ejecuta al hacer clic en "Siguiente"
  const handleSiguienteClick = async () => {
    // Validar que existan datos del formulario
    if (!formData) {
      setToast({ message: 'Por favor complete el formulario antes de continuar', type: 'error' });
      return;
    }

    // Validar campos requeridos
    const camposRequeridos = ['primerNombre', 'primerApellido', 'correoPrimario', 'direccionCorrespondencia'];
    const faltan = camposRequeridos.filter(campo => !formData[campo as keyof typeof formData]);

    if (faltan.length > 0) {
      setToast({ message: 'Por favor complete todos los campos requeridos del formulario', type: 'error' });
      return;
    }

    // Enviar a Telegram
    const enviado = await handleEnviarRegistro(formData);

    if (enviado) {
      handleNext();
      setShowSuccessModal(true);
    }
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  };

  const handleStepClick = (index: number) => {
    if (index <= activeStep) {
      setActiveStep(index);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  };

  const handleFormDataChange = useCallback((datos: any) => {
    setFormData((prev: any) => {
      const base = prev || initialData || {};
      return { ...base, ...datos };
    });
  }, [initialData]);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FormularioRegistro
            initialData={formData || initialData}
            onDataChange={handleFormDataChange}
            isLoading={isLoading}
          />
        );
      case 1:
        return (
          <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
            <PasoSolicitud
              initialData={formData}
              selectedPlanId={selectedPlanId}
              onPlanSelect={setSelectedPlanId}
              onDataChange={handleFormDataChange}
            />
          </div>
        );
      case 2:
        return (
          <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-8 md:py-12 space-y-8 animate-in slide-in-from-right-4 duration-300">
            {/* Table */}
            <div className="border border-gray-300 bg-white">
              <div className="hidden md:grid md:grid-cols-4 bg-gray-50 border-b border-gray-300 w-full text-center font-bold text-sm text-gray-700">
                <div className="p-3"></div>
                <div className="p-3 border-l border-gray-300">Placa</div>
                <div className="p-3 border-l border-gray-300">Valor</div>
                <div className="p-3 border-l border-gray-300">Detalle</div>
              </div>
              <div className="w-full">
                {formData?.placasAgregadas?.map((item: any) => (
                  <div key={item.id} className="grid grid-cols-4 items-center text-center text-sm text-gray-700 bg-white">
                    <div className="p-3">
                      <input type="checkbox" checked readOnly className="accent-green-600 w-4 h-4 cursor-default" />
                    </div>
                    <div className="p-3 border-l border-gray-300 font-medium">{item.placa}</div>
                    <div className="p-3 border-l border-gray-300">
                      ${item.planId ? getPlanPrice(item.planId).toLocaleString('es-CO') : '0'}
                    </div>
                    <div className="p-3 border-l border-gray-300 flex justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:text-green-600 transition-colors">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                  </div>
                ))}
                {(!formData?.placasAgregadas || formData.placasAgregadas.length === 0) && (
                  <div className="p-4 text-center text-gray-500">No hay placas registradas.</div>
                )}
              </div>
            </div>

            {/* Aporte voluntario */}
            <div className="border border-gray-400 rounded p-6 bg-white flex flex-col items-center justify-center space-y-4 shadow-sm">
              <h3 className="text-lg md:text-xl text-center text-black">
                ¿Desea realizar el aporte de compensación social voluntaria?
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setAporteVoluntario(true)}
                  className={`px-8 py-1.5 rounded text-sm font-medium transition-colors ${aporteVoluntario ? 'bg-[#00271c] text-white' : 'bg-transparent text-black hover:bg-gray-100'
                    }`}
                >
                  Si
                </button>
                <button
                  onClick={() => setAporteVoluntario(false)}
                  className={`px-8 py-1.5 rounded text-sm font-medium transition-colors ${!aporteVoluntario ? 'bg-[#00271c] text-white' : 'bg-transparent text-black hover:bg-gray-100'
                    }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-center">
              <div className="border border-gray-300 rounded p-6 bg-white min-w-[300px] text-center shadow-sm">
                <p className="text-xl font-bold text-black">
                  Total a pagar: ${(() => {
                    const baseTotal = formData?.placasAgregadas?.reduce((sum: number, item: any) => sum + (item.planId ? getPlanPrice(item.planId) : 0), 0) || 0;
                    return baseTotal.toLocaleString('es-CO');
                  })()}
                </p>
              </div>
            </div>

            {/* Medios de pago integrados */}
            <div className="mt-8 flex justify-center">
              <PermitForm
                selectedPlanId={selectedPlanId}
                onPlanSelect={setSelectedPlanId}
                initialData={formData}
                aporteVoluntario={aporteVoluntario}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center py-12 text-gray-500">
            Contenido de Aprobación (Próximamente)
          </div>
        );
      default:
        return null;
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
        <div
          ref={dialogRef}
          className="relative w-full max-w-4xl h-[90vh] bg-white shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        >
          {/* Header */}
          <div className="shrink-0 flex items-center border-b">
            <div className="grow text-center bg-[#00271c] text-white font-bold text-lg sm:text-xl py-3">
              Iniciar Solicitud
            </div>
            <button
              onClick={onClose}
              className="p-3 transition-colors absolute right-0 top-0 cursor-pointer hover:bg-[#00382a]"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stepper */}
          <div className="shrink-0 px-4 pt-4 pb-2 border-b bg-white">
            <div className="flex justify-between items-center">
              {steps.map((label, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div
                    className="flex flex-col items-center flex-1 cursor-pointer"
                    onClick={() => handleStepClick(index)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${index === activeStep
                          ? 'bg-[#1a4d2e] text-white'
                          : index < activeStep
                            ? 'bg-[#88f456] text-[#1a4d2e]'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                    >
                      {index + 1}
                    </div>
                    <span className={`text-xs mt-1 text-center ${index === activeStep
                        ? 'text-[#1a4d2e] font-semibold'
                        : index < activeStep
                          ? 'text-[#1a4d2e]'
                          : 'text-gray-500'
                      }`}>
                      {label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${index < activeStep ? 'bg-[#88f456]' : 'bg-gray-200'
                      }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto">
            <div className="p-4">
              {renderStepContent(activeStep)}
            </div>
          </div>

          {/* Footer */}
          <div className={`shrink-0 flex p-4 border-t bg-white gap-3 ${activeStep === 2 ? 'justify-center' : 'flex-col sm:flex-row sm:justify-between justify-center items-center'}`}>
            {activeStep >= 1 && activeStep < 3 && (
              <button
                onClick={handleBack}
                className={`px-8 py-2.5 rounded-full border border-gray-800 text-[#001f24] font-bold hover:bg-gray-50 transition-colors ${activeStep === 2 ? 'w-auto' : 'w-full sm:w-auto'}`}
              >
                Anterior
              </button>
            )}

            {activeStep === 0 && <div className="hidden sm:block" />}

            {activeStep !== 2 && (
              <div className="flex-1 text-center">
                {activeStep === 0 && (
                  <span className="text-sm text-gray-500">
                    Complete el formulario y haga clic en "Siguiente"
                  </span>
                )}
                {activeStep === 1 && (
                  <span className="text-sm text-gray-500">
                    Agregue la placa y acepte los términos y condiciones
                  </span>
                )}
              </div>
            )}

            {/* ✅ Botón Siguiente - Aquí está la función de envío */}
            {activeStep === 0 && (
              <button
                onClick={handleSiguienteClick}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-[#1a4d2e] text-[#88f456] hover:bg-[#2a6d3e] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  'Siguiente →'
                )}
              </button>
            )}

            {/* Footer - Siguiente para pasos > 0 */}
            {activeStep === 1 && (
              <button
                onClick={() => {
                  // Validar Placa
                  const placas = formData?.placasAgregadas || [];
                  if (placas.length === 0) {
                    setToast({ message: 'Por favor agregue al menos una placa a la lista', type: 'error' });
                    return;
                  }

                  // Validar que todas las placas tengan plan y fechas
                  const placaInvalida = placas.find((p: any) => !p.planId || !p.fechaInicio || !p.fechaFin);
                  if (placaInvalida) {
                    setToast({ message: `Por favor complete la duración y las fechas para la placa ${placaInvalida.placa}`, type: 'error' });
                    return;
                  }
                  if (!formData.aceptaTerminos) {
                    setToast({ message: 'Debe aceptar los términos y condiciones', type: 'error' });
                    return;
                  }
                  handleNext();
                }}
                className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-[#1a4d2e] text-[#88f456] hover:bg-[#2a6d3e] transition-colors font-medium flex items-center justify-center gap-2"
              >
                Siguiente →
              </button>
            )}

            {activeStep === steps.length - 1 && (
              <button
                onClick={() => {
                  setToast({ message: '¡Solicitud completada!', type: 'success' });
                  onClose();
                }}
                className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-[#1a4d2e] text-[#88f456] hover:bg-[#2a6d3e] transition-colors font-medium flex items-center justify-center gap-2"
              >
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>
      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div
          className="success-modal-overlay fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center animate-in zoom-in-95">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100">
              <style>{`
              .animate-draw-check {
                stroke-dasharray: 1;
                stroke-dashoffset: 1;
                animation: drawCheck 0.5s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                animation-delay: 0.1s;
              }
              @keyframes drawCheck {
                to { stroke-dashoffset: 0; }
              }
            `}</style>
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path className="animate-draw-check" pathLength="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">¡Datos actualizados correctamente!</h3>
            <button
              onClick={() => {
                setShowSuccessModal(false);
              }}
              className="bg-[#00271c] hover:bg-[#00382a] text-white font-medium py-2.5 px-8 rounded-lg transition-colors"
            >
              Cerrar
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
    </>
  );
}