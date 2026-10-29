-- ============================================================
-- 011_fix_rate_limiting_supabase.sql
-- Rate Limiting persistente usando PostgreSQL
-- ============================================================

BEGIN;

-- Tabla para rastrear intentos por IP y ruta
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL,
  ruta TEXT NOT NULL,
  intentos INTEGER NOT NULL DEFAULT 1,
  ultimo_intento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(ip, ruta)
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_rate_limits_busqueda ON public.rate_limits(ip, ruta);

-- Habilitar RLS (pero permitir que el servidor lo use sin restricciones)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Política para que solo el service_role (backend) pueda gestionarlo
-- (El proxy usará el cliente con service_role, no la anon key)
CREATE POLICY "Solo backend gestiona rate limits" 
  ON public.rate_limits FOR ALL 
  USING (true) 
  WITH CHECK (true);

COMMIT;