-- ============================================================
-- 008_fix_rls_departamentos_ciudades.sql
-- Fix: Políticas RLS para lectura de catálogos
-- Fecha: 2026-10-28
-- ============================================================

BEGIN;
ALTER TABLE public.departamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ciudades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura a autenticados" ON public.departamentos;
DROP POLICY IF EXISTS "Permitir lectura a autenticados" ON public.ciudades;

CREATE POLICY "Permitir lectura a autenticados" 
  ON public.departamentos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir lectura a autenticados" 
  ON public.ciudades FOR SELECT TO authenticated USING (true);
COMMIT;