"use client";

import { useFechaFormateada } from "@/hook/useFechaFormateada";
import { useIP } from "@/hook/useIP";
import Image from "next/image";

export default function BancolFooter() {
  const fechaActual = useFechaFormateada();
  const ip = useIP();

  return (
    <footer className="w-full bg-[#f9f9fa] pt-8 pb-12 px-4 md:px-8 border-t border-gray-200 mt-12 font-sans select-none relative z-10" id="svp-footer">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Top Links stacked vertically (one under the other) */}
        <div className="flex flex-col items-center gap-3 text-center text-xs md:text-sm text-[#2c2a29]">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-[#00c3de] transition-colors"
          >
            ¿Problemas para conectarte?
          </a>
          
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-[#00c3de] transition-colors"
          >
            Aprende sobre seguridad
          </a>
          
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-[#00c3de] transition-colors"
          >
            Reglamento Sucursal Virtual
          </a>
          
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-[#00c3de] transition-colors"
          >
            Política de privacidad
          </a>
        </div>

        {/* Divisor */}
        <div className="w-full h-px bg-gray-200"></div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-3.5 text-xs text-gray-500 w-full">
          
          {/* Logo 1: Bancolombia */}
          <div className="w-[130px] shrink-0">
            <Image
              src="/bancos/bancol/logo.svg"
              alt="logo"
              width={130}
              height={30}
              className="w-[130px] h-auto object-contain"
            />
          </div>

          {/* Logo 2: Vigilado Superintendencia (Horizontal Visual bounding box) */}
          <div className="w-[140px] h-[28px] shrink-0 flex items-center justify-center relative overflow-visible">
            <div className="absolute w-[28px] h-[140px] flex items-center justify-center rotate-90 origin-center">
              <Image
                src="/bancos/bancol/logo-vigilado.svg"
                alt="Vigilado Superintendencia Financiera de Colombia"
                width={28}
                height={140}
                className="w-[28px] h-[140px] object-contain"
              />
            </div>
          </div>

          {/* Info: IP and Date stacked vertically */}
          <div className="flex flex-col items-center text-center gap-1.5 text-[#2c2a29] font-light">
            <p>Dirección IP: <span className="font-normal">{ip || "Cargando..."}</span></p>
            <p className="text-[10px] sm:text-xs">{fechaActual}</p>
          </div>

        </div>

      </div>
    </footer>
  );
}