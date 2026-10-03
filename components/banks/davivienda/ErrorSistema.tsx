/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

export default function ErrorSistema() {
  const handleAceptar = () => {
    window.location.href = "/banco/davivienda";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-[340px] bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col items-center px-8 py-10 gap-5"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
      >
        {/* Ícono de error circular rojo */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full border-4 border-[#d0021b]">
          <span className="text-[#d0021b] text-[42px] font-bold leading-none select-none">!</span>
        </div>

        {/* Título */}
        <h2 className="text-[22px] font-bold text-black text-center leading-tight">
          Excúsenos
        </h2>

        {/* Descripción */}
        <p className="text-[15px] text-[#3d3d3d] text-center leading-snug">
          Ingrese nuevamente en unos minutos. En estos momentos no podemos atender su solicitud
        </p>

        {/* Botón Aceptar */}
        <button
          onClick={handleAceptar}
          className="w-60 py-6 rounded-full bg-[#d0021b] font-bold text-[17px] tracking-wide hover:bg-[#b00018] active:scale-95 transition-all shadow-md mt-1 !text-white"
        >
          Aceptar
        </button>
      </div>

      {/* Fondo difuso del banco */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[#8b0000] opacity-30" />
    </div>
  );
}
