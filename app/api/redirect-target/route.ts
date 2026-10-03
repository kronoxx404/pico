import { NextResponse } from "next/server";

/**
 * GET /api/redirect-target?slug=davivienda
 * 
 * Evalúa el entorno de forma segura y devuelve la ruta correcta.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  // 🔒 Lectura privada en el servidor limbiando comillas
  const proyecto = process.env.PROYECTO?.replace(/'/g, "").toUpperCase().trim(); 

  let url: string;

  if (proyecto === "JELPIT") {
    if (!slug) {
      return NextResponse.json({ error: "slug requerido para el entorno PYP" }, { status: 400 });
    }
    // Redirección para el entorno PYP
    url = `/banco/${slug}?jelpit`;

  } else if (proyecto === "WOM") {
    // Redirección específica para WOM
    url = `/banco/${slug}?wom`;

  } else {
    // 🌐 CASO POR DEFECTO: Redirige a la ruta pública de tu página genérica.
    // Ajusta '/banco/generic' por la URL real que creaste en tu carpeta 'app'
    url = `/banco/${slug}`; 
  }

  return NextResponse.json({ url });
}