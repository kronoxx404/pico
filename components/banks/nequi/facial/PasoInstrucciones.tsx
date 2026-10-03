/* eslint-disable @next/next/no-img-element */
"use client";

export default function PasoInstrucciones({ onContinue }: { onContinue: () => void }) {
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
          Movimiento de tu cara
        </h2>
      </div>

      <div className="text-[12px] font-extrabold text-[#DA0081] tracking-widest mb-6">
        PASO 1 DE 2
      </div>

      {/* Ilustración con el color rosado muy suave de fondo (estilo Nequi) */}
      <div className="flex justify-center items-center py-10 px-6 mb-8" style={{ backgroundColor: "#FFF0F9", borderRadius: "20px" }}>
        <img
          src="/bancos/nequi/img/facial_instruction.png" // Ajusta la ruta a tu carpeta public
          alt="Instrucción facial"
          className="max-w-full h-auto max-h-[180px]"
        />
      </div>

      <div className="text-[15px] font-medium text-gray-500 mb-10 leading-relaxed px-4">
        Ubica tu cara dentro del círculo, <br />
        <span className="text-[#210049] font-bold">mira a la cámara y acércate.</span>
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
        Asegúrate de estar en un lugar con buena iluminación y sin accesorios que cubran tu cara.
      </p>
    </div>
  );
}