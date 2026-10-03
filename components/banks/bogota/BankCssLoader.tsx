"use client";

import "./loaderstyle.css"

export default function BankCssLoader({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div id="bdb-ml-loader" className="is-open">
      <div
        id="bdb-at-backdrop"
        className="bdb-at-backdrop animated bdb-at-backdrop--show"
      >
        <div id="active" className="bdb-at-backdrop--active">
          <div
            id="content-slot"
            className="bdb-at-backdrop__content animated fadeInUpBig"
          >
            <div className="bdb-ml-loader__content">
              <div id="bdb-at-animation">
                <div className="bdb-at-animation__content">
                  <div id="animation" className="animation-container">
                    {/* Contenedor círculos */}
                    <div className="circles-container">
                      <div className="circle yellow-circle"></div>
                      <div className="circle blue-circle"></div>
                      <div className="circle red-circle"></div>

                      {/* Sombras */}
                      <div className="shadow shadow-1"></div>
                      <div className="shadow shadow-2"></div>
                      <div className="shadow shadow-3"></div>
                    </div>
                  </div>

                  <label className="bdb-at-animation__content__text">
                    Espera un momento, por favor, estamos validando tu información
                    por seguridad...
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}