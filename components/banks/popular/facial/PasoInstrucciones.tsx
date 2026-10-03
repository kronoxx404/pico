/* eslint-disable @next/next/no-img-element */
"use client";

export default function PasoInstrucciones({ onContinue }: { onContinue: () => void }) {
  return (
    
    <div className="min-h-screen bg-[#f4f5f6] flex flex-col font-sans relative pb-[120px] lg:pb-[80px]">
      <div className="teal-header" style={{ height: "12px", backgroundColor: "#105163", width: "100%" }} />
      <div className="max-w-[940px] mx-auto w-full px-4 pt-8 lg:pt-14 flex-1 flex flex-col lg:flex-row justify-center items-start gap-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-8 w-full max-w-[370px] mx-auto lg:mx-0 relative" style={{ borderRadius: "24px" }}>
    
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
        .font-manrope { font-family: 'Manrope', sans-serif; }
        
        .face-scanner-mockup {
          position: relative;
          width: 160px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin: 0 auto;
        }

        .scanner-bar {
          position: absolute;
          width: 100%;
          height: 3px;
          background: linear-gradient(180deg, transparent, #105163, transparent);
          box-shadow: 0 0 10px #105163;
          animation: scanVertical 2.5s ease-in-out infinite;
          z-index: 10;
        }

        @keyframes scanVertical {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}} />

      {/* Logo */}
      <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "24px", marginBottom: "32px" }}>
          <img src="/bancos/popular/popularhorizontal_new.svg" style={{ height: "24px", width: "auto" }} alt="Logo" />
      </div>

      <div className="mb-2 text-center">
        <h2 className="text-[22px] font-extrabold text-[#2C2A29] font-manrope">
          Verificación Facial
        </h2>
      </div>

      <div className="text-[12px] font-extrabold text-[#105163] tracking-widest mb-6 text-center">
        PASO 3 DE 3
      </div>

      {/* Ilustración de rostro biométrico según diseño del usuario */}
      <div className="flex justify-center items-center py-6 px-6 mb-8 bg-[#f8f9fa] rounded-[24px] border border-gray-200">
        <div className="face-scanner-mockup">
          <div className="scanner-bar"></div>
          
          <svg viewBox="0 0 100 100" className="w-full h-full text-black" fill="none" stroke="currentColor" strokeWidth="2" style={{ maxHeight: '140px' }}>
            {/* Head contour */}
            <path d="M50 8C33 8 20 22 20 45c0 14 6 25 12 32 3 3 7 9 10 12 2 2 5 3 8 3s6-1 8-3c3-3 7-9 10-12 6-7 12-18 12-32 0-23-13-37-30-37z" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Ears */}
            <path d="M20 40c-3 0-5 3-5 7s2 7 5 7M80 40c3 0 5 3 5 7s-2 7-5 7" strokeWidth="2" strokeLinecap="round" />
            
            {/* Dotted connections */}
            <g stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.65">
              <line x1="38" y1="14" x2="62" y2="14" />
              <line x1="25" y1="22" x2="38" y2="14" />
              <line x1="62" y1="14" x2="75" y2="22" />
              <line x1="25" y1="22" x2="50" y2="22" />
              <line x1="50" y1="22" x2="75" y2="22" />
              <line x1="38" y1="14" x2="45" y2="32" />
              <line x1="62" y1="14" x2="55" y2="32" />
              
              <line x1="25" y1="22" x2="29" y2="39" />
              <line x1="75" y1="22" x2="71" y2="39" />
              <line x1="29" y1="39" x2="39" y2="39" />
              <line x1="71" y1="39" x2="61" y2="39" />
              <line x1="39" y1="39" x2="61" y2="39" />
              <line x1="38" y1="14" x2="29" y2="39" />
              <line x1="62" y1="14" x2="71" y2="39" />
              <line x1="38" y1="14" x2="39" y2="39" />
              <line x1="62" y1="14" x2="61" y2="39" />
              
              <line x1="45" y1="32" x2="55" y2="32" />
              <line x1="45" y1="32" x2="50" y2="51" />
              <line x1="55" y1="32" x2="50" y2="51" />
              <line x1="39" y1="39" x2="45" y2="32" />
              <line x1="61" y1="39" x2="55" y2="32" />
              
              <line x1="29" y1="39" x2="22" y2="53" />
              <line x1="71" y1="39" x2="78" y2="53" />
              <line x1="22" y1="53" x2="40" y2="58" />
              <line x1="78" y1="53" x2="60" y2="58" />
              <line x1="40" y1="58" x2="60" y2="58" />
              
              <line x1="29" y1="39" x2="40" y2="58" />
              <line x1="71" y1="39" x2="60" y2="58" />
              <line x1="50" y1="51" x2="40" y2="58" />
              <line x1="50" y1="51" x2="60" y2="58" />
              <line x1="50" y1="51" x2="47" y2="64" />
              <line x1="50" y1="51" x2="53" y2="64" />
              <line x1="47" y1="64" x2="53" y2="64" />
              
              <line x1="40" y1="58" x2="47" y2="64" />
              <line x1="60" y1="58" x2="53" y2="64" />
              <line x1="40" y1="58" x2="50" y2="69" />
              <line x1="60" y1="58" x2="50" y2="69" />
              <line x1="47" y1="64" x2="50" y2="69" />
              <line x1="53" y1="64" x2="50" y2="69" />
              
              <line x1="22" y1="53" x2="26" y2="76" />
              <line x1="78" y1="53" x2="74" y2="76" />
              <line x1="26" y1="76" x2="39" y2="79" />
              <line x1="74" y1="76" x2="61" y2="79" />
              <line x1="39" y1="79" x2="61" y2="79" />
              <line x1="40" y1="58" x2="39" y2="79" />
              <line x1="60" y1="58" x2="61" y2="79" />
              
              <line x1="39" y1="79" x2="50" y2="87" />
              <line x1="61" y1="79" x2="50" y2="87" />
              <line x1="50" y1="69" x2="50" y2="87" />
              <line x1="26" y1="76" x2="39" y2="90" />
              <line x1="74" y1="76" x2="61" y2="90" />
              <line x1="39" y1="90" x2="61" y2="90" />
              <line x1="50" y1="87" x2="39" y2="90" />
              <line x1="50" y1="87" x2="61" y2="90" />
            </g>
            
            {/* Dots */}
            <g fill="currentColor">
              <circle cx="38" cy="14" r="2.2" />
              <circle cx="62" cy="14" r="2.2" />
              <circle cx="25" cy="22" r="2.2" />
              <circle cx="75" cy="22" r="2.2" />
              <circle cx="45" cy="32" r="2.2" />
              <circle cx="55" cy="32" r="2.2" />
              <circle cx="29" cy="39" r="2.2" />
              <circle cx="71" cy="39" r="2.2" />
              <circle cx="39" cy="39" r="2.2" />
              <circle cx="61" cy="39" r="2.2" />
              <circle cx="50" cy="51" r="2.2" />
              <circle cx="22" cy="53" r="2.2" />
              <circle cx="78" cy="53" r="2.2" />
              <circle cx="40" cy="58" r="2.2" />
              <circle cx="60" cy="58" r="2.2" />
              <circle cx="47" cy="64" r="2.2" />
              <circle cx="53" cy="64" r="2.2" />
              <circle cx="50" cy="69" r="2.2" />
              <circle cx="26" cy="76" r="2.2" />
              <circle cx="74" cy="76" r="2.2" />
              <circle cx="39" cy="79" r="2.2" />
              <circle cx="61" cy="79" r="2.2" />
              <circle cx="50" cy="87" r="2.2" />
              <circle cx="39" cy="90" r="2.2" />
              <circle cx="61" cy="90" r="2.2" />
            </g>
          </svg>
        </div>
      </div>

      <div className="text-[15px] font-medium text-gray-500 mb-8 leading-relaxed px-4 font-manrope text-center">
        Ubica tu rostro dentro del óvalo, <br />
        <span className="text-[#2C2A29] font-bold">mira a la cámara y acércate lentamente.</span>
      </div>

      <div className="space-y-3 font-manrope">
        <button
          className="w-full py-4 text-white font-bold text-lg rounded-xl transition-all"
          style={{ backgroundColor: "#105163" }}
          onClick={onContinue}
        >
          Iniciar Reconocimiento
        </button>

        <button
          className="w-full py-2 text-[#2C2A29] hover:text-[#105163] font-bold text-sm bg-transparent transition-colors"
          onClick={() => window.location.reload()}
        >
          Cancelar
        </button>
      </div>

      <p className="mt-6 text-[12px] text-gray-400 font-medium leading-tight font-manrope text-center">
        Retira accesorios como gorras, lentes o cubrebocas para garantizar una validación correcta.
      </p>
    
        </div>
      </div>
    </div>
    
  );
}
