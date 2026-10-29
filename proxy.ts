import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const WINDOW_MINUTES = 1;
const MAX_REQUESTS_CONTACTO = 3;
const MAX_REQUESTS_LOGIN = 5;

async function verificarRateLimit(ip: string, ruta: string, maxIntentos: number): Promise<boolean> {
  const ahora = new Date();
  const haceUnMinuto = new Date(ahora.getTime() - WINDOW_MINUTES * 60000);

  const { data, error } = await supabaseAdmin
    .from('rate_limits')
    .select('id, intentos, ultimo_intento')
    .eq('ip', ip)
    .eq('ruta', ruta)
    .single();

  if (error && error.code !== 'PGRST116') return true;

  if (!data) {
    await supabaseAdmin.from('rate_limits').insert([{ ip, ruta, intentos: 1 }]);
    return true;
  }

  if (new Date(data.ultimo_intento) < haceUnMinuto) {
    await supabaseAdmin.from('rate_limits').update({ intentos: 1, ultimo_intento: ahora.toISOString() }).eq('id', data.id);
    return true;
  }

  if (data.intentos >= maxIntentos) return false;

  await supabaseAdmin.from('rate_limits').update({ intentos: data.intentos + 1, ultimo_intento: ahora.toISOString() }).eq('id', data.id);
  return true;
}

export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';

  if (request.nextUrl.pathname === '/api/contacto' && request.method === 'POST') {
    const permitido = await verificarRateLimit(ip, '/api/contacto', MAX_REQUESTS_CONTACTO);
    if (!permitido) return NextResponse.json({ error: 'Demasiadas solicitudes.' }, { status: 429 });
  }

  if (request.nextUrl.pathname === '/login' && request.method === 'POST') {
    const permitido = await verificarRateLimit(ip, '/login', MAX_REQUESTS_LOGIN);
    if (!permitido) return NextResponse.json({ error: 'Demasiados intentos de inicio de sesión.' }, { status: 429 });
  }

  if (request.nextUrl.pathname === '/portal/login' && request.method === 'POST') {
    const permitido = await verificarRateLimit(ip, '/portal/login', MAX_REQUESTS_LOGIN);
    if (!permitido) return NextResponse.json({ error: 'Demasiados intentos de inicio de sesión.' }, { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/contacto', '/login', '/portal/login'],
};