import React, { useState, useEffect } from 'react';
import { plans } from '@/lib/utils';
import CustomDatePicker from './CustomDatePicker';

interface PasoSolicitudProps {
  initialData?: any;
  selectedPlanId?: any;
  onPlanSelect?: (planId: string) => void;
  onDataChange: (datos: any) => void;
}

interface PlacaAgregada {
  id: string;
  placa: string;
  planId: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
}

export default function PasoSolicitud({ initialData, selectedPlanId, onPlanSelect, onDataChange }: PasoSolicitudProps) {
  const [placa, setPlaca] = useState('');
  const [confirmarPlaca, setConfirmarPlaca] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(initialData?.aceptaTerminos || false);
  const [placasAgregadas, setPlacasAgregadas] = useState<PlacaAgregada[]>(
    initialData?.placasAgregadas || []
  );
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    onDataChange({
      placa: placasAgregadas.length > 0 ? placasAgregadas[0].placa : '',
      confirmarPlaca: placasAgregadas.length > 0 ? placasAgregadas[0].placa : '',
      aceptaTerminos,
      placasAgregadas
    });

    // Si hay placas agregadas, seleccionar automáticamente el plan de la primera para PermisoForm
    if (placasAgregadas.length > 0 && onPlanSelect) {
      if (placasAgregadas[0].planId && placasAgregadas[0].planId !== selectedPlanId) {
        onPlanSelect(placasAgregadas[0].planId);
      }
    }
  }, [placasAgregadas, aceptaTerminos, onDataChange, onPlanSelect, selectedPlanId]);

  const filterPlacaValue = (val: string): string => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
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
    return filtered;
  };

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = filterPlacaValue(e.target.value);
    setPlaca(value);
  };

  const handleConfirmarPlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = filterPlacaValue(e.target.value);
    setConfirmarPlaca(value);
  };

  const handleAgregarPlaca = () => {
    if (!placa || !confirmarPlaca) {
      setToast({ message: 'Por favor ingrese y confirme la placa', type: 'error' });
      return;
    }
    if (placa !== confirmarPlaca) {
      setToast({ message: 'Las placas no coinciden', type: 'error' });
      return;
    }
    if (placa.length !== 6) {
      setToast({ message: 'La placa debe tener exactamente 3 letras y 3 números', type: 'error' });
      return;
    }

    // Agregar la placa a la tabla
    const nuevaPlaca: PlacaAgregada = {
      id: Math.random().toString(36).substr(2, 9),
      placa: placa,
      planId: '',
      fechaInicio: null,
      fechaFin: null
    };

    setPlacasAgregadas([...placasAgregadas, nuevaPlaca]);
    setPlaca('');
    setConfirmarPlaca('');
  };

  const removerPlaca = (id: string) => {
    setPlacasAgregadas(placasAgregadas.filter(p => p.id !== id));
  };

  const updatePlaca = (id: string, field: keyof PlacaAgregada, value: any) => {
    setPlacasAgregadas(placasAgregadas.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-300 bg-white">
      <div className="border border-gray-400 p-6 pt-0 relative">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Columna Izquierda */}
          <div className="flex-1 pt-6 md:border-r border-gray-300 md:pr-6">
            <h3 className="text-sm font-bold text-black border-b border-gray-400 pb-1 mb-4 text-center">
              Agregar placa individual
            </h3>
            <div className="space-y-4 max-w-[350px] mx-auto">
              <div className="space-y-1">
                <label className="text-sm font-bold text-black block">
                  Placa <span className="text-red-500">*</span> :
                </label>
                <input
                  type="text"
                  value={placa}
                  onChange={handlePlacaChange}
                  className="w-full h-8 px-2 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-[#00271c] focus:border-[#00271c]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-black block">
                  Confirmar placa <span className="text-red-500">*</span> :
                </label>
                <input
                  type="text"
                  value={confirmarPlaca}
                  onChange={handleConfirmarPlacaChange}
                  className="w-full h-8 px-2 border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-[#00271c] focus:border-[#00271c]"
                />
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="flex-1 pt-6 md:pl-2">
            <h3 className="text-sm font-bold text-black border-b border-gray-400 pb-1 mb-4 text-center">
              Agrega placas mediante archivo (Formatos: CSV, XLS, XLSX)
            </h3>
            <div className="space-y-4 max-w-[350px] mx-auto">
              <p className="text-sm text-black">Información de las placas</p>
              <button
                type="button"
                className="border border-gray-500 rounded-full px-6 py-1 text-sm font-bold text-black hover:bg-gray-50 w-full"
              >
                Seleccionar archivo
              </button>
              <div className="pt-2 text-center">
                <a href="#" className="text-sm text-[#00271c] underline underline-offset-2 hover:text-[#004733]">
                  Descargar plantilla
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Botón Central Flotante */}
        <div className="flex justify-center mt-8 mb-6">
          <button
            type="button"
            onClick={handleAgregarPlaca}
            className="bg-[#00271c] text-white px-8 py-2 rounded-full font-bold text-sm hover:bg-[#003d2b] transition-colors"
          >
            Agregar placa
          </button>
        </div>

        {/* Tabla de Placas Agregadas */}
        {placasAgregadas.length > 0 && (
          <div className="mb-6 overflow-visible w-full">
            {/* Cabecera Desktop */}
            <div className="hidden md:grid md:grid-cols-5 bg-gray-50 border border-gray-200 border-b-0 w-full">
              <div className="p-3 text-sm font-bold text-gray-700 text-left">Placa</div>
              <div className="p-3 text-sm font-bold text-gray-700 text-left">Duración</div>
              <div className="p-3 text-sm font-bold text-gray-700 text-left">Fecha Inicio</div>
              <div className="p-3 text-sm font-bold text-gray-700 text-left">Fecha Fin</div>
              <div className="p-3 text-sm font-bold text-gray-700 text-center">Acciones</div>
            </div>

            {/* Filas */}
            <div className="w-full">
              {placasAgregadas.map((item) => (
                <div key={item.id} className="flex flex-col md:grid md:grid-cols-5 border border-gray-300 md:border-gray-200 bg-white mb-4 md:mb-0 rounded-lg md:rounded-none md:border-t-0 shadow-sm md:shadow-none w-full">

                  {/* Placa */}
                  <div className="p-3 text-sm text-gray-700 font-medium border-b md:border-none bg-gray-50 md:bg-transparent flex justify-between items-center md:block rounded-t-lg md:rounded-none">
                    <span className="md:hidden font-bold">Placa:</span>
                    <span>{item.placa}</span>
                  </div>

                  {/* Duración */}
                  <div className="p-3 border-b md:border-none flex flex-col md:block">
                    <span className="md:hidden font-bold text-sm text-gray-700 mb-1">Duración:</span>
                    <select
                      value={item.planId}
                      onChange={(e) => updatePlaca(item.id, 'planId', e.target.value)}
                      className="w-full h-8 px-2 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-[#1a4d2e] focus:border-[#1a4d2e] bg-white text-sm"
                      required
                    >
                      <option value="" disabled></option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>{plan.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fecha Inicio */}
                  <div className="p-3 border-b md:border-none flex flex-col md:block">
                    <span className="md:hidden font-bold text-sm text-gray-700 mb-1">Fecha Inicio:</span>
                    <CustomDatePicker
                      selectedDate={item.fechaInicio}
                      onChange={(date) => updatePlaca(item.id, 'fechaInicio', date)}
                    />
                  </div>

                  {/* Fecha Fin */}
                  <div className="p-3 border-b md:border-none flex flex-col md:block">
                    <span className="md:hidden font-bold text-sm text-gray-700 mb-1">Fecha Fin:</span>
                    <CustomDatePicker
                      selectedDate={item.fechaFin}
                      minDate={item.fechaInicio}
                      onChange={(date) => updatePlaca(item.id, 'fechaFin', date)}
                    />
                  </div>

                  {/* Acciones */}
                  <div className="p-3 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removerPlaca(item.id)}
                      className="w-full md:w-auto bg-red-500 text-white px-4 py-1.5 rounded font-medium text-sm hover:bg-red-600 transition-colors"
                    >
                      Remover
                    </button>
                  </div>

                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4 items-center gap-2 text-sm text-gray-700 font-medium">
              Mostrar:
              <select className="border border-gray-300 rounded px-2 py-1 bg-white">
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>
              <div className="flex items-center ml-2">
                <button className="px-2 hover:bg-gray-100 rounded">&lt;</button>
                <span className="px-2">1</span>
                <button className="px-2 hover:bg-gray-100 rounded">&gt;</button>
              </div>
            </div>
          </div>
        )}

        <div className="bottom-0 bg-white z-40 pt-4 pb-4 border-t border-gray-300 flex items-start gap-3 mt-8 shadow-[0_-4px_6px_-4px_rgba(0,0,0,0.1)] -mx-6 px-6">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
            className="mt-1 w-3.5 h-3.5 text-[#00271c] bg-white border-gray-400 rounded focus:ring-[#00271c] cursor-pointer"
          />
          <label className="text-[13px] text-black leading-tight cursor-pointer" onClick={() => setAceptaTerminos(!aceptaTerminos)}>
            Al marcar esta casilla te comprometes a cumplir con los Términos y Condiciones de la presente medida, declarando el entendimiento y deberes que esto implica. <span className="font-bold">Ver Términos y condiciones de uso de la plataforma de Pico y Placa Solidario.</span>
          </label>
        </div>
      </div>

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
          <div className="backdrop-blur-md bg-red-600/90 border border-red-500/20 text-white p-4 rounded-xl shadow-2xl flex items-center space-x-3.5 max-w-sm ring-1 ring-red-500/30">
            <div className="bg-white/20 p-2 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-white">Aviso</h4>
              <p className="text-xs text-red-100/90 mt-0.5">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
