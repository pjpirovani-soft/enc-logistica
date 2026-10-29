-- ============================================================
-- 012_funcion_check_rate_limit.sql (VERSIÓN CORREGIDA)
-- ============================================================

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_ip TEXT,
  p_ruta TEXT,
  p_max_intentos INTEGER,
  p_window_minutes INTEGER
) RETURNS TABLE (permitido BOOLEAN) AS $$
DECLARE
  v_ahora TIMESTAMPTZ := NOW();
  v_hace_un_minuto TIMESTAMPTZ := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  v_registro RECORD;
BEGIN
  -- 1. Intentar bloquear la fila existente
  SELECT * INTO v_registro FROM public.rate_limits 
  WHERE ip = p_ip AND ruta = p_ruta 
  FOR UPDATE;

  -- 2. Si la fila NO existe, intentamos insertar
  IF NOT FOUND THEN
    -- Intentamos insertar. Si otro proceso insertó al mismo tiempo, el ON CONFLICT lo atrapa.
    INSERT INTO public.rate_limits (ip, ruta, intentos, ultimo_intento) 
    VALUES (p_ip, p_ruta, 1, v_ahora)
    ON CONFLICT (ip, ruta) DO NOTHING;

    -- Volvemos a buscar la fila (puede que la haya creado otro proceso o nosotros)
    SELECT * INTO v_registro FROM public.rate_limits 
    WHERE ip = p_ip AND ruta = p_ruta 
    FOR UPDATE;

    -- Si acabamos de crearla (intentos = 1), permitimos el intento.
    IF v_registro.intentos = 1 THEN
      RETURN QUERY SELECT TRUE;
      RETURN;
    END IF;
  END IF;

  -- 3. Si la ventana de tiempo expiró, reiniciar
  IF v_registro.ultimo_intento < v_hace_un_minuto THEN
    UPDATE public.rate_limits SET intentos = 1, ultimo_intento = v_ahora WHERE id = v_registro.id;
    RETURN QUERY SELECT TRUE;
    RETURN;
  END IF;

  -- 4. Si superó el límite, bloquear
  IF v_registro.intentos >= p_max_intentos THEN
    RETURN QUERY SELECT FALSE;
    RETURN;
  END IF;

  -- 5. Incrementar y permitir
  UPDATE public.rate_limits SET intentos = v_registro.intentos + 1, ultimo_intento = v_ahora WHERE id = v_registro.id;
  RETURN QUERY SELECT TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;