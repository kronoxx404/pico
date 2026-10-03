/* eslint-disable @next/next/no-img-element */
"use client";

interface LoaderProps {
  text?: string;
  show: boolean;
}

export default function FullScreenLoader({ text = "Estamos verificando tu información", show = true }: LoaderProps) {
  if (!show) return null;

  return (
    <div
      className="
        fixed inset-0 bg-white/95 z-9999 
        flex flex-col items-center justify-center
      "
    >
      {/* LOGO */}
      <img
        src="/bancos/nequi/img/cargando.gif"
        alt="logo"
        className="w-60 mb-10 animate-pulse mt-8"
      />

      {/* TEXTO */}
      <p className="text-lg text-black font-semibold text-center">
        {text}
      </p>

    </div>
  );
}