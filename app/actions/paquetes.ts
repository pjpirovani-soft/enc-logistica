'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// ============================================================
// Helpers
// ============================================================
async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');
  return { supabase, user };
}

// ============================================================
// 1. ENTREGAR (con quién retiró + C.I. + observaciones)
// ============================================================
const entregarSchema = z.object({
  paqueteId: z.string().uuid(),
  retiradoPor: z.string().trim().min(2, 'Nombre del retirador demasiado corto').max(120),
  retiradoPorCi: z.string().trim().min(5, 'C.I. inválida').max(20),
  observaciones: z.string().trim().max(500).optional().nullable(),
});

export type EntregarInput = z.infer<typeof entregarSchema>;

export async function marcarEntregado(input: EntregarInput) {
  const parsed = entregarSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
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
    })
    .eq('id', parsed.data.paqueteId)
    .eq('user_id', user.id);

  if (error) return { ok: false as const, error: error.message };

  revalidatePath('/dashboard');
  return { ok: true as const };
}

// ============================================================
// 2. MARCAR AUSENTE
// ============================================================
const ausenteSchema = z.object({
  paqueteId: z.string().uuid(),
  observaciones: z.string().trim().max(500).optional().nullable(),
});

export type AusenteInput = z.infer<typeof ausenteSchema>;

export async function marcarAusente(input: AusenteInput) {
  const parsed = ausenteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
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

// ============================================================
// 3. REINTENTAR ENTREGA (Ausente -> En Ruta, +1 intento)
// ============================================================
export async function reintentarEntrega(paqueteId: string) {
  if (!z.string().uuid().safeParse(paqueteId).success) {
    return { ok: false as const, error: 'ID inválido' };
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
  return { ok: true as const };
}