'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { paqueteSchema, type PaqueteFormData } from '@/lib/schemas/paqueteSchema';

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');
  return { supabase, user };
}

export async function crearPaquete(formData: PaqueteFormData) {
  const supabase = await createClient();
  const validacion = paqueteSchema.safeParse(formData);
  if (!validacion.success) {
    return { error: 'Datos invalidos', detalles: validacion.error.flatten() };
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado. Debes iniciar sesion.' };
  const { data, error } = await supabase
    .from('paquetes')
    .insert([{ ...validacion.data, user_id: user.id, estado: 'En Ruta' }])
    .select()
    .single();
  if (error) {
    console.error('Error al insertar paquete:', error);
    return { error: 'Error al guardar en la base de datos' };
  }
  revalidatePath('/dashboard');
  return { success: true, paquete: data };
}

const entregarSchema = z.object({
  paqueteId: z.string().uuid(),
  retiradoPor: z.string().trim().min(2).max(120),
  retiradoPorCi: z.string().trim().min(5).max(20),
  observaciones: z.string().trim().max(500).optional().nullable(),
  cobrado: z.boolean().default(false),
});

export type EntregarInput = z.infer<typeof entregarSchema>;

export async function marcarEntregado(input: EntregarInput) {
  const parsed = entregarSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };
  }
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from('paquetes')
    .update({
      estado: 'Entregado',
      retirado_por: parsed.data.retiradoPor,
      retirado_por_ci: parsed.data.retiradoPorCi,
      observaciones: parsed.data.observaciones ?? null,
      fecha_entrega: new Date().toISOString(),
      cobrado: parsed.data.cobrado,
    })
    .eq('id', parsed.data.paqueteId)
    .eq('user_id', user.id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/dashboard');
  return { ok: true as const };
}

const ausenteSchema = z.object({
  paqueteId: z.string().uuid(),
  observaciones: z.string().trim().max(500).optional().nullable(),
});

export type AusenteInput = z.infer<typeof ausenteSchema>;

export async function marcarAusente(input: AusenteInput) {
  const parsed = ausenteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };
  }
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from('paquetes')
    .update({
      estado: 'Ausente',
      fecha_ausente: new Date().toISOString(),
      observaciones: parsed.data.observaciones ?? null,
    })
    .eq('id', parsed.data.paqueteId)
    .eq('user_id', user.id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/dashboard');
  return { ok: true as const };
}

export async function reintentarEntrega(paqueteId: string) {
  if (!z.string().uuid().safeParse(paqueteId).success) {
    return { ok: false as const, error: 'ID invalido' };
  }
  const { supabase, user } = await requireUser();
  const { data: pkg, error: fetchErr } = await supabase
    .from('paquetes')
    .select('intentos_entrega, estado')
    .eq('id', paqueteId)
    .eq('user_id', user.id)
    .single();
  if (fetchErr || !pkg) return { ok: false as const, error: 'Paquete no encontrado' };
  if (pkg.estado !== 'Ausente') {
    return { ok: false as const, error: 'Solo se pueden reintentar paquetes ausentes' };
  }

  // Tope de 2 intentos: si ya fallo 2 veces, se devuelve
  if ((pkg.intentos_entrega ?? 1) >= 2) {
    const { error } = await supabase
      .from('paquetes')
      .update({
        estado: 'Devuelto',
        devuelto_a_remitente: true,
        fecha_ausente: null,
      })
      .eq('id', paqueteId)
      .eq('user_id', user.id);
    if (error) return { ok: false as const, error: error.message };
    revalidatePath('/dashboard');
    return { ok: true as const, devuelto: true };
  }

  const { error } = await supabase
    .from('paquetes')
    .update({
      estado: 'En Ruta',
      fecha_ausente: null,
      intentos_entrega: (pkg.intentos_entrega ?? 1) + 1,
    })
    .eq('id', paqueteId)
    .eq('user_id', user.id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/dashboard');
  return { ok: true as const, devuelto: false };
}