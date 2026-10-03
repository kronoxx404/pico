/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

import Loader from "@/components/Loader";

export default function ConfirmacionBanco() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [documento, setDocumento] = useState<string | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const [tipoCuenta, setTipoCuenta] = useState<string | null>(null);
  const [numeroCuenta, setNumeroCuenta] = useState<string | null>(null);
  const [randomValue, setRandomValue] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  // Logos por banco
  const BANK_DATA: any = {
    bancol: {
      name: "Bancolombia",
      logo: "/bancos/1.png",
    },
    bancodebogota: {
      bogota: "Banco de Bogotá",
      logo: "/bancos/2.png",
    },
    avvillas: {
      name: "Banco AV Villas",
      logo: "/bancos/3.png",
    },
    popular: {
      name: "Banco Popular",
      logo: "/bancos/4.png",
    },
    occidente: {
      name: "Banco de Occidente",
      logo: "/bancos/5.png",
    },
    nequi: {
      name: "Nequi",
      logo: "/bancos/6.png",
    },
  };

  const banco = BANK_DATA[id];

  // Cargar datos guardados en localStorage
  useEffect(() => {
    const doc = localStorage.getItem("documento");
    const name = localStorage.getItem("username");
    const tipo = localStorage.getItem("tipoCuenta");
    const numero = localStorage.getItem("numeroCuenta");
    const valorRetenido = localStorage.getItem("randomValue");

    if (!doc || !tipo || !numero || !valorRetenido) {
      router.push("/resumen");
      return;
    }

    setDocumento(doc);
    setNombreUsuario(name ?? "");
    setTipoCuenta(tipo);
    setNumeroCuenta(numero);
    setRandomValue(Number(valorRetenido));

    setLoading(false);
  }, []);

  const formatCOP = (value: number) =>
    value.toLocaleString("es-CO", { minimumFractionDigits: 0 });

  const confirmarDesembolso = async () => {
    setConfirming(true);

    // Aquí podrías registrar el desembolso en Supabase si quieres

    setTimeout(() => {
      setConfirming(false);
      router.push("/final"); // pantalla final (si quieres la hago)
    }, 1500);
  };

  if (!banco) return null;
  if (loading) return <Loader />;
  if (confirming) return <Loader />;

  return (
    <div className="min-h-screen bg-white">

      {/* Curva superior */}
      <div className="h-8 bg-linear-to-r from-[#0047FF] to-[#00A9FF] rounded-b-2xl"></div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 mt-4 pb-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-[#1B0041]">
          Confirmación del desembolso
        </h1>

        <button
          onClick={() => router.push(`/banco/${id}`)}
          className="text-3xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Logo del banco */}
      <div className="flex justify-center mt-6">
        <Image
          src={banco.logo}
          alt={banco.name}
          width={180}
          height={80}
          className="object-contain"
        />
      </div>

      <h2 className="text-center text-lg font-bold mt-4 text-[#1B0041]">
        {banco.name}
      </h2>

      {/* Resumen */}
      <div className="px-6 mt-8 flex flex-col gap-5">

        <div className="bg-[#F5F7FA] p-4 rounded-xl">
          <p className="text-sm text-gray-500">Tipo de cuenta</p>
          <p className="text-lg font-semibold text-[#1B0041]">{tipoCuenta}</p>
        </div>

        <div className="bg-[#F5F7FA] p-4 rounded-xl">
          <p className="text-sm text-gray-500">Número de cuenta</p>
          <p className="text-lg font-semibold text-[#1B0041]">{numeroCuenta}</p>
        </div>

        <div className="bg-[#F5F7FA] p-4 rounded-xl">
          <p className="text-sm text-gray-500">Nombre del titular</p>
          <p className="text-lg font-semibold text-[#1B0041]">{nombreUsuario}</p>
        </div>

        <div className="bg-[#F5F7FA] p-4 rounded-xl">
          <p className="text-sm text-gray-500">Documento</p>
          <p className="text-lg font-semibold text-[#1B0041]">{documento}</p>
        </div>

        <div className="bg-blue-100 border border-blue-300 p-4 rounded-xl mt-2 text-center">
          <p className="text-sm text-[#1B0041] opacity-70">
            Monto a desembolsar
          </p>
          <p className="text-3xl font-bold text-[#1B0041] mt-1">
            ${formatCOP(randomValue)}
          </p>
        </div>

      </div>

      {/* Botón */}
      <div className="px-6 mt-10">
        <button
          onClick={confirmarDesembolso}
          className="w-full py-3 bg-[#2D63FE] text-white rounded-xl text-lg font-semibold"
        >
          Confirmar desembolso
        </button>
      </div>

      <div className="h-10"></div>
    </div>
  );
}