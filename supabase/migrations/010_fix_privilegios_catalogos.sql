-- ============================================================
-- 010_fix_privilegios_catalogos.sql
-- Revocar permisos de escritura en tablas de catálogo
-- ============================================================

BEGIN;

-- 1. Revocar permisos de escritura a authenticated en catálogos
REVOKE INSERT, UPDATE, DELETE ON public.ciudades FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.departamentos FROM authenticated;

-- 2. Asegurar que solo tengan SELECT
GRANT SELECT ON public.ciudades TO authenticated;
GRANT SELECT ON public.departamentos TO authenticated;

COMMIT;