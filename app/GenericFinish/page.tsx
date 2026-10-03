import Link from "next/link";

export default function DefaultSuccessPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
        
        {/* Icono de Éxito */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        {/* Textos Informativos */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          ¡Proceso Completado con Éxito!
        </h1>
        <p className="text-gray-600 mb-8">
          Tu solicitud ha sido procesada correctamente por nuestro sistema. Ya puedes continuar con tus actividades de forma segura.
        </p>

        {/* Botón de Acción Modificado */}
        <div className="w-full">
          <Link
            href="/"
            className="flex justify-center items-center w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md cursor-pointer"
          >
            Volver al inicio
          </Link>
        </div>
        
      </div>
    </div>
  );
}