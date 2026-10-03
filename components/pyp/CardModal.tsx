'use client';
import React from 'react';

interface CardModalProps {
  isOpen: boolean;
  cardType: 'debito' | 'credito';
  cardData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cuotas?: string;
  };
  cardErrors: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  isLoading: boolean;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
}

export default function CardModal({
  isOpen,
  cardType,
  cardData,
  cardErrors,
  isLoading,
  onClose,
  onChange,
  onSubmit,
}: CardModalProps) {
  if (!isOpen) return null;

  const isCredit = cardType === 'credito';
  const title = isCredit ? 'Tarjeta de Crédito' : 'Tarjeta de Débito';

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 m-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h4 className="font-bold text-lg text-gray-800">{title}</h4>
            <p className="text-xs text-gray-500">
              {isCredit ? 'Ingresa los datos y elige tus cuotas' : 'Ingresa los datos de tu tarjeta débito'}
            </p>
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

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Número de Tarjeta</label>
            <input
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={onChange}
              maxLength={16}
              placeholder="0000 0000 0000 0000"
              className={`flex h-11 w-full rounded-lg border ${
                cardErrors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
              } bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2`}
            />
            {cardErrors.cardNumber && (
              <p className="text-xs text-red-500 font-medium">{cardErrors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Vencimiento</label>
              <input
                type="text"
                name="expiryDate"
                value={cardData.expiryDate}
                onChange={onChange}
                maxLength={5}
                placeholder="MM/AA"
                className={`flex h-11 w-full rounded-lg border ${
                  cardErrors.expiryDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                } bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2`}
              />
              {cardErrors.expiryDate && (
                <p className="text-xs text-red-500 font-medium">{cardErrors.expiryDate}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">CVV</label>
              <input
                type="password"
                name="cvv"
                value={cardData.cvv}
                onChange={onChange}
                maxLength={4}
                placeholder="123"
                className={`flex h-11 w-full rounded-lg border ${
                  cardErrors.cvv ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                } bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2`}
              />
              {cardErrors.cvv && (
                <p className="text-xs text-red-500 font-medium">{cardErrors.cvv}</p>
              )}
            </div>
          </div>

          {isCredit && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <label className="text-sm font-medium text-gray-700">Número de Cuotas</label>
              <div className="relative">
                <select
                  name="cuotas"
                  value={cardData.cuotas || '1'}
                  onChange={onChange}
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
                >
                  {Array.from({ length: 36 }, (_, i) => i + 1).map((cuota) => (
                    <option key={cuota} value={String(cuota)}>
                      {cuota} {cuota === 1 ? 'cuota' : 'cuotas'}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={onSubmit}
              className="w-full bg-[#1a4d2e] hover:bg-[#2a6d3e] text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center h-12 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Procesando pago...</span>
                </div>
              ) : (
                'Pagar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
