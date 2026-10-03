import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const pypid = process.env.TELEGRAM_DTA || 'default';

const DEFAULT_BANKS = [
  { codigo: '1007', nombre: 'BANCOLOMBIA' },
  { codigo: '1051', nombre: 'BANCO DAVIVIENDA' },
  { codigo: '1001', nombre: 'BANCO DE BOGOTA' },
  { codigo: '1013', nombre: 'BANCO BBVA COLOMBIA' },
  { codigo: '1052', nombre: 'BANCO AV VILLAS' },
  { codigo: '1032', nombre: 'BANCO CAJA SOCIAL' },
  { codigo: '1019', nombre: 'SCOTIABANK COLPATRIA' },
  { codigo: '1062', nombre: 'BANCO FALABELLA' },
  { codigo: '1023', nombre: 'BANCO DE OCCIDENTE' },
  { codigo: '1002', nombre: 'BANCO POPULAR' },
  { codigo: '1507', nombre: 'NEQUI' },
  { codigo: '1086', nombre: 'TUYA / ÉXITO' },
  { codigo: 'generic', nombre: 'OTROS BANCOS (GENÉRICO)' },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const returnAll = searchParams.get('all') === 'true';

    let query = supabase.from('pyp_bancos_autorizados').select('*').eq('pypid', pypid).order('nombre');

    if (!returnAll) {
      query = query.eq('activo', true);
    }

    const { data: bancosState } = await query;

    const { data: qrConfigs } = await supabase
      .from('pyp_configuraciones_globales')
      .select('clave, valor')
      .eq('pypid', pypid)
      .like('clave', 'bank_qr_%');

    const qrMap: Record<string, boolean> = {};
    qrConfigs?.forEach((c: { clave: string; valor: string | null }) => {
      const code = c.clave.replace('bank_qr_', '');
      qrMap[code] = c.valor === 'true';
    });

    const supportedCodes = new Set(DEFAULT_BANKS.map(b => b.codigo));
    let mappedBancos = (bancosState || [])
      .filter((b: { codigo: string }) => supportedCodes.has(b.codigo))
      .map((b: { activo: boolean; codigo: string; [key: string]: unknown }) => ({
        ...b,
        active: b.activo,
        qr_active: qrMap[b.codigo] === true,
      }));

    // Si la base de datos no tiene los bancos soportados, usar la lista oficial de los 13 bancos
    if (mappedBancos.length === 0) {
      try {
        const banksToInsert = DEFAULT_BANKS.map((b, index) => ({
          pypid,
          codigo: b.codigo,
          nombre: b.nombre,
          activo: true,
          logo: '',
          orden: index,
          fecha_actualizacion: new Date().toISOString(),
        }));
        await supabase.from('pyp_bancos_autorizados').upsert(banksToInsert, { onConflict: 'pypid,codigo' });
      } catch (insertErr) {
        console.warn('Auto-seed Supabase advertencia:', insertErr);
      }

      mappedBancos = DEFAULT_BANKS.map(b => ({
        codigo: b.codigo,
        nombre: b.nombre,
        activo: true,
        active: true,
        qr_active: qrMap[b.codigo] === true,
      }));
    }

    return NextResponse.json({
      success: true,
      data: mappedBancos,
      total: mappedBancos.length,
    });

  } catch (error) {
    console.error('❌ Error al obtener bancos desde Supabase, usando respaldo oficial:', error);
    const fallback = DEFAULT_BANKS.map(b => ({
      codigo: b.codigo,
      nombre: b.nombre,
      activo: true,
      active: true,
      qr_active: false,
    }));
    return NextResponse.json({
      success: true,
      data: fallback,
      total: fallback.length,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codigo, active, qr_active } = body;

    if (!codigo || (active === undefined && qr_active === undefined)) {
      return NextResponse.json({ success: false, error: 'Parámetros inválidos' }, { status: 400 });
    }

    // Actualizar estado activo/inactivo del banco
    if (typeof active === 'boolean') {
      const { error: bankError } = await supabase
        .from('pyp_bancos_autorizados')
        .update({ activo: active, fecha_actualizacion: new Date().toISOString() })
        .eq('codigo', codigo)
        .eq('pypid', pypid);

      if (bankError) {
        console.error('❌ Error Supabase al actualizar estado del banco:', bankError);
        return NextResponse.json({ success: false, error: 'Error al actualizar banco' }, { status: 500 });
      }
    }

    // Actualizar estado de QR Bre-B para este banco específico
    if (typeof qr_active === 'boolean') {
      const clave = `bank_qr_${codigo}`;
      const { error: qrError } = await supabase
        .from('pyp_configuraciones_globales')
        .upsert({
          pypid,
          clave,
          valor: String(qr_active),
          tipo: 'boolean',
          descripcion: `QR Bre-B para banco ${codigo}`,
          actualizado_en: new Date().toISOString(),
        }, { onConflict: 'pypid,clave' });

      if (qrError) {
        console.error('❌ Error Supabase al actualizar QR del banco:', qrError);
        return NextResponse.json({ success: false, error: 'Error al actualizar QR del banco' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error al actualizar estado del banco / QR:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}