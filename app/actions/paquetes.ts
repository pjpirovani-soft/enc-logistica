'use server'

import { createClient } from '@/lib/supabase/server';
import { paqueteSchema, PaqueteFormData } from '@/lib/schemas/paqueteSchema';
import { revalidatePath } from 'next/cache';

export async function crearPaquete(formData: PaqueteFormData) {
  const supabase = await createClient();

  // 1. Validar los datos con Zod
  const validacion = paqueteSchema.safeParse(formData);
  
  if (!validacion.success) {
    return { error: 'Datos inválidos', detalles: validacion.error.flatten() };
  }

  // 2. Obtener el usuario autenticado (para el RLS)
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'No autorizado. Debes iniciar sesión.' };
  }

  // 3. Insertar en la base de datos
  const { data, error } = await supabase
    .from('paquetes')
    .insert([
      {
        ...validacion.data,
        user_id: user.id,
        estado: 'En Ruta',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error al insertar paquete:', error);
    return { error: 'Error al guardar en la base de datos' };
  }

  // 4. Revalidar la ruta para que la lista se actualice
  revalidatePath('/dashboard');
  
  return { success: true, paquete: data };
}
export async function marcarEntregado(id: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

  const { error } = await supabase
    .from('paquetes')
    .update({ estado: 'Entregado' })
    .eq('id', id)
    .eq('user_id', user.id); // Seguridad extra

  if (error) {
    console.error(error);
    return { error: 'Error al actualizar el paquete' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}
