-- ============================================================
-- 005_fase11_multi_origen.sql
-- Fase 11: Multi-origen (departamentos, ciudades, clientes)
-- Fecha: 2026-10-26
-- Idempotente
-- ============================================================

BEGIN;

-- 1. Tabla departamentos
CREATE TABLE IF NOT EXISTS public.departamentos (
  id SMALLINT PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE
);

INSERT INTO public.departamentos (id, nombre) VALUES
  (1, 'Asunción'), (2, 'Concepción'), (3, 'San Pedro'), (4, 'Cordillera'),
  (5, 'Guairá'), (6, 'Caaguazú'), (7, 'Caazapá'), (8, 'Itapúa'),
  (9, 'Misiones'), (10, 'Paraguarí'), (11, 'Alto Paraná'), (12, 'Central'),
  (13, 'Ñeembucú'), (14, 'Amambay'), (15, 'Canindeyú'), (16, 'Presidente Hayes'),
  (17, 'Boquerón'), (18, 'Alto Paraguay')
ON CONFLICT (id) DO NOTHING;

-- 2. Tabla ciudades
CREATE TABLE IF NOT EXISTS public.ciudades (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  departamento_id SMALLINT NOT NULL REFERENCES public.departamentos(id),
  UNIQUE(nombre, departamento_id)
);

INSERT INTO public.ciudades (nombre, departamento_id) VALUES
  ('Asunción', 1),
  ('Concepción', 2), ('Horqueta', 2), ('Yby Yaú', 2), ('Belén', 2),
  ('San Pedro de Ycuamandiyú', 3), ('Santa Rosa del Aguaray', 3), ('San Estanislao', 3), ('Lima', 3), ('Choré', 3),
  ('Caacupé', 4), ('Tobatí', 4), ('Itacurubí de la Cordillera', 4), ('Piribebuy', 4), ('Emboscada', 4),
  ('Villarrica', 5), ('Independencia', 5), ('Colonia Mauricio José Troche', 5), ('Natalicio Talavera', 5),
  ('Coronel Oviedo', 6), ('Caaguazú', 6), ('Doctor Juan Manuel Frutos', 6), ('Repatriación', 6), ('Yhú', 6),
  ('Caazapá', 7), ('San Juan Nepomuceno', 7), ('Yuty', 7), ('Tavaí', 7),
  ('Encarnación', 8), ('Cambyretá', 8), ('Capitán Miranda', 8), ('San Juan del Paraná', 8), ('Hohenau', 8), ('Obligado', 8), ('Bella Vista', 8), ('Trinidad', 8), ('Fram', 8),
  ('San Juan Bautista', 9), ('San Ignacio', 9), ('Santa Rosa', 9), ('Ayolas', 9), ('Santiago', 9),
  ('Paraguarí', 10), ('Carapeguá', 10), ('Yaguarón', 10), ('Quiindy', 10), ('La Colmena', 10),
  ('Ciudad del Este', 11), ('Presidente Franco', 11), ('Hernandarias', 11), ('Minga Guazú', 11), ('Santa Rita', 11), ('Naranjal', 11),
  ('Areguá', 12), ('Luque', 12), ('San Lorenzo', 12), ('Capiatá', 12), ('Itauguá', 12), ('Fernando de la Mora', 12), ('Lambaré', 12), ('Ñemby', 12), ('Mariano Roque Alonso', 12), ('Villa Elisa', 12), ('San Antonio', 12), ('Ypané', 12),
  ('Pilar', 13), ('Alberdi', 13), ('General Díaz', 13), ('Villa Franca', 13),
  ('Pedro Juan Caballero', 14), ('Bella Vista', 14), ('Capitán Bado', 14),
  ('Salto del Guairá', 15), ('Curuguaty', 15), ('Villa Ygatimí', 15), ('Ypejhú', 15), ('La Paloma', 15),
  ('Villa Hayes', 16), ('Benjamín Aceval', 16), ('Pozo Colorado', 16), ('Puerto Pinasco', 16),
  ('Filadelfia', 17), ('Loma Plata', 17), ('Mariscal Estigarribia', 17),
  ('Fuerte Olimpo', 18), ('Bahía Negra', 18), ('Carmelo Peralta', 18), ('Puerto Casado', 18)
ON CONFLICT (nombre, departamento_id) DO NOTHING;

-- 3. Tabla clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  ruc TEXT,
  telefono TEXT,
  email TEXT,
  departamento_id SMALLINT REFERENCES public.departamentos(id),
  ciudad_id INTEGER REFERENCES public.ciudades(id),
  tarifa_base NUMERIC(12,2) NOT NULL DEFAULT 22000,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Refactor paquetes: agregar origen + cliente_id
ALTER TABLE public.paquetes
  ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS departamento_origen SMALLINT REFERENCES public.departamentos(id),
  ADD COLUMN IF NOT EXISTS ciudad_origen INTEGER REFERENCES public.ciudades(id);

-- 5. Backfill: paquetes existentes quedan como Asunción
UPDATE public.paquetes
SET departamento_origen = 1,
    ciudad_origen = (SELECT id FROM public.ciudades WHERE nombre = 'Asunción' AND departamento_id = 1 LIMIT 1)
WHERE departamento_origen IS NULL;

-- 6. Índices
CREATE INDEX IF NOT EXISTS idx_ciudades_departamento ON public.ciudades(departamento_id);
CREATE INDEX IF NOT EXISTS idx_clientes_activo ON public.clientes(activo);
CREATE INDEX IF NOT EXISTS idx_paquetes_departamento_origen ON public.paquetes(departamento_origen);
CREATE INDEX IF NOT EXISTS idx_paquetes_ciudad_origen ON public.paquetes(ciudad_origen);
CREATE INDEX IF NOT EXISTS idx_paquetes_cliente ON public.paquetes(cliente_id);

-- 7. RLS en clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados leen clientes" ON public.clientes;
DROP POLICY IF EXISTS "Autenticados crean clientes" ON public.clientes;
DROP POLICY IF EXISTS "Autenticados actualizan clientes" ON public.clientes;

CREATE POLICY "Autenticados leen clientes" ON public.clientes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados crean clientes" ON public.clientes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Autenticados actualizan clientes" ON public.clientes FOR UPDATE TO authenticated USING (true);

COMMIT;