'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function login(formData: FormData) {
  const supabase = await createClient();

  // Extraer IP real (Next.js pasa la IP en el header x-forwarded-for)
  const headers = await import('next/headers');
  const ip = (await headers.headers()).get('x-forwarded-for') || '127.0.0.1';

  // Verificar Rate Limit Atómico vía RPC
  const { data: permitido, error } = await supabase.rpc('check_rate_limit', {
    p_ip: ip,
    p_ruta: '/login',
    p_max_intentos: 5,
    p_window_minutes: 1
  });

  if (error || !permitido) {
    return { error: 'Demasiados intentos. Esperá 1 minuto.' };
  }

  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (authError) return { error: authError.message };

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function loginPortal(formData: FormData) {
  const supabase = await createClient();

  const headers = await import('next/headers');
  const ip = (await headers.headers()).get('x-forwarded-for') || '127.0.0.1';

  const { data: permitido, error } = await supabase.rpc('check_rate_limit', {
    p_ip: ip,
    p_ruta: '/portal/login',
    p_max_intentos: 5,
    p_window_minutes: 1
  });

  if (error || !permitido) {
    return { error: 'Demasiados intentos. Esperá 1 minuto.' };
  }

  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (authError) return { error: authError.message };

  revalidatePath('/', 'layout');
  redirect('/portal');
}

export async function register(formData: FormData) {
  const supabase = await createClient();
  const data = Object.fromEntries(formData);
  const parsed = authSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
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