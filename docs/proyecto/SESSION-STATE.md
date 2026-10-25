# Session State — enc-logistica

**Actualizado:** 2026-10-25

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** Desarrollo / Operación.
- **Trabajando en:** Cierre de sesión y documentación.
- **Bloqueado por:** Nada.

## Open Loops (acciones sin verificar)

- [x] Deploy a Vercel confirmado (https://enc-logistica.vercel.app).
- [x] SMTP con Gmail confirmado.

## Follow-ups (tareas diferidas)

- [ ] Agregar el estado `'Ausente'` al SQL de la base de datos.
- [ ] Agregar el botón de "Cliente Ausente" en el Dashboard.
- [ ] Agregar campos de "Observaciones" y "Quién retiró" en la entrega.
- [ ] Limpiar los archivos sobrantes del blueprint (tabla `clientes`, rutas viejas).

## Decisiones de la sesión

- Se migró de Resend a Gmail SMTP por restricciones del plan gratuito de Resend (solo permitía enviar al correo dueño).
- Se estandarizaron los logos en `public/` para usar alas blancas (fondo oscuro) y azules (fondo claro).
- Los 7 documentos operativos se movieron a `docs/negocio/`.

## Próximos 3 pasos (para la próxima sesión)

1. Ejecutar el SQL para agregar el estado 'Ausente'.
2. Actualizar la interfaz del Dashboard con el botón de "Cliente Ausente".
3. Preparar el Kit de Ventas definitivo.