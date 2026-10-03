import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

const pypid = process.env.TELEGRAM_DTA || 'default';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Credenciales requeridas' }, { status: 400 });
    }

    const envUser = process.env.XDM_USER || 'admin';
    const envPass = process.env.XDM_PASSWORD || 'admin';

    let isValid = (username === envUser && password === envPass);

    // Si no coincide con .env, verificar en Supabase configuraciones globales
    if (!isValid) {
      try {
        const { data: dbUser } = await supabase
          .from('pyp_configuraciones_globales')
          .select('valor')
          .eq('pypid', pypid)
          .eq('clave', 'xdm_admin_user')
          .maybeSingle();

        const { data: dbPass } = await supabase
          .from('pyp_configuraciones_globales')
          .select('valor')
          .eq('pypid', pypid)
          .eq('clave', 'xdm_admin_password')
          .maybeSingle();

        if (dbUser?.valor && dbPass?.valor) {
          isValid = (username === dbUser.valor && password === dbPass.valor);
        }
      } catch (e) {
        console.error('Error verificando admin en DB:', e);
      }
    }

    if (isValid) {
      const cookieStore = await cookies();
      cookieStore.set('xdm_session', 'authenticated', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Usuario o contraseña incorrectos' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error interno de autenticación' },
      { status: 500 }
    );
  }
}
