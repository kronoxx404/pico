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
        src="/bancos/nequi/logo.svg"
        alt="logo"
        className="w-20 mb-10 animate-pulse mt-8"
      />
      {/* LOADER CÍRCULO */}
      <div className="mt-6 w-12 h-12 border-4 border-red border-t-transparent rounded-full animate-spin"></div>
      {/* TEXTO */}
      <p className="text-lg text-black font-semibold text-center">
        {text}
      </p>

    </div>
  );
}