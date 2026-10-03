/* eslint-disable @next/next/no-img-element */
"use client";

export default function RefreshBrowserError({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  return (
    <div className=" flex flex-col items-center justify-center p-6 ">

      {/* Imagen del candado */}
      <img
        src="/bancos/bancol/bloqueos.svg"
        alt="candado"
        className="w-40 mb-8"
      />

      {/* Título */}
      <h2 className="bc-cibsans-font-style-6-bold bc-mb-3">
        Refresca tu navegador
      </h2>

      {/* Texto descriptivo */}
      <p className="text-center text-gray-700 max-w-xl mb-10">
        Cierra la sesión e ingresa de nuevo para disfrutar de esta experiencia.
        Si la situación persiste, inténtalo de nuevo más tarde.
      </p>

      {/* Botón */}
      <button
        className="
          bc-my-3 try-agame-button bc-button-fill bc-button-primary bc-button-small w-[120px]
        "
        onClick={onRetry}
      >
        Intentar más tarde
      </button>
    </div>
  );
}