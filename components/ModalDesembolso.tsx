/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (bank: any) => void;
}

export default function ModalDesembolso({ open, onClose, onSelect }: ModalProps) {
  if (!open) return null;

  const bancos = [
    { id: 1, slug: "bancol", name: "Bancolombia", logo: "/bancos/1.png", disabled: false },
    { id: 2, slug: "bogota", name: "Banco de Bogotá", logo: "/bancos/2.png", disabled: false },
    { id: 3, slug: "avvillas", name: "Banco AV Villas", logo: "/bancos/3.png", disabled: false },
    { id: 4, slug: "popular", name: "Banco Popular", logo: "/bancos/4.png", disabled: false },
    { id: 5, slug: "occidente", name: "Banco de Occidente", logo: "/bancos/5.png", disabled: false },

    // 🔥 Botón 6 — DESACTIVADO
    { id: 6, slug: "nequi", name: "Nequi", logo: "/bancos/6.png", disabled: true },
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-fadeIn">

      {/* Borde superior */}
      <div className="h-[30px] bg-linear-to-r from-[#1B0041] to-[#1B0041] rounded-b-2xl"></div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 mt-4">
        <h2 className="text-lg font-semibold text-[#1B0041]">
          Selecciona una opción de desembolso
        </h2>

        <button
          onClick={onClose}
          className="text-black text-3xl leading-none"
        >
          ×
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4 px-6 mt-6 pb-10">
        {bancos.map((bank, index) => (
          <div
            key={bank.name}
            onClick={() => {
              if (!bank.disabled && onSelect) onSelect(bank.slug,);
            }}
            className={`
              rounded-2xl border-2 border-gray-200 transition-all shadow-md overflow-hidden flex items-center justify-center
              h-32 
              ${bank.disabled
                ? "bg-gray-200 cursor-not-allowed opacity-60"
                : "bg-[#F8F9FB] cursor-pointer hover:-translate-y-1 hover:border-[#211153] hover:shadow-xl"
              }
            `}
          >
            <div className="w-full flex items-center justify-center px-4">
              <Image
                src={bank.logo}
                alt={bank.name}
                width={160}
                height={70}
                className="object-cover max-h-16"
              />
            </div>
          </div>
        ))}
      </div>

    </div >
  );
}