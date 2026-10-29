-- ============================================================
-- 009_fix_seguridad_auditoria.sql
-- Correcciones: Trigger admin y RLS de clientes
-- ============================================================

BEGIN;

-- H-01: Corregir Trigger para que no asigne 'admin' por defecto
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (id, email, rol)
  VALUES (new.id, new.email, 'repartidor'); -- Rol seguro por defecto
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- H-02: Eliminar políticas abiertas de la tabla clientes
DROP POLICY IF EXISTS "Autenticados leen clientes" ON public.clientes;
DROP POLICY IF EXISTS "Autenticados crean clientes" ON public.clientes;
DROP POLICY IF EXISTS "Autenticados actualizan clientes" ON public.clientes;

-- H-02: Crear políticas estrictas para clientes
-- Solo el operador (repartidor) puede gestionar la tabla completa
CREATE POLICY "Operador gestiona clientes" 
  ON public.clientes FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'repartidor'
    )
  );

-- El cliente B2B solo puede ver SU PROPIO registro (ya existía en 007, la mantenemos)
-- La política 'clientes_self_read' de la migración 007 se queda.

COMMIT;