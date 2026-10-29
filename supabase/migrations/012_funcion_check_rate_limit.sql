-- ============================================================
-- 012_funcion_check_rate_limit.sql
-- Función atómica para Rate Limiting distribuido
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
  -- Intentar obtener el registro bloqueando la fila para evitar concurrencia
  SELECT * INTO v_registro FROM public.rate_limits 
  WHERE ip = p_ip AND ruta = p_ruta 
  FOR UPDATE;

  IF NOT FOUND THEN
    -- Si no existe, intentar insertar. Si hay conflicto concurrente, el UNIQUE lo frena.
    INSERT INTO public.rate_limits (ip, ruta, intentos, ultimo_intento) 
    VALUES (p_ip, p_ruta, 1, v_ahora)
    ON CONFLICT (ip, ruta) DO UPDATE 
    SET intentos = public.rate_limits.intentos + 1,
        ultimo_intento = v_ahora;
    RETURN QUERY SELECT TRUE;
    RETURN;
  END IF;

  IF v_registro.ultimo_intento < v_hace_un_minuto THEN
    UPDATE public.rate_limits SET intentos = 1, ultimo_intento = v_ahora WHERE id = v_registro.id;
    RETURN QUERY SELECT TRUE;
    RETURN;
  END IF;

  IF v_registro.intentos >= p_max_intentos THEN
    RETURN QUERY SELECT FALSE;
    RETURN;
  END IF;

  UPDATE public.rate_limits SET intentos = intentos + 1, ultimo_intento = v_ahora WHERE id = v_registro.id;
  RETURN QUERY SELECT TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;