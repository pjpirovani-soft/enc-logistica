import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const contactoSchema = z.object({
  nombre: z.string().min(2).max(100),
  email: z.string().email().max(100),
  telefono: z.string().max(20).optional(),
  mensaje: z.string().min(10).max(1000),
});

async function verificarRateLimit(ip: string): Promise<boolean> {
  const ahora = new Date();
  const haceUnMinuto = new Date(ahora.getTime() - 60000);

  const { data, error } = await supabaseAdmin
    .from('rate_limits')
    .select('id, intentos, ultimo_intento')
    .eq('ip', ip)
    .eq('ruta', '/api/contacto')
    .single();

  if (error && error.code !== 'PGRST116') return true; // Fail-open si hay error de DB

  if (!data) {
    await supabaseAdmin.from('rate_limits').insert([{ ip, ruta: '/api/contacto', intentos: 1 }]);
    return true;
  }

  if (new Date(data.ultimo_intento) < haceUnMinuto) {
    await supabaseAdmin.from('rate_limits').update({ intentos: 1, ultimo_intento: ahora.toISOString() }).eq('id', data.id);
    return true;
  }

  if (data.intentos >= 3) return false;

  await supabaseAdmin.from('rate_limits').update({ intentos: data.intentos + 1, ultimo_intento: ahora.toISOString() }).eq('id', data.id);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    
    // Verificar Rate Limit
    const permitido = await verificarRateLimit(ip);
    if (!permitido) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Intentá de nuevo en un minuto.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = contactoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // Simulamos el envío de correo (en el futuro se conecta con Nodemailer o Resend)
    console.log('📧 Nueva solicitud de contacto recibida (datos omitidos por seguridad)');
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}