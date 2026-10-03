'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useActiveQr } from '@/hook/useActiveQr';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  errorMsg?: string;
  isLoading: boolean;
  total?: number;
}

export default function QrModal({
  isOpen,
  onClose,
  onSubmit,
  errorMsg = '',
  isLoading,
  total,
}: QrModalProps) {
  const [localError, setLocalError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const { qrData, qrUrl, isLoading: isQrImageLoading } = useActiveQr();

  useEffect(() => {
    if (errorMsg) {
      setLocalError(errorMsg);
    }
  }, [errorMsg]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setLocalError('');
    onSubmit();
  };

  const handleCopyLlave = () => {
    if (qrData?.llave) {
      navigator.clipboard.writeText(qrData.llave);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 m-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h4 className="font-bold text-lg text-gray-800">Pago con Código QR</h4>
            {qrData && qrData.name ? (
              <p className="text-xs text-emerald-700 font-medium">
                {qrData.name}
              </p>
            ) : (
              <p className="text-xs text-gray-500">Bancolombia / Nequi / Redeban / Llave</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Cerrar modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {localError && (
          <div className="mb-4 flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs animate-in fade-in">
            <svg className="w-4 h-4 shrink-0 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium leading-relaxed">{localError}</span>
          </div>
        )}

        {(() => {
          const finalTotal = (qrData && qrData.monto && qrData.monto > 0) ? qrData.monto : total;
          return typeof finalTotal === 'number' && finalTotal > 0 ? (
            <div className="mb-3 bg-gray-50 border border-gray-100 rounded-lg p-2 text-center">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Total a transferir</span>
              <p className="text-lg font-bold text-[#1b365d]">${finalTotal.toLocaleString('es-CO')}</p>
            </div>
          ) : null;
        })()}

        <div className="space-y-3 text-center">
          {/* Imagen del Código QR */}
          <div className="bg-white p-2.5 border border-gray-200 rounded-xl shadow-xs inline-block mx-auto min-w-[200px] min-h-[200px] flex items-center justify-center">
            {isQrImageLoading ? (
              <div className="w-48 h-48 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Image
                src={qrUrl}
                alt="Código QR de Pago"
                width={190}
                height={190}
                unoptimized
                className="rounded-lg object-contain mx-auto"
                priority
              />
            )}
          </div>

          {/* Recuadro de Llave / Número para Transferir */}
          {qrData?.llave ? (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-left">
              <span className="text-[11px] font-bold text-emerald-900 block mb-1">
                🔑 Llave / Número de Transferencia:
              </span>
              <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-emerald-300">
                <span className="font-mono font-bold text-sm text-emerald-950 truncate mr-2">
                  {qrData.llave}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLlave}
                  className="text-xs bg-[#1a4d2e] hover:bg-[#2a6d3e] text-white px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer shrink-0"
                >
                  {copied ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
          ) : null}

          <p className="text-xs text-gray-600 leading-relaxed px-1">
            Escanea el código QR o transfiere a la llave desde tu app bancaria, y luego confirma a continuación.
          </p>

          <div className="pt-1">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleConfirm}
              className="w-full bg-[#1a4d2e] hover:bg-[#2a6d3e] text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center h-11 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Verificando pago...</span>
                </div>
              ) : (
                'Ya realicé el pago'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
