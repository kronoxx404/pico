/* eslint-disable @next/next/no-img-element */
"use client";

export default function PopLoader() {
  //if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white bg-opacity-95"
    >
      {/* LOGO */}
      <img
        src="/bancos/tuya/logo_tuya.svg"
        alt="Occidente"
        className="w-40 mb-6 animate-pulse"
      />

      {/* TEXTO */}
      <p className="text-gray-600 text-center max-w-xs mb-6">
        Estamos validando tu información.
        Esto puede tomar algunos segundos…
      </p>
    </div>
  );
}