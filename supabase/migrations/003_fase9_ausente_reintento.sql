-- ============================================================
-- 003_fase9_ausente_reintento.sql
-- Fase 9: Estado 'Ausente' + campos de entrega
-- Fecha: 2026-10-25
-- Idempotente: si se corre 2 veces, no rompe
-- ============================================================

BEGIN;

-- 1. Agregar columnas nuevas a paquetes
ALTER TABLE public.paquetes
  ADD COLUMN IF NOT EXISTS observaciones    TEXT,
  ADD COLUMN IF NOT EXISTS retirado_por     TEXT,
  ADD COLUMN IF NOT EXISTS retirado_por_ci  TEXT,
  ADD COLUMN IF NOT EXISTS intentos_entrega SMALLINT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS fecha_entrega    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS fecha_ausente    TIMESTAMPTZ;

-- 2. Actualizar CHECK de estado (drop + create)
DO $$
DECLARE
  c record;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.paquetes'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%estado%'
  LOOP
    EXECUTE format('ALTER TABLE public.paquetes DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE public.paquetes
  ADD CONSTRAINT paquetes_estado_check
  CHECK (estado IN ('En Ruta', 'Entregado', 'Ausente', 'Cancelado'));

-- 3. Índices para el dashboard
CREATE INDEX IF NOT EXISTS idx_paquetes_user_estado
  ON public.paquetes (user_id, estado);

COMMIT;

-- ROLLBACK (si es necesario):
-- ALTER TABLE public.paquetes
--   DROP COLUMN IF EXISTS observaciones,
--   DROP COLUMN IF EXISTS retirado_por,
--   DROP COLUMN IF EXISTS retirado_por_ci,
--   DROP COLUMN IF EXISTS intentos_entrega,
--   DROP COLUMN IF EXISTS fecha_entrega,
--   DROP COLUMN IF EXISTS fecha_ausente;