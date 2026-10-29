'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// ============================================================
// RATE LIMITING (H-04)
// ============================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createAdminClient(supabaseUrl, supabaseKey);

async function verificarRateLimit(ruta: string, maxIntentos: number): Promise<{ ok: boolean, error?: string }> {
  // Como no tenemos acceso directo a la IP en Server Actions, usamos un identificador fijo
  // o podemos usar el header 'x-forwarded-for' si el proxy lo pasa.
  // Para este MVP, usamos un identificador genérico para bloquear ataques masivos.
  const ip = 'server-action'; 
  const ahora = new Date();
  const haceUnMinuto = new Date(ahora.getTime() - 60000);

  const { data, error } = await supabaseAdmin
    .from('rate_limits')
    .select('id, intentos, ultimo_intento')
    .eq('ip', ip)
    .eq('ruta', ruta)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.warn('Error en Rate Limit (login):', error);
    return { ok: true }; // Fail-open si falla la DB
  }

  if (!data) {
    await supabaseAdmin.from('rate_limits').insert([{ ip, ruta, intentos: 1 }]);
    return { ok: true };
  }

  if (new Date(data.ultimo_intento) < haceUnMinuto) {
    await supabaseAdmin.from('rate_limits').update({ intentos: 1, ultimo_intento: ahora.toISOString() }).eq('id', data.id);
    return { ok: true };
  }

  if (data.intentos >= maxIntentos) {
    return { ok: false, error: 'Demasiados intentos de inicio de sesión. Esperá 1 minuto.' };
  }

  await supabaseAdmin.from('rate_limits').update({ intentos: data.intentos + 1, ultimo_intento: ahora.toISOString() }).eq('id', data.id);
  return { ok: true };
}

// ============================================================
// LOGIN OPERADOR
// ============================================================
export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Verificar Rate Limiting
  const rateLimit = await verificarRateLimit('/login', 5);
  if (!rateLimit.ok) {
    return { error: rateLimit.error };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { error: error.message };

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

// ============================================================
// LOGIN CLIENTE B2B
// ============================================================
export async function loginPortal(formData: FormData) {
  const supabase = await createClient();

  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Verificar Rate Limiting
  const rateLimit = await verificarRateLimit('/portal/login', 5);
  if (!rateLimit.ok) {
    return { error: rateLimit.error };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { error: error.message };

  revalidatePath('/', 'layout');
  redirect('/portal');
}

// ============================================================
// REGISTRO Y LOGOUT (SIN CAMBIOS)
// ============================================================
export async function register(formData: FormData) {
  const supabase = await createClient();

  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { error: error.message };

  return { success: 'Revisá tu email para confirmar la cuenta (si está habilitado).' };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function logoutPortal() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/portal/login');
}