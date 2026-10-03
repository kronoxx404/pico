import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const pypid = process.env.TELEGRAM_DTA || 'default';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('pyp_configuraciones_globales')
      .select('clave, valor, tipo, descripcion')
      .eq('pypid', pypid);

    if (error) throw error;

    // Convert array to object mapping
    const configs: Record<string, string | number | boolean | null> = {};
    (data || []).forEach((item: { clave: string; valor: string | null; tipo: string }) => {
      let val: string | number | boolean | null = item.valor;
      if (item.tipo === 'boolean') val = val === 'true';
      else if (item.tipo === 'number') val = Number(val);
      configs[item.clave] = val;
    });

    return NextResponse.json({ success: true, data: configs });
  } catch (error) {
    console.error('❌ Error fetching configuraciones:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch configs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clave, valor } = body;

    if (!clave || valor === undefined) {
      return NextResponse.json({ success: false, error: 'Parámetros inválidos' }, { status: 400 });
    }

    const stringValor = typeof valor === 'boolean' ? (valor ? 'true' : 'false') : String(valor);

    const { error } = await supabase
      .from('pyp_configuraciones_globales')
      .update({ valor: stringValor, actualizado_en: new Date().toISOString() })
      .eq('clave', clave)
      .eq('pypid', pypid);

    if (error) {
      console.error('❌ Error Supabase al actualizar configuracion:', error);
      return NextResponse.json({ success: false, error: 'Error al actualizar' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error al actualizar configuracion:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
