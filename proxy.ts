import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usamos el cliente de Supabase con la SERVICE_ROLE_KEY para saltar RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // ¡Asegurate de tener esta variable en .env.local y Vercel!
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const WINDOW_MINUTES = 1;
const MAX_REQUESTS_CONTACTO = 3;
const MAX_REQUESTS_LOGIN = 5;

async function verificarRateLimit(ip: string, ruta: string, maxIntentos: number): Promise<boolean> {
  const ahora = new Date();
  const haceUnMinuto = new Date(ahora.getTime() - WINDOW_MINUTES * 60000);

  // 1. Buscar si existe un registro reciente
  const { data, error } = await supabaseAdmin
    .from('rate_limits')
    .select('id, intentos, ultimo_intento')
    .eq('ip', ip)
    .eq('ruta', ruta)
    .single();

  if (error && error.code !== 'PGRST116') {
    // Error real de base de datos (ej: tabla no existe)
    console.error('Error en Rate Limit:', error);
    return true; // En caso de error, dejamos pasar (fail-open) para no bloquear usuarios legítimos
  }

  if (!data) {
    // Primer intento: insertar registro
    await supabaseAdmin.from('rate_limits').insert([{ ip, ruta, intentos: 1 }]);
    return true;
  }

  // Si el último intento fue hace más de 1 minuto, reiniciar contador
  if (new Date(data.ultimo_intento) < haceUnMinuto) {
    await supabaseAdmin
      .from('rate_limits')
      .update({ intentos: 1, ultimo_intento: ahora.toISOString() })
      .eq('id', data.id);
    return true;
  }

  // Si superó el límite, bloquear
  if (data.intentos >= maxIntentos) {
    return false;
  }

  // Incrementar contador
  await supabaseAdmin
    .from('rate_limits')
    .update({ intentos: data.intentos + 1, ultimo_intento: ahora.toISOString() })
    .eq('id', data.id);

  return true;
}

export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';

  // Proteger API de Contacto
  if (request.nextUrl.pathname === '/api/contacto' && request.method === 'POST') {
    const permitido = await verificarRateLimit(ip, '/api/contacto', MAX_REQUESTS_CONTACTO);
    if (!permitido) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor, intentá de nuevo en un minuto.' },
        { status: 429 }
      );
    }
  }

  // Proteger Login de Operador
  if (request.nextUrl.pathname === '/login' && request.method === 'POST') {
    const permitido = await verificarRateLimit(ip, '/login', MAX_REQUESTS_LOGIN);
    if (!permitido) {
      return NextResponse.json(
        { error: 'Demasiados intentos de inicio de sesión. Esperá 1 minuto.' },
        { status: 429 }
      );
    }
  }

  // Proteger Login de Cliente B2B
  if (request.nextUrl.pathname === '/portal/login' && request.method === 'POST') {
    const permitido = await verificarRateLimit(ip, '/portal/login', MAX_REQUESTS_LOGIN);
    if (!permitido) {
      return NextResponse.json(
        { error: 'Demasiados intentos de inicio de sesión. Esperá 1 minuto.' },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/contacto', '/login', '/portal/login'],
};