# Session State — enc-logistica

**Actualizado:** 2026-10-28

> Este archivo es el handoff entre sesiones. Leerlo primero al arrancar. Actualizarlo al cerrar.

## Estado actual (30 segundos)

- **Fase:** Desarrollo / Operación.
- **Trabajando en:** Validación con clientes reales o Fase 14.7 (Google OAuth).
- **Bloqueado por:** Nada.

## Open Loops (acciones sin verificar)

- [x] Deploy a Vercel confirmado.
- [x] SMTP con Gmail confirmado.
- [x] Fases 9-18 verificadas en producción y localmente.
- [x] Portal B2B funcionando (login, dashboard, reportes, invitación, ayuda).
- [x] Ley 6534/2020 documentada y aplicada.
- [x] Formulario de contacto y links cruzados funcionando.
- [x] Fix RLS en departamentos y ciudades.
- [x] Tests E2E pasando (5 tests) + Rate Limiting activo.

## Follow-ups (tareas diferidas)

- [ ] Fase 14.7: Google OAuth en /portal/login y /portal/register.
- [ ] Fase 15: Facturación electrónica (SIFEN).
- [ ] Fase 19: Tracking público para destinatario.
- [ ] Multi-repartidor (campo paquetes.asignado_a).
- [ ] Mover app/actions/ a lib/actions/ según CONVENCIONES.md.
- [ ] Dominio propio (enclogistica.com.py).
- [ ] Activar RUC de Pedro (6628192-0) en DNIT.
- [ ] Crear E.I.R.L. o S.R.L. cuando el negocio escale.

## Decisiones de la sesión (Fase 18)

- **Tests E2E:** Implementados con Playwright. 5 tests de humo (Landing, Contacto, Redirecciones, Links Cruzados).
- **Seguridad:** Middleware de Rate Limiting en `/api/contacto` (máximo 3 peticiones por minuto por IP).
- **Mantenimiento:** Cada vez que se agregue una feature, se debe correr `npx playwright test` antes del commit.

## Próximos 3 pasos (para la próxima sesión)

1. Validar con 2-3 clientes reales (enviar PDF y usar el formulario de contacto).
2. Fase 14.7: Google OAuth (30 min).
3. Fase 19: Tracking público + email de notificación.