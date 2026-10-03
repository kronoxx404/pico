/* eslint-disable @next/next/no-img-element */
"use client";

export default function AvvillasLoader({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <>
      {/* Fondo */}
      <div className="av-loader-overlay"></div>

      {/* GIF cargando */}
      <div className="av-loader-center">
        <img
          src="/bancos/avvillas/img/loading.gif"
          width="140"
          alt="Cargando..."
        />
      </div>
    </>

  );
}