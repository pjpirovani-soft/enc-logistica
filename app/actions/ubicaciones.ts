'use server';

import { createClient } from '@/lib/supabase/server';

export type Departamento = { id: number; nombre: string };
export type Ciudad = { id: number; nombre: string; departamento_id: number };

export async function obtenerDepartamentos(): Promise<Departamento[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('departamentos')
    .select('id, nombre')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error al obtener departamentos:', error);
    return [];
  }
  return data ?? [];
}

export async function obtenerCiudadesPorDepartamento(departamentoId: number): Promise<Ciudad[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ciudades')
    .select('id, nombre, departamento_id')
    .eq('departamento_id', departamentoId)
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al obtener ciudades:', error);
    return [];
  }
  return data ?? [];
}