import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get('host') || '';
  const subdomain = host.split('.')[0];

  if (!subdomain) {
    return NextResponse.json({ error: 'No subdomain provided' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('Project')
    .select('mirrorHtml')
    .eq('subdomain', subdomain)
    .eq('generateMirror', true)
    .single();

  if (error || !data || !data.mirrorHtml) {
    // Si no hay espejo o falló, redirigir a un 404 local o página blanca default
    return new NextResponse('<html><body><h1>Not Found</h1></body></html>', { 
      status: 404,
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // Devolver el HTML tal cual fue generado por la IA
  return new NextResponse(data.mirrorHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60'
    }
  });
}
