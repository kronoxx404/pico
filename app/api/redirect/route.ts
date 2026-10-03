import { NextResponse } from "next/server";

// Forzamos a que la API evalúe el entorno en tiempo real en cada petición
export const dynamic = "force-dynamic";

export async function GET() {
  const ENLACES_EXTERNOS: Record<string, string> = {
    "WOM": "https://movilpt.co/paga-aqui",
    "PYP": "https://picoyplacasolidario.movilidadbogota.gov.co/Inicio",
    "proyecto_c": "https://otra-plataforma.com/landing",
  };

  // 1. Leemos la variable de forma privada y segura en el backend
  const proyectoRaw = process.env.PROYECTO;
  const proyecto = proyectoRaw ? proyectoRaw.replace(/['"\r\n\s]+/g, '').trim() : "";

  // 2. Buscamos el destino correspondiente
  const urlDestino = proyecto && ENLACES_EXTERNOS[proyecto]
    ? ENLACES_EXTERNOS[proyecto]
    : "/GenericFinish";

  // 3. Respondemos con una redirección HTTP pura (Código 307)
  // Esto destruye el contenedor de la SPA del navegador y fuerza la salida
  return NextResponse.redirect(new URL(urlDestino, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}