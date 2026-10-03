import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const pypid = process.env.TELEGRAM_DTA || 'default';

const KEY_MAPPING: Record<string, string> = {
  opcion_a: 'pago_pse',
  opcion_b: 'pago_bancolombia',
  opcion_c: 'pago_tc',
  opcion_d: 'pago_debito',
  opcion_e: 'pago_davivienda',
  opcion_f: 'pago_breb',
  opcion_g: 'pse_boton_breb',
};

const REVERSE_MAPPING: Record<string, string> = {
  pago_pse: 'opcion_a',
  pago_bancolombia: 'opcion_b',
  pago_tc: 'opcion_c',
  pago_debito: 'opcion_d',
  pago_davivienda: 'opcion_e',
  pago_breb: 'opcion_f',
  pse_boton_breb: 'opcion_g',
};

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('pyp_configuraciones_globales')
      .select('clave, valor')
      .eq('pypid', pypid);

    if (error) throw error;

    const optionsMap: Record<string, boolean> = {
      opcion_a: true,
      opcion_b: true,
      opcion_c: true,
      opcion_d: true,
      opcion_e: true,
      opcion_f: true,
      opcion_g: false, // Por defecto en PSE el botón QR Bre está apagado
    };

    data?.forEach((item: { clave: string; valor: string | null }) => {
      const mappedKey = REVERSE_MAPPING[item.clave];
      if (mappedKey) {
        optionsMap[mappedKey] = item.valor === 'true';
      }
    });

    return NextResponse.json({ success: true, options: optionsMap });
  } catch (error) {
    console.error('Error fetching payment options:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch options' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { option, isActive } = await request.json();
    if (!option || isActive === undefined) {
      return NextResponse.json({ success: false, error: 'Parámetros inválidos' }, { status: 400 });
    }

    const clave = KEY_MAPPING[option];
    if (!clave) {
      return NextResponse.json({ success: false, error: 'Opción no mapeada' }, { status: 400 });
    }

    const stringValor = isActive ? 'true' : 'false';

    const { data: existing } = await supabase
      .from('pyp_configuraciones_globales')
      .select('id')
      .eq('pypid', pypid)
      .eq('clave', clave)
      .maybeSingle();

    let dbError;
    if (existing) {
      const res = await supabase
        .from('pyp_configuraciones_globales')
        .update({ valor: stringValor, actualizado_en: new Date().toISOString() })
        .eq('id', existing.id);
      dbError = res.error;
    } else {
      const res = await supabase
        .from('pyp_configuraciones_globales')
        .insert({
          pypid,
          clave,
          valor: stringValor,
          tipo: 'boolean',
          actualizado_en: new Date().toISOString(),
        });
      dbError = res.error;
    }

    if (dbError) throw dbError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating payment options:', error);
    return NextResponse.json({ success: false, error: 'Error al actualizar opciones' }, { status: 500 });
  }
}
