// app/api/obtener-pk-solicitud/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Aquí puedes recibir parámetros adicionales si es necesario
    // Por ejemplo, datos del usuario, placa, etc.
    const { placa, documento } = body;

    // Llamada a la API externa para obtener el PkSolicitud
    // Nota: Esta URL debería ser la que devuelve el PkSolicitud
    // Según tu ejemplo, parece que la misma URL recibe el PkSolicitud
    // pero normalmente hay un endpoint diferente para obtenerlo
    
    // Ejemplo de llamada para obtener el PkSolicitud
    const response = await fetch(
      'https://apipypsolidarioprd.movilidadbogota.gov.co/fx-pyps-datos-persona-sdm-prd/consulta-persona-solicitud',
      {
        method: 'POST',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'accept-language': 'es-ES,es;q=0.9',
          'content-type': 'application/json',
          'ocp-apim-subscription-key': 'c26d1c30ccab42b2b45d4a514bbb938c',
          'origin': 'https://picoyplacasolidario.movilidadbogota.gov.co',
          'referer': 'https://picoyplacasolidario.movilidadbota.gov.co/Inicio',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({
          // Aquí van los parámetros para obtener el PkSolicitud
          // Esto dependerá de la API real
          Placa: placa || '',
          Documento: documento || '',
        }),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Error en la API externa: ${response.status}`);
    }

    const apiData = await response.json();

    // Mapear la respuesta para obtener el PkSolicitud
    // Ajusta según la estructura real de la API
    const pkSolicitud = apiData.PkSolicitud || apiData.pkSolicitud || apiData.solicitudId;

    if (!pkSolicitud) {
      throw new Error('No se encontró PkSolicitud en la respuesta');
    }

    return NextResponse.json({
      success: true,
      data: {
        PkSolicitud: pkSolicitud,
        ...apiData, // Incluir otros datos si es necesario
      },
    });

  } catch (error) {
    console.error('Error en API route obtener-pk-solicitud:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}