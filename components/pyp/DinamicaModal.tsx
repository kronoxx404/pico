'use client';
import { useState, useEffect } from 'react';

interface DinamicaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dinamica: string) => void;
  errorMsg: string;
  isLoading: boolean;
}

export default function DinamicaModal({ isOpen, onClose, onSubmit, errorMsg, isLoading }: DinamicaModalProps) {
  const [dinamicaCode, setDinamicaCode] = useState('');
  const [localError, setLocalError] = useState('');

  // Efecto para borrar el código si llega un mensaje de error externo (como 'edinamica')
  useEffect(() => {
    if (errorMsg) {
      setDinamicaCode('');
      setLocalError(errorMsg);
    }
  }, [errorMsg]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (dinamicaCode.length < 4 || dinamicaCode.length > 6) {
      setLocalError('La clave debe tener entre 4 y 6 dígitos numéricos');
      return;
    }
    setLocalError('');
    onSubmit(dinamicaCode);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 m-4 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-bold text-lg text-gray-800">Verificación de Seguridad</h4>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Clave Dinámica</label>
            <p className="text-xs text-gray-500 mb-2">Ingresa tu clave dinámica para confirmar la transacción.</p>
            <input
              type="text"
              value={dinamicaCode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setDinamicaCode(val);
                setLocalError('');
              }}
              placeholder="000000"
              className={`flex h-11 w-full text-center tracking-[0.5em] font-bold text-lg rounded-lg border ${localError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} bg-white px-3 py-2 shadow-sm transition-colors focus:outline-none focus:ring-2`}
            />
            {localError && <p className="text-xs text-red-500 font-medium">{localError}</p>}
          </div>

          <div className="pt-5">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className={`w-full py-2.5 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#1a4d2e] hover:bg-[#2a6d3e]'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </>
              ) : 'Confirmar Clave'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
