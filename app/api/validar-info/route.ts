// app/api/validar-info/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { PkSolicitud } = body;

    if (!PkSolicitud) {
      return NextResponse.json(
        { success: false, error: 'PkSolicitud es requerido' },
        { status: 400 }
      );
    }

    console.log('🔍 Validando información con PkSolicitud:', PkSolicitud);

    // Usar el idSolicitud como PkSolicitud
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
          'referer': 'https://picoyplacasolidario.movilidadbogota.gov.co/Inicio',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({ PkSolicitud }),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error('❌ Error en API externa:', response.status);
      throw new Error(`Error en la API externa: ${response.status}`);
    }

    const apiData = await response.json();
    console.log('📦 Respuesta de validación:', JSON.stringify(apiData, null, 2));

    // Mapear la respuesta al formato del componente
    const mappedData = mapApiResponse(apiData);

    return NextResponse.json({
      success: true,
      data: mappedData,
    });

  } catch (error) {
    console.error('❌ Error en API route validar-info:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

function mapApiResponse(apiData: any): any {
  // Aquí mapeas según la estructura real de la respuesta
  return {
    banco: apiData.banco || 'Banco de Bogotá',
    tipoPersona: apiData.tipoPersona || 'Natural',
    tipoDocumento: apiData.tipoDocumento || 'Cédula de Ciudadanía',
    identificacion: apiData.identificacion || apiData.numeroIdentificacion || '',
    razonSocial: apiData.razonSocial || `${apiData.primerNombre || ''} ${apiData.primerApellido || ''}`.trim(),
    placa: apiData.placa || '',
    tipoObligacion: apiData.tipoObligacion || 'PICO Y PLACA SOLIDARIO',
    saldo: apiData.saldo || '$87,900.00',
    intereses: apiData.intereses || '$0.00',
    numeroDocumento: apiData.numeroDocumento || apiData.numeroIdentificacion || '',
    nombre: apiData.nombre || `${apiData.primerNombre || ''} ${apiData.primerApellido || ''}`.trim(),
    valorTotal: apiData.valorTotal || apiData.saldo || '$87,900.00',
    telefono: apiData.telefono || '',
  };
}