-- ============================================================
-- 006_fase12_clientes_comision_intentos.sql
-- Fase 12: comision_pct + max_intentos en clientes B2B
-- Fecha: 2026-10-26
-- Idempotente
-- ============================================================

BEGIN;

ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS comision_pct NUMERIC(5,2) NOT NULL DEFAULT 3.00,
  ADD COLUMN IF NOT EXISTS max_intentos SMALLINT NOT NULL DEFAULT 2;

COMMIT;

-- ROLLBACK:
-- ALTER TABLE public.clientes
--   DROP COLUMN IF EXISTS comision_pct,
--   DROP COLUMN IF EXISTS max_intentos;