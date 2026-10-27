-- ============================================================
-- 007_fase14_portal_b2b.sql
-- Fase 14: Portal B2B (vincular auth.users con clientes)
-- Fecha: 2026-10-27
-- Idempotente
-- ============================================================

BEGIN;

-- 1. Agregar auth_user_id a clientes
ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Indice
CREATE INDEX IF NOT EXISTS idx_clientes_auth_user_id
  ON public.clientes(auth_user_id);

-- 3. RLS: cliente B2B ve SU PROPIO registro
DROP POLICY IF EXISTS "clientes_self_read" ON public.clientes;
CREATE POLICY "clientes_self_read"
  ON public.clientes FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

-- 4. RLS: cliente B2B ve SUS paquetes
DROP POLICY IF EXISTS "paquetes_cliente_read" ON public.paquetes;
CREATE POLICY "paquetes_cliente_read"
  ON public.paquetes FOR SELECT
  TO authenticated
  USING (
    cliente_id IN (
      SELECT id FROM public.clientes WHERE auth_user_id = auth.uid()
    )
  );

COMMIT;

-- ROLLBACK:
-- ALTER TABLE public.clientes DROP COLUMN IF EXISTS auth_user_id;
-- DROP POLICY IF EXISTS "clientes_self_read" ON public.clientes;
-- DROP POLICY IF EXISTS "paquetes_cliente_read" ON public.paquetes;