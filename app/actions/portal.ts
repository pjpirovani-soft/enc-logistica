'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type MiCliente = {
  id: string;
  nombre: string;
  ruc: string | null;
  email: string | null;
  telefono: string | null;
  tarifa_base: number;
  comision_pct: number;
  max_intentos: number;
};

export type MiPaquete = {
  id: string;
  nro_guia: string;
  destinatario: string;
  direccion: string;
  estado: string;
  tipo_servicio: string;
  monto_cobro: number;
  tarifa_flete: number;
  cobrado: boolean;
  fecha_entrega: string | null;
  fecha_ausente: string | null;
  created_at: string;
};

export async function obtenerMiCliente(): Promise<MiCliente | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('clientes')
    .select('id, nombre, ruc, email, telefono, tarifa_base, comision_pct, max_intentos')
    .eq('auth_user_id', user.id)
    .single();

  if (error || !data) return null;
  return data as MiCliente;
}

export async function obtenerMisPaquetes(): Promise<MiPaquete[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Primero obtener mi cliente
  const { data: cliente } = await supabase
    .from('clientes')
    .select('id')
    .eq('auth_user_id', user.id)
    .single();

  if (!cliente) return [];

  // Después mis paquetes (RLS también filtra, pero el WHERE explícito es más rápido)
  const { data, error } = await supabase
    .from('paquetes')
    .select('id, nro_guia, destinatario, direccion, estado, tipo_servicio, monto_cobro, tarifa_flete, cobrado, fecha_entrega, fecha_ausente, created_at')
    .eq('cliente_id', cliente.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener mis paquetes:', error);
    return [];
  }
  return (data ?? []) as MiPaquete[];
}

export async function vincularClienteAUsuario() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return { ok: false as const, error: 'No autenticado o sin email' };
  }

  // Buscar cliente con ese email y sin auth_user_id
  const { data: cliente, error: buscarError } = await supabase
    .from('clientes')
    .select('id, auth_user_id')
    .eq('email', user.email)
    .is('auth_user_id', null)
    .maybeSingle();

  if (buscarError) {
    return { ok: false as const, error: buscarError.message };
  }
  if (!cliente) {
    return { ok: false as const, error: 'No hay cliente pendiente con tu email' };
  }

  // Vincular
  const { error } = await supabase
    .from('clientes')
    .update({ auth_user_id: user.id })
    .eq('id', cliente.id);

  if (error) return { ok: false as const, error: error.message };

  revalidatePath('/portal');
  revalidatePath('/dashboard/clientes');
  return { ok: true as const, clienteId: cliente.id };
}