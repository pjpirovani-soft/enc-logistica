-- ============================================================
-- 004_fase10_tarifa_cobrado_devuelto.sql
-- Fase 10: tarifa_flete, cobrado, devuelto_a_remitente
-- Fecha: 2026-10-26
-- Idempotente
-- ============================================================

BEGIN;

-- 1. Agregar columnas
ALTER TABLE public.paquetes
  ADD COLUMN IF NOT EXISTS tarifa_flete NUMERIC(12,2) NOT NULL DEFAULT 22000,
  ADD COLUMN IF NOT EXISTS cobrado BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS devuelto_a_remitente BOOLEAN NOT NULL DEFAULT false;

-- 2. Actualizar CHECK de estado (agregar 'Devuelto')
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
  CHECK (estado IN ('En Ruta', 'Entregado', 'Ausente', 'Devuelto', 'Cancelado'));

COMMIT;

-- ROLLBACK:
-- ALTER TABLE public.paquetes
--   DROP COLUMN IF EXISTS tarifa_flete,
--   DROP COLUMN IF EXISTS cobrado,
--   DROP COLUMN IF EXISTS devuelto_a_remitente;