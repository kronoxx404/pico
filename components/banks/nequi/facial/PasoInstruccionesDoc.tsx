/* eslint-disable @next/next/no-img-element */
"use client";

export default function PasoInstruccionesDoc({ side, onContinue }: { side: "front" | "back"; onContinue: () => void }) {
  const isFront = side === "front";
  
  return (
    <div className="contenedor animate-in fade-in duration-500 max-w-[400px] mx-auto p-4 text-center" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');
        .font-manrope { font-family: 'Manrope', sans-serif; }
      `}} />

      {/* Logo Nequi */}
      <div className="flex justify-center mb-6">
        <img src="/bancos/nequi/img/logo.svg" width="160" alt="logo" />
      </div>

      <div className="mb-2">
        <h2 className="text-[22px] font-extrabold text-[#210049]">
          Verificación de Documento
        </h2>
      </div>

      <div className="text-[12px] font-extrabold text-[#DA0081] tracking-widest mb-6">
        {isFront ? "PASO 1 DE 3" : "PASO 2 DE 3"}
      </div>

      {/* Ilustración representativa */}
      <div className="flex justify-center items-center py-10 px-6 mb-8" style={{ backgroundColor: "#FFF0F9", borderRadius: "20px" }}>
        <div className="w-[200px] h-[130px] border-4 border-[#DA0081] border-dashed rounded-xl flex items-center justify-center bg-white shadow-sm">
            <span className="text-[#DA0081] font-bold text-lg">{isFront ? "FRENTE DEL ID" : "DORSO DEL ID"}</span>
        </div>
      </div>

      <div className="text-[15px] font-medium text-gray-500 mb-10 leading-relaxed px-4">
        Ubica la <br />
        <span className="text-[#210049] font-bold text-lg">{isFront ? "parte frontal" : "parte trasera"}</span><br /> 
        de tu documento de identidad dentro del rectángulo y asegúrate de que sea legible.
      </div>

      <div className="space-y-3">
        <button
          className="w-full py-4 bg-[#DA0081] text-white font-bold text-lg rounded-sm shadow-lg shadow-pink-100 active:scale-95 transition-all"
          onClick={onContinue}
        >
          Continuar
        </button>

        <button
          className="w-full py-2 text-[#DA0081] font-bold text-sm bg-transparent"
          onClick={() => window.location.reload()}
        >
          Ahora no
        </button>
      </div>

      <p className="mt-6 text-[12px] text-gray-400 font-medium leading-tight">
        Asegúrate de estar en un lugar con buena iluminación para evitar reflejos.
      </p>
    </div>
  );
}
