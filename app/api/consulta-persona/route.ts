// app/api/consulta-persona/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { NumeroIdentificacion, IdTipoDocumento } = body;

    if (!NumeroIdentificacion) {
      return NextResponse.json(
        { success: false, error: 'NumeroIdentificacion es requerido' },
        { status: 400 }
      );
    }

    console.log('🔍 Consultando persona con:', { NumeroIdentificacion, IdTipoDocumento });

    const response = await fetch(
      'https://apipypsolidarioprd.movilidadbogota.gov.co/fx-pyps-datos-persona-sdm-prd/consulta-persona',
      {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://picoyplacasolidario.movilidadbogota.gov.co/',
          'Ocp-Apim-Subscription-Key': 'c26d1c30ccab42b2b45d4a514bbb938c',
          'X-User-Token': 'ydffz850up7-mne2nvn0-hngttro1uu9',
          'Content-Type': 'application/json',
          'Origin': 'https://picoyplacasolidario.movilidadbogota.gov.co',
          'Sec-GPC': '1',
          'Connection': 'keep-alive',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site'
        },
        body: JSON.stringify({
          NumeroIdentificacion,
          IdTipoDocumento: IdTipoDocumento || "1",
        }),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.error('❌ Error en API externa:', response.status);
      throw new Error(`Error en la API externa: ${response.status}`);
    }

    const apiResponse = await response.json();
    console.log('📦 Respuesta completa de la API:', JSON.stringify(apiResponse, null, 2));

    // Verificar si la respuesta es exitosa
    if (apiResponse.isError || !apiResponse.data) {
      console.error('❌ Error en la respuesta:', apiResponse.message);
      return NextResponse.json(
        { 
          success: false, 
          error: apiResponse.message || 'Error al consultar la persona'
        },
        { status: 404 }
      );
    }

    const data = apiResponse.data;
    
    // Extraer idSolicitud (este es el PkSolicitud que necesitamos)
    const idSolicitud = data.idSolicitud || data.IdSolicitud || null;
    
    if (!idSolicitud) {
      console.warn('⚠️ No se encontró idSolicitud en la respuesta, pero se obtuvieron datos de la persona');
    }

    console.log('✅ Datos de persona obtenidos, idSolicitud:', idSolicitud);

    // Mapear la respuesta con los datos necesarios
    const mappedData = {
      idSolicitud: idSolicitud,
      idDatosUsuario: data.idDatosUsuario,
      primerNombre: data.primerNombre,
      segundoNombre: data.segundoNombre,
      primerApellido: data.primerApellido,
      segundoApellido: data.segundoApellido,
      numeroIdentificacion: data.numeroIdentificacion,
      tipoDocumento: data.idTipoDocumento,
      email: data.correosElectronicos?.email,
      telefono: data.numeroTelefono,
      estrato: data.estrato,
      cantidadVehiculos: data.cantidadVehiculos,
      direcciones: data.direcciones,
      // Datos completos
      ...data,
    };

    return NextResponse.json({
      success: true,
      data: mappedData,
    });

  } catch (error) {
    console.error('❌ Error en API route consulta-persona:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}