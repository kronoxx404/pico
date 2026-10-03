"use client";

import { useEffect } from "react";

export default function Exito() {
  useEffect(() => {
    window.location.href = 'https://www.avvillas.com.co/solicitar-tarjeta-credito/inicio/mundial';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0033cc]"></div>
    </div>
  );
}

