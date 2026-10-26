# STATUS — ENC Logística

**Actualizado:** 2026-10-26

## Progreso

- [x] Fase 1: Inicialización del proyecto (blueprint web-app).
- [x] Fase 2: Base de datos en Supabase (tablas perfiles y paquetes con RLS).
- [x] Fase 3: Autenticación (Login, Registro, Logout) con Supabase Auth.
- [x] Fase 4: Configuración de SMTP con Gmail.
- [x] Fase 5: UI/UX con identidad de marca (Login, Registro, Home, Dashboard).
- [x] Fase 6: Lógica de negocio (Registro de paquetes, cambio de estado, botón de WhatsApp).
- [x] Fase 7: Despliegue en Vercel y configuración de dominio gratuito.
- [x] Fase 8: Integración de los 7 documentos operativos en docs/negocio/.
- [x] Fase 9: Estado Ausente, reintento de entrega y campos de retiro (C.I., observaciones, fecha_entrega).
- [x] Fase 10: Tarifa flete, cobrado, devuelto_a_remitente y tope de 2 intentos.
- [x] Fase 11: Multi-origen (departamentos, ciudades, clientes B2B, cascada en formulario).

## Próximos 3 pasos

1. **Fase 12:** Refactor crearPaquete para usar cliente_id (tabla clientes B2B) + UI para crear/editar clientes.
2. **Fase 13:** Reportes por cliente y facturación (PDF/Excel diario por cliente).
3. **Fase 14:** Portal B2B (login separado para clientes, ver sus paquetes).