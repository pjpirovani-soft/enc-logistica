# STATUS — ENC Logística

**Actualizado:** 2026-10-25

## Progreso

- [x] Fase 1: Inicialización del proyecto (blueprint web-app).
- [x] Fase 2: Base de datos en Supabase (tablas perfiles y paquetes con RLS).
- [x] Fase 3: Autenticación (Login, Registro, Logout) con Supabase Auth.
- [x] Fase 4: Configuración de SMTP con Gmail.
- [x] Fase 5: UI/UX con identidad de marca (Login, Registro, Home, Dashboard).
- [x] Fase 6: Lógica de negocio (Registro de paquetes, cambio de estado, botón de WhatsApp).
- [x] Fase 7: Despliegue en Vercel y configuración de dominio gratuito.
- [x] Fase 8: Integración de los 7 documentos operativos en `docs/negocio/`.
- [x] Fase 9: Estado 'Ausente', reintento de entrega y campos de retiro (C.I., observaciones, fecha_entrega).

## Próximos 3 pasos

1. **Fase 10:** Agregar campos de planilla de control (tipo_servicio enum, celular, precio_cobro, tarifa_flete, cobrado, foto_enviada, comision_cobro).
2. **Protocolo de reintento:** Tope de 2 intentos + estado 'Devuelto a remitente' según `docs/negocio/03_Protocolo_Reintento.md`.
3. **Limpieza:** Borrar `app/dashboard/clientes/` y tabla `clientes` del blueprint original.