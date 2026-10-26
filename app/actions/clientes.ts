'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type ClienteB2B = {
  id: string;
  nombre: string;
  ruc: string | null;
  telefono: string | null;
  email: string | null;
  departamento_id: number | null;
  ciudad_id: number | null;
  tarifa_base: number;
  comision_pct: number;
  max_intentos: number;
  activo: boolean;
  created_at: string;
};

const clienteSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(120),
  ruc: z.string().trim().max(20).optional().nullable(),
  telefono: z.string().trim().max(30).optional().nullable(),
  email: z.string().trim().email('Email invalido').optional().nullable().or(z.literal('')),
  departamento_id: z.coerce.number().int().min(1).optional().nullable(),
  ciudad_id: z.coerce.number().int().min(1).optional().nullable(),
  tarifa_base: z.coerce.number().min(0).default(22000),
  comision_pct: z.coerce.number().min(0).max(100).default(3),
  max_intentos: z.coerce.number().int().min(1).max(5).default(2),
});

export type ClienteInput = z.infer<typeof clienteSchema>;

export async function obtenerClientes(): Promise<ClienteB2B[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('activo', true)
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al obtener clientes:', error);
    return [];
  }
  return (data ?? []) as ClienteB2B[];
}

export async function crearCliente(input: ClienteInput) {
  const parsed = clienteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clientes')
    .insert([{
      nombre: parsed.data.nombre,
      ruc: parsed.data.ruc || null,
      telefono: parsed.data.telefono || null,
      email: parsed.data.email || null,
      departamento_id: parsed.data.departamento_id || null,
      ciudad_id: parsed.data.ciudad_id || null,
      tarifa_base: parsed.data.tarifa_base,
      comision_pct: parsed.data.comision_pct,
      max_intentos: parsed.data.max_intentos,
      activo: true,
    }])
    .select()
    .single();
  if (error) {
    console.error('Error al crear cliente:', error);
    return { ok: false as const, error: error.message };
  }
  revalidatePath('/dashboard/clientes');
  revalidatePath('/dashboard');
  return { ok: true as const, cliente: data };
}

export async function actualizarCliente(id: string, input: ClienteInput) {
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false as const, error: 'ID invalido' };
  }
  const parsed = clienteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Datos invalidos' };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from('clientes')
    .update({
      nombre: parsed.data.nombre,
      ruc: parsed.data.ruc || null,
      telefono: parsed.data.telefono || null,
      email: parsed.data.email || null,
      departamento_id: parsed.data.departamento_id || null,
      ciudad_id: parsed.data.ciudad_id || null,
      tarifa_base: parsed.data.tarifa_base,
      comision_pct: parsed.data.comision_pct,
      max_intentos: parsed.data.max_intentos,
    })
    .eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/dashboard/clientes');
  revalidatePath('/dashboard');
  return { ok: true as const };
}