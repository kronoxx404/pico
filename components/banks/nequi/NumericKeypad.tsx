"use client";
import React from 'react';

interface NumericKeypadProps {
  onNumberClick: (num: string) => void;
  onDelete: () => void;
  showForgotLink?: boolean;
}

const NumericKeypad = ({ onNumberClick, onDelete, showForgotLink = false }: NumericKeypadProps) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="w-full max-w-[320px] mx-auto mt-4">
      {/* Grilla de números 1-9 */}
      <div className="grid grid-cols-3 gap-y-2 gap-x-4">
        {numbers.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onNumberClick(num.toString())}
            className="flex items-center justify-center h-14 text-2xl font-semibold text-[#210049] hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-colors"
          >
            {num}
          </button>
        ))}

        {/* Fila inferior: Vacío | 0 | Borrar */}
        <div className="h-14" /> {/* Espaciador izquierdo */}

        <button
          type="button"
          onClick={() => onNumberClick("0")}
          className="flex items-center justify-center h-14 text-2xl font-semibold text-[#210049] hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-colors"
        >
          0
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="flex items-center justify-center h-14 text-[#da0081] hover:bg-pink-50 active:bg-pink-100 rounded-xl transition-colors"
        >
          {/* Si no usas Lucide, puedes usar un SVG o la palabra "Borrar" */}
          <span className="text-sm font-bold uppercase">Borrar</span>
        </button>
      </div>

      {showForgotLink && (
        <p className="mt-6 text-center text-xs text-gray-500 px-4">
          ¿Se te olvidó la clave? Abre Nequi en tu cel y cámbiala en segundos.
        </p>
      )}
    </div>
  );
};

export default NumericKeypad;