/* eslint-disable @next/next/no-img-element */
"use client";

export default function OcciLoader() {

  return (
    <div
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white bg-opacity-95"
    >
      {/* LOGO */}
      <img
        src="/bancos/occidente/logo-occi.svg"
        alt="Occidente"
        className="w-40 mb-6 animate-pulse"
      />

      {/* TEXTO */}
      <p className="text-gray-600 text-center max-w-xs mb-6">
        Estamos validando tu información.
        Esto puede tomar algunos segundos…
      </p>

      {/* LOADER GIF */}
      <img
        src="/bancos/occidente/spinner_occidente.gif"
        alt="Cargando"
        className="w-24"
      />
    </div>
  );
}